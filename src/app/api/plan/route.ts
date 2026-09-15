import { NextResponse } from "next/server";
import { PlanRequestSchema, planChoresFromRoom } from "@/lib/plan-chores";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = PlanRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Describe the room in a short paragraph (8+ chars)." },
      { status: 400 }
    );
  }
  try {
    const plan = await planChoresFromRoom(parsed.data);
    if (plan.mode === "unavailable") {
      return NextResponse.json(plan, { status: 503 });
    }
    return NextResponse.json(plan);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Plan failed" },
      { status: 500 }
    );
  }
}
