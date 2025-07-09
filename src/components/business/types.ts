import type { z } from "zod";
import { businessSchema } from "@/server/api/routers/businesses/business.schema";

export type BusinessSchema = z.infer<typeof businessSchema>;

export interface LocationDetails {
  coordinates: [number, number];
  gpsAccuracy?: number;
  altitude?: number;
}
