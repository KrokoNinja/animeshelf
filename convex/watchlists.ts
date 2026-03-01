import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addAnimeToWatchlist = mutation({
    args: {
        user: v.optional(v.string()),
        animeId: v.string(),
        status: v.union(v.literal("watching"), v.literal("planned"), v.literal("completed")),
    },
    handler: async (ctx, args) => {
        try {
            if (!args.user) {
                return { success: false, message: "You must be logged in to add anime to watchlist" };
            }
            const user = await ctx.db.query("users").filter((q) => q.eq(q.field("clerkId"), args.user)).collect();
            if (user.length === 0) {
                return { success: false, message: "User not found" };
            }
            const existingWatchlist = await ctx.db.query("watchlists").filter((q) => q.and(q.eq(q.field("user"), user[0]._id), q.eq(q.field("animeId"), args.animeId))).collect();
            if (existingWatchlist.length > 0) {
                return { success: false, message: "Anime already exists in watchlist" };
            }
            await ctx.db.insert("watchlists", { user: user[0]._id, animeId: args.animeId, status: args.status });
            return { success: true, message: "Anime added to watchlist" };
        } catch (error) {
            console.log(error);
            return { success: false, message: "Failed to add anime to watchlist" };
        }
    }
})

export const getWatchlists = query({
    args: {
        user: v.optional(v.string()),
        status: v.union(v.literal("watching"), v.literal("planned"), v.literal("completed")),
    },
    handler: async (ctx, args) => {
        try {
            if (!args.user) {
                return { success: false, message: "You must be logged in to view your watchlist" };
            }
            const user = await ctx.db.query("users").filter((q) => q.eq(q.field("clerkId"), args.user)).collect();
            if (user.length === 0) {
                return { success: false, message: "User not found" };
            }
            const watchlists = await ctx.db.query("watchlists").filter((q) => q.and(q.eq(q.field("user"), user[0]._id), q.eq(q.field("status"), args.status))).collect();
            return { success: true, data: watchlists };
        } catch (error) {
            console.log(error);
            return { success: false, message: "Failed to get watchlist" };
        }
    }
})

export const isAnimeInWatchlist = query({
    args: {
        user: v.optional(v.string()),
        animeId: v.string(),
    },
    handler: async (ctx, args) => {
        try {
            if (!args.user) {
                return { success: false, message: "You must be logged in to view your watchlist" };
            }
            const user = await ctx.db.query("users").filter((q) => q.eq(q.field("clerkId"), args.user)).collect();
            if (user.length === 0) {
                return { success: false, message: "User not found" };
            }
            const watchlist = await ctx.db.query("watchlists").filter((q) => q.and(q.eq(q.field("user"), user[0]._id), q.eq(q.field("animeId"), args.animeId))).collect();
            return { success: true, data: watchlist.length > 0 };
        } catch (error) {
            console.log(error);
            return { success: false, message: "Failed to get watchlist" };
        }
    }
})

export const updateWatchlist = mutation({
    args: {
        id: v.id("watchlists"),
        status: v.union(v.literal("watching"), v.literal("planned"), v.literal("completed")),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { status: args.status });
    }
})

export const deleteAnimeFromWatchlist = mutation({
    args: {
        animeId: v.string(),
        user: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        try {
            if (!args.user) {
                return { success: false, message: "You must be logged in to edit your watchlist" };
            }
            const user = await ctx.db.query("users").filter((q) => q.eq(q.field("clerkId"), args.user)).collect();
            if (user.length === 0) {
                return { success: false, message: "User not found" };
            }
            const watchlist = await ctx.db.query("watchlists").filter((q) => q.and(q.eq(q.field("user"), user[0]._id), q.eq(q.field("animeId"), args.animeId))).collect();
            if (watchlist.length === 0) {
                return { success: false, message: "Anime not found in watchlist" };
            }
            if (watchlist[0].status === "completed") {
                return { success: false, message: "Anime is already completed" };
            }
            if (watchlist[0].status === "watching") {
                return { success: false, message: "Anime is already in progress. Remove watched episodes to remove it." };
            }
            await ctx.db.delete(watchlist[0]._id);
            return { success: true, message: "Anime removed from watchlist" };
        } catch (error) {
            console.log(error);
            return { success: false, message: "Failed to remove anime from watchlist" };
        }
    }
})