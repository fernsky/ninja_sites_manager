import { z } from "zod";

export const enumeratorWardWiseSchema = z.array(
  z.object({
    wardId: z.number().int(),
    enumeratorName: z.string(),
    count: z.number().int(),
    areaCodes: z.array(z.string()),
  })
);

export const buildingsByEnumeratorSchema = z.array(
  z.object({
    enumeratorName: z.string(),
    totalBuildings: z.number().int(),
  })
);

export const uniqueEnumeratorsSchema = z.array(
  z.object({
    enumeratorName: z.string(),
  })
);

export const buildingsByAreaCodeSchema = z.array(
  z.object({
    enumeratorName: z.string(),
    areaCode: z.string(),
    totalBuildings: z.number().int(),
  })
);

// Types
export type EnumeratorWardWiseDistribution = z.infer<typeof enumeratorWardWiseSchema>;
export type BuildingsByEnumerator = z.infer<typeof buildingsByEnumeratorSchema>;
export type UniqueEnumerators = z.infer<typeof uniqueEnumeratorsSchema>;
export type BuildingsByAreaCode = z.infer<typeof buildingsByAreaCodeSchema>;
