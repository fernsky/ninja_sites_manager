import { pgTable, varchar, integer, decimal } from "drizzle-orm/pg-core";
import { business } from "./business";

export const stagingBusinessCrops = pgTable(
  "staging_Kerabari_business_crops",
  {
    id: varchar("id", { length: 48 }).primaryKey().notNull(),
    businessId: varchar("business_id", { length: 48 }),
    wardNo: integer("ward_no"),
    cropType: varchar("crop_type", { length: 100 }), // e.g., "fcrop", "pulse", "oseed", "vtable", "fruit", "spice", "ccrop"
    cropName: varchar("crop_name", { length: 100 }),
    cropArea: decimal("crop_area", { precision: 10, scale: 2 }),
    cropProduction: decimal("crop_production", { precision: 10, scale: 2 }),
    cropSales: decimal("crop_sales", { precision: 10, scale: 2 }),
    cropRevenue: decimal("crop_revenue", { precision: 10, scale: 2 }),
    cropCount: integer("crop_count"), // For trees count in fruits/cash crops
  },
);

export const businessCrops = pgTable("Kerabari_business_crops", {
  id: varchar("id", { length: 48 }).primaryKey().notNull(),
  businessId: varchar("business_id", { length: 48 }).references(
    () => business.id,
  ),
  wardNo: integer("ward_no"),
  cropType: varchar("crop_type", { length: 100 }), // e.g., "fcrop", "pulse", "oseed", "vtable", "fruit", "spice", "ccrop"
  cropName: varchar("crop_name", { length: 100 }),
  cropArea: decimal("crop_area", { precision: 10, scale: 2 }),
  cropProduction: decimal("crop_production", { precision: 10, scale: 2 }),
  cropSales: decimal("crop_sales", { precision: 10, scale: 2 }),
  cropRevenue: decimal("crop_revenue", { precision: 10, scale: 2 }),
  cropCount: integer("crop_count"), // For trees count in fruits/cash crops
});

export type BusinessCrop = typeof businessCrops.$inferSelect;
export type StagingBusinessCrop = typeof stagingBusinessCrops.$inferSelect;
