"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type SubmissionRow = {
  id: string;
  created_at: string;
  name: string;
  suburb: string;
  car: string;
  description: string | null;
  photo1_path: string;
  photo2_path: string;
  photo3_path: string | null;
  price_mode: string;
  total_price: number;
  driver_share: number;
  platform_share: number;
  status: "unverified" | "verified";
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function photoUrl(path: string) {
  return supabase.storage.from("car-photos").getPublicUrl(path).data.publicUrl;
}

export default function LiveListings() {
  const [rows, setRows] = useState<SubmissionRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("car_submissions")
      .select(
        "id, created_at, name, suburb, car, description, photo1_path, photo2_path, photo3_path, price_mode, total_price, driver_share, platform_share, status"
      )
      .neq("status", "rejected")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setError(error.message);
          return;
        }
        setRows((data as SubmissionRow[]) ?? []);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return null;
  if (!rows || rows.length === 0) return null;

  return (
    <section className="px-14 pb-14">
      <div className="flex justify-between items-baseline mb-5">
        <h2 className="font-serif text-[22px]">Newly submitted cars</h2>
        <span className="text-muted text-sm">
          {rows.length} {rows.length === 1 ? "car" : "cars"} awaiting or completing verification
        </span>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {rows.map((row) => {
          const isVerified = row.status === "verified";
          const priceLabel =
            row.price_mode === "min" || !row.total_price
              ? "$100 / trip"
              : `$${Number(row.total_price).toFixed(2).replace(/\.00$/, "")} / trip`;
          return (
            <div
              key={row.id}
              className="bg-white border border-line rounded-2xl overflow-hidden shadow-sm"
            >
              <div className="relative h-[280px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoUrl(row.photo1_path)}
                  alt={row.car}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute top-3.5 left-3.5 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-bold ${
                    isVerified ? "bg-white/95 text-navy-deep" : "bg-amber-bg text-amber"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isVerified ? "bg-gold" : "bg-amber"}`} />
                  {isVerified ? "Verified" : "Unverified"}
                </div>
                <div className="absolute bottom-3.5 right-3.5 px-3.5 py-1.5 rounded-lg text-[13px] font-bold text-white bg-navy-deep">
                  {priceLabel}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-[19px] mb-1 font-medium">{row.car}</h3>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[13px] text-muted">📍 {row.suburb}, QLD</span>
                  <span className="text-[13px] text-gold font-bold">★ New listing</span>
                </div>
                {row.description && (
                  <p className="text-[13.5px] text-[#454e60] leading-relaxed mb-3.5">
                    {row.description}
                  </p>
                )}
                <div className="flex items-center gap-2.5">
                  <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-[12px] font-bold text-navy">
                    {initials(row.name)}
                  </div>
                  <div>
                    <div className="text-[13.5px] font-semibold">{row.name}</div>
                    <div className="text-[11.5px] text-muted">
                      {isVerified ? "Verified owner" : "Verification in progress"} · {row.suburb}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
