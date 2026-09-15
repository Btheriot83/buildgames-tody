import { NextResponse } from "next/server";
import { initDb } from "@/lib/db";
import { completeChore, getBoardSnapshot } from "@/lib/household";
import { completeInput } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = completeInput.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "invalid", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const db = await initDb();
    const result = completeChore(db, {
      choreId: parsed.data.choreId,
      memberId: parsed.data.memberId,
      note: parsed.data.note,
      at: parsed.data.completedAt,
    });
    const snap = getBoardSnapshot(db, parsed.data.memberId);
    return NextResponse.json({ ok: true, ...result, board: snap });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "complete_failed" },
      { status: 500 }
    );
  }
}
