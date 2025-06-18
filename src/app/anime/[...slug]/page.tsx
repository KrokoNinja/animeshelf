"use client"
import StatusBadge from "@/components/StatusBadge"
import { Badge } from "@/components/ui/badge"
import { getAnimeByText } from "@/lib/apiHelpers"
import { Anime } from "@/lib/type"
import { useQuery } from "@tanstack/react-query"
import { Star } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"

export default function AnimePage() {

  const params = useParams<{ slug: string }>()
  const slug = params.slug[0]

  const { data: anime, isPending, error } = useQuery<Anime | null>({
    queryKey: ["anime", slug],
    queryFn: async () => {
      const anime = await getAnimeByText(slug, -1)
      return anime.find((anime) => anime.slug === slug) || null
    },
  })

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
    <div className="-mt-36 z-10 p-4 relative container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Image and Actions */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="max-w-80 rounded-md overflow-hidden">
              <Image src={anime.image.link} alt={anime.title} width={anime.image.width} height={anime.image.height} />
            </div>
          </div>
        </div>
        {/* Title, Status, Japanese Title, Genres */}
        <div className="lg:col-span-3">
          <div className="flex flex-col gap-2 text-white">
            <div className="flex flex-row gap-2 items-center">
              <h1 className="text-4xl font-bold">{anime.title}</h1>
              <StatusBadge status={anime.status} />
            </div>
            <h2 className="text-xl font-light">{anime.japaneseTitle}</h2>
            <div className="flex flex-row gap-2">
              {anime.genre.map((genre) => (
                <Badge key={genre.id} className="bg-white text-black hover:bg-white hover:text-black min-w-fit h-fit">{genre.name}</Badge>
              ))}
            </div>
          </div>
          {/* Main Content */}
          <div className="flex flex-col gap-2 mt-8">
            <div className="flex flex-row gap-1 items-center">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <p className="text-sm text-gray-400">{anime.rating} / 5</p>
            </div>

            <p className="text-sm text-gray-400 max-w-xl">{anime.description}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
}