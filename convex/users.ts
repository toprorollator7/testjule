import { internal } from "./_generated/api";
import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { UserRole } from "./schema";
import { ConvexError } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    return await getUserByWorkosId(ctx, identity.subject);
  },
});

export const create = internalMutation({
  args: {
    email: v.string(),
    firstName: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, { email, firstName, userId }) => {
    const existingUser = await getUserByWorkosId(ctx, userId);
    if (existingUser) {
      return;
    }
    await ctx.db.insert("users", {
      email,
      name: firstName,
      workosId: userId,
      role: "client",
    });
  },
});

export const updateRole = mutation({
  args: {
    role: UserRole,
  },
  handler: async (ctx, { role }) => {
    const user = await getCurrentUser(ctx);
    await ctx.db.patch(user._id, { role });
  },
});

export async function getUserByWorkosId(ctx, workosId) {
  return await ctx.db
    .query("users")
    .withIndex("by_workosId", (q) => q.eq("workosId", workosId))
    .unique();
}

export async function getCurrentUser(ctx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("Not authenticated");
  }
  const user = await getUserByWorkosId(ctx, identity.subject);
  if (!user) {
    throw new ConvexError("User not found");
  }
  return user;
}
