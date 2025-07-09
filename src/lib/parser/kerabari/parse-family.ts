import { jsonToPostgres } from "@/lib/utils";
import { sql } from "drizzle-orm";
import { RawFamily } from "./family/types";
import { processGPSData } from "../utils";
import {
  decodeMultipleChoices,
  decodeSingleChoice,
} from "@/lib/resources/utils";
import { familyChoices } from "@/lib/resources/family";

/**
 * Parses raw family survey data into normalized database structure with extensive error handling
 *
 * @param r - Raw family data from ODK
 * @returns Normalized family data matching database schema
 */
export async function parseAndInsertInStaging(r: RawFamily, ctx: any) {
  try {
    let gpsData;
    try {
      gpsData = processGPSData(r.id.tmp_location);
    } catch (error) {
      console.error('Error processing GPS data:', error);
      gpsData = { gps: null, altitude: null, gpsAccuracy: null };
    }

    const mainFamilyTable = {
      // Unique Identifier
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

      // Family Basic Information
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
        familyChoices.financial_organization,
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

    // Insert main family data
    try {
      const mainStatement = jsonToPostgres("staging_Kerabari_family", mainFamilyTable);
      if (mainStatement) {
        await ctx.db.execute(sql.raw(mainStatement));
      }
    } catch (error) {
      console.error('Error inserting main family data:', error);
      throw new Error(`Failed to insert main family data: ${error}`);
    }

    // Process individuals
    if (r.individual?.length > 0) {
      for (const i of r.individual) {
        try {
          // Process individual
          const individual = await processIndividual(i, r, ctx);
          
          // Insert individual
          try {
            const individualStatement = jsonToPostgres(
              "staging_Kerabari_individual",
              individual,
              "ON CONFLICT(id) DO UPDATE SET"
            );
            if (individualStatement) {
              await ctx.db.execute(sql.raw(individualStatement));
            }
          } catch (dbError) {
            console.error(`Database error inserting individual ${i.name}:`, dbError);
            throw dbError;
          }
        } catch (indError) {
          console.error(`Error processing individual ${i.name}:`, indError);
          // Continue with next individual
          continue;
        }
      }
    }

    // Process agricultural lands
    if (r.agri?.agricultural_land?.length > 0) {
      for (const land of r.agri.agricultural_land) {
        try {
          const agricultural_land = processAgriculturalLand(land, r);
          const agricultureStatement = jsonToPostgres(
            "staging_Kerabari_agricultural_land",
            agricultural_land,
            "ON CONFLICT(id) DO UPDATE SET"
          );
          if (agricultureStatement) {
            await ctx.db.execute(sql.raw(agricultureStatement));
          }
        } catch (error) {
          console.error('Error processing agricultural land:', error);
          continue;
        }
      }
    }

    // Process food crops
    if (r.agri?.food?.fcrop_details?.length > 0) {
      for (const i of r.agri.food.fcrop_details) {
        try {
          const crop = {
            id: i.__id,
            household_id: r.__id,
            ward_no: r.id.ward_no,
            crop_type: "food",
            crop_name: decodeSingleChoice(
              i.fcrop,
              familyChoices.food_crops,
            ),
            area:
              (i.fcrop_area_description.fcrop_bigha ?? 0) * 6772.63 +
              (i.fcrop_area_description.fcrop_kattha ?? 0) * 338.63 +
              (i.fcrop_area_description.fcrop_dhur ?? 0) * 16.93,
            production: i.fp.fcrop_prod,
          };

          try {
            const cropStatement = jsonToPostgres(
              "staging_Kerabari_crop",
              crop,
              "ON CONFLICT(id) DO UPDATE SET"
            );
            if (cropStatement) {
              await ctx.db.execute(sql.raw(cropStatement));
            }
          } catch (error) {
            console.error(`Error inserting food crop:`, error);
          }
        } catch (error) {
          console.error(`Error processing food crop:`, error);
          continue;
        }
      }
    }

    // Process pulses
    if (r.agri?.food?.pulse_details?.length > 0) {
      for (const i of r.agri.food.pulse_details) {
        try {
          const crop = {
            id: i.__id,
            household_id: r.__id,
            ward_no: r.id.ward_no,
            crop_type: "pulse",
            crop_name: i.pulse,
            area:
              (i.pulse_area_description.pulse_bigha ?? 0) * 6772.63 +
              (i.pulse_area_description.pulse_kattha ?? 0) * 338.63 +
              (i.pulse_area_description.pulse_dhur ?? 0) * 16.93,
            production: i.pp.pulse_prod,
          };

          try {
            const cropStatement = jsonToPostgres(
              "staging_Kerabari_crop",
              crop,
              "ON CONFLICT(id) DO UPDATE SET"
            );
            if (cropStatement) {
              await ctx.db.execute(sql.raw(cropStatement));
            }
          } catch (error) {
            console.error(`Error inserting pulse crop:`, error);
          }
        } catch (error) {
          console.error(`Error processing pulse crop:`, error);
          continue;
        }
      }
    }

    // Process vegetables
    if (r.agri?.food?.vtable_details?.length > 0) {
      for (const i of r.agri.food.vtable_details) {
        try {
          const crop = {
            id: i.__id,
            household_id: r.__id,
            ward_no: r.id.ward_no,
            crop_type: "vegetable",
            crop_name: i.vtable,
            area:
              (i.vtables_area_description.vtables_bigha ?? 0) * 6772.63 +
              (i.vtables_area_description.vtables_kattha ?? 0) * 338.63 +
              (i.vtables_area_description.vtables_dhur ?? 0) * 16.93,
            production: i.vp.vtable_prod,
          };

          try {
            const cropStatement = jsonToPostgres(
              "staging_Kerabari_crop",
              crop,
              "ON CONFLICT(id) DO UPDATE SET"
            );
            if (cropStatement) {
              await ctx.db.execute(sql.raw(cropStatement));
            }
          } catch (error) {
            console.error(`Error inserting vegetable crop:`, error);
          }
        } catch (error) {
          console.error(`Error processing vegetable crop:`, error);
          continue;
        }
      }
    }

    // Process oil seeds
    if (r.agri?.food?.oseed_details?.length > 0) {
      for (const i of r.agri.food.oseed_details) {
        try {
          const crop = {
            id: i.__id,
            household_id: r.__id,
            ward_no: r.id.ward_no,
            crop_type: "oilseed",
            crop_name: i.oseed,
            area:
              (i.oseed_area_description.oseed_bigha ?? 0) * 6772.63 +
              (i.oseed_area_description.oseed_kattha ?? 0) * 338.63 +
              (i.oseed_area_description.oseed_dhur ?? 0) * 16.93,
            production: i.oslp.oseed_prod,
          };

          try {
            const cropStatement = jsonToPostgres(
              "staging_Kerabari_crop",
              crop,
              "ON CONFLICT(id) DO UPDATE SET"
            );
            if (cropStatement) {
              await ctx.db.execute(sql.raw(cropStatement));
            }
          } catch (error) {
            console.error(`Error inserting oilseed crop:`, error);
          }
        } catch (error) {
          console.error(`Error processing oilseed crop:`, error);
          continue;
        }
      }
    }

    // Process fruits
    if (r.agri?.food?.fruit_details?.length > 0) {
      for (const i of r.agri.food.fruit_details) {
        try {
          const crop = {
            id: i.__id,
            household_id: r.__id,
            ward_no: r.id.ward_no,
            crop_type: "fruit",
            crop_name: i.fruit,
            area:
              (i.fruits_area_description.fruits_bigha ?? 0) * 6772.63 +
              (i.fruits_area_description.fruits_kattha ?? 0) * 338.63 +
              (i.fruits_area_description.fruits_dhur ?? 0) * 16.93,
            production: i.frp.fruit_prod,
          };

          try {
            const cropStatement = jsonToPostgres(
              "staging_Kerabari_crop",
              crop,
              "ON CONFLICT(id) DO UPDATE SET"
            );
            if (cropStatement) {
              await ctx.db.execute(sql.raw(cropStatement));
            }
          } catch (error) {
            console.error(`Error inserting fruit crop:`, error);
          }
        } catch (error) {
          console.error(`Error processing fruit crop:`, error);
          continue;
        }
      }
    }

    // Process spices
    if (r.agri?.food?.spice_details?.length > 0) {
      for (const i of r.agri.food.spice_details) {
        try {
          const crop = {
            id: i.__id,
            household_id: r.__id,
            ward_no: r.id.ward_no,
            crop_type: "spice",
            crop_name: i.spice,
            area:
              (i.spice_area_description.spice_bigha ?? 0) * 6772.63 +
              (i.spice_area_description.spice_kattha ?? 0) * 338.63 +
              (i.spice_area_description.spice_dhur ?? 0) * 16.93,
            production: i.sp.spice_prod,
          };

          try {
            const cropStatement = jsonToPostgres(
              "staging_Kerabari_crop",
              crop,
              "ON CONFLICT(id) DO UPDATE SET"
            );
            if (cropStatement) {
              await ctx.db.execute(sql.raw(cropStatement));
            }
          } catch (error) {
            console.error(`Error inserting spice crop:`, error);
          }
        } catch (error) {
          console.error(`Error processing spice crop:`, error);
          continue;
        }
      }
    }

    // Process cash crops
    if (r.agri?.food?.ccrop_details?.length > 0) {
      for (const i of r.agri.food.ccrop_details) {
        try {
          const crop = {
            id: i.__id,
            household_id: r.__id,
            ward_no: r.id.ward_no,
            crop_type: "cash",
            crop_name: i.ccrop,
            area:
              (i.ccrop_area_description.ccrop_bigha ?? 0) * 6772.63 +
              (i.ccrop_area_description.ccrop_kattha ?? 0) * 338.63 +
              (i.ccrop_area_description.ccrop_dhur ?? 0) * 16.93,
            production: i.cp.ccrop_prod,
          };

          try {
            const cropStatement = jsonToPostgres(
              "staging_Kerabari_crop",
              crop,
              "ON CONFLICT(id) DO UPDATE SET"
            );
            if (cropStatement) {
              await ctx.db.execute(sql.raw(cropStatement));
            }
          } catch (error) {
            console.error(`Error inserting cash crop:`, error);
          }
        } catch (error) {
          console.error(`Error processing cash crop:`, error);
          continue;
        }
      }
    }

    // Process animals
    if (r.agri?.animal_details?.length > 0) {
      for (const animalItem of r.agri.animal_details) {
        try {
          const animal = processAnimal(animalItem, r);
          const animalStatement = jsonToPostgres(
            "staging_Kerabari_animal",
            animal,
            "ON CONFLICT(id) DO UPDATE SET"
          );
          if (animalStatement) {
            await ctx.db.execute(sql.raw(animalStatement));
          }
        } catch (error) {
          console.error('Error processing animal:', error);
          continue;
        }
      }
    }

    // Process animal products
    if (r.agri?.aprod_details?.length > 0) {
      for (const productItem of r.agri.aprod_details) {
        try {
          const animalProduct = processAnimalProduct(productItem, r);
          const animalProductStatement = jsonToPostgres(
            "staging_Kerabari_animal_product",
            animalProduct,
            "ON CONFLICT(id) DO UPDATE SET"
          );
          if (animalProductStatement) {
            await ctx.db.execute(sql.raw(animalProductStatement));
          }
        } catch (error) {
          console.error('Error processing animal product:', error);
          continue;
        }
      }
    }

    // Process deaths
    if (r.death?.dno?.death_details?.length > 0) {
      for (const deathItem of r.death.dno.death_details) {
        try {
          const death = processDeath(deathItem, r);
          const deathStatement = jsonToPostgres(
            "staging_Kerabari_death",
            death,
            "ON CONFLICT(id) DO UPDATE SET"
          );
          if (deathStatement) {
            await ctx.db.execute(sql.raw(deathStatement));
          }
        } catch (error) {
          console.error('Error processing death record:', error);
          continue;
        }
      }
    }

  } catch (error) {
    console.error('Fatal error in parseAndInsertInStaging:', error);
    throw new Error(`Fatal error in family data processing: ${error}`);
  }
}

// Helper functions to process each data type
function processIndividual(i: any, r: RawFamily, ctx: any) {
  try {
    const individual = {
      id: i.__id,
      household_id: r.__id,
      ward_no: r.id.ward_no,
      name: i.name,
      gender: decodeSingleChoice(i.gender, familyChoices.genders),
      age: i.age,
      has_chronic_disease: null as string | null,
      primary_chronic_disease: null as string | null,
      is_sanitized: null as string | null,
      is_disabled: null as string | null,
      disability_type: null as string | null,
      disability_cause: null as string | null,
      gave_live_birth: null as string | null,
      has_training: null as string | null,
      primary_skill: null as string | null,
      alive_sons: null as number | null,
      alive_daughters: null as number | null,
      total_born_children: null as number | null,
      dead_sons: null as number | null,
      dead_daughters: null as number | null,
      recent_alive_sons: null as number | null,
      recent_alive_daughters: null as number | null,
      recent_birth_total: null as number | null,
      recent_birth_location: null as string | null,
      prenatal_checkup: null as string | null,

      citizen_of: decodeSingleChoice(
        i.citizenof,
        familyChoices.local_countries,
      ),
      citizen_of_other: i.citizenof_oth,
      caste: decodeSingleChoice(
        r.id.members.are_a_family == "yes"
          ? r.family_history_info.caste
          : i.individual_history_info.caste_individual,
        familyChoices.castes,
      ),
      caste_other: r.id.members.are_a_family == "yes"
        ? r.family_history_info.caste_oth
        : i.individual_history_info.caste_oth_individual,
      ancestor_language: decodeSingleChoice(
        r.id.members.are_a_family == "yes"
          ? r.family_history_info.ancestrial_lang
          : i.individual_history_info.ancestrial_lang_individual,
        familyChoices.languages,
      ),
      ancestor_language_other: r.id.members.are_a_family == "yes"
        ? r.family_history_info.ancestrial_lang_oth
        : i.individual_history_info.ancestrial_lang_oth_individual,
      primary_mother_tongue: decodeSingleChoice(
        r.id.members.are_a_family == "yes"
          ? r.family_history_info.mother_tounge_primary
          : i.individual_history_info.mother_tounge_primary_individual,
        familyChoices.languages,
      ),
      primary_mother_tongue_other: r.id.members.are_a_family == "yes"
        ? r.family_history_info.mother_tounge_primary_oth
        : i.individual_history_info.mother_tounge_primary_oth_individual,
      religion: decodeSingleChoice(
        r.id.members.are_a_family == "yes"
          ? r.family_history_info.religion
          : i.individual_history_info.religion_individual,
        familyChoices.religions,
      ),
      religion_other:
        i.individual_history_info.religion_other_individual,

      marital_status: null as string | null,
      married_age: null as number | null,
      literacy_status: null as string | null,
      educational_level: null as string | null,
      goes_school: null as string | null,
      work_barrier: null as string | null,
      school_barrier: null as string | null,
      months_worked: null as string | null,
      primary_occupation: null as string | null,
      work_availability: null as string | null,
    };

    // Add marriage details if applicable
    if (i.age >= 10) {
      individual["marital_status"] = decodeSingleChoice(
        i.mrd.marital_status,
        familyChoices.marital_status,
      );
      if (i.mrd.marital_status !== "1") {
        individual.married_age = i.mrd.married_age;
      }
    }

    // Add health details if available
    if (r.health?.length > 0) {
      const healthRecord = r.health.find(
        (j) =>
          i.name === j.health_name && i.age === parseInt(j.health_age),
      );
      if (healthRecord) {
        individual.has_chronic_disease = decodeSingleChoice(
          healthRecord.chronic.has_chronic_disease,
          familyChoices.true_false,
        );
        if (healthRecord.chronic.has_chronic_disease === "yes") {
          individual.primary_chronic_disease = decodeSingleChoice(
            healthRecord.chronic.primary_chronic_disease,
            familyChoices.chronic_diseases,
          );
        }
        individual.is_sanitized = decodeSingleChoice(
          r.id.members.is_sanitized,
          familyChoices.true_false,
        );
        individual.is_disabled = decodeSingleChoice(
          healthRecord.is_disabled,
          familyChoices.true_false,
        );
        if (healthRecord.is_disabled === "yes") {
          individual.disability_type = decodeSingleChoice(
            healthRecord.disability.dsbltp,
            familyChoices.disability_types,
          );
          individual.disability_cause = decodeSingleChoice(
            healthRecord.disability.disability_cause,
            familyChoices.disability_causes,
          );
        }
      }
    }

    // Add fertility details if applicable
    if (r.fertility?.length > 0) {
      const fertilityRecord = r.fertility.find(
        (j) =>
          i.name === j.fertility_name &&
          i.age === parseInt(j.fertility_age),
      );
      if (fertilityRecord?.ftd) {
        individual.gave_live_birth = decodeSingleChoice(
          fertilityRecord.ftd.gave_live_birth,
          familyChoices.true_false,
        );
        if (fertilityRecord.ftd.gave_live_birth === "yes") {
          individual.alive_sons = fertilityRecord.ftd.alive_sons;
          individual.alive_daughters =
            fertilityRecord.ftd.alive_daughters;
          individual.total_born_children =
            fertilityRecord.ftd.total_born_children;
        }
        // Add deceased children details if available
        if (fertilityRecord.ftd.has_dead_children === "yes") {
          individual.dead_sons = fertilityRecord.ftd.dead_sons;
          individual.dead_daughters =
            fertilityRecord.ftd.dead_daughters;
        }

        // Add recent birth details if available
        if (
          fertilityRecord.ftd.frcb?.gave_recent_live_birth === "yes"
        ) {
          individual.recent_alive_sons =
            fertilityRecord.ftd.frcb.recent_alive_sons;
          individual.recent_alive_daughters =
            fertilityRecord.ftd.frcb.recent_alive_daughters;
          individual.recent_birth_total =
            fertilityRecord.ftd.frcb.total_recent_children;
          individual.recent_birth_location = decodeSingleChoice(
            fertilityRecord.ftd.frcb.recent_delivery_location,
            familyChoices.delivery_locations,
          );
          individual.prenatal_checkup = decodeSingleChoice(
            fertilityRecord.ftd.frcb.prenatal_checkup,
            familyChoices.true_false,
          );
        }
      }
    }

    // Add education details if applicable
    if (r.education?.length > 0) {
      const educationRecord = r.education.find(
        (j) => j.edu_name === i.name && parseInt(j.edu_age) === i.age,
      );
      if (educationRecord) {
        individual.literacy_status = decodeSingleChoice(
          educationRecord.edd.is_literate,
          familyChoices.literacy_status,
        );
        individual.educational_level = decodeSingleChoice(
          educationRecord.edd.edu_level,
          familyChoices.educational_level,
        );
        individual.goes_school = decodeSingleChoice(
          educationRecord.goes_school,
          familyChoices.true_false,
        );
        // Add education training details
        if (educationRecord.edt) {
          individual.has_training = decodeSingleChoice(
            educationRecord.edt.has_training,
            familyChoices.true_false,
          );
          if (educationRecord.edt.has_training === "yes") {
            individual.primary_skill = decodeSingleChoice(
              educationRecord.edt.primary_skill,
              familyChoices.skills,
            );
          }
        }

        // Add school barrier if applicable
        if (educationRecord.goes_school === "no") {
          individual.school_barrier = decodeSingleChoice(
            educationRecord.school_barrier,
            familyChoices.school_barriers,
          );
        }

        // Add economy details if present
        const economyRecord = r.economy?.find(
          (j) => j.eco_name === i.name && parseInt(j.eco_age) === i.age,
        );
        if (economyRecord) {
          individual.months_worked = decodeSingleChoice(
            economyRecord.ed.m_work,
            familyChoices.financial_work_duration,
          );
          individual.primary_occupation = decodeSingleChoice(
            economyRecord.ed.primary_occu,
            familyChoices.occupations,
          );
          individual.work_barrier = decodeSingleChoice(
            economyRecord.ed.EA02.work_barrier,
            familyChoices.work_barriers,
          );
          individual.work_availability = decodeSingleChoice(
            economyRecord.ed.EA02.work_availability,
            familyChoices.work_availability,
          );
        }
      }
    }

    return individual;
  } catch (error) {
    throw new Error(`Error processing individual data: ${error}`);
  }
}

function processAgriculturalLand(land: any, r: RawFamily) {
  try {
    return {
      id: land.__id,
      household_id: r.__id,
      ward_no: r.id.ward_no,
      land_ownership_type: land.agland_oship,
      land_area:
        (land.land_area?.B02_3 ?? 0) * 6772.63 +
        (land.land_area?.B02_5 ?? 0) * 338.63 +
        (land.land_area?.B02_7 ?? 0) * 16.93,
      irrigatino_source: decodeSingleChoice(
        land.irrigation_src,
        familyChoices.irrigation_source,
      ),
      irrigated_land_area:
        land.irrigation_src === "no_irrigation"
          ? null
          : land.irrigation?.irrigated_area,
    };
  } catch (error) {
    throw new Error(`Error processing agricultural land data: ${error}`);
  }
}


function processAnimal(animalItem: any, r: RawFamily) {
  try {
    const animal = {
      id: animalItem.__id,
      household_id: r.__id,
      ward_no: r.id.ward_no,
      animal_name: animalItem.animal,
      animal_name_other: null as string | null,
      total_animals: null as number | null,
      animal_sales: null as number | null,
      animal_revenue: null as number | null,
    };

    if (
      (animalItem.animal && animalItem.animal == "अन्य पशु") ||
      animalItem.animal == "अन्य पन्छी"
    ) {
      if (animalItem.anim.animal_oth) {
        animal.animal_name_other = animalItem.anim.animal_oth;
      }
      if (animalItem.anim.oth_total_animals) {
        animal.total_animals = animalItem.anim.oth_total_animals;
      }
      if (animalItem.anim.oth_animal_sales) {
        animal.animal_sales = animalItem.anim.oth_animal_sales;
      }
      if (animalItem.anim.oth_animal_revenue) {
        animal.animal_revenue = animalItem.anim.oth_animal_revenue;
      }
    }

    if (
      animalItem.animal &&
      animalItem.animal != "अन्य पशु" &&
      animalItem.animal != "अन्य पन्छी"
    ) {
      if (animalItem.animn.total_animals) {
        animal.total_animals = animalItem.animn.total_animals;
      }
    }

    return animal;
  } catch (error) {
    throw new Error(`Error processing animal data: ${error}`);
  }
}

function processAnimalProduct(productItem: any, r: RawFamily) {
  try {
    return {
      id: productItem.__id,
      household_id: r.__id,
      ward_no: r.id.ward_no,
      product_name: productItem.aprod,
      product_name_other: productItem.apo.aprod_oth,
      unit: productItem.apon.aprod_unit,
      unit_other: productItem.apon.aprod_unit_oth,
      production: productItem.apon.aprod_prod,
    };
  } catch (error) {
    throw new Error(`Error processing animal product data: ${error}`);
  }
}

function processDeath(deathItem: any, r: RawFamily) {
  try {
    return {
      id: deathItem.__id,
      household_id: r.__id,
      ward_no: r.id.ward_no,
      deceased_name: deathItem.death_name,
      deceased_gender: decodeSingleChoice(
        deathItem.death_gender,
        familyChoices.genders,
      ),
      deceased_age: deathItem.death_age,
      deceased_death_cause: decodeSingleChoice(
        deathItem.death_cause,
        familyChoices.death_causes,
      ),
      deceased_fertility_death_condition: decodeSingleChoice(
        deathItem.fertile_death_condition,
        familyChoices.fertile_death_conditions,
      ),
    };
  } catch (error) {
    throw new Error(`Error processing death record data: ${error}`);
  }
}
