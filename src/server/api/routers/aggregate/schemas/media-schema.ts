import { z } from "zod";

export const mediaPresignedUrlsSchema = z.object({
  dataId: z.string(),
  mediaTypes: z
    .array(
      z.enum([
        "building_image",
        "building_selfie",
        "family_head_image",
        "family_head_selfie",
        "business_image",
        "business_selfie",
        "audio_monitoring",
      ]),
    )
    .default([
      "building_image",
      "building_selfie",
      "family_head_image",
      "family_head_selfie",
      "business_image",
      "business_selfie",
      "audio_monitoring",
    ]),
});

export const audioPresignedUrlSchema = z.object({
  dataId: z.string(),
});
