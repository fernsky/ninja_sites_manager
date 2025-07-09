import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { buildings } from "@/server/db/schema/building";
import { eq } from "drizzle-orm";

export const assignWardUpdate = publicProcedure
  .input(
    z.object({
      buildingId: z.string(),
      wardId: z.string().nullable(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { buildingId, wardId } = input;

    await ctx.db
      .update(buildings)
      .set({
        wardId: wardId ? parseInt(wardId) : null,
        isWardValid: wardId ? true : null,
      })
      .where(eq(buildings.id, buildingId));

    return { success: true };
  });
