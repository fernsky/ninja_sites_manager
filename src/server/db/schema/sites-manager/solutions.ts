import {
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { issues } from "./issues";

export const solutions = pgTable("solutions", {
  id: text("id").primaryKey().notNull(),
  
  // Foreign Key Reference
  issueId: text("issue_id").notNull().references(() => issues.id, { onDelete: "cascade", onUpdate: "cascade" }),
  
  // Solution Details
  whoSolved: text("who_solved").notNull(),
  howSolved: text("how_solved").notNull(),
  
  // Timestamps
  solvedAt: timestamp("solved_at", { precision: 3 }).notNull(),
  createdAt: timestamp("created_at", { precision: 3 }).defaultNow().notNull(),
});

export type SolutionsSchema = typeof solutions.$inferSelect;
export type SolutionsInsertSchema = typeof solutions.$inferInsert;
