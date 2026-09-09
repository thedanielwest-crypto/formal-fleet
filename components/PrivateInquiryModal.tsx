"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const inputClass =
  "w-full border border-line rounded-lg px-3.5 py-3 text-[14.5px] bg-white focus:outline-none focus:ring-2 focus:ring-gold/40";
const labelClass = "block text-[13px] font-semibold mb-1.5";

const EVENT_TYPES = ["Wedding", "Birthday", "Corporate", "Other"];

/**
 * Simple fixed-overlay modal (no headless-ui/radix) collecting a private
 * event inquiry for one car. Submits directly to the public INSERT-only
 * `private_inquiries` policy - works for anonymous visitors.
 */
export default function PrivateInquiryModal({
  carId,
  onClose,
}: {
  carId: string;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [eventType, setEventType] = useState(EVENT_TYPES[0]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    const { error } = await supabase.from("private_inquiries").insert({
      car_id: carId,
      requester_name: name,
      requester_email: email,
      requester_phone: phone || null,
      event_type: eventType,
      message: message || null,
    });

    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/60 px-4 py-8"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-line max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Contact for private events"
      >
        {done ? (
          <div className="flex flex-col items-center text-center gap-3 py-4">
            <div className="font-serif text-[19px]">Thanks — the owner will be in touch.</div>
            <p className="text-[13.5px] text-muted">Your private event inquiry has been sent.</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 bg-navy text-white rounded-xl px-5 py-2.5 font-bold text-[14px]"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex justify-between items-start gap-3">
              <div>
                <h2 className="font-serif text-[19px]">Contact for private events</h2>
                <p className="text-[13px] text-muted mt-1">
                  Weddings, birthdays, corporate events — tell the owner what you need.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-cream border border-line text-muted hover:text-ink font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <label className={labelClass} htmlFor="requester_name">
                Your name
              </label>
              <input
                id="requester_name"
                className={inputClass}
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} htmlFor="requester_email">
                  Email
                </label>
                <input
                  id="requester_email"
                  className={inputClass}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="requester_phone">
                  Phone (optional)
                </label>
                <input
                  id="requester_phone"
                  className={inputClass}
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="event_type">
                Event type
              </label>
              <select
                id="event_type"
                className={inputClass}
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="message">
                Message (optional)
              </label>
              <textarea
                id="message"
                className={inputClass}
                rows={3}
                placeholder="Dates, pickup location, anything else the owner should know…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {error && <p className="text-[12.5px] text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="bg-navy text-white rounded-xl py-3.5 font-bold text-[14.5px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Sending…" : "Send inquiry"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
