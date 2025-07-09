import { z } from "zod";

export const businessByIdSchema = z.object({
  id: z.string(),
  includeCrops: z.boolean().default(true),
  includeAnimals: z.boolean().default(true),
  includeProducts: z.boolean().default(true),
});

export const businessesByBuildingIdSchema = z.object({
  buildingId: z.string(),
});

export const businessEntitySchema = z.object({
  businessId: z.string(),
  entityType: z.enum(["crops", "animals", "products"]),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
});
