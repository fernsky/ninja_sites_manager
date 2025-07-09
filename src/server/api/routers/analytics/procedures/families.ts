import { sql } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { and, count, eq } from "drizzle-orm";
import { family } from "@/server/db/schema/family/family";

export const getFamilyStats = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        totalFamilies: sql<number>`count(*)::int`,
        totalMembers: sql<number>`sum(${family.totalMembers})::int`,
        sanitizedFamilies: sql<number>`sum(case when ${family.isSanitized} = true then 1 else 0 end)::int`,
      })
      .from(family);

    if (input.wardNumber) {
      query.where(eq(family.wardNo, input.wardNumber));
    }

    return (await query)[0];
  });

export const getFamiliesByWard = publicProcedure.query(async ({ ctx }) => {
  return await ctx.db
    .select({
      wardNumber: family.wardNo,
      totalFamilies: sql<number>`count(*)::int`,
      totalMembers: sql<number>`sum(${family.totalMembers})::int`,
      sanitizedFamilies: sql<number>`sum(case when ${family.isSanitized} = true then 1 else 0 end)::int`,
    })
    .from(family)
    .groupBy(family.wardNo);
});

export const getFamilyStatusDistribution = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        status: family.status,
        count: sql<number>`count(*)::int`,
      })
      .from(family);

    if (input.wardNumber) {
      query.where(eq(family.wardNo, input.wardNumber));
    }

    return await query.groupBy(family.status);
  });

export const getFamilyHousingOwnership = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        ownership: family.houseOwnership,
        count: sql<number>`count(*)::int`,
      })
      .from(family);

    if (input.wardNumber) {
      query.where(eq(family.wardNo, input.wardNumber));
    }

    return await query.groupBy(family.houseOwnership);
  });
