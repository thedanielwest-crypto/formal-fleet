"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const inputClass =
  "w-full border border-line rounded-lg px-4 py-2.5 text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-gold/40";
const fileInputClass =
  "w-full text-[13px] border border-line rounded-lg px-3 py-2.5 bg-white cursor-pointer file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-navy file:text-white file:text-[12.5px] file:font-semibold file:cursor-pointer";
const labelClass = "block text-[13px] font-semibold mb-1.5";
const hintClass = "text-[12px] text-muted mt-1.5 leading-relaxed";

const MAX_FILE_BYTES = 15 * 1024 * 1024; // generous per-file guardrail

function formatMB(bytes: number) {
  return (bytes / (1024 * 1024)).toFixed(1);
}

async function uploadTo(bucket: string, file: File) {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw new Error(`Upload failed (${bucket}): ${error.message}`);
  return path;
}

export default function ListYourCarForm() {
  const router = useRouter();
  const [hasBlueCard, setHasBlueCard] = useState(true);
  const [priceMode, setPriceMode] = useState<"min" | "custom">("min");
  const [customPrice, setCustomPrice] = useState("");
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const totalPrice = priceMode === "min" ? 100 : Math.max(0, Number(customPrice) || 0);
  const driverShare = totalPrice > 0 ? totalPrice / 2 : 0;
  const platformShare = totalPrice > 0 ? totalPrice / 2 : 0;

  const hasBlockingFileError = useMemo(
    () => Object.values(fileErrors).some(Boolean),
    [fileErrors]
  );

  function checkFile(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.size > MAX_FILE_BYTES) {
        setFileErrors((prev) => ({
          ...prev,
          [field]: `That file is ${formatMB(file.size)}MB — please keep each file under 15MB.`,
        }));
        e.target.value = "";
      } else {
        setFileErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (hasBlockingFileError || submitting) return;
    setSubmitError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const photo1 = data.get("photo1") as File;
    const photo2 = data.get("photo2") as File;
    const photo3 = data.get("photo3") as File | null;
    const licence = data.get("licence") as File;
    const insurance = data.get("insurance") as File;
    const blueCardFile = data.get("blue_card") as File | null;

    try {
      const [photo1_path, photo2_path, licence_path, insurance_path] = await Promise.all([
        uploadTo("car-photos", photo1),
        uploadTo("car-photos", photo2),
        uploadTo("car-documents", licence),
        uploadTo("car-documents", insurance),
      ]);
      const photo3_path = photo3 && photo3.size > 0 ? await uploadTo("car-photos", photo3) : null;
      const blue_card_path =
        hasBlueCard && blueCardFile && blueCardFile.size > 0
          ? await uploadTo("car-documents", blueCardFile)
          : null;

      const { error } = await supabase.from("car_submissions").insert({
        name: data.get("name"),
        email: data.get("email"),
        phone: data.get("phone"),
        suburb: data.get("suburb"),
        gender: data.get("gender"),
        car: data.get("car"),
        description: data.get("message") || null,
        photo1_path,
        photo2_path,
        photo3_path,
        blue_card_path,
        blue_card_status: hasBlueCard
          ? "Has Blue Card — uploaded"
          : "Does not have a Blue Card yet",
        licence_path,
        insurance_path,
        price_mode: priceMode,
        total_price: totalPrice,
        driver_share: driverShare,
        platform_share: platformShare,
        status: "unverified",
      });

      if (error) throw new Error(error.message);
      router.push("/thank-you");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex-1 max-w-xl bg-white border border-line rounded-2xl p-7 flex flex-col gap-7"
    >
      {/* About you */}
      <div>
        <h2 className="font-serif text-[18px] mb-3.5">About you</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className={labelClass} htmlFor="name">Your name</label>
            <input className={inputClass} id="name" name="name" type="text" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="email">Email</label>
              <input className={inputClass} id="email" name="email" type="email" required />
            </div>
            <div>
              <label className={labelClass} htmlFor="phone">Phone</label>
              <input className={inputClass} id="phone" name="phone" type="tel" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="suburb">Suburb</label>
              <input className={inputClass} id="suburb" name="suburb" type="text" required />
            </div>
            <div>
              <label className={labelClass} htmlFor="gender">Driver identification</label>
              <select className={inputClass} id="gender" name="gender" required defaultValue="">
                <option value="" disabled>Select one</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle */}
      <div>
        <h2 className="font-serif text-[18px] mb-3.5">Your vehicle</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className={labelClass} htmlFor="car">Car make, model &amp; year</label>
            <input className={inputClass} id="car" name="car" type="text" placeholder="e.g. 1980s Mazda RX-7" required />
          </div>
          <div>
            <label className={labelClass} htmlFor="message">Tell us about your car</label>
            <textarea className={inputClass} id="message" name="message" rows={3} placeholder="What makes it special? Any story behind it?" />
          </div>
        </div>
      </div>

      {/* Photos */}
      <div>
        <h2 className="font-serif text-[18px] mb-1">Photos</h2>
        <p className={`${hintClass} mb-3.5 mt-0`}>Two clear photos of the car are required. A third is optional.</p>
        <div className="flex flex-col gap-4">
          <div>
            <label className={labelClass} htmlFor="photo1">Photo 1 (required)</label>
            <input className={fileInputClass} id="photo1" name="photo1" type="file" accept="image/*" required onChange={checkFile("photo1")} />
            {fileErrors.photo1 && <p className="text-[12px] text-red-600 mt-1">{fileErrors.photo1}</p>}
          </div>
          <div>
            <label className={labelClass} htmlFor="photo2">Photo 2 (required)</label>
            <input className={fileInputClass} id="photo2" name="photo2" type="file" accept="image/*" required onChange={checkFile("photo2")} />
            {fileErrors.photo2 && <p className="text-[12px] text-red-600 mt-1">{fileErrors.photo2}</p>}
          </div>
          <div>
            <label className={labelClass} htmlFor="photo3">
              Photo 3 — optional: proof you&rsquo;ve already driven a passenger to a formal
            </label>
            <input className={fileInputClass} id="photo3" name="photo3" type="file" accept="image/*" onChange={checkFile("photo3")} />
            {fileErrors.photo3 && <p className="text-[12px] text-red-600 mt-1">{fileErrors.photo3}</p>}
            <p className={hintClass}>No photo? No problem — we&rsquo;ll just use your first two.</p>
          </div>
        </div>
      </div>

      {/* Verification documents */}
      <div>
        <h2 className="font-serif text-[18px] mb-1">Verification documents</h2>
        <p className={`${hintClass} mb-3.5 mt-0`}>
          These are checked before your listing is marked verified — see our{" "}
          <a href="/verification-safety" className="underline font-semibold">Verification &amp; Safety</a> page.
        </p>
        <div className="flex flex-col gap-4">
          <div>
            <label className={labelClass} htmlFor="blue_card">Blue Card (Working with Children Check)</label>
            {hasBlueCard ? (
              <>
                <input
                  className={fileInputClass}
                  id="blue_card"
                  name="blue_card"
                  type="file"
                  accept="image/*,.pdf"
                  required={hasBlueCard}
                  onChange={checkFile("blue_card")}
                />
                {fileErrors.blue_card && <p className="text-[12px] text-red-600 mt-1">{fileErrors.blue_card}</p>}
              </>
            ) : (
              <div className="bg-amber-bg border border-amber/30 rounded-lg px-4 py-3.5 text-[13px] text-[#6b4a12] leading-relaxed">
                No worries — a Blue Card is required before your listing can be marked verified.
                You can apply for one directly with Queensland Blue Card Services:{" "}
                <a
                  href="https://www.qld.gov.au/law/laws-regulated-industries-and-accountability/queensland-laws-and-regulations/regulated-industries-and-licensing/blue-card/applications/apply"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-semibold"
                >
                  Apply for a Blue Card
                </a>
                . Submit this form now and send your Blue Card through once it arrives.
              </div>
            )}
            <label className="flex items-center gap-2 mt-2 text-[12.5px] text-muted">
              <input
                type="checkbox"
                checked={!hasBlueCard}
                onChange={(e) => setHasBlueCard(!e.target.checked)}
              />
              I don&rsquo;t have a Blue Card yet
            </label>
          </div>

          <div>
            <label className={labelClass} htmlFor="licence">Driver&rsquo;s licence</label>
            <input className={fileInputClass} id="licence" name="licence" type="file" accept="image/*,.pdf" required onChange={checkFile("licence")} />
            {fileErrors.licence && <p className="text-[12px] text-red-600 mt-1">{fileErrors.licence}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="insurance">Insurance (Certificate of Currency)</label>
            <input className={fileInputClass} id="insurance" name="insurance" type="file" accept="image/*,.pdf" required onChange={checkFile("insurance")} />
            {fileErrors.insurance && <p className="text-[12px] text-red-600 mt-1">{fileErrors.insurance}</p>}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div>
        <h2 className="font-serif text-[18px] mb-1">Pricing</h2>
        <p className={`${hintClass} mb-3.5 mt-0`}>
          Every trip is a $100 minimum, split straight 50/50 — always. Want to charge more? You
          can, but it&rsquo;s still an even 50/50 split.
        </p>
        <div className="flex flex-col gap-2.5">
          <label className="flex items-center gap-2.5 border border-line rounded-lg px-4 py-3 cursor-pointer has-[:checked]:border-gold has-[:checked]:bg-amber-bg/40">
            <input
              type="radio"
              name="price_mode_radio"
              checked={priceMode === "min"}
              onChange={() => setPriceMode("min")}
            />
            <span className="text-[14px] font-semibold">$100 minimum (recommended)</span>
          </label>
          <label className="flex items-center gap-2.5 border border-line rounded-lg px-4 py-3 cursor-pointer has-[:checked]:border-gold has-[:checked]:bg-amber-bg/40">
            <input
              type="radio"
              name="price_mode_radio"
              checked={priceMode === "custom"}
              onChange={() => setPriceMode("custom")}
            />
            <span className="text-[14px] font-semibold">I&rsquo;d like to charge more</span>
          </label>
          {priceMode === "custom" && (
            <input
              className={inputClass}
              type="number"
              min={100}
              step={5}
              placeholder="Enter total price ($100 minimum)"
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
            />
          )}
        </div>

        <div className="mt-3.5 bg-cream border border-line rounded-lg px-4 py-3.5 flex justify-between text-[13.5px]">
          <div>
            <div className="text-muted text-[12px] uppercase tracking-wide font-bold mb-0.5">You receive</div>
            <div className="font-bold text-[16px]">
              {driverShare > 0 ? `$${driverShare.toFixed(2)}` : "—"}
            </div>
          </div>
          <div className="text-right">
            <div className="text-muted text-[12px] uppercase tracking-wide font-bold mb-0.5">School / platform</div>
            <div className="font-bold text-[16px]">
              {platformShare > 0 ? `$${platformShare.toFixed(2)}` : "—"}
            </div>
          </div>
        </div>
      </div>

      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-[13px]">
          {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={hasBlockingFileError || submitting}
        className="bg-navy text-white rounded-xl py-3.5 font-bold text-[14.5px] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Submitting…" : "Submit Listing Request"}
      </button>
      <p className={hintClass}>
        Your car appears on Formal Fleet right away, marked &ldquo;Unverified&rdquo; until we
        check your documents — then we&rsquo;ll flip it to Verified.
      </p>
    </form>
  );
}
