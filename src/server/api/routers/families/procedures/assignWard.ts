import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { family } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const assignWardUpdate = publicProcedure
  .input(
    z.object({
      familyId: z.string(),
      wardId: z.string().nullable(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { familyId, wardId } = input;

    await ctx.db
      .update(family)
      .set({
        wardId: wardId ? parseInt(wardId) : undefined,
        isWardValid: wardId ? true : false,
        wardNo: wardId ? parseInt(wardId) : undefined,
        tmpWardNumber: wardId ? parseInt(wardId) : undefined,
      })
      .where(eq(family.id, familyId));

    return { success: true };
  });
