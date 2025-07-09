import { pgTable, varchar, integer, decimal } from "drizzle-orm/pg-core";
import { business } from "./business";

export const stagingBusinessAnimals = pgTable(
  "staging_Kerabari_business_animals",
  {
    id: varchar("id", { length: 48 }).primaryKey().notNull(),
    businessId: varchar("business_id", { length: 48 }),
    wardNo: integer("ward_no"),
    animalType: varchar("animal_type", { length: 100 }), // e.g., "cattle", "poultry", "fish"
    animalName: varchar("animal_name", { length: 255 }),
    totalCount: integer("total_count"),
    salesCount: integer("sales_count"),
    production: decimal("production", { precision: 10, scale: 2 }),
    revenue: decimal("revenue", { precision: 10, scale: 2 }),
  },
);

export const businessAnimals = pgTable("Kerabari_business_animals", {
  id: varchar("id", { length: 48 }).primaryKey().notNull(),
  businessId: varchar("business_id", { length: 48 }).references(
    () => business.id,
  ),
  wardNo: integer("ward_no"),
  animalType: varchar("animal_type", { length: 100 }), // e.g., "cattle", "poultry", "fish"
  animalName: varchar("animal_name", { length: 255 }),
  totalCount: integer("total_count"),
  salesCount: integer("sales_count"),
  production: decimal("production", { precision: 10, scale: 2 }),
  revenue: decimal("revenue", { precision: 10, scale: 2 }),
});

export type BusinessAnimal = typeof businessAnimals.$inferSelect;
export type StagingBusinessAnimal = typeof stagingBusinessAnimals.$inferSelect;
