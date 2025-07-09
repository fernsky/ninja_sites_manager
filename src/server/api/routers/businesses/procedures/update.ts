import { publicProcedure } from "@/server/api/trpc";
import { updateBusinessSchema } from "../business.schema";
import {
  business,
  businessEditRequests,
} from "@/server/db/schema/business/business";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const update = publicProcedure
  .input(z.object({ id: z.string(), data: updateBusinessSchema }))
  .mutation(async ({ ctx, input }) => {
    const { id, data } = input;
    const { gps, areaId, buildingToken, registeredBodies, ...restData } = data;

    const transformedData = {
      ...Object.fromEntries(
        Object.entries(restData).map(([key, value]) => [
          key,
          typeof value === "number" ? value.toString() : value,
        ]),
      ),
      gps: gps ? sql`ST_GeomFromText(${gps})` : undefined,
      altitude: restData.altitude?.toString() ?? null,
      gpsAccuracy: restData.gpsAccuracy?.toString() ?? null,
      investmentAmount:
        typeof restData.investmentAmount === "number"
          ? restData.investmentAmount.toString()
          : null,
      registeredBodies: registeredBodies
        ? Array.isArray(registeredBodies)
          ? registeredBodies
          : [registeredBodies]
        : undefined,
    };

    await ctx.db
      .update(business)
      .set(transformedData)
      .where(eq(business.id, id));

    return { success: true };
  });

export const deleteBusiness = publicProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // First delete any edit requests for this business
    await ctx.db
      .delete(businessEditRequests)
      .where(eq(businessEditRequests.businessId, input.id));

    // Then delete the business
    await ctx.db.delete(business).where(eq(business.id, input.id));

    return { success: true };
  });
