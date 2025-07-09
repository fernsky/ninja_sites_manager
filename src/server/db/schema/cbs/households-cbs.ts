import {
  timestamp,
  varchar,
  integer,
  pgTable
} from "drizzle-orm/pg-core";

export const householdCBS= pgTable(
  "household_cbs",
  {
    id: varchar("id", { length: 48 }).primaryKey().notNull(),
    wardNo: integer("ward_no"),
    totalHouseholds: integer("total_households"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(
      () => new Date()
    ),  
  }
)

