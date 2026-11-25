"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PasswordInput from "@/components/PasswordInput";
import { supabase } from "@/lib/supabaseClient";

const inputClass =
  "w-full border border-line rounded-lg px-4 py-3 text-[15px] bg-white focus:outline-none focus:ring-2 focus:ring-gold/40";
const labelClass = "block text-[13px] font-semibold mb-1.5";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (signInError || !data.user) {
      setError(signInError?.message || "Couldn't log you in.");
      return;
    }
    // Car owners, schools and students go to their dashboard. Admins who
    // don't also have one of those accounts go to the Admin page (admins who
    // do get an "Admin" button in the header).
    const [{ data: profile }, { data: adminRow }] = await Promise.all([
      supabase.from("profiles").select("role").eq("id", data.user.id).maybeSingle(),
      supabase.from("admin_users").select("user_id").eq("user_id", data.user.id).maybeSingle(),
    ]);
    if (profile?.role) router.push(`/dashboard/${profile.role}`);
    else if (adminRow) router.push("/admin");
    else router.push("/signup?complete=1");
  }

  return (
    <div>
      <Header />
      <div className="px-6 md:px-14 py-16 flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-white border border-line rounded-2xl p-7 flex flex-col gap-4"
        >
          <h1 className="font-serif text-[20px]">Log in to Fleet Formal</h1>
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
          <div>
            <div className="flex justify-between items-baseline mb-1.5">
              <label className={labelClass.replace("mb-1.5", "mb-0")} htmlFor="password">Password</label>
              <a href="/forgot-password" className="text-[12.5px] font-semibold underline text-muted">
                Forgot password?
              </a>
            </div>
            <PasswordInput
              className={inputClass}
              id="password"
              value={password}
              onChange={setPassword}
            />
          </div>
          {error && <p className="text-[12.5px] text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="bg-navy text-white rounded-xl py-3.5 font-bold text-[14.5px] disabled:opacity-50"
          >
            {submitting ? "Logging in…" : "Log in"}
          </button>
          <p className="text-[13px] text-muted text-center">
            New here?{" "}
            <a href="/get-started" className="underline font-semibold">Create an account</a>
          </p>
        </form>
      </div>
      <Footer />
    </div>
  );
}
