"use client"

import { Episode } from "@/lib/type"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface WatchedEpisodesDialogProps {
    animeTitle: string
    episodes: Episode[]
    watchedEpisodes: string[]
    onWatchedEpisodesChange: (newWatched: string[]) => void
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function WatchedEpisodesDialog({
    animeTitle,
    episodes,
    watchedEpisodes,
    onWatchedEpisodesChange,
    open,
    onOpenChange
}: WatchedEpisodesDialogProps) {

    const handleCheckboxChange = (episodeId: string, checked: boolean) => {
        onWatchedEpisodesChange(
            checked
                ? [...watchedEpisodes, episodeId]
                : watchedEpisodes.filter((id) => id !== episodeId)
        )
    }

    const handleSelectAll = () => {
        if (watchedEpisodes.length === episodes.length) {
            onWatchedEpisodesChange([]) // Deselect all
        } else {
            onWatchedEpisodesChange(episodes.map((ep) => ep.id)) // Select all
        }
    }

    const isAllSelected = episodes.length > 0 && watchedEpisodes.length === episodes.length

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Mark Watched Episodes</DialogTitle>
                    <DialogDescription>
                        Select the episodes you have watched for {animeTitle}.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-between items-center py-2">
                    <Button variant="outline" size="sm" onClick={handleSelectAll}>
                        {isAllSelected ? "Uncheck All" : "Check All"}
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        {watchedEpisodes.length} selected
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 -mr-6 pl-1 py-2">
                    <div className="grid gap-3">
                        {episodes.map((episode) => (
                            <div key={episode.id} className="flex items-center space-x-3 p-2 rounded hover:bg-secondary/20 transition-colors">
                                <Checkbox
                                    id={`episode-${episode.id}`}
                                    checked={watchedEpisodes.includes(episode.id)}
                                    onCheckedChange={(checked) => handleCheckboxChange(episode.id, checked as boolean)}
                                />
                                <label
                                    htmlFor={`episode-${episode.id}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
                                >
                                    <span className="font-bold mr-2">Ep {episode.episodeNumber}</span>
                                    <span className="text-muted-foreground line-clamp-1">{episode.title}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button type="submit" onClick={() => onOpenChange(false)}>Done</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

