import { publicProcedure } from "@/server/api/trpc";
import {
  mediaPresignedUrlsSchema,
  audioPresignedUrlSchema,
} from "../schemas/media-schema";
import { eq, and, sql } from "drizzle-orm";
import { surveyAttachments } from "@/server/db/schema";
import { env } from "@/env";

export const getMediaPresignedUrls = publicProcedure
  .input(mediaPresignedUrlsSchema)
  .query(async ({ ctx, input }) => {
    const { dataId, mediaTypes } = input;

    const attachments = await ctx.db.query.surveyAttachments.findMany({
      where: and(
        eq(surveyAttachments.dataId, dataId),
        mediaTypes.length > 0
          ? sql`${surveyAttachments.type} IN (${mediaTypes.join(", ")})`
          : undefined,
      ),
    });

    if (!attachments || attachments.length === 0) {
      return {
        mediaUrls: {},
      };
    }

    const mediaUrls: Record<string, string> = {};

    for (const attachment of attachments) {
      try {
        const presignedUrl = await ctx.minio.presignedGetObject(
          env.BUCKET_NAME,
          attachment.name,
          24 * 60 * 60, // 24 hours expiry
        );

        mediaUrls[attachment.type] = presignedUrl;
      } catch (error) {
        console.error(
          `Failed to generate presigned URL for ${attachment.type}:`,
          error,
        );
      }
    }

    return {
      mediaUrls,
    };
  });

export const getAudioPresignedUrl = publicProcedure
  .input(audioPresignedUrlSchema)
  .query(async ({ ctx, input }) => {
    const audioAttachment = await ctx.db.query.surveyAttachments.findFirst({
      where: and(
        eq(surveyAttachments.dataId, input.dataId),
        eq(surveyAttachments.type, "audio_monitoring"),
      ),
    });

    if (!audioAttachment) {
      return {
        audioUrl: null,
      };
    }

    try {
      const presignedUrl = await ctx.minio.presignedGetObject(
        env.BUCKET_NAME,
        audioAttachment.name,
        24 * 60 * 60, // 24 hours expiry
      );

      return {
        audioUrl: presignedUrl,
      };
    } catch (error) {
      console.error("Failed to generate audio presigned URL:", error);
      return {
        audioUrl: null,
        error: "Failed to generate audio URL",
      };
    }
  });
