import { NextResponse } from "next/server";
import { initDb } from "@/lib/db";
import { ensureHousehold, getBoardSnapshot, undoLast } from "@/lib/household";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      viewerId?: string;
    };
    const db = await initDb();
    const { householdId } = ensureHousehold(db);
    const result = undoLast(db, householdId);
    const board = getBoardSnapshot(db, body.viewerId);
    return NextResponse.json({ ...result, board });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "undo_failed" },
      { status: 500 }
    );
  }
}
