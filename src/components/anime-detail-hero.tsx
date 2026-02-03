import { Anime } from "@/lib/type"

export default function AnimeDetailHero({ anime }: { anime: Anime }) {
    return (
        <div className="relative h-80 md:h-96 overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${anime.coverImage.link})`,
                }}
            />
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
    )
}