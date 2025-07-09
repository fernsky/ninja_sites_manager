// import { Worker, Queue, Job } from "bullmq";
// import { Redis } from "ioredis";
// import { env } from "@/env";
// import { db } from "../db";
// import { surveyForms } from "../db/schema";
// import { fetchSurveySubmissions } from "../utils";
// import { eq } from "drizzle-orm";
// import type { FormAttachment } from "@/types";
// import { minio } from "../minio";

// interface SyncJobData {
//   formId: string;
// }

// interface SurveyFormData {
//   id: string;
//   siteEndpoint: string;
//   userName: string;
//   password: string;
//   odkFormId: string;
//   odkProjectId: number;
//   attachmentPaths: FormAttachment[];
//   updateInterval: number | null;
//   lastFetched: Date | null;
// }

// const connection = new Redis(env.REDIS_URL, {
//   password: env.REDIS_PASSWORD,
//   maxRetriesPerRequest: null,
// });

// export const submissionSyncQueue = new Queue<SyncJobData>("submission-sync", {
//   connection,
//   defaultJobOptions: {
//     removeOnComplete: true,
//     removeOnFail: 1000,
//   },
// });

// // Create a worker to process jobs
// const worker = new Worker<SyncJobData>(
//   "submission-sync",
//   async (job: Job<SyncJobData>) => {
//     const { formId } = job.data;

//     try {
//       // Get form details
//       const forms = await db
//         .select()
//         .from(surveyForms)
//         .where(eq(surveyForms.id, formId))
//         .limit(1);

//       if (!forms.length) {
//         throw new Error(`Form ${formId} not found`);
//       }

//       const formData = forms[0] as unknown as SurveyFormData;
//       const now = new Date();
//       const lastFetched = formData.lastFetched ?? new Date(0);

//       // Fetch submissions between lastFetched and now
//       await fetchSurveySubmissions(
//         {
//           siteEndpoint: formData.siteEndpoint,
//           userName: formData.userName,
//           password: formData.password,
//           odkFormId: formData.odkFormId,
//           odkProjectId: formData.odkProjectId,
//           attachmentPaths: formData.attachmentPaths ?? [],
//           formId: formData.id,
//           startDate: lastFetched.toISOString(),
//           endDate: now.toISOString(),
//         },
//         { db, minio },
//       );

//       // Update lastFetched timestamp
//       await db
//         .update(surveyForms)
//         .set({ lastFetched: now })
//         .where(eq(surveyForms.id, formId));
//     } catch (error) {
//       console.error(`Error processing form ${formId}:`, error);
//       if (error instanceof Error) {
//         throw new Error(`Job failed: ${error.message}`);
//       }
//       throw new Error("Job failed with unknown error");
//     }
//   },
//   { connection },
// );

// // Add these helper functions before scheduleSurveySync
// async function updateJobInterval(
//   formId: string,
//   interval: number,
// ): Promise<void> {
//   const jobId = `sync-${formId}`;
//   const repeatableJobs = await submissionSyncQueue.getRepeatableJobs();
//   const existingJob = repeatableJobs.find((job) => job.id === jobId);

//   if (existingJob) {
//     // Remove existing repeatable job
//     await submissionSyncQueue.removeRepeatableByKey(existingJob.key);
//   }

//   // Add new job with updated interval
//   await submissionSyncQueue.add(
//     jobId,
//     { formId },
//     {
//       repeat: {
//         every: interval * 1000,
//       },
//       jobId,
//     },
//   );
// }

// // Modified scheduleSurveySync function
// export async function scheduleSurveySync(): Promise<void> {
//   try {
//     const forms = await db.select().from(surveyForms);

//     // Get existing repeatable jobs
//     const repeatableJobs = await submissionSyncQueue.getRepeatableJobs();

//     for (const form of forms) {
//       const interval = form.updateInterval ?? 7200;
//       const jobId = `sync-${form.id}`;

//       const existingJob = repeatableJobs.find((job) => job.id === jobId);
//       const currentInterval = existingJob?.every ?? 0;

//       // Only update if interval has changed
//       if (!existingJob || currentInterval !== interval * 1000) {
//         await updateJobInterval(form.id, interval);
//       }
//     }
//   } catch (error) {
//     const errorMessage =
//       error instanceof Error ? error.message : "Unknown error";
//     console.error("Error scheduling survey sync jobs:", errorMessage);
//     throw error;
//   }
// }

// // Export the update function so it can be called when forms are updated
// export const updateSyncInterval = updateJobInterval;

// // Handle worker events with type safety
// worker.on("completed", (job: Job<SyncJobData>) => {
//   console.log(`Job ${job.id} completed`);
// });

// worker.on("failed", (job: Job<SyncJobData> | undefined, error: Error) => {
//   console.error(`Job ${job?.id ?? "unknown"} failed:`, error.message);
// });

// // Graceful shutdown
// process.on("SIGTERM", async () => {
//   await worker.close();
//   await submissionSyncQueue.close();
//   await connection.quit();
// });
