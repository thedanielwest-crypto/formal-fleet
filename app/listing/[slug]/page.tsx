import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getListingBySlug, listings } from "@/lib/listings";

export function generateStaticParams() {
  return listings.map((l) => ({ slug: l.slug }));
}

export default async function ListingDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = getListingBySlug(slug);
  if (!listing) notFound();

  const badges =
    listing.badge === "pending"
      ? ["Verification Pending"]
      : listing.badge === "gold"
      ? ["Gold Verified Driver", "WWCC Confirmed", "Insurance Checked"]
      : ["Verified Driver", "Insurance Checked"];

  return (
    <div>
      <Header />

      <div className="px-14 pt-5 text-[13px] text-muted">
        <Link href="/" className="hover:underline">
          Browse Cars
        </Link>{" "}
        &nbsp;›&nbsp;{" "}
        <span className="text-ink font-semibold">{listing.title}</span>
      </div>

      <div className="flex gap-9 px-14 pt-5 pb-16 items-start">
        <div className="flex-1">
          <div
            className={`grid gap-2.5 rounded-2xl overflow-hidden h-[420px] ${
              listing.gallery.length > 1 ? "grid-cols-[2fr_1fr]" : "grid-cols-1"
            }`}
          >
            <div className="relative">
              <Image
                src={listing.gallery[0]}
                alt={listing.title}
                fill
                className="object-cover"
              />
            </div>
            {listing.gallery.length > 1 && (
              <div className="grid gap-2.5" style={{ gridTemplateRows: `repeat(${listing.gallery.length - 1}, 1fr)` }}>
                {listing.gallery.slice(1).map((img, i) => (
                  <div key={i} className="relative">
                    <Image src={img} alt={`${listing.title} photo ${i + 2}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6">
            <h1 className="font-serif text-[28px]">{listing.title}</h1>
            <div className="text-[13.5px] text-muted mt-1">
              📍 {listing.suburb}, {listing.region}
            </div>
          </div>

          <div className="flex gap-2.5 mt-4.5 flex-wrap">
            {badges.map((b) => (
              <div
                key={b}
                className="flex items-center gap-1.5 bg-white border border-line px-3.5 py-2 rounded-full text-[12.5px] font-semibold"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    listing.badge === "pending" ? "bg-amber" : "bg-gold"
                  }`}
                />
                {b}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="font-serif text-[19px] mb-3">About this ride</h2>
            <p className="text-[14.5px] leading-relaxed text-[#454e60] max-w-2xl">
              {listing.description}
            </p>
          </div>
        </div>

        <div className="w-[360px] shrink-0">
          <div className="bg-white border border-line rounded-2xl p-6.5 sticky top-5 shadow-lg shadow-navy/5">
            <div className="text-[28px] font-extrabold">
              {listing.price === "free" ? (
                "Free"
              ) : (
                <>
                  ${listing.price.toFixed(2).replace(/\.00$/, "")}{" "}
                  <span className="text-sm font-medium text-muted">/ trip</span>
                </>
              )}
            </div>
            <button className="w-full mt-5.5 bg-navy text-white rounded-xl py-3.5 font-bold text-[14.5px]">
              Request to Book
            </button>
            <button className="w-full mt-2.5 bg-white text-navy border border-line rounded-xl py-3 font-bold text-[14.5px]">
              Message the owner
            </button>
            <div className="mt-4.5 text-[12px] text-muted flex gap-2 items-start leading-relaxed">
              🛡️ Parent/guardian confirmation is required before this booking is finalised, and full trip details are sent by SMS once confirmed.
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
