// convex/users.ts
import { mutation } from "./_generated/server";

export const store = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called storeUser without authentication");
        }

        const clerkId = identity.subject; // Clerk's unique user ID (not tokenIdentifier)

        // Query by clerkId instead of tokenIdentifier
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
            .unique();

        if (user !== null) {
            // Update username if changed
            if (user.username !== identity.nickname) {
                await ctx.db.patch(user._id, {
                    username: identity.nickname,
                });
            }
            return { convexUserId: user._id, clerkId };
        }

        // Create new user
        const newUser = await ctx.db.insert("users", {
            clerkId,  // Store full Clerk ID
            username: identity.nickname ?? `user-${Math.floor(Math.random() * 100000)}`,
            email: identity.email ?? "",
            name: identity.name ?? "",
        });

        return { convexUserId: newUser, clerkId };
    },
});
