import { z } from "zod";

export const householdCBSSchema = z.object({
  id: z.string().min(1).max(48),
  wardNo: z.number().int().nullable(),
  totalHouseholds: z.number().int().nullable(),
  createdAt: z.date(),
  updatedAt: z.date().nullable()
});

export const createHouseholdCBSSchema = z.object({
  wardNo: z.number().int(),
  totalHouseholds: z.number().int()
});

export const updateHouseholdCBSSchema = z.object({
  wardNo: z.number().int().optional(),
  totalHouseholds: z.number().int().optional(),
});

export type HouseholdCBS = z.infer<typeof householdCBSSchema>;
export type CreateHouseholdCBS = z.infer<typeof createHouseholdCBSSchema>;
export type UpdateHouseholdCBS = z.infer<typeof updateHouseholdCBSSchema>;
