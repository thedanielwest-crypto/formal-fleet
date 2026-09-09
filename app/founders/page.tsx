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
  make: string | null;
  model: string | null;
  year: number | null;
  colour: string | null;
  seats: number | null;
  scenic_drive_ok: boolean;
  available_weddings: boolean;
  is_demo: boolean;
};

type SchoolEvent = {
  id: string;
  created_at: string;
  school_name: string;
  contact_name: string;
  email: string;
  phone: string;
  event_name: string;
  event_date: string | null;
  venue: string;
  details: string | null;
  status: string;
  school_id: string | null;
  postcode: string | null;
  lat: number | null;
  lng: number | null;
  is_demo: boolean;
};

type CarDraft = {
  name: string;
  email: string;
  phone: string;
  suburb: string;
  gender: string;
  car: string;
  description: string;
  price_mode: string;
  total_price: string;
  driver_share: string;
  platform_share: string;
  status: string;
  founder_notes: string;
  blue_card_status: string;
  make: string;
  model: string;
  year: string;
  colour: string;
  seats: string;
  scenic_drive_ok: boolean;
  available_weddings: boolean;
  is_demo: boolean;
};

type EventDraft = {
  school_name: string;
  contact_name: string;
  email: string;
  phone: string;
  event_name: string;
  event_date: string;
  venue: string;
  details: string;
  status: string;
  postcode: string;
  lat: string;
  lng: string;
  is_demo: boolean;
};

const inputClass =
  "w-full border border-line rounded-lg px-4 py-2.5 text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-gold/40";

const labelClass = "block text-[12px] font-semibold text-muted mb-1";

const statusStyle: Record<string, string> = {
  unverified: "bg-amber-bg text-amber",
  verified: "bg-[#e8f6ee] text-[#1d7a4c]",
  rejected: "bg-red-50 text-red-600",
};

const eventStatusStyle: Record<string, string> = {
  open: "bg-[#e8f6ee] text-[#1d7a4c]",
  closed: "bg-red-50 text-red-600",
};

const demoBadgeClass =
  "px-3 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wide bg-[#eef1fb] text-[#3b4b91]";

function toCarDraft(s: Submission): CarDraft {
  return {
    name: s.name ?? "",
    email: s.email ?? "",
    phone: s.phone ?? "",
    suburb: s.suburb ?? "",
    gender: s.gender ?? "",
    car: s.car ?? "",
    description: s.description ?? "",
    price_mode: s.price_mode ?? "min",
    total_price: s.total_price != null ? String(s.total_price) : "",
    driver_share: s.driver_share != null ? String(s.driver_share) : "",
    platform_share: s.platform_share != null ? String(s.platform_share) : "",
    status: s.status ?? "unverified",
    founder_notes: s.founder_notes ?? "",
    blue_card_status: s.blue_card_status ?? "",
    make: s.make ?? "",
    model: s.model ?? "",
    year: s.year != null ? String(s.year) : "",
    colour: s.colour ?? "",
    seats: s.seats != null ? String(s.seats) : "",
    scenic_drive_ok: !!s.scenic_drive_ok,
    available_weddings: !!s.available_weddings,
    is_demo: !!s.is_demo,
  };
}

function carDraftToPatch(d: CarDraft) {
  return {
    name: d.name,
    email: d.email,
    phone: d.phone,
    suburb: d.suburb,
    gender: d.gender,
    car: d.car,
    description: d.description || null,
    price_mode: d.price_mode,
    total_price: d.total_price === "" ? 0 : Number(d.total_price),
    driver_share: d.driver_share === "" ? 0 : Number(d.driver_share),
    platform_share: d.platform_share === "" ? 0 : Number(d.platform_share),
    status: d.status,
    founder_notes: d.founder_notes || null,
    blue_card_status: d.blue_card_status,
    make: d.make || null,
    model: d.model || null,
    year: d.year === "" ? null : Number(d.year),
    colour: d.colour || null,
    seats: d.seats === "" ? null : Number(d.seats),
    scenic_drive_ok: d.scenic_drive_ok,
    available_weddings: d.available_weddings,
    is_demo: d.is_demo,
  };
}

function toEventDraft(e: SchoolEvent): EventDraft {
  return {
    school_name: e.school_name ?? "",
    contact_name: e.contact_name ?? "",
    email: e.email ?? "",
    phone: e.phone ?? "",
    event_name: e.event_name ?? "",
    event_date: e.event_date ? e.event_date.slice(0, 10) : "",
    venue: e.venue ?? "",
    details: e.details ?? "",
    status: e.status ?? "open",
    postcode: e.postcode ?? "",
    lat: e.lat != null ? String(e.lat) : "",
    lng: e.lng != null ? String(e.lng) : "",
    is_demo: !!e.is_demo,
  };
}

function eventDraftToPatch(d: EventDraft) {
  return {
    school_name: d.school_name,
    contact_name: d.contact_name,
    email: d.email,
    phone: d.phone,
    event_name: d.event_name,
    event_date: d.event_date || null,
    venue: d.venue,
    details: d.details || null,
    status: d.status,
    postcode: d.postcode || null,
    lat: d.lat === "" ? null : Number(d.lat),
    lng: d.lng === "" ? null : Number(d.lng),
    is_demo: d.is_demo,
  };
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

function CarEditForm({
  draft,
  onChange,
  onSave,
  onCancel,
  saving,
}: {
  draft: CarDraft;
  onChange: (patch: Partial<CarDraft>) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  return (
    <div className="bg-cream border border-line rounded-lg p-4 mt-3 flex flex-col gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Name">
          <input className={inputClass} value={draft.name} onChange={(e) => onChange({ name: e.target.value })} />
        </Field>
        <Field label="Email">
          <input className={inputClass} value={draft.email} onChange={(e) => onChange({ email: e.target.value })} />
        </Field>
        <Field label="Phone">
          <input className={inputClass} value={draft.phone} onChange={(e) => onChange({ phone: e.target.value })} />
        </Field>
        <Field label="Suburb">
          <input className={inputClass} value={draft.suburb} onChange={(e) => onChange({ suburb: e.target.value })} />
        </Field>
        <Field label="Gender / identification">
          <input className={inputClass} value={draft.gender} onChange={(e) => onChange({ gender: e.target.value })} />
        </Field>
        <Field label="Car (title)">
          <input className={inputClass} value={draft.car} onChange={(e) => onChange({ car: e.target.value })} />
        </Field>
        <Field label="Make">
          <input className={inputClass} value={draft.make} onChange={(e) => onChange({ make: e.target.value })} />
        </Field>
        <Field label="Model">
          <input className={inputClass} value={draft.model} onChange={(e) => onChange({ model: e.target.value })} />
        </Field>
        <Field label="Year">
          <input
            className={inputClass}
            type="number"
            value={draft.year}
            onChange={(e) => onChange({ year: e.target.value })}
          />
        </Field>
        <Field label="Colour">
          <input className={inputClass} value={draft.colour} onChange={(e) => onChange({ colour: e.target.value })} />
        </Field>
        <Field label="Seats">
          <input
            className={inputClass}
            type="number"
            value={draft.seats}
            onChange={(e) => onChange({ seats: e.target.value })}
          />
        </Field>
        <Field label="Blue Card status">
          <input
            className={inputClass}
            value={draft.blue_card_status}
            onChange={(e) => onChange({ blue_card_status: e.target.value })}
          />
        </Field>
        <Field label="Price mode">
          <select
            className={inputClass}
            value={draft.price_mode}
            onChange={(e) => onChange({ price_mode: e.target.value })}
          >
            <option value="min">$100 minimum</option>
            <option value="custom">Custom</option>
          </select>
        </Field>
        <Field label="Total price ($)">
          <input
            className={inputClass}
            type="number"
            value={draft.total_price}
            onChange={(e) => onChange({ total_price: e.target.value })}
          />
        </Field>
        <Field label="Driver share ($)">
          <input
            className={inputClass}
            type="number"
            value={draft.driver_share}
            onChange={(e) => onChange({ driver_share: e.target.value })}
          />
        </Field>
        <Field label="Platform share ($)">
          <input
            className={inputClass}
            type="number"
            value={draft.platform_share}
            onChange={(e) => onChange({ platform_share: e.target.value })}
          />
        </Field>
        <Field label="Status">
          <select className={inputClass} value={draft.status} onChange={(e) => onChange({ status: e.target.value })}>
            <option value="unverified">Unverified</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </Field>
      </div>

      <Field label="Description">
        <textarea
          className={inputClass}
          rows={3}
          value={draft.description}
          onChange={(e) => onChange({ description: e.target.value })}
        />
      </Field>

      <Field label="Founder notes">
        <textarea
          className={inputClass}
          rows={2}
          value={draft.founder_notes}
          onChange={(e) => onChange({ founder_notes: e.target.value })}
        />
      </Field>

      <div className="flex flex-wrap gap-4 text-[13px]">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={draft.scenic_drive_ok}
            onChange={(e) => onChange({ scenic_drive_ok: e.target.checked })}
          />
          Scenic drive OK
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={draft.available_weddings}
            onChange={(e) => onChange({ available_weddings: e.target.checked })}
          />
          Available for weddings
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={draft.is_demo} onChange={(e) => onChange({ is_demo: e.target.checked })} />
          Prototype / testing profile (seed/demo data, not a real submission)
        </label>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onSave}
          disabled={saving}
          className="bg-navy text-white rounded-lg px-4 py-2.5 font-bold text-[13px] disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        <button
          onClick={onCancel}
          disabled={saving}
          className="bg-white border border-line rounded-lg px-4 py-2.5 font-bold text-[13px] disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function EventEditForm({
  draft,
  onChange,
  onSave,
  onCancel,
  saving,
}: {
  draft: EventDraft;
  onChange: (patch: Partial<EventDraft>) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  return (
    <div className="bg-cream border border-line rounded-lg p-4 mt-3 flex flex-col gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="School name">
          <input
            className={inputClass}
            value={draft.school_name}
            onChange={(e) => onChange({ school_name: e.target.value })}
          />
        </Field>
        <Field label="Event name">
          <input
            className={inputClass}
            value={draft.event_name}
            onChange={(e) => onChange({ event_name: e.target.value })}
          />
        </Field>
        <Field label="Contact name">
          <input
            className={inputClass}
            value={draft.contact_name}
            onChange={(e) => onChange({ contact_name: e.target.value })}
          />
        </Field>
        <Field label="Email">
          <input className={inputClass} value={draft.email} onChange={(e) => onChange({ email: e.target.value })} />
        </Field>
        <Field label="Phone">
          <input className={inputClass} value={draft.phone} onChange={(e) => onChange({ phone: e.target.value })} />
        </Field>
        <Field label="Event date">
          <input
            className={inputClass}
            type="date"
            value={draft.event_date}
            onChange={(e) => onChange({ event_date: e.target.value })}
          />
        </Field>
        <Field label="Venue">
          <input className={inputClass} value={draft.venue} onChange={(e) => onChange({ venue: e.target.value })} />
        </Field>
        <Field label="Postcode">
          <input
            className={inputClass}
            value={draft.postcode}
            onChange={(e) => onChange({ postcode: e.target.value })}
          />
        </Field>
        <Field label="Latitude">
          <input
            className={inputClass}
            type="number"
            value={draft.lat}
            onChange={(e) => onChange({ lat: e.target.value })}
          />
        </Field>
        <Field label="Longitude">
          <input
            className={inputClass}
            type="number"
            value={draft.lng}
            onChange={(e) => onChange({ lng: e.target.value })}
          />
        </Field>
        <Field label="Status">
          <select className={inputClass} value={draft.status} onChange={(e) => onChange({ status: e.target.value })}>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </Field>
      </div>

      <Field label="Details">
        <textarea
          className={inputClass}
          rows={3}
          value={draft.details}
          onChange={(e) => onChange({ details: e.target.value })}
        />
      </Field>

      <label className="flex items-center gap-2 text-[13px]">
        <input type="checkbox" checked={draft.is_demo} onChange={(e) => onChange({ is_demo: e.target.checked })} />
        Prototype / testing event (seed/demo data, not a real event)
      </label>

      <div className="flex gap-3">
        <button
          onClick={onSave}
          disabled={saving}
          className="bg-navy text-white rounded-lg px-4 py-2.5 font-bold text-[13px] disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        <button
          onClick={onCancel}
          disabled={saving}
          className="bg-white border border-line rounded-lg px-4 py-2.5 font-bold text-[13px] disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function FoundersPage() {
  const [code, setCode] = useState("");
  const [authedCode, setAuthedCode] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Submission[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [actingId, setActingId] = useState<string | null>(null);

  const [tab, setTab] = useState<"cars" | "events">("cars");

  const [editingCarId, setEditingCarId] = useState<string | null>(null);
  const [carDraft, setCarDraft] = useState<CarDraft | null>(null);

  const [events, setEvents] = useState<SchoolEvent[] | null>(null);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventDraft, setEventDraft] = useState<EventDraft | null>(null);

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

  function startEditCar(s: Submission) {
    setEditingCarId(s.id);
    setCarDraft(toCarDraft(s));
  }

  function cancelEditCar() {
    setEditingCarId(null);
    setCarDraft(null);
  }

  async function saveCar(id: string) {
    if (!authedCode || !carDraft) return;
    setActingId(id);
    const { data, error } = await supabase.functions.invoke("founders", {
      body: { code: authedCode, action: "update-car", id, patch: carDraftToPatch(carDraft) },
    });
    setActingId(null);
    if (error || data?.error) {
      alert(data?.error || "Something went wrong.");
      return;
    }
    setEditingCarId(null);
    setCarDraft(null);
    await loadWith(authedCode);
  }

  async function deleteCar(id: string) {
    if (!authedCode) return;
    if (!window.confirm("Delete this car submission? This cannot be undone.")) return;
    setActingId(id);
    const { data, error } = await supabase.functions.invoke("founders", {
      body: { code: authedCode, action: "delete-car", id },
    });
    setActingId(null);
    if (error || data?.error) {
      alert(data?.error || "Something went wrong.");
      return;
    }
    if (editingCarId === id) {
      setEditingCarId(null);
      setCarDraft(null);
    }
    await loadWith(authedCode);
  }

  async function loadEvents() {
    if (!authedCode) return;
    setEventsLoading(true);
    setEventsError(null);
    const { data, error } = await supabase.functions.invoke("founders", {
      body: { code: authedCode, action: "list-events" },
    });
    setEventsLoading(false);
    if (error || data?.error) {
      setEventsError(data?.error || "Something went wrong.");
      return;
    }
    setEvents(data.events);
  }

  function selectTab(next: "cars" | "events") {
    setTab(next);
    if (next === "events" && events === null && !eventsLoading) {
      loadEvents();
    }
  }

  function startEditEvent(ev: SchoolEvent) {
    setEditingEventId(ev.id);
    setEventDraft(toEventDraft(ev));
  }

  function cancelEditEvent() {
    setEditingEventId(null);
    setEventDraft(null);
  }

  async function saveEvent(id: string) {
    if (!authedCode || !eventDraft) return;
    setActingId(id);
    const { data, error } = await supabase.functions.invoke("founders", {
      body: { code: authedCode, action: "update-event", id, patch: eventDraftToPatch(eventDraft) },
    });
    setActingId(null);
    if (error || data?.error) {
      alert(data?.error || "Something went wrong.");
      return;
    }
    setEditingEventId(null);
    setEventDraft(null);
    await loadEvents();
  }

  async function deleteEvent(id: string) {
    if (!authedCode) return;
    if (!window.confirm("Delete this school event? This cannot be undone.")) return;
    setActingId(id);
    const { data, error } = await supabase.functions.invoke("founders", {
      body: { code: authedCode, action: "delete-event", id },
    });
    setActingId(null);
    if (error || data?.error) {
      alert(data?.error || "Something went wrong.");
      return;
    }
    if (editingEventId === id) {
      setEditingEventId(null);
      setEventDraft(null);
    }
    await loadEvents();
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
        <div className="flex justify-between items-baseline mb-6 flex-wrap gap-3">
          <h1 className="font-serif text-[24px]">
            Founders — {tab === "cars" ? "Car Submissions" : "School Events"}
          </h1>
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

        <div className="flex gap-2 mb-7">
          <button
            onClick={() => selectTab("cars")}
            className={
              tab === "cars"
                ? "bg-navy text-white rounded-lg px-4 py-2.5 font-bold text-[13px]"
                : "bg-white border border-line rounded-lg px-4 py-2.5 font-bold text-[13px]"
            }
          >
            Car Submissions
          </button>
          <button
            onClick={() => selectTab("events")}
            className={
              tab === "events"
                ? "bg-navy text-white rounded-lg px-4 py-2.5 font-bold text-[13px]"
                : "bg-white border border-line rounded-lg px-4 py-2.5 font-bold text-[13px]"
            }
          >
            School Events
          </button>
        </div>

        {tab === "cars" && (
          <>
            {loading && !submissions && <p className="text-muted">Loading…</p>}
            {submissions && submissions.length === 0 && <p className="text-muted">No submissions yet.</p>}

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
                    <div className="flex gap-2 items-center flex-wrap">
                      {s.is_demo && <span className={demoBadgeClass}>Prototype / Testing Profile</span>}
                      <span
                        className={`px-3 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wide ${statusStyle[s.status]}`}
                      >
                        {s.status}
                      </span>
                    </div>
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
                    <div className="flex gap-3 items-center flex-wrap mb-3">
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

                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() =>
                        editingCarId === s.id ? cancelEditCar() : startEditCar(s)
                      }
                      className="bg-white border border-line rounded-lg px-4 py-2.5 font-bold text-[13px]"
                    >
                      {editingCarId === s.id ? "Cancel Edit" : "Edit"}
                    </button>
                    <button
                      onClick={() => deleteCar(s.id)}
                      disabled={actingId === s.id}
                      className="bg-white text-red-600 border border-red-200 rounded-lg px-4 py-2.5 font-bold text-[13px] disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>

                  {editingCarId === s.id && carDraft && (
                    <CarEditForm
                      draft={carDraft}
                      onChange={(patch) => setCarDraft((prev) => (prev ? { ...prev, ...patch } : prev))}
                      onSave={() => saveCar(s.id)}
                      onCancel={cancelEditCar}
                      saving={actingId === s.id}
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "events" && (
          <>
            {eventsLoading && !events && <p className="text-muted">Loading…</p>}
            {eventsError && <p className="text-[12.5px] text-red-600 mb-4">{eventsError}</p>}
            {events && events.length === 0 && <p className="text-muted">No school events yet.</p>}

            <div className="flex flex-col gap-5">
              {events?.map((ev) => (
                <div key={ev.id} className="bg-white border border-line rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
                    <div>
                      <h2 className="font-serif text-[19px]">{ev.event_name}</h2>
                      <p className="text-[13px] text-muted mt-0.5">
                        {ev.school_name} · {ev.venue}
                        {ev.event_date ? ` · ${new Date(ev.event_date).toLocaleDateString("en-AU")}` : ""}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center flex-wrap">
                      {ev.is_demo && <span className={demoBadgeClass}>Prototype / Testing Event</span>}
                      <span
                        className={`px-3 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wide ${
                          eventStatusStyle[ev.status] ?? "bg-cream text-muted"
                        }`}
                      >
                        {ev.status}
                      </span>
                    </div>
                  </div>

                  {ev.details && (
                    <p className="text-[13.5px] text-[#454e60] leading-relaxed mb-4">{ev.details}</p>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-4 text-[13px]">
                    <div className="bg-cream border border-line rounded-lg px-4 py-3">
                      <div className="font-bold mb-1">Contact</div>
                      <div>{ev.contact_name}</div>
                      <div>{ev.email}</div>
                      <div>{ev.phone}</div>
                    </div>
                    <div className="bg-cream border border-line rounded-lg px-4 py-3">
                      <div className="font-bold mb-1">Location</div>
                      <div>{ev.venue}</div>
                      <div>{ev.postcode ?? "—"}</div>
                      <div>
                        {ev.lat != null && ev.lng != null ? `${ev.lat}, ${ev.lng}` : "No coordinates set"}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => (editingEventId === ev.id ? cancelEditEvent() : startEditEvent(ev))}
                      className="bg-white border border-line rounded-lg px-4 py-2.5 font-bold text-[13px]"
                    >
                      {editingEventId === ev.id ? "Cancel Edit" : "Edit"}
                    </button>
                    <button
                      onClick={() => deleteEvent(ev.id)}
                      disabled={actingId === ev.id}
                      className="bg-white text-red-600 border border-red-200 rounded-lg px-4 py-2.5 font-bold text-[13px] disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>

                  {editingEventId === ev.id && eventDraft && (
                    <EventEditForm
                      draft={eventDraft}
                      onChange={(patch) => setEventDraft((prev) => (prev ? { ...prev, ...patch } : prev))}
                      onSave={() => saveEvent(ev.id)}
                      onCancel={cancelEditEvent}
                      saving={actingId === ev.id}
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
