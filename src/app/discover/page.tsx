"use client"

import AnimeCard from "@/components/animeCard"
import { getAnime } from "@/lib/apiHelpers"
import { Anime } from "@/lib/type"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import AnimePagination from "@/components/AnimePagination"

export default function DiscoverPage() {
  const [page, setPage] = useState(1)
  const [animePerPage] = useState(16)
  const [totalCount, setTotalCount] = useState(0)
  const totalPages = Math.ceil(totalCount / animePerPage)

  const { data: animeList, isPending, error } = useQuery<{ data: Anime[], totalCount: number }>({
    queryKey: ["animeList", page],
    queryFn: async () => {
      const animeList = await getAnime(animePerPage, page)
      setTotalCount(animeList.totalCount)
      return animeList
    },
  })

  return (
    <div className="container mx-auto px-4 py-6">
      <h1>Discover</h1>
      {isPending && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {animeList && animeList.data.length > 0 && (
        <>
          <AnimePagination page={page} totalPages={totalPages} setPage={setPage} className="mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {animeList.data.map((anime) => (
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