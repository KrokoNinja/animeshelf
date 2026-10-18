"use client"

import { Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import AnimeCard from "./animeCard"
import { Progress } from "./ui/progress"
import { Anime } from "@/lib/type"
import useUserProgress from "@/hooks/useUserProgress"
import { Spinner } from "./ui/spinner"
import NothingWatching from "./nothing-watching"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { catalogQueries } from "@/lib/catalog/queries"

function CurrentlyWatchingItem({ anime, currentEpisode }: { anime: Anime; currentEpisode: number }) {
    return (
        <div className="space-y-2">
            <AnimeCard anime={anime} />
            <div className="space-y-1">
                <div className="flex justify-between text-xs">
                    <span>Episode {currentEpisode}</span>
                    <span>{anime.totalEpisodes ? `/ ${anime.totalEpisodes}` : "Ongoing"}</span>
                </div>
                <Progress
                    value={anime.totalEpisodes ? (currentEpisode / anime.totalEpisodes) * 100 : 0}
                    className="h-1"
                />
            </div>
        </div>
    )
}

export default function CurrentlyWatching() {
    const { isLoading, isAuthenticated, progress } = useUserProgress()
    const entries = progress ?? []
    const { data: animeList = [], isPending: isAnimePending } = useQuery(
        catalogQueries.byIds(entries.map((entry) => entry.animeId)),
    )

    const animeById = new Map(animeList.map((anime) => [anime.id, anime]))
    const watchingItems = entries.flatMap((entry) => {
        const anime = animeById.get(entry.animeId)
        return anime ? [{ entry, anime }] : []
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
                <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", watchingItems.length === 0 && "flex items-center justify-center")}>
                    {isLoading || (entries.length > 0 && isAnimePending) ? (
                        <Spinner />
                    ) : !isAuthenticated ? (
                        <div>Sign in to see your currently watching</div>
                    ) : watchingItems.length === 0 ? (
                        <NothingWatching />
                    ) : (
                        watchingItems.map(({ entry, anime }) => (
                            <CurrentlyWatchingItem
                                key={entry._id}
                                anime={anime}
                                currentEpisode={entry.currentEpisode}
                            />
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
