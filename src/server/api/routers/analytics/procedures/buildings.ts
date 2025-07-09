import { sql } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { and, count, eq } from "drizzle-orm";
import { buildings } from "@/server/db/schema/building";

export const getBuildingStats = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        totalBuildings: sql<number>`count(*)::int`,
        totalFamilies: sql<number>`sum(${buildings.totalFamilies})::int`,
        totalBusinesses: sql<number>`sum(${buildings.totalBusinesses})::int`,
      })
      .from(buildings);

    if (input.wardNumber) {
      query.where(eq(buildings.wardId, input.wardNumber));
    }

    return (await query)[0];
  });

export const getEmptyBuildingsStats = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        emptyBuildings: count(),
      })
      .from(buildings)
      .where(
        and(
          eq(buildings.totalFamilies, 0),
          eq(buildings.totalBusinesses, 0),
          input.wardNumber ? eq(buildings.wardId, input.wardNumber) : undefined
        )
      );

    return (await query)[0];
  });

export const getBuildingsByWard = publicProcedure.query(async ({ ctx }) => {
  return await ctx.db
    .select({
      wardNumber: buildings.wardId,
      totalBuildings: sql<number>`count(*)::int`,
      totalFamilies: sql<number>`sum(${buildings.totalFamilies})::int`,
      totalBusinesses: sql<number>`sum(${buildings.totalBusinesses})::int`,
      emptyBuildings: sql<number>`sum(case when total_families = 0 and total_businesses = 0 then 1 else 0 end)::int`,
    })
    .from(buildings)
    .groupBy(buildings.wardId);
});

export const getBuildingsByStatus = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        status: buildings.status,
        count: sql<number>`count(*)::int`,
      })
      .from(buildings);

    if (input.wardNumber) {
      query.where(eq(buildings.wardId, input.wardNumber));
    }

    return await query.groupBy(buildings.status);
  });
