import { z } from "zod";

// Site Management Schemas
export const createSiteSchema = z.object({
  nameOfAgency: z.string().min(1, "Agency name is required"),
  url: z.string().url("Valid URL is required"),
  isCpanel: z.boolean().default(false),
  cpanelUsername: z.string().optional(),
  cpanelPassword: z.string().optional(),
  isVm: z.boolean().default(false),
  vpnUsername: z.string().optional(),
  vpnPassword: z.string().optional(),
  vmIp: z.string().optional(),
  vmUsername: z.string().optional(),
  vmPassword: z.string().optional(),
  province: z.string().min(1, "Province is required"),
  district: z.string().min(1, "District is required"),
  hasTakenManualBackup: z.boolean().default(false),
  lastManualBackupDate: z.date().optional(),
  lastDatabaseBackupDate: z.date().optional(),
  backupLocation: z.enum(["LOCAL", "AWS", "TELEGRAM"]).optional(),
  issues: z
    .array(
      z.object({
        issueTypes: z
          .array(
            z.enum([
              "CSS_ERROR",
              "NOT_FOUND_404",
              "INTERNAL_SERVER_ERROR",
              "HACKED",
              "NOT_RESPONDING",
              "SSL_ERROR",
              "DATABASE_ERROR",
              "PERFORMANCE_ISSUE",
            ]),
          )
          .min(1, "At least one issue type is required"),
        description: z
          .string()
          .min(1, "Description is required")
          .max(1000, "Description too long"),
        priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
      }),
    )
    .optional()
    .default([]),
});

export const updateSiteSchema = z.object({
  id: z.string(),
  nameOfAgency: z.string().min(1, "Agency name is required").optional(),
  url: z.string().url("Valid URL is required").optional(),
  isCpanel: z.boolean().optional(),
  cpanelUsername: z.string().optional(),
  cpanelPassword: z.string().optional(),
  isVm: z.boolean().optional(),
  vpnUsername: z.string().optional(),
  vpnPassword: z.string().optional(),
  vmIp: z.string().optional(),
  vmUsername: z.string().optional(),
  vmPassword: z.string().optional(),
  province: z.string().min(1, "Province is required").optional(),
  district: z.string().min(1, "District is required").optional(),
  hasTakenManualBackup: z.boolean().optional(),
  lastManualBackupDate: z.date().optional(),
  lastDatabaseBackupDate: z.date().optional(),
  backupLocation: z.enum(["LOCAL", "AWS", "TELEGRAM"]).optional(),
  hasIssues: z.boolean().optional(),
});

export const siteQuerySchema = z.object({
  province: z.string().optional(),
  district: z.string().optional(),
  hasIssues: z.boolean().optional(),
  isCpanel: z.boolean().optional(),
  isVm: z.boolean().optional(),
  hasTakenManualBackup: z.boolean().optional(),
  backupLocation: z.enum(["LOCAL", "AWS", "TELEGRAM"]).optional(),
});

// Issue Management Schemas
export const createIssueSchema = z.object({
  siteId: z.string().min(1, "Site ID is required"),
  issueTypes: z.array(z.enum(["CSS_ERROR", "NOT_FOUND_404", "INTERNAL_SERVER_ERROR", "HACKED", "NOT_RESPONDING", "SSL_ERROR", "DATABASE_ERROR", "PERFORMANCE_ISSUE"])).min(1, "At least one issue type is required"),
  description: z.string().min(1, "Description is required").max(1000, "Description too long"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
});

export const updateIssueSchema = z.object({
  id: z.string(),
  issueTypes: z.array(z.enum(["CSS_ERROR", "NOT_FOUND_404", "INTERNAL_SERVER_ERROR", "HACKED", "NOT_RESPONDING", "SSL_ERROR", "DATABASE_ERROR", "PERFORMANCE_ISSUE"])).optional(),
  description: z.string().min(1, "Description is required").max(1000, "Description too long").optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  isSolved: z.boolean().optional(),
});

export const issueQuerySchema = z.object({
  siteId: z.string().optional(),
  issueTypes: z.array(z.enum(["CSS_ERROR", "NOT_FOUND_404", "INTERNAL_SERVER_ERROR", "HACKED", "NOT_RESPONDING", "SSL_ERROR", "DATABASE_ERROR", "PERFORMANCE_ISSUE"])).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  isSolved: z.boolean().optional(),
});

// Solution Management Schemas
export const createSolutionSchema = z.object({
  issueId: z.string().min(1, "Issue ID is required"),
  whoSolved: z.string().min(1, "Solver name is required"),
  howSolved: z.string().min(1, "Solution description is required").max(2000, "Solution description too long"),
  solvedAt: z.date(),
});

export const updateSolutionSchema = z.object({
  id: z.string(),
  whoSolved: z.string().min(1, "Solver name is required").optional(),
  howSolved: z.string().min(1, "Solution description is required").max(2000, "Solution description too long").optional(),
  solvedAt: z.date().optional(),
});

export const solutionQuerySchema = z.object({
  issueId: z.string().optional(),
  whoSolved: z.string().optional(),
});

// Backup Management Schemas
export const updateBackupStatusSchema = z.object({
  siteId: z.string(),
  hasTakenManualBackup: z.boolean(),
  lastManualBackupDate: z.date().optional(),
  lastDatabaseBackupDate: z.date().optional(),
  backupLocation: z.enum(["LOCAL", "AWS", "TELEGRAM"]).optional(),
});

// Bulk Operations Schemas
export const bulkUpdateSitesSchema = z.object({
  siteIds: z.array(z.string()).min(1, "At least one site ID is required"),
  updates: z.object({
    hasTakenManualBackup: z.boolean().optional(),
    lastManualBackupDate: z.date().optional(),
    lastDatabaseBackupDate: z.date().optional(),
    backupLocation: z.enum(["LOCAL", "AWS", "TELEGRAM"]).optional(),
    hasIssues: z.boolean().optional(),
  }),
});

export const bulkCreateIssuesSchema = z.object({
  issues: z.array(createIssueSchema).min(1, "At least one issue is required"),
});

// Statistics and Analytics Schemas
export const siteStatisticsSchema = z.object({
  province: z.string().optional(),
  district: z.string().optional(),
  dateRange: z.object({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  }).optional(),
});

export const issueStatisticsSchema = z.object({
  siteId: z.string().optional(),
  issueTypes: z.array(z.enum(["CSS_ERROR", "NOT_FOUND_404", "INTERNAL_SERVER_ERROR", "HACKED", "NOT_RESPONDING", "SSL_ERROR", "DATABASE_ERROR", "PERFORMANCE_ISSUE"])).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  dateRange: z.object({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  }).optional(),
});

// Export Types
export type CreateSiteInput = z.infer<typeof createSiteSchema>;
export type UpdateSiteInput = z.infer<typeof updateSiteSchema>;
export type SiteQueryInput = z.infer<typeof siteQuerySchema>;

export type CreateIssueInput = z.infer<typeof createIssueSchema>;
export type UpdateIssueInput = z.infer<typeof updateIssueSchema>;
export type IssueQueryInput = z.infer<typeof issueQuerySchema>;

export type CreateSolutionInput = z.infer<typeof createSolutionSchema>;
export type UpdateSolutionInput = z.infer<typeof updateSolutionSchema>;
export type SolutionQueryInput = z.infer<typeof solutionQuerySchema>;

export type UpdateBackupStatusInput = z.infer<typeof updateBackupStatusSchema>;
export type BulkUpdateSitesInput = z.infer<typeof bulkUpdateSitesSchema>;
export type BulkCreateIssuesInput = z.infer<typeof bulkCreateIssuesSchema>;
export type SiteStatisticsInput = z.infer<typeof siteStatisticsSchema>;
export type IssueStatisticsInput = z.infer<typeof issueStatisticsSchema>;

// Interface Definitions
export interface Site {
  id: string;
  nameOfAgency: string;
  url: string;
  isCpanel: boolean;
  cpanelUsername?: string | null;
  cpanelPassword?: string | null;
  isVm: boolean;
  vpnUsername?: string | null;
  vpnPassword?: string | null;
  vmIp?: string | null;
  vmUsername?: string | null;
  vmPassword?: string | null;
  province: string;
  district: string;
  hasTakenManualBackup: boolean;
  lastManualBackupDate?: Date | null;
  lastDatabaseBackupDate?: Date | null;
  backupLocation?: "LOCAL" | "AWS" | "TELEGRAM" | null;
  hasIssues: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Issue {
  id: string;
  siteId: string;
  issueTypes: ("CSS_ERROR" | "NOT_FOUND_404" | "INTERNAL_SERVER_ERROR" | "HACKED" | "NOT_RESPONDING" | "SSL_ERROR" | "DATABASE_ERROR" | "PERFORMANCE_ISSUE")[];
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  isSolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Solution {
  id: string;
  issueId: string;
  whoSolved: string;
  howSolved: string;
  solvedAt: Date;
  createdAt: Date;
}

export interface SiteWithIssues extends Site {
  issues: Issue[];
  issueCount: number;
  solvedIssueCount: number;
  criticalIssueCount: number;
}

export interface IssueWithSite extends Issue {
  site: {
    id: string;
    nameOfAgency: string;
    url: string;
    province: string;
    district: string;
  };
  solutions: Solution[];
}

export interface SiteStatistics {
  totalSites: number;
  sitesWithIssues: number;
  sitesWithBackup: number;
  sitesByProvince: Record<string, number>;
  sitesByDistrict: Record<string, number>;
  backupLocations: Record<string, number>;
}

export interface IssueStatistics {
  totalIssues: number;
  solvedIssues: number;
  issuesByType: Record<string, number>;
  issuesByPriority: Record<string, number>;
  issuesBySite: Record<string, number>;
  averageResolutionTime: number;
}
