import { z } from "zod";

export const deathSchema = z.object({
  id: z.string(),
  familyId: z.string(),
  wardNo: z.number(),
  deceasedName: z.string(),
  deceasedAge: z.number().nullable(),
  deceasedDeathCause: z.string().nullable(),
  deceasedGender: z.string().nullable(),
  deceasedFertilityDeathCondition: z.string().nullable(),
  deceasedHasDeathCertificate: z.string().nullable(),
});

export const createDeathSchema = deathSchema.omit({ id: true });

export const updateDeathSchema = deathSchema.partial();

export const deathQuerySchema = z.object({
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
  sortBy: z.enum(["deceased_name", "deceased_age", "ward_no"]).default("deceased_name"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  filters: z.object({
    wardNo: z.number().optional(),
    familyId: z.string().optional(),
    deceasedName: z.string().optional(),
    deceasedGender: z.string().optional(),
    ageRange: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
    }).optional(),
  }).optional(),
});

export type Death = z.infer<typeof deathSchema>;
