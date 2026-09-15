"use client";

import { useState } from "react";
import type { FrequencyKind } from "@/lib/frequency";
import type { PlannedChore } from "@/lib/plan-chores";

type Props = {
  onAccept: (chores: PlannedChore[], roomName: string) => Promise<void>;
};

export function PlanPanel({ onAccept }: Props) {
  const [open, setOpen] = useState(false);
  const [desc, setDesc] = useState("");
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<{
    roomName: string;
    chores: PlannedChore[];
    rationale: string;
    mode: string;
  } | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    setPlan(null);
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomDescription: desc,
          roomName: roomName || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || data.rationale || "Plan unavailable");
        return;
      }
      setPlan(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        className="btn btn-ghost"
        onClick={() => setOpen(true)}
      >
        Plan a room
      </button>
    );
  }

  return (
    <div className="tile plan-panel" style={{ padding: "1rem", marginTop: "0.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h3 className="font-display" style={{ margin: 0, fontSize: "1.15rem" }}>
          From a room description
        </h3>
        <button type="button" className="btn btn-ghost" style={{ minHeight: 36, padding: "0.35rem 0.7rem" }} onClick={() => setOpen(false)}>
          Close
        </button>
      </div>
      <p style={{ color: "var(--ink-mute)", fontSize: "0.9rem", margin: "0.4rem 0 0.75rem" }}>
        Say what’s in the room — sink, shower glass, pets, kids. We’ll return chores you can stamp onto Today.
      </p>
      <label className="label">Room name (optional)</label>
      <input className="field" value={roomName} onChange={(e) => setRoomName(e.target.value)} placeholder="Bath" />
      <label className="label" style={{ marginTop: "0.55rem" }}>Description</label>
      <textarea
        className="field"
        rows={3}
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Small bath with glass shower, pedestal sink, no window fan, two kids sharing…"
        style={{ minHeight: 88, resize: "vertical" }}
      />
      <button
        type="button"
        className="btn btn-primary"
        style={{ width: "100%", marginTop: "0.75rem" }}
        disabled={loading || desc.trim().length < 8}
        onClick={() => void run()}
      >
        {loading ? "Drafting from the room…" : "Draft the plan"}
      </button>
      {error && <p className="t-error-msg" style={{ opacity: 1, visibility: "visible" }}>{error}</p>}
      {plan && (
        <div style={{ marginTop: "0.9rem" }}>
          <p className="eyebrow">{plan.mode} · {plan.roomName}</p>
          <p style={{ margin: "0.35rem 0 0.6rem", color: "var(--ink-soft)", fontSize: "0.92rem" }}>{plan.rationale}</p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.4rem" }}>
            {plan.chores.map((c, i) => (
              <li key={`${c.title}-${i}`} className="tile" style={{ padding: "0.55rem 0.7rem", boxShadow: "none" }}>
                <strong>{c.title}</strong>
                <div className="eyebrow" style={{ marginTop: 2 }}>
                  {c.frequencyKind.replace("_", " ")} · n={c.frequencyN}
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="btn btn-clay"
            style={{ width: "100%", marginTop: "0.75rem" }}
            onClick={() => void onAccept(plan.chores, plan.roomName)}
          >
            Stamp {plan.chores.length} tiles onto the board
          </button>
        </div>
      )}
    </div>
  );
}

export type { FrequencyKind };
