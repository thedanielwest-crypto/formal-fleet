"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type EventRow = {
  id: string;
  school_name: string;
  event_name: string;
  event_date: string | null;
  venue: string | null;
  details: string | null;
  status: string;
};

export default function UpcomingEvents() {
  const [events, setEvents] = useState<EventRow[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("school_events")
      .select("id, school_name, event_name, event_date, venue, details, status")
      .eq("status", "open")
      .order("event_date", { ascending: true })
      .then(({ data }) => {
        if (!cancelled) setEvents((data as EventRow[]) ?? []);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (events && events.length === 0) return null;

  return (
    <section className="px-6 md:px-14 py-14 bg-cream">
      <div className="flex justify-between items-baseline mb-6">
        <h2 className="font-serif text-[26px]">Upcoming events</h2>
        <span className="text-muted text-sm">Open for drivers now</span>
      </div>

      {!events && <p className="text-muted">Loading events…</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {events?.map((ev) => (
          <a
            key={ev.id}
            href="/get-started"
            className="block bg-white border border-line rounded-2xl p-6 hover:border-gold hover:shadow-md transition-all"
          >
            <div className="text-[12px] uppercase tracking-wide text-amber font-bold mb-1.5">
              {ev.event_date
                ? new Date(ev.event_date).toLocaleDateString("en-AU", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Date TBC"}
            </div>
            <h3 className="font-serif text-[19px] mb-1">{ev.event_name}</h3>
            <p className="text-[13.5px] text-muted mb-3">
              {ev.school_name}
              {ev.venue ? ` · ${ev.venue}` : ""}
            </p>
            {ev.details && (
              <p className="text-[13px] text-[#454e60] leading-relaxed line-clamp-3">{ev.details}</p>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}
