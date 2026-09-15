import { NextResponse } from "next/server";
import { initDb } from "@/lib/db";
import { getBoardSnapshot } from "@/lib/household";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { memberId } = (await req.json()) as { memberId?: string };
    if (!memberId) {
      return NextResponse.json({ error: "missing" }, { status: 400 });
    }
    const db = await initDb();
    db.prepare(
      "INSERT OR REPLACE INTO meta (key, value) VALUES ('active_member', ?)"
    ).run(memberId);
    return NextResponse.json({ ok: true, board: getBoardSnapshot(db, memberId) });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "failed" },
      { status: 500 }
    );
  }
}
