import { cn } from "@/lib/utils";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";
import { buttonVariants } from "./ui/button";

interface AnimePaginationProps {
  page: number
  totalPages: number
  setPage: (page: number) => void
  className?: string
}

export default function AnimePagination({ page, totalPages, setPage, className }: AnimePaginationProps) {
  return <Pagination className={cn("mt-6", className)}>
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
      <PaginationLink className={cn(buttonVariants({variant: "secondary"}))} href={`/discover?page=${page}`} onClick={() => setPage(page)}>{page}</PaginationLink>
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
}