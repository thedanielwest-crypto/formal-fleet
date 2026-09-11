"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Icon } from "@/components/BrandIcon";

type Status = {
  loading: boolean;
  booked: boolean;
  eventName: string | null;
  eventDate: string | null;
  error: boolean;
};

/**
 * Public "already booked for an event?" badge for a car detail page. Calls
 * the events-hub edge function's get-car-status action, which is the one
 * public (no-sign-in-required) action on that function - it looks up
 * event_car_status for this car_id and returns only whether there's a
 * confirmed booking plus the event name/date, never driver/school contact
 * details.
 */
export default function CarBookingStatus({ carId }: { carId: string }) {
  const [state, setState] = useState<Status>({
    loading: true,
    booked: false,
    eventName: null,
    eventDate: null,
    error: false,
  });

  useEffect(() => {
    let cancelled = false;
    supabase.functions
      .invoke("events-hub", { body: { action: "get-car-status", car_id: carId } })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || data?.error) {
          setState((s) => ({ ...s, loading: false, error: true }));
          return;
        }
        setState({
          loading: false,
          booked: !!data.booked,
          eventName: data.eventName ?? null,
          eventDate: data.eventDate ?? null,
          error: false,
        });
      });
    return () => {
      cancelled = true;
    };
  }, [carId]);

  if (state.loading) {
    return <p className="text-[12.5px] text-muted">Checking event bookings…</p>;
  }
  if (state.error) return null;

  if (state.booked) {
    const dateLabel = state.eventDate
      ? new Date(state.eventDate).toLocaleDateString("en-AU", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : null;
    return (
      <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-navy bg-[#eef1fb] border border-line rounded-lg px-3 py-2.5">
        <Icon name="celebration" className="w-3.5 h-3.5 shrink-0" />
        Already booked{state.eventName ? ` for ${state.eventName}` : " for an event"}
        {dateLabel ? ` · ${dateLabel}` : ""}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[#1d7a4c] bg-[#eafaf1] border border-line rounded-lg px-3 py-2.5">
      <Icon name="check" className="w-3.5 h-3.5 shrink-0" />
      Not booked yet — still available
    </div>
  );
}
