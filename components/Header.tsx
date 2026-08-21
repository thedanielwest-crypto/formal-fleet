"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Browse Cars" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/verification-safety", label: "Verification & Safety" },
  { href: "/for-schools", label: "For Schools" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-navy text-white px-14 py-5 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-light to-gold flex items-center justify-center text-xl">
          🏆
        </div>
        <div className="font-serif font-bold text-2xl">
          Formal<span className="text-gold-light">Fleet</span>
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
        <Link href="/log-in" className="px-5 py-2.5 rounded-lg font-semibold text-sm border border-white/35">
          Log In
        </Link>
        <Link
          href="/list-your-car"
          className="px-5 py-2.5 rounded-lg font-semibold text-sm text-navy-deep bg-gradient-to-br from-gold-light to-gold"
        >
          List Your Car
        </Link>
      </div>
    </header>
  );
}
