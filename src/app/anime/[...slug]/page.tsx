"use client"
import { getAnimeByText } from "@/lib/apiHelpers"
import { Anime } from "@/lib/type"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"

export default function AnimePage() {

  const params = useParams<{ slug: string }>()
  const slug = params.slug[0]

  const { data: anime, isPending, error } = useQuery<Anime | null>({
    queryKey: ["anime", slug],
    queryFn: async () => {
      const anime = await getAnimeByText(slug)
      return anime.find((anime) => anime.slug === slug) || null
    },
  })

  if (isPending) return <div>Loading...</div>
  if (error) return <div>Error: {error?.message}</div>
  if (!anime) return <div>Anime not found</div>

  return <div>
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
    <h1>{anime.title}</h1>
  </div>
}