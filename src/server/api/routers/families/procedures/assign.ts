import { protectedProcedure } from "@/server/api/trpc";
import {
  family,
  buildingTokens,
  users,
  areas,
  wards,
} from "@/server/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const assignWard = protectedProcedure
  .input(
    z.object({
      familyId: z.string(),
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
      .update(family)
      .set({
        wardId: ward[0].wardNumber,
        isWardValid: true,
        tmpWardNumber: input.wardNumber,
      })
      .where(eq(family.id, input.familyId));

    return { success: true };
  });

export const assignArea = protectedProcedure
  .input(
    z.object({
      familyId: z.string(),
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
      .update(family)
      .set({
        areaId: area[0].id,
        isAreaValid: true,
        tmpAreaCode: input.areaCode.toString(),
      })
      .where(eq(family.id, input.familyId));

    return { success: true };
  });

export const assignEnumerator = protectedProcedure
  .input(
    z.object({
      familyId: z.string(),
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
      .update(family)
      .set({
        enumeratorName: enumerator[0].name,
        enumeratorId: enumerator[0].id,
        isEnumeratorValid: true,
        tmpEnumeratorId: input.enumeratorId,
      })
      .where(eq(family.id, input.familyId));

    return { success: true };
  });

export const assignBuildingToken = protectedProcedure
  .input(
    z.object({
      familyId: z.string(),
      buildingToken: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const validToken = await ctx.db
      .select()
      .from(buildingTokens)
      .where(
        eq(
          sql`UPPER(SUBSTRING(${buildingTokens.token}, 1, 8))`,
          input.buildingToken.substring(0, 8).toUpperCase(),
        ),
      )
      .limit(1);

    if (!validToken.length) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Building token not found or already allocated",
      });
    }

    await ctx.db.transaction(async (tx) => {
      await tx
        .update(family)
        .set({
          buildingToken: validToken[0].token,
          isBuildingTokenValid: true,
          tmpBuildingToken: input.buildingToken,
        })
        .where(eq(family.id, input.familyId));

      await tx
        .update(buildingTokens)
        .set({
          status: "allocated",
          token: input.buildingToken,
        })
        .where(eq(buildingTokens.token, validToken[0].token));
    });

    return { success: true };
  });

export const getInvalidFamilies = protectedProcedure
  .input(
    z.object({
      filters: z
        .object({
          wardValid: z.boolean().optional(),
          areaValid: z.boolean().optional(),
          enumeratorValid: z.boolean().optional(),
          tokenValid: z.boolean().optional(),
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

    // Base condition: At least one validation is false
    const invalidCondition = sql`(
      ${family.isWardValid} = false OR 
      ${family.isAreaValid} = false OR 
      ${family.isEnumeratorValid} = false OR 
      ${family.isBuildingTokenValid} = false
    )`;
    conditions.push(invalidCondition);

    // Add specific validation filters if provided
    if (input.filters) {
      if (input.filters.wardValid !== undefined) {
        conditions.push(eq(family.isWardValid, input.filters.wardValid));
      }
      if (input.filters.areaValid !== undefined) {
        conditions.push(eq(family.isAreaValid, input.filters.areaValid));
      }
      if (input.filters.enumeratorValid !== undefined) {
        conditions.push(
          eq(family.isEnumeratorValid, input.filters.enumeratorValid),
        );
      }
      if (input.filters.tokenValid !== undefined) {
        conditions.push(
          eq(family.isBuildingTokenValid, input.filters.tokenValid),
        );
      }
      if (input.filters.wardNumber !== undefined) {
        conditions.push(eq(family.tmpWardNumber, input.filters.wardNumber));
      }
      if (input.filters.areaCode !== undefined) {
        conditions.push(
          eq(family.tmpAreaCode, input.filters.areaCode.toString()),
        );
      }
      if (input.filters.enumeratorId !== undefined) {
        conditions.push(eq(family.tmpEnumeratorId, input.filters.enumeratorId));
      }
    }

    const whereClause = and(...conditions);
    const sortField = input.sortBy || "headName";
    const sortOrder = input.sortOrder || "asc";

    const [data, count] = await Promise.all([
      ctx.db
        .select({
          id: family.id,
          wardId: family.wardId,
          areaId: family.areaId,
          enumeratorId: family.enumeratorId,
          buildingToken: family.buildingToken,
          tmpWardNumber: family.tmpWardNumber,
          tmpAreaCode: family.tmpAreaCode,
          tmpEnumeratorId: family.tmpEnumeratorId,
          tmpBuildingToken: family.tmpBuildingToken,
          isWardValid: family.isWardValid,
          isAreaValid: family.isAreaValid,
          isEnumeratorValid: family.isEnumeratorValid,
          isBuildingTokenValid: family.isBuildingTokenValid,
          locality: family.locality,
          // surveyDate: family.surveyDate,
          headName: family.headName,
          enumeratorName: family.enumeratorName,
        })
        .from(family)
        .leftJoin(users, eq(family.enumeratorId, users.id))
        .where(whereClause)
        .orderBy(
          sql`${family[sortField as keyof typeof family] ?? family.headName} ${sql.raw(sortOrder)}`,
        )
        .limit(input.limit)
        .offset(input.offset),
      ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(family)
        .where(whereClause)
        .then((result) => result[0].count),
    ]);

    // Calculate validation summary
    const validationSummary = await ctx.db
      .select({
        totalInvalid: sql<number>`count(*)`,
        invalidWard: sql<number>`sum(case when ${family.isWardValid} = false then 1 else 0 end)`,
        invalidArea: sql<number>`sum(case when ${family.isAreaValid} = false then 1 else 0 end)`,
        invalidEnumerator: sql<number>`sum(case when ${family.isEnumeratorValid} = false then 1 else 0 end)`,
        invalidToken: sql<number>`sum(case when ${family.isBuildingTokenValid} = false then 1 else 0 end)`,
      })
      .from(family)
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
