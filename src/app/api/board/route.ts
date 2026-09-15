import { NextResponse } from "next/server";
import { initDb } from "@/lib/db";
import { getBoardSnapshot } from "@/lib/household";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const db = await initDb();
    const url = new URL(req.url);
    const viewer = url.searchParams.get("viewer");
    const snap = getBoardSnapshot(db, viewer);
    return NextResponse.json(snap);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "board_failed" },
      { status: 500 }
    );
  }
}
