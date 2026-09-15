/** Core chore scheduling transforms — unit-tested. */

export type FrequencyKind = "daily" | "every_n_days" | "weekly" | "monthly";

export type Frequency = {
  kind: FrequencyKind;
  n: number; // every n days / every n weeks / every n months
};

export type ChoreDue = {
  choreId: string;
  title: string;
  roomId: string;
  frequency: Frequency;
  lastCompletedAt: string | null;
  dueAt: string; // ISO date (YYYY-MM-DD) when next due
  overdueDays: number;
  status: "due" | "overdue" | "ok" | "fresh";
  /** 0..1 physical dirt pressure (Tody-style meter). 1 = max overdue. */
  dirt: number;
};

const DAY_MS = 86_400_000;

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number): string {
  const d = parseISODate(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return toISODate(d);
}

export function daysBetween(a: string, b: string): number {
  const ms = parseISODate(b).getTime() - parseISODate(a).getTime();
  return Math.round(ms / DAY_MS);
}

/** Interval in days for a frequency. */
export function frequencyIntervalDays(f: Frequency): number {
  const n = Math.max(1, Math.floor(f.n || 1));
  switch (f.kind) {
    case "daily":
      return n; // every n days, n=1 means daily
    case "every_n_days":
      return n;
    case "weekly":
      return 7 * n;
    case "monthly":
      return 30 * n; // approximate; due date uses calendar months below
    default:
      return n;
  }
}


/** Physical dirt fill 0..1 — rises through the interval, pegs at 1 when overdue. */
export function dirtFill(opts: {
  frequency: Frequency;
  lastCompletedAt: string | null;
  createdAt: string;
  today: string;
  overdueDays: number;
  status: ChoreDue["status"];
}): number {
  const interval = Math.max(1, frequencyIntervalDays(opts.frequency));
  const anchor = opts.lastCompletedAt
    ? opts.lastCompletedAt.slice(0, 10)
    : opts.createdAt.slice(0, 10);
  const elapsed = Math.max(0, daysBetween(anchor, opts.today));
  // Map elapsed/interval so due-today sits ~0.82 and overdue climbs to 1
  let fill = elapsed / interval;
  if (opts.status === "overdue") {
    fill = Math.min(1, 0.82 + Math.min(opts.overdueDays, interval) / interval * 0.18);
  } else if (opts.status === "due") {
    fill = Math.min(0.86, Math.max(0.72, fill));
  } else if (opts.status === "ok") {
    fill = Math.min(0.55, Math.max(0.28, fill));
  } else {
    fill = Math.min(0.22, fill);
  }
  return Math.max(0, Math.min(1, Number(fill.toFixed(3))));
}

/** Next due date after a completion (or creation) date. */
export function nextDueAfter(completedOn: string, f: Frequency): string {
  const n = Math.max(1, Math.floor(f.n || 1));
  if (f.kind === "monthly") {
    const d = parseISODate(completedOn);
    d.setUTCMonth(d.getUTCMonth() + n);
    return toISODate(d);
  }
  return addDays(completedOn, frequencyIntervalDays(f));
}

export function computeDue(opts: {
  choreId: string;
  title: string;
  roomId: string;
  frequency: Frequency;
  lastCompletedAt: string | null;
  createdAt: string;
  today: string;
}): ChoreDue {
  const anchor = opts.lastCompletedAt
    ? opts.lastCompletedAt.slice(0, 10)
    : opts.createdAt.slice(0, 10);
  const dueAt = opts.lastCompletedAt
    ? nextDueAfter(anchor, opts.frequency)
    : anchor; // never completed → due from created day
  const delta = daysBetween(dueAt, opts.today);
  let status: ChoreDue["status"];
  if (delta > 0) status = "overdue";
  else if (delta === 0) status = "due";
  else if (delta >= -1) status = "ok";
  else status = "fresh";
  const overdueDays = Math.max(0, delta);
  const dirt = dirtFill({
    frequency: opts.frequency,
    lastCompletedAt: opts.lastCompletedAt,
    createdAt: opts.createdAt,
    today: opts.today,
    overdueDays,
    status,
  });
  return {
    choreId: opts.choreId,
    title: opts.title,
    roomId: opts.roomId,
    frequency: opts.frequency,
    lastCompletedAt: opts.lastCompletedAt,
    dueAt,
    overdueDays,
    status,
    dirt,
  };
}

/** Sort: overdue first, then due today, then soonest due. */
export function sortChoresByUrgency(items: ChoreDue[]): ChoreDue[] {
  const rank = { overdue: 0, due: 1, ok: 2, fresh: 3 } as const;
  return [...items].sort((a, b) => {
    const r = rank[a.status] - rank[b.status];
    if (r !== 0) return r;
    if (a.overdueDays !== b.overdueDays) return b.overdueDays - a.overdueDays;
    return a.dueAt.localeCompare(b.dueAt);
  });
}

/** Streak: consecutive calendar days with ≥1 completion (not undone). */
export function computeStreak(
  completionDates: string[],
  today: string
): { current: number; best: number } {
  const set = new Set(completionDates.map((d) => d.slice(0, 10)));
  let current = 0;
  let cursor = today;
  // allow streak to count yesterday if today empty
  if (!set.has(today)) {
    cursor = addDays(today, -1);
  }
  while (set.has(cursor)) {
    current += 1;
    cursor = addDays(cursor, -1);
  }
  // best: scan all dates
  const sorted = [...set].sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of sorted) {
    if (prev && daysBetween(prev, d) === 1) run += 1;
    else run = 1;
    best = Math.max(best, run);
    prev = d;
  }
  return { current, best: Math.max(best, current) };
}

export function frequencyLabel(f: Frequency): string {
  const n = Math.max(1, f.n || 1);
  switch (f.kind) {
    case "daily":
      return n === 1 ? "Every day" : `Every ${n} days`;
    case "every_n_days":
      return `Every ${n} days`;
    case "weekly":
      return n === 1 ? "Weekly" : `Every ${n} weeks`;
    case "monthly":
      return n === 1 ? "Monthly" : `Every ${n} months`;
  }
}
