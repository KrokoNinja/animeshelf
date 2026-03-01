import { Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import AnimeCard from "./animeCard"
import { Progress } from "./ui/progress"
import { Anime } from "@/lib/type"
import useUserProgress from "@/hooks/useUserProgress"
import { Spinner } from "./ui/spinner"
import { getAnimeById } from "@/lib/apiHelpers"
import NothingWatching from "./nothing-watching"
import { cn } from "@/lib/utils"

export default function CurrentlyWatching() {

    const currentlyWatching: Anime[] = []

    const { isLoading, isAuthenticated, progress } = useUserProgress()

    if (!progress) return
    progress.forEach(async (progress) => {
        const anime = await getAnimeById(progress.animeId)
        currentlyWatching.push(anime[0])
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Currently Watching</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", progress.length === 0 && "flex items-center justify-center")}>
                    {!isAuthenticated ?
                        <div>Sign in to see your currently watching</div>
                        : isLoading ? <Spinner /> :
                            progress.length === 0 ? <NothingWatching /> :
                                currentlyWatching.map((anime) => {
                                    return (
                                        <div key={anime.id} className="space-y-2">
                                            <AnimeCard anime={anime} />
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-xs">
                                                    <span>Episode 0</span>
                                                    <span>{anime.totalEpisodes ? `/ ${anime.totalEpisodes}` : "Ongoing"}</span>
                                                </div>
                                                <Progress
                                                    value={anime.totalEpisodes ? (0 / anime.totalEpisodes) * 100 : 0}
                                                    className="h-1"
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                </div>
            </CardContent>
        </Card>
    )
}
