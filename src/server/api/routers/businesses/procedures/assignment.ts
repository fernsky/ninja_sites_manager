import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { business } from "@/server/db/schema/business/business";
import { users } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const assignToEnumerator = publicProcedure
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
      .where(eq(users.id, input.enumeratorId))
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
        enumeratorId: enumerator[0].id,
        enumeratorName: enumerator[0].name,
        isEnumeratorValid: true,
      })
      .where(eq(business.id, input.businessId));

    return { success: true };
  });
