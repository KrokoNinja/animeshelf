import Link from "next/link";
import SearchBar from "./SearchBar";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Switch } from "./ui/switch";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <h1 className="text-2xl font-bold text-black">AnimeShelf</h1>
            </Link>
            <SearchBar />
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="secondary" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Anime
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>YU</AvatarFallback>
            </Avatar>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}