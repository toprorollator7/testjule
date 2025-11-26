import { mutation } from "./_generated/server";

export const seed = mutation({
  handler: async (ctx) => {
    // Clear existing data
    await ctx.db.query("users").delete();
    await ctx.db.query("agencies").delete();
    await ctx.db.query("listings").delete();

    // Create users
    const user1 = await ctx.db.insert("users", {
      name: "John Doe",
      email: "john.doe@example.com",
      role: "provider_admin",
      workosId: "user_123",
    });

    const user2 = await ctx.db.insert("users", {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "client",
      workosId: "user_456",
    });

    // Create agencies
    const agency1 = await ctx.db.insert("agencies", {
      name: "Dream Homes Realty",
      ownerId: user1,
      description: "Your trusted partner in finding the perfect home.",
      logoUrl: "https://via.placeholder.com/150",
    });

    // Create listings
    await ctx.db.insert("listings", {
      title: "Cozy Downtown Apartment",
      agencyId: agency1,
      description: "A beautiful apartment in the heart of the city.",
      price: 1500,
      imageUrl: "https://via.placeholder.com/600x400",
    });

    await ctx.db.insert("listings", {
      title: "Spacious Suburban House",
      agencyId: agency1,
      description: "A large house with a beautiful garden.",
      price: 3500,
      imageUrl: "https://via.placeholder.com/600x400",
    });
  },
});
