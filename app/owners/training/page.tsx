"use client";

import Link from "next/link";
import OwnerShell, { chipClass, useAcademyData } from "@/components/OwnerShell";
import { MODULES, PASS_PERCENT } from "@/lib/academyContent";
import { STEPS, currentPass, fmtDate, stepState } from "@/lib/academy";

export default function TrainingPage() {
  const { userId, attempts, docs } = useAcademyData();

  return (
    <OwnerShell>
      <h2 className="font-display text-[26px]">Fleet Formal driver training</h2>
      <p className="text-muted text-[14.5px] mt-1 mb-6 max-w-[900px]">
        Four short modules, about 55 minutes in total. Modules 1 and 2 meet Queensland&apos;s legal training requirement for
        booked hire drivers. Modules 3 and 4 are the Fleet Formal standard, based on rideshare rules like Uber&apos;s Australian
        Community Guidelines. Pass each quiz with {PASS_PERCENT}% or more, and retake it as often as you like. You only redo a
        module when we update it, or every 3 years.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MODULES.map((m) => {
          const step = STEPS.find((s) => s.key === m.slug)!;
          const st = stepState(step, attempts, docs);
          const pass = currentPass(attempts, m.slug);
          return (
            <Link
              key={m.slug}
              href={`/owners/module?m=${m.slug}`}
              className="bg-white border border-line rounded-2xl p-5 flex flex-col gap-3 hover:border-gold transition-colors"
            >
              <div className="flex justify-between items-start gap-2">
                {userId ? (
                  <span className={`px-2.5 py-1 rounded-full text-[11.5px] font-semibold ${chipClass[st.state]}`}>
                    {st.state === "todo" ? "Not started" : st.label}
                  </span>
                ) : (
                  <span />
                )}
                <span className="text-[12px] text-muted">{m.minutes} min</span>
              </div>
              <h3 className="font-serif font-extrabold text-[16px] leading-snug">
                {m.num}. {m.title}
              </h3>
              <p className="text-muted text-[13px] leading-relaxed flex-1">{m.summary}</p>
              {pass && <p className="text-[12px] text-muted">Valid until {fmtDate(new Date(new Date(pass.created_at).getTime() + 3 * 365.25 * 864e5).toISOString())}</p>}
              <span className="self-start px-2.5 py-1 rounded-full text-[11.5px] font-semibold bg-[#fbf3dc] text-gold-dark">
                {m.required === "TMR" ? "Required by TMR" : "Fleet Formal standard"}
              </span>
            </Link>
          );
        })}
      </div>

      <section className="mt-10 bg-white border border-line rounded-2xl p-6">
        <div className="eyebrow !text-gold-dark !text-[11px]">Training outline</div>
        <h3 className="font-serif font-extrabold text-[18px] mt-1 mb-2">About our driver training</h3>
        <p className="text-muted text-[13.5px] leading-relaxed mb-4">
          Published under section 8 of the Queensland Personalised Transport Required Driver Training Notice.
        </p>
        <dl className="grid gap-4 sm:grid-cols-3 text-[13.5px]">
          <div>
            <dt className="font-semibold">What it covers</dt>
            <dd className="text-muted mt-1 leading-relaxed">
              Anti-discrimination awareness including sexual harassment; disability awareness including assistance animals;
              respect and privacy (including LGBTQ+ inclusion); child safety for under-18 passengers.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">How it&apos;s delivered</dt>
            <dd className="text-muted mt-1 leading-relaxed">
              Online, self-paced, on fleetformal.com. Each module ends with a written assessment marked automatically
              ({PASS_PERCENT}% to pass). Drivers can download their certificate and records at any time.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Who provides it</dt>
            <dd className="text-muted mt-1 leading-relaxed">
              Fleet Formal, the authorised booking entity. Refreshed when the law or the training changes, and at least
              every 3 years.
            </dd>
          </div>
        </dl>
      </section>
    </OwnerShell>
  );
}
