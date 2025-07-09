interface EnumeratorIntroduction {
  enumerator_name: string;
  enumerator_phone: string;
  enumerator_id: string;
  building_token: string;
}

interface Location {
  type: "Point";
  coordinates: [number, number, number];
  properties: {
    accuracy: number;
  };
}

interface FamilyIdentification {
  ward_no: number;
  area_code: string;
  house_token_number: string;
  fam_symno: string;
  ask_owner_only: string;
  doi: string;
  tmp_location: Location;
  location: string;
  locality: string;
  dev_org: string;
  head_name: string;
  head_ph: string;
  members: {
    are_a_family: string;
    total_mem: number;
    is_sanitized: string;
  };
  ewheres: {
    are_ewhere: string;
  };
}

interface HouseholdInfo {
  h_oship: string;
  h_oship_oth?: string | null;
  tmp_is_safe: string;
  is_safe: string;
  wsrc: string;
  water_src_oth?: string | null;
  water_puri: string;
  toilet_type: string;
  solid_waste: string;
  solid_waste_oth?: string | null;
  primary_cf: string;
  primary_es: string;
  primary_es_oth?: string | null;
  facilitites: string;
  fem_prop: string;
  loaned_organization: string;
  loan_use: string;
  has_bacc: string;
  has_insurance: string;
  health_org: string;
  heatlth_org_oth?: string | null;
  income_sources: string;
  municipal_suggestions: string;
  municipal_suggestions_oth?: string | null;
}

interface FamilyHistoryInfo {
  NID?: string | null;
  caste: string;
  caste_oth?: string | null;
  ancestrial_lang: string;
  ancestrial_lang_oth?: string | null;
  mother_tounge_primary: string;
  mother_tounge_primary_oth?: string | null;
  religion: string;
  religion_other?: string | null;
}

interface DeathDetails {
  death_enumerator: string;
  death_house_head_name: string;
  death_ward_no: string;
  death_name: string;
  death_gender: string;
  death_age: number;
  death_cause: string;
  fertile_death_condition?: string | null;
  __id: string;
}

interface DeathInfo {
  has_recent_death: string;
  dno: {
    death_no: number;
    death_details: DeathDetails[];
  };
}

interface BirthPlaceInfo {
  birth_place: string;
  birth_province?: string | null;
  birth_district?: string | null;
  birth_country?: string | null;
}

interface PriorLocationInfo {
  prior_location?: string | null;
  prior_province?: string | null;
  prior_district?: string | null;
  prior_country?: string | null;
  residence_reasons: string;
  residence_reasons_other?: string | null;
}

interface GrassAreaDescription {
  grasses_note?: string | null;
  grass_bigha: number;
  grass_kattha: number;
  grass_dhur: number;
  grass_area: string;
  grass_area_note?: string | null;
}

interface CropAreaDescription {
  frop_note?: string | null;
  fcrop_bigha: number;
  fcrop_kattha: number;
  fcrop_dhur: number;
  fcrop_area: string;
  fcrop_area_note?: string | null;
}

interface CropProduction {
  frop_note_prod?: string | null;
  BA01_11: number;
  BA01_12: number;
  BA01_13: number;
  BA01_14: number;
  fcrop_prod: string;
}

interface FoodCropDetails {
  dfc: string;
  fcrop_ward_no: string;
  fcrop: string;
  fcrop_enumerator: string;
  fcrop_house_head_name: string;
  fcrop_area_description: CropAreaDescription;
  fp: CropProduction;
  __id: string;
}

interface PulseAreaDescription {
  pulse_note?: string | null;
  pulse_bigha: number;
  pulse_kattha: number;
  pulse_dhur: number;
  pulse_area: string;
  pulse_area_note?: string | null;
}

interface PulseProduction {
  pulses_note_prod?: string | null;
  BA02_11: number;
  BA02_12: number;
  BA02_13: number;
  BA02_14: number;
  pulse_prod: string;
}

interface PulseDetails {
  dpl: string;
  pulse_ward_no: string;
  pulse: string;
  pulse_enumerator: string;
  pulse_house_head_name: string;
  pulse_area_description: PulseAreaDescription;
  pp: PulseProduction;
  __id: string;
}

interface OilSeedAreaDescription {
  oseed_note?: string | null;
  oseed_bigha: number;
  oseed_kattha: number;
  oseed_dhur: number;
  oseed_area: string;
  oseed_area_note?: string | null;
}

interface OilSeedProduction {
  oseed_note_prod?: string | null;
  BA03_11: number;
  BA03_12: number;
  BA03_13: number;
  BA03_14: number;
  oseed_prod: string;
}

interface OilSeedDetails {
  dos: string;
  oseed_ward_no: string;
  oseed: string;
  oseed_enumerator: string;
  oseed_house_head_name: string;
  oseed_area_description: OilSeedAreaDescription;
  oslp: OilSeedProduction;
  __id: string;
}

interface VegetableAreaDescription {
  vtables_note?: string | null;
  vtables_bigha: number;
  vtables_kattha: number;
  vtables_dhur: number;
  vtables_area: string;
  vtables_area_note?: string | null;
}

interface VegetableProduction {
  vtables_note_prod?: string | null;
  BA04_11: number;
  BA04_12: number;
  BA04_13: number;
  BA04_14: number;
  vtable_prod: string;
}

interface VegetableDetails {
  dvt: string;
  vtable_ward_no: string;
  vtable: string;
  vtable_enumerator: string;
  vtable_house_head_name: string;
  vtables_area_description: VegetableAreaDescription;
  vp: VegetableProduction;
  __id: string;
}

interface FruitAreaDescription {
  fruits_note?: string | null;
  fruits_bigha: number;
  fruits_kattha: number;
  fruits_dhur: number;
  fruits_area: string;
  fruits_area_note?: string | null;
}

interface FruitProduction {
  fruits_note_prod?: string | null;
  BA05_11: number;
  BA05_12: number;
  BA05_13: number;
  BA05_14: number;
  fruit_prod: string;
}

interface FruitDetails {
  dfr: string;
  fruit_ward_no: string;
  fruit: string;
  fruit_enumerator: string;
  fruit_house_head_name: string;
  fruits_trees_count: number;
  fruits_area_description: FruitAreaDescription;
  frp: FruitProduction;
  __id: string;
}

interface SpiceAreaDescription {
  spice_note?: string | null;
  spice_bigha: number;
  spice_kattha: number;
  spice_dhur: number;
  spice_area: string;
  spice_area_note?: string | null;
}

interface SpiceProduction {
  spice_note_prod?: string | null;
  BA06_11: number;
  BA06_12: number;
  BA06_13: number;
  BA06_14: number;
  spice_prod: string;
}

interface SpiceDetails {
  dsp: string;
  spice_ward_no: string;
  spice: string;
  spice_enumerator: string;
  spice_house_head_name: string;
  spice_area_description: SpiceAreaDescription;
  sp: SpiceProduction;
  __id: string;
}

interface CashCropAreaDescription {
  cash_note?: string | null;
  ccrop_bigha: number;
  ccrop_kattha: number;
  ccrop_dhur: number;
  ccrop_area: string;
  ccrop_area_note?: string | null;
}

interface CashCropProduction {
  cash_note_prod?: string | null;
  BA07_11: number;
  BA07_12: number;
  BA07_13: number;
  BA07_14: number;
  ccrop_prod: string;
}

interface CashCropDetails {
  dcc: string;
  ccrop_ward_no: string;
  ccrop: string;
  ccrop_enumerator: string;
  ccrop_house_head_name: string;
  isBetel: string;
  betel_tree_count: number;
  ccrop_area_description: CashCropAreaDescription;
  cp: CashCropProduction;
  __id: string;
}

interface AgricultureLandArea {
  B02_3: number;
  B02_5: number;
  B02_7: number;
  agland_area: string;
  B02_10: string | null;
}

interface AgricultureIrrigation {
  B02_13: number;
  B02_15: number;
  B02_17: number;
  irrigated_area: string;
  B02_20: string | null;
}

interface AgriculturalLand {
  agland_ward_no: string;
  agland_oship: string;
  agland_enumerator: string;
  agland_house_head_name: string;
  land_area: AgricultureLandArea;
  irrigation_src: string;
  irrigation_time: string;
  irrigation: AgricultureIrrigation;
  __id: string;
}

interface AnimalDetails {
  danim: string;
  animal_ward_no: string;
  animal: string;
  animal_enumerator: string;
  animal_house_head_name: string;
  anim: {
    animal_oth: string | null;
    oth_total_animals: number | null;
    oth_animal_sales: number | null;
    oth_animal_revenue: number | null;
  };
  animn: {
    total_animals: number;
  };
  __id: string;
}

interface AnimalProduct {
  daprod: string;
  aprod_ward_no: string;
  aprod: string;
  aprod_enumerator: string;
  aprod_house_head_name: string;
  apo: {
    aprod_oth: string | null;
    oth_aprod_unit: string | null;
    oth_aprod_unit_oth: string | null;
    oth_aprod_prod: number | null;
  };
  apon: {
    aprod_unit: string;
    aprod_unit_oth: string | null;
    aprod_prod: number;
  };
  __id: string;
}

interface AnimalProductOutput {
  aprod_oth: string | null;
  oth_aprod_unit: string | null;
  oth_aprod_unit_oth: string | null;
  oth_aprod_prod: number | null;
}

interface AnimalProductNumber {
  aprod_unit: string;
  aprod_unit_oth: string | null;
  aprod_prod: number;
}

interface AnimalProductItem {
  daprod: string;
  aprod_ward_no: string;
  aprod: string;
  aprod_enumerator: string;
  aprod_house_head_name: string;
  apo: AnimalProductOutput;
  apon: AnimalProductNumber;
  __id: string;
}

interface AgricultureInfo {
  has_agland: string;
  aglands_oship: string;
  agricultural_land_count: string;
  is_farmer: string;
  total_male_farmer: number;
  total_female_farmer: number;
  food: {
    fcrops: string;
    fcrop_details: FoodCropDetails[];
    pulses: string;
    pulse_details: PulseDetails[];
    oseeds: string;
    oseed_details: OilSeedDetails[];
    vtables: string;
    vtable_details: VegetableDetails[];
    fruits: string;
    fruit_details: FruitDetails[];
    grasses: string;
    dsp: string;
    grasses_ward_no: string;
    grasses_calc: string;
    grasses_enumerator: string;
    grass_area_description: GrassAreaDescription;
    spices: string;
    spice_details: SpiceDetails[];
    ccrops: string;
    ccrop_details: CashCropDetails[];
  };
  months_sustained_from_agriculture: string;
  has_husbandry: string;
  animals: string;
  animal_details: AnimalDetails[];
  aprods: string;
  aprod_details: AnimalProductItem[];
  has_aquacultured: string;
  has_apicultured: string;
  months_involved_in_agriculture: string;
  agri_machines: string;
  agricultural_land: AgriculturalLand[];
}

interface IndividualInfo {
  ind_ward_no: string;
  dind: string;
  ind_enumerator: string;
  ind_house_head_name: string;
  name: string;
  gender: string;
  age: number;
  citizenof: string;
  citizenof_oth?: string | null;
  individual_history_info: {
    caste_individual?: string | null;
    caste_oth_individual?: string | null;
    ancestrial_lang_individual?: string | null;
    ancestrial_lang_oth_individual?: string | null;
    mother_tounge_primary_individual?: string | null;
    mother_tounge_primary_oth_individual?: string | null;
    religion_individual?: string | null;
    religion_other_individual?: string | null;
  };
  mrd: {
    marital_status: string;
    married_age: number;
  };
  __id: string;
}

interface SystemInfo {
  submissionDate: string;
  updatedAt?: string | null;
  submitterId: string;
  submitterName: string;
  attachmentsPresent: number;
  attachmentsExpected: number;
  status?: string | null;
  reviewState?: string | null;
  deviceId: string;
  edits: number;
  formVersion: string;
}

interface HealthDetails {
  dhlth: string;
  health_ward_no: string;
  health_name: string;
  health_age: string;
  health_enumerator: string;
  health_house_head_name: string;
  chronic: {
    has_chronic_disease: string;
    primary_chronic_disease: string;
    other_chronic_disease: string | null;
  };
  is_disabled: string;
  disability: {
    dsbltp: string;
    other_disability_type: string | null;
    disability_cause: string;
    other_disability_cause: string | null;
  };
  __id: string;
}

interface FertilityDetails {
  fertility_ward_no: string;
  fertility_name: string;
  fertility_age: string;
  fertility_gender: string;
  fertility_marital_status: string;
  fertility_enumerator: string;
  fertility_house_head_name: string;
  ftd: {
    gave_live_birth: string | null;
    alive_sons: number | null;
    alive_daughters: number | null;
    total_born_children: number | null;
    NFTBRTH: string | null;
    has_dead_children: string | null;
    dead_sons: number | null;
    dead_daughters: number | null;
    total_dead_children: number | null;
    NFTDEAD: string | null;
    frcb: {
      gave_recent_live_birth: string | null;
      recent_alive_sons: number | null;
      recent_alive_daughters: number | null;
      total_recent_children: number | null;
      NFTRBRTH: string | null;
      recent_delivery_location: string | null;
      prenatal_checkup: string | null;
    };
    delivery_age: number | null;
  };
  __id: string;
}

interface AbsenteeLocation {
  abs_location: string;
  abs_province?: string | null;
  abs_district?: string | null;
  abs_country?: string | null;
  FOREIGN: string;
}

interface AbsenteeIdentification {
  abs_age: number;
  abs_edulvl: string;
  ABSPRD: string;
  absence_reason: string;
  abl: AbsenteeLocation;
  sent_cash: string;
  cash: number;
}

interface Absentee {
  dabs: string;
  absentees_ward_no: string;
  abs_name: string;
  abs_gender: string;
  abs_prior_edulvl: string;
  abs_prior_age: string;
  abs_enumerator: string;
  abs_house_head_name: string;
  is_absent: string;
  abid: AbsenteeIdentification;
  __id: string;
}

interface EconomyEducationDetails {
  work_barrier: string;
  work_availability: string;
}

interface EconomyDetails {
  m_work: string;
  primary_occu: string;
  EA02: EconomyEducationDetails;
}

interface Economy {
  deco: string;
  economy_ward_no: string;
  eco_age: string;
  eco_name: string;
  eco_enumerator: string;
  eco_house_head_name: string;
  ed: EconomyDetails;
  __id: string;
}

interface EducationDetails {
  is_literate: string;
  edu_level: string;
  primary_sub: string | null;
}

interface EducationTraining {
  has_training: string;
  primary_skill: string;
}

interface Education {
  dedu: string;
  education_ward_no: string;
  edu_age: string;
  edu_name: string;
  edu_enumerator: string;
  edu_house_head_name: string;
  edd: EducationDetails;
  goes_school: string;
  school_barrier: string | null;
  edt: EducationTraining;
  __id: string;
}

export interface RawFamily {
  intro?: string | null;
  audio_monitoring: string;
  enumerator_introduction: EnumeratorIntroduction;
  last_house_token_number?: string | null;
  start_doi: string;
  id: FamilyIdentification;
  A?: string | null;
  hh_count: string;
  hh: HouseholdInfo;
  family_history_info: FamilyHistoryInfo;
  NED?: string | null;
  education_count: string;
  education: Education[];
  NH?: string | null;
  health_count: string;
  health: HealthDetails[];
  NFT?: string | null;
  fertility_count: string;
  fertility: FertilityDetails[];
  NDD?: string | null;
  death: DeathInfo;
  NAR?: string | null;
  absentees_count: string;
  absentees: Absentee[];
  has_remittance: string;
  remittance_expenses: string;
  NMG?: string | null;
  bp: BirthPlaceInfo;
  plocation: PriorLocationInfo;
  NEA?: string | null;
  economy_count: string;
  economy: Economy[];
  B?: string | null;
  agri_count: string;
  agri: AgricultureInfo;
  himg: string;
  himg_selfie: string;
  meta: {
    instanceID: string;
    instanceName: string;
  };
  __id: string;
  __system: SystemInfo;
  individual: IndividualInfo[];
}
