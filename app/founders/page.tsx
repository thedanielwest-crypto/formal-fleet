"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";

const SESSION_KEY = "ff_founders_code";

type Submission = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  suburb: string;
  gender: string;
  car: string;
  description: string | null;
  price_mode: string;
  total_price: number;
  driver_share: number;
  platform_share: number;
  status: "unverified" | "verified" | "rejected";
  blue_card_status: string;
  founder_notes: string | null;
  photo1_url: string | null;
  photo2_url: string | null;
  photo3_url: string | null;
  blue_card_url: string | null;
  licence_url: string | null;
  insurance_url: string | null;
};

const inputClass =
  "w-full border border-line rounded-lg px-4 py-2.5 text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-gold/40";

const statusStyle: Record<string, string> = {
  unverified: "bg-amber-bg text-amber",
  verified: "bg-[#e8f6ee] text-[#1d7a4c]",
  rejected: "bg-red-50 text-red-600",
};

export default function FoundersPage() {
  const [code, setCode] = useState("");
  const [authedCode, setAuthedCode] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Submission[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [actingId, setActingId] = useState<string | null>(null);

  async function loadWith(candidateCode: string) {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.functions.invoke("founders", {
      body: { code: candidateCode, action: "list" },
    });
    setLoading(false);
    if (error || data?.error) {
      setError(data?.error || "Incorrect code.");
      return false;
    }
    setSubmissions(data.submissions);
    setAuthedCode(candidateCode);
    sessionStorage.setItem(SESSION_KEY, candidateCode);
    return true;
  }

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) loadWith(saved);
  }, []);

  async function handleGateSubmit(e: React.FormEvent) {
    e.preventDefault();
    await loadWith(code);
  }

  async function review(id: string, decision: "verify" | "reject") {
    if (!authedCode) return;
    setActingId(id);
    const { data, error } = await supabase.functions.invoke("founders", {
      body: { code: authedCode, action: "review", id, decision, notes: notes[id] || null },
    });
    setActingId(null);
    if (error || data?.error) {
      alert(data?.error || "Something went wrong.");
      return;
    }
    await loadWith(authedCode);
  }

  if (!authedCode) {
    return (
      <div>
        <Header />
        <div className="px-14 py-20 flex justify-center">
          <form
            onSubmit={handleGateSubmit}
            className="w-full max-w-sm bg-white border border-line rounded-2xl p-7 flex flex-col gap-4"
          >
            <h1 className="font-serif text-[20px]">Founders Access</h1>
            <p className="text-[13px] text-muted -mt-2">Enter the access code to review submitted cars.</p>
            <input
              className={inputClass}
              type="password"
              placeholder="Access code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoFocus
            />
            {error && <p className="text-[12.5px] text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="bg-navy text-white rounded-xl py-3 font-bold text-[14px] disabled:opacity-50"
            >
              {loading ? "Checking…" : "Enter"}
            </button>
          </form>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="px-14 py-10">
        <div className="flex justify-between items-baseline mb-6">
          <h1 className="font-serif text-[24px]">Founders — Car Submissions</h1>
          <button
            onClick={() => {
              sessionStorage.removeItem(SESSION_KEY);
              setAuthedCode(null);
              setSubmissions(null);
              setCode("");
            }}
            className="text-[13px] text-muted underline"
          >
            Log out
          </button>
        </div>

        {loading && !submissions && <p className="text-muted">Loading…</p>}
        {submissions && submissions.length === 0 && (
          <p className="text-muted">No submissions yet.</p>
        )}

        <div className="flex flex-col gap-5">
          {submissions?.map((s) => (
            <div key={s.id} className="bg-white border border-line rounded-2xl p-6">
              <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
                <div>
                  <h2 className="font-serif text-[19px]">{s.car}</h2>
                  <p className="text-[13px] text-muted mt-0.5">
                    {s.name} · {s.gender} · {s.suburb} · submitted{" "}
                    {new Date(s.created_at).toLocaleDateString("en-AU")}
                  </p>
                </div>
                <span
                  className={`px-3 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wide ${statusStyle[s.status]}`}
                >
                  {s.status}
                </span>
              </div>

              <div className="flex gap-2.5 mb-4">
                {[s.photo1_url, s.photo2_url, s.photo3_url].filter(Boolean).map((url, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={url!}
                    alt={`${s.car} photo ${i + 1}`}
                    className="w-28 h-28 object-cover rounded-lg border border-line"
                  />
                ))}
              </div>

              {s.description && (
                <p className="text-[13.5px] text-[#454e60] leading-relaxed mb-4">{s.description}</p>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4 text-[13px]">
                <div className="bg-cream border border-line rounded-lg px-4 py-3">
                  <div className="font-bold mb-1">Contact</div>
                  <div>{s.email}</div>
                  <div>{s.phone}</div>
                </div>
                <div className="bg-cream border border-line rounded-lg px-4 py-3">
                  <div className="font-bold mb-1">Pricing</div>
                  <div>Total: ${Number(s.total_price).toFixed(2)}</div>
                  <div>
                    Driver ${Number(s.driver_share).toFixed(2)} / Platform $
                    {Number(s.platform_share).toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mb-4 flex-wrap text-[13px] font-semibold">
                <a
                  href={s.licence_url ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-navy"
                >
                  Driver&rsquo;s licence
                </a>
                <a
                  href={s.insurance_url ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-navy"
                >
                  Insurance
                </a>
                {s.blue_card_url ? (
                  <a
                    href={s.blue_card_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-navy"
                  >
                    Blue Card
                  </a>
                ) : (
                  <span className="text-amber">{s.blue_card_status}</span>
                )}
              </div>

              {s.status !== "rejected" && (
                <div className="flex gap-3 items-center flex-wrap">
                  <input
                    className={`${inputClass} max-w-xs`}
                    placeholder="Notes (optional)"
                    defaultValue={s.founder_notes ?? ""}
                    onChange={(e) => setNotes((prev) => ({ ...prev, [s.id]: e.target.value }))}
                  />
                  {s.status !== "verified" && (
                    <button
                      onClick={() => review(s.id, "verify")}
                      disabled={actingId === s.id}
                      className="bg-navy text-white rounded-lg px-4 py-2.5 font-bold text-[13px] disabled:opacity-50"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => review(s.id, "reject")}
                    disabled={actingId === s.id}
                    className="bg-white text-red-600 border border-red-200 rounded-lg px-4 py-2.5 font-bold text-[13px] disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
