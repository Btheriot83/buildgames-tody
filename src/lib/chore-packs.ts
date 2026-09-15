import type { FrequencyKind } from "./frequency";

export type PackId = "kitchen" | "bath" | "living" | "weekly";

export type PackChoreDef = {
  title: string;
  roomName: string;
  kind: FrequencyKind;
  n: number;
  notes?: string;
};

export type ChorePack = {
  id: PackId;
  label: string;
  blurb: string;
  image: string;
  chores: PackChoreDef[];
};

/** Opinionated household preset packs — activation seeds. */
export const CHORE_PACKS: ChorePack[] = [
  {
    id: "kitchen",
    label: "Kitchen",
    blurb: "Island wipe, dishwasher, sticky tiles.",
    image: "/art/packs/kitchen.webp",
    chores: [
      {
        title: "Wipe island after dinner",
        roomName: "Kitchen",
        kind: "daily",
        n: 1,
        notes: "Crumb brush + citrus spray",
      },
      {
        title: "Run & empty dishwasher",
        roomName: "Kitchen",
        kind: "daily",
        n: 1,
      },
      {
        title: "Mop sticky kitchen tiles",
        roomName: "Kitchen",
        kind: "weekly",
        n: 1,
      },
    ],
  },
  {
    id: "bath",
    label: "Bath",
    blurb: "Shower glass, soap & TP restock.",
    image: "/art/packs/bath.webp",
    chores: [
      {
        title: "Scrub hall shower glass",
        roomName: "Hall bath",
        kind: "every_n_days",
        n: 5,
      },
      {
        title: "Restock soap & TP",
        roomName: "Hall bath",
        kind: "weekly",
        n: 2,
      },
    ],
  },
  {
    id: "living",
    label: "Living",
    blurb: "Rug vacuum, shelves & frames.",
    image: "/art/packs/living.webp",
    chores: [
      {
        title: "Vacuum living rug",
        roomName: "Living",
        kind: "weekly",
        n: 1,
      },
      {
        title: "Dust shelves & frames",
        roomName: "Living",
        kind: "monthly",
        n: 1,
      },
    ],
  },
  {
    id: "weekly",
    label: "Weekly reset",
    blurb: "Laundry cycle + garage grit sweep.",
    image: "/art/packs/weekly.webp",
    chores: [
      {
        title: "Start desert-dust laundry",
        roomName: "Laundry",
        kind: "every_n_days",
        n: 3,
      },
      {
        title: "Fold & put away",
        roomName: "Laundry",
        kind: "every_n_days",
        n: 3,
      },
      {
        title: "Sweep garage bay grit",
        roomName: "Garage bay",
        kind: "weekly",
        n: 1,
      },
    ],
  },
];

export function packById(id: PackId): ChorePack | undefined {
  return CHORE_PACKS.find((p) => p.id === id);
}
