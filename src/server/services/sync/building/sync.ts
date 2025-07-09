import { and, eq, sql } from "drizzle-orm";
import {
  areas,
  buildings,
  buildingTokens,
  stagingBuildings,
  stagingToProduction,
  users,
  wards,
} from "../../../db/schema";

export async function syncBuildingSurvey(
  recordId: string,
  data: any,
  ctx: any,
) {
  // Perform main building sync
  await performBuildingSync(ctx, recordId);
  // 4. If it is not, do the following.
  // 4.1 Check if there is a valid ward number correpsponding to the submitted building data.
  // 4.2 If there is, link the ward number with the building data.
  // 4.3 Check if there is a valid area code corresponding to the submitted building data.
  // 4.4 If there is, link the area code with the building data.
  // 4.5 Check if there is a valid building token corresponding to the submitted building data.
  // 4.6 If there is, link the building token with the building data.
  // 4.7 Check if there is a valid enumerator ID corresponding to the submitted building data.
  // 4.8 If there is, link the enumerator ID with the building data.
  const wardNumber = data.ward_no;
  const areaCode = data.area_code;
  const buildingToken = data.building_token;
  const enumeratorId = data.enumerator_id;

  // Find enumerator
  const enumerator = await handleEnumerator(ctx, enumeratorId, recordId);

  // Handle Ward Number
  console.log("Fetching ward number..");
  const ward = await handleWardNumber(ctx, wardNumber, recordId);
  console.log("Fetched ward number...", ward);

  // Handle Area Code
  const dbAreaCode = await handlAreaCode(ctx, areaCode, recordId);

  // Handle building token allocation
  await handleBuildingToken(ctx, buildingToken, recordId);

  // Update area status if needed
  await updateAreaStatus(ctx, enumerator?.[0]?.id, areaCode);
}

async function handleEnumerator(
  ctx: any,
  enumeratorId: string,
  recordId: string,
) {
  const enumerator = await ctx.db
    .select()
    .from(users)
    .where(
      eq(
        sql`UPPER(SUBSTRING(${users.id}::text, 1, 8))`,
        enumeratorId.substring(0, 8).toUpperCase(),
      ),
    )
    .limit(1);
  if (enumerator.length > 0) {
    await ctx.db
      .update(buildings)
      .set({ enumeratorId: enumerator[0].id, isEnumeratorValid: true })
      .where(eq(buildings.id, recordId));
  } else {
    await ctx.db
      .update(buildings)
      .set({ isEnumeratorValid: false })
      .where(eq(buildings.id, recordId));
  }
  return enumerator;
}

async function handleWardNumber(
  ctx: any,
  wardNumber: number,
  buildingId: string,
) {
  console.log(wardNumber);
  const ward = await ctx.db
    .select({
      wardNumber: wards.wardNumber,
    })
    .from(wards)
    .where(eq(wards.wardNumber, wardNumber))
    .limit(1);

  if (ward.length > 0) {
    console.log(ward[0].wardNumber, buildingId);
    await ctx.db
      .update(buildings)
      .set({ wardId: ward[0].wardNumber, isWardValid: true })
      .where(eq(buildings.id, buildingId));
  } else {
    await ctx.db
      .update(buildings)
      .set({ isWardValid: false })
      .where(eq(buildings.id, buildingId));
  }
  return ward;
}

async function handlAreaCode(ctx: any, areaCode: number, buildingId: string) {
  const area = await ctx.db
    .select({ id: areas.id })
    .from(areas)
    .where(eq(areas.code, areaCode))
    .limit(1);

  if (area.length > 0) {
    await ctx.db
      .update(buildings)
      .set({ areaId: area[0].id, isAreaValid: true })
      .where(eq(buildings.id, buildingId));
  } else {
    await ctx.db
      .update(buildings)
      .set({ isAreaValid: false })
      .where(eq(buildings.id, buildingId));
  }
  return area;
}

async function updateAreaStatus(
  ctx: any,
  userId: string | undefined,
  areaCode: string,
) {
  if (!userId) return;

  const area = await ctx.db
    .select({
      code: areas.code,
      areaStatus: areas.areaStatus,
      assignedTo: areas.assignedTo,
    })
    .from(areas)
    .where(and(eq(areas.assignedTo, userId)))
    .limit(1);

  if (
    area.length > 0 &&
    area[0].code === areaCode &&
    area[0].areaStatus === "newly_assigned"
  ) {
    await ctx.db
      .update(areas)
      .set({ areaStatus: "ongoing_survey" })
      .where(eq(areas.code, parseInt(areaCode, 10)));
  }
}

async function handleBuildingToken(
  ctx: any,
  buildingToken: string,
  recordId: string,
) {
  const validToken = await ctx.db
    .select()
    .from(buildingTokens)
    .where(
      eq(
        sql`UPPER(SUBSTRING(${buildingTokens.token}, 1, 8))`,
        buildingToken.substring(0, 8).toUpperCase(),
      ),
    )
    .limit(1);

  if (validToken.length > 0) {
    await ctx.db
      .update(buildings)
      .set({ buildingToken: validToken[0].token, isBuildingTokenValid: true })
      .where(eq(buildings.id, recordId));

    await ctx.db
      .update(buildingTokens)
      .set({
        status: "allocated",
        token: buildingToken,
      })
      .where(eq(buildingTokens.token, validToken[0].token));
  } else {
    await ctx.db
      .update(buildings)
      .set({ isBuildingTokenValid: false })
      .where(eq(buildings.id, recordId));
  }
}
/**
 * Performs the main building data sync from staging to production table
 * Includes error handling and data validation
 *
 * @param ctx Database context
 * @param recordId Unique identifier for the building record
 */
async function performBuildingSync(ctx: any, recordId: string) {
  try {
    console.log(recordId);
    // Fetch record from staging table
    const result = await ctx.db
      .select()
      .from(stagingBuildings)
      .where(eq(stagingBuildings.id, recordId))
      .limit(1);

    // Validate that record exists
    if (!result.length) {
      throw new Error(`No staging record found for ID: ${recordId}`);
    }

    const stagingData = result[0];

    // Insert validated data into production buildings table
    await ctx.db
      .insert(buildings)
      .values({
        // Core identifiers and metadata
        id: stagingData.id,
        surveyDate: stagingData.surveyDate,
        enumeratorName: stagingData.enumeratorName,

        // Location information
        locality: stagingData.locality,

        // Occupancy details
        totalFamilies: stagingData.totalFamilies ?? 0, // Default to 0 if null
        totalBusinesses: stagingData.totalBusinesses ?? 0,

        // Survey media and geolocation
        surveyAudioRecording: stagingData.surveyAudioRecording,
        gps: stagingData.gps,
        altitude: stagingData.altitude,
        gpsAccuracy: stagingData.gpsAccuracy,
        buildingImage: stagingData.buildingImage,
        enumeratorSelfie: stagingData.enumeratorSelfie,

        // Building physical attributes
        landOwnership: stagingData.landOwnership,
        base: stagingData.base,
        outerWall: stagingData.outerWall,
        roof: stagingData.roof,
        floor: stagingData.floor,

        // Compliance and risk factors
        mapStatus: stagingData.mapStatus,
        naturalDisasters: stagingData.naturalDisasters,

        // Accessibility metrics
        timeToMarket: stagingData.timeToMarket,
        timeToActiveRoad: stagingData.timeToActiveRoad,
        timeToPublicBus: stagingData.timeToPublicBus,
        timeToHealthOrganization: stagingData.timeToHealthOrganization,
        timeToFinancialOrganization: stagingData.timeToFinancialOrganization,
        roadStatus: stagingData.roadStatus,

        // Approval workflow
        status: "pending",

        // Temporary reference fields for validation
        tmpAreaCode: stagingData.areaCode,
        tmpWardNumber: stagingData.wardNumber,
        tmpEnumeratorId: stagingData.enumeratorId,
        tmpBuildingToken: stagingData.buildingToken,
      })
      .onConflictDoNothing();

    // Track the sync operation
    console.log("Syncing building", recordId);
    await ctx.db
      .insert(stagingToProduction)
      .values({
        staging_table: "staging_Kerabari_buildings",
        production_table: "Kerabari_buildings",
        recordId: recordId,
      })
      .onConflictDoNothing();
  } catch (error) {
    // Log error and re-throw
    console.error(`Error syncing building ${recordId}:`, error);
    throw new Error(`Building sync failed: ${error}`);
  }
}
