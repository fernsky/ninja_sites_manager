import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { buildings, buildingTokens } from "@/server/db/schema/building";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const assignAreaUpdate = publicProcedure
  .input(
    z.object({
      buildingId: z.string(),
      areaId: z.string().nullable(),
      buildingToken: z.string().nullable(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { buildingId, areaId, buildingToken } = input;

    if (buildingToken && !areaId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cannot set building token without a valid area ID",
      });
    }

    if (buildingToken && areaId) {
      const validToken = await ctx.db
        .select()
        .from(buildingTokens)
        .where(
          and(
            eq(buildingTokens.areaId, areaId),
            eq(buildingTokens.token, buildingToken),
          ),
        )
        .limit(1);

      if (validToken.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Building token ${buildingToken} does not belong to area ${areaId}`,
        });
      }

      await ctx.db
        .update(buildingTokens)
        .set({ status: "allocated" })
        .where(eq(buildingTokens.token, buildingToken));
    }

    await ctx.db
      .update(buildings)
      .set({ areaId, buildingToken })
      .where(eq(buildings.id, buildingId));

    return { success: true };
  });
