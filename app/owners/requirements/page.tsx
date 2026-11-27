"use client";

import Link from "next/link";
import OwnerShell, { SignInPrompt, chipClass, useAcademyData } from "@/components/OwnerShell";
import DocUploader from "@/components/DocUploader";
import { Icon } from "@/components/BrandIcon";
import { DOC_TYPES, STEPS, fmtDate, stepState, type DriverDoc } from "@/lib/academy";
import { MODULES } from "@/lib/academyContent";

export default function RequirementsPage() {
  const { userId, attempts, docs, ready, reload } = useAcademyData();

  const latest = (key: string): DriverDoc | undefined =>
    docs.filter((d) => d.doc_type === key).sort((a, b) => b.created_at.localeCompare(a.created_at))[0];

  const trainingDone = MODULES.filter((m) => stepState(STEPS.find((s) => s.key === m.slug)!, attempts, docs).state === "done").length;

  const section = (who: "driver" | "car") => (
    <div className="bg-white border border-line rounded-2xl p-6">
      <div className="eyebrow !text-gold-dark !text-[11px] mb-1">{who === "driver" ? "You, the driver" : "Your car"}</div>
      {DOC_TYPES.filter((d) => d.who === who).map((d) => {
        const step = STEPS.find((s) => s.key === d.key);
        const st = step ? stepState(step, attempts, docs) : null;
        const last = latest(d.key);
        return (
          <div id={d.key} key={d.key} className="py-3.5 border-t border-[#f0ede4] first:border-t-0 scroll-mt-24">
            <div className="flex gap-3.5 items-center flex-wrap">
              <div className="w-[38px] h-[38px] shrink-0 rounded-[10px] bg-[#f6f1e1] text-gold-dark grid place-items-center">
                <Icon name={who === "driver" ? "id" : "car"} className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-[200px]">
                <div className="font-semibold text-[14px]">{d.title}</div>
                <div className="text-[12.5px] text-muted">
                  {d.source}
                  {d.links.map((l) => (
                    <span key={l.href}>
                      {" · "}
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-gold-dark underline">
                        {l.label}
                      </a>
                    </span>
                  ))}
                </div>
                {last?.status === "rejected" && last.admin_note && (
                  <div className="text-[12.5px] text-red-600 mt-1">Note from Fleet Formal: {last.admin_note}</div>
                )}
                {st?.state === "done" && last?.expiry_date && (
                  <div className="text-[12px] text-muted mt-0.5">Expires {fmtDate(last.expiry_date)}</div>
                )}
              </div>
              {userId && st && st.state !== "todo" && (
                <span className={`px-2.5 py-1 rounded-full text-[11.5px] font-semibold whitespace-nowrap ${chipClass[st.state]}`}>{st.label}</span>
              )}
              {userId && d.optional && (
                <span className={`px-2.5 py-1 rounded-full text-[11.5px] font-semibold ${last ? chipClass[last.status === "verified" ? "done" : last.status === "rejected" ? "rejected" : "review"] : chipClass.todo}`}>
                  {last ? (last.status === "verified" ? "✓ Verified" : last.status === "rejected" ? "Needs re-upload" : "In review") : "If needed"}
                </span>
              )}
              {userId && (st ? st.state !== "done" : last?.status !== "verified") && (
                <DocUploader userId={userId} docType={d.key} numberLabel={d.numberLabel} needsExpiry={d.needsExpiry} onDone={reload} />
              )}
            </div>
          </div>
        );
      })}
      {who === "driver" && (
        <div className="py-3.5 border-t border-[#f0ede4] flex gap-3.5 items-center flex-wrap">
          <div className="w-[38px] h-[38px] shrink-0 rounded-[10px] bg-[#f6f1e1] text-gold-dark grid place-items-center">
            <Icon name="graduate" className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="font-semibold text-[14px]">Anti-discrimination, sexual harassment &amp; disability training</div>
            <div className="text-[12.5px] text-muted">
              Required by law · done here on Fleet Formal ·{" "}
              <a href="https://www.tmr.qld.gov.au/business-industry/taxi-and-limousine/industry-information/personalised-transport-industry-driver-training" target="_blank" rel="noopener noreferrer" className="text-gold-dark underline">
                TMR rules
              </a>
            </div>
          </div>
          {userId && (
            <span className={`px-2.5 py-1 rounded-full text-[11.5px] font-semibold ${trainingDone === MODULES.length ? chipClass.done : chipClass.review}`}>
              {trainingDone} of {MODULES.length} done
            </span>
          )}
          <Link href="/owners/training" className="px-3.5 py-2 rounded-lg border border-line bg-white font-semibold text-[12.5px]">
            Go to training
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <OwnerShell>
      <h2 className="font-display text-[26px]">Requirements &amp; official documents</h2>
      <p className="text-muted text-[14.5px] mt-1 mb-5">
        Every requirement, who it&apos;s from, and the right form. Upload proof as you go. It&apos;s saved privately to your
        profile and only Fleet Formal admins can see it. We usually check uploads within 2 business days.
      </p>
      {!userId && ready && (
        <div className="mb-5">
          <SignInPrompt what="upload your documents" />
        </div>
      )}
      <div className="grid gap-5 lg:grid-cols-2 items-start">
        {section("driver")}
        {section("car")}
      </div>
      <div className="bg-[#f6f1e1] border border-line rounded-2xl p-5 mt-5">
        <div className="font-serif font-extrabold text-[14px]">Club rego or left-hand drive? You can still earn from Film &amp; Advertising</div>
        <p className="text-muted text-[13px] leading-relaxed mt-1.5 mb-3">
          Special interest (club) rego{" "}
          <a href="https://www.qld.gov.au/transport/registration/costs/concession/special-interest/restrictions" target="_blank" rel="noopener noreferrer" className="text-gold-dark underline">
            can&apos;t be used for booked hire
          </a>
          , and left-hand-drive cars are banned from paid passenger work. Those cars skip the passenger licences and list for
          film, TV and advertising shoots instead.
        </p>
        <Link href="/owners/costs#film-only" className="btn-gold !py-2.5 !px-4 !text-[12px]">
          See film costs &amp; earnings
        </Link>
      </div>
    </OwnerShell>
  );
}
