/**
 * Fleet Formal brand marks & icon system (Nov 2026 rebrand).
 *
 * The FF mark is no longer hand-drawn here: /public/brand/ff-mark.svg is a
 * vector trace of the official logo on the brand sheet / "Your Formal. Your
 * Ride." poster — white italic F, gold italic F, and the road with its gold
 * edge-lines and white lane dashes running between them. Every logo on the
 * site (header, footer, install prompt, app icons, favicon) comes from that
 * one file so they can never drift apart again.
 *
 * The wordmark is Montserrat ExtraBold Italic (self-hosted in /public/fonts),
 * "FLEET" in white and "FORMAL" in gold, matching the brand sheet lockups.
 *
 * Icons follow the poster's icon row: clean gold line icons with rounded
 * ends, no filled circles behind them.
 */
import type { ReactNode } from "react";

/** The FF mark on its own. `tile` puts it on the midnight-navy app-icon tile. */
export function FFMonogram({
  className = "w-10 h-10",
  tile = false,
}: {
  className?: string;
  tile?: boolean;
}) {
  if (tile) {
    return (
      <span
        className={`${className} shrink-0 inline-flex items-center justify-center rounded-[24%] bg-[radial-gradient(circle_at_50%_30%,#0b2440,#011326_75%)] ring-1 ring-gold/35`}
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/ff-mark.svg" alt="" className="w-[78%] h-auto" />
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/ff-mark.svg"
      alt=""
      aria-hidden="true"
      className={`${className} shrink-0 object-contain`}
    />
  );
}

/** "FLEET FORMAL" wordmark — white + gold, heavy italic. */
export function FFWordmark({ className = "text-2xl" }: { className?: string }) {
  return (
    <span className={`ff-wordmark ${className}`}>
      <span className="text-white">Fleet</span>{" "}
      <span className="text-gold">Formal</span>
    </span>
  );
}

/**
 * Full logo lockup, as on the brand sheet's horizontal logo: mark on the
 * left, wordmark on the right, optional tagline underneath.
 */
export function FFLogo({
  size = "md",
  tagline = false,
}: {
  size?: "sm" | "md" | "lg";
  tagline?: boolean;
}) {
  const s = {
    sm: { mark: "h-8 w-auto", word: "text-[19px]", tag: "text-[10px]" },
    md: { mark: "h-10 w-auto", word: "text-[23px]", tag: "text-[11px]" },
    lg: { mark: "h-12 sm:h-16 w-auto", word: "text-[25px] sm:text-[34px]", tag: "text-[11px] sm:text-[13px]" },
  }[size];
  return (
    <span className="inline-flex items-center gap-2.5">
      <FFMonogram className={s.mark} />
      <span className="flex flex-col leading-none">
        <FFWordmark className={s.word} />
        {tagline && (
          <span className={`${s.tag} text-white/75 mt-1.5 tracking-wide sm:whitespace-nowrap`}>
            Arrive at formal in something unforgettable.
          </span>
        )}
      </span>
    </span>
  );
}

/** The gold + white sweep from the bottom of the poster. */
export function GoldSwoosh({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      className={`block w-full h-[46px] md:h-[70px] ${className}`}
      aria-hidden="true"
    >
      <path d="M0 62 C 360 6, 900 6, 1440 40 L1440 90 L0 90 Z" fill="#011326" />
      <path
        d="M0 58 C 380 -2, 920 2, 1440 34"
        fill="none"
        stroke="#d4a937"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M0 74 C 420 22, 940 26, 1440 52"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}

export type IconName =
  | "graduate"
  | "car"
  | "shield"
  | "users"
  | "school"
  | "search"
  | "check"
  | "checkCircle"
  | "arrowRight"
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
  | "document"
  | "sparkle"
  | "camera"
  | "ring";

const paths: Record<IconName, ReactNode> = {
  graduate: (
    <>
      <path d="M2.5 9 12 4.8 21.5 9 12 13.2 2.5 9Z" />
      <path d="M6.5 11v4.6c0 1.5 2.5 2.9 5.5 2.9s5.5-1.4 5.5-2.9V11" />
      <path d="M21.5 9v5.2" />
      <path d="M21.5 14.2 20.6 17h1.8l-.9-2.8Z" />
    </>
  ),
  car: (
    <>
      <path d="M6.2 10.2 7.9 6.3c.3-.6.9-1 1.6-1h5c.7 0 1.3.4 1.6 1l1.7 3.9" />
      <path d="M4.3 10.2h15.4c.9 0 1.6.7 1.6 1.6v3.9c0 .6-.5 1.1-1.1 1.1H3.8c-.6 0-1.1-.5-1.1-1.1v-3.9c0-.9.7-1.6 1.6-1.6Z" />
      <path d="M5.3 16.8v1.6c0 .4.3.7.7.7h1.6c.4 0 .7-.3.7-.7v-1.6" />
      <path d="M15.7 16.8v1.6c0 .4.3.7.7.7H18c.4 0 .7-.3.7-.7v-1.6" />
      <circle cx="6.6" cy="13.4" r="1.1" />
      <circle cx="17.4" cy="13.4" r="1.1" />
      <path d="M10 13.6h4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 19.5 5.8v5.6c0 4.4-3.1 7.8-7.5 9.6-4.4-1.8-7.5-5.2-7.5-9.6V5.8L12 3Z" />
      <path d="m8.8 12 2.3 2.3 4.3-4.6" />
    </>
  ),
  users: (
    <>
      <circle cx="12" cy="7.6" r="2.7" />
      <path d="M7.2 19c0-3 2.1-5.1 4.8-5.1s4.8 2.1 4.8 5.1" />
      <circle cx="5.9" cy="9.6" r="2" />
      <path d="M2.4 17.8c0-2.4 1.5-4 3.6-4.1" />
      <circle cx="18.1" cy="9.6" r="2" />
      <path d="M21.6 17.8c0-2.4-1.5-4-3.6-4.1" />
    </>
  ),
  school: (
    <>
      <path d="M4 20.5h16" />
      <path d="M5.5 20.5v-8.7" />
      <path d="M18.5 20.5v-8.7" />
      <path d="M3 11.8 12 4l9 7.8" />
      <path d="M9 20.5v-4a3 3 0 0 1 6 0v4" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.2" />
      <path d="m19.5 19.5-4.4-4.4" />
    </>
  ),
  check: <path d="m4.5 12.5 5 5 10-11" />,
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="8.8" />
      <path d="m8.2 12.3 2.6 2.6 5-5.4" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M4.5 12h15" />
      <path d="m13.5 6 6 6-6 6" />
    </>
  ),
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
      <path d="M12 3 19.5 5.8v5.6c0 4.4-3.1 7.8-7.5 9.6-4.4-1.8-7.5-5.2-7.5-9.6V5.8L12 3Z" />
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
      <path d="M12 21.2s-6.8-5.9-6.8-11.4a6.8 6.8 0 0 1 13.6 0c0 5.5-6.8 11.4-6.8 11.4Z" />
      <circle cx="12" cy="9.9" r="2.4" />
    </>
  ),
  star: (
    <path d="m12 3.2 2.7 5.6 6.1.8-4.5 4.3 1.1 6.1-5.4-3-5.4 3 1.1-6.1-4.5-4.3 6.1-.8L12 3.2Z" />
  ),
  heart: (
    <path d="M12 20.2s-7.8-4.6-7.8-10.3A4.6 4.6 0 0 1 12 6.6a4.6 4.6 0 0 1 7.8 3.3c0 5.7-7.8 10.3-7.8 10.3Z" />
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
  sparkle: (
    <>
      <path d="M12 3.5c.6 3.9 2.6 5.9 6.5 6.5-3.9.6-5.9 2.6-6.5 6.5-.6-3.9-2.6-5.9-6.5-6.5 3.9-.6 5.9-2.6 6.5-6.5Z" />
      <path d="M18.5 15.5c.3 1.5 1 2.2 2.5 2.5-1.5.3-2.2 1-2.5 2.5-.3-1.5-1-2.2-2.5-2.5 1.5-.3 2.2-1 2.5-2.5Z" />
    </>
  ),
  camera: (
    <>
      <path d="M4.5 8h3l1.6-2.2h5.8L16.5 8h3c.6 0 1 .4 1 1v9c0 .6-.4 1-1 1h-15c-.6 0-1-.4-1-1V9c0-.6.4-1 1-1Z" />
      <circle cx="12" cy="13.2" r="3.4" />
    </>
  ),
  ring: (
    <>
      <circle cx="12" cy="14.5" r="5.8" />
      <path d="m9.4 6.2 1.3-2.4h2.6l1.3 2.4L12 8.7 9.4 6.2Z" />
    </>
  ),
};

export function Icon({
  name,
  className = "w-6 h-6",
  strokeWidth = 1.7,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

/**
 * tone="navy" (for light backgrounds): gold line icon on a midnight-navy
 * rounded tile — the same shape as the app icon.
 * tone="gold" (for dark backgrounds): the bare gold line icon from the
 * poster's icon row, with a soft gold glow.
 */
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
  if (tone === "gold") {
    return (
      <div className={`${size} mx-auto flex items-center justify-center text-gold ff-icon-glow`}>
        <Icon name={name} className="w-full h-full" strokeWidth={1.5} />
      </div>
    );
  }
  return (
    <div
      className={`${size} mx-auto rounded-[28%] flex items-center justify-center bg-[radial-gradient(circle_at_50%_25%,#0b2440,#011326_80%)] text-gold ring-1 ring-gold/30 shadow-[0_6px_18px_-8px_rgba(1,19,38,0.6)]`}
    >
      <Icon name={name} className={iconSize} />
    </div>
  );
}
