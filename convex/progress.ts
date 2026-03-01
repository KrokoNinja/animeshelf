import { query } from "./_generated/server";
import { v } from "convex/values";

export const getProgress = query({
    args: { userId: v.id("users") }, handler: async (ctx, args) => {
        const progress = await ctx.db.query("progress").withIndex("by_user_anime", (q) => q.eq("user", args.userId)).collect();
        return progress;
    }
})