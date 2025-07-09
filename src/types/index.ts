export type FormAttachmentType =
  | "audio_monitoring"
  | "building_image"
  | "building_image_selfie"
  | "family_head_image"
  | "family_head_image_selfie"
  | "business_image"
  | "business_image_selfie";

export interface FormAttachment {
  path: string;
  type: FormAttachmentType;
}
