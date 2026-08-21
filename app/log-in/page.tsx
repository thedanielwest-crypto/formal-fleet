import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Log In — Formal Fleet",
  description: "Formal Fleet accounts are launching soon. Register for early access.",
};

const inputClass =
  "w-full border border-line rounded-lg px-4 py-2.5 text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-gold/40";
const labelClass = "block text-[13px] font-semibold mb-1.5";

export default function LogIn() {
  return (
    <div>
      <Header />

      <section className="bg-gradient-to-b from-navy-deep to-navy text-white px-14 pt-10 pb-9">
        <h1 className="font-serif font-bold text-4xl max-w-2xl leading-tight">
          Accounts are <span className="text-gold-light">launching soon</span>
        </h1>
        <p className="mt-3 text-slate-300 max-w-xl">
          Log in isn't live just yet — Formal Fleet is in its first phase, with real, verified
          listings you can browse right now. Pop your details in and we'll email you the moment
          accounts, messaging, and in-app booking go live.
        </p>
      </section>

      <div className="px-14 py-10">
        <form
          name="notify-me"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          action="/thank-you"
          className="max-w-xl bg-white border border-line rounded-2xl p-7 flex flex-col gap-4"
        >
          <input type="hidden" name="form-name" value="notify-me" />
          <p className="hidden">
            <label>
              Don&rsquo;t fill this out: <input name="bot-field" />
            </label>
          </p>

          <div>
            <label className={labelClass} htmlFor="name">Your name</label>
            <input className={inputClass} id="name" name="name" type="text" required />
          </div>

          <div>
            <label className={labelClass} htmlFor="email">Email</label>
            <input className={inputClass} id="email" name="email" type="email" required />
          </div>

          <div>
            <label className={labelClass} htmlFor="role">I am a...</label>
            <select className={inputClass} id="role" name="role" defaultValue="">
              <option value="" disabled>
                Select one
              </option>
              <option value="Car owner">Car owner</option>
              <option value="Student">Student</option>
              <option value="Parent / guardian">Parent / guardian</option>
              <option value="School / P&C">School / P&amp;C</option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-2 bg-navy text-white rounded-xl py-3.5 font-bold text-[14.5px]"
          >
            Notify Me at Launch
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
