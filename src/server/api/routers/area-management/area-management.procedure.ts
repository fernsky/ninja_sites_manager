import { TRPCError } from "@trpc/server";
import { eq, and, sql, SQL } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { areas, enumeratorAssignments, users } from "@/server/db/schema";
import {
  updateAreaStatusSchema,
  approveCompletionSchema,
  requestRevisionSchema,
  handleWithdrawalSchema,
  getAreaActionsSchema,
  handleActionSchema,
} from "./area-management.schema";
import { v4 } from "uuid";

export const areaManagementRouter = createTRPCRouter({
  updateAreaStatus: protectedProcedure
    .input(updateAreaStatusSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "superadmin" && ctx.user.role !== "supervisor") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Must be an admin or supervisor to update area status",
        });
      }

      await ctx.db.transaction(async (tx) => {
        // Update area status
        await tx
          .update(areas)
          .set({
            areaStatus: input.status,
          })
          .where(eq(areas.id, input.areaId));

        // Record in assignments history
        await tx.insert(enumeratorAssignments).values({
          id: v4(),
          areaId: input.areaId,
          assignedTo: ctx.user.id,
          status: input.status,
        });
      });

      return { success: true };
    }),

  approveCompletion: protectedProcedure
    .input(approveCompletionSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "superadmin" && ctx.user.role !== "supervisor") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Must be an admin or supervisor to approve completion",
        });
      }

      await ctx.db.transaction(async (tx) => {
        // Update area to unassigned and remove assignedTo
        await tx
          .update(areas)
          .set({
            areaStatus: "completed",
            assignedTo: null,  // This line already sets assignedTo to null
          })
          .where(eq(areas.id, input.areaId));

        // Record completion in assignment history
        await tx.insert(enumeratorAssignments).values({
          id: v4(),
          areaId: input.areaId,
          assignedTo: ctx.user.id,
          status: "completed",
        });
      });

      return { success: true };
    }),

  requestRevision: protectedProcedure
    .input(requestRevisionSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "superadmin" && ctx.user.role !== "supervisor") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Must be an admin or supervisor to request revision",
        });
      }

      await ctx.db.transaction(async (tx) => {
        await tx
          .update(areas)
          .set({ areaStatus: "revision" })
          .where(eq(areas.id, input.areaId));

        await tx.insert(enumeratorAssignments).values({
          id: v4(),
          areaId: input.areaId,
          assignedTo: ctx.user.id,
          status: "revision",
        });
      });

      return { success: true };
    }),

  handleWithdrawal: protectedProcedure
    .input(handleWithdrawalSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "superadmin" && ctx.user.role !== "supervisor") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "Must be an admin or supervisor to handle withdrawal requests",
        });
      }

      await ctx.db.transaction(async (tx) => {
        // If approved, unassign area. If rejected, return to ongoing_survey
        const newStatus = input.approved ? "unassigned" : "ongoing_survey";
        const newAssignedTo = input.approved ? null : undefined; // Keep current assignee if rejected

        await tx
          .update(areas)
          .set({
            areaStatus: newStatus,
            ...(newAssignedTo !== undefined && { assignedTo: newAssignedTo }),
          })
          .where(eq(areas.id, input.areaId));

        await tx.insert(enumeratorAssignments).values({
          id: v4(),
          areaId: input.areaId,
          assignedTo: ctx.user.id,
          status: newStatus,
        });
      });

      return { success: true };
    }),

  getPendingActions: protectedProcedure
    .input(getAreaActionsSchema)
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "superadmin" && ctx.user.role !== "supervisor") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized access",
        });
      }

      const conditions: SQL<unknown>[] = [];
      if (input.status && input.status !== "all") {
        conditions.push(eq(areas.areaStatus, input.status));
      }
      if (input.wardNumber)
        conditions.push(eq(areas.wardNumber, input.wardNumber));
      conditions.push(
        sql`${areas.areaStatus} IN ('asked_for_completion', 'asked_for_revision_completion', 'asked_for_withdrawl')`,
      );

      const [actionsResult, totalCount] = await Promise.all([
        ctx.db
          .select({
            id: areas.id,
            code: areas.code,
            wardNumber: areas.wardNumber,
            areaStatus: areas.areaStatus,
            assignedTo: {
              id: users.id,
              name: users.name,
            },
          })
          .from(areas)
          .leftJoin(users, eq(areas.assignedTo, users.id))
          .where(and(...conditions))
          .limit(input.limit)
          .offset(input.page * input.limit),
        ctx.db
          .select({ count: sql<number>`count(*)` })
          .from(areas)
          .where(and(...conditions)),
      ]);

      return {
        actions: actionsResult,
        pagination: {
          total: totalCount[0].count,
          pageCount: Math.ceil(totalCount[0].count / input.limit),
          page: input.page,
          limit: input.limit,
        },
      };
    }),

  handleAction: protectedProcedure
    .input(handleActionSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "superadmin" && ctx.user.role !== "supervisor") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized access",
        });
      }

      const area = await ctx.db.query.areas.findFirst({
        columns: {
          id: true,
          assignedTo: true,
          areaStatus: true,
        },
        where: (areas, { eq }) => eq(areas.id, input.areaId),
      });

      if (!area) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Area not found",
        });
      }

      await ctx.db.transaction(async (tx) => {
        await tx
          .update(areas)
          .set({
            areaStatus: input.newStatus,
            assignedTo:
              input.newStatus === "unassigned" ||
              input.newStatus === "completed"
                ? null
                : area.assignedTo,
          })
          .where(eq(areas.id, input.areaId));

        await tx
          .update(enumeratorAssignments)
          .set({
            status: input.newStatus,
          })
          .where(eq(enumeratorAssignments.areaId, input.areaId));
      });

      return { success: true };
    }),
});
