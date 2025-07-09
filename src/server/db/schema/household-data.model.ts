/**
 * Comprehensive household data model that combines fields from sample data and types
 */
export interface HouseholdData {
  // Identification and basic information
  id: string;
  household_survey_date: string | null;
  household_submission_date: string | null;
  household_token: string;

  // Temporary Measures
  temporary_area_code?: string | null;
  temporary_ward_number?: string | null;
  temporary_building_token?: string | null;

  // Location information
  household_gps_latitude: number | null;
  household_gps_longitude: number | null;
  household_gps_altitude: number | null;
  household_gps_accuracy: number | null;
  ward_number: number | null;
  area_code: string;
  household_locality: string;
  household_development_organization: string;

  // Family head information
  head_name: string;
  head_phone: string;

  // Household details
  total_members: number;
  is_sanitized: boolean;

  // House ownership and safety
  house_ownership: string;
  house_ownership_other?: string | null;
  feels_safe: boolean;

  // Water and sanitation
  water_source: string[];
  water_source_other?: string | null;
  water_purification_methods: string[];
  toilet_type: string;
  solid_waste_management: string;
  solid_waste_management_other?: string | null;

  // Energy and facilities
  primary_cooking_fuel: string[];
  primary_energy_source: string[];
  primary_energy_source_other?: string | null;
  facilities: string[];

  // Economic details
  female_properties: string;
  loaned_organizations: string[];
  loan_use: string[];
  financial_organizations: string[];
  has_insurance: string[];
  health_organization: string;
  health_organization_other?: string | null;
  income_sources: string[];

  // Remittance
  has_remittance: boolean;
  remittance_expenses: string[];

  // Municipal suggestions
  municipal_suggestions: string[];
  municipal_suggestions_other?: string | null;

  // Demographic information
  caste: string;
  caste_other?: string | null;
  ancestral_language: string;
  ancestral_language_other?: string | null;
  primary_mother_tongue: string;
  primary_mother_tongue_other?: string | null;
  religion: string;
  religion_other?: string | null;

  // Agriculture information
  has_agricultural_land: boolean;
  agricultural_land_ownership_types: string[];
  is_farmer: boolean;
  total_male_farmers: number;
  total_female_farmers: number;
  months_sustained_from_agriculture: string;
  months_involved_in_agriculture: string;
  agricultural_machinery: string[];

  // Animal husbandry
  has_animal_husbandry: boolean;
  animal_types: string[];

  // Aquaculture and apiculture
  has_aquaculture: boolean;
  pond_count: number | null;
  pond_area: number | null;
  fish_production: number | null;

  has_apiculture: boolean;
  hive_count: number | null;
  honey_production: number | null;

  // Birth place and prior location
  birth_place: string;
  birth_province?: string | null;
  birth_district?: string | null;
  birth_country?: string | null;
  prior_location?: string | null;
  prior_province?: string | null;
  prior_district?: string | null;
  prior_country?: string | null;
  residence_reasons: string[];
  residence_reasons_other?: string | null;

  // Media attachment keys
  household_image_key?: string;
  household_enumerator_selfie_key?: string;
  household_audio_recording_key?: string;

  // Embedded data arrays
  household_members?: HouseholdMemberData[];
  agricultural_lands?: AgriculturalLandData[];
  crops?: CropData[];
  animals?: AnimalData[];
  animal_products?: AnimalProductData[];
  deaths?: DeathData[];
  absentees?: AbsenteeData[];

  // Metadata
  created_at?: string;
  updated_at?: string;
}

/**
 * Household member data embedded within HouseholdData
 */
interface HouseholdMemberData {
  id: string;
  household_id: string;
  name: string;
  gender: string;
  age: number;

  // Citizenship and demographics
  citizen_of: string;
  citizen_of_other?: string | null;
  caste: string;
  caste_other?: string | null;
  ancestral_language: string;
  ancestral_language_other?: string | null;
  primary_mother_tongue: string;
  primary_mother_tongue_other?: string | null;
  religion: string;
  religion_other?: string | null;

  // Marriage
  marital_status?: string;
  married_age?: number | null;

  // Health
  has_chronic_disease?: string | null;
  primary_chronic_disease?: string | null;
  is_sanitized?: string | null;
  is_disabled?: string | null;
  disability_type?: string | null;
  disability_cause?: string | null;

  // Fertility
  gave_live_birth?: string | null;
  alive_sons?: number | null;
  alive_daughters?: number | null;
  total_born_children?: number | null;
  dead_sons?: number | null;
  dead_daughters?: number | null;
  recent_alive_sons?: number | null;
  recent_alive_daughters?: number | null;
  recent_birth_total?: number | null;
  recent_birth_location?: string | null;
  prenatal_checkup?: string | null;

  // Education
  literacy_status?: string | null;
  educational_level?: string | null;
  goes_school?: string | null;
  school_barrier?: string | null;
  has_training?: string | null;
  primary_skill?: string | null;

  // Economy
  months_worked?: string | null;
  primary_occupation?: string | null;
  work_barrier?: string | null;
  work_availability?: string | null;

  // Absentee
  // Absentee
  is_absent?: boolean;
  absence_education_level?: string;
  absence_reason?: string;
  absence_location?: string;
  absence_province?: string | null;
  absence_district?: string | null;
  absence_country?: string | null;
  sends_remittance?: boolean;
  remittance_amount?: number | null;
}

/**
 * Agricultural land data embedded within HouseholdData
 */
interface AgriculturalLandData {
  id: string;
  household_id: string;
  ward_number: number;
  land_ownership_type: string;
  land_area: number;
  irrigation_source: string;
  irrigation_time?: string;
  irrigated_land_area?: number | null;
}

/**
 * Crop data embedded within HouseholdData
 */
interface CropData {
  id: string;
  household_id: string;
  ward_number: number;
  crop_type: string;
  crop_name: string;
  area: number;
  production: string | number;
  tree_count?: number | null;
}

/**
 * Animal data embedded within HouseholdData
 */
interface AnimalData {
  id: string;
  household_id: string;
  ward_number: number;
  animal_name: string;
  animal_name_other?: string | null;
  total_animals: number | null;
  animal_sales?: number | null;
  animal_revenue?: number | null;
}

/**
 * Animal product data embedded within HouseholdData
 */
interface AnimalProductData {
  id: string;
  household_id: string;
  ward_number: number;
  product_name: string;
  product_name_other?: string | null;
  unit: string;
  unit_other?: string | null;
  production: number;
}

/**
 * Death record data embedded within HouseholdData
 */
interface DeathData {
  id: string;
  household_id: string;
  ward_number: number;
  deceased_name: string;
  deceased_gender: string;
  deceased_age: number;
  deceased_death_cause: string;
  deceased_fertility_death_condition?: string | null;
}

/**
 * Absentee data embedded within HouseholdData
 */
interface AbsenteeData {
  id: string;
  household_id: string;
  ward_number: number;
  absentee_name: string;
  gender: string;
  age: number;
  absence_education_level: string;
  absence_reason: string;
  location: string;
  province?: string | null;
  district?: string | null;
  country?: string | null;
  sends_remittance: boolean;
  remittance_amount?: number | null;
}
