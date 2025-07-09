import { protectedProcedure } from "@/server/api/trpc";
import {
  business,
  businessEditRequests,
} from "@/server/db/schema/business/business";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { v4 as uuidv4 } from "uuid";

export const approve = protectedProcedure
  .input(z.object({ businessId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only admins can approve businesses",
      });
    }

    await ctx.db
      .update(business)
      .set({ status: "approved" })
      .where(eq(business.id, input.businessId));

    return { success: true };
  });

export const requestEdit = protectedProcedure
  .input(z.object({ businessId: z.string(), message: z.string() }))
  .mutation(async ({ ctx, input }) => {
    if (!ctx.user?.role || ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only admins can request edits",
      });
    }

    await ctx.db.transaction(async (tx) => {
      await tx
        .update(business)
        .set({ status: "requested_for_edit" })
        .where(eq(business.id, input.businessId));

      await tx.insert(businessEditRequests).values({
        id: uuidv4(),
        businessId: input.businessId,
        message: input.message,
      });
    });

    return { success: true };
  });

export const reject = protectedProcedure
  .input(z.object({ businessId: z.string(), message: z.string() }))
  .mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only admins can reject businesses",
      });
    }

    await ctx.db.transaction(async (tx) => {
      await tx
        .update(business)
        .set({ status: "rejected" })
        .where(eq(business.id, input.businessId));

      await tx.insert(businessEditRequests).values({
        id: uuidv4(),
        businessId: input.businessId,
        message: input.message,
      });
    });

    return { success: true };
  });

export const getStatusHistory = protectedProcedure
  .input(z.object({ businessId: z.string() }))
  .query(async ({ ctx, input }) => {
    const history = await ctx.db
      .select()
      .from(businessEditRequests)
      .where(eq(businessEditRequests.businessId, input.businessId))
      .orderBy(desc(businessEditRequests.requestedAt));

    return history;
  });
