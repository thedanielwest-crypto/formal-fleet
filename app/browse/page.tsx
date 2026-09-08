import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrustUSPs from "@/components/TrustUSPs";
import Badge from "@/components/Badge";
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

      <div className="flex flex-col md:flex-row gap-8 px-6 md:px-14 py-9 items-start">
        <aside className="w-full md:w-[250px] bg-white border border-line rounded-2xl p-5.5 shrink-0">
          <h3 className="font-serif text-[15px] mb-4">Filters</h3>
          <div className="mb-5">
            <h4 className="text-[12px] uppercase tracking-wide text-muted font-bold mb-2.5">
              Trust &amp; Verification
            </h4>
            <div className="flex flex-wrap gap-2">
              <div className="px-3 py-1.5 rounded-full text-[12.5px] font-medium bg-navy text-white">
                All listings
              </div>
              <div className="px-3 py-1.5 rounded-full text-[12.5px] font-medium border border-line">
                Verified only
              </div>
            </div>
          </div>
          <div className="mb-5">
            <h4 className="text-[12px] uppercase tracking-wide text-muted font-bold mb-2.5">
              Location
            </h4>
            <div className="flex flex-wrap gap-2">
              {["Brisbane North", "Samford", "The Gap", "Brendale"].map((l, i) => (
                <div
                  key={l}
                  className={`px-3 py-1.5 rounded-full text-[12.5px] font-medium border ${
                    i === 0 ? "bg-navy text-white border-navy" : "border-line"
                  }`}
                >
                  {l}
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="flex justify-between items-baseline mb-5">
            <h2 className="font-serif text-[22px]">{listings.length} cars near Brisbane</h2>
            <span className="text-muted text-sm">Sorted by: Newest</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {listings.map((listing) => (
              <Link
                key={listing.slug}
                href={`/listing/${listing.slug}`}
                className="block bg-white border border-line rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-[280px]">
                  <Image
                    src={listing.heroImage}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                  <Badge listing={listing} />
                  <div
                    className={`absolute bottom-3.5 right-3.5 px-3.5 py-1.5 rounded-lg text-[13px] font-bold text-white ${
                      listing.price === "free" ? "bg-[#1d7a4c]" : "bg-navy-deep"
                    }`}
                  >
                    {listing.priceLabel}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-[19px] mb-1 font-medium">{listing.title}</h3>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[13px] text-muted">
                      📍 {listing.suburb}, QLD
                    </span>
                    <span className="text-[13px] text-gold font-bold">★ New listing</span>
                  </div>
                  <p className="text-[13.5px] text-[#454e60] leading-relaxed mb-3.5">
                    {listing.description}
                  </p>
                  <div className="flex items-center gap-2.5">
                    <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-[12px] font-bold text-navy">
                      {listing.ownerInitials}
                    </div>
                    <div>
                      <div className="text-[13.5px] font-semibold">{listing.ownerName}</div>
                      <div className="text-[11.5px] text-muted">{listing.ownerSub}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>

      <LiveListings />

      <TrustUSPs />

      <Footer />
    </div>
  );
}
