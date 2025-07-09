import { z } from "zod";

// Base distribution schema for count-based results
const distributionSchema = z.array(
  z.object({
    count: z.number().int(),
  })
);

// Specific distribution schemas
export const genderDistributionSchema = z.array(
  z.object({
    gender: z.string(),
    count: z.number().int(),
  })
);

export const ageDistributionSchema = z.array(
  z.object({
    age_group: z.string(),
    count: z.number().int(),
  })
);

export const casteDistributionSchema = z.array(
  z.object({
    caste: z.string(),
    count: z.number().int(),
  })
);

export const languageDistributionSchema = z.array(
  z.object({
    language: z.string(),
    count: z.number().int(),
  })
);

export const religionDistributionSchema = z.array(
  z.object({
    religion: z.string(),
    count: z.number().int(),
  })
);

export const maritalStatusDistributionSchema = z.array(
  z.object({
    status: z.string(),
    count: z.number().int(),
  })
);

export const marriageAgeDistributionSchema = z.array(
  z.object({
    age_group: z.string(),
    count: z.number().int(),
  })
);

export const disabilityDistributionSchema = z.array(
  z.object({
    isDisabled: z.boolean(),
    count: z.number().int(),
  })
);

// Agricultural distribution schemas
export const farmingTypeDistributionSchema = z.array(
  z.object({
    type: z.string(),
    count: z.number().int(),
  })
);

export const irrigationSourceDistributionSchema = z.array(
  z.object({
    source: z.string(),
    count: z.number().int(),
  })
);

export const agricultureProductDistributionSchema = z.array(
  z.object({
    product: z.string(),
    count: z.number().int(),
  })
);

export const livestockDistributionSchema = z.array(
  z.object({
    animal: z.string(),
    count: z.number().int(),
  })
);

// Family analytics schemas
export const familyStatsSchema = z.object({
  totalFamilies: z.number().int(),
  totalMembers: z.number().int(),
  sanitizedFamilies: z.number().int(),
});

export const familyStatusDistributionSchema = z.array(
  z.object({
    status: z.string(),
    count: z.number().int(),
  })
);

export const familyHousingOwnershipSchema = z.array(
  z.object({
    ownership: z.string(),
    count: z.number().int(),
  })
);

export const familiesByWardSchema = z.array(
  z.object({
    wardNumber: z.number().int(),
    totalFamilies: z.number().int(),
    totalMembers: z.number().int(),
    sanitizedFamilies: z.number().int(),
  })
);

// Combined schema for all demographics
export const allDemographicAnalyticsSchema = z.object({
  gender: genderDistributionSchema,
  age: ageDistributionSchema,
  caste: casteDistributionSchema,
  ancestorLanguage: languageDistributionSchema,
  motherTongue: languageDistributionSchema,
  religion: religionDistributionSchema,
  maritalStatus: maritalStatusDistributionSchema,
  marriageAge: marriageAgeDistributionSchema,
  disability: disabilityDistributionSchema,
});

export const allAgriculturalAnalyticsSchema = z.object({
  farmingTypes: farmingTypeDistributionSchema,
  irrigationSources: irrigationSourceDistributionSchema,
  agricultureProducts: agricultureProductDistributionSchema,
  livestock: livestockDistributionSchema,
});

// Types
export type GenderDistribution = z.infer<typeof genderDistributionSchema>;
export type AgeDistribution = z.infer<typeof ageDistributionSchema>;
export type CasteDistribution = z.infer<typeof casteDistributionSchema>;
export type LanguageDistribution = z.infer<typeof languageDistributionSchema>;
export type ReligionDistribution = z.infer<typeof religionDistributionSchema>;
export type MaritalStatusDistribution = z.infer<typeof maritalStatusDistributionSchema>;
export type MarriageAgeDistribution = z.infer<typeof marriageAgeDistributionSchema>;
export type DisabilityDistribution = z.infer<typeof disabilityDistributionSchema>;
export type AllDemographicAnalytics = z.infer<typeof allDemographicAnalyticsSchema>;

export type FarmingTypeDistribution = z.infer<typeof farmingTypeDistributionSchema>;
export type IrrigationSourceDistribution = z.infer<typeof irrigationSourceDistributionSchema>;
export type AgricultureProductDistribution = z.infer<typeof agricultureProductDistributionSchema>;
export type LivestockDistribution = z.infer<typeof livestockDistributionSchema>;
export type AllAgriculturalAnalytics = z.infer<typeof allAgriculturalAnalyticsSchema>;

export type FamilyStats = z.infer<typeof familyStatsSchema>;
export type FamilyStatusDistribution = z.infer<typeof familyStatusDistributionSchema>;
export type FamilyHousingOwnership = z.infer<typeof familyHousingOwnershipSchema>;
export type FamiliesByWard = z.infer<typeof familiesByWardSchema>;
