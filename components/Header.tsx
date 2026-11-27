"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { FFLogo, Icon } from "@/components/BrandIcon";

const navLinks = [
  { href: "/browse", label: "Find a Ride" },
  { href: "/list-your-car", label: "List Your Ride" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/for-schools", label: "For Schools" },
  { href: "/owners", label: "Owner Academy" },
  { href: "/verification-safety", label: "Safety" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { session, profile, isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const authButtons =
    session && (profile || isAdmin) ? (
      <>
        {isAdmin && (
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className="px-3 py-2 rounded-lg font-serif font-bold uppercase tracking-[0.08em] text-[12px] text-gold border border-gold/50 hover:bg-gold hover:text-midnight transition-colors"
          >
            Admin
          </Link>
        )}
        {profile && (
          <Link
            href={`/dashboard/${profile.role}`}
            onClick={() => setOpen(false)}
            className="px-4 py-2.5 rounded-lg font-semibold text-[13.5px] text-white/90 hover:text-white"
          >
            My Dashboard
          </Link>
        )}
        <button
          onClick={async () => {
            await signOut();
            router.push("/");
          }}
          className="btn-gold !py-2.5 !px-5 !text-[13px]"
        >
          Log Out
        </button>
      </>
    ) : (
      <>
        <Link
          href="/login"
          className="px-4 py-2.5 rounded-lg font-semibold text-[13.5px] text-white/90 hover:text-white whitespace-nowrap"
        >
          Log In
        </Link>
        <Link href="/get-started" className="btn-gold !py-2.5 !px-5 !text-[13px]">
          Sign Up
        </Link>
      </>
    );

  return (
    <header className="sticky top-0 z-40 bg-midnight/95 backdrop-blur-md border-b border-white/[0.07] text-white">
      <div className="px-5 md:px-10 2xl:px-14 h-[72px] flex items-center justify-between gap-6">
        <Link href="/" aria-label="Fleet Formal home" onClick={() => setOpen(false)} className="shrink-0">
          <FFLogo size="md" />
        </Link>

        <nav className="hidden min-[1120px]:flex flex-1 justify-center items-center gap-4 xl:gap-6 2xl:gap-9">
          {navLinks.map((link) => {
            const active = pathname === link.href || (link.href === "/owners" && !!pathname?.startsWith("/owners"));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative whitespace-nowrap font-serif font-bold uppercase tracking-[0.06em] xl:tracking-[0.08em] text-[11.5px] xl:text-[12.5px] py-2 transition-colors ${link.href === "/verification-safety" ? "hidden 2xl:inline-block" : link.href === "/owners" ? "hidden 2xl:inline-block" : ""} ${
                  active ? "text-gold" : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
                <span
                  className={`absolute left-0 -bottom-0.5 h-[2px] bg-gold transition-all duration-300 ${
                    active ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden min-[1120px]:flex gap-1 xl:gap-2 items-center shrink-0 whitespace-nowrap">{authButtons}</div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="min-[1120px]:hidden w-11 h-11 -mr-2 flex items-center justify-center rounded-lg text-white"
        >
          {open ? (
            <Icon name="close" className="w-6 h-6" />
          ) : (
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
              <path d="M4 7h16M4 12h16M10 17h10" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="min-[1120px]:hidden border-t border-white/10 bg-midnight px-5 pb-6 pt-3">
          <nav className="flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`font-display text-[26px] py-2.5 border-b border-white/[0.06] ${
                  pathname === link.href ? "text-gold" : "text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex gap-2 items-center mt-5">{authButtons}</div>
        </div>
      )}
    </header>
  );
}
