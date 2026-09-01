import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ListYourCarForm from "@/components/ListYourCarForm";

export const metadata: Metadata = {
  title: "List Your Car — Formal Fleet",
  description: "Tell us about your classic or show car and we'll get you verified and listed on Formal Fleet.",
};

export default function ListYourCar() {
  return (
    <div>
      <Header />

      <section className="bg-gradient-to-b from-navy-deep to-navy text-white px-14 pt-10 pb-9">
        <h1 className="font-serif font-bold text-4xl max-w-2xl leading-tight">
          List your car on <span className="text-gold-light">Formal Fleet</span>
        </h1>
        <p className="mt-3 text-slate-300 max-w-xl">
          Tell us about your car and yourself, upload your photos and documents, and we&rsquo;ll
          take it from there. QLD-first, launching in Brisbane North.
        </p>
      </section>

      <div className="px-14 py-10 flex gap-10 items-start">
        <ListYourCarForm />

        <aside className="w-[300px] shrink-0 flex flex-col gap-5">
          <div className="bg-cream border border-line rounded-2xl p-6">
            <h3 className="font-serif text-[17px] mb-3">Why owners list on Formal Fleet</h3>
            <ul className="text-[13.5px] text-[#454e60] leading-relaxed flex flex-col gap-2.5 list-disc pl-4">
              <li>Make someone's formal night genuinely unforgettable</li>
              <li>A fair, transparent 50/50 split on every trip</li>
              <li>Every rider's booking is parent-confirmed</li>
              <li>Your Gold Verified badge builds instant trust</li>
            </ul>
          </div>

          <div className="bg-navy text-white rounded-2xl p-6">
            <h3 className="font-serif text-[17px] mb-2">Represent a school?</h3>
            <p className="text-[13px] text-slate-300 leading-relaxed mb-4">
              If you're a school or P&amp;C committee wanting to partner with Formal Fleet, we'd
              love to hear from you.
            </p>
            <Link
              href="/for-schools"
              className="inline-block px-4 py-2.5 rounded-lg font-semibold text-[13px] text-navy-deep bg-gradient-to-br from-gold-light to-gold"
            >
              Get in touch
            </Link>
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  );
}
