// hooks/useSyncConvexId.ts
import { useConvexAuth, useMutation } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { api } from '../../convex/_generated/api';

export function useSyncConvexId() {
    const { user } = useUser();
    const { isAuthenticated } = useConvexAuth();
    const syncUser = useMutation(api.users.store);

    useEffect(() => {
        // Wait until Convex has picked up the Clerk session token, otherwise the
        // mutation runs unauthenticated and the metadata below is never written.
        if (!user || !isAuthenticated) return;

        const existingConvexId = user.unsafeMetadata?.convexId;

        const sync = async () => {
            const result = await syncUser();

            // Update Clerk metadata with Convex ID
            if (existingConvexId !== result.convexUserId) {
                await user.update({
                    unsafeMetadata: {
                        ...user.unsafeMetadata,
                        convexId: result.convexUserId
                    }
                });
            }
        };

        sync().catch((error) => {
            console.error("Failed to sync Clerk user with Convex", error);
        });
    }, [user, isAuthenticated, syncUser]);
}
