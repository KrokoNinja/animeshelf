"use client"
import { getAnimeByText, getEpisodes } from "@/lib/apiHelpers"
import { Anime, Episode } from "@/lib/type"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { useState, useMemo } from "react"
import AnimeDetailHero from "@/components/anime-detail-hero"
import AnimeDetailContentGrid from "@/components/anime-detail-content-grid"

export default function AnimePage() {

  const params = useParams<{ slug: string }>()
  const slug = params.slug[0]

  const [selectedSeason, setSelectedSeason] = useState<number>(1)
  const [watchedEpisodes, setWatchedEpisodes] = useState<string[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data: anime, isPending, error } = useQuery<Anime | null>({
    queryKey: ["anime", slug],
    queryFn: async () => {
      const anime = await getAnimeByText(slug, -1)
      return anime.find((anime) => anime.slug === slug) || null
    },
  })

  const { data: episodes = [], isPending: episodesPending } = useQuery<Episode[]>({
    queryKey: ["episodes", anime?.id],
    queryFn: async () => {
      if (!anime?.id) return []
      return await getEpisodes(anime.id)
    },
    enabled: !!anime?.id,
  })

  // Get unique seasons
  const seasons = useMemo(() => {
    const uniqueSeasons = [...new Set(episodes.map(ep => ep.seasonNumber))].sort((a, b) => a - b)
    return uniqueSeasons
  }, [episodes])

  // Filter episodes by selected season
  const filteredEpisodes = useMemo(() => {
    return episodes.filter(ep => ep.seasonNumber === selectedSeason)
  }, [episodes, selectedSeason])

  if (isPending) return <div>Loading...</div>
  if (error) return <div>Error: {error?.message}</div>
  if (!anime) return <div>Anime not found</div>

  return (
    <div className="min-h-screen">
      <AnimeDetailHero anime={anime} />
      <div className="-mt-32 z-10 p-4 relative container mx-auto">
        <AnimeDetailContentGrid
          anime={anime}
          seasons={seasons}
          selectedSeason={selectedSeason}
          setSelectedSeason={setSelectedSeason}
          episodes={episodes}
          episodesPending={episodesPending}
          filteredEpisodes={filteredEpisodes}
          watchedEpisodes={watchedEpisodes}
          onWatchedEpisodesChange={setWatchedEpisodes}
          isDialogOpen={isDialogOpen}
          onDialogOpenChange={setIsDialogOpen}
        />
      </div>
    </div>
  )
}