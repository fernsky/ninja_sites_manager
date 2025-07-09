import { createTRPCRouter } from "@/server/api/trpc";
import { create } from "./procedures/create";
import { getAll, getById, getStats, getByAreaCode, getByEnumeratorName, getEnumeratorNames, getAreaCodesByEnumeratorName, getGpsByWard } from "./procedures/query";
import { update, deleteBuilding } from "./procedures/update";
import {
  approve,
  requestEdit,
  reject,
  getStatusHistory,
} from "./procedures/status";
import { assignToEnumerator } from "./procedures/assignment";
import { assignAreaUpdate } from "./procedures/assignArea";
import { assignWardUpdate } from "./procedures/assignWard";
import * as assign from "./procedures/assign";

export const buildingRouter = createTRPCRouter({
  create,
  getAll,
  getById,
  getByEnumeratorName,
  getAreaCodesByEnumeratorName,
  getEnumeratorNames,
  getByAreaCode,
  update,
  getGpsByWard,
  delete: deleteBuilding,
  getStats,
  approve,
  requestEdit,
  reject,
  getStatusHistory,
  assignToEnumerator,
  assignAreaUpdate,
  assignWardUpdate,
  assignWard: assign.assignWard,
  assignArea: assign.assignArea,
  assignEnumerator: assign.assignEnumerator,
  assignBuildingToken: assign.assignBuildingToken,
  getInvalidBuildings: assign.getInvalidBuildings,
});
