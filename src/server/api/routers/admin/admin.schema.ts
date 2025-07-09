import { z } from "zod";

export const createChapterSchema = z.object({
  title_en: z.string().min(1),
  title_ne: z.string().min(1),
  part_id: z.string().min(1),
});

export const updateChapterSchema = z.object({
  id: z.string().min(1),
  title_en: z.string().min(1),
  title_ne: z.string().min(1),
});

export const chapterIdSchema = z.object({
  id: z.string().min(1),
});

export const partIdSchema = z.object({
  partId: z.string().min(1),
});
