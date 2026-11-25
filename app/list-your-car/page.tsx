import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ListYourCarForm from "@/components/ListYourCarForm";

export const metadata: Metadata = {
  title: "List Your Car — Fleet Formal",
  description: "Tell us about your classic or show car and we'll get you verified and listed on Fleet Formal.",
};

export default function ListYourCar() {
  return (
    <div>
      <Header />

      <section className="page-hero text-white px-6 md:px-14 pt-14 pb-12 md:pt-20 md:pb-16">
        <h1 className="font-serif font-bold text-3xl md:text-4xl max-w-2xl leading-tight">
          List your car on <span className="text-gold-light">Fleet Formal</span>
        </h1>
        <p className="mt-3 text-slate-300 max-w-xl">
          Tell us about your car and yourself, upload your photos and documents, and we&rsquo;ll
          take it from there. QLD-first, launching in Brisbane North.
        </p>
      </section>

      <div className="px-6 md:px-14 py-10 flex flex-col lg:flex-row gap-10 items-start">
        <ListYourCarForm />

        <aside className="w-full lg:w-[300px] shrink-0 flex flex-col gap-5">
          <div className="bg-cream border border-line rounded-2xl p-6">
            <h3 className="font-serif font-extrabold text-[17px] mb-3 text-midnight">Why owners list on Fleet Formal</h3>
            <ul className="text-[13.5px] text-[#454e60] leading-relaxed flex flex-col gap-2.5 list-disc pl-4">
              <li>Make someone's formal night genuinely unforgettable</li>
              <li>Earn by the hour — $350/hr minimum, and you see your exact take-home before you list</li>
              <li>Every rider's booking is parent-confirmed</li>
              <li>Your Gold Verified badge builds instant trust</li>
            </ul>
          </div>

          <div className="bg-midnight text-white rounded-2xl p-6 border border-gold/30">
            <h3 className="font-serif text-[17px] mb-2">Represent a school?</h3>
            <p className="text-[13px] text-slate-300 leading-relaxed mb-4">
              If you're a school or P&amp;C committee wanting to partner with Fleet Formal, we'd
              love to hear from you.
            </p>
            <Link
              href="/for-schools"
              className="btn-gold !py-2.5 !px-4 !text-[12.5px]"
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
