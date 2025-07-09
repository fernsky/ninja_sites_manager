import {
  pgTable,
  timestamp,
  pgEnum,
  text,
  varchar,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { geometry } from "../../geographical";
import { areas, users, wards } from "../basic";
import { buildingTokens } from "../building";

export const stagingBusiness = pgTable("staging_Kerabari_business", {
  id: varchar("id", { length: 48 }).primaryKey(),
  // Enumerator Information
  enumeratorName: varchar("enumerator_name", { length: 255 }),
  enumeratorId: varchar("enumerator_id", { length: 48 }),
  phone: varchar("phone", { length: 20 }),
  buildingToken: varchar("building_token", { length: 48 }),

  // Business Basic Information
  businessName: varchar("business_name", { length: 255 }),
  wardNo: integer("ward_no"),
  areaCode: integer("area_code"),
  businessNo: varchar("business_no", { length: 48 }),
  locality: varchar("locality", { length: 255 }),

  // Operator Details
  operatorName: varchar("operator_name", { length: 255 }),
  operatorPhone: varchar("operator_phone", { length: 20 }),
  operatorAge: integer("operator_age"),
  operatorGender: varchar("operator_gender", { length: 20 }),
  operatorEducation: varchar("operator_education", { length: 100 }),

  // Business Classification
  businessNature: varchar("business_nature", { length: 100 }),
  businessNatureOther: varchar("business_nature_other", { length: 255 }),
  businessType: varchar("business_type", { length: 100 }),
  businessTypeOther: varchar("business_type_other", { length: 255 }),

  // Registration and Legal Information
  registrationStatus: varchar("registration_status", { length: 100 }),
  registeredBodies: text("registered_bodies").array(),
  registeredBodiesOther: varchar("registered_bodies_other", { length: 255 }),
  statutoryStatus: varchar("statutory_status", { length: 100 }),
  statutoryStatusOther: varchar("statutory_status_other", { length: 255 }),
  panStatus: varchar("pan_status", { length: 100 }),
  panNumber: varchar("pan_number", { length: 50 }),

  // Location Data
  gps: geometry("gps", { type: "Point" }),
  altitude: decimal("altitude"),
  gpsAccuracy: decimal("gps_accuracy"),

  // Financial and Property Information
  investmentAmount: decimal("investment_amount", { precision: 15, scale: 2 }),
  businessLocationOwnership: varchar("business_location_ownership", {
    length: 100,
  }),
  businessLocationOwnershipOther: varchar("business_location_ownership_other", {
    length: 255,
  }),

  // Hotel details
  hotelAccommodationType: varchar("hotel_accommodation_type", { length: 100 }),
  hotelRoomCount: integer("hotel_room_count"),
  hotelBedCount: integer("hotel_bed_count"),
  hotelRoomType: varchar("hotel_room_type", { length: 100 }),
  hotelHasHall: varchar("hotel_has_hall", { length: 100 }),
  hotelHallCapacity: integer("hotel_hall_capacity"),

  // Employee Information
  hasPartners: varchar("has_partners", { length: 100 }),
  totalPartners: integer("total_partners"),
  nepaliMalePartners: integer("nepali_male_partners"),
  nepaliFemalePartners: integer("nepali_female_partners"),
  hasForeignPartners: varchar("has_foreign_partners", { length: 100 }),
  foreignMalePartners: integer("foreign_male_partners"),
  foreignFemalePartners: integer("foreign_female_partners"),

  hasInvolvedFamily: varchar("has_involved_family", { length: 100 }),
  totalInvolvedFamily: integer("total_involved_family"),
  maleInvolvedFamily: integer("male_involved_family"),
  femaleInvolvedFamily: integer("female_involved_family"),

  hasPermanentEmployees: varchar("has_permanent_employees", { length: 100 }),
  totalPermanentEmployees: integer("total_permanent_employees"),
  nepaliMalePermanentEmployees: integer("nepali_male_permanent_employees"),
  nepaliFemalePermanentEmployees: integer("nepali_female_permanent_employees"),
  hasForeignPermanentEmployees: varchar("has_foreign_permanent_employees", {
    length: 100,
  }),
  foreignMalePermanentEmployees: integer("foreign_male_permanent_employees"),
  foreignFemalePermanentEmployees: integer(
    "foreign_female_permanent_employees",
  ),

  hasTemporaryEmployees: varchar("has_temporary_employees", { length: 100 }),
  totalTemporaryEmployees: integer("total_temporary_employees"),
  nepaliMaleTemporaryEmployees: integer("nepali_male_temporary_employees"),
  nepaliFemaleTemporaryEmployees: integer("nepali_female_temporary_employees"),
  hasForeignTemporaryEmployees: varchar("has_foreign_temporary_employees", {
    length: 100,
  }),
  foreignMaleTemporaryEmployees: integer("foreign_male_temporary_employees"),
  foreignFemaleTemporaryEmployees: integer(
    "foreign_female_temporary_employees",
  ),

  // Aquaculture Information
  aquacultureWardNo: integer("aquaculture_ward_no"),
  pondCount: integer("pond_count"),
  pondArea: decimal("pond_area", { precision: 10, scale: 2 }),
  fishProduction: decimal("fish_production", { precision: 10, scale: 2 }),
  fingerlingNumber: integer("fingerling_number"),
  totalInvestment: decimal("total_investment", { precision: 10, scale: 2 }),
  annualIncome: decimal("annual_income", { precision: 10, scale: 2 }),
  employmentCount: integer("employment_count"),

  // Apiculture Information
  apicultureWardNo: integer("apiculture_ward_no"),
  hiveCount: integer("hive_count"),
  honeyProduction: decimal("honey_production", { precision: 10, scale: 2 }),
  hasApiculture: varchar("has_apiculture"),
});

export const businessStatusEnum = pgEnum("business_status_enum", [
  "approved",
  "pending",
  "requested_for_edit",
  "rejected",
]);

export const business = pgTable("Kerabari_business", {
  id: varchar("id", { length: 48 }).primaryKey(),
  //  id: text("id").primaryKey(),
  // Enumerator Information
  enumeratorName: varchar("enumerator_name", { length: 255 }),
  phone: varchar("phone", { length: 20 }),

  // Business Basic Information
  businessName: varchar("business_name", { length: 255 }),
  wardNo: integer("ward_no"),
  areaCode: integer("area_code"),
  businessNo: varchar("business_no", { length: 48 }),
  locality: varchar("locality", { length: 255 }),

  // Operator Details
  operatorName: varchar("operator_name", { length: 255 }),
  operatorPhone: varchar("operator_phone", { length: 20 }),
  operatorAge: integer("operator_age"),
  operatorGender: varchar("operator_gender", { length: 20 }),
  operatorEducation: varchar("operator_education", { length: 100 }),

  // Business Classification
  businessNature: varchar("business_nature", { length: 100 }),
  businessNatureOther: varchar("business_nature_other", { length: 255 }),
  businessType: varchar("business_type", { length: 100 }),
  businessTypeOther: varchar("business_type_other", { length: 255 }),

  // Media (audio & images stored as bucket keys)
  surveyAudioRecording: varchar("survey_audio_recording", { length: 255 }),
  gps: geometry("gps", { type: "Point" }),
  altitude: decimal("altitude"),
  gpsAccuracy: decimal("gps_accuracy"),
  businessImage: varchar("business_image", { length: 255 }),
  enumeratorSelfie: varchar("enumerator_selfie", { length: 255 }),

  // Registration and Legal Information
  registrationStatus: varchar("registration_status", { length: 100 }),
  registeredBodies: text("registered_bodies").array(),
  registeredBodiesOther: varchar("registered_bodies_other", { length: 255 }),
  statutoryStatus: varchar("statutory_status", { length: 100 }),
  statutoryStatusOther: varchar("statutory_status_other", { length: 255 }),
  panStatus: varchar("pan_status", { length: 100 }),
  panNumber: varchar("pan_number", { length: 50 }),

  // // Location Data
  // gps: geometry("gps", { type: "Point" }),
  // altitude: decimal("altitude"),
  // gpsAccuracy: decimal("gps_accuracy"),

  // Financial and Property Information
  investmentAmount: decimal("investment_amount", { precision: 15, scale: 2 }),
  businessLocationOwnership: varchar("business_location_ownership", {
    length: 100,
  }),
  businessLocationOwnershipOther: varchar("business_location_ownership_other", {
    length: 255,
  }),

  // Employee Information
  hasPartners: varchar("has_partners", { length: 255 }),
  totalPartners: integer("total_partners"),
  nepaliMalePartners: integer("nepali_male_partners"),
  nepaliFemalePartners: integer("nepali_female_partners"),
  hasForeignPartners: varchar("has_foreign_partners", { length: 100 }),
  foreignMalePartners: integer("foreign_male_partners"),
  foreignFemalePartners: integer("foreign_female_partners"),

  hasInvolvedFamily: varchar("has_involved_family", { length: 100 }),
  totalInvolvedFamily: integer("total_involved_family"),
  maleInvolvedFamily: integer("male_involved_family"),
  femaleInvolvedFamily: integer("female_involved_family"),

  hasPermanentEmployees: varchar("has_permanent_employees", { length: 100 }),
  totalPermanentEmployees: integer("total_permanent_employees"),
  nepaliMalePermanentEmployees: integer("nepali_male_permanent_employees"),
  nepaliFemalePermanentEmployees: integer("nepali_female_permanent_employees"),
  hasForeignPermanentEmployees: varchar("has_foreign_permanent_employees", {
    length: 100,
  }),
  foreignMalePermanentEmployees: integer("foreign_male_permanent_employees"),
  foreignFemalePermanentEmployees: integer(
    "foreign_female_permanent_employees",
  ),

  hasTemporaryEmployees: varchar("has_temporary_employees", { length: 100 }),
  totalTemporaryEmployees: integer("total_temporary_employees"),
  nepaliMaleTemporaryEmployees: integer("nepali_male_temporary_employees"),
  nepaliFemaleTemporaryEmployees: integer("nepali_female_temporary_employees"),
  hasForeignTemporaryEmployees: varchar("has_foreign_temporary_employees", {
    length: 100,
  }),
  foreignMaleTemporaryEmployees: integer("foreign_male_temporary_employees"),
  foreignFemaleTemporaryEmployees: integer(
    "foreign_female_temporary_employees",
  ),

  // Aquaculture Information
  aquacultureWardNo: integer("aquaculture_ward_no"),
  pondCount: integer("pond_count"),
  pondArea: decimal("pond_area", { precision: 10, scale: 2 }),
  fishProduction: decimal("fish_production", { precision: 10, scale: 2 }),
  fingerlingNumber: integer("fingerling_number"),
  totalInvestment: decimal("total_investment", { precision: 10, scale: 2 }),
  annualIncome: decimal("annual_income", { precision: 10, scale: 2 }),
  employmentCount: integer("employment_count"),

  // Apiculture Information
  apicultureWardNo: integer("apiculture_ward_no"),
  hiveCount: integer("hive_count"),
  honeyProduction: decimal("honey_production", { precision: 10, scale: 2 }),
  hasApiculture: varchar("has_apiculture"),

  // Temoprary fields to store the data that is not yet approved
  tmpAreaCode: varchar("tmp_area_code", { length: 255 }),
  tmpWardNumber: integer("tmp_ward_number"),
  tmpEnumeratorId: varchar("tmp_enumerator_id", { length: 255 }),
  tmpBuildingToken: varchar("tmp_building_token", { length: 255 }),

  // Foreign keys that satisfy the building constraints
  areaId: varchar("area_id", { length: 255 }).references(() => areas.id),
  enumeratorId: varchar("user_id", { length: 21 }).references(() => users.id),
  wardId: integer("ward_id").references(() => wards.wardNumber),
  buildingToken: varchar("building_token", { length: 255 }).references(
    () => buildingTokens.token,
  ),

  // Flags to identify the correctness of given input data
  isAreaValid: boolean("is_area_invalid").default(false),
  isWardValid: boolean("is_ward_invalid").default(false),
  isBuildingTokenValid: boolean("is_building_token_invalid").default(false),
  isEnumeratorValid: boolean("is_enumerator_invalid").default(false),

  status: businessStatusEnum("status").default("pending"),
});

// Table for building edit requests
export const businessEditRequests = pgTable(
  "Kerabari_business_edit_requests",
  {
    id: varchar("id", { length: 48 }).primaryKey(),
    businessId: varchar("business_id", { length: 48 }).references(
      () => business.id,
    ),
    message: text("message").notNull(),
    requestedAt: timestamp("requested_at").defaultNow(),
  },
);

export type BusinessEditRequest = typeof businessEditRequests.$inferSelect;

export type StagingBusiness = typeof stagingBusiness.$inferSelect;
export type BusinessSchema = typeof business.$inferSelect;

export const businessWithUpdatedNames = pgTable("Kerabari_business_with_updated_names", {
  id: varchar("id", { length: 48 }),
  enumeratorName: varchar("enumerator_name", { length: 255 }),
  mainEnumeratorName: varchar("main_enumerator_name", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  businessName: varchar("business_name", { length: 255 }),
  wardNo: integer("ward_no"),
  areaCode: integer("area_code"),
  businessNo: varchar("business_no", { length: 48 }),
  locality: varchar("locality", { length: 255 }),
  operatorName: varchar("operator_name", { length: 255 }),
  operatorPhone: varchar("operator_phone", { length: 20 }),
  operatorAge: integer("operator_age"),
  operatorGender: varchar("operator_gender", { length: 20 }),
  operatorEducation: varchar("operator_education", { length: 100 }),
  businessNature: varchar("business_nature", { length: 100 }),
  businessNatureOther: varchar("business_nature_other", { length: 255 }),
  businessType: varchar("business_type", { length: 100 }),
  businessTypeOther: varchar("business_type_other", { length: 255 }),
  surveyAudioRecording: varchar("survey_audio_recording", { length: 255 }),
  gps: geometry("gps", { type: "Point" }),
  altitude: decimal("altitude"),
  gpsAccuracy: decimal("gps_accuracy"),
  businessImage: varchar("business_image", { length: 255 }),
  enumeratorSelfie: varchar("enumerator_selfie", { length: 255 }),
  registrationStatus: varchar("registration_status", { length: 100 }),
  registeredBodies: text("registered_bodies").array(),
  registeredBodiesOther: varchar("registered_bodies_other", { length: 255 }),
  statutoryStatus: varchar("statutory_status", { length: 100 }),
  statutoryStatusOther: varchar("statutory_status_other", { length: 255 }),
  panStatus: varchar("pan_status", { length: 100 }),
  panNumber: varchar("pan_number", { length: 50 }),
  investmentAmount: decimal("investment_amount", { precision: 15, scale: 2 }),
  businessLocationOwnership: varchar("business_location_ownership", { length: 100 }),
  businessLocationOwnershipOther: varchar("business_location_ownership_other", { length: 255 }),
  hasPartners: varchar("has_partners", { length: 255 }),
  totalPartners: integer("total_partners"),
  nepaliMalePartners: integer("nepali_male_partners"),
  nepaliFemalePartners: integer("nepali_female_partners"),
  hasForeignPartners: varchar("has_foreign_partners", { length: 100 }),
  foreignMalePartners: integer("foreign_male_partners"),
  foreignFemalePartners: integer("foreign_female_partners"),
  hasInvolvedFamily: varchar("has_involved_family", { length: 100 }),
  totalInvolvedFamily: integer("total_involved_family"),
  maleInvolvedFamily: integer("male_involved_family"),
  femaleInvolvedFamily: integer("female_involved_family"),
  hasPermanentEmployees: varchar("has_permanent_employees", { length: 100 }),
  totalPermanentEmployees: integer("total_permanent_employees"),
  nepaliMalePermanentEmployees: integer("nepali_male_permanent_employees"),
  nepaliFemalePermanentEmployees: integer("nepali_female_permanent_employees"),
  hasForeignPermanentEmployees: varchar("has_foreign_permanent_employees", { length: 100 }),
  foreignMalePermanentEmployees: integer("foreign_male_permanent_employees"),
  foreignFemalePermanentEmployees: integer("foreign_female_permanent_employees"),
  hasTemporaryEmployees: varchar("has_temporary_employees", { length: 100 }),
  totalTemporaryEmployees: integer("total_temporary_employees"),
  nepaliMaleTemporaryEmployees: integer("nepali_male_temporary_employees"),
  nepaliFemaleTemporaryEmployees: integer("nepali_female_temporary_employees"),
  hasForeignTemporaryEmployees: varchar("has_foreign_temporary_employees", { length: 100 }),
  foreignMaleTemporaryEmployees: integer("foreign_male_temporary_employees"),
  foreignFemaleTemporaryEmployees: integer("foreign_female_temporary_employees"),
  aquacultureWardNo: integer("aquaculture_ward_no"),
  pondCount: integer("pond_count"),
  pondArea: decimal("pond_area", { precision: 10, scale: 2 }),
  fishProduction: decimal("fish_production", { precision: 10, scale: 2 }),
  fingerlingNumber: integer("fingerling_number"),
  totalInvestment: decimal("total_investment", { precision: 10, scale: 2 }),
  annualIncome: decimal("annual_income", { precision: 10, scale: 2 }),
  employmentCount: integer("employment_count"),
  apicultureWardNo: integer("apiculture_ward_no"),
  hiveCount: integer("hive_count"),
  honeyProduction: decimal("honey_production", { precision: 10, scale: 2 }),
  hasApiculture: varchar("has_apiculture"),
  tmpAreaCode: varchar("tmp_area_code", { length: 255 }),
  tmpWardNumber: integer("tmp_ward_number"),
  tmpEnumeratorId: varchar("tmp_enumerator_id", { length: 255 }),
  tmpBuildingToken: varchar("tmp_building_token", { length: 255 }),
  areaId: varchar("area_id", { length: 255 }),
  enumeratorId: varchar("user_id", { length: 21 }),
  wardId: integer("ward_id"),
  buildingToken: varchar("building_token", { length: 255 }),
  isAreaValid: boolean("is_area_invalid"),
  isWardValid: boolean("is_ward_invalid"),
  isBuildingTokenValid: boolean("is_building_token_invalid"),
  isEnumeratorValid: boolean("is_enumerator_invalid"),
  status: businessStatusEnum("status"),
});

export type BusinessWithUpdatedNames = typeof businessWithUpdatedNames.$inferSelect;
