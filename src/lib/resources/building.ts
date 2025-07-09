// import { RawBuildingData } from "../parser/Kerabari/parse-buildings";
// import { decodeSingleChoice, decodeMultipleChoices } from "./utils";

// export const buildingChoices = {
//   drinking_water_source: {
//     tap_inside_house: "  धारा/पाइप (घरपरिसर भित्र)",
//     tap_outside_house: "  धारा/पाइप (घरपरिसर) बाहिर)",
//     tubewell: "  ट्युबवेल/हाते पम्प",
//     covered_well: "  ढाकिएको इनार/कुवा",
//     open_well: "  खुला इनार/कुवा",
//     aquifier_mool: "  मूल धारा",
//     river: "  नदी/खोला",
//     jar: "  जार/बोतल",
//     other: "  अन्य (खुलाउने)",
//   },
//   house_base: {
//     wood_brick_combo: "काठ वरिपरि ईट्टा लगाएर खम्बा जोडेको",
//     concrete_pillar: "ढलान पिल्लरसहितको",
//     cement_joined: "सिमेन्टको जोडाइ भएको इँटा/ढुङ्गा",
//     mud_joined: "माटोको जोडाइ भएको इँटा/ढुङ्गा",
//     wood_pole: "काठको खम्बा गाडेको",
//     other: "अन्य (खुलाउने)",
//   },
//   house_floor: {
//     concrete: "सिमेन्ट ढलान",
//     mud: "माटो",
//     wood: "काठको फल्याक/बाँस",
//     brick: "इँटा/ढुङ्गा",
//     tile: "सेरामिक टायल",
//     other: "अन्य (उल्लेख गर्ने)",
//   },
//   house_outer_wall: {
//     floor_cement_wood_house: "भुईतल सिमेन्ट र ईट्टा भएको काठे घर",
//     cement_joined: "सिमेन्टको जोडाइ भएको इँटा/ढुङ्गा",
//     unbaked_brick: "काँचो इँटा",
//     mud_joined: "माटोको जोडाइ भएको इँटा/ढुङ्गा",
//     tin: "जस्ता/टिन/च्यादर",
//     bamboo: "बाँसजन्य सामग्री",
//     wood: "काठ/फल्याक",
//     prefab: "प्रि फ्याब",
//     other: "अन्य (खुलाउने)",
//   },
//   house_ownership: {
//     private: "निजी",
//     rent: "भाडामा",
//     inisitutional: "संस्थागत",
//     other: "अन्य (खुलाउने)",
//   },
//   house_roof: {
//     cement: "सिमेन्ट ढलान",
//     tin: "जस्ता/टिन",
//     tile: "टायल/खपडा/झिँगटी",
//     straw: "खर/पराल/छ्वाली",
//     wood: "काठ/फल्याक",
//     stone: "ढुङ्गा/स्लेट",
//     other: "अन्य (खुलाउने)",
//   },
//   land_ownership: {
//     private: "निजी",
//     guthi: "गुठी",
//     public_eilani: "सार्वजनिक/ऐलानी",
//     village_block: "गाउँ ब्लक",
//     other: "अन्य (खुलाउने)",
//   },
//   map_status: {
//     map_passed: "नक्सा पास भएको",
//     map_archieved: "नक्सा अभिलेखिकरण भएको",
//     map_not_archieved: "नक्सा अभिलेखिकरण नभएको",
//   },
//   natural_disasters: {
//     flood: "बाढी",
//     landslide: "पहिरो",
//     inundation: "डुबान",
//     cutting: "कटान",
//     fire: "डढेलो",
//     storm: "हुरिबतास",
//     hailstone: "असिना",
//     wildlife_risk: "बन्यजन्तुको जोखिम",
//     lightning: "चट्याङ",
//     fog: "शितलहर",
//     no_any_risk: "कुनै पनि जोखिममा नभएको",
//     other: "अन्य (खुलाउने) ",
//   },
//   road_status: {
//     black_topped: "कालोपत्रे/पक्की ढलान सडक",
//     graveled: "ग्राभेल सडक",
//     dirt: "धुले (कच्ची) सडक",
//     goreto: "गोरेटो बाटो",
//     other: "अन्य ",
//   },
//   time: {
//     under_15_min: "१५ मिनेटभित्र",
//     under_30_min: "३० मिनेटभित्र",
//     under_1_hour: "१ घण्टाभित्र",
//     one_hour_or_more: "१ घण्टाभन्दा बढी ",
//   },
//   toilet_type: {
//     flush_with_septic_tank: "फ्लस भएको (सेप्टिक ट्याङ्क)",
//     normal: "साधारण",
//     public_eilani: "सार्वजनिक",
//     no_toilet: "चर्पी नभएको",
//     other: "अन्य (खुलाउने)",
//   },
//   water_purification: {
//     boiling: "उमाल्ने",
//     filtering: "फिल्टर गर्ने",
//     chemical_piyush: "औषधी (पियुष आदि) राख्ने",
//     no_any_filtering: "केही नगर्ने/सिधै खाने",
//     other: "अन्य विधि अपनाउने (जस्तै सोडिस)",
//   },
// };

// export const mapBuildingChoices = (building: RawBuildingData) => {
//   return {
//     ...building,
//     house_base: decodeSingleChoice(
//       building.house_base as keyof typeof buildingChoices.house_base,
//       buildingChoices.house_base,
//     ),
//     house_floor: decodeSingleChoice(
//       building.house_floor as keyof typeof buildingChoices.house_floor,
//       buildingChoices.house_floor,
//     ),
//     house_outer_wall: decodeSingleChoice(
//       building.house_outer_wall as keyof typeof buildingChoices.house_outer_wall,
//       buildingChoices.house_outer_wall,
//     ),
//     ownership_status: decodeSingleChoice(
//       building.ownership_status as keyof typeof buildingChoices.land_ownership,
//       buildingChoices.land_ownership,
//     ),
//     house_roof: decodeSingleChoice(
//       building.house_roof as keyof typeof buildingChoices.house_roof,
//       buildingChoices.house_roof,
//     ),
//     map_status: decodeSingleChoice(
//       building.map_status as keyof typeof buildingChoices.map_status,
//       buildingChoices.map_status,
//     ),
//     natural_disasters: decodeMultipleChoices(
//       building.natural_disasters,
//       buildingChoices.natural_disasters,
//     ),
//     road_status: decodeSingleChoice(
//       building.road_status as keyof typeof buildingChoices.road_status,
//       buildingChoices.road_status,
//     ),
//     time_to_market: decodeSingleChoice(
//       building.time_to_market as keyof typeof buildingChoices.time,
//       buildingChoices.time,
//     ),
//     time_to_act_road: decodeSingleChoice(
//       building.time_to_act_road as keyof typeof buildingChoices.time,
//       buildingChoices.time,
//     ),
//     time_to_pub_bus: decodeSingleChoice(
//       building.time_to_pub_bus as keyof typeof buildingChoices.time,
//       buildingChoices.time,
//     ),
//     time_to_health_inst: decodeSingleChoice(
//       building.time_to_health_inst as keyof typeof buildingChoices.time,
//       buildingChoices.time,
//     ),
//     time_to_financial_org: decodeSingleChoice(
//       building.time_to_financial_org as keyof typeof buildingChoices.time,
//       buildingChoices.time,
//     ),
//   };
// };
