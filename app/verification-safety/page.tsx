import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { IconBadge } from "@/components/BrandIcon";
import type { IconName } from "@/components/BrandIcon";

export const metadata: Metadata = {
  title: "Verification & Safety — Formal Fleet",
  description: "Every Formal Fleet owner is checked before their listing goes live — ID, licence, insurance, WWCC, and parent-confirmed bookings.",
};

const checks: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "id",
    title: "ID & Licence Verified",
    body: "Every owner's identity and driver's licence are checked before their car can be listed. No listing goes live without this.",
  },
  {
    icon: "badge",
    title: "WWCC Confirmed",
    body: "Owners driving minors hold a current Working With Children Check (WWCC), verified against the QLD register.",
  },
  {
    icon: "shield",
    title: "Insurance Checked",
    body: "Comprehensive insurance covering passengers is confirmed and kept on file for every listed vehicle.",
  },
  {
    icon: "phone",
    title: "Parent Booking Confirmation",
    body: "No booking is finalised without a parent or guardian confirming it first. Full trip and pickup details are then sent by SMS.",
  },
];

export default function VerificationSafety() {
  return (
    <div>
      <Header />

      <section className="bg-gradient-to-b from-navy-deep to-navy text-white px-14 pt-10 pb-9">
        <h1 className="font-serif font-bold text-4xl max-w-2xl leading-tight">
          Verification &amp; <span className="text-gold-light">Safety</span>
        </h1>
        <p className="mt-3 text-slate-300 max-w-xl">
          Formal Fleet is a verified marketplace, not an open listing board. Here's exactly what
          we check, and what each badge means.
        </p>
      </section>

      <div className="px-14 py-10">
        <div className="grid grid-cols-2 gap-5 max-w-4xl">
          {checks.map((c) => (
            <div key={c.title} className="flex gap-4 bg-white border border-line rounded-2xl p-5">
              <div className="shrink-0">
                <IconBadge name={c.icon} tone="navy" size="w-11 h-11" iconSize="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[15.5px] mb-1">{c.title}</h3>
                <p className="text-[13.5px] text-[#454e60] leading-relaxed">{c.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 max-w-4xl">
          <h2 className="font-serif text-[20px] mb-4">Badge tiers</h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 bg-white border border-line rounded-xl px-5 py-4">
              <span className="w-2.5 h-2.5 rounded-full bg-gold shrink-0" />
              <div>
                <span className="font-bold text-[14px]">Gold Verified</span>
                <span className="text-[13px] text-muted ml-2">
                  ID, licence, insurance, and WWCC all confirmed.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white border border-line rounded-xl px-5 py-4">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
              <div>
                <span className="font-bold text-[14px]">Verified</span>
                <span className="text-[13px] text-muted ml-2">
                  ID, licence, and insurance confirmed.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white border border-line rounded-xl px-5 py-4">
              <span className="w-2.5 h-2.5 rounded-full bg-amber shrink-0" />
              <div>
                <span className="font-bold text-[14px]">Verification Pending</span>
                <span className="text-[13px] text-muted ml-2">
                  Checks are in progress — the listing is visible, but not yet fully confirmed.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 max-w-4xl bg-amber-bg border border-amber/30 rounded-2xl px-6 py-5">
          <p className="text-[13.5px] text-[#6b4a12] leading-relaxed">
            Something feel off about a listing or a message? Reach out and we'll look into it
            straight away. Trust is the entire point of Formal Fleet — see how the booking flow
            protects it on our{" "}
            <Link href="/how-it-works" className="underline font-semibold">
              How It Works
            </Link>{" "}
            page.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
