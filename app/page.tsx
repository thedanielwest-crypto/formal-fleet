import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UpcomingEvents from "@/components/UpcomingEvents";
import { listings } from "@/lib/listings";

const steps = [
  {
    icon: "🔍",
    title: "Browse the fleet",
    blurb: "Scroll real cars from real owners near you — no account needed to look around.",
  },
  {
    icon: "✅",
    title: "Check verification",
    blurb: "Licence, insurance, and Working with Children Check status shown on every listing.",
  },
  {
    icon: "🤝",
    title: "Connect & confirm",
    blurb: "Schools invite cars, drivers say yes, students lock in the ride they want.",
  },
  {
    icon: "🎉",
    title: "Arrive in style",
    blurb: "Turn up to formal in something nobody will forget.",
  },
];

const galleryPhotos = listings.map((l) => ({ src: l.heroImage, alt: l.title }));

export default function Home() {
  return (
    <div>
      <Header />

      <section className="bg-gradient-to-b from-navy-deep to-navy text-white px-6 md:px-14 pt-16 pb-16 text-center">
        <h1 className="font-serif font-bold text-4xl md:text-5xl max-w-3xl mx-auto leading-tight">
          Arrive at formal in <span className="text-gold-light">something unforgettable.</span>
        </h1>
        <p className="mt-4 text-slate-300 max-w-xl mx-auto text-[16px]">
          Formal Fleet connects verified classic and show car owners with students and schools
          across South-East Queensland — real cars, real verification, one unforgettable ride.
        </p>
        <div className="flex gap-4 mt-8 justify-center flex-wrap">
          <Link
            href="/get-started"
            className="px-7 py-3.5 rounded-xl font-bold text-[15px] text-navy-deep bg-gradient-to-br from-gold-light to-gold"
          >
            Get Started
          </Link>
          <Link
            href="/browse"
            className="px-7 py-3.5 rounded-xl font-bold text-[15px] border border-white/35"
          >
            Browse Cars
          </Link>
        </div>
      </section>

      {/* Fun photo strip */}
      <section className="px-6 md:px-14 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryPhotos.map((p) => (
            <div key={p.src} className="relative h-[160px] md:h-[200px] rounded-2xl overflow-hidden">
              <Image src={p.src} alt={p.alt} fill className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 md:px-14 py-14 bg-white">
        <h2 className="font-serif text-[28px] text-center mb-2">How it works</h2>
        <p className="text-muted text-center mb-10 max-w-lg mx-auto">
          From browsing to arriving, here&rsquo;s the whole journey in four steps.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {steps.map((s, i) => (
            <div key={s.title} className="text-center relative">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-bg flex items-center justify-center text-3xl mb-4">
                {s.icon}
              </div>
              <div className="text-[12px] font-bold text-gold uppercase tracking-wide mb-1">
                Step {i + 1}
              </div>
              <h3 className="font-serif text-[17px] mb-1.5">{s.title}</h3>
              <p className="text-[13.5px] text-muted leading-relaxed">{s.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      <UpcomingEvents />

      {/* Trust strip */}
      <section className="px-6 md:px-14 py-12 bg-navy-deep text-white">
        <div className="flex flex-wrap justify-center gap-5">
          {[
            "ID & Licence Verified",
            "WWCC Confirmed",
            "Insurance Checked",
            "Parent Booking Confirmation",
          ].map((t) => (
            <div
              key={t}
              className="flex items-center gap-2 bg-white/[0.07] border border-white/15 px-4 py-2.5 rounded-full text-[13.5px] font-medium"
            >
              ✓ {t}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 md:px-14 py-16 text-center">
        <h2 className="font-serif text-[26px] mb-3">Ready to join the fleet?</h2>
        <p className="text-muted mb-7 max-w-lg mx-auto">
          Whether you&rsquo;re a school planning a formal, an owner with a car worth showing off,
          or a student hunting for the perfect ride — it starts with an account.
        </p>
        <Link
          href="/get-started"
          className="inline-block px-8 py-4 rounded-xl font-bold text-[15px] text-white bg-navy"
        >
          Get Started
        </Link>
      </section>

      <Footer />
    </div>
  );
}
