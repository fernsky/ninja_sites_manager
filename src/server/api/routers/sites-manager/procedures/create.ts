import { createTRPCRouter, protectedProcedure } from "../../../trpc";
import { z } from "zod";
import { sites } from "@/server/db/schema/sites-manager/sites";
import { issues } from "@/server/db/schema/sites-manager/issues";
import { solutions } from "@/server/db/schema/sites-manager/solutions";
import { eq, sql, and } from "drizzle-orm";
import { createSiteSchema } from "../manager.schema";
import { nanoid } from "nanoid";

export const createSite = protectedProcedure
  .input(createSiteSchema)
  .mutation(async ({ ctx, input }) => {
    const id = nanoid();
    
    try {
      // Start a transaction
      const result = await ctx.db.transaction(async (tx) => {
        // Create the site
        const newSite = await tx.insert(sites).values({
          id,
          nameOfAgency: input.nameOfAgency,
          url: input.url,
          isCpanel: input.isCpanel,
          cpanelUsername: input.cpanelUsername || null,
          cpanelPassword: input.cpanelPassword || null,
          isVm: input.isVm,
          vpnUsername: input.vpnUsername || null,
          vpnPassword: input.vpnPassword || null,
          vmIp: input.vmIp || null,
          vmUsername: input.vmUsername || null,
          vmPassword: input.vmPassword || null,
          province: input.province,
          district: input.district,
          hasTakenManualBackup: input.hasTakenManualBackup,
          lastManualBackupDate: input.lastManualBackupDate || null,
          lastDatabaseBackupDate: input.lastDatabaseBackupDate || null,
          backupLocation: input.backupLocation || null,
          hasIssues: input.issues && input.issues.length > 0, // Set based on whether issues exist
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning({ id: sites.id });

        // Create issues if provided
        if (input.issues && input.issues.length > 0) {
          const issueValues = input.issues.map(issue => ({
            id: nanoid(),
            siteId: id,
            issueTypes: issue.issueTypes,
            description: issue.description,
            priority: issue.priority,
            isSolved: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          }));

          await tx.insert(issues).values(issueValues);
        }

        return newSite[0].id;
      });

      return { success: true, id: result };
    } catch (error) {
      console.error("Error creating site:", error);
      throw new Error("Failed to create site");
    }
  });

export const updateSite = protectedProcedure
  .input(z.object({
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
    issues: z
      .array(
        z.object({
          id: z.string().optional(), // Optional for new issues
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
          isSolved: z.boolean().default(false),
        }),
      )
      .optional(),
  }))
  .mutation(async ({ ctx, input }) => {
    const { id, issues: inputIssues, ...updateData } = input;
    
    try {
      // Start a transaction
      await ctx.db.transaction(async (tx) => {
        // Update the site
        const updatePayload: any = {
          updatedAt: new Date(),
        };

        // Map camelCase fields to database columns
        if (updateData.nameOfAgency !== undefined) updatePayload.nameOfAgency = updateData.nameOfAgency;
        if (updateData.url !== undefined) updatePayload.url = updateData.url;
        if (updateData.isCpanel !== undefined) updatePayload.isCpanel = updateData.isCpanel;
        if (updateData.cpanelUsername !== undefined) updatePayload.cpanelUsername = updateData.cpanelUsername;
        if (updateData.cpanelPassword !== undefined) updatePayload.cpanelPassword = updateData.cpanelPassword;
        if (updateData.isVm !== undefined) updatePayload.isVm = updateData.isVm;
        if (updateData.vpnUsername !== undefined) updatePayload.vpnUsername = updateData.vpnUsername;
        if (updateData.vpnPassword !== undefined) updatePayload.vpnPassword = updateData.vpnPassword;
        if (updateData.vmIp !== undefined) updatePayload.vmIp = updateData.vmIp;
        if (updateData.vmUsername !== undefined) updatePayload.vmUsername = updateData.vmUsername;
        if (updateData.vmPassword !== undefined) updatePayload.vmPassword = updateData.vmPassword;
        if (updateData.province !== undefined) updatePayload.province = updateData.province;
        if (updateData.district !== undefined) updatePayload.district = updateData.district;
        if (updateData.hasTakenManualBackup !== undefined) updatePayload.hasTakenManualBackup = updateData.hasTakenManualBackup;
        if (updateData.lastManualBackupDate !== undefined) updatePayload.lastManualBackupDate = updateData.lastManualBackupDate;
        if (updateData.lastDatabaseBackupDate !== undefined) updatePayload.lastDatabaseBackupDate = updateData.lastDatabaseBackupDate;
        if (updateData.backupLocation !== undefined) updatePayload.backupLocation = updateData.backupLocation;
        
        // Update hasIssues based on whether issues exist
        if (inputIssues !== undefined) {
          updatePayload.hasIssues = inputIssues.length > 0;
        }

        await tx
          .update(sites)
          .set(updatePayload)
          .where(eq(sites.id, id));

        // Handle issues updates if provided
        if (inputIssues !== undefined) {
          // Delete existing issues for this site
          await tx.delete(issues).where(eq(issues.siteId, id));

          // Create new issues if any
          if (inputIssues.length > 0) {
            const issueValues = inputIssues.map(issue => ({
              id: issue.id || nanoid(), // Use existing ID or generate new one
              siteId: id,
              issueTypes: issue.issueTypes,
              description: issue.description,
              priority: issue.priority,
              isSolved: issue.isSolved,
              createdAt: new Date(),
              updatedAt: new Date(),
            }));

            await tx.insert(issues).values(issueValues);
          }
        }
      });

      return { success: true };
    } catch (error) {
      console.error("Error updating site:", error);
      throw new Error("Failed to update site");
    }
  });

export const deleteSite = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    try {
      // Start a transaction to delete both site and associated issues
      await ctx.db.transaction(async (tx) => {
        // Delete associated issues first
        await tx.delete(issues).where(eq(issues.siteId, input.id));
        
        // Then delete the site
        await tx.delete(sites).where(eq(sites.id, input.id));
      });

      return { success: true };
    } catch (error) {
      console.error("Error deleting site:", error);
      throw new Error("Failed to delete site");
    }
  });

export const updateBackupStatus = protectedProcedure
  .input(z.object({
    siteId: z.string(),
    hasTakenManualBackup: z.boolean(),
    lastManualBackupDate: z.date().optional(),
    lastDatabaseBackupDate: z.date().optional(),
    backupLocation: z.enum(["LOCAL", "AWS", "TELEGRAM"]).optional(),
  }))
  .mutation(async ({ ctx, input }) => {
    try {
      const updatePayload: any = {
        has_taken_manual_backup: input.hasTakenManualBackup,
        updated_at: new Date(),
      };

      if (input.lastManualBackupDate !== undefined) {
        updatePayload.last_manual_backup_date = input.lastManualBackupDate;
      }
      if (input.lastDatabaseBackupDate !== undefined) {
        updatePayload.last_database_backup_date = input.lastDatabaseBackupDate;
      }
      if (input.backupLocation !== undefined) {
        updatePayload.backup_location = input.backupLocation;
      }

      await ctx.db
        .update(sites)
        .set(updatePayload)
        .where(eq(sites.id, input.siteId));

      return { success: true };
    } catch (error) {
      console.error("Error updating backup status:", error);
      throw new Error("Failed to update backup status");
    }
  });

export const bulkUpdateSites = protectedProcedure
  .input(z.object({
    siteIds: z.array(z.string()).min(1, "At least one site ID is required"),
    updates: z.object({
      hasTakenManualBackup: z.boolean().optional(),
      lastManualBackupDate: z.date().optional(),
      lastDatabaseBackupDate: z.date().optional(),
      backupLocation: z.enum(["LOCAL", "AWS", "TELEGRAM"]).optional(),
      hasIssues: z.boolean().optional(),
    }),
  }))
  .mutation(async ({ ctx, input }) => {
    try {
      const updatePayload: any = {
        updatedAt: new Date(),
      };

      if (input.updates.hasTakenManualBackup !== undefined) {
        updatePayload.hasTakenManualBackup = input.updates.hasTakenManualBackup;
      }
      if (input.updates.lastManualBackupDate !== undefined) {
        updatePayload.lastManualBackupDate = input.updates.lastManualBackupDate;
      }
      if (input.updates.lastDatabaseBackupDate !== undefined) {
        updatePayload.lastDatabaseBackupDate = input.updates.lastDatabaseBackupDate;
      }
      if (input.updates.backupLocation !== undefined) {
        updatePayload.backupLocation = input.updates.backupLocation;
      }
      if (input.updates.hasIssues !== undefined) {
        updatePayload.hasIssues = input.updates.hasIssues;
      }

      await ctx.db
        .update(sites)
        .set(updatePayload)
        .where(sql`${sites.id} = ANY(${input.siteIds})`);

      return { success: true, updatedCount: input.siteIds.length };
    } catch (error) {
      console.error("Error bulk updating sites:", error);
      throw new Error("Failed to bulk update sites");
    }
  });

// Issue Management Procedures
export const updateIssue = protectedProcedure
  .input(z.object({
    id: z.string(),
    issueTypes: z.array(z.enum([
      "CSS_ERROR",
      "NOT_FOUND_404",
      "INTERNAL_SERVER_ERROR",
      "HACKED",
      "NOT_RESPONDING",
      "SSL_ERROR",
      "DATABASE_ERROR",
      "PERFORMANCE_ISSUE",
    ])).optional(),
    description: z.string().min(1, "Description is required").max(1000, "Description too long").optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
    isSolved: z.boolean().optional(),
  }))
  .mutation(async ({ ctx, input }) => {
    const { id, ...updateData } = input;
    
    try {
      const updatePayload: any = {
        updatedAt: new Date(),
      };

      if (updateData.issueTypes !== undefined) updatePayload.issueTypes = updateData.issueTypes;
      if (updateData.description !== undefined) updatePayload.description = updateData.description;
      if (updateData.priority !== undefined) updatePayload.priority = updateData.priority;
      if (updateData.isSolved !== undefined) updatePayload.isSolved = updateData.isSolved;

      await ctx.db
        .update(issues)
        .set(updatePayload)
        .where(eq(issues.id, id));

      return { success: true };
    } catch (error) {
      console.error("Error updating issue:", error);
      throw new Error("Failed to update issue");
    }
  });

export const solveIssue = protectedProcedure
  .input(z.object({
    issueId: z.string(),
    whoSolved: z.string().min(1, "Solver name is required"),
    howSolved: z.string().min(1, "Solution description is required").max(2000, "Solution description too long"),
  }))
  .mutation(async ({ ctx, input }) => {
    try {
      // Start a transaction
      await ctx.db.transaction(async (tx) => {
        // Create solution record
        await tx.insert(solutions).values({
          id: nanoid(),
          issueId: input.issueId,
          whoSolved: input.whoSolved,
          howSolved: input.howSolved,
          solvedAt: new Date(),
          createdAt: new Date(),
        });

        // Update issue as solved
        await tx
          .update(issues)
          .set({
            isSolved: true,
            updatedAt: new Date(),
          })
          .where(eq(issues.id, input.issueId));

        // Get the site ID for this issue
        const issueData = await tx
          .select({ siteId: issues.siteId })
          .from(issues)
          .where(eq(issues.id, input.issueId))
          .limit(1);

        if (issueData[0]) {
          // Check if this was the last unsolved issue for the site
          const remainingUnsolvedIssues = await tx
            .select({ count: sql<number>`count(*)` })
            .from(issues)
            .where(and(
              eq(issues.siteId, issueData[0].siteId),
              eq(issues.isSolved, false)
            ))
            .then((result) => result[0].count);

          // Update site's hasIssues status
          await tx
            .update(sites)
            .set({
              hasIssues: remainingUnsolvedIssues > 0,
              updatedAt: new Date(),
            })
            .where(eq(sites.id, issueData[0].siteId));
        }
      });

      return { success: true };
    } catch (error) {
      console.error("Error solving issue:", error);
      throw new Error("Failed to solve issue");
    }
  });

export const deleteIssue = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    try {
      // Start a transaction
      await ctx.db.transaction(async (tx) => {
        // Get the site ID for this issue
        const issueData = await tx
          .select({ siteId: issues.siteId })
          .from(issues)
          .where(eq(issues.id, input.id))
          .limit(1);

        // Delete the issue (this will cascade to solutions)
        await tx.delete(issues).where(eq(issues.id, input.id));

        if (issueData[0]) {
          // Check if there are any remaining issues for the site
          const remainingIssues = await tx
            .select({ count: sql<number>`count(*)` })
            .from(issues)
            .where(eq(issues.siteId, issueData[0].siteId))
            .then((result) => result[0].count);

          // Update site's hasIssues status
          await tx
            .update(sites)
            .set({
              hasIssues: remainingIssues > 0,
              updatedAt: new Date(),
            })
            .where(eq(sites.id, issueData[0].siteId));
        }
      });

      return { success: true };
    } catch (error) {
      console.error("Error deleting issue:", error);
      throw new Error("Failed to delete issue");
    }
  });
