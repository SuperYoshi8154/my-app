
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";


export const get = query({
    // Validators for arguments.
    args: {},

    // Query implementation.
    handler: async (ctx,) => {

        const userId = await getAuthUserId(ctx);
        const user = userId === null ? null : await ctx.db.get("users", userId);
        return user
    },
});