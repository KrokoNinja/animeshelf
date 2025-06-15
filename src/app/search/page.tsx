"use client"
import AnimeCard from "@/components/animeCard"
import { getAnimeByText } from "@/lib/apiHelpers"
import { Anime } from "@/lib/type"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("query")

  const { data: anime, isPending, error } = useQuery<Anime[]>({
    queryKey: ["anime", query],
    queryFn: async () => {
      const anime = await getAnimeByText(query || "")
      return anime
    },
  })

  if (isPending) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!anime) return <div>Anime not found</div>

  return <div className="container mx-auto px-4 py-6">
    <h1 className="text-2xl font-bold mb-6">Search Results for &quot;{query}&quot;</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {anime.map((anime) => <AnimeCard anime={anime} key={anime.id} />)}
    </div>
  </div>
}