import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { businessWithUpdatedNames } from "@/server/db/schema/business/business";
import { sql } from "drizzle-orm";
import { z } from "zod";

export const getUniqueEnumeratorsWardWise = publicProcedure
  .input(z.object({ wardId: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        wardId: businessWithUpdatedNames.wardId,
        enumeratorName: businessWithUpdatedNames.mainEnumeratorName,
        count: sql<number>`count(*)::int`,
        areaCodes: sql<string[]>`array_agg(DISTINCT ${businessWithUpdatedNames.tmpAreaCode})`,
      })
      .from(businessWithUpdatedNames)
      .where(
        input.wardId
          ? sql`${businessWithUpdatedNames.mainEnumeratorName} IS NOT NULL AND ${businessWithUpdatedNames.wardId} = ${input.wardId}`
          : sql`${businessWithUpdatedNames.mainEnumeratorName} IS NOT NULL`
      )
      .groupBy(businessWithUpdatedNames.wardId, businessWithUpdatedNames.mainEnumeratorName)
      .orderBy(businessWithUpdatedNames.wardId);

    return await query;
  });

export const getTotalBusinessByEnumerator = publicProcedure
  .input(z.object({ wardId: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        enumeratorName: businessWithUpdatedNames.mainEnumeratorName,
        totalBusinesses: sql<number>`COUNT(*)::int`,
      })
      .from(businessWithUpdatedNames)
      .where(
        input.wardId
          ? sql`${businessWithUpdatedNames.mainEnumeratorName} IS NOT NULL AND ${businessWithUpdatedNames.wardId} = ${input.wardId}`
          : sql`${businessWithUpdatedNames.mainEnumeratorName} IS NOT NULL`
      )
      .groupBy(businessWithUpdatedNames.mainEnumeratorName)
      .orderBy(businessWithUpdatedNames.mainEnumeratorName);

    return await query;
  });

export const getAllUniqueEnumerators = publicProcedure
  .query(async ({ ctx }) => {
    const query = ctx.db
      .select({
        enumeratorName: businessWithUpdatedNames.mainEnumeratorName,
      })
      .from(businessWithUpdatedNames)
      .where(sql`${businessWithUpdatedNames.mainEnumeratorName} IS NOT NULL`)
      .groupBy(businessWithUpdatedNames.mainEnumeratorName)
      .orderBy(businessWithUpdatedNames.mainEnumeratorName);

    return await query;
  });

export const getBusinessesByAreaCode = publicProcedure
  .input(z.object({ 
    enumeratorName: z.string().optional(),
    wardId: z.number().optional() 
  }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        enumeratorName: businessWithUpdatedNames.mainEnumeratorName,
        areaCode: businessWithUpdatedNames.tmpAreaCode,
        totalBusinesses: sql<number>`COUNT(*)::int`,
      })
      .from(businessWithUpdatedNames)
      .where(
        input.enumeratorName
          ? sql`${businessWithUpdatedNames.mainEnumeratorName} = ${input.enumeratorName} 
              ${input.wardId ? sql`AND ${businessWithUpdatedNames.wardId} = ${input.wardId}` : sql``}`
          : sql`${businessWithUpdatedNames.mainEnumeratorName} IS NOT NULL 
              ${input.wardId ? sql`AND ${businessWithUpdatedNames.wardId} = ${input.wardId}` : sql``}`
      )
      .groupBy(businessWithUpdatedNames.mainEnumeratorName, businessWithUpdatedNames.tmpAreaCode)
      .orderBy(businessWithUpdatedNames.mainEnumeratorName, businessWithUpdatedNames.tmpAreaCode);

    return await query;
  });

export const businessRouter = createTRPCRouter({
  getUniqueEnumeratorsWardWise,
  getTotalBusinessByEnumerator,
  getAllUniqueEnumerators,
  getBusinessesByAreaCode,
});
