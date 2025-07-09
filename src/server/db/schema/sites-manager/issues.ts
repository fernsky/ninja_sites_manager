import {
  pgTable,
  text,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sites } from "./sites";

export const issueTypeEnum = pgEnum("issue_type", [
  "CSS_ERROR",
  "NOT_FOUND_404",
  "INTERNAL_SERVER_ERROR",
  "HACKED",
  "NOT_RESPONDING",
  "SSL_ERROR",
  "DATABASE_ERROR",
  "PERFORMANCE_ISSUE",
]);

export const priorityEnum = pgEnum("priority", [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
]);

export const issues = pgTable("issues", {
  id: text("id").primaryKey().notNull(),
  
  // Foreign Key Reference
  siteId: text("site_id").notNull().references(() => sites.id, { onDelete: "cascade", onUpdate: "cascade" }),
  
  // Issue Details
  issueTypes: issueTypeEnum("issue_types").array(),
  description: text("description").notNull(),
  priority: priorityEnum("priority").notNull(),
  
  // Status
  isSolved: boolean("is_solved").default(false).notNull(),
  
  // Metadata
  createdAt: timestamp("created_at", { precision: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { precision: 3 }).notNull(),
});

export type IssuesSchema = typeof issues.$inferSelect;
export type IssuesInsertSchema = typeof issues.$inferInsert;
