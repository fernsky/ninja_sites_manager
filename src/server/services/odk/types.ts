import { FormAttachment } from "@/types";

export interface ODKQueryParams {
  $top: number;
  $skip: number;
  $expand: string;
  $count: boolean;
  $wkt: boolean;
  $filter: string;
}

export interface ODKFetchParams {
  siteEndpoint: string;
  userName: string;
  password: string;
  odkFormId: string;
  odkProjectId: number;
  attachmentPaths: FormAttachment[];
  formId: string;
  startDate?: string;
  endDate?: string;
  count?: number;
}
