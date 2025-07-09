import { createTRPCRouter } from "@/server/api/trpc";
import { getTokenStatsByAreaId, getAreaTokens } from "./procedures/tokens";
import {
  assignAreaToEnumerator,
  getUnassignedWardAreasofEnumerator,
  getAreaDetails,
  getAreasByWardforRequest,
  manualAssignAreaToEnumerator
} from "./procedures/assignment";
import {
  createArea,
  getAreas,
  getAreaById,
  updateArea,
  getAvailableAreaCodes,
  getLayerAreas,
  getAreaBoundaryByCode,
  getAreasWithSubmissionCounts,
  getAreaBoundariesByCodes,
  getAreaCodesByUserId,
  createPointRequest, 
  getPointRequestsByWard,
  getAreasByEnumeratorName,
  getAreasSummaryByEnumerator,
  getAllAreasWithStatus,
  getAreaCodesByEnumeratorId
} from "./procedures/basic";
import {
  requestArea,
  getUserAreaRequests,
  getAllAreaRequests,
  updateAreaRequestStatus,
} from "./procedures/requests";

export const areaRouter = createTRPCRouter({
  createArea,
  getAreas,
  getLayerAreas,
  getAreaById,
  getAreaCodesByUserId,
  updateArea,
  requestArea,
  getUserAreaRequests,
  getAreaBoundariesByCodes,
  getAreaBoundaryByCode,
  getAllAreaRequests,
  getAreasWithSubmissionCounts,
  updateAreaRequestStatus,
  getTokenStatsByAreaId,
  getAreaTokens,
  assignAreaToEnumerator,
  getAvailableAreaCodes,
  getUnassignedWardAreasofEnumerator,
  getAreaDetails,
  getAreasByWardforRequest,
  createPointRequest,
  getPointRequestsByWard,
  getAreasByEnumeratorName,
  getAreasSummaryByEnumerator,
  getAllAreasWithStatus,
  getAreaCodesByEnumeratorId,
  manualAssignAreaToEnumerator,
});
