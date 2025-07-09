import { z } from "zod";

export const mapBoundsSchema = z.object({
  north: z.number(),
  south: z.number(),
  east: z.number(),
  west: z.number(),
  zoom: z.number(),
  wardId: z.string().optional(),
  areaCode: z.string().optional(),
  enumeratorId: z.string().optional(),
  includeBuildings: z.boolean().default(true),
  includeHouseholds: z.boolean().default(true),
  includeBusinesses: z.boolean().default(true),
  mapStatus: z.string().optional(),
  limit: z.number().min(1).max(500).default(100),
});

export const geoEntityByIdSchema = z.object({
  id: z.string(),
  type: z.enum(["building", "household", "business"]),
});

export const clusterIdSchema = z.object({
  clusterId: z.string(),
  zoom: z.number(),
  limit: z.number().min(1).max(100).default(30),
});
