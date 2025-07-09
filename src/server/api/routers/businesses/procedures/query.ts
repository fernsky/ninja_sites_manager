import { publicProcedure } from "@/server/api/trpc";
import { businessQuerySchema } from "../business.schema";
import { business } from "@/server/db/schema/business/business";
import { surveyAttachments } from "@/server/db/schema";
import { and, eq, sql, ilike } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { env } from "@/env";
import { businessAnimals } from "@/server/db/schema/business/business-animals";
import { businessAnimalProducts } from "@/server/db/schema/business/business-animal-products";
import { businessCrops } from "@/server/db/schema/business/business-crops";
import { BusinessResult } from "../types";

export const getAll = publicProcedure
  .input(businessQuerySchema)
  .query(async ({ ctx, input }) => {
    const { limit, offset, sortBy = "id", sortOrder = "desc", filters } = input;

    const validSortColumns = [
      "id",
      "businessNature",
      "businessType",
      "wardId",
      "status",
      "registrationNo",
    ];
    const actualSortBy = validSortColumns.includes(sortBy) ? sortBy : "id";

    let conditions = sql`TRUE`;
    if (filters) {
      const filterConditions = [];
      if (filters.wardId) {
        filterConditions.push(eq(business.wardId, filters.wardId));
      }
      if (filters.areaCode) {
        filterConditions.push(
          eq(business.areaCode, parseInt(filters.areaCode)),
        );
      }
      if (filters.enumeratorId) {
        filterConditions.push(eq(business.enumeratorId, filters.enumeratorId));
      }
      if (filters.status && filters.status !== "all") {
        filterConditions.push(eq(business.status, filters.status));
      }

      if (filterConditions.length > 0) {
        const andCondition = and(...filterConditions);
        if (andCondition) conditions = andCondition;
      }
    }

    const [data, totalCount] = await Promise.all([
      ctx.db
        .select()
        .from(business)
        .where(conditions)
        .orderBy(sql`${sql.identifier(actualSortBy)} ${sql.raw(sortOrder)}`)
        .limit(limit)
        .offset(offset),
      ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(business)
        .where(conditions)
        .then((result) => result[0].count),
    ]);
    console.log(filters, data);
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
    const businessEntity = await ctx.db
      .select()
      .from(business)
      .where(eq(business.id, input.id))
      .limit(1);
    const [businessAnimalsData, businessAnimalProductsData, businessCropsData] =
      await Promise.all([
        ctx.db
          .select()
          .from(businessAnimals)
          .where(eq(businessAnimals.businessId, input.id)),
        ctx.db
          .select()
          .from(businessAnimalProducts)
          .where(eq(businessAnimalProducts.businessId, input.id)),
        ctx.db
          .select()
          .from(businessCrops)
          .where(eq(businessCrops.businessId, input.id)),
      ]);

    if (!businessEntity[0]) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Business not found",
      });
    }

    const attachments = await ctx.db.query.surveyAttachments.findMany({
      where: eq(surveyAttachments.dataId, input.id),
    });

    try {
      // Process the attachments and create presigned URLs
      for (const attachment of attachments) {
        if (attachment.type === "business_image") {
          console.log("Fetching business image");
          businessEntity[0].businessImage = await ctx.minio.presignedGetObject(
            env.BUCKET_NAME,
            attachment.name,
            24 * 60 * 60, // 24 hours expiry
          );
        }
        if (attachment.type === "business_selfie") {
          businessEntity[0].enumeratorSelfie =
            await ctx.minio.presignedGetObject(
              env.BUCKET_NAME,
              attachment.name,
              24 * 60 * 60,
            );
        }
        if (attachment.type === "audio_monitoring") {
          businessEntity[0].surveyAudioRecording =
            await ctx.minio.presignedGetObject(
              env.BUCKET_NAME,
              attachment.name,
              24 * 60 * 60,
            );
        }
      }
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to generate presigned URLs",
        cause: error,
      });
    }

    const result: BusinessResult = {
      ...businessEntity[0],
      animals: businessAnimalsData,
      animalProducts: businessAnimalProductsData,
      crops: businessCropsData,
    };

    return result;
  });

  

export const getByAreaCode = publicProcedure
  .input(z.object({ areaCode: z.string() }))
  .query(async ({ ctx, input }) => {
    const businessDetails = await ctx.db
      .select({
        id: business.id,
        businessName: business.businessName,
        wardId: business.wardId,
        lat: sql<number>`ST_Y(${business.gps}::geometry)`,
        lng: sql<number>`ST_X(${business.gps}::geometry)`,
        gpsAccuracy: business.gpsAccuracy,
        enumeratorName: business.enumeratorName,  // Add this line
      })
      .from(business)
      .where(eq(business.areaCode, parseInt(input.areaCode)));

    return businessDetails.map(business => ({
      id: business.id,
      type:"business",
      name: business.businessName,
      wardNo: business.wardId?.toString(),
      enumeratorName: business.enumeratorName,  // Add this line
      gpsPoint: business.lat && business.lng ? {
        lat: business.lat,
        lng: business.lng,
        accuracy: business.gpsAccuracy ?? 0
      } : null
    }));
  });

export const getByEnumeratorName = publicProcedure
  .input(z.object({ enumeratorName: z.string() }))
  .query(async ({ ctx, input }) => {
    const businessDetails = await ctx.db
      .select({
        id: business.id,
        businessName: business.businessName,
        wardId: business.wardId,
        lat: sql<number>`ST_Y(${business.gps}::geometry)`,
        lng: sql<number>`ST_X(${business.gps}::geometry)`,
        gpsAccuracy: business.gpsAccuracy,
        enumeratorName: business.enumeratorName,
      })
      .from(business)
      .where(ilike(business.enumeratorName, `%${input.enumeratorName}%`));

    return businessDetails.map(business => ({
      id: business.id,
      type: "business",
      name: business.businessName,
      wardNo: business.wardId?.toString(),
      enumeratorName: business.enumeratorName,
      gpsPoint: business.lat && business.lng ? {
        lat: business.lat,
        lng: business.lng,
        accuracy: business.gpsAccuracy ?? 0
      } : null
    }));
  });

export const getStats = publicProcedure.query(async ({ ctx }) => {
  const stats = await ctx.db
    .select({
      totalBusinesses: sql<number>`count(*)`,
      avgInvestmentAmount: sql<number>`avg(${business.investmentAmount})`,
      totalEmployees: sql<number>`
        sum(
          coalesce(${business.totalPermanentEmployees}, 0) + 
          coalesce(${business.totalTemporaryEmployees}, 0) +
          coalesce(${business.totalInvolvedFamily}, 0)
        )
      `,
    })
    .from(business);

  return stats[0];
});

export const getEnumeratorNames = publicProcedure.query(async ({ ctx }) => {
  const results = await ctx.db
    .selectDistinct({
      enumeratorName: business.enumeratorName,
    })
    .from(business)
    .where(sql`${business.enumeratorName} IS NOT NULL`)
    .orderBy(business.enumeratorName);

  return results.map(result => result.enumeratorName);
});

export const getAreaCodesByEnumeratorName = publicProcedure
  .input(z.object({ enumeratorName: z.string() }))
  .query(async ({ ctx, input }) => {
    const results = await ctx.db
      .selectDistinct({
        areaCode: business.areaCode,
      })
      .from(business)
      .where(
        and(
          eq(business.enumeratorName, input.enumeratorName),
          sql`${business.areaCode} IS NOT NULL`
        )
      )
      .orderBy(business.areaCode);

    return results.map(result => result.areaCode);
  });

  export const getGpsByWard = publicProcedure
    .input(z.object({ wardId: z.number() }))
    .query(async ({ ctx, input }) => {
      const businessDetails = await ctx.db
        .select({
          id: business.id,
          businessName: business.businessName,
          wardId: business.wardId,
          lat: sql<number>`ST_Y(${business.gps}::geometry)`,
          lng: sql<number>`ST_X(${business.gps}::geometry)`,
          gpsAccuracy: business.gpsAccuracy,
          enumeratorName: business.enumeratorName,
        })
        .from(business)
        .where(eq(business.wardId, input.wardId));

      return businessDetails.map(business => ({
        id: business.id,
        type: "business",
        name: business.businessName,
        wardNo: business.wardId?.toString(),
        enumeratorName: business.enumeratorName,
        gpsPoint: business.lat && business.lng ? {
          lat: business.lat,
          lng: business.lng,
          accuracy: business.gpsAccuracy ?? 0
        } : null
      }));
    });