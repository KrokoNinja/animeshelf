"use client";

import { useSyncConvexId } from "@/hooks/useSyncConvexId";

export default function UserSync() {
    useSyncConvexId();
    return null;
}
