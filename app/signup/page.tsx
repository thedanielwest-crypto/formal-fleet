"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import type { Role } from "@/lib/authContext";

const inputClass =
  "w-full border border-line rounded-lg px-4 py-3 text-[15px] bg-white focus:outline-none focus:ring-2 focus:ring-gold/40";
const labelClass = "block text-[13px] font-semibold mb-1.5";

const ROLE_COPY: Record<Role, { title: string; blurb: string }> = {
  driver: {
    title: "Create your car owner account",
    blurb: "List your car, browse formal events near you, and connect with schools.",
  },
  school: {
    title: "Create your school / P&C account",
    blurb: "Post your formal or event and invite verified drivers within reach.",
  },
  student: {
    title: "Create your student account",
    blurb: "Browse cars, connect to your event, and invite the ride you want.",
  },
};

function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const initialRole = (params.get("role") as Role) || null;

  const [role, setRole] = useState<Role | null>(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [suburb, setSuburb] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!role) return;
    setSubmitting(true);
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError || !data.user) {
      setError(signUpError?.message || "Couldn't create that account.");
      setSubmitting(false);
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      role,
      name,
      email,
      phone: phone || null,
      suburb: suburb || null,
      school_name: role === "school" ? schoolName || name : null,
    });

    setSubmitting(false);
    if (profileError) {
      setError(profileError.message);
      return;
    }

    if (data.session) {
      router.push(`/dashboard/${role}`);
    } else {
      setCheckEmail(true);
    }
  }

  if (checkEmail) {
    return (
      <div className="max-w-md mx-auto bg-white border border-line rounded-2xl p-7 text-center">
        <h1 className="font-serif text-[20px] mb-2">Almost there</h1>
        <p className="text-[14px] text-muted leading-relaxed">
          We&rsquo;ve sent a confirmation link to <strong>{email}</strong>. Click it, then head to{" "}
          <a href="/login" className="underline font-semibold">Log In</a> to get started.
        </p>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-[26px] mb-2 text-center">I am a...</h1>
        <p className="text-muted text-center mb-8">Pick the account that fits you best.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {(Object.keys(ROLE_COPY) as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className="text-left bg-white border border-line rounded-2xl p-6 hover:border-gold hover:shadow-md transition-all"
            >
              <div className="text-3xl mb-3">{r === "driver" ? "🚗" : r === "school" ? "🏫" : "🎓"}</div>
              <h3 className="font-serif text-[18px] mb-1.5">{ROLE_COPY[r].title}</h3>
              <p className="text-[13.5px] text-muted leading-relaxed">{ROLE_COPY[r].blurb}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <button onClick={() => setRole(null)} className="text-[13px] text-muted underline mb-4">
        &larr; Choose a different account type
      </button>
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-line rounded-2xl p-7 flex flex-col gap-4"
      >
        <h1 className="font-serif text-[20px]">{ROLE_COPY[role].title}</h1>
        <p className="text-[13px] text-muted -mt-2">{ROLE_COPY[role].blurb}</p>

        <div>
          <label className={labelClass} htmlFor="name">
            {role === "school" ? "Your name (event contact)" : "Your name"}
          </label>
          <input className={inputClass} id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        {role === "school" && (
          <div>
            <label className={labelClass} htmlFor="schoolName">School / P&amp;C name</label>
            <input
              className={inputClass}
              id="schoolName"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              required
            />
          </div>
        )}

        <div>
          <label className={labelClass} htmlFor="email">Email</label>
          <input
            className={inputClass}
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="password">Password</label>
          <input
            className={inputClass}
            id="password"
            type="password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="phone">Phone</label>
          <input className={inputClass} id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <div>
          <label className={labelClass} htmlFor="suburb">Suburb</label>
          <input className={inputClass} id="suburb" value={suburb} onChange={(e) => setSuburb(e.target.value)} />
        </div>

        {error && <p className="text-[12.5px] text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="bg-navy text-white rounded-xl py-3.5 font-bold text-[14.5px] disabled:opacity-50"
        >
          {submitting ? "Creating account…" : "Create account"}
        </button>
        <p className="text-[13px] text-muted text-center">
          Already have an account?{" "}
          <a href="/login" className="underline font-semibold">Log in</a>
        </p>
      </form>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div>
      <Header />
      <div className="px-6 md:px-14 py-12">
        <Suspense fallback={null}>
          <SignupForm />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
