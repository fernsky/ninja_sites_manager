import { protectedProcedure } from "@/server/api/trpc";
import {
  buildings,
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
      buildingId: z.string(),
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
      .update(buildings)
      .set({
        wardId: ward[0].wardNumber,
        isWardValid: true,
        tmpWardNumber: input.wardNumber,
      })
      .where(eq(buildings.id, input.buildingId));

    return { success: true };
  });

export const assignArea = protectedProcedure
  .input(
    z.object({
      buildingId: z.string(),
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
      .update(buildings)
      .set({
        areaId: area[0].id,
        isAreaValid: true,
        tmpAreaCode: input.areaCode.toString(),
      })
      .where(eq(buildings.id, input.buildingId));

    return { success: true };
  });

export const assignEnumerator = protectedProcedure
  .input(
    z.object({
      buildingId: z.string(),
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
      .update(buildings)
      .set({
        enumeratorName: enumerator[0].name,
        enumeratorId: enumerator[0].id,
        isEnumeratorValid: true,
        tmpEnumeratorId: input.enumeratorId,
      })
      .where(eq(buildings.id, input.buildingId));

    return { success: true };
  });

export const assignBuildingToken = protectedProcedure
  .input(
    z.object({
      buildingId: z.string(),
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
        .update(buildings)
        .set({
          buildingToken: validToken[0].token,
          isBuildingTokenValid: true,
          tmpBuildingToken: input.buildingToken,
        })
        .where(eq(buildings.id, input.buildingId));

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

export const getInvalidBuildings = protectedProcedure
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
      ${buildings.isWardValid} = false OR 
      ${buildings.isAreaValid} = false OR 
      ${buildings.isEnumeratorValid} = false OR 
      ${buildings.isBuildingTokenValid} = false
    )`;
    conditions.push(invalidCondition);

    // Add specific validation filters if provided
    if (input.filters) {
      if (input.filters.wardValid !== undefined) {
        conditions.push(eq(buildings.isWardValid, input.filters.wardValid));
      }
      if (input.filters.areaValid !== undefined) {
        conditions.push(eq(buildings.isAreaValid, input.filters.areaValid));
      }
      if (input.filters.enumeratorValid !== undefined) {
        conditions.push(
          eq(buildings.isEnumeratorValid, input.filters.enumeratorValid),
        );
      }
      if (input.filters.tokenValid !== undefined) {
        conditions.push(
          eq(buildings.isBuildingTokenValid, input.filters.tokenValid),
        );
      }
      if (input.filters.wardNumber !== undefined) {
        conditions.push(eq(buildings.tmpWardNumber, input.filters.wardNumber));
      }
      if (input.filters.areaCode !== undefined) {
        conditions.push(
          eq(buildings.tmpAreaCode, input.filters.areaCode.toString()),
        );
      }
      if (input.filters.enumeratorId !== undefined) {
        conditions.push(
          eq(buildings.tmpEnumeratorId, input.filters.enumeratorId),
        );
      }
    }

    const whereClause = and(...conditions);

    const sortField = input.sortBy || "locality";
    const sortOrder = input.sortOrder || "asc";

    const [data, count] = await Promise.all([
      ctx.db
        .select({
          id: buildings.id,
          wardId: buildings.wardId,
          areaId: buildings.areaId,
          enumeratorId: buildings.enumeratorId,
          buildingToken: buildings.buildingToken,
          tmpWardNumber: buildings.tmpWardNumber,
          tmpAreaCode: buildings.tmpAreaCode,
          tmpEnumeratorId: buildings.tmpEnumeratorId,
          tmpBuildingToken: buildings.tmpBuildingToken,
          isWardValid: buildings.isWardValid,
          isAreaValid: buildings.isAreaValid,
          isEnumeratorValid: buildings.isEnumeratorValid,
          isBuildingTokenValid: buildings.isBuildingTokenValid,
          locality: buildings.locality,
          surveyDate: buildings.surveyDate,

          enumeratorName: buildings.enumeratorName,
        })
        .from(buildings)
        .leftJoin(users, eq(buildings.enumeratorId, users.id))
        .where(whereClause)
        .orderBy(
          sql`${buildings[sortField as keyof typeof buildings] ?? buildings.locality} ${sql.raw(sortOrder)}`,
        )
        .limit(input.limit)
        .offset(input.offset),
      ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(buildings)
        .where(whereClause)
        .then((result) => result[0].count),
    ]);

    // Calculate validation summary
    const validationSummary = await ctx.db
      .select({
        totalInvalid: sql<number>`count(*)`,
        invalidWard: sql<number>`sum(case when ${buildings.isWardValid} = false then 1 else 0 end)`,
        invalidArea: sql<number>`sum(case when ${buildings.isAreaValid} = false then 1 else 0 end)`,
        invalidEnumerator: sql<number>`sum(case when ${buildings.isEnumeratorValid} = false then 1 else 0 end)`,
        invalidToken: sql<number>`sum(case when ${buildings.isBuildingTokenValid} = false then 1 else 0 end)`,
      })
      .from(buildings)
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
