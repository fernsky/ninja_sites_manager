import { sql } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { and, count, eq } from "drizzle-orm";
import KerabariAgriculturalLand from "@/server/db/schema/family/agricultural-lands";
import { KerabariCrop } from "@/server/db/schema/family/crops";
import { KerabariAnimal } from "@/server/db/schema/family/animals";
import { KerabariAnimalProduct } from "@/server/db/schema/family/animal-products";

export const getAgriculturalLandStats = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        ownershipType: KerabariAgriculturalLand.landOwnershipType,
        totalArea: sql<number>`sum(${KerabariAgriculturalLand.landArea})::float`,
        count: sql<number>`count(*)::int`,
      })
      .from(KerabariAgriculturalLand);

    if (input.wardNumber) {
      query.where(eq(KerabariAgriculturalLand.wardNo, input.wardNumber));
    }

    return await query.groupBy(KerabariAgriculturalLand.landOwnershipType);
  });

export const getIrrigationStats = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        isIrrigated: KerabariAgriculturalLand.isLandIrrigated,
        totalArea: sql<number>`sum(${KerabariAgriculturalLand.irrigatedLandArea})::float`,
        count: sql<number>`count(*)::int`,
      })
      .from(KerabariAgriculturalLand);

    if (input.wardNumber) {
      query.where(eq(KerabariAgriculturalLand.wardNo, input.wardNumber));
    }

    return await query.groupBy(KerabariAgriculturalLand.isLandIrrigated);
  });

export const getCropStats = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        cropType: KerabariCrop.cropType,
        cropName: KerabariCrop.cropName,
        totalArea: sql<number>`sum(${KerabariCrop.cropArea})::float`,
        totalProduction: sql<number>`sum(${KerabariCrop.cropProduction})::float`,
        totalRevenue: sql<number>`sum(${KerabariCrop.cropRevenue})::float`,
        count: sql<number>`count(*)::int`,
      })
      .from(KerabariCrop);

    if (input.wardNumber) {
      query.where(eq(KerabariCrop.wardNo, input.wardNumber));
    }

    return await query.groupBy(KerabariCrop.cropType, KerabariCrop.cropName);
  });

export const getAnimalStats = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        animalName: KerabariAnimal.animalName,
        totalCount: sql<number>`sum(${KerabariAnimal.totalAnimals})::int`,
        totalSales: sql<number>`sum(${KerabariAnimal.animalSales})::float`,
        totalRevenue: sql<number>`sum(${KerabariAnimal.animalRevenue})::float`,
        householdCount: sql<number>`count(*)::int`,
      })
      .from(KerabariAnimal);

    if (input.wardNumber) {
      query.where(eq(KerabariAnimal.wardNo, input.wardNumber));
    }

    return await query.groupBy(KerabariAnimal.animalName);
  });

export const getAnimalProductStats = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        productName: KerabariAnimalProduct.animalProductName,
        unit: KerabariAnimalProduct.animalProductUnit,
        totalProduction: sql<number>`sum(${KerabariAnimalProduct.animalProductProduction})::float`,
        totalSales: sql<number>`sum(${KerabariAnimalProduct.animalProductSales})::float`,
        totalRevenue: sql<number>`sum(${KerabariAnimalProduct.animalProductRevenue})::float`,
        householdCount: sql<number>`count(*)::int`,
      })
      .from(KerabariAnimalProduct);

    if (input.wardNumber) {
      query.where(eq(KerabariAnimalProduct.wardNo, input.wardNumber));
    }

    return await query.groupBy(
      KerabariAnimalProduct.animalProductName,
      KerabariAnimalProduct.animalProductUnit
    );
  });

export const getAgriculturalLandOverview = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        totalLandArea: sql<number>`sum(${KerabariAgriculturalLand.landArea})::float`,
        totalIrrigatedArea: sql<number>`sum(${KerabariAgriculturalLand.irrigatedLandArea})::float`,
        householdCount: sql<number>`count(distinct ${KerabariAgriculturalLand.familyId})::int`,
      })
      .from(KerabariAgriculturalLand);

    if (input.wardNumber) {
      query.where(eq(KerabariAgriculturalLand.wardNo, input.wardNumber));
    }

    return (await query)[0];
  });

export const getAgricultureOverview = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const baseWhere = input.wardNumber
      ? sql`ward_no = ${input.wardNumber}`
      : sql`1=1`;

    const [crops, animals, products] = await Promise.all([
      ctx.db.execute(sql`
        SELECT 
          COUNT(DISTINCT family_id)::int as total_households,
          SUM(crop_revenue)::float as total_revenue,
          SUM(crop_area)::float as total_area
        FROM ${KerabariCrop}
        WHERE ${baseWhere}
      `),
      ctx.db.execute(sql`
        SELECT 
          COUNT(DISTINCT family_id)::int as total_households,
          SUM(animal_revenue)::float as total_revenue,
          SUM(total_animals)::int as total_count
        FROM ${KerabariAnimal}
        WHERE ${baseWhere}
      `),
      ctx.db.execute(sql`
        SELECT 
          COUNT(DISTINCT family_id)::int as total_households,
          SUM(animal_product_revenue)::float as total_revenue
        FROM ${KerabariAnimalProduct}
        WHERE ${baseWhere}
      `),
    ]);

    return {
      crops: crops[0],
      animals: animals[0],
      animalProducts: products[0],
    };
  });
