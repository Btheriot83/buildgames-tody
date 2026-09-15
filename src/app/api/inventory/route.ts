import { NextResponse } from "next/server";
import { initDb } from "@/lib/db";
import { ensureHousehold, getBoardSnapshot } from "@/lib/household";
import { id } from "@/lib/ids";
import { inventoryInput } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const parsed = inventoryInput.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }
    const db = await initDb();
    const { householdId } = ensureHousehold(db);
    const invId = id("inv");
    db.prepare(
      `INSERT INTO inventory (id, household_id, name, qty, room_id, notes, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(
      invId,
      householdId,
      parsed.data.name,
      parsed.data.qty ?? "1",
      parsed.data.roomId ?? null,
      parsed.data.notes ?? "",
      new Date().toISOString()
    );
    return NextResponse.json({ ok: true, board: getBoardSnapshot(db) });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "failed" },
      { status: 500 }
    );
  }
}
