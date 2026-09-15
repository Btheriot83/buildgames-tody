import { z } from "zod";

export const frequencyKindSchema = z.enum([
  "daily",
  "every_n_days",
  "weekly",
  "monthly",
]);

export const memberInput = z.object({
  name: z.string().trim().min(1).max(40),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});

export const choreInput = z.object({
  title: z.string().trim().min(1).max(80),
  roomId: z.string().min(1),
  notes: z.string().max(500).optional().default(""),
  frequencyKind: frequencyKindSchema,
  frequencyN: z.number().int().min(1).max(365).optional().default(1),
  assigneeId: z.string().nullable().optional(),
  private: z.boolean().optional().default(false),
  createdBy: z.string().min(1),
});

export const completeInput = z.object({
  choreId: z.string().min(1),
  memberId: z.string().min(1),
  note: z.string().max(200).optional().default(""),
  completedAt: z.string().datetime().optional(),
});

export const inventoryInput = z.object({
  name: z.string().trim().min(1).max(80),
  qty: z.string().trim().min(1).max(40).optional().default("1"),
  roomId: z.string().nullable().optional(),
  notes: z.string().max(300).optional().default(""),
});

export const recipeInput = z.object({
  title: z.string().trim().min(1).max(100),
  body: z.string().max(4000).optional().default(""),
});

export const MAX_PHOTO_BYTES = 1_500_000; // ~1.5MB
