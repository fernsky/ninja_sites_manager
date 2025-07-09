import { createTRPCRouter } from "@/server/api/trpc";
// import { create } from "./procedures/create";
import { getAll, getById, getStats, getByAreaCode, getByEnumeratorName, getEnumeratorNames, getAreaCodesByEnumeratorName, getGpsByWard } from "./procedures/query";
import { update, deleteBusiness } from "./procedures/update";
import { assignWardUpdate } from "./procedures/assignWard";
import { assignAreaUpdate } from "./procedures/assignArea";
import {
  approve,
  requestEdit,
  reject,
  getStatusHistory,
} from "./procedures/status";
import { assignToEnumerator } from "./procedures/assignment";

export const businessRouter = createTRPCRouter({
  // create,
  getAll,
  getById,
  getByEnumeratorName,
  getEnumeratorNames,
  getAreaCodesByEnumeratorName,
  getByAreaCode,
  update,
  delete: deleteBusiness,
  assignWardUpdate,
  assignAreaUpdate,
  getStats,
  approve,
  requestEdit,
  reject,
  getStatusHistory,
  assignToEnumerator,
  getGpsByWard
});
