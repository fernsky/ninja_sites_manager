import { publicProcedure } from "@/server/api/trpc";
import {
  buildingQuerySchema,
  buildingByIdSchema,
  buildingsByWardSchema,
  buildingsByAreaCodeSchema,
  buildingsByEnumeratorSchema,
} from "../schemas/building-schema";
import { TRPCError } from "@trpc/server";
import { and, eq, ilike, sql } from "drizzle-orm";
import { KerabariAggregateBuilding } from "@/server/db/schema/aggregate-building";
import { env } from "@/env";
import { surveyAttachments } from "@/server/db/schema";
import { generateMediaUrls } from "../utils/media-utils";

export const getAllBuildings = publicProcedure
  .input(buildingQuerySchema)
  .query(async ({ ctx, input }) => {
    const { limit, offset, sortBy, sortOrder, filters } = input;

    let conditions = sql`TRUE`;
    if (filters) {
      const filterConditions = [];

      if (filters.wardId) {
        filterConditions.push(
          eq(KerabariAggregateBuilding.ward_number, parseInt(filters.wardId)),
        );
      }

      if (filters.areaCode) {
        filterConditions.push(
          eq(KerabariAggregateBuilding.area_code, parseInt(filters.areaCode)),
        );
      }

      if (filters.enumeratorId) {
        filterConditions.push(
          eq(KerabariAggregateBuilding.enumerator_id, filters.enumeratorId),
        );
      }

      if (filters.mapStatus) {
        filterConditions.push(
          eq(KerabariAggregateBuilding.map_status, filters.mapStatus),
        );
      }

      if (filters.buildingOwnership) {
        filterConditions.push(
          eq(
            KerabariAggregateBuilding.building_ownership_status,
            filters.buildingOwnership,
          ),
        );
      }

      if (filters.buildingBase) {
        filterConditions.push(
          eq(KerabariAggregateBuilding.building_base, filters.buildingBase),
        );
      }

      if (filters.hasHouseholds !== undefined) {
        if (filters.hasHouseholds) {
          filterConditions.push(
            sql`jsonb_array_length(${KerabariAggregateBuilding.households}) > 0`,
          );
        } else {
          filterConditions.push(
            sql`(${KerabariAggregateBuilding.households} IS NULL OR jsonb_array_length(${KerabariAggregateBuilding.households}) = 0)`,
          );
        }
      }

      if (filters.hasBusinesses !== undefined) {
        if (filters.hasBusinesses) {
          filterConditions.push(
            sql`jsonb_array_length(${KerabariAggregateBuilding.businesses}) > 0`,
          );
        } else {
          filterConditions.push(
            sql`(${KerabariAggregateBuilding.businesses} IS NULL OR jsonb_array_length(${KerabariAggregateBuilding.businesses}) = 0)`,
          );
        }
      }

      if (filters.fromDate && filters.toDate) {
        filterConditions.push(
          sql`${KerabariAggregateBuilding.building_survey_date} BETWEEN ${filters.fromDate}::timestamp AND ${filters.toDate}::timestamp`,
        );
      }

      if (filters.searchTerm) {
        filterConditions.push(
          sql`(
            ${ilike(KerabariAggregateBuilding.locality, `%${filters.searchTerm}%`)} OR
            ${ilike(KerabariAggregateBuilding.building_owner_name, `%${filters.searchTerm}%`)} OR
            ${ilike(KerabariAggregateBuilding.enumerator_name, `%${filters.searchTerm}%`)}
          )`,
        );
      }

      if (filterConditions.length > 0) {
        const andCondition = and(...filterConditions);
        if (andCondition) conditions = andCondition;
      }
    }

    const validSortColumns = [
      "id",
      "building_survey_date",
      "ward_number",
      "area_code",
      "locality",
      "total_families",
      "total_businesses",
      "enumerator_name",
      "created_at",
    ];
    const actualSortBy = validSortColumns.includes(sortBy)
      ? sortBy
      : "created_at";

    const [data, totalCount] = await Promise.all([
      ctx.db
        .select({
          id: KerabariAggregateBuilding.id,
          buildingId: KerabariAggregateBuilding.building_id,
          surveyed_at: KerabariAggregateBuilding.building_survey_date,
          wardNumber: KerabariAggregateBuilding.ward_number,
          areaCode: KerabariAggregateBuilding.area_code,
          locality: KerabariAggregateBuilding.locality,
          ownerName: KerabariAggregateBuilding.building_owner_name,
          enumeratorName: KerabariAggregateBuilding.enumerator_name,
          totalFamilies: KerabariAggregateBuilding.total_families,
          totalBusinesses: KerabariAggregateBuilding.total_businesses,
          mapStatus: KerabariAggregateBuilding.map_status,
          created_at: KerabariAggregateBuilding.created_at,
        })
        .from(KerabariAggregateBuilding)
        .where(conditions)
        .orderBy(sql`${sql.identifier(actualSortBy)} ${sql.raw(sortOrder)}`)
        .limit(limit)
        .offset(offset),

      ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(KerabariAggregateBuilding)
        .where(conditions)
        .then((result) => result[0]?.count || 0),
    ]);

    return {
      data,
      pagination: {
        total: totalCount,
        pageSize: limit,
        offset,
      },
    };
  });

export const getBuildingById = publicProcedure
  .input(buildingByIdSchema)
  .query(async ({ ctx, input }) => {
    const building = await ctx.db
      .select()
      .from(KerabariAggregateBuilding)
      .where(eq(KerabariAggregateBuilding.id, input.id))
      .limit(1);

    if (!building[0]) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Building not found",
      });
    }

    const buildingData = building[0];

    // Get attachments
    const attachments = await ctx.db.query.surveyAttachments.findMany({
      where: eq(surveyAttachments.dataId, input.id),
    });

    // Generate media URLs
    const buildingWithMedia = await generateMediaUrls(
      ctx.minio,
      buildingData,
      attachments,
    );

    // Conditionally include or exclude households/businesses
    if (!input.includeHouseholds) {
      buildingWithMedia.households = null;
    }

    if (!input.includeBusinesses) {
      buildingWithMedia.businesses = null;
    }

    return buildingWithMedia;
  });

export const getBuildingsByWard = publicProcedure
  .input(buildingsByWardSchema)
  .query(async ({ ctx, input }) => {
    const { wardId, limit, offset } = input;

    const [data, totalCount] = await Promise.all([
      ctx.db
        .select({
          id: KerabariAggregateBuilding.id,
          locality: KerabariAggregateBuilding.locality,
          areaCode: KerabariAggregateBuilding.area_code,
          ownerName: KerabariAggregateBuilding.building_owner_name,
          totalFamilies: KerabariAggregateBuilding.total_families,
          totalBusinesses: KerabariAggregateBuilding.total_businesses,
          lat: KerabariAggregateBuilding.building_gps_latitude,
          lng: KerabariAggregateBuilding.building_gps_longitude,
        })
        .from(KerabariAggregateBuilding)
        .where(eq(KerabariAggregateBuilding.ward_number, parseInt(wardId)))
        .orderBy(KerabariAggregateBuilding.area_code)
        .limit(limit)
        .offset(offset),

      ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(KerabariAggregateBuilding)
        .where(eq(KerabariAggregateBuilding.ward_number, parseInt(wardId)))
        .then((result) => result[0]?.count || 0),
    ]);

    return {
      data,
      pagination: {
        total: totalCount,
        pageSize: limit,
        offset,
      },
    };
  });

export const getBuildingsByAreaCode = publicProcedure
  .input(buildingsByAreaCodeSchema)
  .query(async ({ ctx, input }) => {
    const { areaCode, limit, offset } = input;

    const [data, totalCount] = await Promise.all([
      ctx.db
        .select({
          id: KerabariAggregateBuilding.id,
          locality: KerabariAggregateBuilding.locality,
          wardNumber: KerabariAggregateBuilding.ward_number,
          ownerName: KerabariAggregateBuilding.building_owner_name,
          lat: KerabariAggregateBuilding.building_gps_latitude,
          lng: KerabariAggregateBuilding.building_gps_longitude,
          gpsAccuracy: KerabariAggregateBuilding.building_gps_accuracy,
          totalFamilies: KerabariAggregateBuilding.total_families,
          totalBusinesses: KerabariAggregateBuilding.total_businesses,
        })
        .from(KerabariAggregateBuilding)
        .where(eq(KerabariAggregateBuilding.area_code, parseInt(areaCode)))
        .limit(limit)
        .offset(offset),

      ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(KerabariAggregateBuilding)
        .where(eq(KerabariAggregateBuilding.area_code, parseInt(areaCode)))
        .then((result) => result[0]?.count || 0),
    ]);

    return {
      data: data.map((building) => ({
        id: building.id,
        type: "aggregate_building",
        locality: building.locality,
        wardNumber: building.wardNumber?.toString(),
        ownerName: building.ownerName,
        totalFamilies: building.totalFamilies,
        totalBusinesses: building.totalBusinesses,
        gpsPoint:
          building.lat && building.lng
            ? {
                lat: Number(building.lat),
                lng: Number(building.lng),
                accuracy: Number(building.gpsAccuracy) || 0,
              }
            : null,
      })),
      pagination: {
        total: totalCount,
        pageSize: limit,
        offset,
      },
    };
  });

export const getBuildingsByEnumerator = publicProcedure
  .input(buildingsByEnumeratorSchema)
  .query(async ({ ctx, input }) => {
    const { enumeratorId, enumeratorName, limit, offset } = input;

    let condition = sql`TRUE`;
    if (enumeratorId) {
      condition = eq(KerabariAggregateBuilding.enumerator_id, enumeratorId);
    } else if (enumeratorName) {
      condition = ilike(
        KerabariAggregateBuilding.enumerator_name,
        `%${enumeratorName}%`,
      );
    }

    const [data, totalCount] = await Promise.all([
      ctx.db
        .select({
          id: KerabariAggregateBuilding.id,
          wardNumber: KerabariAggregateBuilding.ward_number,
          areaCode: KerabariAggregateBuilding.area_code,
          locality: KerabariAggregateBuilding.locality,
          ownerName: KerabariAggregateBuilding.building_owner_name,
          surveyDate: KerabariAggregateBuilding.building_survey_date,
          totalFamilies: KerabariAggregateBuilding.total_families,
          totalBusinesses: KerabariAggregateBuilding.total_businesses,
        })
        .from(KerabariAggregateBuilding)
        .where(condition)
        .orderBy(KerabariAggregateBuilding.building_survey_date)
        .limit(limit)
        .offset(offset),

      ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(KerabariAggregateBuilding)
        .where(condition)
        .then((result) => result[0]?.count || 0),
    ]);

    return {
      data,
      pagination: {
        total: totalCount,
        pageSize: limit,
        offset,
      },
    };
  });

export const getBuildingStats = publicProcedure.query(async ({ ctx }) => {
  const stats = await ctx.db
    .select({
      totalBuildings: sql<number>`count(*)`,
      totalHouseholds: sql<number>`sum(case when jsonb_array_length(${KerabariAggregateBuilding.households}) > 0 then ${KerabariAggregateBuilding.total_families} else 0 end)`,
      totalBusinesses: sql<number>`sum(case when jsonb_array_length(${KerabariAggregateBuilding.businesses}) > 0 then ${KerabariAggregateBuilding.total_businesses} else 0 end)`,
      avgFamiliesPerBuilding: sql<number>`avg(${KerabariAggregateBuilding.total_families})`,
    })
    .from(KerabariAggregateBuilding);

  return stats[0];
});

export const getAllBuildingsInfinite = publicProcedure
  .input(buildingQuerySchema)
  .query(async ({ ctx, input }) => {
    const { limit, offset, sortBy, sortOrder, filters } = input;

    let conditions = sql`TRUE`;
    if (filters) {
      const filterConditions = [];

      if (filters.wardId) {
        filterConditions.push(
          eq(KerabariAggregateBuilding.ward_number, parseInt(filters.wardId)),
        );
      }

      if (filters.areaCode) {
        filterConditions.push(
          eq(KerabariAggregateBuilding.area_code, parseInt(filters.areaCode)),
        );
      }

      if (filters.enumeratorId) {
        filterConditions.push(
          eq(KerabariAggregateBuilding.enumerator_id, filters.enumeratorId),
        );
      }

      if (filters.mapStatus) {
        filterConditions.push(
          eq(KerabariAggregateBuilding.map_status, filters.mapStatus),
        );
      }

      if (filters.buildingOwnership) {
        filterConditions.push(
          eq(
            KerabariAggregateBuilding.building_ownership_status,
            filters.buildingOwnership,
          ),
        );
      }

      if (filters.buildingBase) {
        filterConditions.push(
          eq(KerabariAggregateBuilding.building_base, filters.buildingBase),
        );
      }

      if (filters.hasHouseholds !== undefined) {
        if (filters.hasHouseholds) {
          filterConditions.push(
            sql`jsonb_array_length(${KerabariAggregateBuilding.households}) > 0`,
          );
        } else {
          filterConditions.push(
            sql`(${KerabariAggregateBuilding.households} IS NULL OR jsonb_array_length(${KerabariAggregateBuilding.households}) = 0)`,
          );
        }
      }

      if (filters.hasBusinesses !== undefined) {
        if (filters.hasBusinesses) {
          filterConditions.push(
            sql`jsonb_array_length(${KerabariAggregateBuilding.businesses}) > 0`,
          );
        } else {
          filterConditions.push(
            sql`(${KerabariAggregateBuilding.businesses} IS NULL OR jsonb_array_length(${KerabariAggregateBuilding.businesses}) = 0)`,
          );
        }
      }

      if (filters.fromDate && filters.toDate) {
        filterConditions.push(
          sql`${KerabariAggregateBuilding.building_survey_date} BETWEEN ${filters.fromDate}::timestamp AND ${filters.toDate}::timestamp`,
        );
      }

      if (filters.searchTerm) {
        filterConditions.push(
          sql`(
            ${ilike(KerabariAggregateBuilding.locality, `%${filters.searchTerm}%`)} OR
            ${ilike(KerabariAggregateBuilding.building_owner_name, `%${filters.searchTerm}%`)} OR
            ${ilike(KerabariAggregateBuilding.enumerator_name, `%${filters.searchTerm}%`)}
          )`,
        );
      }

      if (filterConditions.length > 0) {
        const andCondition = and(...filterConditions);
        if (andCondition) conditions = andCondition;
      }
    }

    const validSortColumns = [
      "id",
      "building_survey_date",
      "ward_number",
      "area_code",
      "locality",
      "total_families",
      "total_businesses",
      "enumerator_name",
      "created_at",
      "building_id",
      "building_owner_name",
      "map_status",
    ];
    const actualSortBy = validSortColumns.includes(sortBy)
      ? sortBy
      : "created_at";

    const [data, totalCount] = await Promise.all([
      ctx.db
        .select({
          id: KerabariAggregateBuilding.id,
          buildingId: KerabariAggregateBuilding.building_id,
          surveyed_at: KerabariAggregateBuilding.building_survey_date,
          wardNumber: KerabariAggregateBuilding.ward_number,
          areaCode: KerabariAggregateBuilding.area_code,
          locality: KerabariAggregateBuilding.locality,
          ownerName: KerabariAggregateBuilding.building_owner_name,
          enumeratorName: KerabariAggregateBuilding.enumerator_name,
          totalFamilies: KerabariAggregateBuilding.total_families,
          totalBusinesses: KerabariAggregateBuilding.total_businesses,
          mapStatus: KerabariAggregateBuilding.map_status,
          created_at: KerabariAggregateBuilding.created_at,
        })
        .from(KerabariAggregateBuilding)
        .where(conditions)
        .orderBy(sql`${sql.identifier(actualSortBy)} ${sql.raw(sortOrder)}`)
        .limit(limit)
        .offset(offset),

      ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(KerabariAggregateBuilding)
        .where(conditions)
        .then((result) => result[0]?.count || 0),
    ]);

    return {
      data,
      pagination: {
        total: totalCount,
        pageSize: limit,
        offset,
      },
    };
  });

export const getAggregatedBuildingData = publicProcedure
  .input(buildingQuerySchema)
  .query(async ({ ctx, input }) => {
    const { limit, offset, sortBy, sortOrder, filters } = input;

    // Apply the same filtering logic as in getAllBuildingsInfinite
    let conditions = sql`TRUE`;
    if (filters) {
      const filterConditions = [];

      if (filters.wardId) {
        filterConditions.push(
          eq(KerabariAggregateBuilding.ward_number, parseInt(filters.wardId)),
        );
      }

      if (filters.areaCode) {
        filterConditions.push(
          eq(KerabariAggregateBuilding.area_code, parseInt(filters.areaCode)),
        );
      }

      if (filters.enumeratorId) {
        filterConditions.push(
          eq(KerabariAggregateBuilding.enumerator_id, filters.enumeratorId),
        );
      }

      if (filters.mapStatus) {
        filterConditions.push(
          eq(KerabariAggregateBuilding.map_status, filters.mapStatus),
        );
      }

      if (filters.buildingOwnership) {
        filterConditions.push(
          eq(
            KerabariAggregateBuilding.building_ownership_status,
            filters.buildingOwnership,
          ),
        );
      }

      if (filters.buildingBase) {
        filterConditions.push(
          eq(KerabariAggregateBuilding.building_base, filters.buildingBase),
        );
      }

      if (filters.hasHouseholds !== undefined) {
        if (filters.hasHouseholds) {
          filterConditions.push(
            sql`jsonb_array_length(${KerabariAggregateBuilding.households}) > 0`,
          );
        } else {
          filterConditions.push(
            sql`(${KerabariAggregateBuilding.households} IS NULL OR jsonb_array_length(${KerabariAggregateBuilding.households}) = 0)`,
          );
        }
      }

      if (filters.hasBusinesses !== undefined) {
        if (filters.hasBusinesses) {
          filterConditions.push(
            sql`jsonb_array_length(${KerabariAggregateBuilding.businesses}) > 0`,
          );
        } else {
          filterConditions.push(
            sql`(${KerabariAggregateBuilding.businesses} IS NULL OR jsonb_array_length(${KerabariAggregateBuilding.businesses}) = 0)`,
          );
        }
      }

      if (filters.fromDate && filters.toDate) {
        filterConditions.push(
          sql`${KerabariAggregateBuilding.building_survey_date} BETWEEN ${filters.fromDate}::timestamp AND ${filters.toDate}::timestamp`,
        );
      }

      if (filters.searchTerm) {
        filterConditions.push(
          sql`(
            ${ilike(KerabariAggregateBuilding.locality, `%${filters.searchTerm}%`)} OR
            ${ilike(KerabariAggregateBuilding.building_owner_name, `%${filters.searchTerm}%`)} OR
            ${ilike(KerabariAggregateBuilding.enumerator_name, `%${filters.searchTerm}%`)}
          )`,
        );
      }

      if (filterConditions.length > 0) {
        const andCondition = and(...filterConditions);
        if (andCondition) conditions = andCondition;
      }
    }

    // Query the buildings with all their nested data
    const buildingsWithNestedData = await ctx.db
      .select()
      .from(KerabariAggregateBuilding)
      .where(conditions)
      .orderBy(sql`${sql.identifier(sortBy)} ${sql.raw(sortOrder)}`)
      .limit(limit)
      .offset(offset);

    // Get the total count for pagination
    const totalCount = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(KerabariAggregateBuilding)
      .where(conditions)
      .then((result) => result[0]?.count || 0);

    // Process the data to generate media URLs and flatten the structure
    const processedData = await Promise.all(
      buildingsWithNestedData.map(async (building) => {
        // Get attachments for this building
        const buildingAttachments =
          await ctx.db.query.surveyAttachments.findMany({
            where: eq(surveyAttachments.dataId, building.id),
          });

        // Generate media URLs for the building
        const buildingWithMedia = await generateMediaUrls(
          ctx.minio,
          building,
          buildingAttachments,
        );

        // Process households if they exist
        const households = await Promise.all(
          (building.households || []).map(async (household) => {
            // Get attachments for this household
            const householdAttachments =
              await ctx.db.query.surveyAttachments.findMany({
                where: eq(surveyAttachments.dataId, household.id),
              });

            // Generate media URLs for the household
            const householdWithMedia = await generateMediaUrls(
              ctx.minio,
              household,
              householdAttachments,
            );

            return householdWithMedia;
          }),
        );

        // Process businesses if they exist
        const businesses = await Promise.all(
          (building.businesses || []).map(async (business) => {
            // Get attachments for this business
            const businessAttachments =
              await ctx.db.query.surveyAttachments.findMany({
                where: eq(surveyAttachments.dataId, business.id),
              });

            // Generate media URLs for the business
            const businessWithMedia = await generateMediaUrls(
              ctx.minio,
              business,
              businessAttachments,
            );

            return businessWithMedia;
          }),
        );

        // Return the complete data structure
        return {
          ...buildingWithMedia,
          households: households,
          businesses: businesses,
        };
      }),
    );

    return {
      data: processedData,
      pagination: {
        total: totalCount,
        pageSize: limit,
        offset,
      },
    };
  });
