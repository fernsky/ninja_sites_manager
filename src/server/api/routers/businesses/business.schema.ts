import { z } from "zod";

export const businessSchema = z.object({
  id: z.string(),
  // Enumerator Information
  enumeratorName: z.string(),
  phone: z.string(),

  // Business Basic Information
  businessName: z.string(),
  wardNo: z.number(),
  areaCode: z.number(),
  businessNo: z.string(),
  locality: z.string(),

  // Operator Details
  operatorName: z.string(),
  operatorPhone: z.string(),
  operatorAge: z.number(),
  operatorGender: z.string(),
  operatorEducation: z.string(),

  // Business Classification
  businessNature: z.string(),
  businessNatureOther: z.string().optional(),
  businessType: z.string(),
  businessTypeOther: z.string().optional(),

  // Media fields
  surveyAudioRecording: z.string().optional(),
  buildingImage: z.string().optional(),
  enumeratorSelfie: z.string().optional(),

  // Registration and Legal Information
  registrationStatus: z.string(),
  registeredBodies: z.string(), // Changed from array to string to match DB schema
  registeredBodiesOther: z.string().optional(),
  statutoryStatus: z.string(),
  statutoryStatusOther: z.string().optional(),
  panStatus: z.string(),
  panNumber: z.string().optional(),

  // Location Data
  gps: z.string(), // We'll handle Point geometry as string in the schema
  altitude: z.number().nullable(),
  gpsAccuracy: z.number().nullable(),

  // Financial and Property Information
  investmentAmount: z.number(),
  businessLocationOwnership: z.string(),
  businessLocationOwnershipOther: z.string().optional(),

  // Hotel details
  hotelAccommodationType: z.string().optional(),
  hotelRoomCount: z.number().optional(),
  hotelBedCount: z.number().optional(),
  hotelRoomType: z.string().optional(),
  hotelHasHall: z.string().optional(),
  hotelHallCapacity: z.number().optional(),

  // Employee Information
  hasPartners: z.string(),
  totalPartners: z.number().optional(),
  nepaliMalePartners: z.number().optional(),
  nepaliFemalePartners: z.number().optional(),
  hasForeignPartners: z.string(),
  foreignMalePartners: z.number().optional(),
  foreignFemalePartners: z.number().optional(),

  hasInvolvedFamily: z.string(),
  totalInvolvedFamily: z.number().optional(),
  maleInvolvedFamily: z.number().optional(),
  femaleInvolvedFamily: z.number().optional(),

  hasPermanentEmployees: z.string(),
  totalPermanentEmployees: z.number().optional(),
  nepaliMalePermanentEmployees: z.number().optional(),
  nepaliFemalePermanentEmployees: z.number().optional(),
  hasForeignPermanentEmployees: z.string(),
  foreignMalePermanentEmployees: z.number().optional(),
  foreignFemalePermanentEmployees: z.number().optional(),

  hasTemporaryEmployees: z.string(),
  totalTemporaryEmployees: z.number().optional(),
  nepaliMaleTemporaryEmployees: z.number().optional(),
  nepaliFemaleTemporaryEmployees: z.number().optional(),
  hasForeignTemporaryEmployees: z.string(),
  foreignMaleTemporaryEmployees: z.number().optional(),
  foreignFemaleTemporaryEmployees: z.number().optional(),

  // Aquaculture Information
  aquacultureWardNo: z.number().optional(),
  pondCount: z.number().optional(),
  pondArea: z.number().optional(),
  fishProduction: z.number().optional(),
  fingerlingNumber: z.number().optional(),
  totalInvestment: z.number().optional(),
  annualIncome: z.number().optional(),
  employmentCount: z.number().optional(),

  // Apiculture Information
  apicultureWardNo: z.number().optional(),
  hiveCount: z.number().optional(),
  honeyProduction: z.number().optional(),
  hasApiculture: z.string().optional(),

  // Temporary fields
  tmpAreaCode: z.string().optional(),
  tmpWardNumber: z.number().optional(),
  tmpEnumeratorId: z.string().optional(),
  tmpBuildingToken: z.string().optional(),

  // Foreign key fields
  areaId: z.string().optional(),
  enumeratorId: z.string().optional(),
  wardId: z.number().optional(),
  buildingToken: z.string().optional(),

  // Status and validation fields
  status: z
    .enum(["approved", "pending", "requested_for_edit", "rejected"])
    .default("pending"),
  isAreaValid: z.boolean().default(false),
  isWardValid: z.boolean().default(false),
  isBuildingTokenValid: z.boolean().default(false),
  isEnumeratorValid: z.boolean().default(false),
});

// Rest of the code remains the same
export const createBusinessSchema = businessSchema.omit({ id: true });
export const updateBusinessSchema = businessSchema.partial();
export const businessQuerySchema = z.object({
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
  sortBy: z
    .enum([
      "business_name",
      "ward_id",
      "area_code",
      "enumerator_name",
      "status",
    ])
    .default("ward_id"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  filters: z
    .object({
      wardId: z.number().optional(),
      areaCode: z.string().optional(),
      enumeratorId: z.string().optional(),
      status: z
        .enum(["all", "pending", "approved", "rejected", "requested_for_edit"])
        .optional(),
    })
    .optional(),
});

export const businessStatusSchema = z.object({
  businessId: z.string(),
  status: z.enum([
    "all",
    "approved",
    "pending",
    "requested_for_edit",
    "rejected",
  ]),
  message: z.string().optional(),
});

export type BusinessStatusUpdate = z.infer<typeof businessStatusSchema>;
export type Business = z.infer<typeof businessSchema>;
