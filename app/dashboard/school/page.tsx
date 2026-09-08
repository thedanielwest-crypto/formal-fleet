"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MessageThread from "@/components/MessageThread";
import { supabase } from "@/lib/supabaseClient";
import { useRequireRole } from "@/lib/useRequireRole";

const inputClass =
  "w-full border border-line rounded-lg px-4 py-2.5 text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-gold/40";

const emptyForm = { event_name: "", event_date: "", venue: "", details: "", venue_suburb: "" };

const carStatusStyle: Record<string, string> = {
  invited: "bg-amber-bg text-amber",
  confirmed: "bg-[#e8f6ee] text-[#1d7a4c]",
  declined: "bg-red-50 text-red-600",
};

export default function SchoolDashboard() {
  const { session, profile, loading } = useRequireRole("school");
  const [events, setEvents] = useState<any[] | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [eventCars, setEventCars] = useState<any[] | null>(null);
  const [invitingId, setInvitingId] = useState<string | null>(null);
  const [inviteResult, setInviteResult] = useState<string | null>(null);
  const [openThreadCarId, setOpenThreadCarId] = useState<string | null>(null);

  async function loadEvents() {
    const { data, error } = await supabase.functions.invoke("events-hub", {
      body: { action: "get-my-events" },
    });
    if (!error && !data?.error) setEvents(data.events);
  }

  useEffect(() => {
    if (session && profile?.role === "school") loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, profile]);

  async function createEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!form.event_name) {
      setCreateError("Give your event a name.");
      return;
    }
    setCreating(true);
    setCreateError(null);
    const { data, error } = await supabase.functions.invoke("events-hub", {
      body: { action: "create-event", event: form },
    });
    setCreating(false);
    if (error || data?.error) {
      setCreateError(data?.error || "Couldn't create that event.");
      return;
    }
    setForm(emptyForm);
    loadEvents();
  }

  async function toggleExpand(eventId: string) {
    if (expanded === eventId) {
      setExpanded(null);
      return;
    }
    setExpanded(eventId);
    setEventCars(null);
    const { data, error } = await supabase.functions.invoke("events-hub", {
      body: { action: "get-event-cars", event_id: eventId },
    });
    if (!error && !data?.error) setEventCars(data.items);
  }

  async function inviteCars(eventId: string) {
    setInvitingId(eventId);
    setInviteResult(null);
    const { data, error } = await supabase.functions.invoke("events-hub", {
      body: { action: "invite-cars", event_id: eventId },
    });
    setInvitingId(null);
    if (error || data?.error) {
      setInviteResult(data?.error || "Something went wrong.");
      return;
    }
    setInviteResult(`Invited ${data.invited} car${data.invited === 1 ? "" : "s"} within 200km.`);
    if (expanded === eventId) toggleExpand(eventId).then(() => toggleExpand(eventId));
  }

  if (loading || !session) {
    return (
      <div>
        <Header />
        <div className="px-14 py-16 text-muted">Loading…</div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="px-6 md:px-14 py-10 flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:max-w-md bg-white border border-line rounded-2xl p-6 shrink-0">
          <h1 className="font-serif text-[20px] mb-1">List an event</h1>
          <p className="text-[13px] text-muted mb-4">
            Posted as {profile?.school_name || profile?.name}.
          </p>
          <form onSubmit={createEvent} className="flex flex-col gap-3">
            <input
              className={inputClass}
              placeholder="Event name * (e.g. Year 12 Formal 2026)"
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
            <input
              className={inputClass}
              placeholder="Venue suburb (for finding nearby cars)"
              value={form.venue_suburb}
              onChange={(e) => setForm({ ...form, venue_suburb: e.target.value })}
            />
            <textarea
              className={`${inputClass} min-h-[90px]`}
              placeholder="Details for drivers (arrival time, dress code, cars needed, etc.)"
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

        <div className="flex-1 min-w-[320px] w-full">
          <h2 className="font-serif text-[22px] mb-5">Your events</h2>
          {events === null && <p className="text-muted">Loading…</p>}
          {events?.length === 0 && <p className="text-muted">No events posted yet.</p>}

          <div className="flex flex-col gap-5">
            {events?.map((ev) => (
              <div key={ev.id} className="bg-white border border-line rounded-2xl p-6">
                <div className="flex justify-between items-start mb-3 flex-wrap gap-3">
                  <div>
                    <h3 className="font-serif text-[19px]">{ev.event_name}</h3>
                    <p className="text-[13px] text-muted mt-0.5">
                      {ev.event_date ? new Date(ev.event_date).toLocaleDateString("en-AU") : "Date TBC"}
                      {ev.venue ? ` · ${ev.venue}` : ""}
                    </p>
                  </div>
                  <span className="px-3 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wide bg-amber-bg text-amber">
                    {ev.status}
                  </span>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => inviteCars(ev.id)}
                    disabled={invitingId === ev.id}
                    className="bg-navy text-white rounded-lg px-4 py-2.5 font-bold text-[13px] disabled:opacity-50"
                  >
                    {invitingId === ev.id ? "Inviting…" : "Invite cars within 200km"}
                  </button>
                  <button
                    onClick={() => toggleExpand(ev.id)}
                    className="bg-white text-navy border border-line rounded-lg px-4 py-2.5 font-bold text-[13px]"
                  >
                    {expanded === ev.id ? "Hide invited cars" : "View invited cars"}
                  </button>
                </div>
                {inviteResult && invitingId === null && expanded !== ev.id && (
                  <p className="text-[12.5px] text-muted mt-2">{inviteResult}</p>
                )}

                {expanded === ev.id && (
                  <div className="mt-4 border-t border-line pt-4">
                    {eventCars === null && <p className="text-muted text-[13px]">Loading…</p>}
                    {eventCars?.length === 0 && (
                      <p className="text-muted text-[13px]">
                        No cars invited yet — click &ldquo;Invite cars within 200km&rdquo; above.
                      </p>
                    )}
                    <div className="flex flex-col gap-3">
                      {eventCars?.map((c) => (
                        <div key={c.id} className="bg-cream border border-line rounded-xl p-4">
                          <div className="flex justify-between items-center flex-wrap gap-2">
                            <div className="flex items-center gap-3">
                              {c.photo_url && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={c.photo_url} alt={c.car_name} className="w-12 h-12 rounded-lg object-cover" />
                              )}
                              <div>
                                <div className="font-semibold text-[14px]">{c.car_name}</div>
                                <div className="text-[12.5px] text-muted">
                                  {c.owner_name} · {c.suburb}
                                </div>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[11.5px] font-bold uppercase tracking-wide ${carStatusStyle[c.status]}`}>
                              {c.status}
                            </span>
                          </div>
                          {c.status === "confirmed" && c.contact && (
                            <div className="mt-2 text-[12.5px]">
                              📧 {c.contact.email} {c.contact.phone ? `· 📞 ${c.contact.phone}` : ""}
                            </div>
                          )}
                          {c.status === "confirmed" && (
                            <>
                              <button
                                onClick={() =>
                                  setOpenThreadCarId(openThreadCarId === c.car_id ? null : c.car_id)
                                }
                                className="text-[12.5px] font-semibold underline mt-2"
                              >
                                {openThreadCarId === c.car_id ? "Hide messages" : "Message this driver"}
                              </button>
                              {openThreadCarId === c.car_id && (
                                <MessageThread eventId={ev.id} carId={c.car_id} />
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
