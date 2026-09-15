import { z } from "zod";

export const PlanRequestSchema = z.object({
  roomDescription: z.string().min(8).max(1200),
  roomName: z.string().min(1).max(80).optional(),
});

export type PlannedChore = {
  title: string;
  frequencyKind: "daily" | "every_n_days" | "weekly" | "monthly";
  frequencyN: number;
  notes?: string;
};

export type PlanResult = {
  roomName: string;
  chores: PlannedChore[];
  rationale: string;
  mode: "xai" | "openai" | "anthropic" | "unavailable";
  model?: string;
};

const SYSTEM = `You are a household chore planner for Tileboard (a Tody-like app).
Given a room description, return JSON only:
{
  "roomName": "short room name",
  "rationale": "one concrete sentence",
  "chores": [
    { "title": "verb-first chore", "frequencyKind": "daily|every_n_days|weekly|monthly", "frequencyN": 1, "notes": "optional short tip" }
  ]
}
Rules:
- 4–8 chores, specific to the described room (not generic SaaS).
- Titles under 40 chars, verb-first ("Wipe counters", not "Counter maintenance").
- Realistic frequencies for that room.
- No emoji, no fake stats, no purple marketing tone.`;

function parsePlanJson(raw: string): Omit<PlanResult, "mode" | "model"> | null {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    const parsed = JSON.parse(raw.slice(start, end + 1)) as {
      roomName?: string;
      rationale?: string;
      chores?: PlannedChore[];
    };
    if (!parsed.chores?.length) return null;
    const chores = parsed.chores
      .filter((c) => c?.title && c?.frequencyKind)
      .slice(0, 8)
      .map((c) => ({
        title: String(c.title).slice(0, 60),
        frequencyKind: c.frequencyKind,
        frequencyN: Math.max(1, Number(c.frequencyN) || 1),
        notes: c.notes ? String(c.notes).slice(0, 120) : undefined,
      }));
    if (!chores.length) return null;
    return {
      roomName: (parsed.roomName || "Room").slice(0, 80),
      rationale: (parsed.rationale || "Plan shaped to the room you described.").slice(
        0,
        240
      ),
      chores,
    };
  } catch {
    return null;
  }
}

async function callOpenAICompat(
  baseUrl: string,
  apiKey: string,
  model: string,
  user: string
): Promise<string | null> {
  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content ?? null;
}

async function callAnthropic(
  baseUrl: string,
  apiKey: string,
  model: string,
  user: string
): Promise<string | null> {
  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/v1/messages`, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      Authorization: `Bearer ${apiKey}`,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1600,
      temperature: 0.4,
      system: SYSTEM,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    content?: { type: string; text?: string }[];
  };
  const text = (data.content || [])
    .filter((c) => c.type === "text" && c.text)
    .map((c) => c.text!)
    .join("\n");
  return text || null;
}

type Attempt = {
  mode: PlanResult["mode"];
  model: string;
  run: () => Promise<string | null>;
};

function buildAttempts(user: string): Attempt[] {
  const shared = process.env.BUILD_GAMES_LLM_API_KEY?.trim();
  const attempts: Attempt[] = [];

  const xaiExplicit =
    process.env.XAI_API_KEY?.trim() ||
    process.env.GROK_API_KEY?.trim() ||
    (shared?.startsWith("xai-") ? shared : undefined);
  const xaiModel =
    process.env.XAI_MODEL?.trim() ||
    process.env.GROK_MODEL?.trim() ||
    "grok-4.6";

  // Prefer xAI when keyed (LLM.md)
  if (xaiExplicit) {
    attempts.push({
      mode: "xai",
      model: xaiModel,
      run: () =>
        callOpenAICompat("https://api.x.ai/v1", xaiExplicit, xaiModel, user),
    });
  } else if (shared) {
    // Shared box key — try xAI first even without xai- prefix
    attempts.push({
      mode: "xai",
      model: xaiModel,
      run: () => callOpenAICompat("https://api.x.ai/v1", shared, xaiModel, user),
    });
  }

  const openai =
    process.env.OPENAI_API_KEY?.trim() ||
    (shared && !shared.startsWith("xai-") ? shared : undefined);
  if (openai) {
    const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
    const base = process.env.OPENAI_BASE_URL?.trim() || "https://api.openai.com/v1";
    attempts.push({
      mode: "openai",
      model,
      run: () => callOpenAICompat(base, openai, model, user),
    });
  }

  const anth =
    process.env.ANTHROPIC_AUTH_TOKEN?.trim() ||
    process.env.ANTHROPIC_API_KEY?.trim();
  const anthBase = process.env.ANTHROPIC_BASE_URL?.trim();
  if (anth && anthBase) {
    const rawModel = process.env.ANTHROPIC_MODEL?.trim() || "glm-5.3";
    const model = rawModel.includes("[") ? rawModel.split("[", 1)[0]! : rawModel;
    attempts.push({
      mode: "anthropic",
      model,
      run: () => callAnthropic(anthBase, anth, model, user),
    });
  }

  return attempts;
}

/** Real AI only — no canned fake plans. */
export async function planChoresFromRoom(input: {
  roomDescription: string;
  roomName?: string;
}): Promise<PlanResult> {
  const user = `Room name hint: ${input.roomName || "(infer)"}\nDescription:\n${input.roomDescription}`;
  const attempts = buildAttempts(user);
  for (const attempt of attempts) {
    try {
      const raw = await attempt.run();
      const parsed = raw ? parsePlanJson(raw) : null;
      if (parsed?.chores.length) {
        return { ...parsed, mode: attempt.mode, model: attempt.model };
      }
    } catch {
      /* try next */
    }
  }
  return {
    roomName: input.roomName || "Room",
    chores: [],
    rationale:
      "No working AI provider. Set BUILD_GAMES_LLM_API_KEY (prefer xAI), or XAI_API_KEY / OPENAI_API_KEY.",
    mode: "unavailable",
  };
}
