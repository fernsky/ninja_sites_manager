import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { familyWithUpdatedNames } from "@/server/db/schema/family/family";
import { sql } from "drizzle-orm";
import { z } from "zod";

export const getUniqueEnumeratorsWardWise = publicProcedure
  .input(z.object({ wardId: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        wardId: familyWithUpdatedNames.wardId,
        enumeratorName: familyWithUpdatedNames.mainEnumeratorName,
        count: sql<number>`count(*)::int`,
        areaCodes: sql<string[]>`array_agg(DISTINCT ${familyWithUpdatedNames.tmpAreaCode})`,
      })
      .from(familyWithUpdatedNames)
      .where(
        input.wardId
          ? sql`${familyWithUpdatedNames.mainEnumeratorName} IS NOT NULL AND ${familyWithUpdatedNames.wardId} = ${input.wardId}`
          : sql`${familyWithUpdatedNames.mainEnumeratorName} IS NOT NULL`
      )
      .groupBy(familyWithUpdatedNames.wardId, familyWithUpdatedNames.mainEnumeratorName)
      .orderBy(familyWithUpdatedNames.wardId);

    return await query;
  });

export const getTotalFamilyByEnumerator = publicProcedure
  .input(z.object({ wardId: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        enumeratorName: familyWithUpdatedNames.mainEnumeratorName,
        totalFamilies: sql<number>`COUNT(*)::int`,
      })
      .from(familyWithUpdatedNames)
      .where(
        input.wardId
          ? sql`${familyWithUpdatedNames.mainEnumeratorName} IS NOT NULL AND ${familyWithUpdatedNames.wardId} = ${input.wardId}`
          : sql`${familyWithUpdatedNames.mainEnumeratorName} IS NOT NULL`
      )
      .groupBy(familyWithUpdatedNames.mainEnumeratorName)
      .orderBy(familyWithUpdatedNames.mainEnumeratorName);

    return await query;
  });

export const getAllUniqueEnumerators = publicProcedure
  .query(async ({ ctx }) => {
    const query = ctx.db
      .select({
        enumeratorName: familyWithUpdatedNames.mainEnumeratorName,
      })
      .from(familyWithUpdatedNames)
      .where(sql`${familyWithUpdatedNames.mainEnumeratorName} IS NOT NULL`)
      .groupBy(familyWithUpdatedNames.mainEnumeratorName)
      .orderBy(familyWithUpdatedNames.mainEnumeratorName);

    return await query;
  });

export const getFamiliesByAreaCode = publicProcedure
  .input(z.object({ 
    enumeratorName: z.string().optional(),
    wardId: z.number().optional() 
  }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        enumeratorName: familyWithUpdatedNames.mainEnumeratorName,
        areaCode: familyWithUpdatedNames.tmpAreaCode,
        totalFamilies: sql<number>`COUNT(*)::int`,
      })
      .from(familyWithUpdatedNames)
      .where(
        input.enumeratorName
          ? sql`${familyWithUpdatedNames.mainEnumeratorName} = ${input.enumeratorName} 
              ${input.wardId ? sql`AND ${familyWithUpdatedNames.wardId} = ${input.wardId}` : sql``}`
          : sql`${familyWithUpdatedNames.mainEnumeratorName} IS NOT NULL 
              ${input.wardId ? sql`AND ${familyWithUpdatedNames.wardId} = ${input.wardId}` : sql``}`
      )
      .groupBy(familyWithUpdatedNames.mainEnumeratorName, familyWithUpdatedNames.tmpAreaCode)
      .orderBy(familyWithUpdatedNames.mainEnumeratorName, familyWithUpdatedNames.tmpAreaCode);

    return await query;
  });

export const familyRouter = createTRPCRouter({
  getUniqueEnumeratorsWardWise,
  getTotalFamilyByEnumerator,
  getAllUniqueEnumerators,
  getFamiliesByAreaCode,
});
