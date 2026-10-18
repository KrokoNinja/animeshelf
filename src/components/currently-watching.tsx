"use client"

import { useEffect, useState } from "react"
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

function CurrentlyWatchingItem({ animeId, currentEpisode }: { animeId: string; currentEpisode: number }) {
    const [anime, setAnime] = useState<Anime | null>(null)

    useEffect(() => {
        let cancelled = false
        getAnimeById(animeId)
            .then(([result]) => {
                if (!cancelled) setAnime(result ?? null)
            })
            .catch(() => {
                if (!cancelled) setAnime(null)
            })
        return () => {
            cancelled = true
        }
    }, [animeId])

    if (!anime) return null

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

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Currently Watching</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", entries.length === 0 && "flex items-center justify-center")}>
                    {isLoading ? (
                        <Spinner />
                    ) : !isAuthenticated ? (
                        <div>Sign in to see your currently watching</div>
                    ) : entries.length === 0 ? (
                        <NothingWatching />
                    ) : (
                        entries.map((entry) => (
                            <CurrentlyWatchingItem
                                key={entry._id}
                                animeId={entry.animeId}
                                currentEpisode={entry.currentEpisode}
                            />
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
