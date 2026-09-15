"use client";

/** Segmented residue meter — Fridge Magnet Board / Tody-like physical dueness. */
export function DirtMeter({
  dirt,
  status,
  wiping,
}: {
  dirt: number;
  status: "due" | "overdue" | "ok" | "fresh";
  wiping?: boolean;
}) {
  const segments = 4;
  const filled = Math.round(Math.max(0, Math.min(1, dirt)) * segments);
  const tone =
    status === "overdue" ? "overdue" : status === "due" ? "due" : "ok";
  const pct = Math.round(Math.max(0, Math.min(1, dirt)) * 100);
  const label =
    pct >= 75 ? "Heavy residue" : pct >= 45 ? "Medium residue" : pct > 0 ? "Light residue" : "Clear";

  return (
    <div
      className={`dirt-meter dirt-${tone}${wiping ? " is-wiping" : ""}`}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-label={`Residue pressure: ${label}`}
      style={{ ["--dirt" as string]: String(dirt) }}
    >
      <div className="dirt-meter-fill" style={{ width: `${pct}%` }} />
      <div className="dirt-meter-row">
        <div className="dirt-meter-track">
          {Array.from({ length: segments }).map((_, i) => (
            <span
              key={i}
              className={`dirt-seg${i < filled ? " is-on" : ""}`}
              style={{ transitionDelay: wiping ? `${i * 28}ms` : `${i * 18}ms` }}
            />
          ))}
        </div>
        <span className="dirt-label">{label}</span>
      </div>
      <div className="dirt-wipe" aria-hidden />
    </div>
  );
}
