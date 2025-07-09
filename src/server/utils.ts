// import { FormAttachment } from "@/types";
// import axios from "axios";
// import { surveyData } from "./db/schema";
// import { getODKToken } from "./services/odk/auth";
// import { handleAttachment } from "./services/attachment/handler";
// import { ODKConfig } from "./services/types";
// import { handleBuildingFlow } from "./services/sync/building/building";
// import { handleBusinessFlow } from "./services/sync/business/business";
// import { handleFamilyFlow } from "./services/sync/family/family";

// export const fetchSurveySubmissions = async (
//   {
//     siteEndpoint,
//     userName,
//     password,
//     odkFormId,
//     odkProjectId,
//     attachmentPaths,
//     formId,
//     startDate,
//     endDate,
//     count,
//   }: {
//     siteEndpoint: string;
//     userName: string;
//     password: string;
//     odkFormId: string;
//     odkProjectId: number;
//     attachmentPaths: FormAttachment[];
//     formId: string;
//     startDate?: string;
//     endDate?: string;
//     count?: number;
//   },
//   ctx: any,
// ) => {
//   const token = await getODKToken(siteEndpoint, userName, password);
//   const odkConfig: ODKConfig = {
//     siteEndpoint,
//     odkProjectId: odkProjectId.toString(),
//     odkFormId,
//     token,
//   };

//   // Set default date ranges if not provided
//   const today = new Date();
//   const defaultStartDate = new Date(today);
//   defaultStartDate.setDate(today.getDate() - 1);
//   const defaultEndDate = new Date(today);

//   // Configure query parameters for ODK API
//   const queryParams = {
//     $top: count ?? 100, // Number of records to fetch, default 100
//     $skip: 0, // Start from beginning
//     $expand: "*", // Expand all relationships
//     $count: true, // Include total count
//     $wkt: false, // Don't use WKT format for geometries
//     $filter: `__system/submissionDate ge ${startDate ?? defaultStartDate.toISOString()} and __system/submissionDate le ${endDate ?? defaultEndDate.toISOString()}`,
//   };

//   try {
//     // Build query string from parameters
//     const queryString = Object.entries(queryParams)
//       .map(
//         ([key, value]) =>
//           `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
//       )
//       .join("&");

//     // Fetch submissions from ODK API
//     const response = await axios.get(
//       `${siteEndpoint}/v1/projects/${odkProjectId}/forms/${odkFormId}.svc/Submissions?${queryString}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       },
//     );
//     const submissions = response.data.value;
//     console.log("Successfully fetched submissions:", submissions.length);

//     // Process each submission
//     for (let submission of submissions) {
//       // Insert submission data into survey_data table
//       await ctx.db
//         .insert(surveyData)
//         .values({
//           id: submission.__id,
//           formId: formId,
//           data: submission,
//         })
//         .onConflictDoNothing();

//       // Process attachments if any are specified
//       if (attachmentPaths) {
//         for (let attachmentPath of attachmentPaths) {
//           await handleAttachment(submission, attachmentPath, ctx, odkConfig);
//         }
//       }

//       switch (formId) {
//         case "Kerabari_building_survey":
//           handleBuildingFlow(submission, ctx);
//           break;
//         case "Kerabari_business_survey":
//           handleBusinessFlow(submission, ctx);
//           break;
//         case "Kerabari_family_survey":
//           handleFamilyFlow(submission, ctx);
//         default:
//           console.log("No handler found for form ID:", formId);
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     throw new Error(`Failed to get submissions: ${(error as any).message}`);
//   }
// };
