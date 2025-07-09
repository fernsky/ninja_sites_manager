import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { business } from "@/server/db/schema/business/business";
import { eq } from "drizzle-orm";

export const assignWardUpdate = publicProcedure
  .input(
    z.object({
      businessId: z.string(),
      wardId: z.string().nullable(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { businessId, wardId } = input;

    await ctx.db
      .update(business)
      .set({
        wardId: wardId ? parseInt(wardId) : null,
        isWardValid: wardId ? true : false,
        wardNo: wardId ? parseInt(wardId) : null,
      })
      .where(eq(business.id, businessId));

    return { success: true };
  });
