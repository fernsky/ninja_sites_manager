import { pgTable, varchar, integer } from "drizzle-orm/pg-core";
import { family } from "./family";

export const stagingKerabariDeath = pgTable("staging_Kerabari_death", {
  id: varchar("id", { length: 48 }).primaryKey().notNull(),
  familyId: varchar("family_id", { length: 48 }).notNull(),
  wardNo: integer("ward_no").notNull(),
  deceasedName: varchar("deceased_name", { length: 100 }),
  deceasedAge: integer("deceased_age"),
  deceasedDeathCause: varchar("deceased_death_cause", { length: 100 }),
  deceasedGender: varchar("deceased_gender", { length: 100 }),
  deceasedFertilityDeathCondition: varchar(
    "deceased_fertility_death_condition",
    { length: 100 },
  ),
  deceasedHasDeathCertificate: varchar("deceased_has_death_certificate", {
    length: 100,
  }),
});

export const KerabariDeath = pgTable("Kerabari_death", {
  id: varchar("id", { length: 48 }).primaryKey().notNull(),
  famliyId: varchar("family_id", { length: 48 }).references(() => family.id),
  wardNo: integer("ward_no").notNull(),
  deceasedName: varchar("deceased_name", { length: 100 }),
  deceasedAge: integer("deceased_age"),
  deceasedDeathCause: varchar("deceased_death_cause", { length: 100 }),
  deceasedGender: varchar("deceased_gender", { length: 100 }),
  deceasedFertilityDeathCondition: varchar(
    "deceased_fertility_death_condition",
    { length: 100 },
  ),
});

export type KerabariDeath = typeof KerabariDeath.$inferSelect;
export type StagingKerabariDeath =
  typeof stagingKerabariDeath.$inferSelect;
