import { pgTable, varchar, integer } from "drizzle-orm/pg-core";
import { family } from "./family";

export const stagingKerabariIndividual = pgTable(
  "staging_Kerabari_individual",
  {
    // Primary Keys and Basic Info
    id: varchar("id", { length: 48 }).primaryKey().notNull(),
    familyId: varchar("family_id", { length: 48 }).notNull(),
    wardNo: integer("ward_no").notNull(),

    // Personal Information
    name: varchar("name", { length: 255 }).notNull(),
    gender: varchar("gender", { length: 100 }).notNull(),
    age: integer("age"),

    // Cultural and Demographic Information
    citizenOf: varchar("citizen_of", { length: 100 }),
    citizenOfOther: varchar("citizen_of_other", { length: 255 }),
    caste: varchar("caste", { length: 100 }),
    casteOther: varchar("caste_other", { length: 255 }),
    ancestorLanguage: varchar("ancestor_language", { length: 100 }),
    ancestorLanguageOther: varchar("ancestor_language_other", { length: 255 }),
    primaryMotherTongue: varchar("primary_mother_tongue", { length: 100 }),
    primaryMotherTongueOther: varchar("primary_mother_tongue_other", {
      length: 255,
    }),
    religion: varchar("religion", { length: 100 }),
    religionOther: varchar("religion_other", { length: 255 }),

    // Marital Status
    maritalStatus: varchar("marital_status", { length: 100 }),
    marriedAge: integer("married_age"),

    // Health Information
    hasChronicDisease: varchar("has_chronic_disease", { length: 100 }),
    primaryChronicDisease: varchar("primary_chronic_disease", { length: 100 }),
    isSanitized: varchar("is_sanitized", { length: 100 }),

    // Disability Information
    isDisabled: varchar("is_disabled", { length: 100 }),
    disabilityType: varchar("disability_type", { length: 100 }),
    disabilityTypeOther: varchar("disability_type_other", { length: 255 }),
    disabilityCause: varchar("disability_cause", { length: 100 }),

    // Fertility and Birth Information
    gaveLiveBirth: varchar("gave_live_birth", { length: 100 }),
    aliveSons: integer("alive_sons"),
    aliveDaughters: integer("alive_daughters"),
    totalBornChildren: integer("total_born_children"),
    hasDeadChildren: varchar("has_dead_children", { length: 100 }),
    deadSons: integer("dead_sons"),
    deadDaughters: integer("dead_daughters"),
    totalDeadChildren: integer("total_dead_children"),

    // Recent Birth Details
    gaveRecentLiveBirth: varchar("gave_recent_live_birth", { length: 100 }),
    recentBornSons: integer("recent_born_sons"),
    recentBornDaughters: integer("recent_born_daughters"),
    totalRecentChildren: integer("total_recent_children"),
    recentDeliveryLocation: varchar("recent_delivery_location", {
      length: 100,
    }),
    prenatalCheckups: integer("prenatal_checkups"),
    firstDeliveryAge: integer("first_delivery_age"),

    // Presence and Migration Status
    isPresent: varchar("is_present", { length: 100 }),
    absenteeAge: integer("absentee_age"),
    absenteeEducationalLevel: varchar("absentee_educational_level", {
      length: 100,
    }),
    absenceReason: varchar("absence_reason", { length: 100 }),
    absenteeLocation: varchar("absentee_location", { length: 255 }),
    absenteeProvince: varchar("absentee_province", { length: 100 }),
    absenteeDistrict: varchar("absentee_district", { length: 100 }),
    absenteeCountry: varchar("absentee_country", { length: 100 }),
    absenteeHasSentCash: varchar("absentee_has_sent_cash", { length: 100 }),
    absenteeCashAmount: integer("absentee_cash_amount"),

    // Education Information
    literacyStatus: varchar("literacy_status", { length: 100 }),
    schoolPresenceStatus: varchar("school_presence_status", { length: 100 }),
    educationalLevel: varchar("educational_level", { length: 100 }),
    primarySubject: varchar("primary_subject", { length: 100 }),
    goesSchool: varchar("goes_school", { length: 100 }),
    schoolBarrier: varchar("school_barrier", { length: 100 }),

    // Training and Skills
    hasTraining: varchar("has_training", { length: 100 }),
    training: varchar("training", { length: 100 }),
    monthsTrained: integer("months_trained"),
    primarySkill: varchar("primary_skill", { length: 100 }),
    hasInternetAccess: varchar("has_internet_access", { length: 100 }),

    // Occupation and Work
    financialWorkDuration: varchar("financial_work_duration", { length: 100 }),
    primaryOccupation: varchar("primary_occupation", { length: 100 }),
    workBarrier: varchar("work_barrier", { length: 100 }),
    workAvailability: varchar("work_availability", { length: 100 }),
  },
);

// The main table can use the same structure with reference to family
export const KerabariIndividual = pgTable("Kerabari_individual", {
  // [Same fields as above but with family reference]
  id: varchar("id", { length: 48 }).primaryKey().notNull(),
  familyId: varchar("family_id", { length: 48 }).references(() => family.id),
  wardNo: integer("ward_no").notNull(),

  // Personal Information
  name: varchar("name", { length: 255 }).notNull(),
  gender: varchar("gender", { length: 100 }).notNull(),
  age: integer("age"),
  familyRole: varchar("family_role", { length: 100 }),

  // Cultural and Demographic Information
  citizenOf: varchar("citizen_of", { length: 100 }),
  citizenOfOther: varchar("citizen_of_other", { length: 255 }),
  caste: varchar("caste", { length: 100 }),
  casteOther: varchar("caste_other", { length: 255 }),
  ancestorLanguage: varchar("ancestor_language", { length: 100 }),
  ancestorLanguageOther: varchar("ancestor_language_other", { length: 255 }),
  primaryMotherTongue: varchar("primary_mother_tongue", { length: 100 }),
  primaryMotherTongueOther: varchar("primary_mother_tongue_other", {
    length: 255,
  }),
  religion: varchar("religion", { length: 100 }),
  religionOther: varchar("religion_other", { length: 255 }),

  // Marital Status
  maritalStatus: varchar("marital_status", { length: 100 }),
  marriedAge: integer("married_age"),

  // Health Information
  hasChronicDisease: varchar("has_chronic_disease", { length: 100 }),
  primaryChronicDisease: varchar("primary_chronic_disease", { length: 100 }),
  isSanitized: varchar("is_sanitized", { length: 100 }),

  // Disability Information
  isDisabled: varchar("is_disabled", { length: 100 }),
  disabilityType: varchar("disability_type", { length: 100 }),
  disabilityTypeOther: varchar("disability_type_other", { length: 255 }),
  disabilityCause: varchar("disability_cause", { length: 100 }),

  // Documents
  hasBirthCertificate: varchar("has_birth_certificate", { length: 100 }),

  // Fertility and Birth Information
  gaveLiveBirth: varchar("gave_live_birth", { length: 100 }),
  aliveSons: integer("alive_sons"),
  aliveDaughters: integer("alive_daughters"),
  totalBornChildren: integer("total_born_children"),
  hasDeadChildren: varchar("has_dead_children", { length: 100 }),
  deadSons: integer("dead_sons"),
  deadDaughters: integer("dead_daughters"),
  totalDeadChildren: integer("total_dead_children"),

  // Recent Birth Details
  gaveRecentLiveBirth: varchar("gave_recent_live_birth", { length: 100 }),
  recentBornSons: integer("recent_born_sons"),
  recentBornDaughters: integer("recent_born_daughters"),
  totalRecentChildren: integer("total_recent_children"),
  recentDeliveryLocation: varchar("recent_delivery_location", {
    length: 100,
  }),
  prenatalCheckups: integer("prenatal_checkups"),
  firstDeliveryAge: integer("first_delivery_age"),

  // Presence and Migration Status
  isPresent: varchar("is_present", { length: 100 }),
  absenteeAge: integer("absentee_age"),
  absenteeEducationalLevel: varchar("absentee_educational_level", {
    length: 100,
  }),
  absenceReason: varchar("absence_reason", { length: 100 }),
  absenteeLocation: varchar("absentee_location", { length: 255 }),
  absenteeProvince: varchar("absentee_province", { length: 100 }),
  absenteeDistrict: varchar("absentee_district", { length: 100 }),
  absenteeCountry: varchar("absentee_country", { length: 100 }),
  absenteeHasSentCash: varchar("absentee_has_sent_cash", { length: 100 }),
  absenteeCashAmount: integer("absentee_cash_amount"),

  // Education Information
  literacyStatus: varchar("literacy_status", { length: 100 }),
  schoolPresenceStatus: varchar("school_presence_status", { length: 100 }),
  educationalLevel: varchar("educational_level", { length: 100 }),
  primarySubject: varchar("primary_subject", { length: 100 }),
  goesSchool: varchar("goes_school", { length: 100 }),
  schoolBarrier: varchar("school_barrier", { length: 100 }),

  // Training and Skills
  hasTraining: varchar("has_training", { length: 100 }),
  training: varchar("training", { length: 100 }),
  monthsTrained: integer("months_trained"),
  primarySkill: varchar("primary_skill", { length: 100 }),
  hasInternetAccess: varchar("has_internet_access", { length: 100 }),

  // Occupation and Work
  financialWorkDuration: varchar("financial_work_duration", { length: 100 }),
  primaryOccupation: varchar("primary_occupation", { length: 100 }),
  workBarrier: varchar("work_barrier", { length: 100 }),
  workAvailability: varchar("work_availability", { length: 100 }),
});

export type KerabariIndividual = typeof KerabariIndividual.$inferSelect;
export type StagingKerabariIndividual =
  typeof stagingKerabariIndividual.$inferSelect;
