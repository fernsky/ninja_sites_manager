import { adminRouter } from "./routers/admin/admin.procedure";
import { wardRouter } from "./routers/ward/ward.procedure";
import { userRouter } from "./routers/user/user.procedure";
import { createTRPCRouter } from "./trpc";
import { areaRouter } from "./routers/areas/areas.procedure";
import { superadminRouter } from "./routers/superadmin/superadmin.procedure";
import { enumeratorRouter } from "./routers/enumerators/enumerators.procedure";
import { buildingRouter } from "./routers/building/building.procedure";
import { areaManagementRouter } from "./routers/area-management/area-management.procedure";
import { businessRouter } from "./routers/businesses/business.procedure";
import { familyRouter } from "./routers/families/families.procedure";
import { individualRouter } from "./routers/individuals/individuals.procedure";
import { deathRouter } from "./routers/deaths/deaths.procedure";
import { analyticsRouter } from "./routers/analytics/analytics.procedure";
import { enumwiseRouter } from "./routers/enumwise/enumwise.procedure";
import { aggregateRouter } from "./routers/aggregate";
import { householdCBSRouter } from "./cbs/households/households.procedure";
import { populationCBSRouter } from "./cbs/population/population.procedure";
import { managerRouter } from "./routers/sites-manager/manager.procedure";

export const appRouter = createTRPCRouter({
  user: userRouter,
  admin: adminRouter,
  area: areaRouter,
  ward: wardRouter,
  superadmin: superadminRouter,
  enumerator: enumeratorRouter,
  areaManagement: areaManagementRouter,
  building: buildingRouter,
  business: businessRouter,
  family: familyRouter,
  individual: individualRouter,
  death: deathRouter,
  analytics:analyticsRouter,
  enumWise:enumwiseRouter,
  cbsHousehold: householdCBSRouter,
  cbsPopulation: populationCBSRouter,
  aggregate: aggregateRouter,
  manager: managerRouter
});

export type AppRouter = typeof appRouter;
