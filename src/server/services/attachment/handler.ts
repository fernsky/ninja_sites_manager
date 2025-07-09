import { and, eq } from "drizzle-orm";
import { attachmentTypesEnum, surveyAttachments } from "../../db/schema";
import axios from "axios";
import { getValueFromNestedField } from "@/server/utils/data";
import { ODKConfig } from "../types";

export async function handleAttachment(
  submission: any,
  attachmentPath: any,
  ctx: any,
  odkConfig: ODKConfig,
) {
  console.log(`Processing attachment for submission ${submission.__id}`);
  console.log(`Attachment path:`, attachmentPath);

  const attachmentName = getValueFromNestedField(
    submission,
    attachmentPath.path,
  );
  if (!attachmentName) {
    console.log(`No attachment found at path ${attachmentPath.path}`);
    return;
  }
  console.log(`Found attachment: ${attachmentName}`);

  if (await attachmentExists(ctx, submission.__id, attachmentName)) {
    console.log(`Skipping existing attachment: ${attachmentName}`);
    return;
  }

  console.log(`Downloading attachment: ${attachmentName}`);
  const attachment = await downloadAttachment(
    submission,
    attachmentName,
    odkConfig,
  );
  console.log(
    `Successfully downloaded attachment (${Buffer.byteLength(attachment)} bytes)`,
  );

  console.log(`Uploading attachment to storage: ${attachmentName}`);
  await uploadToStorage(ctx, submission.__id, attachmentName, attachment);
  console.log(`Successfully uploaded attachment to storage`);

  console.log(`Recording attachment in database: ${attachmentName}`);
  await recordAttachment(
    ctx,
    submission.__id,
    attachmentName,
    attachmentPath.type,
  );
  console.log(`Successfully recorded attachment in database`);
}

async function attachmentExists(
  ctx: any,
  submissionId: string,
  attachmentName: string,
) {
  console.log(`Checking if attachment exists: ${attachmentName}`);
  const lastSevenDigits = submissionId.slice(-7);
  const newAttachmentName = `${lastSevenDigits}_${attachmentName}`;
  const existingAttachment = await ctx.db
    .select()
    .from(surveyAttachments)
    .where(
      and(
        eq(surveyAttachments.dataId, submissionId),
        eq(surveyAttachments.name, newAttachmentName),
      ),
    )
    .limit(1);

  if (existingAttachment.length > 0) {
    console.log(
      `Attachment ${attachmentName} for submission ${submissionId} already exists in the database.`,
    );
    return true;
  }
  return false;
}

async function downloadAttachment(
  submission: any,
  attachmentName: string,
  odkConfig: any,
) {
  const { siteEndpoint, odkProjectId, odkFormId, token } = odkConfig;
  const attachmentUrl = `${siteEndpoint}/v1/projects/${odkProjectId}/forms/${odkFormId}/submissions/${submission.__id}/attachments/${attachmentName}`;
  console.log(`Downloading from URL: ${attachmentUrl}`);

  try {
    const response = await axios.get(attachmentUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "arraybuffer",
    });
    console.log(`Download successful, received ${response.data.length} bytes`);
    return response.data;
  } catch (error) {
    console.error(`Download failed for ${attachmentName}:`, error);
    throw error;
  }
}

async function uploadToStorage(
  ctx: any,
  submissionId: string,
  attachmentName: string,
  attachment: Buffer,
) {
  if (!process.env.BUCKET_NAME) {
    console.error("Missing BUCKET_NAME environment variable");
    throw new Error("Bucket name not found");
  }

  const lastSevenDigits = submissionId.slice(-7);
  const newAttachmentName = `${lastSevenDigits}_${attachmentName}`;
  console.log(
    `Uploading to bucket: ${process.env.BUCKET_NAME}/${newAttachmentName}`,
  );

  try {
    await ctx.minio.putObject(
      process.env.BUCKET_NAME,
      newAttachmentName,
      attachment,
    );
    console.log(`Upload successful`);
    return newAttachmentName;
  } catch (error) {
    console.error(`Upload failed for ${newAttachmentName}:`, error);
    throw error;
  }
}

async function recordAttachment(
  ctx: any,
  submissionId: string,
  attachmentName: string,
  attachmentType: string,
) {
  const lastSevenDigits = submissionId.slice(-7);
  const newAttachmentName = `${lastSevenDigits}_${attachmentName}`;
  console.log(
    `Recording attachment in database: ${newAttachmentName} (type: ${attachmentType})`,
  );

  try {
    await ctx.db
      .insert(surveyAttachments)
      .values({
        dataId: submissionId,
        type: attachmentType as (typeof attachmentTypesEnum.enumValues)[number],
        name: newAttachmentName,
      })
      .onConflictDoNothing();
    console.log(`Successfully recorded in database`);
  } catch (error) {
    console.error(`Database recording failed for ${newAttachmentName}:`, error);
    throw error;
  }
}
