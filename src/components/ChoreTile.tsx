"use client";

import { useRef, useState, type CSSProperties } from "react";
import { frequencyLabel, type ChoreDue } from "@/lib/frequency";
import { DirtMeter } from "./DirtMeter";

type MemberOpt = { id: string; name: string };
type Props = {
  due: ChoreDue;
  roomName: string;
  assigneeName?: string | null;
  assigneeId?: string | null;
  members?: MemberOpt[];
  busy: boolean;
  onComplete: (choreId: string) => Promise<void>;
  onAssign?: (choreId: string, memberId: string | null) => void;
};

/**
 * Physical complete: press → ink check → residue wipe → exit.
 * Pointer press must not cancel before click (broken transitions fix).
 */
export function ChoreTile({ due, roomName, assigneeName, assigneeId, members, busy, onComplete, onAssign }: Props) {
  const [phase, setPhase] = useState<
    "idle" | "press" | "stamp" | "wipe" | "exit"
  >("idle");
  const [checked, setChecked] = useState(false);
  const [burst, setBurst] = useState(false);
  const lock = useRef(false);

  async function handleComplete() {
    if (lock.current || busy || phase === "exit") return;
    lock.current = true;
    setPhase("press");
    try {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate?.([10, 30, 14]);
      }
    } catch {
      /* ignore */
    }

    await wait(70);
    setPhase("stamp");
    setChecked(true);
    setBurst(true);
    await wait(260);
    setPhase("wipe");
    await wait(520);
    setPhase("exit");
    try {
      await onComplete(due.choreId);
    } finally {
      setTimeout(() => setBurst(false), 500);
    }
  }

  const label =
    due.status === "overdue"
      ? due.overdueDays === 1
        ? "Overdue · 1d"
        : `Overdue · ${due.overdueDays}d`
      : due.status === "due"
        ? "Due today"
        : due.status;

  return (
    <li
      className={`tile chore-tile fun-card phase-${phase}${burst ? " is-bursting" : ""}`}
      data-status={due.status}
    >
      <button
        type="button"
        className="stamp-btn t-check btn-press"
        role="checkbox"
        aria-checked={checked}
        aria-label={`Check complete: ${due.title}`}
        disabled={busy || lock.current || phase === "exit"}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          if (lock.current || busy || phase !== "idle") return;
          setPhase("press");
        }}
        onPointerCancel={() => {
          if (!lock.current && phase === "press") setPhase("idle");
        }}
        onPointerLeave={() => {
          if (!lock.current && phase === "press") setPhase("idle");
        }}
        onClick={() => void handleComplete()}
      >
        <span className="t-like-icon stamp-icon-wrap" aria-hidden>
          <svg viewBox="0 0 10.1668 10.1668" width="22" height="22">
            <path
              d="M1 5.52L3.92 9.17L9.17 1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              style={{
                strokeDasharray: 1,
                strokeDashoffset: checked ? 0 : 1,
              }}
            />
          </svg>
        </span>
        <span className="stamp-particles" aria-hidden>
          {Array.from({ length: 8 }).map((_, i) => (
            <i
              key={i}
              style={
                {
                  ["--px" as string]: `${Math.cos((i / 8) * Math.PI * 2) * 22}px`,
                  ["--py" as string]: `${Math.sin((i / 8) * Math.PI * 2) * 18}px`,
                  ["--pdur" as string]: `${480 + (i % 3) * 40}ms`,
                  ["--pdelay" as string]: `${i * 18}ms`,
                  ["--psize" as string]: `${2 + (i % 3)}px`,
                } as CSSProperties
              }
            />
          ))}
        </span>
      </button>

      <div className="chore-body">
        <div className="chore-title-row">
          <div className="chore-title">{due.title}</div>
          <span className={`status-pill status-${due.status}`}>{label}</span>
        </div>
        <div className="chore-meta">
          {roomName} · {frequencyLabel(due.frequency)}
          {assigneeName ? (
            <span className="assignee-chip"> · {assigneeName}</span>
          ) : (
            <span className="assignee-chip muted"> · unassigned</span>
          )}
        </div>
        {onAssign && members && members.length > 0 ? (
          <label className="assign-row">
            <span className="eyebrow">Assign</span>
            <select
              className="field assign-select"
              value={assigneeId ?? ""}
              disabled={busy || phase !== "idle"}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) =>
                onAssign(due.choreId, e.target.value ? e.target.value : null)
              }
            >
              <option value="">Anyone</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <DirtMeter dirt={due.dirt} status={due.status} wiping={phase === "wipe" || phase === "exit"} />
      </div>
    </li>
  );
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
