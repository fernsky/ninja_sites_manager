import {
  pgTable,
  varchar,
  integer,
  timestamp,
  decimal,
  text,
  jsonb,
} from "drizzle-orm/pg-core";
import { HouseholdData } from "./household-data.model";
import { BusinessData } from "./business-data.model";

// Aggregated building data
export const KerabariAggregateBuilding = pgTable(
  "Kerabari_aggregate_buildings",
  {
    // Primary identifier
    id: varchar("id", { length: 48 }).primaryKey(),
    building_id: varchar("building_id", { length: 48 }),

    // Dates and enumerator info
    building_survey_date: timestamp("building_survey_date"),
    building_submission_date: timestamp("building_submission_date"),
    enumerator_id: varchar("enumerator_id", { length: 255 }),
    enumerator_name: varchar("enumerator_name", { length: 255 }),
    enumerator_phone: varchar("enumerator_phone", { length: 50 }),

    // Location info
    ward_number: integer("ward_number"),
    area_code: integer("area_code"),
    locality: varchar("locality", { length: 255 }),

    // Building details
    building_token: varchar("building_token", { length: 255 }),
    building_owner_name: varchar("building_owner_name", { length: 255 }),
    building_owner_phone: varchar("building_owner_phone", { length: 50 }),

    // Counts
    total_families: integer("total_families"),
    total_businesses: integer("total_businesses"),

    // GPS coordinates
    building_gps_latitude: decimal("building_gps_latitude", {
      precision: 10,
      scale: 6,
    }),
    building_gps_longitude: decimal("building_gps_longitude", {
      precision: 10,
      scale: 6,
    }),
    building_gps_altitude: decimal("building_gps_altitude", {
      precision: 10,
      scale: 2,
    }),
    building_gps_accuracy: decimal("building_gps_accuracy", {
      precision: 10,
      scale: 2,
    }),

    // Building characteristics
    building_ownership_status: varchar("building_ownership_status", {
      length: 100,
    }),
    building_ownership_status_other: text("building_ownership_status_other"),
    building_base: varchar("building_base", { length: 100 }),
    building_base_other: text("building_base_other"),
    building_outer_wall: varchar("building_outer_wall", { length: 100 }),
    building_outer_wall_other: text("building_outer_wall_other"),
    building_roof: varchar("building_roof", { length: 100 }),
    building_roof_other: text("building_roof_other"),

    // Additional building characteristics from parse-building.ts
    building_floor: varchar("building_floor", { length: 100 }),
    building_floor_other: text("building_floor_other"),
    map_status: varchar("map_status", { length: 50 }),

    // Natural disaster information
    natural_disasters: text("natural_disasters").array(),
    natural_disasters_other: text("natural_disasters_other"),

    // Accessibility metrics
    time_to_market: varchar("time_to_market", { length: 50 }),
    time_to_active_road: varchar("time_to_active_road", { length: 50 }),
    time_to_public_bus: varchar("time_to_public_bus", { length: 50 }),
    time_to_health_organization: varchar("time_to_health_organization", {
      length: 50,
    }),
    time_to_financial_organization: varchar("time_to_financial_organization", {
      length: 50,
    }),
    road_status: varchar("road_status", { length: 50 }),
    road_status_other: text("road_status_other"),

    // Media keys
    building_image_key: varchar("building_image_key", { length: 255 }),
    building_enumerator_selfie_key: varchar("building_enumerator_selfie_key", {
      length: 255,
    }),
    building_audio_recording_key: varchar("building_audio_recording_key", {
      length: 255,
    }),

    // JSONB fields for nested data
    households: jsonb("households").$type<HouseholdData[]>(),
    businesses: jsonb("businesses").$type<BusinessData[]>(),

    // Metadata
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").$onUpdate(() => new Date()),
  },
);

export type KerabariAggregateBuilding =
  typeof KerabariAggregateBuilding.$inferSelect;

export type NewKerabariAggregateBuilding =
  typeof KerabariAggregateBuilding.$inferInsert;
