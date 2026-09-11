"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/authContext";
import { type Listing } from "@/lib/listings";
import { photoUrl } from "@/lib/carPhoto";
import PrivateInquiryModal from "@/components/PrivateInquiryModal";
import { Icon } from "@/components/BrandIcon";

/**
 * This component owns the whole /browse grid: it fetches the live
 * car_submissions rows, merges them with the static demo `listings` (passed
 * in as a prop from the server-rendered page.tsx), and renders one combined,
 * client-side-filterable grid. app/browse/page.tsx stays a thin server
 * wrapper around this.
 */

// Only the columns the anon/authenticated SELECT grant on car_submissions
// allows - never add "name"/"email"/"phone"/"driver_id" etc back in here.
type SubmissionRow = {
  id: string;
  created_at: string;
  car: string;
  description: string | null;
  photo1_path: string;
  photo2_path: string;
  photo3_path: string | null;
  price_mode: string;
  total_price: number;
  status: "unverified" | "verified";
  suburb: string;
  make: string | null;
  model: string | null;
  year: number | null;
  colour: string | null;
  seats: number | null;
  scenic_drive_ok: boolean | null;
  available_weddings: boolean | null;
};

type CarCard = {
  id: string;
  source: "live" | "demo";
  title: string;
  make: string | null;
  model: string | null;
  year: number | null;
  colour: string | null;
  seats: number | null;
  suburb: string;
  status: "verified" | "unverified";
  scenicDriveOk: boolean;
  availableWeddings: boolean;
  priceLabel: string;
  photoUrl: string;
  description: string | null;
};

type EventConnection = {
  event_id: string;
  school_events: { event_name: string } | null;
};

// The 2 static demo listings in lib/listings.ts predate the make/model/year/
// colour/seats/scenic_drive_ok/available_weddings columns, and that file is
// read-only reference data here — so their spec values are reasonable
// hardcoded stand-ins rather than something pulled from the source data.
const DEMO_SPECS: Record<
  string,
  {
    make: string;
    model: string;
    year: number;
    colour: string;
    seats: number;
    scenicDriveOk: boolean;
    availableWeddings: boolean;
  }
> = {
  "mazda-rx7-peter-stuyvesant-tribute": {
    make: "Mazda",
    model: "RX-7",
    year: 1985,
    colour: "White",
    seats: 4,
    scenicDriveOk: true,
    availableWeddings: false,
  },
  "ac-cobra-replica": {
    make: "AC",
    model: "Cobra Replica",
    year: 1965,
    colour: "Red",
    seats: 2,
    scenicDriveOk: true,
    availableWeddings: true,
  },
};

function demoToCard(listing: Listing): CarCard {
  const specs = DEMO_SPECS[listing.slug];
  return {
    id: listing.slug,
    source: "demo",
    title: listing.title,
    make: specs?.make ?? null,
    model: specs?.model ?? null,
    year: specs?.year ?? null,
    colour: specs?.colour ?? null,
    seats: specs?.seats ?? null,
    suburb: listing.suburb,
    status: listing.badge === "pending" ? "unverified" : "verified",
    scenicDriveOk: specs?.scenicDriveOk ?? false,
    availableWeddings: specs?.availableWeddings ?? false,
    priceLabel: listing.priceLabel,
    photoUrl: listing.heroImage,
    description: listing.description,
  };
}

function rowToCard(row: SubmissionRow): CarCard {
  const priceLabel =
    row.price_mode === "min" || !row.total_price
      ? "$100 / trip"
      : `$${Number(row.total_price).toFixed(2).replace(/\.00$/, "")} / trip`;
  return {
    id: row.id,
    source: "live",
    title: row.car,
    make: row.make,
    model: row.model,
    year: row.year,
    colour: row.colour,
    seats: row.seats,
    suburb: row.suburb,
    status: row.status,
    scenicDriveOk: !!row.scenic_drive_ok,
    availableWeddings: !!row.available_weddings,
    priceLabel,
    photoUrl: photoUrl(row.photo1_path) ?? "",
    description: row.description,
  };
}

const LOCATIONS = ["All areas", "Samford", "The Gap", "Brendale"];
const SEAT_OPTIONS = [
  { label: "Any seats", value: 0 },
  { label: "2+ seats", value: 2 },
  { label: "4+ seats", value: 4 },
  { label: "5+ seats", value: 5 },
  { label: "6+ seats", value: 6 },
];

const pillClass = (active: boolean) =>
  `px-3 py-1.5 rounded-full text-[12.5px] font-medium border ${
    active ? "bg-navy text-white border-navy" : "border-line"
  }`;
const selectClass =
  "w-full border border-line rounded-lg px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-gold/40";
const filterLabelClass = "text-[12px] uppercase tracking-wide text-muted font-bold mb-2.5";

export default function LiveListings({ listings }: { listings: Listing[] }) {
  const [rows, setRows] = useState<SubmissionRow[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<"all" | "verified">("all");
  const [locationFilter, setLocationFilter] = useState<string>("All areas");
  const [makeFilter, setMakeFilter] = useState<string>("");
  const [modelFilter, setModelFilter] = useState<string>("");
  const [colourFilter, setColourFilter] = useState<string>("");
  const [minSeats, setMinSeats] = useState<number>(0);
  const [yearMin, setYearMin] = useState<string>("");
  const [yearMax, setYearMax] = useState<string>("");
  const [scenicOnly, setScenicOnly] = useState(false);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("car_submissions")
      .select(
        "id, created_at, car, description, photo1_path, photo2_path, photo3_path, price_mode, total_price, status, suburb, make, model, year, colour, seats, scenic_drive_ok, available_weddings"
      )
      .neq("status", "rejected")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setLoadError(error.message);
          return;
        }
        setRows((data as SubmissionRow[]) ?? []);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const allCars = useMemo<CarCard[]>(() => {
    const demoCards = listings.map(demoToCard);
    const liveCards = (rows ?? []).map(rowToCard);
    return [...demoCards, ...liveCards];
  }, [listings, rows]);

  const makeOptions = useMemo(() => {
    const values = allCars
      .map((c) => c.make)
      .filter((m): m is string => !!m);
    return Array.from(new Set(values)).sort();
  }, [allCars]);
  const colourOptions = useMemo(() => {
    const values = allCars
      .map((c) => c.colour)
      .filter((c): c is string => !!c);
    return Array.from(new Set(values)).sort();
  }, [allCars]);

  const filteredCars = useMemo(() => {
    return allCars.filter((c) => {
      if (statusFilter === "verified" && c.status !== "verified") return false;
      if (
        locationFilter !== "All areas" &&
        !c.suburb.toLowerCase().includes(locationFilter.toLowerCase())
      )
        return false;
      if (makeFilter && c.make !== makeFilter) return false;
      if (
        modelFilter &&
        !(c.model ?? "").toLowerCase().includes(modelFilter.trim().toLowerCase())
      )
        return false;
      if (colourFilter && c.colour !== colourFilter) return false;
      if (minSeats > 0 && (c.seats ?? 0) < minSeats) return false;
      if (yearMin && (c.year ?? 0) < Number(yearMin)) return false;
      if (yearMax && (c.year ?? 9999) > Number(yearMax)) return false;
      if (scenicOnly && !c.scenicDriveOk) return false;
      return true;
    });
  }, [
    allCars,
    statusFilter,
    locationFilter,
    makeFilter,
    modelFilter,
    colourFilter,
    minSeats,
    yearMin,
    yearMax,
    scenicOnly,
  ]);

  return (
    <div className="flex flex-col md:flex-row gap-8 px-6 md:px-14 py-9 items-start">
      <aside className="w-full md:w-[260px] bg-white border border-line rounded-2xl p-5.5 shrink-0 flex flex-col gap-5">
        <h3 className="font-serif text-[15px]">Filters</h3>

        <div>
          <h4 className={filterLabelClass}>Trust &amp; Verification</h4>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={pillClass(statusFilter === "all")}
            >
              All listings
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("verified")}
              className={pillClass(statusFilter === "verified")}
            >
              Verified only
            </button>
          </div>
        </div>

        <div>
          <h4 className={filterLabelClass}>Location</h4>
          <div className="flex flex-wrap gap-2">
            {LOCATIONS.map((l) => (
              <button
                type="button"
                key={l}
                onClick={() => setLocationFilter(l)}
                className={pillClass(locationFilter === l)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className={filterLabelClass}>Make</h4>
          <select
            className={selectClass}
            value={makeFilter}
            onChange={(e) => setMakeFilter(e.target.value)}
          >
            <option value="">Any make</option>
            {makeOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h4 className={filterLabelClass}>Model</h4>
          <input
            type="text"
            placeholder="e.g. RX-7"
            className={selectClass}
            value={modelFilter}
            onChange={(e) => setModelFilter(e.target.value)}
          />
        </div>

        <div>
          <h4 className={filterLabelClass}>Colour</h4>
          <select
            className={selectClass}
            value={colourFilter}
            onChange={(e) => setColourFilter(e.target.value)}
          >
            <option value="">Any colour</option>
            {colourOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h4 className={filterLabelClass}>Seats</h4>
          <select
            className={selectClass}
            value={minSeats}
            onChange={(e) => setMinSeats(Number(e.target.value))}
          >
            {SEAT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h4 className={filterLabelClass}>Year</h4>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              className={selectClass}
              value={yearMin}
              onChange={(e) => setYearMin(e.target.value)}
            />
            <span className="text-muted text-[12px]">to</span>
            <input
              type="number"
              placeholder="Max"
              className={selectClass}
              value={yearMax}
              onChange={(e) => setYearMax(e.target.value)}
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-[13px] font-medium">
          <input
            type="checkbox"
            checked={scenicOnly}
            onChange={(e) => setScenicOnly(e.target.checked)}
          />
          Willing to do a scenic drive
        </label>
      </aside>

      <main className="flex-1 w-full">
        <div className="flex justify-between items-baseline mb-5 flex-wrap gap-2">
          <h2 className="font-serif text-[22px]">
            {filteredCars.length} {filteredCars.length === 1 ? "car" : "cars"} near Brisbane
          </h2>
          <span className="text-muted text-sm">Sorted by: Newest</span>
        </div>

        {loadError && (
          <p className="text-[13px] text-amber bg-amber-bg border border-amber/30 rounded-lg px-4 py-3 mb-5">
            Couldn&rsquo;t load newly submitted cars right now — showing example listings only.
          </p>
        )}

        {filteredCars.length === 0 ? (
          <p className="text-muted">No cars match those filters yet — try widening your search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredCars.map((car) => (
              <CarCardView key={`${car.source}-${car.id}`} car={car} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function CarCardView({ car }: { car: CarCard }) {
  const isVerified = car.status === "verified";
  const specParts = [car.make, car.model, car.year ? String(car.year) : null]
    .filter(Boolean)
    .join(" ");

  const detailHref = car.source === "demo" ? `/listing/${car.id}` : `/car?id=${car.id}`;

  return (
    <div className="bg-white border border-line rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link href={detailHref} className="block">
        <div className="relative h-[280px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={car.photoUrl} alt={car.title} className="w-full h-full object-cover" />
          <div
            className={`absolute top-3.5 left-3.5 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-bold ${
              isVerified ? "bg-white/95 text-navy-deep" : "bg-amber-bg text-amber"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isVerified ? "bg-gold" : "bg-amber"}`} />
            {isVerified ? "Verified" : "Unverified"}
          </div>
          <div className="absolute bottom-3.5 right-3.5 px-3.5 py-1.5 rounded-lg text-[13px] font-bold text-white bg-navy-deep">
            {car.priceLabel}
          </div>
        </div>
        <div className="px-5 pt-5">
          <h3 className="text-[19px] mb-1 font-medium hover:underline">{car.title}</h3>
          <div className="flex justify-between items-center mb-2 flex-wrap gap-1.5">
            <span className="text-[13px] text-muted flex items-center gap-1">
              <Icon name="pin" className="w-3.5 h-3.5" /> {car.suburb}, QLD
            </span>
            <span className="text-[13px] text-gold font-bold flex items-center gap-1">
              <Icon name="star" className="w-3.5 h-3.5" /> New listing
            </span>
          </div>

          {(specParts || car.colour || car.seats) && (
            <p className="text-[12.5px] text-muted mb-2.5">
              {[specParts, car.colour, car.seats ? `${car.seats} seats` : null]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}

          <div className="flex flex-wrap gap-1.5 mb-3">
            {car.scenicDriveOk && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-bg text-amber">
                Scenic drive OK
              </span>
            )}
            {car.availableWeddings && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#eef1fb] text-navy">
                Available for weddings
              </span>
            )}
          </div>

          {car.description && (
            <p className="text-[13.5px] text-[#454e60] leading-relaxed mb-3.5">{car.description}</p>
          )}
        </div>
      </Link>

      <div className="px-5 pb-5">
        <div className="flex flex-col gap-2 pt-2 border-t border-line">
          {car.source === "live" ? (
            <InviteToEventControl carId={car.id} />
          ) : (
            <button
              type="button"
              disabled
              title="Demo listing"
              className="w-full bg-cream text-muted border border-line rounded-lg px-4 py-2.5 font-bold text-[13px] cursor-not-allowed"
            >
              Invite to Event
            </button>
          )}
          {car.source === "live" && car.availableWeddings && (
            <PrivateEventControl carId={car.id} />
          )}
        </div>
      </div>
    </div>
  );
}

export function InviteToEventControl({ carId }: { carId: string }) {
  const { session, profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [connections, setConnections] = useState<EventConnection[] | null>(null);
  const [loadingConnections, setLoadingConnections] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isStudent = !!session && profile?.role === "student";

  async function handleToggle() {
    const next = !open;
    setOpen(next);
    if (next && isStudent && connections === null && !loadingConnections) {
      setLoadingConnections(true);
      setError(null);
      const { data, error } = await supabase.functions.invoke("events-hub", {
        body: { action: "get-my-connections" },
      });
      setLoadingConnections(false);
      if (error || data?.error) {
        setError("Couldn't load your events right now.");
        return;
      }
      setConnections((data?.connections as EventConnection[]) ?? []);
    }
  }

  async function sendInvite() {
    if (!selectedEventId || sending) return;
    setSending(true);
    setError(null);
    const { data, error } = await supabase.functions.invoke("events-hub", {
      body: { action: "student-invite-car", event_id: selectedEventId, car_id: carId },
    });
    setSending(false);
    if (error || data?.error) {
      setError(data?.error || "Couldn't send that invite.");
      return;
    }
    setSent(true);
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleToggle}
        className="w-full bg-navy text-white rounded-lg px-4 py-2.5 font-bold text-[13px]"
      >
        {open ? "Hide" : "Invite to Event"}
      </button>

      {open && (
        <div className="mt-2.5 text-[12.5px] leading-relaxed">
          {sent ? (
            <p className="font-semibold text-[#1d7a4c]">
              Invite sent — the owner has been notified.
            </p>
          ) : !session ? (
            <p className="text-muted">
              Create a student account and connect to your event to invite this car —{" "}
              <Link href="/signup?role=student" className="underline font-semibold text-ink">
                Sign up
              </Link>{" "}
              or{" "}
              <Link href="/login" className="underline font-semibold text-ink">
                log in
              </Link>
              .
            </p>
          ) : !isStudent ? (
            <p className="text-muted">Only student accounts can invite cars to an event.</p>
          ) : loadingConnections ? (
            <p className="text-muted">Loading your events…</p>
          ) : connections && connections.length === 0 ? (
            <p className="text-muted">
              <Link href="/dashboard/student" className="underline font-semibold text-ink">
                Connect to your registered event first
              </Link>
              .
            </p>
          ) : connections && connections.length > 0 ? (
            <div className="flex flex-col gap-2">
              <select
                className={selectClass}
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
              >
                <option value="">Select your event…</option>
                {connections.map(
                  (c) =>
                    c.school_events && (
                      <option key={c.event_id} value={c.event_id}>
                        {c.school_events.event_name}
                      </option>
                    )
                )}
              </select>
              <button
                type="button"
                onClick={sendInvite}
                disabled={!selectedEventId || sending}
                className="bg-navy text-white rounded-lg px-4 py-2 font-bold text-[13px] disabled:opacity-50"
              >
                {sending ? "Sending…" : "Send invite"}
              </button>
            </div>
          ) : null}
          {error && <p className="text-red-600 mt-1.5">{error}</p>}
        </div>
      )}
    </div>
  );
}

export function PrivateEventControl({ carId }: { carId: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full bg-white text-navy border border-line rounded-lg px-4 py-2.5 font-bold text-[13px]"
      >
        Contact for Private Events
      </button>
      {open && <PrivateInquiryModal carId={carId} onClose={() => setOpen(false)} />}
    </>
  );
}
