import { publicProcedure } from "@/server/api/trpc";
import {
  businessByIdSchema,
  businessesByBuildingIdSchema,
  businessEntitySchema,
} from "../schemas/business-schema";
import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import { KerabariAggregateBuilding } from "@/server/db/schema/aggregate-building";
import { surveyAttachments } from "@/server/db/schema";
import { generateMediaUrls } from "../utils/media-utils";

export const getBusinessById = publicProcedure
  .input(businessByIdSchema)
  .query(async ({ ctx, input }) => {
    // Find the building containing this business
    const buildingQuery = await ctx.db
      .select({
        building: KerabariAggregateBuilding,
      })
      .from(KerabariAggregateBuilding)
      .where(
        sql`${KerabariAggregateBuilding.businesses} @> jsonb_build_array(jsonb_build_object('id', ${input.id}))`,
      )
      .limit(1);

    if (!buildingQuery[0]) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Business not found in any building",
      });
    }

    const building = buildingQuery[0].building;

    // Find the specific business in the businesses array
    const business = building.businesses?.find((b) => b.id === input.id);

    if (!business) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Business data not found",
      });
    }

    // Get attachments for this business
    const attachments = await ctx.db.query.surveyAttachments.findMany({
      where: eq(surveyAttachments.dataId, input.id),
    });

    // Generate media URLs
    const businessWithMedia = await generateMediaUrls(
      ctx.minio,
      business,
      attachments,
    );

    // Filter out data based on input parameters
    const result = { ...businessWithMedia };

    if (!input.includeCrops) {
      result.crops = undefined;
    }

    if (!input.includeAnimals) {
      result.animals = undefined;
    }

    if (!input.includeProducts) {
      result.animal_products = undefined;
    }

    return result;
  });

export const getBusinessesByBuildingId = publicProcedure
  .input(businessesByBuildingIdSchema)
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

    if (!building[0].businesses || building[0].businesses.length === 0) {
      return {
        data: [],
        totalCount: 0,
      };
    }

    // Return simplified business data
    const businessSummaries = building[0].businesses.map((b) => ({
      id: b.id,
      businessName: b.business_name,
      businessNature: b.business_nature,
      businessType: b.business_type,
      operatorName: b.operator_name,
      operatorPhone: b.operator_phone,
      wardNumber: b.ward_number,
      areaCode: b.area_code,
      locality: b.business_locality,
      surveyDate: b.business_survey_date,
      investmentAmount: b.investment_amount,
      registrationStatus: b.registration_status,
      totalEmployees:
        (b.total_permanent_employees || 0) +
        (b.total_temporary_employees || 0) +
        (b.total_involved_family || 0),
    }));

    return {
      data: businessSummaries,
      totalCount: businessSummaries.length,
    };
  });

export const getBusinessCrops = publicProcedure
  .input(businessEntitySchema)
  .query(async ({ ctx, input }) => {
    const building = await ctx.db
      .select()
      .from(KerabariAggregateBuilding)
      .where(
        sql`${KerabariAggregateBuilding.businesses} @> jsonb_build_array(jsonb_build_object('id', ${input.businessId}))`,
      )
      .limit(1);

    if (!building[0] || !building[0].businesses) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Business not found",
      });
    }

    const business = building[0].businesses.find(
      (b) => b.id === input.businessId,
    );

    if (!business || !business.crops) {
      return {
        data: [],
        totalCount: 0,
      };
    }

    const { limit, offset } = input;
    const totalCount = business.crops.length;
    const paginatedData = business.crops.slice(offset, offset + limit);

    return {
      data: paginatedData,
      pagination: {
        total: totalCount,
        pageSize: limit,
        offset,
      },
    };
  });

export const getBusinessAnimals = publicProcedure
  .input(businessEntitySchema)
  .query(async ({ ctx, input }) => {
    const building = await ctx.db
      .select()
      .from(KerabariAggregateBuilding)
      .where(
        sql`${KerabariAggregateBuilding.businesses} @> jsonb_build_array(jsonb_build_object('id', ${input.businessId}))`,
      )
      .limit(1);

    if (!building[0] || !building[0].businesses) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Business not found",
      });
    }

    const business = building[0].businesses.find(
      (b) => b.id === input.businessId,
    );

    if (!business || !business.animals) {
      return {
        data: [],
        totalCount: 0,
      };
    }

    const { limit, offset } = input;
    const totalCount = business.animals.length;
    const paginatedData = business.animals.slice(offset, offset + limit);

    return {
      data: paginatedData,
      pagination: {
        total: totalCount,
        pageSize: limit,
        offset,
      },
    };
  });

export const getBusinessAnimalProducts = publicProcedure
  .input(businessEntitySchema)
  .query(async ({ ctx, input }) => {
    const building = await ctx.db
      .select()
      .from(KerabariAggregateBuilding)
      .where(
        sql`${KerabariAggregateBuilding.businesses} @> jsonb_build_array(jsonb_build_object('id', ${input.businessId}))`,
      )
      .limit(1);

    if (!building[0] || !building[0].businesses) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Business not found",
      });
    }

    const business = building[0].businesses.find(
      (b) => b.id === input.businessId,
    );

    if (!business || !business.animal_products) {
      return {
        data: [],
        totalCount: 0,
      };
    }

    const { limit, offset } = input;
    const totalCount = business.animal_products.length;
    const paginatedData = business.animal_products.slice(
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
