"use client";

import Link from "next/link";
import { useState } from "react";
import OwnerShell, { SignInPrompt, useAcademyData } from "@/components/OwnerShell";
import { supabase } from "@/lib/supabaseClient";
import { currentPass, fmtDate, pingAdminAlerts } from "@/lib/academy";

type GuideStep = { title: string; body: React.ReactNode; chips: string[]; link?: { label: string; href: string } };

const STEPS: GuideStep[] = [
  {
    title: "Check your car qualifies",
    body: (
      <>
        Right-hand drive, 12 seats or fewer, registered in Queensland. Left-hand-drive and club (special
        interest) rego cars can&apos;t carry paying passengers, but they can still do{" "}
        <Link href="/owners/costs#film-only" className="text-gold-dark font-semibold underline">
          Film &amp; Advertising
        </Link>
        .
      </>
    ),
    chips: ["5 min", "Free"],
  },
  {
    title: "Get an ABN and register for GST",
    body: (
      <>
        The ATO treats this like ride-sourcing: you must have an ABN and be registered for GST{" "}
        <b>before your first trip</b>, whatever you earn.
      </>
    ),
    chips: ["30 min", "Free"],
    link: { label: "ATO guide", href: "https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/sharing-economy-and-tax/ride-sourcing/registrations" },
  },
  {
    title: "Apply for your blue card",
    body: "Our passengers are mostly under 18, so Fleet Formal requires every driver to hold a blue card, on top of the law.",
    chips: ["$108.30 · 3 yrs", "Allow 2–4 weeks"],
    link: { label: "Apply", href: "https://www.qld.gov.au/jobs/blue-card/applications/apply" },
  },
  {
    title: "Apply for a Driver Authorisation (Booked hire/taxi)",
    body: "You need an open licence held for 3+ years. TMR checks your criminal, traffic and medical history.",
    chips: ["$52.70 check + $180.70/yr"],
    link: { label: "How to apply", href: "https://www.tmr.qld.gov.au/licensing/driver-authorisations/how-to-apply-renew-change-or-surrender" },
  },
  {
    title: "Book a safety inspection (COI)",
    body: "An Approved Inspection Station checks your car and records a Certificate of Inspection with TMR. Needed every 12 months.",
    chips: ["~$100–$150 est."],
    link: { label: "About COIs", href: "https://www.qld.gov.au/transport/buying/vehicleinspection/periodicinspection/about" },
  },
  {
    title: "Switch rego to Booked Hire + CTP Class 26",
    body: "Call your CTP insurer for a \"change of class\" letter to Class 26, then change your purpose of use to Booked Hire (BKHR).",
    chips: ["Extra ~$150–$280/yr est."],
    link: { label: "Compare CTP prices", href: "https://maic.qld.gov.au/resources/compare-pricing-tool/" },
  },
  {
    title: "Apply for your Booked Hire Service Licence",
    body: "The licence for your car. It lasts 12 months and can't be renewed, so you reapply each year.",
    chips: ["$294.50/yr", "5–20 business days"],
    link: { label: "Apply online", href: "https://www.service.transport.qld.gov.au/applyforbookedhirevehiclelicence/" },
  },
  {
    title: "Tell your insurer",
    body: "Most classic and agreed-value policies exclude paid passengers. Get cover that includes hire and reward, and upload the certificate of currency.",
    chips: ["Varies"],
  },
  {
    title: "Complete Fleet Formal training",
    body: "Four short modules with quizzes, about 55 minutes in total. Certificates save to your profile automatically. You only redo a module when it's updated, or every 3 years.",
    chips: ["~55 min", "Free"],
  },
  {
    title: "Upload your documents and go live",
    body: "We check each one against the TMR public register, usually within 2 business days. Then your car shows as Bookable.",
    chips: ["We do this"],
  },
];

export default function StartHerePage() {
  const { userId, attempts, reload, ready } = useAcademyData();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const ack = currentPass(attempts, "start-here");

  async function acknowledge() {
    setBusy(true);
    setErr(null);
    const { error } = await supabase.rpc("submit_training", { p_module: "start-here", p_version: 1, p_answers: [] });
    setBusy(false);
    if (error) return setErr(error.message);
    pingAdminAlerts();
    reload();
  }

  return (
    <OwnerShell>
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] items-start">
        <div>
          <div className="eyebrow !text-gold-dark !text-[11px]">Introduction · read this first</div>
          <h2 className="font-display text-[28px] md:text-[32px] mt-2 mb-2">Your road to formal night</h2>
          <p className="text-muted text-[14.5px] leading-relaxed mb-7">
            Driving students for money makes your car a <b>booked hire vehicle</b> under Queensland law,
            just like an Uber. Fleet Formal holds the booking licence; you and your car need your own.
            Most owners finish in <b>4 to 6 weeks</b>. Do these in order:
          </p>
          <ol className="relative">
            <span className="absolute left-[21px] top-2 bottom-2 w-[2px] bg-[linear-gradient(var(--gold),#e8e2cf)]" aria-hidden />
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative pl-16 pb-6">
                <span className="absolute left-0 top-0 w-11 h-11 rounded-full bg-midnight text-gold grid place-items-center font-display text-[18px] ring-4 ring-cream">
                  {i + 1}
                </span>
                <h3 className="font-serif font-extrabold text-[16px] mb-1">{s.title}</h3>
                <p className="text-muted text-[13.5px] leading-relaxed mb-2">{s.body}</p>
                <div className="flex gap-2 flex-wrap items-center">
                  {s.chips.map((c) => (
                    <span key={c} className="px-2.5 py-1 rounded-full text-[11.5px] font-semibold bg-[#fbf3dc] text-gold-dark">
                      {c}
                    </span>
                  ))}
                  {s.link && (
                    <a href={s.link.href} target="_blank" rel="noopener noreferrer" className="text-[12.5px] font-semibold text-gold-dark underline">
                      {s.link.label} ↗
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <div className="bg-white border border-line rounded-2xl p-5 mt-2 print:hidden">
            {!userId && ready ? (
              <SignInPrompt what="mark the guide as read" />
            ) : ack ? (
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#e7f4ec] text-[#2e8b57]">✓ Read and acknowledged</span>
                <span className="text-muted text-[13px]">on {fmtDate(ack.created_at)}</span>
                <Link href="/owners/training" className="btn-gold !py-2.5 !px-4 !text-[12px] ml-auto">
                  Start training
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3 flex-wrap justify-between">
                <p className="text-[13.5px]">I&apos;ve read the guide and understand what I need to do before my first booking.</p>
                <button onClick={acknowledge} disabled={busy} className="btn-gold !py-2.5 !px-4 !text-[12px]">
                  {busy ? "Saving…" : "I've read it"}
                </button>
              </div>
            )}
            {err && <p className="text-red-600 text-[13px] mt-2">{err}</p>}
          </div>
        </div>

        <div className="lg:sticky lg:top-24 grid gap-4">
          <div className="bg-midnight text-white rounded-2xl p-6">
            <div className="eyebrow !text-[11px]">At a glance</div>
            <dl className="mt-3 text-[14px]">
              {[
                ["Time to get ready", "4–6 weeks"],
                ["New licences & checks, per year", "~$756 est."],
                ["Your share per 2-hr formal", "$525"],
                ["Licences covered after", "2 formals"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 py-2 border-b border-white/10 last:border-0">
                  <dt>{k}</dt>
                  <dd className="font-bold">{v}</dd>
                </div>
              ))}
            </dl>
            <Link href="/owners/costs" className="btn-gold !py-2.5 !px-4 !text-[12px] mt-4">
              See costs &amp; earnings
            </Link>
          </div>
          <div className="bg-white border border-line rounded-2xl p-5">
            <div className="font-serif font-extrabold text-[14px]">Why all the paperwork?</div>
            <p className="text-muted text-[13px] leading-relaxed mt-2">
              Parents trust us with their kids on a huge night. Every licence and check is what lets us say{" "}
              <i>every Fleet Formal driver is verified</i>, and it keeps you insured and legal if anything goes wrong.
            </p>
            <button onClick={() => window.print()} className="mt-3 px-4 py-2.5 rounded-lg border border-line font-semibold text-[12.5px] print:hidden">
              ⤓ Save guide as PDF
            </button>
          </div>
        </div>
      </div>
    </OwnerShell>
  );
}
