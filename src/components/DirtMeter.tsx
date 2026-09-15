"use client";

/** Segmented residue meter — Cool letterpress segmented pressure — Tody-adjacent bar gaps. */
export function DirtMeter({
  dirt,
  status,
  wiping,
}: {
  dirt: number;
  status: "due" | "overdue" | "ok" | "fresh";
  wiping?: boolean;
}) {
  const segments = 6;
  const filled = Math.round(Math.max(0, Math.min(1, dirt)) * segments);
  const tone =
    status === "overdue" ? "overdue" : status === "due" ? "due" : "ok";
  const pct = Math.round(Math.max(0, Math.min(1, dirt)) * 100);

  return (
    <div
      className={`dirt-meter dirt-${tone}${wiping ? " is-wiping" : ""}`}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-label="Residue pressure"
      style={{ ["--dirt" as string]: String(dirt) }}
    >
      <div className="dirt-meter-fill" style={{ width: `${pct}%` }} />
      <div className="dirt-meter-track">
        {Array.from({ length: segments }).map((_, i) => (
          <span
            key={i}
            className={`dirt-seg${i < filled ? " is-on" : ""}`}
            style={{ transitionDelay: wiping ? `${i * 28}ms` : `${i * 18}ms` }}
          />
        ))}
      </div>
      <div className="dirt-wipe" aria-hidden />
    </div>
  );
}
