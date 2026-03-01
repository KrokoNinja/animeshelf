import { useUser } from "@clerk/nextjs"
import { useConvexAuth, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Id } from "../../convex/_generated/dataModel"

export default function useUserProgress() {
    const { isLoading, isAuthenticated } = useConvexAuth()
    const { user } = useUser()
    console.log(user)
    const userId = user?.unsafeMetadata.convexId as Id<"users">
    console.log(userId)

    const getProgress = useQuery(api.progress.getProgress, { userId: userId })

    return {
        isLoading,
        isAuthenticated,
        progress: getProgress
    }
}