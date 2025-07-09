import { RawFamily } from "./types";
import { jsonToPostgres } from "@/lib/utils";
import { sql } from "drizzle-orm";
import { decodeSingleChoice } from "@/lib/resources/utils";
import { familyChoices } from "@/lib/resources/family";

export async function parseIndividuals(r: RawFamily, ctx: any) {
  const areaAFamily = r.id.members.are_a_family == "yes";

  if (r.individual && r.individual.length > 0) {
    for (const i of r.individual) {
      // Initialize base individual object with primary keys and basic info
      const individual = {
        id: i.__id,
        family_id: r.__id,
        ward_no: r.id.ward_no,

        // Personal Information
        name: i.name,
        gender: decodeSingleChoice(i.gender, familyChoices.genders),
        age: i.age,

        // Initialize Health Information fields
        has_chronic_disease: null as string | null,
        primary_chronic_disease: null as string | null,
        is_sanitized: null as string | null,

        // Initialize Disability Information fields
        is_disabled: null as string | null,
        disability_type: null as string | null,
        disability_cause: null as string | null,

        // Initialize Fertility and Birth Information fields
        gave_live_birth: null as string | null,
        alive_sons: null as number | null,
        alive_daughters: null as number | null,
        total_born_children: null as number | null,
        dead_sons: null as number | null,
        dead_daughters: null as number | null,

        // Initialize Recent Birth Details fields
        recent_born_sons: null as number | null,
        recent_born_daughters: null as number | null,
        total_recent_children: null as number | null,
        recent_delivery_location: null as string | null,
        prenatal_checkups: null as string | null,

        // Cultural and Demographic Information
        citizen_of: decodeSingleChoice(
          i.citizenof,
          familyChoices.local_countries,
        ),
        citizen_of_other: i.citizenof_oth,
        caste: decodeSingleChoice(
          areaAFamily
            ? r.family_history_info.caste
            : i.individual_history_info.caste_individual,
          familyChoices.castes,
        ),
        caste_other: areaAFamily
          ? r.family_history_info.caste_oth
          : i.individual_history_info.caste_oth_individual,
        ancestor_language: decodeSingleChoice(
          areaAFamily
            ? r.family_history_info.ancestrial_lang
            : i.individual_history_info.ancestrial_lang_individual,
          familyChoices.languages,
        ),
        ancestor_language_other: areaAFamily
          ? r.family_history_info.ancestrial_lang_oth
          : i.individual_history_info.ancestrial_lang_oth_individual,
        primary_mother_tongue: decodeSingleChoice(
          areaAFamily
            ? r.family_history_info.mother_tounge_primary
            : i.individual_history_info.mother_tounge_primary_individual,
          familyChoices.languages,
        ),
        primary_mother_tongue_other: areaAFamily
          ? r.family_history_info.mother_tounge_primary_oth
          : i.individual_history_info.mother_tounge_primary_oth_individual,
        religion: decodeSingleChoice(
          areaAFamily
            ? r.family_history_info.religion
            : i.individual_history_info.religion_individual,
          familyChoices.religions,
        ),
        religion_other: i.individual_history_info.religion_other_individual,

        // Initialize Education and Work fields
        has_training: null as string | null,
        primary_skill: null as string | null,
        marital_status: null as string | null,
        married_age: null as number | null,
        literacy_status: null as string | null,
        educational_level: null as string | null,
        goes_school: null as string | null,
        work_barrier: null as string | null,
        school_barrier: null as string | null,
        financial_work_duration: null as string | null,
        primary_occupation: null as string | null,
        work_availability: null as string | null,
      };

      // Process Marital Status
      if (i.age >= 10) {
        individual["marital_status"] = decodeSingleChoice(
          i.mrd.marital_status,
          familyChoices.marital_status,
        );
        if (i.mrd.marital_status !== "1") {
          individual.married_age = i.mrd.married_age;
        }
      }

      // Process Health and Disability Information
      if (r.health?.length > 0) {
        const healthRecord = r.health.find(
          (j) => i.name === j.health_name && i.age === parseInt(j.health_age),
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

      // Process Fertility and Birth Information
      if (r.fertility?.length > 0) {
        const fertilityRecord = r.fertility.find(
          (j) =>
            i.name === j.fertility_name && i.age === parseInt(j.fertility_age),
        );
        if (fertilityRecord?.ftd) {
          individual.gave_live_birth = decodeSingleChoice(
            fertilityRecord.ftd.gave_live_birth,
            familyChoices.true_false,
          );
          if (fertilityRecord.ftd.gave_live_birth === "yes") {
            individual.alive_sons = fertilityRecord.ftd.alive_sons;
            individual.alive_daughters = fertilityRecord.ftd.alive_daughters;
            individual.total_born_children =
              fertilityRecord.ftd.total_born_children;
          }
          // Add deceased children details if available
          if (fertilityRecord.ftd.has_dead_children === "yes") {
            individual.dead_sons = fertilityRecord.ftd.dead_sons;
            individual.dead_daughters = fertilityRecord.ftd.dead_daughters;
          }

          // Add recent birth details if available
          if (fertilityRecord.ftd.frcb?.gave_recent_live_birth === "yes") {
            individual.recent_born_sons =
              fertilityRecord.ftd.frcb.recent_alive_sons;
            individual.recent_born_daughters =
              fertilityRecord.ftd.frcb.recent_alive_daughters;
            individual.total_recent_children =
              fertilityRecord.ftd.frcb.total_recent_children;
            individual.recent_delivery_location = decodeSingleChoice(
              fertilityRecord.ftd.frcb.recent_delivery_location,
              familyChoices.delivery_locations,
            );
            individual.prenatal_checkups = decodeSingleChoice(
              fertilityRecord.ftd.frcb.prenatal_checkup,
              familyChoices.true_false,
            );
          }
        }
      }

      // Process Education, Training and Skills Information
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

          // Process Occupation and Work Information
          const economyRecord = r.economy?.find(
            (j) => j.eco_name === i.name && parseInt(j.eco_age) === i.age,
          );
          if (economyRecord) {
            individual.financial_work_duration = decodeSingleChoice(
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

      // Database Operations
      try {
        const individualStatement = jsonToPostgres(
          "staging_Kerabari_individual",
          individual,
        );
        if (individualStatement) {
          await ctx.db.execute(sql.raw(individualStatement));
        }
      } catch (error) {
        console.error(`Error inserting individual ${i.name}:`, error);
      }
    }
  }
}
