"use client";

import { useMemo, useState } from "react";

const inputClass =
  "w-full border border-line rounded-lg px-4 py-2.5 text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-gold/40";
const fileInputClass =
  "w-full text-[13px] border border-line rounded-lg px-3 py-2.5 bg-white cursor-pointer file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-navy file:text-white file:text-[12.5px] file:font-semibold file:cursor-pointer";
const labelClass = "block text-[13px] font-semibold mb-1.5";
const hintClass = "text-[12px] text-muted mt-1.5 leading-relaxed";

const MAX_TOTAL_BYTES = 8 * 1024 * 1024; // Netlify Forms: 8MB per submission, across every field.

function formatMB(bytes: number) {
  return (bytes / (1024 * 1024)).toFixed(1);
}

export default function ListYourCarForm() {
  const [hasBlueCard, setHasBlueCard] = useState(true);
  const [priceMode, setPriceMode] = useState<"min" | "custom">("min");
  const [customPrice, setCustomPrice] = useState("");
  const [fileSizes, setFileSizes] = useState<Record<string, number>>({});

  const totalPrice = priceMode === "min" ? 100 : Math.max(0, Number(customPrice) || 0);
  const driverShare = totalPrice > 0 ? totalPrice / 2 : 0;
  const platformShare = totalPrice > 0 ? totalPrice / 2 : 0;

  const totalBytes = useMemo(
    () => Object.values(fileSizes).reduce((sum, n) => sum + n, 0),
    [fileSizes]
  );
  const overLimit = totalBytes > MAX_TOTAL_BYTES;

  function handleFileChange(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setFileSizes((prev) => ({ ...prev, [field]: file ? file.size : 0 }));
    };
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (overLimit) {
      e.preventDefault();
    }
  }

  return (
    <form
      name="list-your-car"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      encType="multipart/form-data"
      action="/thank-you"
      onSubmit={handleSubmit}
      className="flex-1 max-w-xl bg-white border border-line rounded-2xl p-7 flex flex-col gap-7"
    >
      <input type="hidden" name="form-name" value="list-your-car" />
      <p className="hidden">
        <label>
          Don&rsquo;t fill this out: <input name="bot-field" />
        </label>
      </p>
      <input type="hidden" name="blue_card_status" value={hasBlueCard ? "Has Blue Card — uploaded" : "Does not have a Blue Card yet"} />
      <input type="hidden" name="price_mode" value={priceMode} />
      <input type="hidden" name="total_price" value={totalPrice ? totalPrice.toFixed(2) : ""} />
      <input type="hidden" name="driver_share" value={driverShare ? driverShare.toFixed(2) : ""} />
      <input type="hidden" name="platform_share" value={platformShare ? platformShare.toFixed(2) : ""} />

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
            <input className={fileInputClass} id="photo1" name="photo1" type="file" accept="image/*" required onChange={handleFileChange("photo1")} />
          </div>
          <div>
            <label className={labelClass} htmlFor="photo2">Photo 2 (required)</label>
            <input className={fileInputClass} id="photo2" name="photo2" type="file" accept="image/*" required onChange={handleFileChange("photo2")} />
          </div>
          <div>
            <label className={labelClass} htmlFor="photo3">
              Photo 3 — optional: proof you&rsquo;ve already driven a passenger to a formal
            </label>
            <input className={fileInputClass} id="photo3" name="photo3" type="file" accept="image/*" onChange={handleFileChange("photo3")} />
            <p className={hintClass}>No photo? No problem — we&rsquo;ll just use your first two.</p>
          </div>
        </div>
      </div>

      {/* Verification documents */}
      <div>
        <h2 className="font-serif text-[18px] mb-1">Verification documents</h2>
        <p className={`${hintClass} mb-3.5 mt-0`}>
          These are checked before your listing goes live — see our{" "}
          <a href="/verification-safety" className="underline font-semibold">Verification &amp; Safety</a> page.
        </p>
        <div className="flex flex-col gap-4">
          <div>
            <label className={labelClass} htmlFor="blue_card">Blue Card (Working with Children Check)</label>
            {hasBlueCard ? (
              <input
                className={fileInputClass}
                id="blue_card"
                name="blue_card"
                type="file"
                accept="image/*,.pdf"
                required={hasBlueCard}
                onChange={handleFileChange("blue_card")}
              />
            ) : (
              <div className="bg-amber-bg border border-amber/30 rounded-lg px-4 py-3.5 text-[13px] text-[#6b4a12] leading-relaxed">
                No worries — a Blue Card is required before your listing goes live. You can apply
                for one directly with Queensland Blue Card Services:{" "}
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
            <input className={fileInputClass} id="licence" name="licence" type="file" accept="image/*,.pdf" required onChange={handleFileChange("licence")} />
          </div>

          <div>
            <label className={labelClass} htmlFor="insurance">Insurance (Certificate of Currency)</label>
            <input className={fileInputClass} id="insurance" name="insurance" type="file" accept="image/*,.pdf" required onChange={handleFileChange("insurance")} />
          </div>
        </div>

        <div className={`mt-3 text-[12px] ${overLimit ? "text-red-600 font-semibold" : "text-muted"}`}>
          Total attachments: {formatMB(totalBytes)}MB / 8MB limit
          {overLimit && (
            <span className="block mt-1">
              That&rsquo;s over the limit — please use smaller photos/scans (most phones can
              export at a lower quality) before submitting.
            </span>
          )}
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

      <button
        type="submit"
        disabled={overLimit}
        className="bg-navy text-white rounded-xl py-3.5 font-bold text-[14.5px] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit Listing Request
      </button>
      <p className={hintClass}>
        We&rsquo;ll review your documents and email you once your Gold Verified listing is ready
        to go live.
      </p>
    </form>
  );
}
