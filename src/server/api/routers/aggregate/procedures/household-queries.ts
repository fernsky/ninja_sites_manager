import { publicProcedure } from "@/server/api/trpc";
import {
  householdByIdSchema,
  householdsByBuildingIdSchema,
  householdEntitySchema,
} from "../schemas/household-schema";
import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import { KerabariAggregateBuilding } from "@/server/db/schema/aggregate-building";
import { surveyAttachments } from "@/server/db/schema";
import { generateMediaUrls } from "../utils/media-utils";

export const getHouseholdById = publicProcedure
  .input(householdByIdSchema)
  .query(async ({ ctx, input }) => {
    // Find the building containing this household
    const buildingQuery = await ctx.db
      .select({
        building: KerabariAggregateBuilding,
      })
      .from(KerabariAggregateBuilding)
      .where(
        sql`${KerabariAggregateBuilding.households} @> jsonb_build_array(jsonb_build_object('id', ${input.id}))`,
      )
      .limit(1);

    if (!buildingQuery[0]) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Household not found in any building",
      });
    }

    const building = buildingQuery[0].building;

    // Find the specific household in the households array
    const household = building.households?.find((h) => h.id === input.id);

    if (!household) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Household data not found",
      });
    }

    // Get attachments for this household
    const attachments = await ctx.db.query.surveyAttachments.findMany({
      where: eq(surveyAttachments.dataId, input.id),
    });

    // Generate media URLs
    const householdWithMedia = await generateMediaUrls(
      ctx.minio,
      household,
      attachments,
    );

    // Filter out data based on input parameters
    const result = { ...householdWithMedia };

    if (!input.includeMembers) {
      result.household_members = undefined;
    }

    if (!input.includeCrops) {
      result.crops = undefined;
    }

    if (!input.includeAnimals) {
      result.animals = undefined;
    }

    if (!input.includeLands) {
      result.agricultural_lands = undefined;
    }

    if (!input.includeProducts) {
      result.animal_products = undefined;
    }

    if (!input.includeDeaths) {
      result.deaths = undefined;
    }

    if (!input.includeAbsentees) {
      result.absentees = undefined;
    }

    return result;
  });

export const getHouseholdsByBuildingId = publicProcedure
  .input(householdsByBuildingIdSchema)
  .query(async ({ ctx, input }) => {
    const building = await ctx.db
      .select()
      .from(KerabariAggregateBuilding)
      .where(eq(KerabariAggregateBuilding.id, input.buildingId))
      .limit(1);

    if (!building[0]) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Building not found",
      });
    }

    if (!building[0].households || building[0].households.length === 0) {
      return {
        data: [],
        totalCount: 0,
      };
    }

    // Return simplified household data
    const householdSummaries = building[0].households.map((h) => ({
      id: h.id,
      headName: h.head_name,
      headPhone: h.head_phone,
      totalMembers: h.total_members,
      areaCode: h.area_code,
      wardNumber: h.ward_number,
      locality: h.household_locality,
      surveyDate: h.household_survey_date,
      hasAgricultureLand: h.has_agricultural_land,
      hasAnimalHusbandry: h.has_animal_husbandry,
      hasRemittance: h.has_remittance,
    }));

    return {
      data: householdSummaries,
      totalCount: householdSummaries.length,
    };
  });

export const getHouseholdMembers = publicProcedure
  .input(householdEntitySchema)
  .query(async ({ ctx, input }) => {
    const building = await ctx.db
      .select()
      .from(KerabariAggregateBuilding)
      .where(
        sql`${KerabariAggregateBuilding.households} @> jsonb_build_array(jsonb_build_object('id', ${input.householdId}))`,
      )
      .limit(1);

    if (!building[0] || !building[0].households) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Household not found",
      });
    }

    const household = building[0].households.find(
      (h) => h.id === input.householdId,
    );

    if (!household || !household.household_members) {
      return {
        data: [],
        totalCount: 0,
      };
    }

    const { limit, offset } = input;
    const totalCount = household.household_members.length;
    const paginatedData = household.household_members.slice(
      offset,
      offset + limit,
    );

    return {
      data: paginatedData,
      pagination: {
        total: totalCount,
        pageSize: limit,
        offset,
      },
    };
  });

export const getHouseholdCrops = publicProcedure
  .input(householdEntitySchema)
  .query(async ({ ctx, input }) => {
    const building = await ctx.db
      .select()
      .from(KerabariAggregateBuilding)
      .where(
        sql`${KerabariAggregateBuilding.households} @> jsonb_build_array(jsonb_build_object('id', ${input.householdId}))`,
      )
      .limit(1);

    if (!building[0] || !building[0].households) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Household not found",
      });
    }

    const household = building[0].households.find(
      (h) => h.id === input.householdId,
    );

    if (!household || !household.crops) {
      return {
        data: [],
        totalCount: 0,
      };
    }

    const { limit, offset } = input;
    const totalCount = household.crops.length;
    const paginatedData = household.crops.slice(offset, offset + limit);

    return {
      data: paginatedData,
      pagination: {
        total: totalCount,
        pageSize: limit,
        offset,
      },
    };
  });

export const getHouseholdAnimals = publicProcedure
  .input(householdEntitySchema)
  .query(async ({ ctx, input }) => {
    const building = await ctx.db
      .select()
      .from(KerabariAggregateBuilding)
      .where(
        sql`${KerabariAggregateBuilding.households} @> jsonb_build_array(jsonb_build_object('id', ${input.householdId}))`,
      )
      .limit(1);

    if (!building[0] || !building[0].households) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Household not found",
      });
    }

    const household = building[0].households.find(
      (h) => h.id === input.householdId,
    );

    if (!household || !household.animals) {
      return {
        data: [],
        totalCount: 0,
      };
    }

    const { limit, offset } = input;
    const totalCount = household.animals.length;
    const paginatedData = household.animals.slice(offset, offset + limit);

    return {
      data: paginatedData,
      pagination: {
        total: totalCount,
        pageSize: limit,
        offset,
      },
    };
  });

export const getHouseholdLands = publicProcedure
  .input(householdEntitySchema)
  .query(async ({ ctx, input }) => {
    const building = await ctx.db
      .select()
      .from(KerabariAggregateBuilding)
      .where(
        sql`${KerabariAggregateBuilding.households} @> jsonb_build_array(jsonb_build_object('id', ${input.householdId}))`,
      )
      .limit(1);

    if (!building[0] || !building[0].households) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Household not found",
      });
    }

    const household = building[0].households.find(
      (h) => h.id === input.householdId,
    );

    if (!household || !household.agricultural_lands) {
      return {
        data: [],
        totalCount: 0,
      };
    }

    const { limit, offset } = input;
    const totalCount = household.agricultural_lands.length;
    const paginatedData = household.agricultural_lands.slice(
      offset,
      offset + limit,
    );

    return {
      data: paginatedData,
      pagination: {
        total: totalCount,
        pageSize: limit,
        offset,
      },
    };
  });

export const getHouseholdAnimalProducts = publicProcedure
  .input(householdEntitySchema)
  .query(async ({ ctx, input }) => {
    const building = await ctx.db
      .select()
      .from(KerabariAggregateBuilding)
      .where(
        sql`${KerabariAggregateBuilding.households} @> jsonb_build_array(jsonb_build_object('id', ${input.householdId}))`,
      )
      .limit(1);

    if (!building[0] || !building[0].households) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Household not found",
      });
    }

    const household = building[0].households.find(
      (h) => h.id === input.householdId,
    );

    if (!household || !household.animal_products) {
      return {
        data: [],
        totalCount: 0,
      };
    }

    const { limit, offset } = input;
    const totalCount = household.animal_products.length;
    const paginatedData = household.animal_products.slice(
      offset,
      offset + limit,
    );

    return {
      data: paginatedData,
      pagination: {
        total: totalCount,
        pageSize: limit,
        offset,
      },
    };
  });

export const getHouseholdDeaths = publicProcedure
  .input(householdEntitySchema)
  .query(async ({ ctx, input }) => {
    const building = await ctx.db
      .select()
      .from(KerabariAggregateBuilding)
      .where(
        sql`${KerabariAggregateBuilding.households} @> jsonb_build_array(jsonb_build_object('id', ${input.householdId}))`,
      )
      .limit(1);

    if (!building[0] || !building[0].households) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Household not found",
      });
    }

    const household = building[0].households.find(
      (h) => h.id === input.householdId,
    );

    if (!household || !household.deaths) {
      return {
        data: [],
        totalCount: 0,
      };
    }

    const { limit, offset } = input;
    const totalCount = household.deaths.length;
    const paginatedData = household.deaths.slice(offset, offset + limit);

    return {
      data: paginatedData,
      pagination: {
        total: totalCount,
        pageSize: limit,
        offset,
      },
    };
  });

export const getHouseholdAbsentees = publicProcedure
  .input(householdEntitySchema)
  .query(async ({ ctx, input }) => {
    const building = await ctx.db
      .select()
      .from(KerabariAggregateBuilding)
      .where(
        sql`${KerabariAggregateBuilding.households} @> jsonb_build_array(jsonb_build_object('id', ${input.householdId}))`,
      )
      .limit(1);

    if (!building[0] || !building[0].households) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Household not found",
      });
    }

    const household = building[0].households.find(
      (h) => h.id === input.householdId,
    );

    if (!household || !household.absentees) {
      return {
        data: [],
        totalCount: 0,
      };
    }

    const { limit, offset } = input;
    const totalCount = household.absentees.length;
    const paginatedData = household.absentees.slice(offset, offset + limit);

    return {
      data: paginatedData,
      pagination: {
        total: totalCount,
        pageSize: limit,
        offset,
      },
    };
  });
