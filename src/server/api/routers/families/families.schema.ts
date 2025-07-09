import { z } from "zod";

export const familySchema = z.object({
  id: z.string(),
  enumeratorName: z.string(),
  enumeratorPhone: z.string(),
  wardNo: z.number(),
  areaCode: z.string(),
  locality: z.string(),
  devOrg: z.string(),
  gps: z.string(),
  altitude: z.number().nullable(),
  gpsAccuracy: z.number().nullable(),
  headName: z.string(),
  headPhone: z.string(),
  totalMembers: z.number(),
  isSanitized: z.boolean(),
  houseOwnership: z.string(),
  houseOwnershipOther: z.string().nullable(),
  feels_safe: z.string(),
  waterSource: z.array(z.string()),
  waterSourceOther: z.string().nullable(),
  waterPurificationMethods: z.array(z.string()),
  toiletType: z.string(),
  solidWaste: z.string(),
  solidWasteOther: z.string().nullable(),
  primaryCookingFuel: z.string(),
  primaryEnergySource: z.string(),
  primaryEnergySourceOther: z.string().nullable(),
  facilities: z.array(z.string()),
  femaleProperties: z.string(),
  loanedOrganizations: z.array(z.string()),
  loanUse: z.string(),
  hasBank: z.string(),
  hasInsurance: z.string(),
  healthOrg: z.string(),
  healthOrgOther: z.string().nullable(),
  incomeSources: z.array(z.string()),
  municipalSuggestions: z.string(),
  municipalSuggestionsOther: z.string().nullable(),
  hasRemittance: z.boolean(),
  remittanceExpenses: z.array(z.string()),
  areaId: z.string().nullable(),
  buildingToken: z.string().nullable(),
});

export const createFamilySchema = familySchema.omit({ id: true });

export const updateFamilySchema = familySchema.partial();

export const familyQuerySchema = z.object({
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
  sortBy: z
    .enum(["head_name", "ward_no", "area_code", "enumerator_name", "status"])
    .default("head_name"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  filters: z
    .object({
      wardNo: z.number().optional(),
      areaCode: z.string().optional(),
      enumeratorId: z.string().optional(),
      status: z
        .enum(["all", "pending", "approved", "rejected", "requested_for_edit"])
        .optional(),
    })
    .optional(),
});

export const familyStatusSchema = z.object({
  familyId: z.string(),
  status: z.enum(["approved", "pending", "requested_for_edit", "rejected"]),
  message: z.string().optional(), // For rejection reason or edit request details
});

export type FamilyStatusUpdate = z.infer<typeof familyStatusSchema>;

export type Family = z.infer<typeof familySchema>;
