import { protectedProcedure } from "@/server/api/trpc";
import { business, users, areas, wards } from "@/server/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const assignWard = protectedProcedure
  .input(
    z.object({
      businessId: z.string(),
      wardNumber: z.number(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const ward = await ctx.db
      .select({ wardNumber: wards.wardNumber })
      .from(wards)
      .where(eq(wards.wardNumber, input.wardNumber))
      .limit(1);

    if (!ward.length) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Ward not found",
      });
    }

    await ctx.db
      .update(business)
      .set({
        wardId: ward[0].wardNumber,
        isWardValid: true,
        wardNo: input.wardNumber,
      })
      .where(eq(business.id, input.businessId));

    return { success: true };
  });

export const assignArea = protectedProcedure
  .input(
    z.object({
      businessId: z.string(),
      areaCode: z.number(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const area = await ctx.db
      .select({ id: areas.id })
      .from(areas)
      .where(eq(areas.code, input.areaCode))
      .limit(1);

    if (!area.length) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Area not found",
      });
    }

    await ctx.db
      .update(business)
      .set({
        areaId: area[0].id,
        isAreaValid: true,
        areaCode: input.areaCode,
      })
      .where(eq(business.id, input.businessId));

    return { success: true };
  });

export const assignEnumerator = protectedProcedure
  .input(
    z.object({
      businessId: z.string(),
      enumeratorId: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const enumerator = await ctx.db
      .select()
      .from(users)
      .where(
        eq(
          sql`UPPER(SUBSTRING(${users.id}::text, 1, 8))`,
          input.enumeratorId.substring(0, 8).toUpperCase(),
        ),
      )
      .limit(1);

    if (!enumerator.length) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Enumerator not found",
      });
    }

    await ctx.db
      .update(business)
      .set({
        enumeratorName: enumerator[0].name,
        enumeratorId: enumerator[0].id,
        isEnumeratorValid: true,
      })
      .where(eq(business.id, input.businessId));

    return { success: true };
  });

export const getInvalidBusinesses = protectedProcedure
  .input(
    z.object({
      filters: z
        .object({
          wardValid: z.boolean().optional(),
          areaValid: z.boolean().optional(),
          enumeratorValid: z.boolean().optional(),
          wardNumber: z.number().optional(),
          areaCode: z.number().optional(),
          enumeratorId: z.string().optional(),
        })
        .optional(),
      limit: z.number().default(10),
      offset: z.number().default(0),
      sortBy: z.string().optional(),
      sortOrder: z.enum(["asc", "desc"]).optional(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const conditions = [];

    const invalidCondition = sql`(
      ${business.isWardValid} = false OR 
      ${business.isAreaValid} = false OR 
      ${business.isEnumeratorValid} = false
    )`;
    conditions.push(invalidCondition);

    if (input.filters) {
      // ...existing code...
    }

    const whereClause = and(...conditions);
    const sortField = input.sortBy || "businessName";
    const sortOrder = input.sortOrder || "asc";

    const [data, count] = await Promise.all([
      ctx.db
        .select({
          id: business.id,
          wardId: business.wardId,
          areaId: business.areaId,
          enumeratorId: business.enumeratorId,
          wardNo: business.wardNo,
          areaCode: business.areaCode,
          isWardValid: business.isWardValid,
          isAreaValid: business.isAreaValid,
          isEnumeratorValid: business.isEnumeratorValid,
          businessName: business.businessName,
          // surveyDate: business.surveyDate,
          enumeratorName: business.enumeratorName,
        })
        .from(business)
        .leftJoin(users, eq(business.enumeratorId, users.id))
        .where(whereClause)
        .orderBy(
          sql`${business[sortField as keyof typeof business] ?? business.businessName} ${sql.raw(sortOrder)}`,
        )
        .limit(input.limit)
        .offset(input.offset),
      ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(business)
        .where(whereClause)
        .then((result) => result[0].count),
    ]);

    const validationSummary = await ctx.db
      .select({
        totalInvalid: sql<number>`count(*)`,
        invalidWard: sql<number>`sum(case when ${business.isWardValid} = false then 1 else 0 end)`,
        invalidArea: sql<number>`sum(case when ${business.isAreaValid} = false then 1 else 0 end)`,
        invalidEnumerator: sql<number>`sum(case when ${business.isEnumeratorValid} = false then 1 else 0 end)`,
      })
      .from(business)
      .where(invalidCondition);

    return {
      data,
      pagination: {
        total: count,
        limit: input.limit,
        offset: input.offset,
      },
      summary: validationSummary[0],
    };
  });
