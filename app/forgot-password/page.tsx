"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";

const inputClass =
  "w-full border border-line rounded-lg px-4 py-3 text-[15px] bg-white focus:outline-none focus:ring-2 focus:ring-gold/40";
const labelClass = "block text-[13px] font-semibold mb-1.5";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
    } catch {
      // Ignore — we never reveal whether this succeeded or the email exists.
    }
    setSubmitting(false);
    setSent(true);
  }

  return (
    <div>
      <Header />
      <div className="px-6 md:px-14 py-16 flex justify-center">
        {sent ? (
          <div className="w-full max-w-sm bg-white border border-line rounded-2xl p-7 text-center">
            <h1 className="font-serif text-[20px] mb-2">Check your email</h1>
            <p className="text-[14px] text-muted leading-relaxed">
              If an account exists for that email, we&rsquo;ve sent a reset link. Click it to
              choose a new password.
            </p>
            <a href="/login" className="inline-block mt-5 text-[13px] font-semibold underline">
              Back to log in
            </a>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm bg-white border border-line rounded-2xl p-7 flex flex-col gap-4"
          >
            <h1 className="font-serif text-[20px]">Reset your password</h1>
            <p className="text-[13px] text-muted -mt-2">
              Enter your account email and we&rsquo;ll send you a link to reset your password.
            </p>
            <div>
              <label className={labelClass} htmlFor="email">Email</label>
              <input
                className={inputClass}
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-navy text-white rounded-xl py-3.5 font-bold text-[14.5px] disabled:opacity-50"
            >
              {submitting ? "Sending…" : "Send reset link"}
            </button>
            <p className="text-[13px] text-muted text-center">
              Remembered it?{" "}
              <a href="/login" className="underline font-semibold">Log in</a>
            </p>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
}
