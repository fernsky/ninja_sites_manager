import { z } from "zod";

export const buildingSchema = z.object({
  id: z.string(),
  surveyDate: z.string().date(),
  enumeratorName: z.string(),
  enumeratorId: z.string(),
  areaCode: z.string(),
  wardNumber: z.number(),
  locality: z.string(),
  totalFamilies: z.number(),
  totalBusinesses: z.number(),
  surveyAudioRecording: z.string().nullable(),
  gps: z.string(),
  altitude: z.number().nullable(),
  gpsAccuracy: z.number().nullable(),
  buildingImage: z.string().nullable(),
  enumeratorSelfie: z.string().nullable(),
  landOwnership: z.string(),
  base: z.string(),
  outerWall: z.string(),
  roof: z.string(),
  floor: z.string(),
  mapStatus: z.string(),
  naturalDisasters: z.string().array(),
  timeToMarket: z.string(),
  timeToActiveRoad: z.string(),
  timeToPublicBus: z.string(),
  timeToHealthOrganization: z.string(),
  timeToFinancialOrganization: z.string(),
  roadStatus: z.string(),
  areaId: z.string().nullable(),
  buildingToken: z.string().nullable(),
});

export const createBuildingSchema = buildingSchema.omit({ id: true });

export const updateBuildingSchema = buildingSchema.partial();

export const buildingQuerySchema = z.object({
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
  sortBy: z
    .enum([
      "tmp_ward_number",
      "tmp_area_code",
      "building_token",
      "enumerator_name",
    ])
    .default("tmp_ward_number"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  filters: z
    .object({
      wardNumber: z.number().optional(),
      areaCode: z.string().optional(),
      mapStatus: z.string().optional(),
      enumeratorId: z.string().optional(),
      status: z
        .enum(["pending", "approved", "rejected", "requested_for_edit"])
        .optional(),
    })
    .optional(),
});

export const buildingStatusSchema = z.object({
  buildingId: z.string(),
  status: z.enum(["approved", "pending", "requested_for_edit", "rejected"]),
  message: z.string().optional(), // For rejection reason or edit request details
});

export type BuildingStatusUpdate = z.infer<typeof buildingStatusSchema>;

export type Building = z.infer<typeof buildingSchema>;
