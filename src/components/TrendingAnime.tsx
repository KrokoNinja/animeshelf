import { Star } from "lucide-react";

import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { getTrendingAnime } from "@/lib/apiHelpers";

export default async function TrendingAnime() {

  const trending = await getTrendingAnime()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Trending Anime</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {trending.map((anime, index) => (
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