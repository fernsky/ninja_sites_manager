import {
  pgTableCreator,
  index,
  timestamp,
  varchar,
  pgEnum,
  integer,
  json,
  primaryKey,
  boolean,
  text,
} from "drizzle-orm/pg-core";
import { DATABASE_PREFIX as prefix } from "@/lib/constants";
import { geometry } from "../geographical";

export const pgTable = pgTableCreator((name) => `${prefix}_${name}`);

export const rolesEnum = pgEnum("roles", [
  "enumerator",
  "supervisor",
  "superadmin",
]);

export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 21 }).primaryKey(),
    userName: varchar("user_name", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    hashedPassword: varchar("hashed_password", { length: 255 }),
    phoneNumber: varchar("phone_number", { length: 10 }),
    email: varchar("email", { length: 255 }),
    avatar: varchar("avatar", { length: 255 }),
    wardNumber: integer("ward_number"),
    role: rolesEnum("role").default("enumerator"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(
      () => new Date(),
    ),
    nepaliName: text("nepali_name"),
    nepaliAddress: text("nepali_address"),
    nepaliPhone: text("nepali_phone"),
  },
  (t) => ({
    usernameIdx: index("user_email_idx").on(t.userName),
  }),
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const sessions = pgTable(
  "sessions",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    userId: varchar("user_id", { length: 21 }).notNull(),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
  },
  (t) => ({
    userIdx: index("session_user_idx").on(t.userId),
  }),
);

export const wards = pgTable(
  "wards",
  {
    wardNumber: integer("ward_number").primaryKey(),
    wardAreaCode: integer("ward_area_code").notNull(),
    geometry: geometry("geometry", { type: "Polygon" }),
  },
  (t) => ({
    wardNumberIdx: index("ward_number_idx").on(t.wardNumber),
  }),
);

/*
The area status works in the following way:
1. unassigned: The area is not assigned to any enumerator
2. newly_assigned: The area is newly assigned to an enumerator. 
                   This occurs when an area request is approved.
3. ongoing_survey: The enumerator is currently surveying the area.
                   This occurrs if there is any survey data for the area by
                   the approved enumerator.
4. revision:       The enumerator has said he has completed the survey but the
                    supervisor has requested for a revision in that area.
5. asked_for_completion: The enumerator has completed the survey and asked for completion 
                   from the supervisor
6. asked_for_revision_completion: The enumerator has completed the revision and asked for completion.
7. asked_for_withdrawl: The enumerator has asked for withdrawl from surveying the area.
*/

export const areaStatusEnum = pgEnum("area_status_enum", [
  "unassigned",
  "newly_assigned",
  "ongoing_survey",
  "revision",
  "asked_for_completion",
  "asked_for_revision_completion",
  "asked_for_withdrawl",
  "completed"
]);

export const areas = pgTable("areas", {
  id: varchar("id", { length: 36 }).primaryKey(),
  code: integer("code").notNull(),
  wardNumber: integer("ward")
    .notNull()
    .references(() => wards.wardNumber),
  geometry: geometry("geometry", { type: "Polygon" }),
  assignedTo: varchar("assigned_to", { length: 21 }).references(() => users.id),
  areaStatus: areaStatusEnum("area_status").default("unassigned"),
});

export type Area = typeof areas.$inferSelect;

export const areaWithStatus=pgTable("area_status_view",{
   id: varchar("area_id", { length: 36 }).primaryKey(),
  code: integer("code").notNull(),
  wardNumber: integer("ward")
    .notNull()
    .references(() => wards.wardNumber),
  assignedTo: varchar("assigned_to", { length: 21 }).references(() => users.id),
  areaStatus: areaStatusEnum("area_status").default("unassigned"),
  completedBy: varchar("completed_by", { length: 21 }).references(() => users.id),
  completed_by_name: varchar("completed_by_name", { length: 255 }),
  assigned_to_name: varchar("assigned_to_name", { length: 255 }),
})


/*
I need a table that stores the following things:
1. List of all the assignments that have ever occurred for all enumerators.
2. The status of the assignment.

This is needed because the area code may have been assigned for another enumerator
but the last enumerator is still sending submission in that area code.
*/

export const enumeratorAssignments = pgTable("enumerator_assignments", {
  id: varchar("id", { length: 36 }).primaryKey(),
  areaId: varchar("area_id", { length: 36 })
    .notNull()
    .references(() => areas.id),
  assignedTo: varchar("assigned_to", { length: 21 })
    .notNull()
    .references(() => users.id),
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
  status: areaStatusEnum("status").default("unassigned"),
});

export const surveyForms = pgTable("odk_survey_forms", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  siteEndpoint: json("url"),
  odkProjectId: integer("odk_project_id").notNull(),
  odkFormId: varchar("odk_form_id", { length: 255 }).notNull(),
  userName: json("username"),
  password: json("password"),
  /*
  Form attachments
    {
      path: "double.underscored.path",
      type: "survey_image" 
    }
  */
  attachmentPaths: json("attachment_paths").array(),
  updateInterval: integer("update_interval").default(7200),
  lastFetched: timestamp("last_fetched").defaultNow(),
});

export const surveyData = pgTable("odk_survey_data", {
  id: varchar("id", { length: 55 }).primaryKey(),
  formId: varchar("form_id", { length: 255 })
    .notNull()
    .references(() => surveyForms.id),
  data: json("data").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const attachmentTypesEnum = pgEnum("attachment", [
  "audio_monitoring",
  "building_image",
  "building_selfie",
  "family_head_image",
  "family_head_selfie",
  "business_image",
  "business_selfie",
]);

export const surveyAttachments = pgTable(
  "odk_survey_attachments",
  {
    dataId: varchar("data_id", { length: 55 })
      .notNull()
      .references(() => surveyData.id),
    type: attachmentTypesEnum("type").default("building_image").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey(t.dataId, t.name),
  }),
);

export type Ward = typeof wards.$inferSelect;
export type NewWard = typeof wards.$inferInsert;

export const areaRequestsEnum = pgEnum("area_request_status", [
  "pending",
  "approved",
  "rejected",
]);

export const areaRequests = pgTable(
  "area_requests",
  {
    areaId: varchar("area_id")
      .notNull()
      .references(() => areas.id),
    userId: varchar("user_id", { length: 21 })
      .notNull()
      .references(() => users.id),
    status: areaRequestsEnum("status").default("pending"),
    message: varchar("message", { length: 500 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  },
  (t) => ({
    pk: primaryKey(t.areaId, t.userId),
  }),
);

export const stagingToProduction = pgTable(
  "staging_to_production",
  {
    staging_table: varchar("staging_table", { length: 255 }).notNull(),
    production_table: varchar("production_table", { length: 255 }).notNull(),
    recordId: varchar("record_id", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey(t.staging_table, t.production_table, t.recordId),
  }),
);

export const pointRequests = pgTable('point_requests', {
  id: text('id').primaryKey().$defaultFn(() => nanoid()),
  wardNumber: integer('ward_number').notNull(),
  enumeratorId: text('enumerator_id').notNull().references(() => users.id),
  coordinates: geometry('coordinates', { type: 'Point' }),
  message: text('message').notNull(),
  status: text('status', { enum: ['pending', 'approved', 'rejected'] }).notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Add this type for TypeScript support
export type PointRequest = typeof pointRequests.$inferSelect;
export type NewPointRequest = typeof pointRequests.$inferInsert;
function nanoid(): string | import("drizzle-orm").SQL<unknown> {
  throw new Error("Function not implemented.");
}

