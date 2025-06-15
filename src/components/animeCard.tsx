import Image from "next/image";
import { Badge } from "./ui/badge";
import { Star } from "lucide-react";
import { Anime } from "@/lib/type";
import Link from "next/link";

export default function AnimeCard({ anime }: { anime: Anime }) {
  return (
    <div key={anime.id} className="space-y-3">
      <Link href={`/anime/${anime.slug}`}>
        <div className="relative">
          <Image
            src={anime.image.link}
            alt={anime.title}
            width={anime.image.width}
            height={anime.image.height}
            className="rounded-lg object-cover w-full aspect-[3/4]"
          />
          {
            anime.genre.length > 0 && (
              <Badge className="absolute top-2 right-2" variant="secondary">
                {anime.genre[0].name}
              </Badge>
            )
          }
        </div>
        <div className="space-y-2">
          <h3 className="font-medium text-sm line-clamp-2">{anime.title}</h3>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{anime.rating}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}