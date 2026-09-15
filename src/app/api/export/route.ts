import { NextResponse } from "next/server";
import { initDb } from "@/lib/db";
import {
  choresToCSV,
  ensureHousehold,
  exportHouseholdJSON,
  getBoardSnapshot,
} from "@/lib/household";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const db = await initDb();
    const { householdId } = ensureHousehold(db);
    const format = new URL(req.url).searchParams.get("format") ?? "json";
    if (format === "csv") {
      const snap = getBoardSnapshot(db);
      const csv = choresToCSV(snap.chores, snap.rooms, snap.due);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'attachment; filename="tileboard-chores.csv"',
        },
      });
    }
    const json = exportHouseholdJSON(db, householdId);
    return NextResponse.json(json);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "export_failed" },
      { status: 500 }
    );
  }
}
