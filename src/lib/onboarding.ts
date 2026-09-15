/** Tileboard friend-walkthrough persistence — see docs/ONBOARDING.md */

import type { PackId } from "./chore-packs";

export const ONBOARD_DONE_KEY = "tileboard.onboarded.v1";
export const ONBOARD_STEP_KEY = "tileboard.onboard.step.v1";
export const ONBOARD_PACKS_KEY = "tileboard.onboard.packs.v1";

export type OnboardCardId = "start" | "packs" | "housemate" | "today" | "done";

export type OnboardCard = {
  id: OnboardCardId;
  title: string;
  body: string;
  cta: string;
};

/** Hand-locked copy — wire exactly (hand-rewrite-copy). */
export const ONBOARD_CARDS: OnboardCard[] = [
  {
    id: "start",
    title: "Hey — let's get this house on a list.",
    body: "I'll stay beside you for a minute. Skip anytime if you already know the drill.",
    cta: "Show me the packs",
  },
  {
    id: "packs",
    title: "Pick what this house needs.",
    body: "Kitchen, bath, living, weekly reset — tap the cards you want. We'll stamp them onto Today.",
    cta: "Stamp these on",
  },
  {
    id: "housemate",
    title: "Who else lives here?",
    body: "Add a name for the invite plate — or leave a placeholder and fill it later.",
    cta: "Save housemate",
  },
  {
    id: "today",
    title: "Today's list is ready.",
    body: "Press a chore once to ink-check it. Shared house — switch who's checking anytime.",
    cta: "Open Today",
  },
  {
    id: "done",
    title: "You're set.",
    body: "Assign, due dates, rooms — all on the board. I'll get out of the way.",
    cta: "Done",
  },
];

export function readOnboarded(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(ONBOARD_DONE_KEY) === "1";
  } catch {
    return true;
  }
}

export function readOnboardStep(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(ONBOARD_STEP_KEY);
    if (raw == null) return 0;
    const n = Number(raw);
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.min(n, ONBOARD_CARDS.length - 1);
  } catch {
    return 0;
  }
}

export function writeOnboardStep(step: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ONBOARD_STEP_KEY, String(step));
  } catch {
    /* private mode */
  }
}

export function readSelectedPacks(): PackId[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ONBOARD_PACKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is PackId =>
        x === "kitchen" || x === "bath" || x === "living" || x === "weekly"
    );
  } catch {
    return [];
  }
}

export function writeSelectedPacks(ids: PackId[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ONBOARD_PACKS_KEY, JSON.stringify(ids));
  } catch {
    /* private mode */
  }
}

export function markOnboarded(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ONBOARD_DONE_KEY, "1");
    window.localStorage.removeItem(ONBOARD_STEP_KEY);
  } catch {
    /* private mode */
  }
}

export function clearOnboardFlags(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ONBOARD_DONE_KEY);
    window.localStorage.removeItem(ONBOARD_STEP_KEY);
    window.localStorage.removeItem(ONBOARD_PACKS_KEY);
  } catch {
    /* private mode */
  }
}
