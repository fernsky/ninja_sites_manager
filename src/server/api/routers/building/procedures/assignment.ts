import { protectedProcedure } from "@/server/api/trpc";
import { buildings } from "@/server/db/schema/building";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { users } from "@/server/db/schema";

export const assignToEnumerator = protectedProcedure
  .input(z.object({ buildingId: z.string(), enumeratorId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const building = await ctx.db.query.buildings.findFirst({
      where: eq(buildings.id, input.buildingId),
    });

    if (!building) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Building not found",
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
      .update(buildings)
      .set({
        enumeratorId: input.enumeratorId,
        enumeratorName: enumerator.name,
      })
      .where(eq(buildings.id, input.buildingId));

    return { success: true };
  });
