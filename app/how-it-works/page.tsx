import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "How It Works — Formal Fleet",
  description: "How Formal Fleet connects verified car owners with students and parents for a safe, unforgettable formal ride.",
};

const ownerSteps = [
  {
    n: "1",
    title: "Get verified",
    body: "Submit your licence, insurance, and a Working With Children Check (WWCC). We confirm everything before your listing goes live.",
  },
  {
    n: "2",
    title: "List your car",
    body: "Add photos, a description, your suburb, and set your price — or offer the ride for free. Your listing shows your verification badge.",
  },
  {
    n: "3",
    title: "Accept bookings",
    body: "Students request to book. A parent or guardian confirms the trip before it's finalised, and you're sent the pickup details.",
  },
];

const riderSteps = [
  {
    n: "1",
    title: "Browse verified cars",
    body: "Search by suburb and see every owner's verification badge — Gold Verified means ID, licence, insurance, and WWCC are all confirmed.",
  },
  {
    n: "2",
    title: "Request to book",
    body: "Pick your ride, choose your formal date and pickup spot, and send a booking request straight to the owner.",
  },
  {
    n: "3",
    title: "Parent confirms, you ride",
    body: "A parent or guardian confirms the booking before it locks in. Full trip details are sent by SMS — then it's arrival-in-style o'clock.",
  },
];

function StepList({ steps }: { steps: typeof ownerSteps }) {
  return (
    <div className="flex flex-col gap-5">
      {steps.map((s) => (
        <div key={s.n} className="flex gap-4 bg-white border border-line rounded-2xl p-5">
          <div className="w-9 h-9 rounded-full bg-navy text-gold-light font-serif font-bold flex items-center justify-center shrink-0">
            {s.n}
          </div>
          <div>
            <h3 className="font-semibold text-[15.5px] mb-1">{s.title}</h3>
            <p className="text-[13.5px] text-[#454e60] leading-relaxed">{s.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HowItWorks() {
  return (
    <div>
      <Header />

      <section className="bg-gradient-to-b from-navy-deep to-navy text-white px-14 pt-10 pb-9">
        <h1 className="font-serif font-bold text-4xl max-w-2xl leading-tight">
          How <span className="text-gold-light">Formal Fleet</span> works
        </h1>
        <p className="mt-3 text-slate-300 max-w-xl">
          A verified marketplace with two sides — car owners who want to make someone's formal
          night unforgettable, and students &amp; parents looking for a safe, memorable ride.
        </p>
      </section>

      <div className="grid grid-cols-2 gap-8 px-14 py-10">
        <div>
          <h2 className="font-serif text-[20px] mb-4">For car owners</h2>
          <StepList steps={ownerSteps} />
          <Link
            href="/list-your-car"
            className="inline-block mt-5 px-5 py-2.5 rounded-lg font-semibold text-sm text-navy-deep bg-gradient-to-br from-gold-light to-gold"
          >
            List Your Car
          </Link>
        </div>
        <div>
          <h2 className="font-serif text-[20px] mb-4">For students &amp; parents</h2>
          <StepList steps={riderSteps} />
          <Link
            href="/"
            className="inline-block mt-5 px-5 py-2.5 rounded-lg font-semibold text-sm border border-line bg-white"
          >
            Browse Cars
          </Link>
        </div>
      </div>

      <div className="px-14 pb-14">
        <div className="bg-amber-bg border border-amber/30 rounded-2xl px-6 py-5 max-w-3xl">
          <p className="text-[13.5px] text-[#6b4a12] leading-relaxed">
            Every booking on Formal Fleet requires parent or guardian confirmation before it's
            finalised — no exceptions. Read more on our{" "}
            <Link href="/verification-safety" className="underline font-semibold">
              Verification &amp; Safety
            </Link>{" "}
            page.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
