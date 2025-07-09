// import { parseAndInsertInStaging } from "@/lib/parser/Kerabari/parse-business";
// import { stagingToProduction } from "@/server/db/schema";
// import { eq } from "drizzle-orm";
// import { syncBusinessSurvey } from "./sync";

// export const handleBusinessFlow = async (businessSubmission: any, ctx: any) => {
//   // First regardless of the status, store it in the staging database
//   // Generate and execute any form-specific database operations

//   // Steps:
//   // 1. Parse the business data.
//   // 2. Insert the business data into the staging database.
//   // 3. Check if the business data is already in the production database.

//   await parseAndInsertInStaging(businessSubmission, ctx);

//   const productionInsert = await ctx.db
//     .select()
//     .from(stagingToProduction)
//     .where(eq(stagingToProduction.recordId, businessSubmission.__id))
//     .limit(1);

//   if (productionInsert.length === 0) {
//     await syncBusinessSurvey(businessSubmission.__id, businessSubmission, ctx);
//   }
// };
