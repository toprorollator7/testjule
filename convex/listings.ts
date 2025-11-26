import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";
import { getCurrentUser } from "./users";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("listings").collect();
  },
});

export const getListings = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    const agency = await ctx.db
      .query("agencies")
      .withIndex("by_ownerId", (q) => q.eq("ownerId", user._id))
      .unique();

    if (!agency) {
      return [];
    }

    return await ctx.db
      .query("listings")
      .withIndex("by_agencyId", (q) => q.eq("agencyId", agency._id))
      .collect();
  },
});

export const getListing = query({
  args: {
    id: v.id("listings"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getListingsByAgency = query({
  args: {
    agencyId: v.id("agencies"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("listings")
      .withIndex("by_agencyId", (q) => q.eq("agencyId", args.agencyId))
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    price: v.number(),
    description: v.string(),
    storageId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const agency = await ctx.db
      .query("agencies")
      .withIndex("by_ownerId", (q) => q.eq("ownerId", user._id))
      .unique();

    if (!agency) {
      throw new ConvexError("Agency not found.");
    }

    const imageUrl = args.storageId ? await ctx.storage.getUrl(args.storageId) : undefined;

    await ctx.db.insert("listings", {
      ...args,
      agencyId: agency._id,
      imageUrl,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("listings"),
    title: v.optional(v.string()),
    price: v.optional(v.number()),
    description: v.optional(v.string()),
    storageId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const listing = await ctx.db.get(args.id);

    if (!listing) {
      throw new ConvexError("Listing not found.");
    }

    const agency = await ctx.db.get(listing.agencyId);

    if (!agency || agency.ownerId !== user._id) {
      throw new ConvexError("Not authorized.");
    }

    const imageUrl = args.storageId ? await ctx.storage.getUrl(args.storageId) : undefined;

    await ctx.db.patch(args.id, {
      ...args,
      imageUrl,
    });
  },
});

export const deleteListing = mutation({
  args: {
    id: v.id("listings"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const listing = await ctx.db.get(args.id);

    if (!listing) {
      throw new ConvexError("Listing not found.");
    }

    const agency = await ctx.db.get(listing.agencyId);

    if (!agency || agency.ownerId !== user._id) {
      throw new ConvexError("Not authorized.");
    }

    await ctx.db.delete(args.id);
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});
