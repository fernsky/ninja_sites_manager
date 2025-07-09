import { createTRPCRouter } from "@/server/api/trpc";
import { getAll, getById, getStats } from "./procedures/query";

export const deathRouter = createTRPCRouter({
  getAll,
  getById,
  getStats,
});
