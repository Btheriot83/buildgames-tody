"use client";

import { useEffect, useState } from "react";

/** Number pop-in (transitions.dev) — streak / due counts. */
export function NumberPop({ value }: { value: number | string }) {
  const [anim, setAnim] = useState(false);
  useEffect(() => {
    setAnim(false);
    const id = requestAnimationFrame(() => setAnim(true));
    return () => cancelAnimationFrame(id);
  }, [value]);
  const chars = String(value).split("");
  return (
    <span className={`t-digit-group${anim ? " is-animating" : ""}`} aria-label={String(value)}>
      {chars.map((ch, i) => {
        const fromEnd = chars.length - 1 - i;
        const stagger = fromEnd <= 1 ? String(fromEnd + 1) : undefined;
        return (
          <span key={`${value}-${i}`} className="t-digit" data-stagger={stagger}>
            {ch}
          </span>
        );
      })}
    </span>
  );
}
