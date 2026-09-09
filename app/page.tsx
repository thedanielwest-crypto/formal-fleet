import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StatsBanner from "@/components/StatsBanner";
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

const usps = [
  "Find amazing vehicles",
  "Connect with local owners",
  "Safe, simple and trusted",
  "From classics to modern icons",
  "Make your formal unforgettable",
];

const features = [
  { icon: "🎓", title: "For Students", blurb: "Find amazing rides for your formal." },
  { icon: "🚗", title: "For Vehicle Owners", blurb: "Share your ride. Make their night." },
  { icon: "🛡️", title: "Safe & Trusted", blurb: "Clear information. Real people. Real rides." },
  { icon: "🏫", title: "For Schools", blurb: "Supporting unforgettable formals." },
];

const galleryPhotos = listings.map((l) => ({ src: l.heroImage, alt: l.title }));

export default function Home() {
  return (
    <div>
      <Header />

      <section className="bg-gradient-to-b from-navy-deep via-navy-deep to-navy text-white px-6 md:px-14 pt-20 pb-16 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-gold-light mb-5">
            Youthful · Luxury · Automotive
          </p>
          <h1 className="font-serif font-black uppercase text-4xl md:text-6xl leading-[1.05] tracking-tight">
            Your Formal.
            <br />
            <span className="text-gold-light">Your Ride.</span>
          </h1>
          <p className="mt-6 text-slate-200 text-[17px] max-w-xl mx-auto">
            Arrive at formal in something unforgettable.
          </p>
          <p className="mt-2 text-slate-400 text-[15px] max-w-lg mx-auto">
            Find amazing vehicles. Arrive in unforgettable style.
          </p>
          <div className="flex gap-4 mt-9 justify-center flex-wrap">
            <Link
              href="/browse"
              className="px-8 py-3.5 rounded-full font-bold text-[14px] uppercase tracking-wide text-navy-deep bg-gradient-to-br from-gold-light to-gold"
            >
              Find a Ride
            </Link>
            <Link
              href="/list-your-car"
              className="px-8 py-3.5 rounded-full font-bold text-[14px] uppercase tracking-wide border-2 border-gold text-gold-light hover:bg-white/5"
            >
              List Your Ride
            </Link>
          </div>

          <ul className="mt-12 flex flex-col gap-3 max-w-sm mx-auto text-left">
            {usps.map((u) => (
              <li key={u} className="flex items-start gap-3 text-[14.5px] text-slate-200">
                <span className="mt-0.5 text-gold-light font-bold">✓</span>
                <span>{u}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <StatsBanner />

      {/* Fun photo strip */}
      <section className="px-6 md:px-14 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryPhotos.map((p) => (
            <div
              key={p.src}
              className="relative h-[160px] md:h-[200px] rounded-2xl overflow-hidden border border-line"
            >
              <Image src={p.src} alt={p.alt} fill className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* Feature callouts */}
      <section className="px-6 md:px-14 py-12 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {features.map((f) => (
            <div
              key={f.title}
              className="text-center rounded-2xl border border-line p-6 hover:border-gold transition-colors"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-navy flex items-center justify-center text-2xl mb-4">
                {f.icon}
              </div>
              <h3 className="font-serif text-[16px] mb-1.5">{f.title}</h3>
              <p className="text-[13.5px] text-muted leading-relaxed">{f.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 md:px-14 py-14 bg-cream">
        <p className="text-[12px] font-bold uppercase tracking-[0.25em] text-gold text-center mb-2">
          The Journey
        </p>
        <h2 className="font-serif font-black uppercase text-[28px] text-center mb-2 tracking-tight">
          How it works
        </h2>
        <p className="text-muted text-center mb-10 max-w-lg mx-auto">
          From browsing to arriving, here&rsquo;s the whole journey in four steps.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="text-center relative bg-white rounded-2xl border border-line p-6"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-navy border border-gold-border flex items-center justify-center text-3xl mb-4">
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
              className="flex items-center gap-2 bg-white/[0.07] border border-gold-border px-4 py-2.5 rounded-full text-[13.5px] font-medium"
            >
              <span className="text-gold-light">✓</span> {t}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 md:px-14 py-16 text-center bg-gradient-to-b from-white to-cream">
        <h2 className="font-serif font-black uppercase text-[28px] md:text-[32px] mb-3 tracking-tight">
          Ready to join <span className="text-gold">Fleet Formal</span>?
        </h2>
        <p className="text-muted mb-7 max-w-lg mx-auto">
          Whether you&rsquo;re a school planning a formal, an owner with a car worth showing off,
          or a student hunting for the perfect ride — it starts with an account.
        </p>
        <Link
          href="/get-started"
          className="inline-block px-8 py-4 rounded-full font-bold text-[14px] uppercase tracking-wide text-navy-deep bg-gradient-to-br from-gold-light to-gold"
        >
          Get Started
        </Link>
      </section>

      <Footer />
    </div>
  );
}
