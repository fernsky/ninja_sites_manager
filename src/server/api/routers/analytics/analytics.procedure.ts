import { createTRPCRouter } from "@/server/api/trpc";
import {
  getSubmissionStats,
  getAreaStats,
  getEnumeratorStats,
  getWardStats,
  getAgeDistribution,
  getAncestorLanguageDistribution,
  getGenderDistribution,
  getCasteDistribution,
  getDisabilityDistribution,
  getMaritalStatusDistribution,
  getMarriageAgeDistribution,
  getMotherTongueDistribution,
  getReligionDistribution
} from "./procedures/basic";


import { getFamilyStats, getFamiliesByWard, getFamilyStatusDistribution, getFamilyHousingOwnership } from "./procedures/families";

import {
  getAgriculturalLandStats,
  getIrrigationStats,
  getCropStats,
  getAnimalStats,
  getAnimalProductStats,
  getAgriculturalLandOverview,
  getAgricultureOverview
} from "./procedures/agricultural";

import{
  getBuildingStats,
  getBuildingsByWard,
  getEmptyBuildingsStats,
  getBuildingsByStatus
} from "./procedures/buildings";

export const analyticsRouter = createTRPCRouter({
  getSubmissionStats,
  getAreaStats,
  getEnumeratorStats,
  getWardStats,
  getAgeDistribution,
  getAncestorLanguageDistribution,
  getGenderDistribution,
  getCasteDistribution,
  getDisabilityDistribution,
  getMaritalStatusDistribution,
  getMarriageAgeDistribution,
  getMotherTongueDistribution,
  getReligionDistribution,
  
  // Agricultural procedures
  getAgriculturalLandStats,
  getIrrigationStats,
  getCropStats,
  getAnimalStats,
  getAnimalProductStats,
  getAgriculturalLandOverview,
  getAgricultureOverview,
  //Buildings Procedures
  getBuildingStats,
  getBuildingsByWard,
  getEmptyBuildingsStats,
  getBuildingsByStatus,

  // Family procedures
  getFamilyStats,
  getFamiliesByWard,
  getFamilyStatusDistribution,
  getFamilyHousingOwnership
});
