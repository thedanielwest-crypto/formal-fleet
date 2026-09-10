/**
 * Fleet Formal brand marks & icon system.
 *
 * FFMonogram is the custom vector "FF" mark from the brand sheet — a white F
 * and a gold F, forward-leaning, with a dashed road-line running through the
 * gold F and trailing gold speed-lines. It replaces the old skewed-system-font
 * version and is the single source of truth for the mark (header, footer,
 * favicons/app icons are all generated from the same geometry).
 *
 * IconBadge + the icon components below replace the raw emoji that were
 * scattered across the site (🎓🚗🛡️🏫🔍✅🤝🎉 etc.) with one consistent set of
 * line icons on a uniform navy or gold circle, matching the "Icon Usage"
 * panel on the brand sheet.
 */
import type { ReactNode } from "react";

export function FFMonogram({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={`${className} shrink-0`} aria-hidden="true">
      <rect x="0" y="0" width="100" height="100" rx="26" fill="#0d1b2a" />
      <rect
        x="1.5"
        y="1.5"
        width="97"
        height="97"
        rx="24.5"
        fill="none"
        stroke="#d4a937"
        strokeOpacity="0.35"
      />

      {/* trailing gold speed-lines */}
      <line x1="14" y1="54.93" x2="25.61" y2="47.73" stroke="#d4a937" strokeWidth="2.7" strokeLinecap="round" />
      <line x1="17.1" y1="48.74" x2="33.35" y2="38.66" stroke="#d4a937" strokeWidth="3.1" strokeLinecap="round" />
      <line x1="20.19" y1="41.77" x2="41.1" y2="28.81" stroke="#d4a937" strokeWidth="3.5" strokeLinecap="round" />

      {/* white F */}
      <polygon
        points="45.74,32.48 68.97,32.48 66.41,41.0 52.48,41.0 49.92,49.51 59.99,49.51 57.66,57.25 47.6,57.25 43.42,71.19 34.13,71.19"
        fill="#ffffff"
      />
      {/* gold F */}
      <polygon
        points="62.77,32.48 86.0,32.48 83.45,41.0 69.51,41.0 66.95,49.51 77.02,49.51 74.7,57.25 64.63,57.25 60.45,71.19 51.16,71.19"
        fill="#d4a937"
      />

      {/* dashed road-line through the gold F */}
      <line x1="55.03" y1="68.09" x2="57.76" y2="64.6" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" />
      <line x1="59.99" y1="61.74" x2="62.71" y2="58.25" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" />
      <line x1="64.94" y1="55.4" x2="67.67" y2="51.9" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" />
      <line x1="69.9" y1="49.05" x2="72.62" y2="45.56" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" />
      <line x1="74.85" y1="42.7" x2="77.58" y2="39.21" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export type IconName =
  | "graduate"
  | "car"
  | "shield"
  | "school"
  | "search"
  | "check"
  | "handshake"
  | "celebration"
  | "clipboard"
  | "id"
  | "badge"
  | "phone"
  | "pin"
  | "star"
  | "heart"
  | "money"
  | "bell"
  | "mail"
  | "trophy"
  | "close"
  | "document";

const paths: Record<IconName, ReactNode> = {
  graduate: (
    <>
      <path d="M3 9.5 12 5l9 4.5-9 4.5-9-4.5Z" />
      <path d="M7 11.8v4.2c0 1.4 2.24 2.5 5 2.5s5-1.1 5-2.5v-4.2" />
      <path d="M20 9.5v5.5" />
    </>
  ),
  car: (
    <>
      <path d="M4 16V12.2a1.6 1.6 0 0 1 .27-.9l1.9-2.8A2 2 0 0 1 7.83 7.6h8.34a2 2 0 0 1 1.66.9l1.9 2.8c.18.27.27.58.27.9V16" />
      <path d="M4 16h16v2.2a.8.8 0 0 1-.8.8h-1.4a.8.8 0 0 1-.8-.8V17H7v1.2a.8.8 0 0 1-.8.8H4.8a.8.8 0 0 1-.8-.8V16Z" />
      <circle cx="7.5" cy="13.5" r="1.1" />
      <circle cx="16.5" cy="13.5" r="1.1" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.5 19 6v5.2c0 4.2-2.9 7.4-7 9.3-4.1-1.9-7-5.1-7-9.3V6l7-2.5Z" />
      <path d="m9 12 2 2 4-4.2" />
    </>
  ),
  school: (
    <>
      <path d="M4 20.5h16" />
      <path d="M5.5 20.5v-8.7" />
      <path d="M18.5 20.5v-8.7" />
      <path d="M3 11.8 12 4l9 7.8" />
      <path d="M9 20.5v-4a3 3 0 0 1 6 0v4" />
      <path d="M8 16h1.6M14.4 16H16" />
    </>
  ),
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="m19.5 19.5-4-4" />
    </>
  ),
  check: <path d="m4.5 12.5 5 5 10-11" />,
  handshake: (
    <>
      <path d="M3 11.5h4l3-2.3 3 2.3 2-2 3 2.3h3" />
      <path d="M8 13.2 5.6 15a1.7 1.7 0 0 0 2.3 2.5l.5-.4" />
      <path d="m8.4 17.1.6.6a1.7 1.7 0 0 0 2.4-2.4" />
      <path d="M16 13.2l2.4 1.8a1.7 1.7 0 0 1-2.3 2.5l-.5-.4" />
    </>
  ),
  celebration: (
    <>
      <path d="M4 20 15 9" />
      <path d="M13 4.5 15.5 7 18 4.5" />
      <path d="M18.5 9 21 11.5" />
      <path d="M9.5 3.5 10.5 5" />
      <circle cx="6.3" cy="17.7" r="1" />
    </>
  ),
  clipboard: (
    <>
      <rect x="6" y="4.5" width="12" height="16" rx="1.8" />
      <rect x="9" y="3" width="6" height="3" rx="1" />
      <path d="M9 11h6" />
      <path d="M9 14.5h6" />
      <path d="M9 18h3.5" />
    </>
  ),
  id: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.8" />
      <circle cx="8.5" cy="10.7" r="1.7" />
      <path d="M5.8 15.3c.5-1.4 1.6-2.1 2.7-2.1s2.2.7 2.7 2.1" />
      <path d="M14.5 9.5h4" />
      <path d="M14.5 12.5h4" />
      <path d="M14.5 15.5h2.6" />
    </>
  ),
  badge: (
    <>
      <path d="M12 3.5 19 6v5.2c0 4.2-2.9 7.4-7 9.3-4.1-1.9-7-5.1-7-9.3V6l7-2.5Z" />
      <circle cx="12" cy="10.3" r="2.3" />
      <path d="M8.2 16.4c.7-1.9 2.1-2.9 3.8-2.9s3.1 1 3.8 2.9" />
    </>
  ),
  phone: (
    <>
      <rect x="7.5" y="3" width="9" height="18" rx="2" />
      <path d="M11 18h2" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-5.7-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.3-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  star: (
    <path d="m12 3.5 2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8L12 3.5Z" />
  ),
  heart: (
    <path d="M12 20s-7.5-4.5-7.5-10a4.5 4.5 0 0 1 7.5-3.4A4.5 4.5 0 0 1 19.5 10c0 5.5-7.5 10-7.5 10Z" />
  ),
  money: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v9" />
      <path d="M14.7 9.7c0-1-1.2-1.7-2.7-1.7s-2.7.8-2.7 1.9c0 2.7 5.4 1.3 5.4 4 0 1.1-1.2 1.9-2.7 1.9s-2.7-.7-2.7-1.7" />
    </>
  ),
  bell: (
    <>
      <path d="M6 10.5a6 6 0 0 1 12 0c0 4 1.5 5 1.5 5h-15s1.5-1 1.5-5Z" />
      <path d="M10 18.5a2 2 0 0 0 4 0" />
    </>
  ),
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.8" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 4.5h8v5a4 4 0 0 1-8 0v-5Z" />
      <path d="M8 6H5.5a1 1 0 0 0-1 1c0 2.3 1.7 3.7 3.5 4" />
      <path d="M16 6h2.5a1 1 0 0 1 1 1c0 2.3-1.7 3.7-3.5 4" />
      <path d="M12 13.5V17" />
      <path d="M8.5 20h7" />
      <path d="M10 17h4v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2Z" />
    </>
  ),
  close: (
    <>
      <path d="m5.5 5.5 13 13" />
      <path d="m18.5 5.5-13 13" />
    </>
  ),
  document: (
    <>
      <path d="M7 3.5h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z" />
      <path d="M14 3.5V8h4" />
      <path d="M9 12.5h6" />
      <path d="M9 15.5h6" />
    </>
  ),
};

export function Icon({
  name,
  className = "w-6 h-6",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export function IconBadge({
  name,
  tone = "navy",
  size = "w-14 h-14",
  iconSize = "w-6 h-6",
}: {
  name: IconName;
  tone?: "navy" | "gold";
  size?: string;
  iconSize?: string;
}) {
  const toneClass =
    tone === "gold"
      ? "bg-gradient-to-br from-gold-light to-gold text-navy-deep"
      : "bg-navy text-gold-light border border-gold-border";
  return (
    <div className={`${size} mx-auto rounded-full flex items-center justify-center ${toneClass}`}>
      <Icon name={name} className={iconSize} />
    </div>
  );
}
