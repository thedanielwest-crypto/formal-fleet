"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MessageThread from "@/components/MessageThread";
import { supabase } from "@/lib/supabaseClient";
import { useRequireRole } from "@/lib/useRequireRole";

const statusStyle: Record<string, string> = {
  unverified: "bg-amber-bg text-amber",
  verified: "bg-[#e8f6ee] text-[#1d7a4c]",
  rejected: "bg-red-50 text-red-600",
};

const eventStatusStyle: Record<string, string> = {
  invited: "bg-amber-bg text-amber",
  confirmed: "bg-[#e8f6ee] text-[#1d7a4c]",
  declined: "bg-red-50 text-red-600",
};

export default function DriverDashboard() {
  const { session, profile, loading } = useRequireRole("driver");
  const [submissions, setSubmissions] = useState<any[] | null>(null);
  const [eventItems, setEventItems] = useState<any[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openThread, setOpenThread] = useState<string | null>(null);

  async function loadAll() {
    const [subsRes, eventsRes] = await Promise.all([
      supabase.functions.invoke("events-hub", { body: { action: "get-my-submissions" } }),
      supabase.functions.invoke("events-hub", { body: { action: "get-my-events-for-driver" } }),
    ]);
    if (!subsRes.error && !subsRes.data?.error) setSubmissions(subsRes.data.submissions);
    if (!eventsRes.error && !eventsRes.data?.error) setEventItems(eventsRes.data.items);
  }

  useEffect(() => {
    if (session && profile?.role === "driver") loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, profile]);

  async function respond(eventId: string, carId: string, response: "interested" | "declined") {
    setBusyId(eventId + carId);
    setError(null);
    const { data, error } = await supabase.functions.invoke("events-hub", {
      body: { action: "respond", event_id: eventId, car_id: carId, response },
    });
    setBusyId(null);
    if (error || data?.error) {
      setError(data?.error || "Something went wrong.");
      return;
    }
    loadAll();
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
      <div className="px-6 md:px-14 py-10">
        <h1 className="font-serif text-[24px] mb-1">Welcome back, {profile?.name?.split(" ")[0]}</h1>
        <p className="text-muted mb-8">Your cars and event invites, all in one place.</p>

        <div className="flex justify-between items-baseline mb-4">
          <h2 className="font-serif text-[19px]">Your cars</h2>
          <Link href="/list-your-car" className="text-[13px] font-semibold underline">
            + List another car
          </Link>
        </div>

        {submissions === null && <p className="text-muted mb-8">Loading…</p>}
        {submissions?.length === 0 && (
          <div className="bg-white border border-line rounded-2xl p-6 mb-8 text-center">
            <p className="text-muted mb-3">You haven&rsquo;t listed a car yet.</p>
            <Link href="/list-your-car" className="bg-navy text-white rounded-xl px-5 py-2.5 font-bold text-[13.5px]">
              List your car
            </Link>
          </div>
        )}

        <div className="flex flex-col gap-4 mb-10">
          {submissions?.map((s) => (
            <div key={s.id} className="bg-white border border-line rounded-2xl p-5 flex gap-4 items-center flex-wrap">
              {s.photo1_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.photo1_url} alt={s.car} className="w-20 h-20 object-cover rounded-lg" />
              )}
              <div className="flex-1 min-w-[180px]">
                <h3 className="font-serif text-[17px]">{s.car}</h3>
                <p className="text-[13px] text-muted">{s.suburb}</p>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wide ${statusStyle[s.status]}`}>
                {s.status}
              </span>
            </div>
          ))}
        </div>

        <h2 className="font-serif text-[19px] mb-4">Events</h2>
        {error && <p className="text-[13px] text-red-600 mb-3">{error}</p>}
        {eventItems === null && <p className="text-muted">Loading…</p>}
        {eventItems?.length === 0 && (
          <p className="text-muted">
            No event invites yet — once a school invites your car, or you list a car and browse{" "}
            <Link href="/browse" className="underline font-semibold">open events</Link>, they&rsquo;ll show up here.
          </p>
        )}
        <div className="flex flex-col gap-4">
          {eventItems?.map((item) => (
            <div key={item.id} className="bg-white border border-line rounded-2xl p-5">
              <div className="flex justify-between items-start flex-wrap gap-3 mb-2">
                <div>
                  <h3 className="font-serif text-[17px]">{item.event?.event_name}</h3>
                  <p className="text-[13px] text-muted">
                    {item.event?.school_name}
                    {item.event?.venue ? ` · ${item.event.venue}` : ""}
                    {item.event?.event_date
                      ? ` · ${new Date(item.event.event_date).toLocaleDateString("en-AU")}`
                      : ""}
                  </p>
                  <p className="text-[12.5px] text-muted mt-0.5">For: {item.car}</p>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wide ${eventStatusStyle[item.status]}`}>
                  {item.status}
                </span>
              </div>
              {item.status !== "confirmed" && item.status !== "declined" && (
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => respond(item.event_id, item.car_id, "interested")}
                    disabled={busyId === item.event_id + item.car_id}
                    className="bg-navy text-white rounded-lg px-4 py-2 font-bold text-[13px] disabled:opacity-50"
                  >
                    I can attend
                  </button>
                  <button
                    onClick={() => respond(item.event_id, item.car_id, "declined")}
                    disabled={busyId === item.event_id + item.car_id}
                    className="bg-white text-muted border border-line rounded-lg px-4 py-2 font-bold text-[13px] disabled:opacity-50"
                  >
                    Can&rsquo;t make it
                  </button>
                </div>
              )}
              {item.status === "confirmed" && (
                <>
                  <button
                    onClick={() =>
                      setOpenThread(openThread === item.id ? null : item.id)
                    }
                    className="text-[13px] font-semibold underline mt-1"
                  >
                    {openThread === item.id ? "Hide messages" : "Message the school"}
                  </button>
                  {openThread === item.id && (
                    <MessageThread eventId={item.event_id} carId={item.car_id} />
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
