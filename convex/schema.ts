import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const UserRole = v.union(
  v.literal("provider"),
  v.literal("provider_admin"),
  v.literal("client"),
);

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: UserRole,
    workosId: v.string(),
  }).index("by_workosId", ["workosId"]),

  agencies: defineTable({
    name: v.string(),
    ownerId: v.id("users"),
    description: v.string(),
    logoUrl: v.optional(v.string()),
  }).index("by_ownerId", ["ownerId"]),

  listings: defineTable({
    title: v.string(),
    agencyId: v.id("agencies"),
    description: v.string(),
    price: v.number(),
    imageUrl: v.optional(v.string()),
  }).index("by_agencyId", ["agencyId"]),
});
