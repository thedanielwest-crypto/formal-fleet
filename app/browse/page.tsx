import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrustUSPs from "@/components/TrustUSPs";
import LiveListings from "@/components/LiveListings";
import { listings } from "@/lib/listings";

export const metadata: Metadata = {
  title: "Browse Cars — Formal Fleet",
  description: "Every verified and unverified car currently listed on Formal Fleet.",
};

export default function BrowsePage() {
  return (
    <div>
      <Header />

      <section className="bg-gradient-to-b from-navy-deep to-navy text-white px-6 md:px-14 pt-10 pb-9">
        <h1 className="font-serif font-bold text-4xl max-w-2xl leading-tight">
          Arrive at formal in <span className="text-gold-light">something unforgettable.</span>
        </h1>
        <p className="mt-3 text-slate-300 max-w-xl">
          Brisbane&rsquo;s first Formal Fleet listings — real cars, real verified owners.
        </p>
        <div className="flex gap-5 mt-6 flex-wrap">
          {[
            "ID & Licence Verified",
            "WWCC Confirmed",
            "Insurance Checked",
            "Parent Booking Confirmation",
          ].map((t) => (
            <div
              key={t}
              className="flex items-center gap-2 bg-white/[0.07] border border-white/15 px-3.5 py-2 rounded-full text-[13px] font-medium"
            >
              ✓ {t}
            </div>
          ))}
        </div>
      </section>

      {/* LiveListings fetches the live car_submissions rows client-side,
          merges them with these static demo listings into one shared shape,
          and owns all filtering — see components/LiveListings.tsx. */}
      <LiveListings listings={listings} />

      <TrustUSPs />

      <Footer />
    </div>
  );
}
