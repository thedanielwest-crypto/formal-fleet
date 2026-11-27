"use client";

import Link from "next/link";
import { useState } from "react";
import OwnerShell, { SignInPrompt, chipClass, useAcademyData } from "@/components/OwnerShell";
import { supabase } from "@/lib/supabaseClient";
import { STEPS, docTitle, fmtDate, openDocument, stepState, type DriverDoc } from "@/lib/academy";

function fileBadge(name: string | null) {
  const ext = (name?.split(".").pop() || "").toUpperCase().slice(0, 4);
  return ext || "FILE";
}

export default function DocumentsPage() {
  const { userId, attempts, docs, ready, reload } = useAcademyData();
  const [err, setErr] = useState<string | null>(null);
  const done = STEPS.filter((s) => stepState(s, attempts, docs).state === "done").length;
  const today = new Date().toISOString().slice(0, 10);
  const soon = new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10);

  const certs = docs.filter((d) => d.doc_type.startsWith("certificate:"));
  const uploads = docs.filter((d) => !d.doc_type.startsWith("certificate:"));

  async function open(d: DriverDoc) {
    setErr(null);
    try {
      if (d.file_path) await openDocument(d.file_path);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Couldn't open the file.");
    }
  }

  async function remove(d: DriverDoc) {
    if (!confirm(`Remove "${d.file_name}"? You can upload it again afterwards.`)) return;
    if (d.file_path) await supabase.storage.from("driver-docs").remove([d.file_path]);
    const { error } = await supabase.from("driver_documents").delete().eq("id", d.id);
    if (error) setErr(error.message);
    reload();
  }

  const row = (d: DriverDoc) => {
    const expired = d.expiry_date && d.expiry_date < today;
    const expiring = !expired && d.expiry_date && d.expiry_date <= soon;
    const state = expired ? "expired" : d.status === "verified" ? "done" : d.status === "rejected" ? "rejected" : "review";
    const label = expired
      ? "Expired"
      : d.doc_type.startsWith("certificate:")
        ? "✓ Complete"
        : d.status === "verified"
          ? "✓ Verified"
          : d.status === "rejected"
            ? "Needs re-upload"
            : "In review";
    return (
      <div key={d.id} className="flex items-center gap-3.5 py-3.5 border-t border-[#f0ede4] first:border-t-0 flex-wrap">
        <div className="w-[38px] h-[46px] shrink-0 rounded-md bg-[#f3efe2] border border-[#e4dcc3] grid place-items-center font-serif font-extrabold text-[9px] text-gold-dark">
          {fileBadge(d.file_name)}
        </div>
        <div className="flex-1 min-w-[200px]">
          <div className="font-semibold text-[14px]">{docTitle(d.doc_type)}</div>
          <div className="text-[12.5px] text-muted">
            {[
              d.doc_number,
              d.doc_type.startsWith("certificate:") ? `Issued ${fmtDate(d.created_at)}` : `Uploaded ${fmtDate(d.created_at)}`,
              d.expiry_date ? `${d.doc_type.startsWith("certificate:") ? "renew by" : "expires"} ${fmtDate(d.expiry_date)}` : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </div>
          {d.status === "rejected" && d.admin_note && <div className="text-[12.5px] text-red-600 mt-0.5">Note: {d.admin_note}</div>}
          {expiring && <div className="text-[12.5px] text-amber mt-0.5">Expires within 30 days: upload the renewal when you have it.</div>}
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[11.5px] font-semibold whitespace-nowrap ${chipClass[state]}`}>{label}</span>
        {d.file_path && (
          <button onClick={() => open(d)} className="px-3 py-1.5 rounded-lg border border-line text-[12.5px] font-semibold">
            View
          </button>
        )}
        {d.status === "pending" && (
          <button onClick={() => remove(d)} className="text-[12.5px] text-muted underline">
            Remove
          </button>
        )}
      </div>
    );
  };

  return (
    <OwnerShell>
      {!userId && ready ? (
        <SignInPrompt what="see your documents" />
      ) : (
        <div className="bg-white border border-line rounded-2xl p-6">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="font-display text-[26px]">My documents</h2>
            <span className={`px-2.5 py-1 rounded-full text-[12px] font-semibold ${done === STEPS.length ? chipClass.done : chipClass.review}`}>
              {done} of {STEPS.length} steps complete
            </span>
          </div>
          <p className="text-muted text-[13px] mt-1 mb-4">
            Stored privately. Only you and Fleet Formal admins can open these. Keep an eye on expiry dates: we&apos;ll flag anything
            due within 30 days.
          </p>
          {err && <p className="text-red-600 text-[13px] mb-3">{err}</p>}

          <div className="eyebrow !text-muted !text-[11px] mt-4">Fleet Formal certificates (automatic)</div>
          {certs.length ? certs.map(row) : <p className="text-muted text-[13px] py-3">No certificates yet. <Link href="/owners/training" className="underline">Start training</Link>.</p>}

          <div className="eyebrow !text-muted !text-[11px] mt-6">Uploaded by you</div>
          {uploads.length ? uploads.map(row) : <p className="text-muted text-[13px] py-3">Nothing uploaded yet. <Link href="/owners/requirements" className="underline">Go to requirements</Link>.</p>}

          <div className="mt-5">
            <Link href="/owners/requirements" className="btn-gold !py-2.5 !px-4 !text-[12px]">
              ⤒ Upload a document
            </Link>
          </div>
        </div>
      )}
    </OwnerShell>
  );
}
