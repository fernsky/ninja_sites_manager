import { protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { users } from "@/server/db/schema/basic";
import { eq } from "drizzle-orm";
import * as z from "zod";

export const enumeratorIdCardProcedures = {
  updateIdCardDetails: protectedProcedure
    .input(
      z.object({
        nepaliName: z.string(),
        nepaliAddress: z.string(),
        nepaliPhone: z.string(),
        enumeratorId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Allow if user is admin or if updating their own account
      if (
        ctx.user.role !== "superadmin" &&
        ctx.user.id !== input.enumeratorId
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized to update ID card details",
        });
      }

      await ctx.db
        .update(users)
        .set({
          nepaliName: input.nepaliName,
          nepaliAddress: input.nepaliAddress,
          nepaliPhone: input.nepaliPhone,
        })
        .where(eq(users.id, input.enumeratorId));

      return { success: true };
    }),

  getIdCardDetails: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      // Allow if user is admin or if viewing their own details
      if (ctx.user.role !== "superadmin" && ctx.user.id !== input) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized to view ID card details",
        });
      }

      const details = await ctx.db.query.users.findFirst({
        where: eq(users.id, input),
        columns: {
          nepaliName: true,
          nepaliAddress: true,
          nepaliPhone: true,
        },
      });

      return details;
    }),
};
