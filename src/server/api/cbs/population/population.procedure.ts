import { z } from "zod";
import { nanoid } from "nanoid";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { populationGenderWiseCBS } from "@/server/db/schema/cbs/population-gender-wise-cbs";
import { createPopulationGenderWiseCBSSchema, updatePopulationGenderWiseCBSSchema } from "./population.schema";
import { eq } from "drizzle-orm";

export const populationCBSRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createPopulationGenderWiseCBSSchema)
    .mutation(async ({ ctx, input }) => {
      const id = nanoid();
      await ctx.db.insert(populationGenderWiseCBS).values({
        id,
        wardNo: input.wardNo,
        totalPopulation: input.totalPopulation,
        totalMale: input.totalMale,
        totalFemale: input.totalFemale,
      });

      return { id };
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.populationGenderWiseCBS.findMany();
  }),

  getByWard: protectedProcedure
    .input(z.object({ wardNo: z.number().int() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.populationGenderWiseCBS.findFirst({
        where: eq(populationGenderWiseCBS.wardNo, input.wardNo),
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.populationGenderWiseCBS.findFirst({
        where: eq(populationGenderWiseCBS.id, input.id),
      });
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: updatePopulationGenderWiseCBSSchema,
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(populationGenderWiseCBS)
        .set(input.data)
        .where(eq(populationGenderWiseCBS.id, input.id));

      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(populationGenderWiseCBS)
        .where(eq(populationGenderWiseCBS.id, input.id));

      return { success: true };
    }),
});
