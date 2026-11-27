"use client";

import Link from "next/link";
import OwnerShell, { SignInPrompt, chipClass, useAcademyData } from "@/components/OwnerShell";
import { Icon } from "@/components/BrandIcon";
import { STEPS, stepState } from "@/lib/academy";

export default function OwnerHubPage() {
  const { userId, profile, attempts, docs, ready } = useAcademyData();
  const states = STEPS.map((s) => ({ step: s, ...stepState(s, attempts, docs) }));
  const done = userId ? states.filter((s) => s.state === "done").length : 0;
  const pct = Math.round((done / STEPS.length) * 100);
  const next = states.find((s) => s.state !== "done");
  const firstName = profile?.name?.split(" ")[0];

  return (
    <OwnerShell>
      <div className="flex gap-4 items-center bg-midnight text-white rounded-2xl p-5 mb-6">
        <div className="w-10 h-10 shrink-0 rounded-xl bg-gold/15 text-gold flex items-center justify-center">
          <Icon name="shield" className="w-5 h-5" />
        </div>
        <div>
          <div className="font-semibold text-[14px]">
            {done === STEPS.length ? "You're ready for bookings" : "Finish all 12 steps before your first paid booking"}
          </div>
          <p className="text-white/80 text-[13.5px] mt-0.5">
            Queensland law says every car and driver must be licensed and trained before a paid trip.
            Once everything is verified, your listing switches to <b className="text-gold">Bookable</b>.
          </p>
        </div>
      </div>

      {!userId && ready && (
        <div className="mb-6">
          <SignInPrompt what="track your progress" />
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1fr_1.5fr] items-start">
        <div className="bg-white border border-line rounded-2xl p-6">
          <div className="flex gap-6 items-center flex-wrap">
            <div
              className="w-[132px] h-[132px] shrink-0 rounded-full grid place-items-center"
              style={{ background: `conic-gradient(var(--gold) 0 ${pct}%, #e9e5d8 ${pct}% 100%)` }}
            >
              <div className="w-[104px] h-[104px] rounded-full bg-white grid place-items-center text-center">
                <div>
                  <div className="font-display text-[30px]">
                    {done}/{STEPS.length}
                  </div>
                  <div className="text-[11px] text-muted">steps done</div>
                </div>
              </div>
            </div>
            <div className="min-w-0">
              <div className="eyebrow !text-gold-dark !text-[11px]">Your progress</div>
              <h2 className="font-serif font-extrabold text-[19px] my-1.5">
                {!userId ? "Welcome, car owner." : done === 0 ? `Let's get started${firstName ? `, ${firstName}` : ""}.` : done === STEPS.length ? "All done. Nice work!" : `Nice progress${firstName ? `, ${firstName}` : ""}.`}
              </h2>
              {next && (
                <>
                  <p className="text-muted text-[13px] mb-3">Next up: {next.step.title}</p>
                  <Link href={next.step.href} className="btn-gold !py-2.5 !px-4 !text-[12px]">
                    Continue <Icon name="arrowRight" className="w-4 h-4 btn-arrow" strokeWidth={2.2} />
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="mt-6 pt-5 border-t border-line">
            <div className="eyebrow !text-muted !text-[11px]">What you could earn</div>
            <div className="flex justify-between items-end gap-3 mt-2 flex-wrap">
              <div>
                <div className="font-display text-gold text-[34px]">$1,575</div>
                <div className="text-[12.5px] text-muted">your share of 3 formals (2 hrs each at $350/hr)</div>
              </div>
              <Link href="/owners/costs" className="px-4 py-2.5 rounded-lg border border-line font-semibold text-[12.5px]">
                See the maths
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white border border-line rounded-2xl p-6">
          {(["learn", "licence"] as const).map((g) => (
            <div key={g} className={g === "licence" ? "mt-6" : ""}>
              <div className="eyebrow !text-muted !text-[11px] mb-1">{g === "learn" ? "Learn" : "Licences & checks (upload proof)"}</div>
              <ul>
                {states
                  .filter((s) => s.step.group === g)
                  .map(({ step, state, label }) => (
                    <li key={step.key} className="border-t border-[#f0ede4] first:border-t-0">
                      <Link href={step.href} className="flex gap-3.5 items-center py-3 group flex-wrap">
                        <div className="w-[38px] h-[38px] shrink-0 rounded-[10px] bg-[#f6f1e1] text-gold-dark grid place-items-center">
                          <Icon name={step.icon} className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-[180px]">
                          <div className="font-semibold text-[14px] group-hover:underline">{step.title}</div>
                          <div className="text-[12.5px] text-muted">{step.detail}</div>
                        </div>
                        {userId && (
                          <span className={`px-2.5 py-1 rounded-full text-[11.5px] font-semibold whitespace-nowrap ${chipClass[state]}`}>
                            {label}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-white border border-line rounded-2xl p-5 flex flex-wrap gap-4 items-center justify-between">
        <div>
          <div className="font-serif font-extrabold text-[15px]">Club rego or left-hand drive?</div>
          <p className="text-muted text-[13px] mt-1">
            You can&apos;t take passenger bookings, but you can still earn from Film &amp; Advertising shoots.
          </p>
        </div>
        <Link href="/owners/costs#film-only" className="btn-gold !py-2.5 !px-4 !text-[12px]">
          Film &amp; Advertising
        </Link>
      </div>
    </OwnerShell>
  );
}
