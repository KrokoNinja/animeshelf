"use client"
import AnimeCard from "@/components/animeCard"
import { catalogQueries } from "@/lib/catalog/queries"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function SearchContent() {
  const searchParams = useSearchParams()
  const searchText = (searchParams.get("query") ?? "").trim()

  const { data: animeList, isPending, error } = useQuery(catalogQueries.search(searchText))

  if (isPending) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!animeList) return <div>Anime not found</div>

  return <div className="container mx-auto px-4 py-6">
    <h1 className="text-2xl font-bold mb-6">Search Results for &quot;{searchText}&quot;</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {animeList.map((anime) => <AnimeCard anime={anime} key={anime.id} />)}
    </div>
  </div>
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}