"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/authContext";
import { loadAcademy, type Attempt, type DriverDoc } from "@/lib/academy";

const tabs = [
  { href: "/owners", label: "Overview" },
  { href: "/owners/start", label: "Start here" },
  { href: "/owners/costs", label: "Costs & earnings" },
  { href: "/owners/requirements", label: "Requirements" },
  { href: "/owners/training", label: "Training" },
  { href: "/owners/documents", label: "My documents" },
];

/** Page frame for the Owner Academy: header, hero, section tabs, footer. */
export default function OwnerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()?.replace(/\/$/, "") || "/owners";
  return (
    <div>
      <Header />
      <section className="relative overflow-hidden bg-midnight text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/hero-formal-night.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-[75%_30%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,19,38,0.97)_0%,rgba(1,19,38,0.86)_42%,rgba(1,19,38,0.25)_78%,rgba(1,19,38,0.1)_100%)]" />
        <div className="relative max-w-[1180px] mx-auto px-5 md:px-7 py-10 md:py-12">
          <div className="eyebrow">Owner Academy</div>
          <h1 className="font-display text-[36px] md:text-[56px] mt-3 mb-3">
            Your car.
            <br />
            <span className="text-gold">Their big night.</span>
          </h1>
          <p className="max-w-[560px] text-white/80 text-[15px] leading-relaxed">
            Everything you need to drive students to their formal, legally and safely: licences,
            training and the real numbers. Work through it at your own pace. We&apos;ll check
            everything before your first booking.
          </p>
        </div>
      </section>
      <nav className="bg-navy-deep border-b border-white/5" aria-label="Owner Academy sections">
        <div className="max-w-[1180px] mx-auto px-5 md:px-7 flex gap-1 overflow-x-auto">
          {tabs.map((t) => {
            const active = pathname === t.href || (t.href === "/owners/training" && pathname.startsWith("/owners/module"));
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`px-3.5 py-3.5 whitespace-nowrap font-serif font-bold uppercase tracking-[0.08em] text-[12px] border-b-2 ${
                  active ? "text-white border-gold" : "text-white/65 border-transparent hover:text-white"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </div>
      </nav>
      <main className="max-w-[1180px] mx-auto px-4 md:px-7 py-8 md:py-10">{children}</main>
      <Footer cta={false} />
    </div>
  );
}

/** Signed-in user's training attempts and documents. */
export function useAcademyData() {
  const { session, profile, loading } = useAuth();
  const userId = session?.user?.id ?? null;
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [docs, setDocs] = useState<DriverDoc[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!userId) return;
    const r = await loadAcademy(userId);
    setAttempts(r.attempts);
    setDocs(r.docs);
    setError(r.error);
    setReady(true);
  }, [userId]);

  useEffect(() => {
    if (userId) reload();
    else if (!loading) setReady(true);
  }, [userId, loading, reload]);

  return { session, profile, authLoading: loading, userId, attempts, docs, ready, error, reload };
}

export function SignInPrompt({ what }: { what: string }) {
  return (
    <div className="bg-white border border-line rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <div className="font-serif font-extrabold text-[16px]">Log in to {what}</div>
        <p className="text-muted text-[13.5px] mt-1">
          Your progress and documents are saved to your Fleet Formal owner account.
        </p>
      </div>
      <div className="flex gap-2">
        <Link href="/login" className="px-4 py-2.5 rounded-lg border border-line font-semibold text-[13.5px] bg-white">
          Log in
        </Link>
        <Link href="/signup?role=driver" className="btn-gold !py-2.5 !px-5 !text-[13px]">
          Create an owner account
        </Link>
      </div>
    </div>
  );
}

export const chipClass: Record<string, string> = {
  done: "bg-[#e7f4ec] text-[#2e8b57]",
  review: "bg-amber-bg text-amber",
  progress: "bg-amber-bg text-amber",
  rejected: "bg-red-50 text-red-600",
  expired: "bg-red-50 text-red-600",
  todo: "bg-[#eef0f4] text-[#5d6878]",
};
