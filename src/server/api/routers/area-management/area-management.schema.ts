import { z } from "zod";

export const updateAreaStatusSchema = z.object({
  areaId: z.string(),
  status: z.enum([
    "unassigned",
    "newly_assigned",
    "ongoing_survey",
    "revision",
    "asked_for_completion",
    "asked_for_revision_completion",
    "asked_for_withdrawl",
  ]),
  message: z.string().optional(),
});

export const approveCompletionSchema = z.object({
  areaId: z.string(),
  message: z.string().optional(),
});

export const requestRevisionSchema = z.object({
  areaId: z.string(),
  message: z.string().min(1, "Revision message is required"),
});

export const handleWithdrawalSchema = z.object({
  areaId: z.string(),
  approved: z.boolean(),
  message: z.string().optional(),
});

export const getAreaActionsSchema = z.object({
  status: z
    .enum([
      "all",
      "asked_for_completion",
      "asked_for_revision_completion",
      "asked_for_withdrawl",
    ])
    .optional(),
  wardNumber: z.number().optional(),
  page: z.number().default(0),
  limit: z.number().default(10),
});

export const handleActionSchema = z.object({
  areaId: z.string(),
  action: z.enum(["approve", "reject"]),
  message: z.string().optional(),
  newStatus: z.enum(["unassigned", "ongoing_survey", "revision", "completed"]),
});

export type GetAreaActionsInput = z.infer<typeof getAreaActionsSchema>;
export type HandleActionInput = z.infer<typeof handleActionSchema>;
