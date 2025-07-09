import { jsonToPostgres } from "@/lib/utils";
import { mapBuildingChoices } from "@/lib/resources/building";
import { sql } from "drizzle-orm";
import { processGPSData } from "../utils";

const data = {
  intro: null,
  enumerator_id: "7081",
  enumerator_name: "Mallika Rai",
  monitoring_audio: null,
  area_code: "1001",
  ward_no: 1,
  building_token: "6784",
  building_owner_name: "Sudarshan Rai",
  locality: "Budhabare",
  total_families: 2,
  tmp_location: "POINT (45.649038 34.678394 0)",
  total_businesses: 12,
  survey_date: "2025-01-15T07:47:13.803+05:45",
  ownership_status: "private",
  other_ownership_status: null,
  house_base: "concrete_pillar",
  house_base_other: null,
  house_outer_wall: "unbaked_brick",
  house_outer_wall_other: null,
  house_roof: "tin",
  house_roof_other: null,
  house_floor: "wood",
  house_floor_other: null,
  map_status: "map_passed",
  natural_disasters: "landslide cutting",
  natural_disasters_other: null,
  time_to_market: "under_15_min",
  time_to_act_road: "under_15_min",
  time_to_pub_bus: "under_15_min",
  time_to_health_inst: "under_15_min",
  time_to_financial_org: "under_15_min",
  road_status: "black_topped",
  road_status_other: null,
  building_image: "Screenshot 2025-01-14 at 17.06.29-7_48_16.png",
  enumerator_selfie: "Screenshot 2025-01-14 at 17.06.29-7_48_25.png",
  meta: { instanceID: "uuid:267b48e6-1a86-4a4c-8274-54585d3deda5" },
  __id: "uuid:267b48e6-1a86-4a4c-8274-54585d3deda5",
  __system: {
    submissionDate: "2025-01-15T02:05:27.356Z",
    updatedAt: null,
    submitterId: "5",
    submitterName: "supervisor@likhupike.com",
    attachmentsPresent: 2,
    attachmentsExpected: 2,
    status: null,
    reviewState: null,
    deviceId: null,
    edits: 0,
    formVersion: "kerbari",
  },
};

const dataWithLocationExpanded = {
  intro: null,
  enumerator_id: "7081",
  enumerator_name: "Mallika Rai",
  monitoring_audio: null,
  area_code: "1001",
  ward_no: 1,
  building_token: "6784",
  building_owner_name: "Sudarshan Rai",
  locality: "Budhabare",
  total_families: 2,
  tmp_location: {
    type: "Point",
    coordinates: [45.649038, 34.678394, 0],
    properties: { accuracy: 0 },
  },
  total_businesses: 12,
  survey_date: "2025-01-15T07:47:13.803+05:45",
  ownership_status: "private",
  other_ownership_status: null,
  house_base: "concrete_pillar",
  house_base_other: null,
  house_outer_wall: "unbaked_brick",
  house_outer_wall_other: null,
  house_roof: "tin",
  house_roof_other: null,
  house_floor: "wood",
  house_floor_other: null,
  map_status: "map_passed",
  natural_disasters: "landslide cutting",
  natural_disasters_other: null,
  time_to_market: "under_15_min",
  time_to_act_road: "under_15_min",
  time_to_pub_bus: "under_15_min",
  time_to_health_inst: "under_15_min",
  time_to_financial_org: "under_15_min",
  road_status: "black_topped",
  road_status_other: null,
  building_image: "Screenshot 2025-01-14 at 17.06.29-7_48_16.png",
  enumerator_selfie: "Screenshot 2025-01-14 at 17.06.29-7_48_25.png",
  meta: { instanceID: "uuid:267b48e6-1a86-4a4c-8274-54585d3deda5" },
  __id: "uuid:267b48e6-1a86-4a4c-8274-54585d3deda5",
  __system: {
    submissionDate: "2025-01-15T02:05:27.356Z",
    updatedAt: null,
    submitterId: "5",
    submitterName: "supervisor@likhupike.com",
    attachmentsPresent: 2,
    attachmentsExpected: 2,
    status: null,
    reviewState: null,
    deviceId: null,
    edits: 0,
    formVersion: "kerbari",
  },
};

/**
 * Raw building survey data structure from ODK
 */
export interface RawBuildingData {
  // Enumerator Information
  enumerator_id: string;
  enumerator_name: string;
  monitoring_audio: null | string;

  // Location Identifiers
  area_code: string;
  ward_no: number;
  building_token: string;
  building_owner_name: string;
  locality: string;

  // Building Demographics
  total_families: number;
  total_businesses: number;

  // Geolocation Data
  tmp_location: string; // Can be POINT string or GeoJSON object

  // Survey Metadata
  survey_date: string;

  // Building Characteristics
  ownership_status: string;
  other_ownership_status: null | string;

  // Building Structure
  house_base: string;
  house_base_other: null | string;
  house_outer_wall: string;
  house_outer_wall_other: null | string;
  house_roof: string;
  house_roof_other: null | string;
  house_floor: string;
  house_floor_other: null | string;

  // Assessment Data
  map_status: string;
  natural_disasters: string;
  natural_disasters_other: null | string;

  // Accessibility Metrics
  time_to_market: string;
  time_to_act_road: string;
  time_to_pub_bus: string;
  time_to_health_inst: string;
  time_to_financial_org: string;
  road_status: string;
  road_status_other: null | string;

  // Media Attachments
  building_image: string;
  enumerator_selfie: string;

  // System Fields
  meta: { instanceID: string };
  __id: string;
  __system: {
    submissionDate: string;
    updatedAt: null;
    submitterId: string;
    submitterName: string;
    attachmentsPresent: number;
    attachmentsExpected: number;
    status: null;
    reviewState: null;
    deviceId: null;
    edits: number;
    formVersion: string;
  };
}

/**
 * Parses raw building survey data into normalized database structure
 *
 * @param r - Raw building data from ODK
 * @returns Normalized building data matching database schema
 */
export async function parseAndInsertInStaging(data: RawBuildingData, ctx: any) {
  const r = mapBuildingChoices(data);
  console.log(r);

  // Process GPS data using the new function
  const gpsData = processGPSData(r.tmp_location);

  // Transform and normalize the data according to database schema
  const payload = {
    id: r.__id, // Unique identifier for the record
    survey_date: new Date(r.survey_date).toISOString(),
    enumerator_name: r.enumerator_name,
    enumerator_id: r.enumerator_id,

    // Location & general information
    area_code: r.area_code,
    ward_number: r.ward_no,
    locality: r.locality,
    building_token: r.building_token,

    // Family and business details
    total_families: r.total_families,
    total_businesses: r.total_businesses,

    // Media (audio & images stored as bucket keys)
    gps: gpsData.gps,
    altitude: gpsData.altitude,
    gps_accuracy: gpsData.gpsAccuracy,

    // Building materials
    land_ownership: r.ownership_status, // e.g., Private, Public
    base: r.house_base,
    outer_wall: r.house_outer_wall,
    roof: r.house_roof,
    floor: r.house_floor,

    // Map and disaster-related info
    map_status: r.map_status, // e.g., Passed, Pending
    natural_disasters: r.natural_disasters, // e.g., Flood, Landslide

    // Accessibility
    time_to_market: r.time_to_market, // e.g., Under 15 minutes
    time_to_active_road: r.time_to_act_road,
    time_to_public_bus: r.time_to_pub_bus,
    time_to_health_organization: r.time_to_health_inst,
    time_to_financial_organization: r.time_to_financial_org,
    road_status: r.road_status, // e.g., Graveled, Paved
  };

  const statement = jsonToPostgres("staging_Kerabari_buildings", payload);

  if (statement) {
    await ctx.db.execute(sql.raw(statement));
  }
}
