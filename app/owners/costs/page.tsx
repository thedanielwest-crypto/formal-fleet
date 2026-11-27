"use client";

import { useState } from "react";
import OwnerShell from "@/components/OwnerShell";
import { Icon } from "@/components/BrandIcon";

const SHARE = 0.75;
/** New yearly costs for passenger bookings: BHSL $294.50 + Driver Authorisation $233.40 + blue card $108.30 + inspection ~$120. */
const LICENCES = 756;
const FILM_TRANSPORT = 250;

const TYPES = {
  formal: { label: "School formals", rate: 350, hrs: 2, step: 25, noun: "formal", licences: true },
  wedding: { label: "Weddings", rate: 1000, hrs: 3, step: 50, noun: "wedding", licences: true },
  film: { label: "Film & Advertising", rate: 1000, hrs: 5, step: 50, noun: "shoot", licences: false },
  scenic: { label: "Scenic drives", rate: 500, hrs: 3, step: 25, noun: "scenic drive", licences: true },
} as const;
type TypeKey = keyof typeof TYPES;

const money = (n: number) => (n < 0 ? "−" : "") + "$" + Math.abs(Math.round(n)).toLocaleString("en-AU");
const Est = ({ children = "est." }: { children?: string }) => (
  <span className="text-amber text-[11px] font-semibold ml-1">{children}</span>
);

function Slider(props: { label: React.ReactNode; min: number; max: number; step?: number; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block mt-4">
      <span className="text-[12.5px] text-white/70">{props.label}</span>
      <input
        type="range"
        min={props.min}
        max={props.max}
        step={props.step ?? 1}
        value={props.value}
        onChange={(e) => props.onChange(Number(e.target.value))}
        className="w-full mt-1.5 accent-[var(--gold)]"
      />
    </label>
  );
}

function Rows({ rows }: { rows: [React.ReactNode, React.ReactNode, ("neg" | "pos" | "")?][] }) {
  return (
    <div className="mt-3">
      {rows.map(([k, v, tone], i) => (
        <div key={i} className="flex justify-between gap-3 py-2 border-b border-white/10 last:border-0 text-[14px]">
          <span>{k}</span>
          <b className={tone === "neg" ? "text-[#f0a3a3]" : tone === "pos" ? "text-[#8fd6a8]" : ""}>{v}</b>
        </div>
      ))}
    </div>
  );
}

export default function CostsPage() {
  const [type, setType] = useState<TypeKey>("formal");
  const t = TYPES[type];
  const [rate, setRate] = useState<number>(t.rate);
  const [hrs, setHrs] = useState<number>(t.hrs);
  const [trips, setTrips] = useState(3);

  const [fRate, setFRate] = useState(1000);
  const [fHrs, setFHrs] = useState(5);
  const [fTrips, setFTrips] = useState(3);

  function pickType(k: TypeKey) {
    setType(k);
    setRate(TYPES[k].rate);
    setHrs(TYPES[k].hrs);
  }

  const gross = trips * hrs * rate;
  const share = gross * SHARE;
  const cost = t.licences ? LICENCES : 0;
  const net = share - cost;
  const per = hrs * rate * SHARE;
  const breakEven = Math.ceil(cost / per);
  const max = Math.max(share, cost, 1) * 1.1;

  const fGross = fTrips * fHrs * fRate;
  const fShare = fGross * SHARE;
  const fCost = fTrips * FILM_TRANSPORT;

  return (
    <OwnerShell>
      <h2 className="font-display text-[26px]">Rego compared: what changes for your car</h2>
      <p className="text-muted text-[14.5px] mt-1 mb-5">
        Example: a V8 classic, 12-month Queensland rego, fees as at 1 October 2026. Only Booked Hire lets you take
        paid passenger bookings (formals, weddings, scenic drives).
      </p>
      <div className="bg-white border border-line rounded-2xl overflow-x-auto">
        <table className="w-full text-[13.5px] min-w-[680px]">
          <thead>
            <tr className="bg-[#f8f6f0] text-left font-serif font-extrabold text-[12px] uppercase tracking-[0.06em]">
              <th className="p-3.5 w-[30%]"></th>
              <th className="p-3.5">Normal private rego</th>
              <th className="p-3.5">Club rego (special interest)</th>
              <th className="p-3.5 bg-midnight text-gold">Booked Hire + BHSL</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Registration fee", "$854.70", "$108.60", "$854.70"],
              ["Traffic improvement fee", "$67.25", "$67.25", <>~$73.00<Est /></>],
              ["Insurance (CTP)", "$411.80–$427.80 (Class 1)", <>$500<Est>example</Est></>, <>~$560–$690 (Class 26)<Est /></>],
              ["Booked Hire Service Licence", "—", "—", "$294.50"],
              ["Driver Authorisation (year 1)", "—", "—", "$233.40"],
              ["Blue card (lasts 3 years)", "—", "—", "$108.30"],
              ["Safety inspection (COI)", "—", "—", <>~$120<Est /></>],
              ["What Fleet Formal bookings you can take", "Film & Advertising", "Film & Advertising only (see below)", "Everything: formals, weddings, scenic drives, film"],
            ].map((r, i) => (
              <tr key={i} className="border-t border-[#efece3] align-top">
                <td className="p-3.5">{r[0]}</td>
                <td className="p-3.5">{r[1]}</td>
                <td className="p-3.5">{r[2]}</td>
                <td className="p-3.5 bg-[#fffaf0] font-semibold">{r[3]}</td>
              </tr>
            ))}
            <tr className="border-t border-[#efece3] font-extrabold text-[14.5px]">
              <td className="p-3.5">Year-one total</td>
              <td className="p-3.5">~$1,340</td>
              <td className="p-3.5">~$676<Est>example</Est></td>
              <td className="p-3.5 bg-[#fffaf0]">~$2,310<Est /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-[12px] text-muted leading-relaxed mt-3">
        <b>How we count costs:</b> you&apos;d register your car anyway, so the calculator only counts the <b>new</b> licences and
        checks for passenger bookings: BHSL $294.50 + Driver Authorisation $233.40 + blue card $108.30 + inspection ~$120 ={" "}
        <b>~$756 a year</b>. Sources:{" "}
        <a className="text-gold-dark underline" href="https://www.qld.gov.au/transport/registration/costs/fees" target="_blank" rel="noopener noreferrer">TMR registration fees</a> ·{" "}
        <a className="text-gold-dark underline" href="https://www.tmr.qld.gov.au/business-industry/taxi-and-limousine/industry-information/fees" target="_blank" rel="noopener noreferrer">TMR personalised transport fees</a> ·{" "}
        <a className="text-gold-dark underline" href="https://www.tmr.qld.gov.au/licensing/driver-authorisations/driver-authorisation-categories" target="_blank" rel="noopener noreferrer">Driver Authorisation fees</a> ·{" "}
        <a className="text-gold-dark underline" href="https://www.qld.gov.au/jobs/blue-card/applications/payment" target="_blank" rel="noopener noreferrer">Blue card fees</a>. Figures marked
        &quot;est.&quot; are estimates: get your exact price from the{" "}
        <a className="text-gold-dark underline" href="https://www.service.transport.qld.gov.au/quoteforregistration" target="_blank" rel="noopener noreferrer">TMR rego quote tool</a> and{" "}
        <a className="text-gold-dark underline" href="https://maic.qld.gov.au/resources/compare-pricing-tool/" target="_blank" rel="noopener noreferrer">MAIC CTP tool</a>.
      </p>

      <h2 className="font-display text-[26px] mt-10">What could you make?</h2>
      <p className="text-muted text-[14.5px] mt-1 mb-5">
        Pick a booking type and set your rate. You can charge more than the starting rate, never less. You keep 75%, the
        other 25% is split between school gratuities and BEA operational costs.
      </p>
      <div className="relative overflow-hidden bg-midnight text-white rounded-[20px] p-6 grid gap-6 md:grid-cols-2">
        <div>
          <div className="eyebrow !text-[11px]">Earnings calculator</div>
          <div className="text-[12.5px] text-white/70 mt-4 mb-1.5">Booking type</div>
          <div className="flex flex-wrap gap-1 bg-white/[0.08] rounded-[10px] p-1">
            {(Object.keys(TYPES) as TypeKey[]).map((k) => (
              <button
                key={k}
                onClick={() => pickType(k)}
                className={`flex-1 basis-[40%] rounded-lg py-2.5 text-[12.5px] font-semibold ${type === k ? "bg-gold text-midnight" : "text-white/75"}`}
              >
                {TYPES[k].label}
              </button>
            ))}
          </div>
          <Slider
            label={<>Your hourly rate: <b className="text-white">{money(rate)}</b> <span className="text-white/50">(starts at {money(t.rate)})</span></>}
            min={t.rate}
            max={t.rate * 3}
            step={t.step}
            value={rate}
            onChange={setRate}
          />
          <Slider
            label={<>Hours per booking: <b className="text-white">{hrs}</b> <span className="text-white/50">(minimum {t.hrs})</span></>}
            min={t.hrs}
            max={t.hrs + 7}
            value={hrs}
            onChange={setHrs}
          />
          <Slider label={<>Bookings per year: <b className="text-white">{trips}</b></>} min={1} max={12} value={trips} onChange={setTrips} />
          <div className="flex items-end gap-2.5 h-[120px] mt-4 mb-6">
            {[
              ["Your share", share, "var(--gold)"],
              ["Licences", cost, "#f0a3a3"],
              ["Profit", Math.max(net, 0), "#8fd6a8"],
            ].map(([l, v, c]) => (
              <div key={l as string} className="flex-1 rounded-t-lg relative min-h-1" style={{ height: `${((v as number) / max) * 100}%`, background: c as string }}>
                <span className="absolute -bottom-5 inset-x-0 text-center text-[11px] text-white/60">{l as string}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[12.5px] text-white/65">Your estimated profit per year</div>
          <div className="font-display text-[46px] leading-none mt-1" style={{ color: net >= 0 ? "var(--gold)" : "#f0a3a3" }}>
            {money(net)}
          </div>
          <Rows
            rows={[
              [<>Bookings: {trips} × {hrs} hrs × {money(rate)}</>, money(gross)],
              ["Schools & BEA costs 25%", "−" + money(gross - share), "neg"],
              ["Your 75% share", money(share), "pos"],
              [t.licences ? <>New licences &amp; checks <span className="text-gold-light text-[11px]">est.</span></> : "Licences (none needed for film)", t.licences ? "−" + money(cost) : "$0", "neg"],
              [`Each extra ${t.noun} adds`, "+" + money(per), "pos"],
            ]}
          />
          <p className="text-[13px] text-white/75 mt-3 leading-relaxed">
            {t.licences ? (
              net >= 0 ? (
                <>You cover your licences after <b>{breakEven} {t.noun}{breakEven > 1 ? "s" : ""}</b>. Every {t.noun} after that is about <b>{money(per)}</b> in your pocket.</>
              ) : (
                <>You&apos;d cover your licences at <b>{breakEven} {t.noun}s</b> a year.</>
              )
            ) : (
              <>No passenger licences are needed for film work, so every shoot is about <b>{money(per)}</b> in your pocket.</>
            )}
          </p>
          <p className="text-[11.5px] text-white/50 mt-2.5">
            Before income tax and GST. Rego isn&apos;t counted because you&apos;d pay it anyway. Year two is cheaper: no
            criminal check fee, and the blue card lasts 3 years.
          </p>
        </div>
      </div>

      <section id="film-only" className="mt-12 scroll-mt-24">
        <div className="eyebrow !text-gold-dark !text-[11px]">Club rego or left-hand drive?</div>
        <h2 className="font-display text-[26px] mt-1">Film &amp; Advertising only</h2>
        <p className="text-muted text-[14.5px] mt-1 mb-5">
          Cars on special interest (club) rego and left-hand-drive cars can&apos;t take passenger bookings. They can still earn
          from film, TV and advertising shoots, where the car is the star and nobody rides as a paying passenger.
        </p>
        <div className="grid gap-5 md:grid-cols-2 items-start">
          <div className="bg-white border border-line rounded-2xl p-6">
            <div className="font-serif font-extrabold text-[15px] mb-1">The rules</div>
            {[
              {
                icon: "car" as const,
                t: "Club rego cars",
                d: (
                  <>
                    Queensland&apos;s club rego conditions say the car can&apos;t be used for hire or reward. So it isn&apos;t driven to
                    the shoot: it goes on a trailer or tilt tray and is filmed on private property or a closed set.{" "}
                    <a className="text-gold-dark underline" href="https://www.qld.gov.au/transport/registration/costs/concession/special-interest/restrictions" target="_blank" rel="noopener noreferrer">
                      Club rego conditions
                    </a>
                  </>
                ),
                chip: ["Confirm with TMR", "bg-amber-bg text-amber"],
              },
              { icon: "car" as const, t: "Left-hand-drive cars", d: "Banned from passenger work only. On full rego you can drive to set. Tell your insurer it's commercial use.", chip: ["Film OK", "bg-[#e7f4ec] text-[#2e8b57]"] },
              { icon: "document" as const, t: "What you'll need", d: "ABN for invoicing · insurer OK for film use · certificate of currency (productions often ask for public liability) · Training 3: Respect & privacy" },
              { icon: "shield" as const, t: "Not needed", d: "No Booked Hire Service Licence, Driver Authorisation, blue card or inspection, because there are no passengers." },
            ].map((r) => (
              <div key={r.t} className="flex gap-3.5 items-center py-3.5 border-t border-[#f0ede4] first:border-t-0 flex-wrap">
                <div className="w-[38px] h-[38px] shrink-0 rounded-[10px] bg-[#f6f1e1] text-gold-dark grid place-items-center">
                  <Icon name={r.icon} className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <div className="font-semibold text-[14px]">{r.t}</div>
                  <div className="text-[12.5px] text-muted leading-relaxed">{r.d}</div>
                </div>
                {r.chip && <span className={`px-2.5 py-1 rounded-full text-[11.5px] font-semibold whitespace-nowrap ${r.chip[1]}`}>{r.chip[0]}</span>}
              </div>
            ))}
          </div>
          <div>
            <div className="bg-white border border-line rounded-2xl overflow-hidden mb-4">
              <table className="w-full text-[13.5px]">
                <thead>
                  <tr className="bg-[#f8f6f0] text-left font-serif font-extrabold text-[12px] uppercase tracking-[0.06em]">
                    <th className="p-3.5">Costs (club rego example)</th>
                    <th className="p-3.5 text-right">Per year</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-[#efece3]">
                    <td className="p-3.5">Club rego + $500 insurance <span className="text-muted text-[12px]">(you pay this anyway, so it&apos;s not counted)</span></td>
                    <td className="p-3.5 text-right whitespace-nowrap">~$676</td>
                  </tr>
                  <tr className="border-t border-[#efece3]">
                    <td className="p-3.5">Licences and checks</td>
                    <td className="p-3.5 text-right">$0</td>
                  </tr>
                  <tr className="border-t border-[#efece3]">
                    <td className="p-3.5">Transport to set (trailer or tilt tray)<Est /></td>
                    <td className="p-3.5 text-right whitespace-nowrap">~$250 per shoot</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-midnight text-white rounded-[20px] p-6">
              <div className="eyebrow !text-[11px]">Film &amp; Advertising earnings</div>
              <Slider label={<>Hourly rate: <b className="text-white">{money(fRate)}</b> <span className="text-white/50">(starts at $1,000)</span></>} min={1000} max={3000} step={50} value={fRate} onChange={setFRate} />
              <Slider label={<>Hours per shoot: <b className="text-white">{fHrs}</b> <span className="text-white/50">(minimum 5)</span></>} min={5} max={12} value={fHrs} onChange={setFHrs} />
              <Slider label={<>Shoots per year: <b className="text-white">{fTrips}</b></>} min={1} max={12} value={fTrips} onChange={setFTrips} />
              <Rows
                rows={[
                  [<>{fTrips} × {fHrs} hrs × {money(fRate)}</>, money(fGross)],
                  ["Schools & BEA costs 25%", "−" + money(fGross - fShare), "neg"],
                  ["Your 75% share", money(fShare), "pos"],
                  [<>Transport to set <span className="text-gold-light text-[11px]">est.</span></>, "−" + money(fCost), "neg"],
                  [<b key="p">Your profit per year</b>, <span key="v" className="font-display text-gold text-[22px]">{money(fShare - fCost)}</span>],
                ]}
              />
            </div>
          </div>
        </div>
      </section>
    </OwnerShell>
  );
}
