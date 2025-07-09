import { publicProcedure } from "@/server/api/trpc";
import {
  mapBoundsSchema,
  geoEntityByIdSchema,
  clusterIdSchema,
} from "../schemas/map-schema";
import { TRPCError } from "@trpc/server";
import { and, eq, sql, between } from "drizzle-orm";
import { KerabariAggregateBuilding } from "@/server/db/schema/aggregate-building";
import { generateMediaUrls } from "../utils/media-utils";
import { surveyAttachments } from "@/server/db/schema";

// Helper function to determine cluster ID from lat/lng at a given zoom level
function getClusterIdForPoint(lat: number, lng: number, zoom: number): string {
  // Simplistic clustering based on grid cells
  // For production, consider using geohash or a better clustering algorithm
  const precision = Math.pow(2, Math.min(zoom, 20) / 2);
  const latGrid = Math.floor(lat * precision);
  const lngGrid = Math.floor(lng * precision);
  return `${latGrid}_${lngGrid}_${zoom}`;
}

export const getMapEntities = publicProcedure
  .input(mapBoundsSchema)
  .query(async ({ ctx, input }) => {
    const {
      north,
      south,
      east,
      west,
      zoom,
      wardId,
      areaCode,
      enumeratorId,
      includeBuildings,
      includeHouseholds,
      includeBusinesses,
      mapStatus,
      limit,
    } = input;

    // Basic conditions for the query
    const conditions = [];

    // Apply bounding box filter for points that have valid coordinates
    // Use sql template literal to ensure proper casting and comparison
    conditions.push(sql`
      ${KerabariAggregateBuilding.building_gps_latitude}::numeric BETWEEN ${south.toString()}::numeric AND ${north.toString()}::numeric AND
      ${KerabariAggregateBuilding.building_gps_longitude}::numeric BETWEEN ${west.toString()}::numeric AND ${east.toString()}::numeric
    `);

    // Apply optional filters
    if (wardId) {
      conditions.push(
        eq(KerabariAggregateBuilding.ward_number, parseInt(wardId)),
      );
    }

    if (areaCode) {
      conditions.push(
        eq(KerabariAggregateBuilding.area_code, parseInt(areaCode)),
      );
    }

    if (enumeratorId) {
      conditions.push(
        eq(KerabariAggregateBuilding.enumerator_id, enumeratorId),
      );
    }

    if (mapStatus) {
      conditions.push(eq(KerabariAggregateBuilding.map_status, mapStatus));
    }

    // Execute the query with all conditions
    const buildingEntities = await ctx.db
      .select({
        id: KerabariAggregateBuilding.id,
        buildingId: KerabariAggregateBuilding.building_id,
        lat: KerabariAggregateBuilding.building_gps_latitude,
        lng: KerabariAggregateBuilding.building_gps_longitude,
        accuracy: KerabariAggregateBuilding.building_gps_accuracy,
        locality: KerabariAggregateBuilding.locality,
        wardNumber: KerabariAggregateBuilding.ward_number,
        areaCode: KerabariAggregateBuilding.area_code,
        ownerName: KerabariAggregateBuilding.building_owner_name,
        totalFamilies: KerabariAggregateBuilding.total_families,
        totalBusinesses: KerabariAggregateBuilding.total_businesses,
      })
      .from(KerabariAggregateBuilding)
      .where(and(...conditions))
      .orderBy(KerabariAggregateBuilding.created_at)
      .limit(limit);

    // Process the results into clusters or individual entities based on zoom level
    const clustersByClusterId = new Map<string, any>();
    const individualEntities: any[] = [];

    // If zoom level is high enough, display individual entities
    if (zoom >= 15) {
      buildingEntities.forEach((entity) => {
        if (!entity.lat || !entity.lng) return;

        // Process each entity based on the type filters
        individualEntities.push({
          id: entity.id,
          type: "building",
          position: { lat: Number(entity.lat), lng: Number(entity.lng) },
          properties: {
            title: entity.locality || `Building at ${entity.wardNumber}`,
            wardNumber: entity.wardNumber,
            areaCode: entity.areaCode,
            ownerName: entity.ownerName,
            totalFamilies: entity.totalFamilies,
            totalBusinesses: entity.totalBusinesses,
          },
        });
      });

      return {
        entities: individualEntities,
        clusters: [],
      };
    }
    // At lower zoom levels, create clusters
    else {
      buildingEntities.forEach((entity) => {
        if (!entity.lat || !entity.lng) return;

        const clusterId = getClusterIdForPoint(
          Number(entity.lat),
          Number(entity.lng),
          zoom,
        );

        if (!clustersByClusterId.has(clusterId)) {
          // Initialize a new cluster
          clustersByClusterId.set(clusterId, {
            id: clusterId,
            type: "cluster",
            position: { lat: Number(entity.lat), lng: Number(entity.lng) },
            count: 1,
            buildingCount: 1,
            householdCount: entity.totalFamilies || 0,
            businessCount: entity.totalBusinesses || 0,
            wardNumbers: new Set([entity.wardNumber]),
            bounds: {
              north: Number(entity.lat),
              south: Number(entity.lat),
              east: Number(entity.lng),
              west: Number(entity.lng),
            },
          });
        } else {
          // Update an existing cluster
          const cluster = clustersByClusterId.get(clusterId);
          cluster.count += 1;
          cluster.buildingCount += 1;
          cluster.householdCount += entity.totalFamilies || 0;
          cluster.businessCount += entity.totalBusinesses || 0;

          if (entity.wardNumber) {
            cluster.wardNumbers.add(entity.wardNumber);
          }

          // Update the cluster bounds
          if (Number(entity.lat) > cluster.bounds.north)
            cluster.bounds.north = Number(entity.lat);
          if (Number(entity.lat) < cluster.bounds.south)
            cluster.bounds.south = Number(entity.lat);
          if (Number(entity.lng) > cluster.bounds.east)
            cluster.bounds.east = Number(entity.lng);
          if (Number(entity.lng) < cluster.bounds.west)
            cluster.bounds.west = Number(entity.lng);

          // Recalculate the center position (average of all points)
          cluster.position.lat =
            (cluster.position.lat * (cluster.count - 1) + Number(entity.lat)) /
            cluster.count;
          cluster.position.lng =
            (cluster.position.lng * (cluster.count - 1) + Number(entity.lng)) /
            cluster.count;
        }
      });

      // Convert the clusters for the response
      const clusters = Array.from(clustersByClusterId.values()).map(
        (cluster) => ({
          ...cluster,
          wardNumbers: Array.from(cluster.wardNumbers),
        }),
      );

      return {
        entities: [],
        clusters,
      };
    }
  });

export const getMapEntityById = publicProcedure
  .input(geoEntityByIdSchema)
  .query(async ({ ctx, input }) => {
    const { id, type } = input;

    if (type === "building") {
      // Fetch the building data
      const building = await ctx.db
        .select()
        .from(KerabariAggregateBuilding)
        .where(eq(KerabariAggregateBuilding.id, id))
        .limit(1);

      if (!building[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Building not found",
        });
      }

      // Get attachments
      const attachments = await ctx.db.query.surveyAttachments.findMany({
        where: eq(surveyAttachments.dataId, id),
      });

      // Generate media URLs
      const buildingWithMedia = await generateMediaUrls(
        ctx.minio,
        building[0],
        attachments,
      );

      // Return a simplified version for the map popup
      return {
        id: buildingWithMedia.id,
        type: "building",
        position: {
          lat: Number(buildingWithMedia.building_gps_latitude),
          lng: Number(buildingWithMedia.building_gps_longitude),
        },
        properties: {
          title:
            buildingWithMedia.locality ||
            `Building at ${buildingWithMedia.ward_number}`,
          wardNumber: buildingWithMedia.ward_number,
          areaCode: buildingWithMedia.area_code,
          ownerName: buildingWithMedia.building_owner_name,
          totalFamilies: buildingWithMedia.total_families,
          totalBusinesses: buildingWithMedia.total_businesses,
          buildingImage: buildingWithMedia.buildingImage,
          enumeratorName: buildingWithMedia.enumerator_name,
        },
      };
    } else if (type === "household" || type === "business") {
      // Find the entity in the appropriate JSONB array of the building
      const jsonbField =
        type === "household"
          ? KerabariAggregateBuilding.households
          : KerabariAggregateBuilding.businesses;
      const conditionField = type === "household" ? "households" : "businesses";

      const buildingQuery = await ctx.db
        .select({
          building: KerabariAggregateBuilding,
        })
        .from(KerabariAggregateBuilding)
        .where(
          sql`${jsonbField} @> jsonb_build_array(jsonb_build_object('id', ${id}))`,
        )
        .limit(1);

      if (!buildingQuery[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `${type.charAt(0).toUpperCase() + type.slice(1)} not found in any building`,
        });
      }

      // Find the specific entity in the array
      const entity = buildingQuery[0].building[conditionField]?.find(
        (e: any) => e.id === id,
      );

      if (!entity) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `${type.charAt(0).toUpperCase() + type.slice(1)} data not found`,
        });
      }

      // Get attachments for this entity
      const attachments = await ctx.db.query.surveyAttachments.findMany({
        where: eq(surveyAttachments.dataId, id),
      });

      // Generate media URLs
      const entityWithMedia = await generateMediaUrls(
        ctx.minio,
        entity,
        attachments,
      );

      // Return entity data based on type
      if (type === "household") {
        return {
          id: entityWithMedia.id,
          type: "household",
          buildingId: buildingQuery[0].building.id,
          position: {
            lat: Number(entityWithMedia.household_gps_latitude),
            lng: Number(entityWithMedia.household_gps_longitude),
          },
          properties: {
            title: entityWithMedia.head_name || "Household",
            headName: entityWithMedia.head_name,
            headPhone: entityWithMedia.head_phone,
            wardNumber: entityWithMedia.ward_number,
            areaCode: entityWithMedia.area_code,
            locality: entityWithMedia.household_locality,
            totalMembers: entityWithMedia.total_members,
            familyImage: entityWithMedia.familyImage,
          },
        };
      } else {
        return {
          id: entityWithMedia.id,
          type: "business",
          buildingId: buildingQuery[0].building.id,
          position: {
            lat: Number(entityWithMedia.business_gps_latitude),
            lng: Number(entityWithMedia.business_gps_longitude),
          },
          properties: {
            title: entityWithMedia.business_name || "Business",
            businessName: entityWithMedia.business_name,
            businessType: entityWithMedia.business_type,
            operatorName: entityWithMedia.operator_name,
            operatorPhone: entityWithMedia.operator_phone,
            wardNumber: entityWithMedia.ward_number,
            areaCode: entityWithMedia.area_code,
            investmentAmount: entityWithMedia.investment_amount,
            businessImage: entityWithMedia.businessImage,
          },
        };
      }
    }

    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid entity type specified",
    });
  });

export const getClusterPoints = publicProcedure
  .input(clusterIdSchema)
  .query(async ({ ctx, input }) => {
    const { clusterId, zoom, limit } = input;

    // Parse the cluster ID to get the grid cell coordinates
    const [latGrid, lngGrid, clusterZoom] = clusterId.split("_").map(Number);

    if (isNaN(latGrid) || isNaN(lngGrid) || isNaN(clusterZoom)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid cluster ID format",
      });
    }

    // Calculate the bounds of the grid cell
    const precision = Math.pow(2, clusterZoom / 2);
    const latMin = latGrid / precision;
    const latMax = (latGrid + 1) / precision;
    const lngMin = lngGrid / precision;
    const lngMax = (lngGrid + 1) / precision;

    // Query buildings that fall within these bounds - using SQL for proper numeric comparison
    const buildingEntities = await ctx.db
      .select({
        id: KerabariAggregateBuilding.id,
        lat: KerabariAggregateBuilding.building_gps_latitude,
        lng: KerabariAggregateBuilding.building_gps_longitude,
        locality: KerabariAggregateBuilding.locality,
        wardNumber: KerabariAggregateBuilding.ward_number,
        areaCode: KerabariAggregateBuilding.area_code,
        ownerName: KerabariAggregateBuilding.building_owner_name,
        totalFamilies: KerabariAggregateBuilding.total_families,
        totalBusinesses: KerabariAggregateBuilding.total_businesses,
      })
      .from(KerabariAggregateBuilding)
      .where(
        sql`
          ${KerabariAggregateBuilding.building_gps_latitude}::numeric BETWEEN ${latMin.toString()}::numeric AND ${latMax.toString()}::numeric AND
          ${KerabariAggregateBuilding.building_gps_longitude}::numeric BETWEEN ${lngMin.toString()}::numeric AND ${lngMax.toString()}::numeric
        `,
      )
      .limit(limit);

    // Format the response
    const points = buildingEntities.map((entity) => ({
      id: entity.id,
      type: "building",
      position: { lat: Number(entity.lat), lng: Number(entity.lng) },
      properties: {
        title: entity.locality || `Building at ${entity.wardNumber}`,
        wardNumber: entity.wardNumber,
        areaCode: entity.areaCode,
        ownerName: entity.ownerName,
        totalFamilies: entity.totalFamilies,
        totalBusinesses: entity.totalBusinesses,
      },
    }));

    return {
      clusterId,
      points,
      total: points.length,
      hasMore: points.length === limit,
    };
  });
