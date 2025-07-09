import { z } from "zod";

export const populationGenderWiseCBSSchema = z.object({
  id: z.string().min(1).max(48),
  wardNo: z.number().int().nullable(),
  totalPopulation: z.number().int().nullable(),
  totalMale: z.number().int().nullable(),
  totalFemale: z.number().int().nullable()
});

export const createPopulationGenderWiseCBSSchema = z.object({
  wardNo: z.number().int(),
  totalPopulation: z.number().int(),
  totalMale: z.number().int(),
  totalFemale: z.number().int()
});

export const updatePopulationGenderWiseCBSSchema = z.object({
  wardNo: z.number().int().optional(),
  totalPopulation: z.number().int().optional(),
  totalMale: z.number().int().optional(),
  totalFemale: z.number().int().optional()
});

export type PopulationGenderWiseCBS = z.infer<typeof populationGenderWiseCBSSchema>;
export type CreatePopulationGenderWiseCBS = z.infer<typeof createPopulationGenderWiseCBSSchema>;
export type UpdatePopulationGenderWiseCBS = z.infer<typeof updatePopulationGenderWiseCBSSchema>;
