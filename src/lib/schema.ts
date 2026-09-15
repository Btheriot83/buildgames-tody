import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

/** Drizzle schema — tables mirrored in migrate() SQL for sql.js / better-sqlite3. */
export const households = sqliteTable("households", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  inviteCode: text("invite_code").notNull(),
  createdAt: text("created_at").notNull(),
});

export const members = sqliteTable("members", {
  id: text("id").primaryKey(),
  householdId: text("household_id").notNull(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  role: text("role").notNull().default("member"),
  createdAt: text("created_at").notNull(),
});

export const rooms = sqliteTable("rooms", {
  id: text("id").primaryKey(),
  householdId: text("household_id").notNull(),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const chores = sqliteTable("chores", {
  id: text("id").primaryKey(),
  householdId: text("household_id").notNull(),
  roomId: text("room_id").notNull(),
  title: text("title").notNull(),
  notes: text("notes").notNull().default(""),
  frequencyKind: text("frequency_kind").notNull(), // daily | every_n_days | weekly | monthly
  frequencyN: integer("frequency_n").notNull().default(1),
  assigneeId: text("assignee_id"),
  private: integer("private").notNull().default(0),
  photoPath: text("photo_path"),
  createdBy: text("created_by").notNull(),
  createdAt: text("created_at").notNull(),
  archived: integer("archived").notNull().default(0),
});

export const completions = sqliteTable("completions", {
  id: text("id").primaryKey(),
  choreId: text("chore_id").notNull(),
  memberId: text("member_id").notNull(),
  completedAt: text("completed_at").notNull(),
  note: text("note").notNull().default(""),
  undone: integer("undone").notNull().default(0),
});

export const inventory = sqliteTable("inventory", {
  id: text("id").primaryKey(),
  householdId: text("household_id").notNull(),
  name: text("name").notNull(),
  qty: text("qty").notNull().default("1"),
  roomId: text("room_id"),
  notes: text("notes").notNull().default(""),
  updatedAt: text("updated_at").notNull(),
});

export const recipes = sqliteTable("recipes", {
  id: text("id").primaryKey(),
  householdId: text("household_id").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull().default(""),
  createdAt: text("created_at").notNull(),
});

export const undoLog = sqliteTable("undo_log", {
  id: text("id").primaryKey(),
  householdId: text("household_id").notNull(),
  action: text("action").notNull(),
  payloadJson: text("payload_json").notNull(),
  createdAt: text("created_at").notNull(),
  applied: integer("applied").notNull().default(0),
});

export const meta = sqliteTable("meta", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});
