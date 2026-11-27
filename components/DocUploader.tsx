"use client";

import { useState } from "react";
import { uploadDocument } from "@/lib/academy";

/** Upload proof for one requirement: file + optional number + expiry date. */
export default function DocUploader({
  userId,
  docType,
  numberLabel,
  needsExpiry,
  onDone,
}: {
  userId: string;
  docType: string;
  numberLabel?: string;
  needsExpiry: boolean;
  onDone: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [num, setNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!open)
    return (
      <button onClick={() => setOpen(true)} className="px-3.5 py-2 rounded-lg border border-line bg-white font-semibold text-[12.5px] whitespace-nowrap">
        ⤒ Upload
      </button>
    );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return setErr("Choose a file first.");
    if (file.size > 10 * 1024 * 1024) return setErr("That file is over 10 MB. Try a photo or a smaller PDF.");
    if (needsExpiry && !expiry) return setErr("Add the expiry date so we can remind you before it runs out.");
    setBusy(true);
    setErr(null);
    try {
      await uploadDocument(userId, docType, file, { doc_number: num.trim(), expiry_date: expiry });
      setOpen(false);
      setFile(null);
      setNum("");
      setExpiry("");
      onDone();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const input = "w-full border border-line rounded-lg px-3 py-2 text-[13.5px] bg-white";
  return (
    <form onSubmit={submit} className="w-full mt-2 bg-cream border border-line rounded-xl p-4 grid gap-3 sm:grid-cols-3">
      <label className="sm:col-span-3 text-[12.5px] font-semibold">
        File (PDF or photo, up to 10 MB)
        <input
          type="file"
          accept="application/pdf,image/jpeg,image/png,image/webp,image/heic"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className={`${input} mt-1`}
          required
        />
      </label>
      {numberLabel && (
        <label className="text-[12.5px] font-semibold">
          {numberLabel}
          <input value={num} onChange={(e) => setNum(e.target.value)} className={`${input} mt-1`} />
        </label>
      )}
      {needsExpiry && (
        <label className="text-[12.5px] font-semibold">
          Expiry date
          <input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} className={`${input} mt-1`} required />
        </label>
      )}
      <div className="flex gap-2 items-end">
        <button type="submit" disabled={busy} className="btn-gold !py-2.5 !px-4 !text-[12px]">
          {busy ? "Uploading…" : "Upload"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-[12.5px] text-muted underline px-2 py-2.5">
          Cancel
        </button>
      </div>
      {err && <p className="sm:col-span-3 text-red-600 text-[13px]">{err}</p>}
    </form>
  );
}
