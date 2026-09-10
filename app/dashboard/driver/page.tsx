"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MessageThread from "@/components/MessageThread";
import { supabase } from "@/lib/supabaseClient";
import { useRequireRole } from "@/lib/useRequireRole";
import { Icon } from "@/components/BrandIcon";

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

const inquiryStatusStyle: Record<string, string> = {
  new: "bg-amber-bg text-amber",
  open: "bg-amber-bg text-amber",
  contacted: "bg-[#e8f6ee] text-[#1d7a4c]",
  closed: "bg-line text-muted",
};

function relativeTime(iso: string) {
  const then = new Date(iso).getTime();
  const diffMs = Date.now() - then;
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-AU");
}

export default function DriverDashboard() {
  const { session, profile, loading } = useRequireRole("driver");
  const [submissions, setSubmissions] = useState<any[] | null>(null);
  const [eventItems, setEventItems] = useState<any[] | null>(null);
  const [notifications, setNotifications] = useState<any[] | null>(null);
  const [inquiries, setInquiries] = useState<any[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openThread, setOpenThread] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [togglingCarId, setTogglingCarId] = useState<string | null>(null);
  const [markingRead, setMarkingRead] = useState(false);

  async function loadAll() {
    const [subsRes, eventsRes, notifRes, inquiriesRes] = await Promise.all([
      supabase.functions.invoke("events-hub", { body: { action: "get-my-submissions" } }),
      supabase.functions.invoke("events-hub", { body: { action: "get-my-events-for-driver" } }),
      supabase.functions.invoke("events-hub", { body: { action: "get-my-notifications" } }),
      supabase.functions.invoke("events-hub", { body: { action: "get-private-inquiries" } }),
    ]);
    if (!subsRes.error && !subsRes.data?.error) setSubmissions(subsRes.data.submissions);
    if (!eventsRes.error && !eventsRes.data?.error) setEventItems(eventsRes.data.items);
    if (!notifRes.error && !notifRes.data?.error) setNotifications(notifRes.data.notifications);
    if (!inquiriesRes.error && !inquiriesRes.data?.error) setInquiries(inquiriesRes.data.inquiries);
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

  async function toggleWeddingAvailability(carId: string, current: boolean) {
    setTogglingCarId(carId);
    setError(null);
    const { data, error } = await supabase.functions.invoke("events-hub", {
      body: {
        action: "update-my-car",
        car_id: carId,
        patch: { available_weddings: !current },
      },
    });
    setTogglingCarId(null);
    if (error || data?.error) {
      setError(data?.error || "Couldn't update that car.");
      return;
    }
    loadAll();
  }

  const unreadIds = (notifications ?? []).filter((n) => !n.read).map((n) => n.id);

  async function markAllRead() {
    if (unreadIds.length === 0) return;
    setMarkingRead(true);
    await supabase.functions.invoke("events-hub", {
      body: { action: "mark-notifications-read", ids: unreadIds },
    });
    setMarkingRead(false);
    loadAll();
  }

  function carLabel(carId: string) {
    const car = submissions?.find((s) => s.id === carId);
    return car?.car || "Your car";
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
        <div className="flex justify-between items-start gap-4 mb-1 flex-wrap">
          <h1 className="font-serif text-[24px]">Welcome back, {profile?.name?.split(" ")[0]}</h1>
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative bg-white border border-line rounded-full w-10 h-10 flex items-center justify-center text-[17px]"
              aria-label="Notifications"
            >
              <Icon name="bell" className="w-5 h-5" />
              {unreadIds.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {unreadIds.length}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white border border-line rounded-2xl shadow-lg p-4 z-10">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-serif text-[15px]">Notifications</h3>
                  {unreadIds.length > 0 && (
                    <button
                      onClick={markAllRead}
                      disabled={markingRead}
                      className="text-[12px] font-semibold underline disabled:opacity-50"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
                  {notifications === null && <p className="text-[13px] text-muted">Loading…</p>}
                  {notifications?.length === 0 && (
                    <p className="text-[13px] text-muted">Nothing yet — invites and messages will show up here.</p>
                  )}
                  {notifications?.map((n) => (
                    <div
                      key={n.id}
                      className={`border border-line rounded-lg px-3 py-2 ${n.read ? "bg-white" : "bg-cream"}`}
                    >
                      <div className="flex items-start gap-2">
                        {!n.read && <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />}
                        <div className="flex-1">
                          <div className={`text-[13px] ${n.read ? "" : "font-bold"}`}>{n.title}</div>
                          {n.body && <div className="text-[12px] text-muted mt-0.5">{n.body}</div>}
                          <div className="text-[11px] text-muted mt-1">{relativeTime(n.created_at)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
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
              <label className="flex items-center gap-2 text-[12.5px] font-semibold cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={!!s.available_weddings}
                  disabled={togglingCarId === s.id}
                  onChange={() => toggleWeddingAvailability(s.id, !!s.available_weddings)}
                />
                Available for weddings / private events
              </label>
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

        <h2 className="font-serif text-[19px] mb-4 mt-10">Private inquiries</h2>
        {inquiries === null && <p className="text-muted">Loading…</p>}
        {inquiries?.length === 0 && (
          <p className="text-muted">
            No wedding or private-event inquiries yet — turn on availability above so couples
            can find your car.
          </p>
        )}
        <div className="flex flex-col gap-4">
          {inquiries?.map((inq) => (
            <div key={inq.id} className="bg-white border border-line rounded-2xl p-5">
              <div className="flex justify-between items-start flex-wrap gap-3 mb-2">
                <div>
                  <h3 className="font-serif text-[16px]">{inq.requester_name}</h3>
                  <p className="text-[13px] text-muted">
                    For: {carLabel(inq.car_id)}
                    {inq.event_type ? ` · ${inq.event_type}` : ""}
                  </p>
                </div>
                <span
                  className={`px-3 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wide ${
                    inquiryStatusStyle[inq.status] || "bg-line text-muted"
                  }`}
                >
                  {inq.status}
                </span>
              </div>
              {inq.message && <p className="text-[13.5px] mt-1 mb-2">{inq.message}</p>}
              <div className="text-[12.5px] text-muted flex items-center gap-1 flex-wrap">
                <Icon name="mail" className="w-3.5 h-3.5" /> {inq.requester_email}
                {inq.requester_phone ? (
                  <>
                    <span className="mx-0.5">·</span>
                    <Icon name="phone" className="w-3.5 h-3.5" /> {inq.requester_phone}
                  </>
                ) : (
                  ""
                )}
              </div>
              <div className="text-[11px] text-muted mt-1">{relativeTime(inq.created_at)}</div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
