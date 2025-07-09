import { z } from "zod";
import { nanoid } from "nanoid";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { householdCBS } from "@/server/db/schema/cbs/households-cbs";
import { createHouseholdCBSSchema, updateHouseholdCBSSchema } from "./households.schema";
import { eq } from "drizzle-orm";

export const householdCBSRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createHouseholdCBSSchema)
    .mutation(async ({ ctx, input }) => {
      const id = nanoid();
      await ctx.db.insert(householdCBS).values({
        id,
        wardNo: input.wardNo,
        totalHouseholds: input.totalHouseholds,
      });

      return { id };
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.householdCBS.findMany();
  }),

  getByWard: protectedProcedure
    .input(z.object({ wardNo: z.number().int() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.householdCBS.findFirst({
        where: eq(householdCBS.wardNo, input.wardNo),
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.householdCBS.findFirst({
        where: eq(householdCBS.id, input.id),
      });
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: updateHouseholdCBSSchema,
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(householdCBS)
        .set(input.data)
        .where(eq(householdCBS.id, input.id));

      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(householdCBS)
        .where(eq(householdCBS.id, input.id));

      return { success: true };
    }),
});
