import { parseAndInsertInStaging } from "@/lib/parser/Kerabari/family/main";
import { stagingToProduction } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { syncFamilySurvey } from "./sync";

export const handleFamilyFlow = async (familySubmission: any, ctx: any) => {
  // First regardless of the status, store it in the staging database
  // Generate and execute any form-specific database operations
  // Steps:
  // 1. Parse the business data.
  // 2. Insert the business data into the staging database.
  // 3. Check if the business data is already in the production database.
  console.log("Parsing and inserting family data into staging database");
  await parseAndInsertInStaging(familySubmission, ctx);
  const productionInsert = await ctx.db
    .select()
    .from(stagingToProduction)
    .where(eq(stagingToProduction.recordId, familySubmission.__id))
    .limit(1);
  if (productionInsert.length === 0) {
    await syncFamilySurvey(familySubmission.__id, familySubmission, ctx);
  }
};
