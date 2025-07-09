import { z } from "zod";

export const surveyFormSchema = z.object({
  id: z.string().max(255),
  name: z.string().min(1, "Form name is required").max(255),
  siteEndpoint: z.string().url().optional(),
  odkFormId: z.string().max(255),
  odkProjectId: z.number().int().nonnegative(),
  userName: z.string().optional(),
  password: z.string().optional(),
  attachmentPaths: z
    .array(
      z.object({
        path: z.string().optional(),
        type: z.enum([
          "audio_monitoring",
          "building_image",
          "building_selfie",
          "family_head_image",
          "family_head_selfie",
          "business_image",
          "business_selfie",
        ]),
      }),
    )
    .optional(),
  updateInterval: z.number().int().optional(),
});

export const fetchSubmissionsSchema = z
  .object({
    id: z.string(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    count: z.number().int().nonnegative().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.endDate) > new Date(data.startDate);
      }
      return true;
    },
    {
      message: "endDate must be greater than startDate",
      path: ["endDate"],
    },
  );

export type SurveyFormInput = z.infer<typeof surveyFormSchema>;
