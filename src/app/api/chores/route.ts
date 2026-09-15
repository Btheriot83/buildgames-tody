import { NextResponse } from "next/server";
import { initDb } from "@/lib/db";
import { ensureHousehold, getBoardSnapshot } from "@/lib/household";
import { id } from "@/lib/ids";
import { choreInput } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = choreInput.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "invalid", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const db = await initDb();
    const { householdId } = ensureHousehold(db);
    const choreId = id("c");
    const now = new Date().toISOString();
    db.prepare(
      `INSERT INTO chores
        (id, household_id, room_id, title, notes, frequency_kind, frequency_n,
         assignee_id, private, photo_path, created_by, created_at, archived)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, 0)`
    ).run(
      choreId,
      householdId,
      parsed.data.roomId,
      parsed.data.title,
      parsed.data.notes ?? "",
      parsed.data.frequencyKind,
      parsed.data.frequencyN ?? 1,
      parsed.data.assigneeId ?? null,
      parsed.data.private ? 1 : 0,
      parsed.data.createdBy,
      now
    );
    return NextResponse.json({
      ok: true,
      choreId,
      board: getBoardSnapshot(db, parsed.data.createdBy),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "chore_failed" },
      { status: 500 }
    );
  }
}
