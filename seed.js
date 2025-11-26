import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api.js";
import "dotenv/config";

async function main() {
  const convex = new ConvexHttpClient(process.env.VITE_CONVEX_URL);
  await convex.mutation(api.seed.seed);
  console.log("Database seeded successfully!");
}

main();
