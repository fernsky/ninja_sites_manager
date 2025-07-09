import {
  pgTable,
  varchar,
  integer,
  timestamp,
  decimal,
  doublePrecision,
  pgEnum,
  text,
  boolean,
} from "drizzle-orm/pg-core";
import { geometry } from "../geographical";
import { areas, users, wards } from "./basic";

/*
We need to create two tables.
One to store the staging data that is parsed from the JSON given from ODK.
Another to store the actual data where modification happens.

This is done because, staging data is a subject to change on each reload and the actual
modification that happens should happen on the actual table.
There must be an option to Restore Survey Data while modifying in the actual buildings data.
*/

export const stagingBuildings = pgTable("staging_Kerabari_buildings", {
  id: varchar("id", { length: 48 }).primaryKey(), // Unique identifier for the record
  surveyDate: timestamp("survey_date"),
  enumeratorName: varchar("enumerator_name", { length: 255 }),
  enumeratorId: varchar("enumerator_id", { length: 255 }),

  // Location & general information
  areaCode: varchar("area_code", { length: 255 }),
  wardNumber: integer("ward_number"),
  locality: varchar("locality", { length: 255 }),
  buildingToken: varchar("building_token", { length: 255 }),

  // Family and business details
  totalFamilies: integer("total_families"),
  totalBusinesses: integer("total_businesses"),

  // Media (audio & images stored as bucket keys)
  surveyAudioRecording: varchar("survey_audio_recording", { length: 255 }),
  gps: geometry("gps", { type: "Point" }),
  altitude: decimal("altitude"),
  gpsAccuracy: decimal("gps_accuracy"),
  buildingImage: varchar("building_image", { length: 255 }),
  enumeratorSelfie: varchar("enumerator_selfie", { length: 255 }),

  // Building materials
  landOwnership: varchar("land_ownership", { length: 255 }), // e.g., Private, Public
  base: varchar("base", { length: 255 }),
  outerWall: varchar("outer_wall", { length: 255 }),
  roof: varchar("roof", { length: 255 }),
  floor: varchar("floor", { length: 255 }),

  // Map and disaster-related info
  mapStatus: varchar("map_status", { length: 255 }), // e.g., Passed, Pending
  naturalDisasters: text("natural_disasters").array(), // e.g., Flood, Landslide

  // Accessibility
  timeToMarket: varchar("time_to_market", { length: 255 }), // e.g., Under 15 minutes
  timeToActiveRoad: varchar("time_to_active_road", { length: 255 }),
  timeToPublicBus: varchar("time_to_public_bus", { length: 255 }),
  timeToHealthOrganization: varchar("time_to_health_organization", {
    length: 255,
  }),
  timeToFinancialOrganization: varchar("time_to_financial_organization", {
    length: 255,
  }),
  roadStatus: varchar("road_status", { length: 255 }), // e.g., Graveled, Paved
});

/*
Approved: The data for the building is valid.
Pending: The data is awaiting approval from the admin.
Requested For Edit: The collected data has been requested for editing back to enumerator.
Rejected: The data has been rejected.
*/

export const buildingStatusEnum = pgEnum("building_status_enum", [
  "approved",
  "pending",
  "requested_for_edit",
  "rejected",
]);

export const buildings = pgTable("Kerabari_buildings", {
  id: varchar("id", { length: 48 }).primaryKey(), // Unique identifier for the record
  surveyDate: timestamp("survey_date"),
  enumeratorName: varchar("enumerator_name", { length: 255 }),

  // Location & general information
  locality: varchar("locality", { length: 255 }),

  // Family and business details
  totalFamilies: integer("total_families"),
  totalBusinesses: integer("total_businesses"),

  // Media (audio & images stored as bucket keys)
  surveyAudioRecording: varchar("survey_audio_recording", { length: 255 }),
  gps: geometry("gps", { type: "Point" }),
  altitude: doublePrecision("altitude"),
  gpsAccuracy: doublePrecision("gps_accuracy"),
  buildingImage: varchar("building_image", { length: 255 }),
  enumeratorSelfie: varchar("enumerator_selfie", { length: 255 }),

  // Building materials
  landOwnership: varchar("land_ownership", { length: 255 }), // e.g., Private, Public
  base: varchar("base", { length: 255 }),
  outerWall: varchar("outer_wall", { length: 255 }),
  roof: varchar("roof", { length: 255 }),
  floor: varchar("floor", { length: 255 }),

  // Map and disaster-related info
  mapStatus: varchar("map_status", { length: 255 }), // e.g., Passed, Pending
  naturalDisasters: text("natural_disasters").array(), // e.g., Flood, Landslide

  // Accessibility
  timeToMarket: varchar("time_to_market", { length: 255 }), // e.g., Under 15 minutes
  timeToActiveRoad: varchar("time_to_active_road", { length: 255 }),
  timeToPublicBus: varchar("time_to_public_bus", { length: 255 }),
  timeToHealthOrganization: varchar("time_to_health_organization", {
    length: 255,
  }),
  timeToFinancialOrganization: varchar("time_to_financial_organization", {
    length: 255,
  }),
  roadStatus: varchar("road_status", { length: 255 }), // e.g., Graveled, Paved
  status: buildingStatusEnum("status").default("pending"),

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
});

// Table for building edit requests
export const buildingEditRequests = pgTable(
  "Kerabari_building_edit_requests",
  {
    id: varchar("id", { length: 48 }).primaryKey(),
    buildingId: varchar("building_id", { length: 48 }).references(
      () => buildings.id,
    ),
    message: text("message").notNull(), // Description of what needs to be edited
    requestedAt: timestamp("requested_at").defaultNow(),
  },
);

export type BuildingEditRequest = typeof buildingEditRequests.$inferSelect;

export type StagingBuilding = typeof stagingBuildings.$inferSelect;
export type BuildingSchema = typeof buildings.$inferSelect;

export const buildingTokenStatusEnum = pgEnum("building_token_status_enum", [
  "allocated",
  "unallocated",
]);

export const buildingTokens = pgTable("Kerabari_building_tokens", {
  token: varchar("token", { length: 48 }).primaryKey(),
  areaId: varchar("area_id", { length: 48 }).references(() => areas.id),
  status: buildingTokenStatusEnum("status").default("unallocated"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type BuildingToken = typeof buildingTokens.$inferSelect;

export const buildingsWithUpdatedNames = pgTable("Kerabari_buildings_with_updated_names", {
  id: varchar("id", { length: 48 }),
  surveyDate: timestamp("survey_date"),
  enumeratorName: varchar("enumerator_name", { length: 255 }),
  mainEnumeratorName: varchar("main_enumerator_name", { length: 255 }),
  locality: varchar("locality", { length: 255 }),
  totalFamilies: integer("total_families"),
  totalBusinesses: integer("total_businesses"),
  surveyAudioRecording: varchar("survey_audio_recording", { length: 255 }),
  gps: geometry("gps", { type: "Point" }),
  altitude: doublePrecision("altitude"),
  gpsAccuracy: doublePrecision("gps_accuracy"),
  buildingImage: varchar("building_image", { length: 255 }),
  enumeratorSelfie: varchar("enumerator_selfie", { length: 255 }),
  landOwnership: varchar("land_ownership", { length: 255 }),
  base: varchar("base", { length: 255 }),
  outerWall: varchar("outer_wall", { length: 255 }),
  roof: varchar("roof", { length: 255 }),
  floor: varchar("floor", { length: 255 }),
  mapStatus: varchar("map_status", { length: 255 }),
  naturalDisasters: text("natural_disasters").array(),
  timeToMarket: varchar("time_to_market", { length: 255 }),
  timeToActiveRoad: varchar("time_to_active_road", { length: 255 }),
  timeToPublicBus: varchar("time_to_public_bus", { length: 255 }),
  timeToHealthOrganization: varchar("time_to_health_organization", { length: 255 }),
  timeToFinancialOrganization: varchar("time_to_financial_organization", { length: 255 }),
  roadStatus: varchar("road_status", { length: 255 }),
  status: buildingStatusEnum("status"),
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
});

export type BuildingsWithUpdatedNames = typeof buildingsWithUpdatedNames.$inferSelect;
