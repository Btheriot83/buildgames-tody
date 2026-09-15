import { describe, expect, it } from "vitest";
import {
  computeDue,
  computeStreak,
  frequencyIntervalDays,
  nextDueAfter,
  sortChoresByUrgency,
} from "@/lib/frequency";

describe("frequency transforms", () => {
  it("computes intervals", () => {
    expect(frequencyIntervalDays({ kind: "daily", n: 1 })).toBe(1);
    expect(frequencyIntervalDays({ kind: "weekly", n: 2 })).toBe(14);
    expect(frequencyIntervalDays({ kind: "every_n_days", n: 5 })).toBe(5);
  });

  it("nextDueAfter for weekly and monthly", () => {
    expect(nextDueAfter("2026-09-01", { kind: "weekly", n: 1 })).toBe(
      "2026-09-08"
    );
    const monthly = nextDueAfter("2026-01-15", { kind: "monthly", n: 1 });
    expect(monthly).toBe("2026-02-15");
  });

  it("marks overdue chores and sorts urgency", () => {
    const a = computeDue({
      choreId: "1",
      title: "A",
      roomId: "r",
      frequency: { kind: "daily", n: 1 },
      lastCompletedAt: "2026-09-10T12:00:00.000Z",
      createdAt: "2026-09-01T00:00:00.000Z",
      today: "2026-09-14",
    });
    const b = computeDue({
      choreId: "2",
      title: "B",
      roomId: "r",
      frequency: { kind: "weekly", n: 1 },
      lastCompletedAt: "2026-09-13T12:00:00.000Z",
      createdAt: "2026-09-01T00:00:00.000Z",
      today: "2026-09-14",
    });
    expect(a.status).toBe("overdue");
    expect(a.overdueDays).toBeGreaterThan(0);
    const sorted = sortChoresByUrgency([b, a]);
    expect(sorted[0]?.choreId).toBe("1");
  });

  it("computes streaks across consecutive days", () => {
    const s = computeStreak(
      ["2026-09-12", "2026-09-13", "2026-09-14", "2026-09-10"],
      "2026-09-14"
    );
    expect(s.current).toBe(3);
    expect(s.best).toBeGreaterThanOrEqual(3);
  });
});

import { seedHousehold, toBoardView } from "@/lib/local-board";

describe("local board seed", () => {
  it("builds a usable board view without IndexedDB", () => {
    // seedHousehold uses crypto.getRandomValues — available in Node 20
    const h = seedHousehold();
    const view = toBoardView(h);
    expect(view.chores.length).toBeGreaterThan(5);
    expect(view.due.length).toBe(view.chores.length);
    expect(view.members.length).toBe(2);
    expect(view.household.invite_code).toHaveLength(6);
  });
});
