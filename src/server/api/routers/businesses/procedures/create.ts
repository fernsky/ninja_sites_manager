// import { publicProcedure } from "@/server/api/trpc";
// import { createBusinessSchema } from "../business.schema";
// import { business } from "@/server/db/schema/business/business";
// import { sql } from "drizzle-orm";
// import { v4 as uuidv4 } from "uuid";

// export const create = publicProcedure
//   .input(createBusinessSchema)
//   .mutation(async ({ ctx, input }) => {
//     const id = uuidv4();
//     const { 
//       gps, 
//       altitude, 
//       gpsAccuracy, 
//       registeredBodies, 
//       ...restInput 
//     } = input;

//     await ctx.db.insert(business).values({
//       ...restInput,
//       id,
//       gps: sql`ST_GeomFromText(${gps})`,
//       altitude: altitude || null,
//       gpsAccuracy: gpsAccuracy || null,
//       registeredBodies: Array.isArray(registeredBodies) 
//         ? registeredBodies 
//         : [registeredBodies],
//       // Set default validation flags
//       status: "pending",
//       isAreaValid: false,
//       isWardValid: false,
//       isBuildingTokenValid: false,
//       isEnumeratorValid: false,
//     });

//     return { id };
//   });
