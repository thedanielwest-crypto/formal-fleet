"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/BrandIcon";
import { STEPS, loadAcademy, stepState } from "@/lib/academy";

/** Owner Academy progress card for the driver dashboard. */
export default function AcademyCard({ userId }: { userId: string }) {
  const [done, setDone] = useState<number | null>(null);
  const [next, setNext] = useState<{ title: string; href: string } | null>(null);

  useEffect(() => {
    loadAcademy(userId).then(({ attempts, docs }) => {
      const states = STEPS.map((s) => ({ s, st: stepState(s, attempts, docs).state }));
      setDone(states.filter((x) => x.st === "done").length);
      const n = states.find((x) => x.st !== "done");
      setNext(n ? { title: n.s.title, href: n.s.href } : null);
    });
  }, [userId]);

  if (done === null) return null;
  const pct = Math.round((done / STEPS.length) * 100);
  return (
    <div className="bg-midnight text-white rounded-2xl p-5 mb-8 flex flex-wrap items-center gap-5">
      <div className="w-11 h-11 rounded-xl bg-gold/15 text-gold grid place-items-center shrink-0">
        <Icon name="graduate" className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-[220px]">
        <div className="eyebrow !text-[11px]">Owner Academy</div>
        <div className="font-semibold text-[15px] mt-0.5">
          {done === STEPS.length ? "All 12 steps done. You're bookable!" : `${done} of ${STEPS.length} steps done`}
        </div>
        <div className="h-1.5 rounded-full bg-white/10 mt-2 overflow-hidden max-w-[360px]">
          <div className="h-full bg-gold" style={{ width: `${pct}%` }} />
        </div>
        {next && <div className="text-white/70 text-[12.5px] mt-1.5">Next up: {next.title}</div>}
      </div>
      <Link href={next?.href ?? "/owners"} className="btn-gold !py-2.5 !px-4 !text-[12px]">
        {done === 0 ? "Start here" : done === STEPS.length ? "View Academy" : "Continue"}
      </Link>
    </div>
  );
}
