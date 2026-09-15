import { NextResponse } from "next/server";
import { initDb } from "@/lib/db";
import {
  ensureHousehold,
  getBoardSnapshot,
  nextMemberColor,
} from "@/lib/household";
import { id } from "@/lib/ids";
import { memberInput } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = memberInput.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }
    const db = await initDb();
    const { householdId } = ensureHousehold(db);
    const memberId = id("m");
    const color = parsed.data.color ?? nextMemberColor(db, householdId);
    db.prepare(
      `INSERT INTO members (id, household_id, name, color, role, created_at)
       VALUES (?, ?, ?, ?, 'member', ?)`
    ).run(memberId, householdId, parsed.data.name, color, new Date().toISOString());
    return NextResponse.json({
      ok: true,
      memberId,
      board: getBoardSnapshot(db, memberId),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "member_failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const memberId = url.searchParams.get("id");
    if (!memberId) {
      return NextResponse.json({ error: "missing_id" }, { status: 400 });
    }
    const db = await initDb();
    const member = db
      .prepare("SELECT * FROM members WHERE id = ?")
      .get(memberId) as { role: string; household_id: string } | undefined;
    if (!member) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    if (member.role === "owner") {
      return NextResponse.json(
        { error: "cannot_remove_owner" },
        { status: 400 }
      );
    }
    db.prepare("DELETE FROM members WHERE id = ?").run(memberId);
    return NextResponse.json({
      ok: true,
      board: getBoardSnapshot(db),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "remove_failed" },
      { status: 500 }
    );
  }
}
