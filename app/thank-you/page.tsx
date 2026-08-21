import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Thanks — Formal Fleet",
};

export default function ThankYou() {
  return (
    <div>
      <Header />
      <div className="px-14 py-24 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-light to-gold flex items-center justify-center text-2xl mb-5">
          ✓
        </div>
        <h1 className="font-serif text-3xl mb-3">You're all set</h1>
        <p className="text-muted max-w-md leading-relaxed">
          Thanks for reaching out — we've received your details and will be in touch soon.
        </p>
        <Link
          href="/"
          className="inline-block mt-7 px-6 py-3 rounded-lg font-semibold text-sm text-navy-deep bg-gradient-to-br from-gold-light to-gold"
        >
          Back to Browse Cars
        </Link>
      </div>
      <Footer />
    </div>
  );
}
