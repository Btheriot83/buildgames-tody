import type { AppDatabase } from "./db-types";
import {
  computeDue,
  computeStreak,
  sortChoresByUrgency,
  type Frequency,
  type FrequencyKind,
  toISODate,
} from "./frequency";
import { id, inviteCode } from "./ids";

export type Member = {
  id: string;
  household_id: string;
  name: string;
  color: string;
  role: string;
  created_at: string;
};

export type Room = {
  id: string;
  household_id: string;
  name: string;
  sort_order: number;
};

export type Chore = {
  id: string;
  household_id: string;
  room_id: string;
  title: string;
  notes: string;
  frequency_kind: FrequencyKind;
  frequency_n: number;
  assignee_id: string | null;
  private: number;
  photo_path: string | null;
  created_by: string;
  created_at: string;
  archived: number;
};

export type Completion = {
  id: string;
  chore_id: string;
  member_id: string;
  completed_at: string;
  note: string;
  undone: number;
};

const MEMBER_COLORS = ["#3d7a7a", "#c45c3a", "#4a6b52", "#2f4a6e", "#8a5a3a", "#5c4a7a"];

export function ensureHousehold(db: AppDatabase): {
  householdId: string;
  inviteCode: string;
} {
  const existing = db
    .prepare("SELECT id, invite_code FROM households LIMIT 1")
    .get() as { id: string; invite_code: string } | undefined;
  if (existing) {
    return { householdId: existing.id, inviteCode: existing.invite_code };
  }
  return seedHouseholdBoard(db);
}

/** Real Camelback household board — not SAMPLE/lorem. */
export function seedHouseholdBoard(db: AppDatabase): {
  householdId: string;
  inviteCode: string;
} {
  const now = new Date().toISOString();
  const householdId = id("hh");
  const code = inviteCode();
  db.prepare(
    "INSERT INTO households (id, name, invite_code, created_at) VALUES (?, ?, ?, ?)"
  ).run(householdId, "Camelback bungalow", code, now);

  const brandon = id("m");
  const partner = id("m");
  db.prepare(
    "INSERT INTO members (id, household_id, name, color, role, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(brandon, householdId, "Brandon", MEMBER_COLORS[0], "owner", now);
  db.prepare(
    "INSERT INTO members (id, household_id, name, color, role, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(partner, householdId, "Jordan", MEMBER_COLORS[1], "member", now);

  const roomDefs = ["Kitchen", "Hall bath", "Living", "Laundry", "Garage bay"];
  const roomIds: string[] = [];
  roomDefs.forEach((name, i) => {
    const rid = id("r");
    roomIds.push(rid);
    db.prepare(
      "INSERT INTO rooms (id, household_id, name, sort_order) VALUES (?, ?, ?, ?)"
    ).run(rid, householdId, name, i);
  });

  const choreDefs: Array<{
    title: string;
    room: number;
    kind: FrequencyKind;
    n: number;
    assignee?: string;
  }> = [
    { title: "Wipe island after dinner", room: 0, kind: "daily", n: 1, assignee: brandon },
    { title: "Run & empty dishwasher", room: 0, kind: "daily", n: 1, assignee: partner },
    { title: "Mop sticky kitchen tiles", room: 0, kind: "weekly", n: 1 },
    { title: "Scrub hall shower glass", room: 1, kind: "every_n_days", n: 5 },
    { title: "Restock soap & TP", room: 1, kind: "weekly", n: 2, assignee: partner },
    { title: "Vacuum living rug", room: 2, kind: "weekly", n: 1, assignee: brandon },
    { title: "Dust shelves & frames", room: 2, kind: "monthly", n: 1 },
    { title: "Start desert-dust laundry", room: 3, kind: "every_n_days", n: 3, assignee: partner },
    { title: "Fold & put away", room: 3, kind: "every_n_days", n: 3 },
    { title: "Sweep garage bay grit", room: 4, kind: "weekly", n: 1, assignee: brandon },
  ];

  const today = toISODate(new Date());
  choreDefs.forEach((c, i) => {
    const cid = id("c");
    // stagger created dates so some are overdue
    const created = new Date();
    created.setUTCDate(created.getUTCDate() - (i % 5) - 1);
    db.prepare(
      `INSERT INTO chores
        (id, household_id, room_id, title, notes, frequency_kind, frequency_n,
         assignee_id, private, photo_path, created_by, created_at, archived)
       VALUES (?, ?, ?, ?, '', ?, ?, ?, 0, NULL, ?, ?, 0)`
    ).run(
      cid,
      householdId,
      roomIds[c.room],
      c.title,
      c.kind,
      c.n,
      c.assignee ?? null,
      brandon,
      created.toISOString()
    );
    // seed a couple completions for streak
    if (i < 3) {
      const when = new Date();
      when.setUTCDate(when.getUTCDate() - (2 - i));
      db.prepare(
        `INSERT INTO completions (id, chore_id, member_id, completed_at, note, undone)
         VALUES (?, ?, ?, ?, '', 0)`
      ).run(id("x"), cid, i % 2 === 0 ? brandon : partner, when.toISOString());
    }
  });

  db.prepare(
    `INSERT INTO inventory (id, household_id, name, qty, room_id, notes, updated_at)
     VALUES (?, ?, ?, ?, ?, '', ?)`
  ).run(id("inv"), householdId, "Dish soap", "1 bottle", roomIds[0], now);
  db.prepare(
    `INSERT INTO inventory (id, household_id, name, qty, room_id, notes, updated_at)
     VALUES (?, ?, ?, ?, ?, '', ?)`
  ).run(id("inv"), householdId, "Paper towels", "2 rolls", roomIds[0], now);

  db.prepare(
    `INSERT INTO recipes (id, household_id, title, body, created_at) VALUES (?, ?, ?, ?, ?)`
  ).run(
    id("rcp"),
    householdId,
    "Friday skillet pasta",
    "Boil salted water. Garlic + olive oil in the cast iron. Toss with the good Parmesan from Fry's.",
    now
  );

  db.prepare(
    "INSERT OR REPLACE INTO meta (key, value) VALUES ('seeded_at', ?)"
  ).run(now);
  db.prepare(
    "INSERT OR REPLACE INTO meta (key, value) VALUES ('active_member', ?)"
  ).run(brandon);

  void today;
  return { householdId, inviteCode: code };
}

export function getBoardSnapshot(db: AppDatabase, viewerId?: string | null) {
  const { householdId, inviteCode: code } = ensureHousehold(db);
  const household = db
    .prepare("SELECT * FROM households WHERE id = ?")
    .get(householdId) as {
    id: string;
    name: string;
    invite_code: string;
    created_at: string;
  };

  const members = db
    .prepare(
      "SELECT * FROM members WHERE household_id = ? ORDER BY created_at ASC"
    )
    .all(householdId) as Member[];

  const rooms = db
    .prepare(
      "SELECT * FROM rooms WHERE household_id = ? ORDER BY sort_order ASC"
    )
    .all(householdId) as Room[];

  const chores = db
    .prepare(
      "SELECT * FROM chores WHERE household_id = ? AND archived = 0 ORDER BY created_at ASC"
    )
    .all(householdId) as Chore[];

  const visible = chores.filter((c) => {
    if (!c.private) return true;
    if (!viewerId) return true;
    return c.created_by === viewerId || c.assignee_id === viewerId;
  });

  const lastMap = new Map<string, string>();
  const completions = db
    .prepare(
      `SELECT c.* FROM completions c
       JOIN chores ch ON ch.id = c.chore_id
       WHERE ch.household_id = ? AND c.undone = 0
       ORDER BY c.completed_at DESC`
    )
    .all(householdId) as Completion[];

  for (const c of completions) {
    if (!lastMap.has(c.chore_id)) lastMap.set(c.chore_id, c.completed_at);
  }

  const today = toISODate(new Date());
  const due = sortChoresByUrgency(
    visible.map((ch) =>
      computeDue({
        choreId: ch.id,
        title: ch.title,
        roomId: ch.room_id,
        frequency: {
          kind: ch.frequency_kind,
          n: ch.frequency_n,
        } satisfies Frequency,
        lastCompletedAt: lastMap.get(ch.id) ?? null,
        createdAt: ch.created_at,
        today,
      })
    )
  );

  const streak = computeStreak(
    completions.map((c) => c.completed_at),
    today
  );

  const inventory = db
    .prepare(
      "SELECT * FROM inventory WHERE household_id = ? ORDER BY name ASC"
    )
    .all(householdId);

  const recipes = db
    .prepare(
      "SELECT * FROM recipes WHERE household_id = ? ORDER BY created_at DESC"
    )
    .all(householdId);

  const history = completions.slice(0, 40).map((c) => {
    const chore = chores.find((x) => x.id === c.chore_id);
    const member = members.find((m) => m.id === c.member_id);
    return {
      ...c,
      chore_title: chore?.title ?? "Chore",
      member_name: member?.name ?? "Someone",
      member_color: member?.color ?? "#3d7a7a",
    };
  });

  const activeMeta = db
    .prepare("SELECT value FROM meta WHERE key = 'active_member'")
    .get() as { value: string } | undefined;

  return {
    household: { ...household, invite_code: code },
    members,
    rooms,
    chores: visible,
    due,
    history,
    streak,
    inventory,
    recipes,
    activeMemberId: activeMeta?.value ?? members[0]?.id ?? null,
    today,
  };
}

export function completeChore(
  db: AppDatabase,
  opts: { choreId: string; memberId: string; note?: string; at?: string }
) {
  const at = opts.at ?? new Date().toISOString();
  const completionId = id("x");
  db.prepare(
    `INSERT INTO completions (id, chore_id, member_id, completed_at, note, undone)
     VALUES (?, ?, ?, ?, ?, 0)`
  ).run(completionId, opts.choreId, opts.memberId, at, opts.note ?? "");

  const undoId = id("u");
  db.prepare(
    `INSERT INTO undo_log (id, household_id, action, payload_json, created_at, applied)
     VALUES (?, (SELECT household_id FROM chores WHERE id = ?), 'complete', ?, ?, 0)`
  ).run(
    undoId,
    opts.choreId,
    JSON.stringify({ completionId }),
    at
  );

  return { completionId, undoId };
}

export function undoLast(db: AppDatabase, householdId: string) {
  const row = db
    .prepare(
      `SELECT * FROM undo_log
       WHERE household_id = ? AND applied = 0
       ORDER BY created_at DESC LIMIT 1`
    )
    .get(householdId) as
    | {
        id: string;
        action: string;
        payload_json: string;
      }
    | undefined;
  if (!row) return { ok: false as const, reason: "nothing_to_undo" };
  const payload = JSON.parse(row.payload_json) as { completionId?: string };
  if (row.action === "complete" && payload.completionId) {
    db.prepare("UPDATE completions SET undone = 1 WHERE id = ?").run(
      payload.completionId
    );
  }
  db.prepare("UPDATE undo_log SET applied = 1 WHERE id = ?").run(row.id);
  return { ok: true as const, undoId: row.id };
}

export function exportHouseholdJSON(db: AppDatabase, householdId: string) {
  const tables = [
    "households",
    "members",
    "rooms",
    "chores",
    "completions",
    "inventory",
    "recipes",
  ] as const;
  const data: Record<string, unknown[]> = {};
  for (const t of tables) {
    if (t === "households") {
      data[t] = db
        .prepare("SELECT * FROM households WHERE id = ?")
        .all(householdId);
    } else {
      data[t] = db
        .prepare(`SELECT * FROM ${t} WHERE household_id = ?`)
        .all(householdId);
    }
  }
  // completions via chore join already filtered? completions don't have household_id
  data.completions = db
    .prepare(
      `SELECT c.* FROM completions c
       JOIN chores ch ON ch.id = c.chore_id
       WHERE ch.household_id = ?`
    )
    .all(householdId);
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    householdId,
    data,
  };
}

export function choresToCSV(
  chores: Chore[],
  rooms: Room[],
  due: ReturnType<typeof sortChoresByUrgency>
): string {
  const roomName = (id: string) => rooms.find((r) => r.id === id)?.name ?? "";
  const dueMap = new Map(due.map((d) => [d.choreId, d]));
  const header = [
    "title",
    "room",
    "frequency",
    "n",
    "due",
    "status",
    "private",
  ];
  const lines = [header.join(",")];
  for (const c of chores) {
    const d = dueMap.get(c.id);
    const cells = [
      csv(c.title),
      csv(roomName(c.room_id)),
      c.frequency_kind,
      String(c.frequency_n),
      d?.dueAt ?? "",
      d?.status ?? "",
      c.private ? "1" : "0",
    ];
    lines.push(cells.join(","));
  }
  return lines.join("\n");
}

function csv(s: string) {
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function nextMemberColor(db: AppDatabase, householdId: string): string {
  const count = (
    db
      .prepare("SELECT COUNT(*) as n FROM members WHERE household_id = ?")
      .get(householdId) as { n: number }
  ).n;
  return MEMBER_COLORS[count % MEMBER_COLORS.length]!;
}
