import { protectedProcedure } from "@/server/api/trpc";
import { family, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const assignToEnumerator = protectedProcedure
  .input(z.object({ familyId: z.string(), enumeratorId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const familyRecord = await ctx.db.query.family.findFirst({
      where: eq(family.id, input.familyId),
    });

    if (!familyRecord) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Family not found",
      });
    }

    const enumerator = await ctx.db.query.users.findFirst({
      where: eq(users.id, input.enumeratorId),
    });

    if (!enumerator) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Enumerator not found",
      });
    }

    await ctx.db
      .update(family)
      .set({
        enumeratorId: input.enumeratorId,
        enumeratorName: enumerator.name,
        isEnumeratorValid: true,
        tmpEnumeratorId: input.enumeratorId,
      })
      .where(eq(family.id, input.familyId));

    return { success: true };
  });
