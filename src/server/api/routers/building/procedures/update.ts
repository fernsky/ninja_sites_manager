import { publicProcedure } from "@/server/api/trpc";
import { updateBuildingSchema } from "../building.schema";
import { buildings } from "@/server/db/schema/building";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

export const update = publicProcedure
  .input(z.object({ id: z.string(), data: updateBuildingSchema }))
  .mutation(async ({ ctx, input }) => {
    const { id, data } = input;
    const { gps, areaId, buildingToken, ...restData } = data;

    const transformedData = {
      ...restData,
      surveyDate: restData.surveyDate
        ? new Date(restData.surveyDate)
        : undefined,
      gps: gps ? sql`ST_GeomFromText(${gps})` : undefined,
    };

    await ctx.db
      .update(buildings)
      .set(transformedData)
      .where(eq(buildings.id, id));

    return { success: true };
  });

export const deleteBuilding = publicProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    await ctx.db.delete(buildings).where(eq(buildings.id, input.id));

    return { success: true };
  });
