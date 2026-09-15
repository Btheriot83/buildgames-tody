import fs from "fs";
import path from "path";
import type { AppDatabase } from "./db-types";
import { openSqlJsDatabase } from "./db-sqljs";

export type { AppDatabase, RunResult, Statement } from "./db-types";

const globalForDb = globalThis as unknown as {
  __tileboardDb?: AppDatabase;
  __tileboardDbInit?: Promise<AppDatabase>;
  __tileboardBackend?: "better-sqlite3" | "sql.js";
};

function resolveDbPath(): string {
  const configured = process.env.DATABASE_PATH;
  if (configured) {
    return path.isAbsolute(configured)
      ? configured
      : path.join(process.cwd(), configured);
  }
  if (process.env.VERCEL || process.env.USE_SQLJS === "1") {
    return path.join("/tmp", "tileboard.db");
  }
  return path.join(process.cwd(), "data", "tileboard.db");
}

export function migrate(db: AppDatabase) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS households (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      invite_code TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY,
      household_id TEXT NOT NULL,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'member',
      created_at TEXT NOT NULL,
      FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS rooms (
      id TEXT PRIMARY KEY,
      household_id TEXT NOT NULL,
      name TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS chores (
      id TEXT PRIMARY KEY,
      household_id TEXT NOT NULL,
      room_id TEXT NOT NULL,
      title TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      frequency_kind TEXT NOT NULL,
      frequency_n INTEGER NOT NULL DEFAULT 1,
      assignee_id TEXT,
      private INTEGER NOT NULL DEFAULT 0,
      photo_path TEXT,
      created_by TEXT NOT NULL,
      created_at TEXT NOT NULL,
      archived INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS completions (
      id TEXT PRIMARY KEY,
      chore_id TEXT NOT NULL,
      member_id TEXT NOT NULL,
      completed_at TEXT NOT NULL,
      note TEXT NOT NULL DEFAULT '',
      undone INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (chore_id) REFERENCES chores(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS inventory (
      id TEXT PRIMARY KEY,
      household_id TEXT NOT NULL,
      name TEXT NOT NULL,
      qty TEXT NOT NULL DEFAULT '1',
      room_id TEXT,
      notes TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS recipes (
      id TEXT PRIMARY KEY,
      household_id TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS undo_log (
      id TEXT PRIMARY KEY,
      household_id TEXT NOT NULL,
      action TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      applied INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_chores_hh ON chores(household_id);
    CREATE INDEX IF NOT EXISTS idx_completions_chore ON completions(chore_id);
    CREATE INDEX IF NOT EXISTS idx_members_hh ON members(household_id);
  `);
}

function preferSqlJs(): boolean {
  if (process.env.USE_SQLJS === "1") return true;
  if (process.env.USE_BETTER_SQLITE3 === "1") return false;
  // On Vercel / serverless: pure-JS only (no native addon).
  if (process.env.VERCEL) return true;
  // Local: try better-sqlite3 first; sql.js fallback if native missing.
  return false;
}

function tryOpenBetterSqlite3(dbPath: string): AppDatabase | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Database = require("better-sqlite3") as typeof import("better-sqlite3");
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    const db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    migrate(db as unknown as AppDatabase);
    return db as unknown as AppDatabase;
  } catch (err) {
    console.warn(
      "[tileboard] better-sqlite3 unavailable, using sql.js:",
      err instanceof Error ? err.message : err
    );
    return null;
  }
}

async function openDatabase(): Promise<AppDatabase> {
  const dbPath = resolveDbPath();
  if (!preferSqlJs()) {
    const native = tryOpenBetterSqlite3(dbPath);
    if (native) {
      globalForDb.__tileboardBackend = "better-sqlite3";
      return native;
    }
  }
  globalForDb.__tileboardBackend = "sql.js";
  const db = await openSqlJsDatabase({ filePath: dbPath });
  db.pragma("foreign_keys = ON");
  migrate(db);
  return db;
}

export async function initDb(): Promise<AppDatabase> {
  if (globalForDb.__tileboardDb) return globalForDb.__tileboardDb;
  if (!globalForDb.__tileboardDbInit) {
    globalForDb.__tileboardDbInit = openDatabase()
      .then((db) => {
        globalForDb.__tileboardDb = db;
        return db;
      })
      .catch((err) => {
        globalForDb.__tileboardDbInit = undefined;
        throw err;
      });
  }
  return globalForDb.__tileboardDbInit;
}

export function getDb(): AppDatabase {
  if (globalForDb.__tileboardDb) return globalForDb.__tileboardDb;
  if (!preferSqlJs()) {
    const native = tryOpenBetterSqlite3(resolveDbPath());
    if (native) {
      globalForDb.__tileboardDb = native;
      globalForDb.__tileboardBackend = "better-sqlite3";
      return native;
    }
  }
  throw new Error("Database not initialized. Call await initDb() first.");
}

export function getDbPath(): string {
  return resolveDbPath();
}

export function getDbBackend(): "better-sqlite3" | "sql.js" | "unknown" {
  return globalForDb.__tileboardBackend ?? "unknown";
}

export function createMemoryDb(): AppDatabase {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Database = require("better-sqlite3") as typeof import("better-sqlite3");
    const db = new Database(":memory:");
    db.pragma("foreign_keys = ON");
    migrate(db as unknown as AppDatabase);
    return db as unknown as AppDatabase;
  } catch {
    throw new Error("createMemoryDb requires better-sqlite3 locally");
  }
}

export async function createMemoryDbAsync(): Promise<AppDatabase> {
  const db = await openSqlJsDatabase({ filePath: null, memory: true });
  db.pragma("foreign_keys = ON");
  migrate(db);
  return db;
}
