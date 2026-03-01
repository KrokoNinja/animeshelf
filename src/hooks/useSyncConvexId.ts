// hooks/useConvexUserId.ts
import { useMutation } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { api } from '../../convex/_generated/api';

export function useSyncConvexId() {
    const { user } = useUser();
    const syncUser = useMutation(api.users.store);

    useEffect(() => {
        if (!user) return;

        const existingConvexId = user.unsafeMetadata?.convexId as string;

        const sync = async () => {
            const result = await syncUser();

            // Update Clerk metadata with Convex ID
            if (!existingConvexId || existingConvexId !== result.convexUserId) {
                await user.update({
                    unsafeMetadata: {
                        ...user.unsafeMetadata,
                        convexId: result.convexUserId
                    }
                });
            }
        };

        sync();
    }, [user, syncUser]);
}
