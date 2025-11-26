import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";
import { getCurrentUser } from "./users";
import { v } from "convex/values";

export const getMyAgency = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    return await ctx.db
      .query("agencies")
      .withIndex("by_ownerId", (q) => q.eq("ownerId", user._id))
      .unique();
  },
});

export const getAgency = query({
  args: {
    id: v.id("agencies"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getAgencies = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("agencies").collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    logoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    await ctx.db.insert("agencies", {
      ...args,
      ownerId: user._id,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("agencies"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const agency = await ctx.db.get(args.id);

    if (!agency || agency.ownerId !== user._id) {
      throw new ConvexError("Not authorized.");
    }

    await ctx.db.patch(args.id, args);
  },
});

export const deleteAgency = mutation({
  args: {
    id: v.id("agencies"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const agency = await ctx.db.get(args.id);

    if (!agency || agency.ownerId !== user._id) {
      throw new ConvexError("Not authorized.");
    }

    await ctx.db.delete(args.id);
  },
});
