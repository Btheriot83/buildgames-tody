import { describe, expect, it, beforeAll } from "vitest";
import { createMemoryDbAsync } from "@/lib/db";
import {
  completeChore,
  getBoardSnapshot,
  seedHouseholdBoard,
  undoLast,
} from "@/lib/household";
import type { AppDatabase } from "@/lib/db-types";

describe("household board", () => {
  let db: AppDatabase;

  beforeAll(async () => {
    db = await createMemoryDbAsync();
    seedHouseholdBoard(db);
  });

  it("seeds members rooms chores", () => {
    const snap = getBoardSnapshot(db);
    expect(snap.members.length).toBeGreaterThanOrEqual(2);
    expect(snap.rooms.length).toBeGreaterThanOrEqual(3);
    expect(snap.chores.length).toBeGreaterThanOrEqual(5);
    expect(snap.household.invite_code).toHaveLength(6);
  });

  it("completes and undoes with attributable history", () => {
    const snap = getBoardSnapshot(db);
    const chore = snap.chores[0]!;
    const member = snap.members[0]!;
    const before = snap.history.length;
    completeChore(db, { choreId: chore.id, memberId: member.id });
    const mid = getBoardSnapshot(db);
    expect(mid.history.length).toBeGreaterThanOrEqual(before);
    expect(mid.history[0]?.member_name).toBe(member.name);
    const undone = undoLast(db, snap.household.id);
    expect(undone.ok).toBe(true);
  });
});
