import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "List Your Car — Formal Fleet",
  description: "Tell us about your classic or show car and we'll get you verified and listed on Formal Fleet.",
};

const inputClass =
  "w-full border border-line rounded-lg px-4 py-2.5 text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-gold/40";
const labelClass = "block text-[13px] font-semibold mb-1.5";

export default function ListYourCar() {
  return (
    <div>
      <Header />

      <section className="bg-gradient-to-b from-navy-deep to-navy text-white px-14 pt-10 pb-9">
        <h1 className="font-serif font-bold text-4xl max-w-2xl leading-tight">
          List your car on <span className="text-gold-light">Formal Fleet</span>
        </h1>
        <p className="mt-3 text-slate-300 max-w-xl">
          Tell us about your car and yourself. We'll follow up to complete ID, licence,
          insurance, and WWCC verification before your listing goes live.
        </p>
      </section>

      <div className="px-14 py-10 flex gap-10">
        <form
          name="list-your-car"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          action="/thank-you"
          className="flex-1 max-w-xl bg-white border border-line rounded-2xl p-7 flex flex-col gap-4"
        >
          <input type="hidden" name="form-name" value="list-your-car" />
          <p className="hidden">
            <label>
              Don&rsquo;t fill this out: <input name="bot-field" />
            </label>
          </p>

          <div>
            <label className={labelClass} htmlFor="name">Your name</label>
            <input className={inputClass} id="name" name="name" type="text" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="email">Email</label>
              <input className={inputClass} id="email" name="email" type="email" required />
            </div>
            <div>
              <label className={labelClass} htmlFor="phone">Phone</label>
              <input className={inputClass} id="phone" name="phone" type="tel" />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="suburb">Suburb</label>
            <input className={inputClass} id="suburb" name="suburb" type="text" required />
          </div>

          <div>
            <label className={labelClass} htmlFor="car">Car make, model &amp; year</label>
            <input className={inputClass} id="car" name="car" type="text" placeholder="e.g. 1980s Mazda RX-7" required />
          </div>

          <div>
            <label className={labelClass} htmlFor="price">Price per trip (or write "Free")</label>
            <input className={inputClass} id="price" name="price" type="text" placeholder="e.g. $100 or Free" required />
          </div>

          <div>
            <label className={labelClass} htmlFor="message">Tell us about your car</label>
            <textarea className={inputClass} id="message" name="message" rows={4} placeholder="What makes it special? Any story behind it?" />
          </div>

          <button
            type="submit"
            className="mt-2 bg-navy text-white rounded-xl py-3.5 font-bold text-[14.5px]"
          >
            Submit Listing Request
          </button>
          <p className="text-[12px] text-muted leading-relaxed">
            We'll email you to complete verification (ID, licence, insurance, and WWCC) before
            your car appears on Formal Fleet.
          </p>
        </form>

        <aside className="w-[300px] shrink-0">
          <div className="bg-cream border border-line rounded-2xl p-6">
            <h3 className="font-serif text-[17px] mb-3">Why owners list on Formal Fleet</h3>
            <ul className="text-[13.5px] text-[#454e60] leading-relaxed flex flex-col gap-2.5 list-disc pl-4">
              <li>Make someone's formal night genuinely unforgettable</li>
              <li>Set your own price — or drive for free</li>
              <li>Every rider's booking is parent-confirmed</li>
              <li>Your Gold Verified badge builds instant trust</li>
            </ul>
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  );
}
