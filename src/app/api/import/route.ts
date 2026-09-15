import { NextResponse } from "next/server";
import { initDb } from "@/lib/db";
import { getBoardSnapshot } from "@/lib/household";

export const dynamic = "force-dynamic";

type ImportPayload = {
  version?: number;
  data?: {
    households?: Array<Record<string, unknown>>;
    members?: Array<Record<string, unknown>>;
    rooms?: Array<Record<string, unknown>>;
    chores?: Array<Record<string, unknown>>;
    completions?: Array<Record<string, unknown>>;
    inventory?: Array<Record<string, unknown>>;
    recipes?: Array<Record<string, unknown>>;
  };
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ImportPayload;
    if (!body?.data?.households?.length) {
      return NextResponse.json({ error: "invalid_backup" }, { status: 400 });
    }
    const db = await initDb();
    // Replace local household data (owner-controlled restore).
    db.exec(`
      DELETE FROM completions;
      DELETE FROM undo_log;
      DELETE FROM chores;
      DELETE FROM inventory;
      DELETE FROM recipes;
      DELETE FROM rooms;
      DELETE FROM members;
      DELETE FROM households;
    `);

    const runInsert = (table: string, rows: Array<Record<string, unknown>>) => {
      for (const row of rows) {
        const keys = Object.keys(row);
        const placeholders = keys.map(() => "?").join(",");
        db.prepare(
          `INSERT OR REPLACE INTO ${table} (${keys.join(",")}) VALUES (${placeholders})`
        ).run(...keys.map((k) => row[k]));
      }
    };

    runInsert("households", body.data.households);
    runInsert("members", body.data.members ?? []);
    runInsert("rooms", body.data.rooms ?? []);
    runInsert("chores", body.data.chores ?? []);
    runInsert("completions", body.data.completions ?? []);
    runInsert("inventory", body.data.inventory ?? []);
    runInsert("recipes", body.data.recipes ?? []);

    return NextResponse.json({ ok: true, board: getBoardSnapshot(db) });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "import_failed" },
      { status: 500 }
    );
  }
}
