"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Icon } from "@/components/BrandIcon";
import { supabase } from "@/lib/supabaseClient";
import { photoUrl } from "@/lib/carPhoto";
import CarBookingStatus from "@/components/CarBookingStatus";
import { InviteToEventControl, PrivateEventControl } from "@/components/LiveListings";

/**
 * Public detail page for any live car_submissions row (the 25 seeded demo
 * profiles and any real driver-submitted car). Reached from the /browse
 * grid by clicking a card. The two hand-curated marketing listings (RX-7,
 * Cobra) have their own static page at /listing/[slug] instead - this page
 * covers everything that lives in the database.
 *
 * Uses a ?id= query param rather than a dynamic [id] segment because the
 * site is a static export (no server at request time): a dynamic segment
 * would need every possible id known at build time, which doesn't work for
 * cars submitted after the last deploy. A query param is just one static
 * page that fetches its data client-side, so any id works immediately.
 */

type CarRow = {
  id: string;
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

function CarDetailInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  // undefined = still loading, null = not found / no id given
  const [car, setCar] = useState<CarRow | null | undefined>(undefined);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setCar(null);
      return;
    }
    let cancelled = false;
    setCar(undefined);
    supabase
      .from("car_submissions")
      .select(
        "id, car, description, photo1_path, photo2_path, photo3_path, price_mode, total_price, status, suburb, make, model, year, colour, seats, scenic_drive_ok, available_weddings"
      )
      .eq("id", id)
      .neq("status", "rejected")
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setLoadError(error.message);
          setCar(null);
          return;
        }
        setCar((data as CarRow) ?? null);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (car === undefined) {
    return (
      <div>
        <Header />
        <div className="px-6 md:px-14 py-20 text-muted">Loading…</div>
        <Footer />
      </div>
    );
  }

  if (car === null) {
    return (
      <div>
        <Header />
        <div className="px-6 md:px-14 py-20">
          <h1 className="font-serif text-[22px] mb-2">Car not found</h1>
          <p className="text-muted mb-4">
            {loadError ?? "This listing may have been removed or the link is out of date."}
          </p>
          <Link href="/browse" className="underline font-semibold text-ink">
            Back to Browse Cars
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const gallery = Array.from(
    new Set([car.photo1_path, car.photo2_path, car.photo3_path].filter((p): p is string => !!p))
  )
    .map((p) => photoUrl(p))
    .filter((u): u is string => !!u);

  const priceLabel =
    car.price_mode === "min" || !car.total_price
      ? "$100 / trip"
      : `$${Number(car.total_price).toFixed(2).replace(/\.00$/, "")} / trip`;

  const isVerified = car.status === "verified";
  const specParts = [car.make, car.model, car.year ? String(car.year) : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div>
      <Header />

      <div className="px-6 md:px-14 pt-5 text-[13px] text-muted">
        <Link href="/browse" className="hover:underline">
          Browse Cars
        </Link>
        &nbsp;›&nbsp; <span className="text-ink font-semibold">{car.car}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-9 px-6 md:px-14 pt-5 pb-16 items-start">
        <div className="flex-1 w-full">
          {gallery.length > 0 ? (
            <div
              className={`grid gap-2.5 rounded-2xl overflow-hidden h-[420px] ${
                gallery.length > 1 ? "grid-cols-[2fr_1fr]" : "grid-cols-1"
              }`}
            >
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={gallery[0]} alt={car.car} className="w-full h-full object-cover" />
              </div>
              {gallery.length > 1 && (
                <div
                  className="grid gap-2.5"
                  style={{ gridTemplateRows: `repeat(${gallery.length - 1}, 1fr)` }}
                >
                  {gallery.slice(1).map((img, i) => (
                    <div key={i} className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`${car.car} photo ${i + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-[420px] rounded-2xl bg-cream border border-line flex items-center justify-center text-muted">
              No photos yet
            </div>
          )}

          <div className="mt-6">
            <h1 className="font-serif text-[28px]">{car.car}</h1>
            <div className="text-[13.5px] text-muted mt-1 flex items-center gap-1.5">
              <Icon name="pin" className="w-3.5 h-3.5" />
              {car.suburb}, QLD
            </div>
          </div>

          <div className="flex gap-2.5 mt-4.5 flex-wrap items-center">
            <div className="flex items-center gap-1.5 bg-white border border-line px-3.5 py-2 rounded-full text-[12.5px] font-semibold">
              <span className={`w-2 h-2 rounded-full ${isVerified ? "bg-gold" : "bg-amber"}`} />
              {isVerified ? "Verified" : "Unverified"}
            </div>
            {car.scenic_drive_ok && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-bg text-amber">
                Scenic drive OK
              </span>
            )}
            {car.available_weddings && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#eef1fb] text-navy">
                Available for weddings
              </span>
            )}
          </div>

          {specParts || car.colour || car.seats ? (
            <p className="text-[13px] text-muted mt-3">
              {[specParts, car.colour, car.seats ? `${car.seats} seats` : null]
                .filter(Boolean)
                .join(" · ")}
            </p>
          ) : null}

          <div className="mt-6 max-w-md">
            <h2 className="font-serif text-[15px] mb-2">Event status</h2>
            <CarBookingStatus carId={car.id} />
          </div>

          {car.description && (
            <div className="mt-8">
              <h2 className="font-serif text-[19px] mb-3">About this ride</h2>
              <p className="text-[14.5px] leading-relaxed text-[#454e60] max-w-2xl">
                {car.description}
              </p>
            </div>
          )}
        </div>

        <div className="w-full md:w-[360px] shrink-0">
          <div className="bg-white border border-line rounded-2xl p-6.5 md:sticky md:top-5 shadow-lg shadow-navy/5">
            <div className="text-[28px] font-extrabold">{priceLabel}</div>
            <div className="flex flex-col gap-2 mt-5.5">
              <InviteToEventControl carId={car.id} />
              {car.available_weddings && <PrivateEventControl carId={car.id} />}
            </div>
            <div className="mt-4.5 text-[12px] text-muted flex gap-2 items-start leading-relaxed">
              <Icon name="shield" className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              Parent/guardian confirmation is required before this booking is finalised, and full
              trip details are sent by SMS once confirmed.
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function CarDetailPage() {
  return (
    <Suspense
      fallback={
        <div>
          <Header />
          <div className="px-6 md:px-14 py-20 text-muted">Loading…</div>
          <Footer />
        </div>
      }
    >
      <CarDetailInner />
    </Suspense>
  );
}
