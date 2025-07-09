import { pgTable, varchar, integer, decimal } from "drizzle-orm/pg-core";
import { business } from "./business";

export const stagingBusinessAnimalProducts = pgTable(
  "staging_Kerabari_business_animal_products",
  {
    id: varchar("id", { length: 48 }).primaryKey().notNull(),
    businessId: varchar("business_id", { length: 48 }),
    wardNo: integer("ward_no"),
    animalProduct: varchar("animal_product", { length: 100 }),
    productName: varchar("product_name", { length: 255 }),
    unit: varchar("unit", { length: 100 }),
    productionAmount: decimal("production_amount", { precision: 10, scale: 2 }),
    salesAmount: decimal("sales_amount", { precision: 10, scale: 2 }),
    monthlyProduction: decimal("monthly_production", {
      precision: 10,
      scale: 2,
    }),
    revenue: decimal("revenue", { precision: 10, scale: 2 }),
  },
);

export const businessAnimalProducts = pgTable(
  "Kerabari_business_animal_products",
  {
    id: varchar("id", { length: 48 }).primaryKey().notNull(),
    businessId: varchar("business_id", { length: 48 }).references(
      () => business.id,
    ),
    wardNo: integer("ward_no"),
    animalProduct: varchar("animal_product", { length: 100 }),
    productName: varchar("product_name", { length: 255 }),
    unit: varchar("unit", { length: 100 }),
    productionAmount: decimal("production_amount", { precision: 10, scale: 2 }),
    salesAmount: decimal("sales_amount", { precision: 10, scale: 2 }),
    monthlyProduction: decimal("monthly_production", {
      precision: 10,
      scale: 2,
    }),
    revenue: decimal("revenue", { precision: 10, scale: 2 }),
  },
);

export type StagingBusinessAnimalProduct =
  typeof stagingBusinessAnimalProducts.$inferSelect;
export type BusinessAnimalProduct = typeof businessAnimalProducts.$inferSelect;
