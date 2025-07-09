import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { buildingsWithUpdatedNames } from "@/server/db/schema/building";
import { sql } from "drizzle-orm";
import { z } from "zod";

export const getUniqueEnumeratorsWardWise = publicProcedure
    .input(z.object({ wardId: z.number().optional() }))
    .query(async ({ ctx, input }) => {
        const query = ctx.db
            .select({
                wardId: buildingsWithUpdatedNames.wardId,
                enumeratorName: buildingsWithUpdatedNames.mainEnumeratorName,
                count: sql<number>`count(*)::int`,
                areaCodes: sql<string[]>`array_agg(DISTINCT ${buildingsWithUpdatedNames.tmpAreaCode})`,
            })
            .from(buildingsWithUpdatedNames)
            .where(
                input.wardId
                    ? sql`${buildingsWithUpdatedNames.mainEnumeratorName} IS NOT NULL AND ${buildingsWithUpdatedNames.wardId} = ${input.wardId}`
                    : sql`${buildingsWithUpdatedNames.mainEnumeratorName} IS NOT NULL`
            )
            .groupBy(buildingsWithUpdatedNames.wardId, buildingsWithUpdatedNames.mainEnumeratorName)
            .orderBy(buildingsWithUpdatedNames.wardId);

        // Print the raw SQL query
        console.log('Raw SQL Query:', query.toSQL());
    

        return await query;
    });

export const getTotalBuildingsByEnumerator = publicProcedure
  .input(z.object({ wardId: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        enumeratorName: buildingsWithUpdatedNames.mainEnumeratorName,
        totalBuildings: sql<number>`COUNT(*)::int`,
      })
      .from(buildingsWithUpdatedNames)
      .where(
        input.wardId
          ? sql`${buildingsWithUpdatedNames.mainEnumeratorName} IS NOT NULL AND ${buildingsWithUpdatedNames.wardId} = ${input.wardId}`
          : sql`${buildingsWithUpdatedNames.mainEnumeratorName} IS NOT NULL`
      )
      .groupBy(buildingsWithUpdatedNames.mainEnumeratorName)
      .orderBy(buildingsWithUpdatedNames.mainEnumeratorName);

    return await query;
  });

export const getAllUniqueEnumerators = publicProcedure
  .query(async ({ ctx }) => {
    const query = ctx.db
      .select({
        enumeratorName: buildingsWithUpdatedNames.mainEnumeratorName,
      })
      .from(buildingsWithUpdatedNames)
      .where(sql`${buildingsWithUpdatedNames.mainEnumeratorName} IS NOT NULL`)
      .groupBy(buildingsWithUpdatedNames.mainEnumeratorName)
      .orderBy(buildingsWithUpdatedNames.mainEnumeratorName);

    return await query;
  });

export const getBuildingsByAreaCode = publicProcedure
  .input(z.object({ 
    enumeratorName: z.string().optional(),
    wardId: z.number().optional() 
  }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        enumeratorName: buildingsWithUpdatedNames.mainEnumeratorName,
        areaCode: buildingsWithUpdatedNames.tmpAreaCode,
        totalBuildings: sql<number>`COUNT(*)::int`,
      })
      .from(buildingsWithUpdatedNames)
      .where(
        input.enumeratorName
          ? sql`${buildingsWithUpdatedNames.mainEnumeratorName} = ${input.enumeratorName} 
              ${input.wardId ? sql`AND ${buildingsWithUpdatedNames.wardId} = ${input.wardId}` : sql``}`
          : sql`${buildingsWithUpdatedNames.mainEnumeratorName} IS NOT NULL 
              ${input.wardId ? sql`AND ${buildingsWithUpdatedNames.wardId} = ${input.wardId}` : sql``}`
      )
      .groupBy(buildingsWithUpdatedNames.mainEnumeratorName, buildingsWithUpdatedNames.tmpAreaCode)
      .orderBy(buildingsWithUpdatedNames.mainEnumeratorName, buildingsWithUpdatedNames.tmpAreaCode);

    return await query;
  });

export const buildingsRouter = createTRPCRouter({
  getUniqueEnumeratorsWardWise,
  getTotalBuildingsByEnumerator,
  getAllUniqueEnumerators,
  getBuildingsByAreaCode,
});


