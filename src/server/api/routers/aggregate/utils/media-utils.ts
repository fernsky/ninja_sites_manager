import { Client as MinioClient } from "minio";
import { env } from "@/env";
import { surveyAttachments } from "@/server/db/schema";

import { TRPCError } from "@trpc/server";

export async function generateMediaUrls<T extends Record<string, any>>(
  minioClient: MinioClient,
  data: T,
  attachments: any[],
): Promise<T & Record<string, string>> {
  try {
    // Create a mutable result object with appropriate type casting
    const result = { ...data } as Record<string, any>;

    for (const attachment of attachments) {
      const presignedUrl = await minioClient.presignedGetObject(
        env.BUCKET_NAME,
        attachment.name,
        24 * 60 * 60, // 24 hours expiry
      );

      switch (attachment.type) {
        case "building_image":
          result["buildingImage"] = presignedUrl;
          break;
        case "building_selfie":
          result["enumeratorSelfie"] = presignedUrl;
          break;
        case "family_head_image":
          result["familyImage"] = presignedUrl;
          break;
        case "family_head_selfie":
          result["enumeratorSelfie"] = presignedUrl;
          break;
        case "business_image":
          result["businessImage"] = presignedUrl;
          break;
        case "business_selfie":
          result["enumeratorSelfie"] = presignedUrl;
          break;
        case "audio_monitoring":
          result["surveyAudioRecording"] = presignedUrl;
          break;
          break;
        case "monitoring_audio":
          result["surveyAudioRecording"] = presignedUrl;
          break;
      }
    }
    return result as T & Record<string, string>;
  } catch (error) {
    console.error("Failed to generate presigned URLs:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to generate media URLs",
      cause: error,
    });
  }
}
