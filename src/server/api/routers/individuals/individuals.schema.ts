import { z } from "zod";

export const individualSchema = z.object({
  id: z.string(),
  familyId: z.string(),
  wardNo: z.number(),
  
  // Personal Information
  name: z.string(),
  gender: z.string(),
  age: z.number().nullable(),
  familyRole: z.string().nullable(),

  // Cultural and Demographic Information
  citizenOf: z.string().nullable(),
  citizenOfOther: z.string().nullable(),
  caste: z.string().nullable(),
  casteOther: z.string().nullable(),
  ancestorLanguage: z.string().nullable(),
  ancestorLanguageOther: z.string().nullable(),
  primaryMotherTongue: z.string().nullable(),
  primaryMotherTongueOther: z.string().nullable(),
  religion: z.string().nullable(),
  religionOther: z.string().nullable(),

  // Marital Status
  maritalStatus: z.string().nullable(),
  marriedAge: z.number().nullable(),

  // Health Information
  hasChronicDisease: z.string().nullable(),
  primaryChronicDisease: z.string().nullable(),
  isSanitized: z.string().nullable(),

  // Disability Information
  isDisabled: z.string().nullable(),
  disabilityType: z.string().nullable(),
  disabilityTypeOther: z.string().nullable(),
  disabilityCause: z.string().nullable(),

  // Documents
  hasBirthCertificate: z.string().nullable(),

  // Fertility and Birth Information
  gaveLiveBirth: z.string().nullable(),
  aliveSons: z.number().nullable(),
  aliveDaughters: z.number().nullable(),
  totalBornChildren: z.number().nullable(),
  hasDeadChildren: z.string().nullable(),
  deadSons: z.number().nullable(),
  deadDaughters: z.number().nullable(),
  totalDeadChildren: z.number().nullable(),

  // Recent Birth Details
  gaveRecentLiveBirth: z.string().nullable(),
  recentBornSons: z.number().nullable(),
  recentBornDaughters: z.number().nullable(),
  totalRecentChildren: z.number().nullable(),
  recentDeliveryLocation: z.string().nullable(),
  prenatalCheckups: z.number().nullable(),
  firstDeliveryAge: z.number().nullable(),

  // Presence and Migration Status
  isPresent: z.string().nullable(),
  absenteeAge: z.number().nullable(),
  absenteeEducationalLevel: z.string().nullable(),
  absenceReason: z.string().nullable(),
  absenteeLocation: z.string().nullable(),
  absenteeProvince: z.string().nullable(),
  absenteeDistrict: z.string().nullable(),
  absenteeCountry: z.string().nullable(),
  absenteeHasSentCash: z.string().nullable(),
  absenteeCashAmount: z.number().nullable(),

  // Education Information
  literacyStatus: z.string().nullable(),
  schoolPresenceStatus: z.string().nullable(),
  educationalLevel: z.string().nullable(),
  primarySubject: z.string().nullable(),
  goesSchool: z.string().nullable(),
  schoolBarrier: z.string().nullable(),

  // Training and Skills
  hasTraining: z.string().nullable(),
  training: z.string().nullable(),
  monthsTrained: z.number().nullable(),
  primarySkill: z.string().nullable(),
  hasInternetAccess: z.string().nullable(),

  // Occupation and Work
  financialWorkDuration: z.string().nullable(),
  primaryOccupation: z.string().nullable(),
  workBarrier: z.string().nullable(),
  workAvailability: z.string().nullable(),
});

export const createIndividualSchema = individualSchema.omit({ id: true });

export const updateIndividualSchema = individualSchema.partial();

export const individualQuerySchema = z.object({
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
  sortBy: z.enum(["name", "age", "ward_no"]).default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  filters: z.object({
    wardNo: z.number().optional(),
    familyId: z.string().optional(),
    gender: z.string().optional(),
    ageRange: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
    }).optional(),
  }).optional(),
});

export type Individual = z.infer<typeof individualSchema>;
