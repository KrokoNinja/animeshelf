"use client"

import AnimeCard from "@/components/animeCard"
import { catalogQueries } from "@/lib/catalog/queries"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import AnimePagination from "@/components/AnimePagination"

export default function DiscoverPage() {
  const [page, setPage] = useState(1)
  const [animePerPage] = useState(16)

  const { data: animePage, isPending, error } = useQuery(catalogQueries.page(page, animePerPage))
  const totalCount = animePage?.totalCount ?? 0
  const totalPages = Math.ceil(totalCount / animePerPage)

  return (
    <div className="container mx-auto px-4 py-6">
      <h1>Discover</h1>
      {isPending && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {animePage && animePage.items.length > 0 && (
        <>
          <AnimePagination page={page} totalPages={totalPages} setPage={setPage} className="mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {animePage.items.map((anime) => (
              <div key={anime.id}>
                <AnimeCard anime={anime} />
              </div>
            ))}
          </div>
          <AnimePagination page={page} totalPages={totalPages} setPage={setPage} />
        </>
      )}
    </div>
  )
}