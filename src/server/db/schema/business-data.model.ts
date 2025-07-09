/**
 * Comprehensive business data model that combines fields from sample data and types
 */
export interface BusinessData {
  // Basic business information
  id: string;
  business_survey_date: string | null;
  business_submission_date: string | null;
  business_name: string;
  business_nature: string;
  business_nature_other?: string | null;
  business_type?: string | null;
  business_type_other?: string | null;

  // Temporary Measures
  temporary_area_code?: string | null;
  temporary_ward_number?: string | null;
  temporary_building_token?: string | null;

  // Location information
  business_gps_latitude: number | null;
  business_gps_longitude: number | null;
  business_gps_altitude: number | null;
  business_gps_accuracy: number | null;
  business_locality: string;
  ward_number: number;
  area_code: string;
  business_number?: number;

  // Operator information
  operator_name: string;
  operator_phone: string;
  operator_age?: number;
  operator_gender?: string;
  operator_education_level?: string;

  // Legal information
  registration_status?: string;
  registered_bodies?: string[];
  registered_bodies_other?: string | null;
  statutory_status?: string;
  statutory_status_other?: string | null;
  pan_status?: string;
  pan_number?: number;
  ownership_status?: string | null;
  ownership_status_other?: string | null;

  // Financial information
  investment_amount?: number;
  business_location_ownership?: string;
  business_location_ownership_other?: string | null;

  // Hotel specific information (if applicable)
  hotel_accommodation_type?: string | null;
  hotel_room_count?: number | null;
  hotel_bed_count?: number | null;
  hotel_room_type?: string | null;
  hotel_has_hall?: string | null;
  hotel_hall_capacity?: number | null;

  // Agricultural business specific information (if applicable)
  agricultural_type?: string;

  // Crops information (summarized)
  crops_summary?: {
    food_crops_count?: number;
    pulse_crops_count?: number;
    oil_seed_crops_count?: number;
    vegetable_crops_count?: number;
    fruit_crops_count?: number;
    spice_crops_count?: number;
    cash_crops_count?: number;
  };

  // Livestock information (summarized)
  livestock_summary?: {
    animals_count?: number;
    animal_products_count?: number;
  };

  // Aquaculture information (if applicable)
  aquaculture?: {
    pond_count?: number | null;
    pond_area?: number | null;
    fish_production?: number | null;
    fingerling_number?: number | null;
    total_investment?: number | null;
    annual_income?: number | null;
    employment_count?: number | null;
  };

  // Apiculture information (if applicable)
  apiculture?: {
    hive_count?: number | null;
    honey_production?: number | null;
  };

  // Employee information
  has_partners?: string;
  total_partners?: number | null;
  nepali_male_partners?: number | null;
  nepali_female_partners?: number | null;
  has_foreign_partners?: string | null;
  foreign_male_partners?: number | null;
  foreign_female_partners?: number | null;

  has_involved_family?: string;
  total_involved_family?: number | null;
  male_involved_family?: number | null;
  female_involved_family?: number | null;

  has_permanent_employees?: string;
  total_permanent_employees?: number | null;
  nepali_male_permanent_employees?: number | null;
  nepali_female_permanent_employees?: number | null;
  has_foreign_permanent_employees?: string | null;
  foreign_male_permanent_employees?: number | null;
  foreign_female_permanent_employees?: number | null;

  has_temporary_employees?: string;
  total_temporary_employees?: number | null;
  nepali_male_temporary_employees?: number | null;
  nepali_female_temporary_employees?: number | null;
  has_foreign_temporary_employees?: string | null;
  foreign_male_temporary_employees?: number | null;
  foreign_female_temporary_employees?: number | null;

  // Media attachment keys
  business_image_key?: string;
  business_enumerator_selfie_key?: string;
  business_audio_recording_key?: string;

  // Embedded arrays for related data - these replace the separate interfaces
  crops?: BusinessCropData[];
  animals?: BusinessAnimalData[];
  animal_products?: BusinessAnimalProductData[];

  // Metadata
  created_at?: string;
  updated_at?: string;
}

/**
 * Crop data embedded within BusinessData
 */
interface BusinessCropData {
  id: string;
  business_id: string;
  crop_type: string;
  crop_name: string;
  ward_number: number;
  crop_area: number;
  crop_production: string | number;
  crop_sales?: string | number;
  crop_count?: number | null;
}

/**
 * Animal data embedded within BusinessData
 */
interface BusinessAnimalData {
  id: string;
  business_id: string;
  animal_name: string;
  ward_number: number;
  animal_type?: string;
  total_count: number;
  sales_count?: number;
  revenue?: number;
}

/**
 * Animal product data embedded within BusinessData
 */
interface BusinessAnimalProductData {
  id: string;
  business_id: string;
  product_name: string;
  ward_number: number;
  unit: string;
  production_amount: number;
  sales_amount?: number;
  monthly_production?: number;
  revenue?: number;
}
