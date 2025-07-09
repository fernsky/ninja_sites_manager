interface FCropLand {
  fbigha: number;
  fkattha: number;
  fdhur: number;
  fcrop_area: string;
  fcnt: null | number;
}

interface FCropProduction {
  BA01_11: number;
  BA01_12: number;
  BA01_13: number;
  BA01_14: number;
  fcrop_prod: string;
}

interface FCropSales {
  BA01_17: number;
  BA01_18: number;
  BA01_19: number;
  BA01_20: number;
  fcrop_sales: string;
}

export interface FCropDetail {
  fcrop_ward_no: string;
  fcrop: string;
  fcrop_land: FCropLand;
  fp: FCropProduction;
  fs: FCropSales;
  __id: string;
}

interface PPulseLand {
  pulse_bigha: number;
  pulse_kattha: number;
  pulse_dhur: number;
  pulse_area: string;
  plnt: null | number;
}

interface PPulseProduction {
  BA02_11: number;
  BA02_12: number;
  BA02_13: number;
  BA02_14: number;
  pulse_prod: string;
}

interface PPulseSales {
  BA02_17: number;
  BA02_18: number;
  BA02_19: number;
  BA02_20: number;
  pulse_sales: string;
}

export interface PPulseDetail {
  pulse_ward_no: string;
  pulse: string;
  pl: PPulseLand;
  pp: PPulseProduction;
  ps: PPulseSales;
  __id: string;
}

interface OSeedLand {
  os_bigha: number;
  os_kattha: number;
  os_dhur: number;
  oseed_area: string;
  osnt: null | number;
}

interface OSeedProduction {
  BA03_10: string;
  BA03_11: number;
  BA03_12: number;
  BA03_13: number;
  BA03_14: number;
  oseed_prod: string;
}

interface OSeedSales {
  BA03_17: number;
  BA03_18: number;
  BA03_19: number;
  BA03_20: number;
  oseed_sales: string;
}

export interface OSeedDetail {
  oseed_ward_no: string;
  oseed: string;
  osl: OSeedLand;
  oslp: OSeedProduction;
  osls: OSeedSales;
  __id: string;
}

interface VTableLand {
  vt_bigha: number;
  vt_kattha: number;
  vt_dhur: number;
  vtable_area: string;
  vtnt: null | number;
}

interface VTableProduction {
  BA04_10: string;
  BA04_11: number;
  BA04_12: number;
  BA04_13: number;
  BA04_14: number;
  vtable_prod: string;
}

interface VTableSales {
  BA04_17: number;
  BA04_18: number;
  BA04_19: number;
  BA04_20: number;
  vtable_sales: string;
}

export interface VTableDetail {
  vtable_ward_no: string;
  vtable: string;
  vl: VTableLand;
  vp: VTableProduction;
  vs: VTableSales;
  __id: string;
}

interface FruitLand {
  fruit_bigha: number;
  fruit_kattha: number;
  fruit_dhur: number;
  fruit_area: string;
  fruit_trees_count: null | number;
  frnt: null | number;
}

interface FruitProduction {
  BA05_11: number;
  BA05_12: number;
  BA05_13: number;
  BA05_14: number;
  fruit_prod: string;
}

interface FruitSales {
  BA05_17: number;
  BA05_18: number;
  BA05_19: number;
  BA05_20: number;
  fruit_sales: string;
}

export interface FruitDetail {
  fruit_ward_no: string;
  fruit: string;
  frl: FruitLand;
  frp: FruitProduction;
  frs: FruitSales;
  __id: string;
}

interface SpiceLand {
  spice_bigha: number;
  spice_kattha: number;
  spice_dhur: number;
  spice_area: string;
  spnt: null | number;
}

interface SpiceProduction {
  BA06_11: number;
  BA06_12: number;
  BA06_13: number;
  BA06_14: number;
  spice_prod: string;
}

interface SpiceSales {
  BA06_17: number;
  BA06_18: number;
  BA06_19: number;
  BA06_20: number;
  spice_sales: string;
}

export interface SpiceDetail {
  spice_ward_no: string;
  spice: string;
  sl: SpiceLand;
  sp: SpiceProduction;
  ss: SpiceSales;
  __id: string;
}

interface CCropLand {
  betet_trees_count: null | number;
  cash_bigha: number;
  cash_kattha: number;
  cash_dhur: number;
  ccrop_area: string;
  ccnt: null | number;
}

interface CCropProduction {
  BA07_11: number;
  BA07_12: number;
  BA07_13: number;
  BA07_14: number;
  ccrop_prod: string;
}

interface CCropSales {
  BA07_17: number;
  BA07_18: number;
  BA07_19: number;
  BA07_20: number;
  ccrop_sales: string;
}

export interface CCropDetail {
  ccrop_ward_no: string;
  ccrop: string;
  isBetel: string;
  cl: CCropLand;
  cp: CCropProduction;
  cs: CCropSales;
  __id: string;
}

export interface OtherBAnimalDetail {
  b_animal_oth: string;
  othtotal_b_animals: number;
  othb_animal_sales: number;
  othb_animal_revenue: number;
}

export interface NormalBAnimalDetail {
  total_b_animals: number;
  b_animal_sales: number;
  b_animal_revenue: number;
}

export interface BAnimalDetail {
  __id: string;
  animal_ward_no: string;
  b_animal: string;
  banim: OtherBAnimalDetail;
  banimn: NormalBAnimalDetail;
}

export interface OtherBAprodProdDetail {
  baprod_oth: string;
  oth_baprod_unit: string;
  oth_b_aprod_prod: number;
  oth_aprod_sales: number;
  oth_b_month_aprod: number;
  oth_aprod_revenue: number;
}

export interface NormalBAprodProdDetail {
  baprod_unit: string;
  aprod_unit_oth: string;
  b_aprod_prod: number;
  approd_sales: number;
  b_month_aprod: number;
  approd_revenue: number;
}

export interface BAprodDetail {
  b_aprod: string;
  aprod_ward_no: string;
  baprd: OtherBAprodProdDetail;
  baprdn: NormalBAprodProdDetail;
  __id: string;
}

interface EnumeratorIntroduction {
  enumerator_name: string;
  enumerator_id: string;
  enumerator_phone: string;
  building_token_number: string;
}

interface BusinessAddress {
  ward_no: number;
  area_code: string;
  biz_no: number;
  locality: string;
}

interface BusinessOperator {
  op_name: string;
  opph: string;
  op_age: number;
  op_gender: string;
  op_edu_lvl: string;
}

interface HotelDetails {
  accomodation_type: string | null;
  room_no: number | null;
  bed_no: number | null;
  room_type: string | null;
  has_hall: string | null;
  hcpcty: number | null;
}

interface AgriculturalDetails {
  agricultural_business: string;
  bagd: {
    fcrops: string;
    fcrop_details_count: string;
    pulses: string;
    pulse_details_count: string;
    oseeds: string;
    oseed_details_count: string;
    vtables: string;
    vtable_details_count: string;
    fruits: string;
    fruit_details_count: string;
    spices: string;
    spice_details_count: string;
    ccrops: string;
    ccrop_details_count: string;
    fcrop_details: FCropDetail[] | null | undefined;
    pulse_details: PPulseDetail[] | null | undefined;
    oseed_details: OSeedDetail[] | null | undefined;
    vtable_detail?: VTableDetail[];
    fruit_details?: FruitDetail[];
    spice_details?: SpiceDetail[];
    ccrop_details?: CCropDetail[];
  };
  banimal_details?: BAnimalDetail[];
  banimal_details_count: string;
  baprod_details?: BAprodDetail[];
  baprod_details_count: string;
  aquaculture_details: {
    aquaculture_ward_no: string | null;
    pond_no: number | null;
    BC01_3: number | null;
    BC01_5: number | null;
    BC01_7: number | null;
    pond_area: number | null;
    BC01_9: number | null;
    fish_prod: number | null;
  };
  apiculture_details: {
    dapi: string | null;
    apiculture_ward_no: string | null;
    hive_no: number | null;
    honey_prod: number | null;
  };
}

interface EmploymentDetails {
  has_partners: string;
  prt: {
    total_partners: number | null;
    nepali_male_partners: number | null;
    nepali_female_partners: number | null;
    has_foreign_partners: string | null;
    foreign_male_partners: number | null;
    foreign_female_partners: number | null;
    PTOT: number | null;
    NIF01: number | null;
  };
  has_involved_family: string;
  efam: {
    total_involved_family: number | null;
    male_involved_family: number | null;
    female_involved_family: number | null;
    IFTOT: number | null;
    NIF01: number | null;
  };
  has_perm_employees: string;
  etemp: {
    total_perm_employees: number | null;
    nepali_male_perm_employees: number | null;
    nepali_female_perm_employees: number | null;
    has_foreign_perm_employees: string | null;
    foreign_male_perm_employees: number | null;
    foreign_female_perm_employees: number | null;
    frgnpemp: number | null;
    PERMTOT: number | null;
    NIF01: number | null;
  };
  frgnpemp_cnt: number | null;
  has_temp_employees: string;
  eperm: {
    total_temp_employees: number | null;
    nepali_male_temp_employees: number | null;
    nepali_female_temp_employees: number | null;
    has_foreign_temp_employees: string | null;
    foreign_male_temp_employees: number | null;
    foreign_female_temp_employees: number | null;
    frgntemp: number | null;
    TEMPTOT: number | null;
    NIF01: number | null;
  };
  frgntemp_cnt: number | null;
}

interface SystemInfo {
  submissionDate: string;
  updatedAt: string | null;
  submitterId: string;
  submitterName: string;
  attachmentsPresent: number;
  attachmentsExpected: number;
  status: string | null;
  reviewState: string | null;
  deviceId: string | null;
  edits: number;
  formVersion: string;
}

export interface RawBusiness {
  audio_monitoring: string | null;
  NBIZ: string | null;
  enumerator_introduction: EnumeratorIntroduction;
  business_name: string;
  b_addr: BusinessAddress;
  b: BusinessOperator;
  business_nature: string;
  business_nature_other: string | null;
  business_type: string | null;
  business_type_other: string | null;
  is_registered: string;
  registered_bodies: string;
  registered_bodies_other: string | null;
  statutory_status: string;
  statutory_status_other: string | null;
  has_pan: string;
  pan_no: number;
  ownership_status: string | null;
  ownership_status_oth: string | null;
  hotel: HotelDetails;
  bag: AgriculturalDetails;
  investment: number;
  business_location_ownership: string;
  business_location_ownership_oth: string | null;
  emp: EmploymentDetails;
  b_location: {
    type: "Point";
    coordinates: [number, number, number];
    properties: { accuracy: number };
  };
  bimg: string;
  bimg_selfie: string;
  meta: {
    instanceID: string;
    instanceName: string;
  };
  __id: string;
  __system: SystemInfo;
}
