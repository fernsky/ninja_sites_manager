export interface Building {
  id: string;
  locality: string | null;
  tmpWardNumber: string | null;
  tmpAreaCode: string | null;
  tmpEnumeratorId: string | null;
  tmpBuildingToken: string | null;
  isAreaValid: boolean | null;
  isEnumeratorValid: boolean | null;
  isBuildingTokenValid: boolean | null;
  enumeratorName?: string | null;
  areaId?: string | null;
  totalFamilies?: number | null;
  totalBusinesses?: number | null;
  status?: string | null;
  buildingImage?: string | null;
  enumeratorSelfie?: string | null;
  surveyAudioRecording?: string | null;
  gps?: any;
  gpsAccuracy?: number | null;
  altitude?: number | null;
  wardId?: string | null;
  isWardValid?: boolean | null;
}
