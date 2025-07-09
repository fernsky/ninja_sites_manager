import { createTRPCRouter } from "@/server/api/trpc";
import * as buildingQueries from "./procedures/building-queries";
import * as householdQueries from "./procedures/household-queries";
import * as businessQueries from "./procedures/business-queries";
import * as mediaQueries from "./procedures/media-queries";
import * as mapQueries from "./procedures/map-queries";
import * as filterQueries from "./procedures/filter-queries";

export const aggregateRouter = createTRPCRouter({
  // Building queries
  getAllBuildings: buildingQueries.getAllBuildings,
  getAllBuildingsInfinite: buildingQueries.getAllBuildingsInfinite,
  getBuildingById: buildingQueries.getBuildingById,
  getBuildingsByWard: buildingQueries.getBuildingsByWard,
  getBuildingsByAreaCode: buildingQueries.getBuildingsByAreaCode,
  getBuildingsByEnumerator: buildingQueries.getBuildingsByEnumerator,
  getBuildingStats: buildingQueries.getBuildingStats,
  getAggregatedBuildingData: buildingQueries.getAggregatedBuildingData,

  // Household queries
  getHouseholdById: householdQueries.getHouseholdById,
  getHouseholdsByBuildingId: householdQueries.getHouseholdsByBuildingId,
  getHouseholdMembers: householdQueries.getHouseholdMembers,
  getHouseholdCrops: householdQueries.getHouseholdCrops,
  getHouseholdAnimals: householdQueries.getHouseholdAnimals,
  getHouseholdLands: householdQueries.getHouseholdLands,
  getHouseholdAnimalProducts: householdQueries.getHouseholdAnimalProducts,
  getHouseholdDeaths: householdQueries.getHouseholdDeaths,
  getHouseholdAbsentees: householdQueries.getHouseholdAbsentees,

  // Business queries
  getBusinessById: businessQueries.getBusinessById,
  getBusinessesByBuildingId: businessQueries.getBusinessesByBuildingId,
  getBusinessCrops: businessQueries.getBusinessCrops,
  getBusinessAnimals: businessQueries.getBusinessAnimals,
  getBusinessAnimalProducts: businessQueries.getBusinessAnimalProducts,

  // Media queries
  getMediaPresignedUrls: mediaQueries.getMediaPresignedUrls,
  getAudioPresignedUrl: mediaQueries.getAudioPresignedUrl,

  // Map queries
  getMapEntities: mapQueries.getMapEntities,
  getMapEntityById: mapQueries.getMapEntityById,
  getClusterPoints: mapQueries.getClusterPoints,

  // Filter queries
  getDistinctWardNumbers: filterQueries.getDistinctWardNumbers,
  getDistinctAreaCodes: filterQueries.getDistinctAreaCodes,
  getDistinctEnumerators: filterQueries.getDistinctEnumerators,
  getDistinctMapStatuses: filterQueries.getDistinctMapStatuses,
  getDistinctBuildingOwnerships: filterQueries.getDistinctBuildingOwnerships,
  getDistinctBuildingBases: filterQueries.getDistinctBuildingBases,
});
