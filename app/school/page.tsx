"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";

const SESSION_KEY = "ff_school_code";

type SchoolEvent = {
  id: string;
  created_at: string;
  school_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  event_name: string;
  event_date: string | null;
  venue: string | null;
  details: string | null;
  status: "open" | "closed";
};

type Driver = {
  name: string;
  email: string;
  suburb: string;
  car: string;
};

const inputClass =
  "w-full border border-line rounded-lg px-4 py-2.5 text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-gold/40";

const emptyForm = {
  school_name: "",
  contact_name: "",
  email: "",
  phone: "",
  event_name: "",
  event_date: "",
  venue: "",
  details: "",
};

export default function SchoolPage() {
  const [code, setCode] = useState("");
  const [authedCode, setAuthedCode] = useState<string | null>(null);
  const [events, setEvents] = useState<SchoolEvent[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [actingId, setActingId] = useState<string | null>(null);
  const [drivers, setDrivers] = useState<Driver[] | null>(null);
  const [driversLoading, setDriversLoading] = useState(false);

  async function loadWith(candidateCode: string) {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.functions.invoke("school", {
      body: { code: candidateCode, action: "list-events" },
    });
    setLoading(false);
    if (error || data?.error) {
      setError(data?.error || "Incorrect code.");
      return false;
    }
    setEvents(data.events);
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

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!authedCode) return;
    if (!form.school_name || !form.contact_name || !form.email || !form.event_name) {
      setCreateError("Please fill in school name, contact name, email and event name.");
      return;
    }
    setCreating(true);
    setCreateError(null);
    const { data, error } = await supabase.functions.invoke("school", {
      body: { code: authedCode, action: "create-event", event: form },
    });
    setCreating(false);
    if (error || data?.error) {
      setCreateError(data?.error || "Something went wrong creating the event.");
      return;
    }
    setForm(emptyForm);
    await loadWith(authedCode);
  }

  async function closeEvent(id: string) {
    if (!authedCode) return;
    setActingId(id);
    const { data, error } = await supabase.functions.invoke("school", {
      body: { code: authedCode, action: "close-event", id },
    });
    setActingId(null);
    if (error || data?.error) {
      alert(data?.error || "Something went wrong.");
      return;
    }
    await loadWith(authedCode);
  }

  async function notifyDrivers(ev: SchoolEvent) {
    if (!authedCode) return;
    setDriversLoading(true);
    const { data, error } = await supabase.functions.invoke("school", {
      body: { code: authedCode, action: "notify-drivers" },
    });
    setDriversLoading(false);
    if (error || data?.error) {
      alert(data?.error || "Couldn't load verified drivers.");
      return;
    }
    const list: Driver[] = data.drivers || [];
    setDrivers(list);
    if (list.length === 0) {
      alert("No verified drivers yet — check back once the Founders team has approved some cars.");
      return;
    }
    const bcc = list.map((d) => d.email).join(",");
    const subject = encodeURIComponent(
      `Formal Fleet — ${ev.event_name} at ${ev.school_name}`
    );
    const dateLine = ev.event_date
      ? new Date(ev.event_date).toLocaleDateString("en-AU", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "TBC";
    const body = encodeURIComponent(
      `Hi drivers,\n\n${ev.school_name} has a formal event coming up and is looking for verified cars:\n\n` +
        `Event: ${ev.event_name}\nDate: ${dateLine}\nVenue: ${ev.venue || "TBC"}\n\n` +
        `${ev.details || ""}\n\nIf you'd like to offer your car for this event, reply to ${ev.contact_name} at ${ev.email} ` +
        `(or ${ev.phone || "the school office"}) with your availability.\n\nThanks for being part of Formal Fleet!`
    );
    window.location.href = `mailto:?bcc=${encodeURIComponent(bcc)}&subject=${subject}&body=${body}`;
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
            <h1 className="font-serif text-[20px]">School &amp; P&amp;C Access</h1>
            <p className="text-[13px] text-muted -mt-2">
              Enter your access code to list a formal or event and notify verified drivers.
            </p>
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
      <div className="px-14 py-10 flex gap-8 items-start flex-wrap">
        <div className="w-full max-w-md bg-white border border-line rounded-2xl p-6 shrink-0">
          <h1 className="font-serif text-[20px] mb-1">List an event</h1>
          <p className="text-[13px] text-muted mb-4">
            Tell verified car owners about your formal or event.
          </p>
          <form onSubmit={handleCreateEvent} className="flex flex-col gap-3">
            <input
              className={inputClass}
              placeholder="School name *"
              value={form.school_name}
              onChange={(e) => setForm({ ...form, school_name: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Contact name *"
              value={form.contact_name}
              onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
            />
            <input
              className={inputClass}
              type="email"
              placeholder="Contact email *"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Contact phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Event name *  (e.g. Year 12 Formal 2026)"
              value={form.event_name}
              onChange={(e) => setForm({ ...form, event_name: e.target.value })}
            />
            <input
              className={inputClass}
              type="date"
              value={form.event_date}
              onChange={(e) => setForm({ ...form, event_date: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Venue"
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
            />
            <textarea
              className={`${inputClass} min-h-[90px]`}
              placeholder="Details for drivers (arrival time, dress code, number of cars needed, etc.)"
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
            />
            {createError && <p className="text-[12.5px] text-red-600">{createError}</p>}
            <button
              type="submit"
              disabled={creating}
              className="bg-navy text-white rounded-xl py-3 font-bold text-[14px] disabled:opacity-50"
            >
              {creating ? "Posting…" : "Post event"}
            </button>
          </form>
        </div>

        <div className="flex-1 min-w-[320px]">
          <div className="flex justify-between items-baseline mb-5">
            <h2 className="font-serif text-[22px]">Your events</h2>
            <button
              onClick={() => {
                sessionStorage.removeItem(SESSION_KEY);
                setAuthedCode(null);
                setEvents(null);
                setCode("");
              }}
              className="text-[13px] text-muted underline"
            >
              Log out
            </button>
          </div>

          {loading && !events && <p className="text-muted">Loading…</p>}
          {events && events.length === 0 && <p className="text-muted">No events posted yet.</p>}

          <div className="flex flex-col gap-5">
            {events?.map((ev) => (
              <div key={ev.id} className="bg-white border border-line rounded-2xl p-6">
                <div className="flex justify-between items-start mb-3 flex-wrap gap-3">
                  <div>
                    <h3 className="font-serif text-[19px]">{ev.event_name}</h3>
                    <p className="text-[13px] text-muted mt-0.5">
                      {ev.school_name} ·{" "}
                      {ev.event_date
                        ? new Date(ev.event_date).toLocaleDateString("en-AU")
                        : "Date TBC"}{" "}
                      {ev.venue ? `· ${ev.venue}` : ""}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wide ${
                      ev.status === "open" ? "bg-amber-bg text-amber" : "bg-cream text-muted"
                    }`}
                  >
                    {ev.status}
                  </span>
                </div>
                {ev.details && (
                  <p className="text-[13.5px] text-[#454e60] leading-relaxed mb-4">{ev.details}</p>
                )}
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => notifyDrivers(ev)}
                    disabled={driversLoading}
                    className="bg-navy text-white rounded-lg px-4 py-2.5 font-bold text-[13px] disabled:opacity-50"
                  >
                    {driversLoading ? "Loading drivers…" : "Notify verified drivers"}
                  </button>
                  {ev.status === "open" && (
                    <button
                      onClick={() => closeEvent(ev.id)}
                      disabled={actingId === ev.id}
                      className="bg-white text-muted border border-line rounded-lg px-4 py-2.5 font-bold text-[13px] disabled:opacity-50"
                    >
                      Mark closed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {drivers && (
            <div className="mt-6 bg-cream border border-line rounded-2xl p-5">
              <h4 className="font-bold text-[13.5px] mb-2">
                {drivers.length} verified driver{drivers.length === 1 ? "" : "s"} will be BCC&rsquo;d
              </h4>
              <p className="text-[12.5px] text-muted">
                Your email app should have opened with a draft addressed to all verified owners.
                If it didn&rsquo;t, check your default mail app is set up on this device.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
