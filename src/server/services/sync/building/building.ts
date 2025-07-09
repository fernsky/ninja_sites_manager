// import { parseAndInsertInStaging } from "@/lib/parser/Kerabari/parse-buildings";
// import { stagingToProduction } from "@/server/db/schema";
// import { eq, sql } from "drizzle-orm";
// import { syncBuildingSurvey } from "./sync";

// export const handleBuildingFlow = async (buildingSubmission: any, ctx: any) => {
//   // First regardless of the status, store it in the staging database
//   // Generate and execute any form-specific database operations

//   // Steps:
//   // 1. Parse the building data.
//   // 2. Insert the building data into the staging database.
//   // 3. Check if the building data is already in the production database.

//   await parseAndInsertInStaging(buildingSubmission, ctx);

//   const productionInsert = await ctx.db
//     .select()
//     .from(stagingToProduction)
//     .where(eq(stagingToProduction.recordId, buildingSubmission.__id))
//     .limit(1);

//   if (productionInsert.length === 0) {
//     await syncBuildingSurvey(buildingSubmission.__id, buildingSubmission, ctx);
//   }
// };
