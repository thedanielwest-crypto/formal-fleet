"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";

const navLinks = [
  { href: "/browse", label: "Browse Cars" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/verification-safety", label: "Verification & Safety" },
  { href: "/for-schools", label: "For Schools" },
];

function FFMonogram() {
  return (
    <svg viewBox="0 0 40 40" className="w-10 h-10 shrink-0" aria-hidden="true">
      <defs>
        <linearGradient id="ffMonogramGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e6c65c" />
          <stop offset="100%" stopColor="#c9a227" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="40" height="40" rx="11" fill="#0a1424" />
      <rect
        x="0.75"
        y="0.75"
        width="38.5"
        height="38.5"
        rx="10.25"
        fill="none"
        stroke="#c9a227"
        strokeOpacity="0.4"
      />
      <line
        x1="3.5"
        y1="31"
        x2="29"
        y2="5.5"
        stroke="#e6c65c"
        strokeWidth="1.1"
        strokeDasharray="2.2 2.4"
        opacity="0.5"
      />
      <g transform="skewX(-12)">
        <text x="4.5" y="28.5" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="19" fill="#ffffff">
          F
        </text>
        <text
          x="17"
          y="28.5"
          fontFamily="Inter, sans-serif"
          fontWeight="900"
          fontSize="19"
          fill="url(#ffMonogramGold)"
        >
          F
        </text>
      </g>
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { session, profile, signOut } = useAuth();

  return (
    <header className="bg-navy text-white px-14 py-5 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3">
        <FFMonogram />
        <div className="font-serif font-extrabold text-2xl uppercase tracking-tight leading-none">
          <span className="text-white">Fleet</span>{" "}
          <span className="text-gold-light">Formal</span>
        </div>
      </Link>
      <nav className="hidden md:flex gap-9 text-[15px] font-medium text-slate-300">
        {navLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                active
                  ? "text-white border-b-2 border-gold pb-1"
                  : "hover:text-white pb-1 border-b-2 border-transparent"
              }
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="flex gap-3.5 items-center">
        {session && profile ? (
          <>
            <Link
              href={`/dashboard/${profile.role}`}
              className="px-5 py-2.5 rounded-lg font-semibold text-sm border border-white/35"
            >
              My Dashboard
            </Link>
            <button
              onClick={async () => {
                await signOut();
                router.push("/");
              }}
              className="px-5 py-2.5 rounded-lg font-semibold text-sm text-navy-deep bg-gradient-to-br from-gold-light to-gold"
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="px-5 py-2.5 rounded-lg font-semibold text-sm border border-white/35">
              Log In
            </Link>
            <Link
              href="/get-started"
              className="px-5 py-2.5 rounded-lg font-semibold text-sm text-navy-deep bg-gradient-to-br from-gold-light to-gold"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
