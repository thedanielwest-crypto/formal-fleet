"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Message = {
  id: string;
  sender_role: string;
  body: string;
  created_at: string;
};

export default function MessageThread({ eventId, carId }: { eventId: string; carId: string }) {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function load() {
    const { data, error } = await supabase.functions.invoke("events-hub", {
      body: { action: "get-thread", event_id: eventId, car_id: carId },
    });
    if (error || data?.error) {
      setError(data?.error || "Couldn't load messages.");
      return;
    }
    setMessages(data.messages ?? []);
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 8000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, carId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    setSending(true);
    const { data, error } = await supabase.functions.invoke("events-hub", {
      body: { action: "send-message", event_id: eventId, car_id: carId, message: draft },
    });
    setSending(false);
    if (error || data?.error) {
      setError(data?.error || "Couldn't send that message.");
      return;
    }
    setDraft("");
    load();
  }

  return (
    <div className="bg-cream border border-line rounded-xl p-4 mt-3">
      <div className="text-[12px] font-bold uppercase tracking-wide text-muted mb-2">
        Messages
      </div>
      <div className="max-h-56 overflow-y-auto flex flex-col gap-2 mb-3">
        {messages === null && <p className="text-[13px] text-muted">Loading…</p>}
        {messages?.length === 0 && (
          <p className="text-[13px] text-muted">
            No messages yet — say hello to get the conversation started.
          </p>
        )}
        {messages?.map((m) => (
          <div key={m.id} className="bg-white border border-line rounded-lg px-3 py-2 text-[13px]">
            <span className="font-bold capitalize">{m.sender_role}</span>{" "}
            <span className="text-muted text-[11px]">
              {new Date(m.created_at).toLocaleString("en-AU", { dateStyle: "short", timeStyle: "short" })}
            </span>
            <div className="mt-0.5">{m.body}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      {error && <p className="text-[12px] text-red-600 mb-2">{error}</p>}
      <form onSubmit={send} className="flex gap-2">
        <input
          className="flex-1 border border-line rounded-lg px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-gold/40"
          placeholder="Type a message…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button
          type="submit"
          disabled={sending}
          className="bg-navy text-white rounded-lg px-4 py-2 font-bold text-[13px] disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
