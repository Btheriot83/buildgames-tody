"use client";

import { useEffect, useState } from "react";

/** Technique 5 — keyframe still sequence + CSS interpolation on complete.
 * Plays a short stamp→wipe→settle reel tied to the core job (not decorative loop spam).
 */
const FRAMES = [
  "/art/magnet-beat-1.png",
  "/art/magnet-beat-2.png",
  "/art/magnet-beat-3.png",
];

export function StampMotion({ play }: { play: boolean }) {
  const [frame, setFrame] = useState(0);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!play) return;
    setShown(true);
    setFrame(0);
    const t1 = setTimeout(() => setFrame(1), 220);
    const t2 = setTimeout(() => setFrame(2), 520);
    const t3 = setTimeout(() => setShown(false), 1400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [play]);

  if (!shown) return null;

  return (
    <div className="stamp-motion" aria-hidden>
      {FRAMES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`stamp-motion-frame${i === frame ? " is-on" : ""}`}
          width={120}
          height={120}
        />
      ))}
      <div className="stamp-motion-veil" />
    </div>
  );
}
