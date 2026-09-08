import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Get Started — Formal Fleet",
  description: "Browse cars, sign up your school, or list your car with Formal Fleet.",
};

const paths = [
  {
    emoji: "🚘",
    title: "Browse cars",
    blurb: "See every verified (and unverified) car currently listed — no account needed to look.",
    cta: "Browse cars",
    href: "/browse",
  },
  {
    emoji: "🏫",
    title: "I'm a school or P&C",
    blurb: "Create an account to post your formal, invite verified drivers, and manage RSVPs.",
    cta: "Sign up as a school",
    href: "/signup?role=school",
  },
  {
    emoji: "🚗",
    title: "I want to list my car",
    blurb: "Create a driver account to list your car, browse events, and say yes to the ones you like.",
    cta: "Sign up as a car owner",
    href: "/signup?role=driver",
  },
];

export default function GetStartedPage() {
  return (
    <div>
      <Header />
      <section className="bg-gradient-to-b from-navy-deep to-navy text-white px-6 md:px-14 pt-12 pb-10 text-center">
        <h1 className="font-serif font-bold text-3xl md:text-4xl max-w-2xl mx-auto leading-tight">
          What brings you to <span className="text-gold-light">Formal Fleet</span>?
        </h1>
        <p className="mt-3 text-slate-300 max-w-xl mx-auto">
          Pick the path that fits — you can always come back and set up another account later.
        </p>
      </section>

      <div className="px-6 md:px-14 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {paths.map((p) => (
            <Link
              key={p.title}
              href={p.href}
              className="bg-white border border-line rounded-2xl p-7 flex flex-col hover:border-gold hover:shadow-md transition-all"
            >
              <div className="text-4xl mb-4">{p.emoji}</div>
              <h2 className="font-serif text-[20px] mb-2">{p.title}</h2>
              <p className="text-[14px] text-muted leading-relaxed flex-1">{p.blurb}</p>
              <span className="mt-5 inline-block bg-navy text-white rounded-xl py-3 font-bold text-[14px] text-center">
                {p.cta}
              </span>
            </Link>
          ))}
        </div>
        <p className="text-center text-[13px] text-muted mt-8">
          Are you a student wanting a ride?{" "}
          <Link href="/signup?role=student" className="underline font-semibold">
            Create a student account
          </Link>{" "}
          to connect to your event and invite the car you want.
        </p>
      </div>

      <Footer />
    </div>
  );
}
