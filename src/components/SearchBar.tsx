"use client"
import { Search } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SearchBar() {

  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.push(`/search?query=${searchQuery}`)
  }

  return <div className="relative max-w-md">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
    <form onSubmit={handleSearch}>
      <Input
        placeholder="Search anime..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={cn(buttonVariants({ variant: "secondary" }), "pl-10 w-80")}
      />
      <Button type="submit" className="hidden">Search</Button>
    </form>
  </div>
}