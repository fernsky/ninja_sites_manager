import {
  pgTable,
  text,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const backupLocationEnum = pgEnum("backup_location", [
  "LOCAL",
  "AWS",
  "TELEGRAM",
]);

export const sites = pgTable("sites", {
  id: text("id").primaryKey().notNull(),
  
  // Agency Information
  nameOfAgency: text("name_of_agency").notNull(),
  url: text("url").notNull(),
  
  // cPanel Configuration
  isCpanel: boolean("is_cpanel").default(false).notNull(),
  cpanelUsername: text("cpanel_username"),
  cpanelPassword: text("cpanel_password"),
  
  // VM Configuration
  isVm: boolean("is_vm").default(false).notNull(),
  vpnUsername: text("vpn_username"),
  vpnPassword: text("vpn_password"),
  vmIp: text("vm_ip"),
  vmUsername: text("vm_username"),
  vmPassword: text("vm_password"),
  
  // Location Information
  province: text("province").notNull(),
  district: text("district").notNull(),
  
  // Backup Information
  hasTakenManualBackup: boolean("has_taken_manual_backup").default(false).notNull(),
  lastManualBackupDate: timestamp("last_manual_backup_date", { precision: 3 }),
  lastDatabaseBackupDate: timestamp("last_database_backup_date", { precision: 3 }),
  backupLocation: backupLocationEnum("backup_location"),
  
  // Status and Metadata
  hasIssues: boolean("has_issues").default(false).notNull(),
  createdAt: timestamp("created_at", { precision: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { precision: 3 }).notNull(),
});

export type SitesSchema = typeof sites.$inferSelect;
export type SitesInsertSchema = typeof sites.$inferInsert;
