"use client";

import { useEffect, useState } from "react";
import {
  ONBOARD_CARDS,
  markOnboarded,
  readOnboardStep,
  readOnboarded,
  readSelectedPacks,
  writeOnboardStep,
  writeSelectedPacks,
} from "@/lib/onboarding";
import { CHORE_PACKS, type PackId } from "@/lib/chore-packs";

type Props = {
  inviteCode?: string;
  onApplyPacks: (ids: PackId[]) => Promise<void>;
  onSaveHousemate: (name: string) => Promise<void>;
  onLandToday: () => void;
};

export function OnboardingWalkthrough({
  inviteCode,
  onApplyPacks,
  onSaveHousemate,
  onLandToday,
}: Props) {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<PackId[]>(["kitchen", "bath"]);
  const [housemate, setHousemate] = useState("Housemate");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (readOnboarded()) {
      setActive(false);
      return;
    }
    const s = readOnboardStep();
    setStep(s);
    const packs = readSelectedPacks();
    if (packs.length) setSelected(packs);
    setActive(true);
  }, []);

  if (!active) return null;

  const card = ONBOARD_CARDS[step] ?? ONBOARD_CARDS[0]!;
  const total = ONBOARD_CARDS.length;
  const index = step + 1;

  const finish = () => {
    markOnboarded();
    setActive(false);
  };

  const skip = () => {
    finish();
    onLandToday();
  };

  const togglePack = (id: PackId) => {
    setSelected((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      writeSelectedPacks(next);
      return next;
    });
  };

  const advance = async () => {
    if (busy) return;
    setBusy(true);
    try {
      if (card.id === "packs") {
        const ids = selected.length ? selected : (["kitchen"] as PackId[]);
        writeSelectedPacks(ids);
        await onApplyPacks(ids);
      }
      if (card.id === "housemate") {
        await onSaveHousemate(housemate);
      }
      if (card.id === "today" || card.id === "done") {
        onLandToday();
      }
      if (card.id === "done" || step >= total - 1) {
        finish();
        return;
      }
      const next = step + 1;
      writeOnboardStep(next);
      setStep(next);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="ob-root"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ob-title"
      data-testid="onboarding"
    >
      <div className="ob-backdrop" aria-hidden />
      <div className="ob-card tile">
        <div className="ob-progress" aria-label={`Step ${index} of ${total}`}>
          {ONBOARD_CARDS.map((c, i) => (
            <span
              key={c.id}
              className={`ob-dot${i === step ? " is-active" : ""}${
                i < step ? " is-done" : ""
              }`}
            />
          ))}
          <span className="ob-progress-label font-mono">
            {index} of {total}
          </span>
        </div>

        {card.id === "start" && (
          <div className="ob-hero">
            <img
              src="/art/hero-empty.webp"
              alt=""
              width={280}
              height={280}
            />
          </div>
        )}

        {card.id === "packs" && (
          <div className="ob-pack-grid" role="group" aria-label="Chore packs">
            {CHORE_PACKS.map((pack) => {
              const on = selected.includes(pack.id);
              return (
                <button
                  key={pack.id}
                  type="button"
                  className={`ob-pack-card${on ? " is-on" : ""}`}
                  aria-pressed={on}
                  onClick={() => togglePack(pack.id)}
                >
                  <img src={pack.image} alt="" width={120} height={120} />
                  <strong>{pack.label}</strong>
                  <span>{pack.blurb}</span>
                </button>
              );
            })}
          </div>
        )}

        {card.id === "housemate" && (
          <div className="ob-housemate">
            <img
              src="/art/avatars/housemates.webp"
              alt=""
              width={200}
              height={120}
            />
            <label className="label" htmlFor="ob-housemate">
              Housemate name
            </label>
            <input
              id="ob-housemate"
              className="field"
              value={housemate}
              onChange={(e) => setHousemate(e.target.value)}
              placeholder="Housemate"
            />
            {inviteCode ? (
              <p className="ob-invite-hint font-mono">
                Invite code ready: <code>{inviteCode}</code>
              </p>
            ) : null}
          </div>
        )}

        {(card.id === "today" || card.id === "done") && (
          <div className="ob-mini-today" aria-hidden>
            <span className="ob-mini-row">
              <span className="ob-mini-check" /> Wipe island after dinner
            </span>
            <span className="ob-mini-row">
              <span className="ob-mini-check" /> Restock soap &amp; TP
            </span>
          </div>
        )}

        <h2 id="ob-title" className="ob-title font-display">
          {card.title}
        </h2>
        <p className="ob-body">{card.body}</p>

        <div className="ob-actions">
          <button
            type="button"
            className="btn btn-ghost btn-press onboard-skip"
            data-testid="onboard-skip"
            onClick={skip}
          >
            Skip
          </button>
          <button
            type="button"
            className="btn btn-primary btn-press t-learn onboard-cta"
            data-testid="onboard-next"
            disabled={busy || (card.id === "packs" && selected.length === 0)}
            onClick={() => void advance()}
          >
            {card.cta}
            <span className="t-learn-chevron" aria-hidden>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  className="t-learn-arm t-learn-arm-top"
                  d="M6 4L10 8"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
                <path
                  className="t-learn-arm t-learn-arm-bot"
                  d="M10 8L6 12"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
