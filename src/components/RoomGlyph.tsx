/** Letterpress room marks — flat ink plates, no emoji. */

export type RoomGlyphKind =
  | "kitchen"
  | "bath"
  | "living"
  | "laundry"
  | "garage"
  | "generic";

export function roomGlyphKind(name: string): RoomGlyphKind {
  const n = name.toLowerCase();
  if (n.includes("kitchen")) return "kitchen";
  if (n.includes("bath")) return "bath";
  if (n.includes("living") || n.includes("lounge") || n.includes("den")) return "living";
  if (n.includes("laundry") || n.includes("utility") || n.includes("weekly")) return "laundry";
  if (n.includes("garage") || n.includes("bay")) return "garage";
  return "generic";
}

type Props = {
  kind?: RoomGlyphKind;
  name?: string;
  size?: number;
  className?: string;
};

/** Cool letterpress SVG plates — slate ink, no fill gradients. */
export function RoomGlyph({ kind, name, size = 28, className }: Props) {
  const k = kind ?? (name ? roomGlyphKind(name) : "generic");
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 32 32",
    fill: "none",
    "aria-hidden": true as const,
    className: className ? `room-glyph ${className}` : "room-glyph",
  };

  switch (k) {
    case "kitchen":
      return (
        <svg {...common}>
          <rect x="4" y="10" width="24" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 10V7.5h4V10M20 10V7.5h4V10" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="12" cy="18" r="2.2" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="20" cy="18" r="2.2" stroke="currentColor" strokeWidth="1.4" />
          <path d="M8 24h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case "bath":
      return (
        <svg {...common}>
          <path
            d="M6 18h20v4.5a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V18Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path d="M8 18V12.5a3.5 3.5 0 0 1 7 0" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="11.5" cy="9.5" r="1.4" fill="currentColor" />
          <path d="M22 14v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "living":
      return (
        <svg {...common}>
          <path
            d="M5 14.5 16 6l11 8.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M8 13.5V25h16V13.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <rect x="13" y="17" width="6" height="8" rx="0.8" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );
    case "laundry":
      return (
        <svg {...common}>
          <rect x="7" y="5" width="18" height="22" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="16" cy="17" r="5.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="16" cy="17" r="2.2" stroke="currentColor" strokeWidth="1.3" />
          <path d="M10 8.5h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case "garage":
      return (
        <svg {...common}>
          <path
            d="M4 14 16 5l12 9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M7 13.5V26h18V13.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M10 26V17h12v9" stroke="currentColor" strokeWidth="1.4" />
          <path d="M10 20h12M10 23h12" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect x="6" y="6" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M11 16h10M16 11v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
  }
}
