export interface IdCardDetails {
  nepaliName: string | null;
  nepaliAddress: string | null;
  nepaliPhone: string | null;
}

export interface IdCardGenerationProps {
  details: IdCardDetails;
  onDownload?: () => void;
}
