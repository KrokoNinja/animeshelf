"use client"

import AnimeCard from "@/components/animeCard"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { getAnime } from "@/lib/apiHelpers"
import { Anime } from "@/lib/type"
import { useEffect, useState } from "react"

export default function DiscoverPage() {
  const [animeList, setAnimeList] = useState<Anime[]>([])
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [animePerPage, setAnimePerPage] = useState(16)
  const [totalCount, setTotalCount] = useState(0)
  const totalPages = Math.ceil(totalCount / animePerPage)

  useEffect(() => {
    const fetchAnime = async () => {
      setAnimeList([])
      setIsLoading(true)
      try {
        const animeList = await getAnime(animePerPage, page)
        setAnimeList(animeList.data)
        setTotalCount(animeList.totalCount)
      } catch (error) {
        setError(error as string)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAnime()
  }, [page])

  return (
    <div className="container mx-auto px-4 py-6">
      <h1>Discover</h1>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {animeList.map((anime) => (
          <div key={anime.id}>
            <AnimeCard anime={anime} />
          </div>
        ))}
      </div>
      {animeList.length > 0 && (
      <Pagination className="mt-6">
        <PaginationContent>
          {page > 1 && (
            <>
              <PaginationItem>
                <PaginationPrevious href={`/discover?page=${page - 1}`} onClick={() => setPage(page - 1)} />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href={`/discover`} onClick={() => setPage(1)}>1</PaginationLink>
              </PaginationItem>
            </>
          )}
          <PaginationItem>
            <PaginationLink href={`/discover?page=${page}`} onClick={() => setPage(page)}>{page}</PaginationLink>
          </PaginationItem>
          {page < totalPages && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href={`/discover?page=${totalPages}`} onClick={() => setPage(totalPages)}>{totalPages}</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href={`/discover?page=${page + 1}`} onClick={() => setPage(page + 1)} />
              </PaginationItem>
            </>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}