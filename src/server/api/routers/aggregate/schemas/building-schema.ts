import { z } from "zod";

export const buildingQuerySchema = z.object({
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
  sortBy: z.string().default("created_at"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  filters: z
    .object({
      wardId: z.string().optional(),
      areaCode: z.string().optional(),
      enumeratorId: z.string().optional(),
      mapStatus: z.string().optional(),
      buildingOwnership: z.string().optional(),
      buildingBase: z.string().optional(),
      hasHouseholds: z.boolean().optional(),
      hasBusinesses: z.boolean().optional(),
      fromDate: z.string().optional(),
      toDate: z.string().optional(),
      searchTerm: z.string().optional(),
    })
    .optional(),
});

export const buildingByIdSchema = z.object({
  id: z.string(),
  includeHouseholds: z.boolean().default(false),
  includeBusinesses: z.boolean().default(false),
});

export const buildingsByWardSchema = z.object({
  wardId: z.string(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
});

export const buildingsByAreaCodeSchema = z.object({
  areaCode: z.string(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
});

export const buildingsByEnumeratorSchema = z.object({
  enumeratorId: z.string().optional(),
  enumeratorName: z.string().optional(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
});
