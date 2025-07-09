import { z } from "zod";

export const householdByIdSchema = z.object({
  id: z.string(),
  includeMembers: z.boolean().default(true),
  includeCrops: z.boolean().default(true),
  includeAnimals: z.boolean().default(true),
  includeLands: z.boolean().default(true),
  includeProducts: z.boolean().default(true),
  includeDeaths: z.boolean().default(true),
  includeAbsentees: z.boolean().default(true),
});

export const householdsByBuildingIdSchema = z.object({
  buildingId: z.string(),
});

export const householdEntitySchema = z.object({
  householdId: z.string(),
  entityType: z.enum([
    "members",
    "crops",
    "animals",
    "lands",
    "products",
    "deaths",
    "absentees",
  ]),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
});
