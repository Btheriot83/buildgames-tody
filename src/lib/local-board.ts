"use client";

/**
 * IndexedDB-first household board — Vercel-safe core loop.
 * Server sql.js APIs remain as optional sync/export mirrors.
 */

import {
  computeDue,
  computeStreak,
  sortChoresByUrgency,
  toISODate,
  type FrequencyKind,
} from "./frequency";

const DB_NAME = "tileboard-local";
const STORE = "kv";
const KEY = "household_v2";  // B2: reseed real Camelback household (not SAMPLE)

export type LocalMember = {
  id: string;
  name: string;
  color: string;
  role: "owner" | "member";
  createdAt: string;
};

export type LocalRoom = { id: string; name: string; sortOrder: number };

export type LocalChore = {
  id: string;
  roomId: string;
  title: string;
  notes: string;
  frequencyKind: FrequencyKind;
  frequencyN: number;
  assigneeId: string | null;
  private: boolean;
  createdBy: string;
  createdAt: string;
  archived: boolean;
};

export type LocalCompletion = {
  id: string;
  choreId: string;
  memberId: string;
  completedAt: string;
  note: string;
  undone: boolean;
};

export type LocalHousehold = {
  id: string;
  name: string;
  inviteCode: string;
  createdAt: string;
  members: LocalMember[];
  rooms: LocalRoom[];
  chores: LocalChore[];
  completions: LocalCompletion[];
  inventory: Array<{ id: string; name: string; qty: string }>;
  recipes: Array<{ id: string; title: string; body: string }>;
  activeMemberId: string;
  undoStack: Array<{ completionId: string }>;
};

function rid(prefix: string) {
  const a = new Uint8Array(8);
  crypto.getRandomValues(a);
  return (
    prefix +
    "_" +
    [...a].map((b) => b.toString(16).padStart(2, "0")).join("")
  );
}

function inviteCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const a = new Uint8Array(6);
  crypto.getRandomValues(a);
  return [...a].map((b) => alphabet[b % alphabet.length]).join("");
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getRaw(): Promise<LocalHousehold | null> {
  try {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(KEY);
      req.onsuccess = () => resolve((req.result as LocalHousehold) ?? null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

async function setRaw(data: LocalHousehold): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(data, KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

const COLORS = ["#2f5f9e", "#d63b2c", "#3d8f78", "#d4a017", "#8a5a3a", "#5c4a7a"];

export function seedHousehold(): LocalHousehold {
  const now = new Date().toISOString();
  const brandon = rid("m");
  const jordan = rid("m");
  const rooms = [
    "Kitchen",
    "Hall bath",
    "Living",
    "Laundry",
    "Garage bay",
  ].map((name, i) => ({
    id: rid("r"),
    name,
    sortOrder: i,
  }));
  // Real Camelback bungalow cadence — no SAMPLE / lorem titles
  const defs: Array<{
    title: string;
    room: number;
    kind: FrequencyKind;
    n: number;
    assignee?: string;
    notes?: string;
  }> = [
    {
      title: "Wipe island after dinner",
      room: 0,
      kind: "daily",
      n: 1,
      assignee: brandon,
      notes: "Crumb brush + citrus spray under the knife block",
    },
    {
      title: "Run & empty dishwasher",
      room: 0,
      kind: "daily",
      n: 1,
      assignee: jordan,
      notes: "Unload before bed so breakfast plates have a home",
    },
    {
      title: "Mop sticky kitchen tiles",
      room: 0,
      kind: "weekly",
      n: 1,
      notes: "Hot water + a drop of pine soap — skip the fancy shine",
    },
    {
      title: "Scrub hall shower glass",
      room: 1,
      kind: "every_n_days",
      n: 5,
      notes: "Hard-water ring from the Camelback well softener",
    },
    {
      title: "Restock soap & TP",
      room: 1,
      kind: "weekly",
      n: 2,
      assignee: jordan,
      notes: "Spare roll in the linen closet, left shelf",
    },
    {
      title: "Vacuum living rug",
      room: 2,
      kind: "weekly",
      n: 1,
      assignee: brandon,
      notes: "Dog hair under the south window bench",
    },
    {
      title: "Dust shelves & frames",
      room: 2,
      kind: "monthly",
      n: 1,
    },
    {
      title: "Start desert-dust laundry",
      room: 3,
      kind: "every_n_days",
      n: 3,
      assignee: jordan,
      notes: "Work shirts separate from towels",
    },
    {
      title: "Fold & put away",
      room: 3,
      kind: "every_n_days",
      n: 3,
    },
    {
      title: "Sweep garage bay grit",
      room: 4,
      kind: "weekly",
      n: 1,
      assignee: brandon,
      notes: "Diesel grit by the rolling toolbox — dustpan by the hose reel",
    },
  ];
  const chores: LocalChore[] = defs.map((c, i) => {
    const created = new Date();
    // Stagger so Today shows a mix of due + overdue, not a fake SAMPLE dump
    created.setUTCDate(created.getUTCDate() - (i % 6) - 1);
    return {
      id: rid("c"),
      roomId: rooms[c.room]!.id,
      title: c.title,
      notes: c.notes ?? "",
      frequencyKind: c.kind,
      frequencyN: c.n,
      assigneeId: c.assignee ?? null,
      private: false,
      createdBy: brandon,
      createdAt: created.toISOString(),
      archived: false,
    };
  });
  const completions: LocalCompletion[] = [];
  // Two recent stamps so streak reads real
  for (let i = 0; i < 2; i++) {
    const when = new Date();
    when.setUTCDate(when.getUTCDate() - (1 - i));
    when.setUTCHours(20, 10 + i * 12, 0, 0);
    completions.push({
      id: rid("x"),
      choreId: chores[i]!.id,
      memberId: i % 2 === 0 ? brandon : jordan,
      completedAt: when.toISOString(),
      note: "",
      undone: false,
    });
  }
  return {
    id: rid("hh"),
    name: "Camelback bungalow",
    inviteCode: inviteCode(),
    createdAt: now,
    members: [
      {
        id: brandon,
        name: "Brandon",
        color: COLORS[0]!,
        role: "owner",
        createdAt: now,
      },
      {
        id: jordan,
        name: "Jordan",
        color: COLORS[1]!,
        role: "member",
        createdAt: now,
      },
    ],
    rooms,
    chores,
    completions,
    inventory: [
      { id: rid("inv"), name: "Seventh Generation dish soap", qty: "¾ bottle" },
      { id: rid("inv"), name: "Bounty paper towels", qty: "1 roll + spare" },
      { id: rid("inv"), name: "Pine-Sol concentrate", qty: "half jug" },
      { id: rid("inv"), name: "Shop towels (garage)", qty: "blue box" },
    ],
    recipes: [
      {
        id: rid("rcp"),
        title: "Friday skillet pasta",
        body: "Boil salted water. Garlic + olive oil in the cast iron. Toss with the good Parmesan from Fry's.",
      },
    ],
    activeMemberId: brandon,
    undoStack: [],
  };
}

export type BoardView = {
  household: { id: string; name: string; invite_code: string };
  members: Array<{ id: string; name: string; color: string; role: string }>;
  rooms: Array<{ id: string; name: string; sort_order: number }>;
  chores: Array<{
    id: string;
    title: string;
    room_id: string;
    notes: string;
    frequency_kind: FrequencyKind;
    frequency_n: number;
    assignee_id: string | null;
    private: number;
  }>;
  due: ReturnType<typeof sortChoresByUrgency>;
  history: Array<{
    id: string;
    chore_title: string;
    member_name: string;
    member_color: string;
    completed_at: string;
    note: string;
  }>;
  streak: { current: number; best: number };
  inventory: Array<{ id: string; name: string; qty: string }>;
  recipes: Array<{ id: string; title: string; body: string }>;
  activeMemberId: string | null;
  today: string;
};

export function toBoardView(h: LocalHousehold): BoardView {
  const today = toISODate(new Date());
  const lastMap = new Map<string, string>();
  const live = h.completions.filter((c) => !c.undone);
  for (const c of [...live].sort((a, b) =>
    b.completedAt.localeCompare(a.completedAt)
  )) {
    if (!lastMap.has(c.choreId)) lastMap.set(c.choreId, c.completedAt);
  }
  const visible = h.chores.filter((c) => !c.archived);
  const due = sortChoresByUrgency(
    visible.map((ch) =>
      computeDue({
        choreId: ch.id,
        title: ch.title,
        roomId: ch.roomId,
        frequency: { kind: ch.frequencyKind, n: ch.frequencyN },
        lastCompletedAt: lastMap.get(ch.id) ?? null,
        createdAt: ch.createdAt,
        today,
      })
    )
  );
  const streak = computeStreak(
    live.map((c) => c.completedAt),
    today
  );
  const history = [...live]
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
    .slice(0, 40)
    .map((c) => {
      const chore = h.chores.find((x) => x.id === c.choreId);
      const member = h.members.find((m) => m.id === c.memberId);
      return {
        id: c.id,
        chore_title: chore?.title ?? "Chore",
        member_name: member?.name ?? "Someone",
        member_color: member?.color ?? "#3d7a7a",
        completed_at: c.completedAt,
        note: c.note,
      };
    });
  return {
    household: { id: h.id, name: h.name, invite_code: h.inviteCode },
    members: h.members.map((m) => ({
      id: m.id,
      name: m.name,
      color: m.color,
      role: m.role,
    })),
    rooms: h.rooms.map((r) => ({
      id: r.id,
      name: r.name,
      sort_order: r.sortOrder,
    })),
    chores: visible.map((c) => ({
      id: c.id,
      title: c.title,
      room_id: c.roomId,
      notes: c.notes,
      frequency_kind: c.frequencyKind,
      frequency_n: c.frequencyN,
      assignee_id: c.assigneeId,
      private: c.private ? 1 : 0,
    })),
    due,
    history,
    streak,
    inventory: h.inventory,
    recipes: h.recipes,
    activeMemberId: h.activeMemberId,
    today,
  };
}

export async function loadHousehold(): Promise<LocalHousehold> {
  const existing = await getRaw();
  if (existing) return existing;
  const seeded = seedHousehold();
  await setRaw(seeded);
  return seeded;
}

export async function saveHousehold(h: LocalHousehold) {
  await setRaw(h);
}

export async function completeLocal(
  h: LocalHousehold,
  choreId: string,
  memberId: string
): Promise<LocalHousehold> {
  const completionId = rid("x");
  const next: LocalHousehold = {
    ...h,
    completions: [
      {
        id: completionId,
        choreId,
        memberId,
        completedAt: new Date().toISOString(),
        note: "",
        undone: false,
      },
      ...h.completions,
    ],
    undoStack: [{ completionId }, ...h.undoStack].slice(0, 50),
  };
  await setRaw(next);
  return next;
}

export async function undoLocal(h: LocalHousehold): Promise<LocalHousehold> {
  const top = h.undoStack[0];
  if (!top) return h;
  const next: LocalHousehold = {
    ...h,
    completions: h.completions.map((c) =>
      c.id === top.completionId ? { ...c, undone: true } : c
    ),
    undoStack: h.undoStack.slice(1),
  };
  await setRaw(next);
  return next;
}

export async function addChoreLocal(
  h: LocalHousehold,
  opts: {
    title: string;
    roomId: string;
    frequencyKind: FrequencyKind;
    frequencyN?: number;
    notes?: string;
    createdBy: string;
  }
): Promise<LocalHousehold> {
  const next: LocalHousehold = {
    ...h,
    chores: [
      ...h.chores,
      {
        id: rid("c"),
        roomId: opts.roomId,
        title: opts.title,
        notes: opts.notes ?? "",
        frequencyKind: opts.frequencyKind,
        frequencyN: Math.max(1, opts.frequencyN ?? 1),
        assigneeId: null,
        private: false,
        createdBy: opts.createdBy,
        createdAt: new Date().toISOString(),
        archived: false,
      },
    ],
  };
  await setRaw(next);
  return next;
}

export async function addMemberLocal(
  h: LocalHousehold,
  name: string
): Promise<LocalHousehold> {
  const next: LocalHousehold = {
    ...h,
    members: [
      ...h.members,
      {
        id: rid("m"),
        name,
        color: COLORS[h.members.length % COLORS.length]!,
        role: "member",
        createdAt: new Date().toISOString(),
      },
    ],
  };
  await setRaw(next);
  return next;
}

export async function setActiveLocal(
  h: LocalHousehold,
  memberId: string
): Promise<LocalHousehold> {
  const next = { ...h, activeMemberId: memberId };
  await setRaw(next);
  return next;
}

export function exportLocalJSON(h: LocalHousehold) {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    householdId: h.id,
    local: true,
    data: h,
  };
}

export async function importLocalJSON(payload: unknown): Promise<LocalHousehold> {
  const p = payload as { data?: LocalHousehold; local?: boolean };
  if (!p?.data?.members || !p.data.chores) {
    throw new Error("invalid_backup");
  }
  await setRaw(p.data);
  return p.data;
}
