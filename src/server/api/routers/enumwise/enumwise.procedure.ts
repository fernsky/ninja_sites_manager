import { createTRPCRouter } from "@/server/api/trpc";
import { buildingsRouter } from "./procedures/buildings";
import { businessRouter } from "./procedures/business";
import { familyRouter } from "./procedures/family";

export const enumwiseRouter = createTRPCRouter({
  buildings: buildingsRouter,
  business: businessRouter,
  family: familyRouter,
});
