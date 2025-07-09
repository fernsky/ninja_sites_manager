// import { publicProcedure } from "@/server/api/trpc";
// import { updateBuildingSchema } from "../families.schema";
// import { buildings, buildingTokens } from "@/server/db/schema/building";
// import { and, eq, sql } from "drizzle-orm";
// import { z } from "zod";
// import { TRPCError } from "@trpc/server";

// export const update = publicProcedure
//   .input(z.object({ id: z.string(), data: updateBuildingSchema }))
//   .mutation(async ({ ctx, input }) => {
//     const { id, data } = input;

//     // Prevent setting building token without area ID
//     if (data.buildingToken && !data.areaId) {
//       throw new TRPCError({
//         code: "BAD_REQUEST",
//         message: "Cannot set building token without a valid area ID",
//       });
//     }

//     // If buildingToken is being updated, validate it belongs to the area
//     if (data.buildingToken && data.areaId) {
//       const validToken = await ctx.db
//         .select()
//         .from(buildingTokens)
//         .where(
//           and(
//             eq(buildingTokens.areaId, data.areaId),
//             eq(buildingTokens.token, data.buildingToken),
//           ),
//         )
//         .limit(1);

//       if (validToken.length === 0) {
//         throw new TRPCError({
//           code: "BAD_REQUEST",
//           message: `Building token ${data.buildingToken} does not belong to area ${data.areaId}`,
//         });
//       }

//       // Mark the token as allocated
//       await ctx.db
//         .update(buildingTokens)
//         .set({ status: "allocated" })
//         .where(eq(buildingTokens.token, data.buildingToken));
//     }

//     const { gps, ...restData } = data;
//     const transformedData = {
//       ...restData,
//       surveyDate: restData.surveyDate
//         ? new Date(restData.surveyDate)
//         : undefined,
//       gps: gps ? sql`ST_GeomFromText(${gps})` : undefined,
//       naturalDisasters: restData.naturalDisasters
//         ? Array.isArray(restData.naturalDisasters)
//           ? restData.naturalDisasters
//           : [restData.naturalDisasters]
//         : undefined,
//     };

//     await ctx.db
//       .update(buildings)
//       .set(transformedData)
//       .where(eq(buildings.id, id));

//     return { success: true };
//   });

// export const deleteBuilding = publicProcedure
//   .input(z.object({ id: z.string() }))
//   .mutation(async ({ ctx, input }) => {
//     await ctx.db.delete(buildings).where(eq(buildings.id, input.id));

//     return { success: true };
//   });
