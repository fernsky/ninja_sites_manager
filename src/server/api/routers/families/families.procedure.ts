import { createTRPCRouter } from "@/server/api/trpc";
import { getAll, getById, getStats, getByAreaCode, getByEnumeratorName, getEnumeratorNames, getAreaCodesByEnumeratorName,getGpsByWard } from "./procedures/query";
import { assignEnumerator } from "./procedures/assign";
import { assignAreaUpdate } from "./procedures/assignArea";
import { assignWardUpdate } from "./procedures/assignWard";
// import { update, deleteBuilding } from "./procedures/update";
import {
  approve,
  requestEdit,
  reject,
  getStatusHistory,
} from "./procedures/status";
import { assignToEnumerator } from "./procedures/assignment";

export const familyRouter = createTRPCRouter({
  getAll,
  getById,
  getGpsByWard,
  getByEnumeratorName,
  getAreaCodesByEnumeratorName,
  getEnumeratorNames,
  getByAreaCode,
  getStats,
  assignEnumerator,
  assignAreaUpdate,
  assignWardUpdate,
  approve,
  requestEdit,
  reject,
  getStatusHistory,
  assignToEnumerator,
});
