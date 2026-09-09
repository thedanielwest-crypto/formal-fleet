"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import { useRequireRole } from "@/lib/useRequireRole";

type OpenEvent = {
  id: string;
  school_name: string;
  event_name: string;
  event_date: string | null;
  venue: string | null;
  details: string | null;
  status: string;
};

type Connection = {
  event_id: string;
  school_events: OpenEvent | null;
};

type CarRow = {
  id: string;
  suburb: string;
  car: string;
  description: string | null;
  photo1_path: string;
  status: "unverified" | "verified";
};

function photoUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return supabase.storage.from("car-photos").getPublicUrl(path).data.publicUrl;
}

export default function StudentDashboard() {
  const { session, profile, loading } = useRequireRole("student");

  const [connections, setConnections] = useState<Connection[] | null>(null);
  const [openEvents, setOpenEvents] = useState<OpenEvent[] | null>(null);
  const [cars, setCars] = useState<CarRow[] | null>(null);

  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [invitingCarId, setInvitingCarId] = useState<string | null>(null);
  const [pickEventFor, setPickEventFor] = useState<string | null>(null);
  const [inviteMsg, setInviteMsg] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  async function loadConnections() {
    const { data, error } = await supabase.functions.invoke("events-hub", {
      body: { action: "get-my-connections" },
    });
    if (!error && !data?.error) setConnections(data.connections);
  }

  async function loadOpenEvents() {
    const { data, error } = await supabase
      .from("school_events")
      .select("id, school_name, event_name, event_date, venue, details, status")
      .eq("status", "open")
      .order("event_date", { ascending: true });
    if (!error) setOpenEvents(data as OpenEvent[]);
  }

  async function loadCars() {
    const { data, error } = await supabase
      .from("car_submissions")
      .select("id, suburb, car, description, photo1_path, status")
      .neq("status", "rejected")
      .order("created_at", { ascending: false });
    if (!error) setCars(data as CarRow[]);
  }

  useEffect(() => {
    if (session && profile?.role === "student") {
      loadConnections();
      loadOpenEvents();
      loadCars();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, profile]);

  const connectedEventIds = useMemo(
    () => new Set((connections ?? []).map((c) => c.event_id)),
    [connections]
  );

  async function connectToEvent(eventId: string) {
    setConnectingId(eventId);
    setError(null);
    const { data, error } = await supabase.functions.invoke("events-hub", {
      body: { action: "connect-to-event", event_id: eventId },
    });
    setConnectingId(null);
    if (error || data?.error) {
      setError(data?.error || "Couldn't connect to that event.");
      return;
    }
    loadConnections();
  }

  async function inviteCar(carId: string, eventId: string) {
    setInvitingCarId(carId);
    setError(null);
    const { data, error } = await supabase.functions.invoke("events-hub", {
      body: { action: "student-invite-car", event_id: eventId, car_id: carId },
    });
    setInvitingCarId(null);
    setPickEventFor(null);
    if (error || data?.error) {
      setError(data?.error || "Couldn't send that invite.");
      return;
    }
    setInviteMsg({ ...inviteMsg, [carId]: "Invite sent! 🎉" });
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

  const connectedEvents = (connections ?? [])
    .map((c) => c.school_events)
    .filter(Boolean) as OpenEvent[];

  return (
    <div>
      <Header />
      <div className="px-6 md:px-14 py-10">
        <h1 className="font-serif text-[24px] mb-1">
          Hey {profile?.name?.split(" ")[0]}, let&rsquo;s find your formal ride
        </h1>
        <p className="text-muted mb-8">
          Connect to your event, then browse cars and invite the one you want.
        </p>

        {error && <p className="text-[13px] text-red-600 mb-4">{error}</p>}

        <section className="mb-10">
          <h2 className="font-serif text-[19px] mb-4">Your events</h2>
          {connections === null && <p className="text-muted">Loading…</p>}
          {connections?.length === 0 && (
            <p className="text-muted mb-3">
              You haven&rsquo;t connected to an event yet — find yours below.
            </p>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {connectedEvents.map((ev) => (
              <div key={ev.id} className="bg-white border border-line rounded-2xl p-5">
                <h3 className="font-serif text-[17px]">{ev.event_name}</h3>
                <p className="text-[13px] text-muted mt-1">
                  {ev.school_name}
                  {ev.venue ? ` · ${ev.venue}` : ""}
                </p>
                <p className="text-[13px] text-muted">
                  {ev.event_date ? new Date(ev.event_date).toLocaleDateString("en-AU") : "Date TBC"}
                </p>
                <span className="inline-block mt-3 px-3 py-1 rounded-full text-[11.5px] font-bold uppercase tracking-wide bg-[#e8f6ee] text-[#1d7a4c]">
                  Connected
                </span>
              </div>
            ))}
          </div>

          <details className="bg-white border border-line rounded-2xl p-5">
            <summary className="font-serif text-[16px] cursor-pointer select-none">
              Find &amp; connect to your event
            </summary>
            <div className="mt-4 flex flex-col gap-3">
              {openEvents === null && <p className="text-muted text-[13px]">Loading…</p>}
              {openEvents?.length === 0 && (
                <p className="text-muted text-[13px]">No open events posted yet.</p>
              )}
              {openEvents
                ?.filter((ev) => !connectedEventIds.has(ev.id))
                .map((ev) => (
                  <div
                    key={ev.id}
                    className="flex justify-between items-center flex-wrap gap-3 border border-line rounded-xl p-4"
                  >
                    <div>
                      <div className="font-semibold text-[14px]">{ev.event_name}</div>
                      <div className="text-[12.5px] text-muted">
                        {ev.school_name}
                        {ev.venue ? ` · ${ev.venue}` : ""}
                        {ev.event_date
                          ? ` · ${new Date(ev.event_date).toLocaleDateString("en-AU")}`
                          : ""}
                      </div>
                    </div>
                    <button
                      onClick={() => connectToEvent(ev.id)}
                      disabled={connectingId === ev.id}
                      className="bg-navy text-white rounded-lg px-4 py-2 font-bold text-[13px] disabled:opacity-50"
                    >
                      {connectingId === ev.id ? "Connecting…" : "Connect"}
                    </button>
                  </div>
                ))}
            </div>
          </details>
        </section>

        <section>
          <h2 className="font-serif text-[19px] mb-4">Browse cars</h2>
          {connectedEvents.length === 0 && (
            <p className="text-muted mb-4">
              Connect to your event above before inviting a car.
            </p>
          )}
          {cars === null && <p className="text-muted">Loading…</p>}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cars?.map((c) => (
              <div key={c.id} className="bg-white border border-line rounded-2xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoUrl(c.photo1_path)} alt={c.car} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="font-serif text-[16px]">{c.car}</h3>
                  <p className="text-[12.5px] text-muted mb-2">
                    📍 {c.suburb} · {c.status === "verified" ? "Verified" : "Unverified"}
                  </p>
                  {inviteMsg[c.id] ? (
                    <p className="text-[13px] font-semibold text-[#1d7a4c]">{inviteMsg[c.id]}</p>
                  ) : pickEventFor === c.id ? (
                    <div className="flex flex-col gap-2">
                      {connectedEvents.map((ev) => (
                        <button
                          key={ev.id}
                          onClick={() => inviteCar(c.id, ev.id)}
                          disabled={invitingCarId === c.id}
                          className="text-left bg-cream border border-line rounded-lg px-3 py-2 text-[12.5px] font-semibold disabled:opacity-50"
                        >
                          {invitingCarId === c.id ? "Inviting…" : `Invite to ${ev.event_name}`}
                        </button>
                      ))}
                      <button
                        onClick={() => setPickEventFor(null)}
                        className="text-[12px] text-muted underline self-start"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setPickEventFor(c.id)}
                      disabled={connectedEvents.length === 0}
                      className="bg-navy text-white rounded-lg px-4 py-2 font-bold text-[13px] disabled:opacity-50"
                    >
                      Invite this car
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
