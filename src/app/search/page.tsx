import AnimeCard from "@/components/animeCard"
import { getAnimeByName } from "@/lib/apiHelpers"

export default async function SearchPage({ searchParams }: { searchParams: { query: string } }) {
  const anime = await getAnimeByName(searchParams.query)
  return <div className="container mx-auto px-4 py-6">
    <h1 className="text-2xl font-bold mb-6">Search Results for "{searchParams.query}"</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {anime.map((anime) => <AnimeCard anime={anime} key={anime.id} />)}
    </div>
  </div>
}