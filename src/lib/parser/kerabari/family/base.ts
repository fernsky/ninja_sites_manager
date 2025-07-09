import { RawFamily } from "./types";
import { processGPSData } from "../../utils";
import {
  decodeSingleChoice,
  decodeMultipleChoices,
} from "@/lib/resources/utils";
import { familyChoices } from "@/lib/resources/family";
import { jsonToPostgres } from "@/lib/utils";
import { sql } from "drizzle-orm";

export async function parseFamilyBase(r: RawFamily, ctx: any) {
  const gpsData = processGPSData(r.id.tmp_location);

  const mainFamilyTable = {
    id: r.__id,

    // Enumerator Information
    enumerator_name: r.enumerator_introduction.enumerator_name,
    enumerator_phone: r.enumerator_introduction.enumerator_phone,
    enumerator_id: r.enumerator_introduction.enumerator_id,
    building_token: r.enumerator_introduction.building_token,
    survey_date: r.id.doi,

    // Location Details
    ward_no: r.id.ward_no,
    area_code: r.id.area_code,
    locality: r.id.locality,
    dev_org: r.id.dev_org,
    gps: gpsData.gps,
    altitude: gpsData.altitude,
    gps_accuracy: gpsData.gpsAccuracy,

    // Family Details
    head_name: r.id.head_name,
    head_phone: r.id.head_ph,
    total_members: r.id.members.total_mem,
    is_sanitized: r.id.members.is_sanitized,

    // House Details
    house_ownership: decodeSingleChoice(
      r.hh.h_oship,
      familyChoices.house_ownership,
    ),
    house_ownership_other: r.hh.h_oship_oth,
    feels_safe: r.hh.is_safe,
    water_source: decodeMultipleChoices(
      r.hh.wsrc,
      familyChoices.drinking_water_source,
    ),
    water_source_other: r.hh.water_src_oth,
    water_purification_methods: decodeMultipleChoices(
      r.hh.water_puri,
      familyChoices.water_purification,
    ),
    toilet_type: decodeSingleChoice(
      r.hh.toilet_type,
      familyChoices.toilet_type,
    ),
    solid_waste: decodeSingleChoice(
      r.hh.solid_waste,
      familyChoices.solid_waste,
    ),
    solid_waste_other: r.hh.solid_waste_oth,

    // Energy and Facilities
    primary_cooking_fuel: decodeSingleChoice(
      r.hh.primary_cf,
      familyChoices.cooking_fuel,
    ),
    primary_energy_source: decodeSingleChoice(
      r.hh.primary_es,
      familyChoices.energy_source,
    ),
    primary_energy_source_other: r.hh.primary_es_oth,
    facilities: decodeMultipleChoices(
      r.hh.facilitites,
      familyChoices.facilities,
    ),

    // Economic Details
    female_properties: decodeSingleChoice(
      r.hh.fem_prop,
      familyChoices.elsewhere_properties,
    ),
    loaned_organizations: decodeMultipleChoices(
      r.hh.loaned_organization,
      familyChoices.loaned_organization,
    ),
    loan_use: decodeMultipleChoices(r.hh.loan_use, familyChoices.loan_use),
    has_bank: decodeMultipleChoices(
      r.hh.has_bacc,
      familyChoices.financial_organization,
    ),
    has_insurance: r.hh.has_insurance,
    health_org: decodeSingleChoice(
      r.hh.health_org,
      familyChoices.health_organization,
    ),
    health_org_other: r.hh.heatlth_org_oth,
    income_sources: decodeMultipleChoices(
      r.hh.income_sources,
      familyChoices.income_sources,
    ),
    municipal_suggestions: decodeMultipleChoices(
      r.hh.municipal_suggestions,
      familyChoices.municipal_suggestions,
    ),
    municipal_suggestions_other: r.hh.municipal_suggestions_oth,

    // Additional Data
    has_remittance: r.has_remittance === "yes",
    remittance_expenses: decodeMultipleChoices(
      r.remittance_expenses,
      familyChoices.remittance_expenses,
    ),
  };

  const mainStatement = jsonToPostgres(
    "staging_Kerabari_family",
    mainFamilyTable,
  );

  if (mainStatement) {
    await ctx.db.execute(sql.raw(mainStatement));
  }
}
