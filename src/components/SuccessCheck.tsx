"use client";

export function SuccessCheck({ show }: { show: boolean }) {
  return (
    <span
      className="t-success-check"
      data-state={show ? "in" : "out"}
      aria-hidden
      style={{ width: 28, height: 28 }}
    >
      <svg viewBox="0 0 48 48" width="28" height="28" fill="none">
        <circle cx="24" cy="24" r="20" stroke="#4a6b52" strokeWidth="3" />
        <path
          d="M14 25.5 L21 32 L34 17"
          stroke="#4a6b52"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
