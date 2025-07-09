import { and, eq, sql } from "drizzle-orm";
import {
  areas,
  buildings,
  buildingTokens,
  stagingToProduction,
  users,
  wards,
} from "../../../db/schema";
import {
  business,
  stagingBusiness,
} from "@/server/db/schema/business/business";
import {
  businessCrops,
  StagingBusinessCrop,
  stagingBusinessCrops,
} from "@/server/db/schema/business/business-crops";
import {
  businessAnimalProducts,
  StagingBusinessAnimalProduct,
  stagingBusinessAnimalProducts,
} from "@/server/db/schema/business/business-animal-products";
import {
  businessAnimals,
  StagingBusinessAnimal,
  stagingBusinessAnimals,
} from "@/server/db/schema/business/business-animals";

export async function syncBusinessSurvey(
  recordId: string,
  data: any,
  ctx: any,
) {
  try {
    await performBusinessSync(ctx, recordId);

    const wardNumber = data.b_addr.ward_no;
    const areaCode = data.b_addr.area_code;
    const buildingToken = data.enumerator_introduction.building_token_number;
    const enumeratorId = data.enumerator_introduction.enumerator_id;

    // Find enumerator with error handling
    let enumerator;
    try {
      enumerator = await handleEnumerator(ctx, enumeratorId, recordId);
    } catch (error) {
      console.error(`[Enumerator Handling Error] Record ${recordId}:`, error);
      // throw new Error(`Failed to handle enumerator: ${error}`);
    }

    // Handle Ward Number with error handling
    try {
      await handleWardNumber(ctx, wardNumber, recordId);
    } catch (error) {
      console.error(`[Ward Handling Error] Record ${recordId}:`, error);
      // throw new Error(`Failed to handle ward: ${error}`);
    }

    // Handle Area Code with error handling
    try {
      await handlAreaCode(ctx, areaCode, recordId);
    } catch (error) {
      console.error(`[Area Code Handling Error] Record ${recordId}:`, error);
      // throw new Error(`Failed to handle area code: ${error}`);
    }

    // Handle building token allocation with error handling
    try {
      await handleBuildingToken(ctx, buildingToken, recordId);
    } catch (error) {
      console.error(`[Building Token Error] Record ${recordId}:`, error);
      // throw new Error(`Failed to handle building token: ${error}`);
    }

    // Update area status with error handling
    try {
      await updateAreaStatus(ctx, enumerator?.[0]?.id, areaCode);
    } catch (error) {
      console.error(`[Area Status Update Error] Record ${recordId}:`, error);
      // throw new Error(`Failed to update area status: ${error}`);
    }
  } catch (error) {
    console.error(`[Sync Building Survey Error] Record ${recordId}:`, error);
    // throw new Error(`Building survey sync failed: ${error}`);
  }
}

async function handleEnumerator(
  ctx: any,
  enumeratorId: string,
  recordId: string,
) {
  try {
    if (!enumeratorId) {
      throw new Error("Enumerator ID is required");
    }

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

    await ctx.db
      .update(business)
      .set({
        enumeratorId: enumerator.length > 0 ? enumerator[0].id : null,
        isEnumeratorValid: enumerator.length > 0,
      })
      .where(eq(business.id, recordId));

    return enumerator;
  } catch (error) {
    console.error(`[Enumerator Query Error] Record ${recordId}:`, error);
    throw new Error(`Database operation failed for enumerator: ${error}`);
  }
}

async function handleWardNumber(
  ctx: any,
  wardNumber: number,
  businessId: string,
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
    console.log(ward[0].wardNumber, businessId);
    await ctx.db
      .update(business)
      .set({ wardId: ward[0].wardNumber, isWardValid: true })
      .where(eq(business.id, businessId));
  } else {
    await ctx.db
      .update(business)
      .set({ isWardValid: false })
      .where(eq(business.id, businessId));
  }
  return ward;
}

async function handlAreaCode(ctx: any, areaCode: number, businessId: string) {
  try {
    if (!areaCode) {
      throw new Error("Area code is required");
    }

    const area = await ctx.db
      .select({ id: areas.id })
      .from(areas)
      .where(eq(areas.code, areaCode))
      .limit(1);

    await ctx.db
      .update(business)
      .set({
        areaId: area.length > 0 ? area[0].id : null,
        isAreaValid: area.length > 0,
      })
      .where(eq(business.id, businessId));

    return area;
  } catch (error) {
    console.error(`[Area Code Error] Building ${businessId}:`, error);
    throw new Error(`Area code handling failed: ${error}`);
  }
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
  try {
    if (!buildingToken) {
      throw new Error("Building token is required");
    }

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
      await Promise.all([
        ctx.db
          .update(buildings)
          .set({
            buildingToken: validToken[0].token,
            isBuildingTokenValid: true,
          })
          .where(eq(buildings.id, recordId)),

        ctx.db
          .update(buildingTokens)
          .set({
            status: "allocated",
            token: buildingToken,
          })
          .where(eq(buildingTokens.token, validToken[0].token)),
      ]);
    } else {
      await ctx.db
        .update(business)
        .set({ isBuildingTokenValid: false })
        .where(eq(business.id, recordId));
    }
  } catch (error) {
    console.error(`[Building Token Error] Record ${recordId}:`, error);
    throw new Error(`Building token handling failed: ${error}`);
  }
}
/**
 * Performs the main building data sync from staging to production table
 * Includes error handling and data validation
 *
 * @param ctx Database context
 * @param recordId Unique identifier for the building record
 */
async function performBusinessSync(ctx: any, recordId: string) {
  try {
    // Fetch record from staging table
    const result = await ctx.db
      .select()
      .from(stagingBusiness)
      .where(eq(stagingBusiness.id, recordId))
      .limit(1);

    // Validate that record exists
    if (!result.length) {
      throw new Error(`No staging record found for ID: ${recordId}`);
    }

    const crops = await ctx.db
      .select()
      .from(stagingBusinessCrops)
      .where(eq(stagingBusinessCrops.businessId, recordId));

    const animals = await ctx.db
      .select()
      .from(stagingBusinessAnimals) // Fixed: changed from stagingBusinessCrops to stagingBusinessAnimals
      .where(eq(stagingBusinessAnimals.businessId, recordId));

    const animalProducts = await ctx.db // Added: await keyword
      .select()
      .from(stagingBusinessAnimalProducts)
      .where(eq(stagingBusinessAnimalProducts.businessId, recordId));

    console.log(animals.length, animalProducts.length);
    const stagingData = result[0];

    // Insert validated data into production buildings table
    await ctx.db
      .insert(business)
      .values({
        // Core identifiers
        id: stagingData.id,
        enumeratorName: stagingData.enumeratorName,
        phone: stagingData.phone,

        // Business Basic Information
        businessName: stagingData.businessName,
        wardNo: stagingData.wardNo,
        areaCode: stagingData.areaCode,
        businessNo: stagingData.businessNo,
        locality: stagingData.locality,

        // Operator Details
        operatorName: stagingData.operatorName,
        operatorPhone: stagingData.operatorPhone,
        operatorAge: stagingData.operatorAge,
        operatorGender: stagingData.operatorGender,
        operatorEducation: stagingData.operatorEducation,

        // Business Classification
        businessNature: stagingData.businessNature,
        businessNatureOther: stagingData.businessNatureOther,
        businessType: stagingData.businessType,
        businessTypeOther: stagingData.businessTypeOther,

        // Registration and Legal Information
        registrationStatus: stagingData.registrationStatus,
        registeredBodies: stagingData.registeredBodies,
        registeredBodiesOther: stagingData.registeredBodiesOther,
        statutoryStatus: stagingData.statutoryStatus,
        statutoryStatusOther: stagingData.statutoryStatusOther,
        panStatus: stagingData.panStatus,
        panNumber: stagingData.panNumber,

        // Location Data
        gps: stagingData.gps,
        altitude: stagingData.altitude,
        gpsAccuracy: stagingData.gpsAccuracy,

        // Financial and Property Information
        investmentAmount: stagingData.investmentAmount,
        businessLocationOwnership: stagingData.businessLocationOwnership,
        businessLocationOwnershipOther:
          stagingData.businessLocationOwnershipOther,

        // Employee Information - Partners
        hasPartners: stagingData.hasPartners,
        totalPartners: stagingData.totalPartners,
        nepaliMalePartners: stagingData.nepaliMalePartners,
        nepaliFemalePartners: stagingData.nepaliFemalePartners,
        hasForeignPartners: stagingData.hasForeignPartners,
        foreignMalePartners: stagingData.foreignMalePartners,
        foreignFemalePartners: stagingData.foreignFemalePartners,

        // Employee Information - Family
        hasInvolvedFamily: stagingData.hasInvolvedFamily,
        totalInvolvedFamily: stagingData.totalInvolvedFamily,
        maleInvolvedFamily: stagingData.maleInvolvedFamily,
        femaleInvolvedFamily: stagingData.femaleInvolvedFamily,

        // Employee Information - Permanent
        hasPermanentEmployees: stagingData.hasPermanentEmployees,
        totalPermanentEmployees: stagingData.totalPermanentEmployees,
        nepaliMalePermanentEmployees: stagingData.nepaliMalePermanentEmployees,
        nepaliFemalePermanentEmployees:
          stagingData.nepaliFemalePermanentEmployees,
        hasForeignPermanentEmployees: stagingData.hasForeignPermanentEmployees,
        foreignMalePermanentEmployees:
          stagingData.foreignMalePermanentEmployees,
        foreignFemalePermanentEmployees:
          stagingData.foreignFemalePermanentEmployees,

        // Employee Information - Temporary
        hasTemporaryEmployees: stagingData.hasTemporaryEmployees,
        totalTemporaryEmployees: stagingData.totalTemporaryEmployees,
        nepaliMaleTemporaryEmployees: stagingData.nepaliMaleTemporaryEmployees,
        nepaliFemaleTemporaryEmployees:
          stagingData.nepaliFemaleTemporaryEmployees,
        hasForeignTemporaryEmployees: stagingData.hasForeignTemporaryEmployees,
        foreignMaleTemporaryEmployees:
          stagingData.foreignMaleTemporaryEmployees,
        foreignFemaleTemporaryEmployees:
          stagingData.foreignFemaleTemporaryEmployees,

        // Aquaculture Information
        aquacultureWardNo: stagingData.aquacultureWardNo,
        pondCount: stagingData.pondCount,
        pondArea: stagingData.pondArea,
        fishProduction: stagingData.fishProduction,
        fingerlingNumber: stagingData.fingerlingNumber,
        totalInvestment: stagingData.totalInvestment,
        annualIncome: stagingData.annualIncome,
        employmentCount: stagingData.employmentCount,

        // Apiculture Information
        apicultureWardNo: stagingData.apicultureWardNo,
        hiveCount: stagingData.hiveCount,
        honeyProduction: stagingData.honeyProduction,
        hasApiculture: stagingData.hasApiculture,

        // Temporary fields
        tmpAreaCode: stagingData.areaCode,
        tmpWardNumber: stagingData.wardNo,
        tmpEnumeratorId: stagingData.enumeratorId,
        tmpBuildingToken: stagingData.buildingToken,

        // Default flags
        isAreaValid: false,
        isWardValid: false,
        isBuildingTokenValid: false,
        isEnumeratorValid: false,

        // Status
        status: "pending",
      })
      .onConflictDoNothing();

    // Insert crops data into production table
    if (crops.length > 0) {
      await ctx.db
        .insert(businessCrops)
        .values(
          crops.map((crop: StagingBusinessCrop) => ({
            id: crop.id,
            businessId: crop.businessId,
            wardNo: crop.wardNo,
            cropType: crop.cropType,
            cropName: crop.cropName,
            cropArea: crop.cropArea,
            cropProduction: crop.cropProduction,
            cropSales: crop.cropSales,
            cropRevenue: crop.cropRevenue,
            cropCount: crop.cropCount,
          })),
        )
        .onConflictDoNothing();
    }

    // Insert animals data into production table
    if (animals.length > 0) {
      await ctx.db
        .insert(businessAnimals)
        .values(
          animals.map((animal: StagingBusinessAnimal) => ({
            id: animal.id,
            businessId: animal.businessId,
            wardNo: animal.wardNo,
            animalName: animal.animalName,
            totalCount: animal.totalCount,
            salesCount: animal.salesCount,
            revenue: animal.revenue,
          })),
        )
        .onConflictDoNothing();
    }

    // Insert animal products data into production table
    if (animalProducts.length > 0) {
      await ctx.db
        .insert(businessAnimalProducts)
        .values(
          animalProducts.map((product: StagingBusinessAnimalProduct) => ({
            id: product.id,
            businessId: product.businessId,
            wardNo: product.wardNo,
            animalProduct: product.animalProduct,
            productName: product.productName,
            unit: product.unit,
            productionAmount: product.productionAmount,
            salesAmount: product.salesAmount,
            monthlyProduction: product.monthlyProduction,
            revenue: product.revenue,
          })),
        )
        .onConflictDoNothing();
    }

    // Track the sync operation
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
