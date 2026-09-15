import { NextResponse } from "next/server";
import { initDb } from "@/lib/db";
import { ensureHousehold, getBoardSnapshot } from "@/lib/household";
import { id } from "@/lib/ids";
import { recipeInput } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const parsed = recipeInput.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }
    const db = await initDb();
    const { householdId } = ensureHousehold(db);
    const rId = id("rcp");
    db.prepare(
      `INSERT INTO recipes (id, household_id, title, body, created_at)
       VALUES (?, ?, ?, ?, ?)`
    ).run(
      rId,
      householdId,
      parsed.data.title,
      parsed.data.body ?? "",
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
