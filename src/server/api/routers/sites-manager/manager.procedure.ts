import { createTRPCRouter } from "@/server/api/trpc";
import {
  // Site Queries
  getSites,
  getSiteById,
  getSiteWithIssuesById,
  getSitesWithIssues,
  
  // Issue Queries
  getIssues,
  getIssueById,
  getIssuesWithSite,
  
  // Solution Queries
  getSolutions,
  getSolutionById,
  
  // Statistics Queries
  getSiteStatistics,
  getIssueStatistics,
  
  // Utility Queries
  getProvinces,
  getDistricts,
  getIssueTypes,
  getSolvers,
  getSiteStats,
} from "./procedures/query";

import {
  createSite,
  updateSite,
  deleteSite,
  bulkUpdateSites,
  updateIssue,
  solveIssue,
  deleteIssue,
} from "./procedures/create";

export const managerRouter = createTRPCRouter({
  // Site Queries
  getSites,
  getSiteById,
  getSiteWithIssuesById,
  getSitesWithIssues,
  
  // Issue Queries
  getIssues,
  getIssueById,
  getIssuesWithSite,
  
  // Solution Queries
  getSolutions,
  getSolutionById,
  
  // Statistics Queries
  getSiteStatistics,
  getIssueStatistics,
  
  // Utility Queries
  getProvinces,
  getDistricts,
  getIssueTypes,
  getSolvers,
  getSiteStats,

  // Site Mutations
  createSite,
  updateSite,
  deleteSite,
  bulkUpdateSites,
  
  // Issue Mutations
  updateIssue,
  solveIssue,
  deleteIssue,
});
