import { Star, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { catalogQueries } from "@/lib/catalog/queries";
import { useQuery } from "@tanstack/react-query";

export default function TrendingAnime() {

  const { data: trending, isPending, error } = useQuery(catalogQueries.trending(3))

  if (isPending) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!trending) return <div>No trending anime</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Trending Anime</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {trending && trending.map((anime, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
              {index + 1}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium line-clamp-1">{anime.title}</p>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-muted-foreground">{anime.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )

}