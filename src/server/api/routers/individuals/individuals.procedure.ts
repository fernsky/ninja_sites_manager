import { createTRPCRouter } from "@/server/api/trpc";
import { getAll, getById, getStats } from "./procedures/query";

export const individualRouter = createTRPCRouter({
  getAll,
  getById,
  getStats,
});