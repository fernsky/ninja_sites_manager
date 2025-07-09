import { publicProcedure } from "@/server/api/trpc";
import { buildingQuerySchema } from "../building.schema";
import { buildings } from "@/server/db/schema/building";
import { surveyAttachments } from "@/server/db/schema";
import { and, eq, ilike, sql } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { env } from "@/env";

export const getAll = publicProcedure
  .input(buildingQuerySchema)
  .query(async ({ ctx, input }) => {
    const { limit, offset, sortBy, sortOrder, filters } = input;

    let conditions = sql`TRUE`;
    if (filters) {
      const filterConditions = [];
      if (filters.wardNumber) {
        filterConditions.push(eq(buildings.tmpWardNumber, filters.wardNumber));
      }
      if (filters.areaCode) {
        filterConditions.push(
          ilike(buildings.tmpAreaCode, `%${filters.areaCode}%`),
        );
      }
      if (filters.mapStatus) {
        filterConditions.push(eq(buildings.mapStatus, filters.mapStatus));
      }
      // Add enumerator filter
      if (filters.enumeratorId) {
        filterConditions.push(eq(buildings.enumeratorId, filters.enumeratorId));
      }
      // Add status filter
      if (filters.status) {
        filterConditions.push(eq(buildings.status, filters.status));
      }
      if (filterConditions.length > 0) {
        const andCondition = and(...filterConditions);
        if (andCondition) conditions = andCondition;
      }
    }

    const [data, totalCount] = await Promise.all([
      ctx.db
        .select()
        .from(buildings)
        .where(conditions)
        .orderBy(sql`${sql.identifier(sortBy)} ${sql.raw(sortOrder)}`)
        .limit(limit)
        .offset(offset),
      ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(buildings)
        .where(conditions)
        .then((result) => result[0].count),
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

export const getById = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    const building = await ctx.db
      .select()
      .from(buildings)
      .where(eq(buildings.id, input.id))
      .limit(1);

    const attachments = await ctx.db.query.surveyAttachments.findMany({
      where: eq(surveyAttachments.dataId, input.id),
    });

    if (!building[0]) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Building not found",
      });
    }

    try {
      // Process the attachments and create presigned URLs
      for (const attachment of attachments) {
        if (attachment.type === "building_image") {
          console.log("Fetching building image");
          building[0].buildingImage = await ctx.minio.presignedGetObject(
            env.BUCKET_NAME,
            attachment.name,
            24 * 60 * 60, // 24 hours expiry
          );
        }
        if (attachment.type === "building_selfie") {
          building[0].enumeratorSelfie = await ctx.minio.presignedGetObject(
            env.BUCKET_NAME,
            attachment.name,
            24 * 60 * 60,
          );
        }
        if (attachment.type === "audio_monitoring") {
          building[0].surveyAudioRecording = await ctx.minio.presignedGetObject(
            env.BUCKET_NAME,
            attachment.name,
            24 * 60 * 60,
          );
        }
      }
    } catch (error) {
      /*throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to generate presigned URLs",
        cause: error,
      });*/
      console.error(error);
    }

    return building[0];
  });

export const getByAreaCode = publicProcedure
  .input(z.object({ areaCode: z.string() }))
  .query(async ({ ctx, input }) => {
    const buildingDetails = await ctx.db
      .select({
        id: buildings.id,
        enumeratorName: buildings.enumeratorName,
        locality: buildings.locality,
        lat: sql<number>`ST_Y(${buildings.gps}::geometry)`,
        lng: sql<number>`ST_X(${buildings.gps}::geometry)`,
        gpsAccuracy: buildings.gpsAccuracy,
      })
      .from(buildings)
      .where(eq(buildings.tmpAreaCode, input.areaCode));

    return buildingDetails.map(building => ({
      id: building.id,
      type: "building",
      enumeratorName: building.enumeratorName,
      locality: building.locality,
      gpsPoint: building.lat && building.lng ? {
        lat: building.lat,
        lng: building.lng,
        accuracy: building.gpsAccuracy ?? 0
      } : null
    }));
  });

export const getByEnumeratorName = publicProcedure
  .input(z.object({ enumeratorName: z.string() }))
  .query(async ({ ctx, input }) => {
    const buildingDetails = await ctx.db
      .select({
        id: buildings.id,
        enumeratorName: buildings.enumeratorName,
        locality: buildings.locality,
        lat: sql<number>`ST_Y(${buildings.gps}::geometry)`,
        lng: sql<number>`ST_X(${buildings.gps}::geometry)`,
        gpsAccuracy: buildings.gpsAccuracy,
        areaCode: buildings.tmpAreaCode
      })
      .from(buildings)
      .where(ilike(buildings.enumeratorName, `%${input.enumeratorName}%`));

    return buildingDetails.map(building => ({
      id: building.id,
      type: "building",
      enumeratorName: building.enumeratorName,
      areaCode: building.areaCode,
      locality: building.locality,
      gpsPoint: building.lat && building.lng ? {
        lat: building.lat,
        lng: building.lng,
        accuracy: building.gpsAccuracy ?? 0
      } : null
    }));
  });

export const getAreaCodesByEnumeratorName = publicProcedure
  .input(z.object({ enumeratorName: z.string() }))
  .query(async ({ ctx, input }) => {
    const results = await ctx.db
      .selectDistinct({
        areaCode: buildings.tmpAreaCode,
      })
      .from(buildings)
      .where(
        and(
          eq(buildings.enumeratorName, input.enumeratorName),
          sql`${buildings.tmpAreaCode} IS NOT NULL`
        )
      )
      .orderBy(buildings.tmpAreaCode);

    return results.map(result => result.areaCode);
  });

export const getStats = publicProcedure.query(async ({ ctx }) => {
  const stats = await ctx.db
    .select({
      totalBuildings: sql<number>`count(*)`,
      totalFamilies: sql<number>`sum(${buildings.totalFamilies})`,
      avgBusinesses: sql<number>`avg(${buildings.totalBusinesses})`,
    })
    .from(buildings);

  return stats[0];
});

export const getEnumeratorNames = publicProcedure.query(async ({ ctx }) => {
  const results = await ctx.db
    .selectDistinct({
      enumeratorName: buildings.enumeratorName,
    })
    .from(buildings)
    .where(sql`${buildings.enumeratorName} IS NOT NULL`)
    .orderBy(buildings.enumeratorName);

  return results.map(result => result.enumeratorName);
});

export const getGpsByWard = publicProcedure
  .input(z.object({ wardNumber: z.string() }))
  .query(async ({ ctx, input }) => {
    const buildingPoints = await ctx.db
      .select({
        id: buildings.id,
        enumeratorName: buildings.enumeratorName,
        locality: buildings.locality,
        lat: sql<number>`ST_Y(${buildings.gps}::geometry)`,
        lng: sql<number>`ST_X(${buildings.gps}::geometry)`,
        gpsAccuracy: buildings.gpsAccuracy,
        areaCode: buildings.tmpAreaCode
      })
      .from(buildings)
      .where(
        and(
          eq(buildings.tmpWardNumber, parseInt(input.wardNumber, 10)),
          sql`${buildings.gps} IS NOT NULL`
        )
      );

    return buildingPoints.map(point => ({
      id: point.id,
      type: "building",
      enumeratorName: point.enumeratorName,
      areaCode: point.areaCode,
      locality: point.locality,
      gpsPoint: point.lat && point.lng ? {
        lat: point.lat,
        lng: point.lng,
        accuracy: point.gpsAccuracy ?? 0
      } : null
    }));
  });