import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        username: v.string(),
        clerkId: v.string(),
        email: v.string(),
        name: v.string(),
    }).index("by_clerkId", ["clerkId"]),
    watchlists: defineTable({
        user: v.id("users"),
        animeId: v.string(),
        status: v.union(v.literal("watching"), v.literal("planned"), v.literal("completed")),
    }).index("by_user", ["user"]),
    progress: defineTable({
        user: v.id("users"),
        animeId: v.string(),
        currentEpisode: v.number(),
        lastUpdated: v.number()
    }).index("by_user_anime", ["user", "animeId"])
})

