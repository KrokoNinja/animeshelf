import { useUser } from "@clerk/nextjs"
import { useConvexAuth, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Id } from "../../convex/_generated/dataModel"

export default function useUserProgress() {
    const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth()
    const { user } = useUser()

    // The Convex user id is written to Clerk's unsafe metadata by useSyncConvexId.
    // Until that has happened there is no user to look up, and passing an object
    // whose only field is `undefined` serializes to `{}`, which fails the server's
    // required `v.id("users")` validator. Skip the query instead.
    const convexId = user?.unsafeMetadata?.convexId
    const convexUserId = typeof convexId === "string" ? (convexId as Id<"users">) : undefined

    const progress = useQuery(
        api.progress.getProgress,
        isAuthenticated && convexUserId ? { userId: convexUserId } : "skip"
    )

    return {
        isLoading: isAuthLoading || (isAuthenticated && progress === undefined),
        isAuthenticated,
        progress,
    }
}
