import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrustUSPs from "@/components/TrustUSPs";
import StatsBanner from "@/components/StatsBanner";
import { IconBadge } from "@/components/BrandIcon";
import type { IconName } from "@/components/BrandIcon";
import { listings } from "@/lib/listings";

export const metadata: Metadata = {
  title: "Fleet Formal — Your Formal. Your Ride.",
  description:
    "Brisbane's marketplace connecting verified classic and show car owners with students and schools for an unforgettable, safe ride to formal night.",
};

const trustBadges = [
  "ID & Licence Verified",
  "WWCC Confirmed",
  "Insurance Checked",
  "Parent Booking Confirmation",
];

const formalSteps = [
  {
    n: "1",
    title: "Browse by suburb",
    body: "See every verified owner's car, suburb, and hourly rate — Gold Verified means ID, licence, insurance, and WWCC are all confirmed.",
  },
  {
    n: "2",
    title: "Request to book",
    body: "Pick your ride, choose your formal date and pickup spot, and send a booking request straight to the owner.",
  },
  {
    n: "3",
    title: "Parent confirms, you ride",
    body: "A parent or guardian confirms the booking before it locks in — then it's arrival-in-style o'clock.",
  },
];

const extras: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "celebration",
    title: "Weddings & engagements",
    body: "The same verified owners and cars, available for your big day — ask about availability on any listing.",
  },
  {
    icon: "star",
    title: "Photoshoots & social content",
    body: "Hire a head-turning car for an hour or two for graduation photos, a portrait session, or a shoot.",
  },
  {
    icon: "car",
    title: "Scenic drives & tours",
    body: "Some owners are happy to take you on a scenic drive before your event — look for the badge on their listing.",
  },
  {
    icon: "trophy",
    title: "Birthdays & special occasions",
    body: "Milestone birthday, anniversary, or just because — the same hourly booking works for any occasion.",
  },
];

const featuredSlugs = ["mazda-rx7-peter-stuyvesant-tribute", "ac-cobra-replica", "porsche-911-eddy"];

export default function HomePage() {
  const featured = featuredSlugs
    .map((slug) => listings.find((l) => l.slug === slug))
    .filter((l): l is NonNullable<typeof l> => !!l);

  return (
    <div>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-deep text-white">
        <div className="absolute inset-0">
          <Image
            src="/demo/mustang-gt500.png"
            alt=""
            fill
            priority
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,27,42,0.75),rgba(13,27,42,0.92)_70%,rgba(13,27,42,0.98))]" />
        </div>
        <div className="relative px-6 md:px-14 pt-16 pb-14 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/[0.08] border border-white/15 px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold text-gold-light mb-5">
            Brisbane North, QLD — School Formals, first
          </div>
          <h1 className="font-serif font-black uppercase tracking-tight text-5xl md:text-6xl leading-[1.02]">
            Your formal.
            <br />
            <span className="text-gold-light">Your ride.</span>
          </h1>
          <p className="mt-5 text-slate-300 text-[16px] max-w-xl leading-relaxed">
            Real classic, muscle and show cars — driven by verified local owners — booked by the
            hour for formal night. Every booking needs parent sign-off, every driver is checked,
            every ride is one to remember.
          </p>
          <div className="flex flex-wrap gap-3.5 mt-7">
            <Link
              href="/browse"
              className="px-7 py-3.5 rounded-xl font-bold text-[15px] text-navy-deep bg-gradient-to-br from-gold-light to-gold"
            >
              Find a Ride
            </Link>
            <Link
              href="/list-your-car"
              className="px-7 py-3.5 rounded-xl font-bold text-[15px] border border-white/30"
            >
              List Your Ride
            </Link>
          </div>
        </div>

        <div className="relative px-6 md:px-14 pb-10 flex gap-4 flex-wrap">
          {trustBadges.map((t) => (
            <div
              key={t}
              className="flex items-center gap-2 bg-white/[0.07] border border-white/15 px-3.5 py-2 rounded-full text-[13px] font-medium"
            >
              ✓ {t}
            </div>
          ))}
        </div>
      </section>

      <StatsBanner />

      {/* Formals, front and centre */}
      <section className="px-6 md:px-14 py-14 bg-cream">
        <div className="max-w-xl mb-8">
          <div className="text-[12.5px] font-bold uppercase tracking-wide text-gold mb-2">
            Our focus
          </div>
          <h2 className="font-serif text-[26px] md:text-[30px] leading-tight">
            Built, first and foremost, for School Formals
          </h2>
          <p className="mt-3 text-[14.5px] text-[#454e60] leading-relaxed">
            Fleet Formal exists so every student can arrive at formal night in something
            unforgettable — safely, and with their school or P&amp;C in the loop the whole way.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {formalSteps.map((s) => (
            <div key={s.n} className="flex gap-4 bg-white border border-line rounded-2xl p-5">
              <div className="w-9 h-9 rounded-full bg-navy text-gold-light font-serif font-bold flex items-center justify-center shrink-0">
                {s.n}
              </div>
              <div>
                <h3 className="font-semibold text-[15px] mb-1">{s.title}</h3>
                <p className="text-[13.5px] text-[#454e60] leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3.5 mt-7 flex-wrap">
          <Link
            href="/for-schools"
            className="px-6 py-3 rounded-xl font-bold text-[14px] text-white bg-navy"
          >
            For Schools &amp; P&amp;Cs
          </Link>
          <Link
            href="/how-it-works"
            className="px-6 py-3 rounded-xl font-bold text-[14px] border border-line bg-white"
          >
            See how it works
          </Link>
        </div>
      </section>

      {/* Featured cars */}
      {featured.length > 0 && (
        <section className="px-6 md:px-14 py-14">
          <div className="flex justify-between items-baseline mb-6 flex-wrap gap-3">
            <h2 className="font-serif text-[24px]">A taste of what&rsquo;s on Fleet Formal</h2>
            <Link href="/browse" className="text-[13.5px] font-bold text-navy underline">
              Browse all cars →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {featured.map((car) => (
              <Link
                key={car.slug}
                href={`/listing/${car.slug}`}
                className="block bg-white border border-line rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-[200px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={car.heroImage} alt={car.title} className="w-full h-full object-cover" />
                  <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg text-[12.5px] font-bold text-white bg-navy-deep">
                    {car.priceLabel}
                  </div>
                </div>
                <div className="px-4 py-4">
                  <h3 className="text-[15.5px] font-medium">{car.title}</h3>
                  <p className="text-[12.5px] text-muted mt-1">{car.suburb}, {car.region}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Extras */}
      <section className="px-6 md:px-14 py-14 bg-navy-deep text-white">
        <div className="max-w-xl mb-8">
          <div className="text-[12.5px] font-bold uppercase tracking-wide text-gold-light mb-2">
            Beyond formal night
          </div>
          <h2 className="font-serif text-[26px] md:text-[30px] leading-tight">Extras</h2>
          <p className="mt-3 text-[14.5px] text-slate-300 leading-relaxed">
            Formals come first, but the same verified fleet is available for plenty of other
            occasions — just ask the owner on their listing.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {extras.map((e) => (
            <div key={e.title} className="bg-white/[0.06] border border-white/12 rounded-2xl p-5">
              <IconBadge name={e.icon} tone="gold" size="w-11 h-11" iconSize="w-4.5 h-4.5" />
              <h3 className="font-semibold text-[14.5px] mt-3.5 mb-1.5">{e.title}</h3>
              <p className="text-[12.5px] text-slate-300 leading-relaxed">{e.body}</p>
            </div>
          ))}
        </div>
      </section>

      <TrustUSPs />

      <Footer />
    </div>
  );
}
