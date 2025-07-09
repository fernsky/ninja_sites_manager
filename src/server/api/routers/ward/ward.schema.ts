import { z } from "zod";
import { FeatureCollection, Polygon } from "geojson";

export const createWardSchema = z.object({
  wardNumber: z.number().int(),
  wardAreaCode: z.number().int(),
});

export const updateWardAreaCodeSchema = z.object({
  wardNumber: z.number().int(),
  wardAreaCode: z.number().int(),
});

export interface Ward {
  wardNumber: number;
  wardAreaCode: number;
  geometry: JSON | FeatureCollection<Polygon>;
}
