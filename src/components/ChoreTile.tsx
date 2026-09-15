"use client";

import { useRef, useState, type CSSProperties } from "react";
import { frequencyLabel, type ChoreDue } from "@/lib/frequency";
import { DirtMeter } from "./DirtMeter";

type Props = {
  due: ChoreDue;
  roomName: string;
  assigneeName?: string | null;
  busy: boolean;
  onComplete: (choreId: string) => Promise<void>;
};

/**
 * Physical complete: press → magnet slap → check draw → residue wipe → dust → exit.
 * One job done excellently.
 */
export function ChoreTile({ due, roomName, assigneeName, busy, onComplete }: Props) {
  const [phase, setPhase] = useState<
    "idle" | "press" | "stamp" | "wipe" | "exit"
  >("idle");
  const [checked, setChecked] = useState(false);
  const [burst, setBurst] = useState(false);
  const lock = useRef(false);

  async function handleComplete() {
    if (lock.current || busy || phase !== "idle") return;
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
      // keep exit pose until parent removes row
      setTimeout(() => setBurst(false), 500);
    }
  }

  const label =
    due.status === "overdue"
      ? `${due.overdueDays}d late`
      : due.status === "due"
        ? "due today"
        : due.status;

  return (
    <li
      className={`tile chore-tile phase-${phase}${burst ? " is-bursting" : ""}`}
      data-status={due.status}
    >
      <button
        type="button"
        className="stamp-btn t-check"
        role="checkbox"
        aria-checked={checked}
        aria-label={`Stamp complete: ${due.title}`}
        disabled={busy || phase !== "idle"}
        onPointerDown={() => {
          if (phase === "idle" && !busy) setPhase("press");
        }}
        onPointerUp={() => {
          if (phase === "press" && !lock.current) setPhase("idle");
        }}
        onPointerLeave={() => {
          if (phase === "press" && !lock.current) setPhase("idle");
        }}
        onClick={() => void handleComplete()}
      >
        <svg viewBox="0 0 10.1668 10.1668" width="22" height="22" aria-hidden>
          <path
            d="M1 5.52L3.92 9.17L9.17 1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
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
          ) : null}
        </div>
        <DirtMeter dirt={due.dirt} status={due.status} wiping={phase === "wipe" || phase === "exit"} />
      </div>
    </li>
  );
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
