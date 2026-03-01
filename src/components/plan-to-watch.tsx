"use client"

import Image from "next/image";
import { TabsContent } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Anime } from "@/lib/type";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { getAnimeById } from "@/lib/apiHelpers";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function PlanToWatch() {
    const [planToWatch, setPlanToWatch] = useState<Anime[]>([]);
    const { user } = useUser();

    const getWatchlist = useQuery(api.watchlists.getWatchlists, {
        status: "planned",
        user: user?.id ?? "",
    });

    useEffect(() => {
        const fetchAnime = async () => {
            if (getWatchlist?.success && getWatchlist.data) {
                const animeData = await Promise.all(
                    getWatchlist.data.map(async (watchlist) => {
                        const anime = await getAnimeById(watchlist.animeId)
                        return anime ? anime[0] : null
                    })
                );
                setPlanToWatch(animeData.filter((a): a is Anime => a !== null));
            }
        };

        fetchAnime();
    }, [getWatchlist]);

    return (
        <TabsContent value="plantowatch" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {planToWatch.map((anime) => (
                    <div key={anime.id} className="space-y-2">
                        <Link href={`/anime/${anime.slug}`}>
                            <div className="relative">
                                <Image
                                    src={anime.image.link || "/placeholder.svg"}
                                    alt={anime.title}
                                    width={120}
                                    height={160}
                                    className="rounded-lg object-cover w-full aspect-[3/4]"
                                />
                                <Badge className="absolute top-2 right-2" variant="secondary">
                                    {anime.genre[0]?.name || "Anime"}
                                </Badge>
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-medium text-sm line-clamp-2">{anime.title}</h3>
                                <p className="text-xs text-muted-foreground">{anime.totalEpisodes} episodes</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </TabsContent>
    )
}
