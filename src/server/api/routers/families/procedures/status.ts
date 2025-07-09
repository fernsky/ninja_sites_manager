import { protectedProcedure } from "@/server/api/trpc";
import { family, familyEditRequests } from "@/server/db/schema/family/family";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { v4 as uuidv4 } from "uuid";

export const approve = protectedProcedure
  .input(z.object({ familyId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only admins can approve families",
      });
    }

    const familyEntity = await ctx.db.query.family.findFirst({
      where: eq(family.id, input.familyId),
      columns: { status: true },
    });

    if (!familyEntity || familyEntity.status !== "pending") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Only pending families can be approved",
      });
    }

    await ctx.db
      .update(family)
      .set({ status: "approved" })
      .where(eq(family.id, input.familyId));

    return { success: true };
  });

export const requestEdit = protectedProcedure
  .input(z.object({ familyId: z.string(), message: z.string() }))
  .mutation(async ({ ctx, input }) => {
    if (!ctx.user?.role || ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only admins can request edits",
      });
    }

    const familyEntity = await ctx.db.query.family.findFirst({
      where: eq(family.id, input.familyId),
      columns: { status: true },
    });

    if (!familyEntity || familyEntity.status !== "pending") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Only pending families can be requested for edit",
      });
    }

    await ctx.db.transaction(async (tx) => {
      await tx
        .update(family)
        .set({ status: "requested_for_edit" })
        .where(eq(family.id, input.familyId));

      await tx.insert(familyEditRequests).values({
        id: uuidv4(),
        familyId: input.familyId,
        message: input.message,
      });
    });

    return { success: true };
  });

export const reject = protectedProcedure
  .input(z.object({ familyId: z.string(), message: z.string() }))
  .mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only admins can reject families",
      });
    }

    const familyEntity = await ctx.db.query.family.findFirst({
      where: eq(family.id, input.familyId),
      columns: { status: true },
    });

    if (!familyEntity || familyEntity.status !== "pending") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Only pending families can be rejected",
      });
    }

    await ctx.db.transaction(async (tx) => {
      await tx
        .update(family)
        .set({ status: "rejected" })
        .where(eq(family.id, input.familyId));

      await tx.insert(familyEditRequests).values({
        id: uuidv4(),
        familyId: input.familyId,
        message: input.message,
      });
    });

    return { success: true };
  });

export const getStatusHistory = protectedProcedure
  .input(z.object({ familyId: z.string() }))
  .query(async ({ ctx, input }) => {
    const history = await ctx.db
      .select()
      .from(familyEditRequests)
      .where(eq(familyEditRequests.familyId, input.familyId))
      .orderBy(desc(familyEditRequests.requestedAt));

    return history;
  });
