import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { IconBadge } from "@/components/BrandIcon";
import type { IconName } from "@/components/BrandIcon";

export const metadata: Metadata = {
  title: "For Schools — Formal Fleet",
  description: "Partner with Formal Fleet to give your students safe, verified, memorable rides to formal night.",
};

const inputClass =
  "w-full border border-line rounded-lg px-4 py-2.5 text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-gold/40";
const labelClass = "block text-[13px] font-semibold mb-1.5";

const benefits: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "check",
    title: "Every driver is checked",
    body: "ID, driver's licence, insurance, and a Working With Children Check — verified before any car is listed.",
  },
  {
    icon: "clipboard",
    title: "A safer alternative to word-of-mouth",
    body: "Instead of students sourcing rides through unverified social posts, give families a checked, accountable option.",
  },
  {
    icon: "handshake",
    title: "Built for parent sign-off",
    body: "No booking is finalised without a parent or guardian confirming it — schools stay out of the liability loop.",
  },
  {
    icon: "celebration",
    title: "A genuine formal-night highlight",
    body: "Classic cars, show cars, and the odd novelty ride make for arrivals students remember for years.",
  },
];

export default function ForSchools() {
  return (
    <div>
      <Header />

      <section className="bg-gradient-to-b from-navy-deep to-navy text-white px-14 pt-10 pb-9">
        <h1 className="font-serif font-bold text-4xl max-w-2xl leading-tight">
          A safer ride option for <span className="text-gold-light">your formal</span>
        </h1>
        <p className="mt-3 text-slate-300 max-w-xl">
          Formal Fleet partners with schools and P&amp;C committees to point students and parents
          toward verified, accountable rides — instead of an unvetted post in a group chat.
        </p>
      </section>

      <div className="px-14 py-10">
        <div className="grid grid-cols-2 gap-5 max-w-4xl">
          {benefits.map((b) => (
            <div key={b.title} className="flex gap-4 bg-white border border-line rounded-2xl p-5">
              <div className="shrink-0">
                <IconBadge name={b.icon} tone="navy" size="w-11 h-11" iconSize="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[15.5px] mb-1">{b.title}</h3>
                <p className="text-[13.5px] text-[#454e60] leading-relaxed">{b.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-14 pb-14 flex gap-10">
        <form
          name="for-schools"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          action="/thank-you"
          className="flex-1 max-w-xl bg-white border border-line rounded-2xl p-7 flex flex-col gap-4"
        >
          <h2 className="font-serif text-[19px] mb-1">Get in touch</h2>
          <input type="hidden" name="form-name" value="for-schools" />
          <p className="hidden">
            <label>
              Don&rsquo;t fill this out: <input name="bot-field" />
            </label>
          </p>

          <div>
            <label className={labelClass} htmlFor="school">School / P&amp;C name</label>
            <input className={inputClass} id="school" name="school" type="text" required />
          </div>

          <div>
            <label className={labelClass} htmlFor="contact">Your name</label>
            <input className={inputClass} id="contact" name="contact" type="text" required />
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
            <label className={labelClass} htmlFor="message">What would you like to know?</label>
            <textarea className={inputClass} id="message" name="message" rows={4} />
          </div>

          <button
            type="submit"
            className="mt-2 bg-navy text-white rounded-xl py-3.5 font-bold text-[14.5px]"
          >
            Send Enquiry
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
