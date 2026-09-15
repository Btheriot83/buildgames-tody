"use client";

import { useEffect, useRef } from "react";

export function SlidingTabs({
  tabs,
  value,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    const pill = pillRef.current;
    if (!bar || !pill) return;
    const active = bar.querySelector(
      `[data-tab="${value}"]`
    ) as HTMLElement | null;
    if (!active) return;
    const move = (animate: boolean) => {
      if (!animate) {
        pill.style.transition = "none";
      }
      pill.style.transform = `translateX(${active.offsetLeft}px)`;
      pill.style.width = `${active.offsetWidth}px`;
      if (!animate) {
        void pill.offsetWidth;
        pill.style.transition = "";
      }
    };
    move(false);
    const onResize = () => move(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [value, tabs]);

  return (
    <div className="t-tabs no-print" role="tablist" ref={barRef}>
      <span className="t-tabs-pill" aria-hidden ref={pillRef} />
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          className="t-tab"
          role="tab"
          data-tab={t.id}
          aria-selected={value === t.id}
          onClick={() => {
            const bar = barRef.current;
            const pill = pillRef.current;
            const btn = bar?.querySelector(
              `[data-tab="${t.id}"]`
            ) as HTMLElement | null;
            if (bar && pill && btn) {
              pill.style.transform = `translateX(${btn.offsetLeft}px)`;
              pill.style.width = `${btn.offsetWidth}px`;
            }
            onChange(t.id);
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
