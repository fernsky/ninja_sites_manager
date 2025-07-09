import { protectedProcedure } from "../../../trpc";
import { buildingTokens } from "@/server/db/schema/building";
import { eq, and, sql } from "drizzle-orm";
import { z } from "zod";

export const getTokenStatsByAreaId = protectedProcedure
  .input(z.object({ areaId: z.string() }))
  .query(async ({ ctx, input }) => {
    const totalTokens = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(buildingTokens)
      .where(eq(buildingTokens.areaId, input.areaId))
      .then((result) => result[0].count);

    const allocatedTokens = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(buildingTokens)
      .where(
        and(
          eq(buildingTokens.areaId, input.areaId),
          eq(buildingTokens.status, "allocated"),
        ),
      )
      .then((result) => result[0].count);

    const unallocatedTokens = totalTokens - allocatedTokens;

    return {
      totalTokens,
      allocatedTokens,
      unallocatedTokens,
    };
  });

export const getAreaTokens = protectedProcedure
  .input(
    z.object({
      areaId: z.string(),
      status: z.enum(["allocated", "unallocated"]).optional(),
      limit: z.number().min(1).max(200).default(200),
      offset: z.number().min(0).default(0),
    }),
  )
  .query(async ({ ctx, input }) => {
    const conditions = [eq(buildingTokens.areaId, input.areaId)];
    if (input.status) {
      conditions.push(eq(buildingTokens.status, input.status));
    }

    const [tokensData, totalCount] = await Promise.all([
      ctx.db
      .select()
      .from(buildingTokens)
      .where(and(...conditions))
      .limit(input.limit)
      .offset(input.offset)
      .orderBy(buildingTokens.token),

      ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(buildingTokens)
      .where(and(...conditions))
      .then((result) => result[0].count),
    ]);

    // Transform tokens to include only the first 8 characters
    const tokens = tokensData.map(token => ({
      ...token,
      token: token.token
    }));

    return {
      tokens,
      pagination: {
        total: totalCount,
        pageSize: input.limit,
        offset: input.offset,
      },
    };
  });
