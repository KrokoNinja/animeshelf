"use client";

import { useStoreUserEffect } from "@/hooks/useStoreUserEffect";

export default function UserSync() {
    useStoreUserEffect();
    return null;
}
