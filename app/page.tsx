import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrustUSPs from "@/components/TrustUSPs";
import { Icon, IconBadge } from "@/components/BrandIcon";
import type { IconName } from "@/components/BrandIcon";
import { listings } from "@/lib/listings";

export const metadata: Metadata = {
  title: "Fleet Formal — Your Formal. Your Ride.",
  description:
    "Find amazing vehicles and arrive at formal in unforgettable style. Verified local owners, parent-confirmed bookings, Brisbane North.",
};

const checklist = [
  "Find amazing vehicles",
  "Connect with local owners",
  "Safe, simple and trusted",
  "From classics to modern icons",
];

const audiences: { icon: IconName; title: string; body: string; href: string }[] = [
  { icon: "graduate", title: "For Students", body: "Find amazing rides for your formal.", href: "/browse" },
  { icon: "car", title: "For Vehicle Owners", body: "Share your ride. Make their night.", href: "/list-your-car" },
  { icon: "shield", title: "Safe & Trusted", body: "Clear information. Real people. Real rides.", href: "/verification-safety" },
  { icon: "users", title: "For Schools", body: "Supporting unforgettable formals.", href: "/for-schools" },
];

const steps = [
  {
    n: "01",
    title: "Find your ride",
    body: "Scroll muscle cars, Euro icons, JDM legends and proper classics. Every owner is local and every car is real.",
  },
  {
    n: "02",
    title: "Lock it in",
    body: "Send a booking request for your formal date. A parent or guardian signs off — then it's official.",
  },
  {
    n: "03",
    title: "Pull up in style",
    body: "Your driver collects you on the night. Cameras out, everyone looks — that's your entrance sorted.",
  },
];

const extras: { icon: IconName; title: string; body: string }[] = [
  { icon: "ring", title: "Weddings", body: "Same verified owners, available for the big day." },
  { icon: "camera", title: "Photoshoots", body: "Grad photos, portraits, content — book by the hour." },
  { icon: "car", title: "Scenic drives", body: "Some owners will take the long way round. Look for the badge." },
  { icon: "film", title: "Movie hire", body: "Film, TV and music-video shoots. Hero cars for the screen." },
  { icon: "sparkle", title: "Birthdays & more", body: "18ths, anniversaries, or just because." },
];

const featuredSlugs = [
  "mazda-rx7-peter-stuyvesant-tribute",
  "ac-cobra-replica",
  "amc-amx-chris",
  "mgb-convertible-malcolm",
  "subaru-brz-cyril",
  "alfa-156-gta-russell",
  "ford-roadster-anthony",
  "bmw-e36-cyrus",
  "honda-super-one-boden",
  "chevrolet-styleline-renato",
];

export default function HomePage() {
  const featured = featuredSlugs
    .map((slug) => listings.find((l) => l.slug === slug))
    .filter((l): l is NonNullable<typeof l> => !!l);

  return (
    <div className="bg-cream">
      <Header />

      {/* ---------- HERO: the poster, live ---------- */}
      <section className="relative overflow-hidden bg-midnight text-white">
        <picture>
          <source media="(max-width: 767px)" srcSet="/brand/hero-formal-night-mobile.jpg" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/hero-formal-night.jpg"
            alt="Four students in formal wear laughing beside a black classic Mustang at dusk, city lights behind"
            className="drift absolute inset-0 w-full h-full object-cover object-[62%_50%] md:object-[70%_55%]"
          />
        </picture>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,19,38,0.96)_0%,rgba(1,19,38,0.82)_34%,rgba(1,19,38,0.25)_62%,rgba(1,19,38,0)_100%)] max-md:bg-[linear-gradient(180deg,rgba(1,19,38,0.55)_0%,rgba(1,19,38,0.35)_35%,rgba(1,19,38,0.92)_78%,rgba(1,19,38,1)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-midnight to-transparent" />

        <div className="relative px-6 md:px-14 pt-[44vh] md:pt-24 lg:pt-28 pb-14 md:pb-24 md:min-h-[780px] flex flex-col justify-end md:justify-center">
          <div className="max-w-[920px]">
            <div className="eyebrow rise">Youthful · Luxury · Automotive</div>
            <h1 className="font-display text-[54px] sm:text-[76px] lg:text-[104px] mt-4 rise rise-1 lg:whitespace-nowrap">
              Your formal.
              <br />
              <span className="gold-shine">Your ride.</span>
            </h1>
            <p className="mt-5 text-[17px] md:text-[19px] text-white/90 max-w-md rise rise-2">
              Find amazing vehicles. Arrive in unforgettable style.
            </p>

            <div className="flex flex-wrap gap-3 mt-8 rise rise-3">
              <Link href="/browse" className="btn-gold">
                <Icon name="search" className="w-5 h-5" strokeWidth={2.2} />
                Find a Ride
                <Icon name="arrowRight" className="w-5 h-5 btn-arrow" strokeWidth={2.2} />
              </Link>
              <Link href="/list-your-car" className="btn-outline">
                <Icon name="car" className="w-5 h-5" strokeWidth={2} />
                List Your Ride
                <Icon name="arrowRight" className="w-5 h-5 btn-arrow" strokeWidth={2} />
              </Link>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 mt-9 max-w-[620px] rise rise-4">
              {checklist.map((c) => (
                <li key={c} className="flex items-center gap-2.5 text-[14.5px] text-white/90">
                  <Icon name="checkCircle" className="w-5 h-5 text-gold shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </section>

      {/* Audience row — straight off the poster */}
      <section className="bg-midnight text-white">
        <div className="px-6 md:px-14 pb-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-gold/25 pt-10 gap-y-10">
            {audiences.map((a, i) => (
              <Link
                key={a.title}
                href={a.href}
                className={`group text-center px-3 ${i > 0 ? "lg:border-l lg:border-gold/40" : ""} ${
                  i % 2 === 1 ? "max-lg:border-l max-lg:border-gold/40" : ""
                }`}
              >
                <IconBadge name={a.icon} tone="gold" size="w-14 h-14" />
                <h3 className="font-serif font-extrabold uppercase tracking-[0.06em] text-[14px] mt-4 group-hover:text-gold transition-colors">
                  {a.title}
                </h3>
                <p className="text-[13.5px] text-white/75 mt-1.5 max-w-[200px] mx-auto">{a.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- PICK YOUR RIDE carousel ---------- */}
      <section className="bg-midnight text-white pt-4 pb-16">
        <div className="px-6 md:px-14 flex items-end justify-between gap-4 flex-wrap mb-7">
          <div>
            <div className="eyebrow mb-2">The garage</div>
            <h2 className="font-display text-[38px] md:text-[52px]">
              Pick your <span className="text-gold">ride.</span>
            </h2>
          </div>
          <Link
            href="/browse"
            className="font-serif font-bold uppercase tracking-[0.08em] text-[13px] text-gold hover:text-gold-light flex items-center gap-2"
          >
            See all {listings.length} rides <Icon name="arrowRight" className="w-4 h-4" strokeWidth={2.2} />
          </Link>
        </div>

        <div className="no-scrollbar flex gap-5 overflow-x-auto snap-x snap-mandatory px-6 md:px-14 pb-4">
          {featured.map((car) => (
            <Link
              key={car.slug}
              href={`/listing/${car.slug}`}
              className="lift snap-start shrink-0 w-[300px] md:w-[380px] rounded-2xl overflow-hidden bg-navy-deep border border-white/10 group"
            >
              <div className="relative h-[250px] md:h-[290px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={car.heroImage}
                  alt={car.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,19,38,0)_40%,rgba(1,19,38,0.95)_100%)]" />
                <span
                  className={`absolute top-3.5 left-3.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                    car.badge === "pending"
                      ? "bg-white/15 text-white backdrop-blur"
                      : "bg-gold text-midnight"
                  }`}
                >
                  {car.badge === "pending" ? "Preview" : "Verified"}
                </span>
                <div className="absolute bottom-0 inset-x-0 p-5">
                  <h3 className="font-display text-[22px] leading-[1.05]">{car.title}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[12.5px] text-white/70 flex items-center gap-1">
                      <Icon name="pin" className="w-3.5 h-3.5" /> {car.suburb}
                    </span>
                    <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-gold flex items-center gap-1">
                      View ride <Icon name="arrowRight" className="w-3.5 h-3.5" strokeWidth={2.2} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section className="px-6 md:px-14 py-16 md:py-20">
        <div className="max-w-2xl mb-10">
          <div className="eyebrow !text-gold-dark mb-2">How it works</div>
          <h2 className="font-display text-[38px] md:text-[52px] text-midnight">
            Three steps to <span className="text-gold-dark">your entrance.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((s) => (
            <div key={s.n} className="lift relative bg-white border border-line rounded-2xl p-7 overflow-hidden">
              <div className="font-display text-[72px] text-gold/90 leading-none">{s.n}</div>
              <h3 className="font-display text-[24px] text-midnight mt-3">{s.title}</h3>
              <p className="text-[14.5px] text-[#454e60] leading-relaxed mt-2.5">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <TrustUSPs />

      {/* ---------- EXTRAS ---------- */}
      <section className="bg-midnight text-white px-6 md:px-14 py-16 md:py-20">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-10">
          <div className="max-w-xl">
            <div className="eyebrow mb-2">Beyond formal night</div>
            <h2 className="font-display text-[38px] md:text-[52px]">
              The <span className="text-gold">extras.</span>
            </h2>
            <p className="mt-3 text-[15px] text-white/75 leading-relaxed">
              Formals come first. But the same fleet is ready for plenty more — just ask the owner on
              their listing.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
          {extras.map((e) => (
            <div
              key={e.title}
              className="lift rounded-2xl p-6 bg-[linear-gradient(160deg,#13283f,#0a1d33)] border border-white/10"
            >
              <div className="text-gold ff-icon-glow w-11 h-11">
                <Icon name={e.icon} className="w-11 h-11" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif font-extrabold uppercase tracking-[0.05em] text-[15px] mt-5">
                {e.title}
              </h3>
              <p className="text-[13px] text-white/70 leading-relaxed mt-1.5">{e.body}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
