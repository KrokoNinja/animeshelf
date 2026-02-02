"use client"
import StatusBadge from "@/components/StatusBadge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getAnimeByText, getEpisodes } from "@/lib/apiHelpers"
import { Anime, Episode } from "@/lib/type"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useState, useMemo } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Heart, Play, Plus, Star, User, ChevronDown, Info } from "lucide-react"

export default function AnimePage() {

  const params = useParams<{ slug: string }>()
  const slug = params.slug[0]

  const [selectedSeason, setSelectedSeason] = useState<number>(1)

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

  return <div className="min-h-screen">
    {/* Hero Section with Cover Image */}
    <div className="relative h-80 md:h-96 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${anime.coverImage.link})`,
        }}
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
    </div>
    <div className="-mt-32 z-10 p-4 relative container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Image and Actions */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 max-w-80 max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent pr-2">
            {/* Image */}
            <div className="rounded-md overflow-hidden">
              <Image src={anime.image.link} alt={anime.title} width={anime.image.width ?? 350} height={anime.image.height ?? 450} />
            </div>
            {/* Actions */}
            <div className="flex flex-col gap-2 mt-4">
              <Button variant="default" className="w-full">
                <Play className="w-4 h-4" />
                <p className="text-sm">Add watched episodes</p>
              </Button>
              <Button variant="secondary" className="w-full">
                <Plus className="w-4 h-4" />
                <p className="text-sm">Add to List</p>
              </Button>
            </div>
            {/* Community Stats */}
            <div className="mt-4 bg-secondary/50 rounded-md p-4 flex flex-col gap-3">
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row gap-2 items-center">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium">Score</span>
                </div>
                <p className="text-sm">{anime.rating} / 5.0</p>
              </div>
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row gap-2 items-center">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">Users</span>
                </div>
                <p className="text-sm">{anime.userCount.toLocaleString()}</p>
              </div>
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row gap-2 items-center">
                  <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                  <span className="text-sm font-medium">Favorites</span>
                </div>
                <p className="text-sm">{anime.favoritesCount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="flex flex-col gap-2 text-white">
            <div className="flex flex-row gap-2 items-center flex-wrap">
              <h1 className="text-4xl font-bold">{anime.title}</h1>
              {/* Alternative Titles Tooltip */}
              {anime.abbreviatedTitles && anime.abbreviatedTitles.length > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-[300px] whitespace-normal">
                        <span className="font-semibold block mb-1">Also known as:</span>
                        {anime.abbreviatedTitles.join(', ')}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <h2 className="text-xl font-light">{anime.japaneseTitle}</h2>



            <div className="flex flex-row gap-2 min-h-6 flex-wrap">
              {anime.genre.map((genre) => (
                <Badge key={genre.id} className="bg-white text-black hover:bg-white hover:text-black min-w-fit h-fit">{genre.name}</Badge>
              ))}
            </div>
          </div>

          {/* Synopsis/Description */}
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white mb-2">Synopsis</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{anime.synopsis || anime.description}</p>
          </div>

          <div className="flex flex-row gap-4">
            {/* Info Stats Box */}
            <div className="mt-4 bg-secondary/50 rounded-md p-4 space-y-3 w-full">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Type</p>
                <p className="text-sm font-medium capitalize">{anime.subtype}</p>
              </div>
              {anime.totalEpisodes && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Episodes</p>
                  <p className="text-sm font-medium">{anime.totalEpisodes}</p>
                </div>
              )}
              {anime.episodeLength && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Episode Length</p>
                  <p className="text-sm font-medium">{anime.episodeLength} min</p>
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <StatusBadge status={anime.status} />
              </div>
              {anime.startDate && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Aired</p>
                  <p className="text-sm font-medium">
                    {new Date(anime.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    {anime.endDate && ` - ${new Date(anime.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`}
                    {!anime.endDate && anime.status === 'current' && ' - ?'}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Age Rating</p>
                <p className="text-sm font-medium">{anime.ageRating}</p>
                {anime.ageRatingGuide && (
                  <p className="text-xs text-muted-foreground mt-1">{anime.ageRatingGuide}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Popularity Rank</p>
                <p className="text-sm font-medium">#{anime.popularityRank.toLocaleString()}</p>
              </div>
              {anime.ratingRank && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Rating Rank</p>
                  <p className="text-sm font-medium">#{anime.ratingRank.toLocaleString()}</p>
                </div>
              )}
            </div>
            {/* YouTube Trailer */}
            {anime.youtubeVideoId && (
              <div className="mt-6 w-full">
                <h3 className="text-2xl font-bold text-white mb-3">Trailer</h3>
                <div className="aspect-video w-full max-w-2xl rounded-md overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${anime.youtubeVideoId}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>
          {/* Episodes Section */}
          {episodes.length > 0 && (
            <div className="mt-12 pb-8">
              <div className="flex flex-row items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">Episodes</h3>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      {`Season ${selectedSeason}`}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {seasons.map((season) => (
                      <DropdownMenuItem
                        key={season}
                        onClick={() => setSelectedSeason(season)}
                      >
                        Season {season}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {episodesPending ? (
                <p className="text-gray-400">Loading episodes...</p>
              ) : (
                <div className="relative">
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                    {filteredEpisodes.map((episode) => (
                      <div
                        key={episode.id}
                        className="flex-shrink-0 w-80 bg-secondary/50 rounded-md overflow-hidden hover:bg-secondary/70 transition-colors cursor-pointer group"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-full h-44 bg-gray-800">
                          <Image
                            src={episode.thumbnail}
                            alt={episode.title}
                            fill
                            className="object-cover"
                            sizes="320px"
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>

                        {/* Info */}
                        <div className="p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-xs">
                              Episode {episode.episodeNumber}
                            </Badge>
                            {episode.seasonNumber > 0 && (
                              <span className="text-xs text-muted-foreground">
                                S{episode.seasonNumber}
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-medium text-white line-clamp-2 mb-1">
                            {episode.title}
                          </h4>
                          {episode.airdate && (
                            <p className="text-xs text-muted-foreground">
                              {new Date(episode.airdate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
}