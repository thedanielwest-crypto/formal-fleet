"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";

const inputClass =
  "w-full border border-line rounded-lg px-4 py-3 text-[15px] bg-white focus:outline-none focus:ring-2 focus:ring-gold/40";
const labelClass = "block text-[13px] font-semibold mb-1.5";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      if (session) setHasSession(true);
      setChecking(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setHasSession(true);
        setChecking(false);
      }
    });

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setDone(true);
    await supabase.auth.signOut();
    setTimeout(() => router.push("/login"), 2000);
  }

  return (
    <div>
      <Header />
      <div className="px-6 md:px-14 py-16 flex justify-center">
        {checking ? (
          <div className="w-full max-w-sm bg-white border border-line rounded-2xl p-7 text-center text-muted">
            Checking your reset link…
          </div>
        ) : done ? (
          <div className="w-full max-w-sm bg-white border border-line rounded-2xl p-7 text-center">
            <h1 className="font-serif text-[20px] mb-2">Password updated</h1>
            <p className="text-[14px] text-muted leading-relaxed">
              Redirecting you to log in with your new password…
            </p>
          </div>
        ) : !hasSession ? (
          <div className="w-full max-w-sm bg-white border border-line rounded-2xl p-7 text-center">
            <h1 className="font-serif text-[20px] mb-2">Link invalid or expired</h1>
            <p className="text-[14px] text-muted leading-relaxed mb-4">
              This reset link is invalid or has expired — request a new one.
            </p>
            <a
              href="/forgot-password"
              className="inline-block bg-navy text-white rounded-xl px-5 py-2.5 font-bold text-[13.5px]"
            >
              Request a new link
            </a>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm bg-white border border-line rounded-2xl p-7 flex flex-col gap-4"
          >
            <h1 className="font-serif text-[20px]">Choose a new password</h1>
            <div>
              <label className={labelClass} htmlFor="password">New password</label>
              <input
                className={inputClass}
                id="password"
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="confirmPassword">Confirm new password</label>
              <input
                className={inputClass}
                id="confirmPassword"
                type="password"
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-[12.5px] text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="bg-navy text-white rounded-xl py-3.5 font-bold text-[14.5px] disabled:opacity-50"
            >
              {submitting ? "Updating…" : "Update password"}
            </button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
}
