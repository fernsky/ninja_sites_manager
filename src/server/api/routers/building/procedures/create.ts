import { publicProcedure } from "@/server/api/trpc";
import { createBuildingSchema } from "../building.schema";
import { buildings } from "@/server/db/schema/building";
import { sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const create = publicProcedure
  .input(createBuildingSchema)
  .mutation(async ({ ctx, input }) => {
    const id = uuidv4();
    const { gps, altitude, gpsAccuracy, naturalDisasters, ...restInput } =
      input;
    await ctx.db.insert(buildings).values({
      ...restInput,
      id,
      surveyDate: new Date(input.surveyDate),
      gps: sql`ST_GeomFromText(${gps})`,
      naturalDisasters: Array.isArray(naturalDisasters)
        ? naturalDisasters
        : [naturalDisasters],
    });
    return { id };
  });
