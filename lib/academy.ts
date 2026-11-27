import { supabase } from "@/lib/supabaseClient";
import { MODULES, type TrainingModule } from "@/lib/academyContent";

/** Owner Academy: the 12 steps an owner-driver completes before taking paid passenger bookings. */

export type StepGroup = "learn" | "licence";
export type Step = {
  key: string; // training module slug or document type
  group: StepGroup;
  title: string;
  detail: string;
  href: string;
  icon: "document" | "graduate" | "id" | "car" | "shield" | "clipboard";
};

export const DOC_TYPES: {
  key: string;
  title: string;
  who: "driver" | "car";
  source: string;
  needsExpiry: boolean;
  numberLabel?: string;
  links: { label: string; href: string }[];
  optional?: boolean;
}[] = [
  {
    key: "driver_authorisation",
    title: "Driver Authorisation: Booked hire/taxi (BHTX)",
    who: "driver",
    source: "Required by law · TMR · from $233.40",
    needsExpiry: true,
    numberLabel: "Authorisation number",
    links: [
      { label: "Eligibility", href: "https://www.tmr.qld.gov.au/licensing/driver-authorisations/eligibility-and-suitability/eligibility-to-apply-for-driver-authorisation-and-suitability-requirements" },
      { label: "How to apply", href: "https://www.tmr.qld.gov.au/licensing/driver-authorisations/how-to-apply-renew-change-or-surrender" },
      { label: "Fees", href: "https://www.tmr.qld.gov.au/licensing/driver-authorisations/driver-authorisation-categories" },
    ],
  },
  {
    key: "blue_card",
    title: "Blue card (Working with Children Check)",
    who: "driver",
    source: "Fleet Formal requirement · $108.30 · 3 years",
    needsExpiry: true,
    numberLabel: "Card number",
    links: [
      { label: "Apply", href: "https://www.qld.gov.au/jobs/blue-card/applications/apply" },
      { label: "Fees", href: "https://www.qld.gov.au/jobs/blue-card/applications/payment" },
    ],
  },
  {
    key: "abn_gst",
    title: "ABN + GST registration",
    who: "driver",
    source: "Required by law · ATO · free · before your first trip",
    needsExpiry: false,
    numberLabel: "ABN",
    links: [
      { label: "ATO ride-sourcing rules", href: "https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/sharing-economy-and-tax/ride-sourcing/registrations" },
    ],
  },
  {
    key: "bhsl",
    title: "Booked Hire Service Licence (BHSL)",
    who: "car",
    source: "Required by law · TMR · $294.50 · 12 months",
    needsExpiry: true,
    numberLabel: "Licence number",
    links: [
      { label: "About", href: "https://www.tmr.qld.gov.au/bhsl" },
      { label: "Apply online", href: "https://www.service.transport.qld.gov.au/applyforbookedhirevehiclelicence/" },
      { label: "F5189 paper form", href: "https://www.support.transport.qld.gov.au/qt/formsdat.nsf/forms/QF5189" },
    ],
  },
  {
    key: "rego_bkhr",
    title: "Rego: Booked Hire purpose of use + CTP Class 26",
    who: "car",
    source: "Required by law · upload your rego certificate or CTP change-of-class letter",
    needsExpiry: true,
    numberLabel: "Plate number",
    links: [
      { label: "Vehicle requirements", href: "https://www.tmr.qld.gov.au/business-industry/taxi-and-limousine/industry-information/booked-hire/vehicle-requirements-for-a-booked-hire-service-licence" },
      { label: "Compare CTP prices", href: "https://maic.qld.gov.au/resources/compare-pricing-tool/" },
    ],
  },
  {
    key: "coi",
    title: "Certificate of Inspection (COI)",
    who: "car",
    source: "Required by law · yearly · Approved Inspection Station",
    needsExpiry: true,
    links: [{ label: "About COIs", href: "https://www.qld.gov.au/transport/buying/vehicleinspection/periodicinspection/about" }],
  },
  {
    key: "insurance",
    title: "Insurance covering paid passengers",
    who: "car",
    source: "Fleet Formal requirement · certificate of currency from your insurer",
    needsExpiry: true,
    links: [],
  },
  {
    key: "operator_consent",
    title: "F5190 Registered operator consent",
    who: "car",
    source: "Only if the car isn't registered in your name",
    needsExpiry: false,
    optional: true,
    links: [{ label: "Form F5190", href: "https://www.support.transport.qld.gov.au/qt/formsdat.nsf/Forms/QF5190" }],
  },
];

export const docTitle = (key: string) => {
  if (key.startsWith("certificate:")) {
    const m = MODULES.find((x) => x.slug === key.slice(12));
    return m ? `Certificate: ${m.title}` : "Certificate";
  }
  return DOC_TYPES.find((d) => d.key === key)?.title ?? key.replace(/_/g, " ");
};

export const STEPS: Step[] = [
  { key: "start-here", group: "learn", title: "Read the Start here guide", detail: "10 min · what to do, in order", href: "/owners/start", icon: "document" },
  ...MODULES.map((m: TrainingModule) => ({
    key: m.slug,
    group: "learn" as const,
    title: `Training ${m.num}: ${m.title}`,
    detail: `${m.required === "TMR" ? "Required by TMR" : "Fleet Formal standard"} · ${m.minutes} min + quiz`,
    href: `/owners/module?m=${m.slug}`,
    icon: "graduate" as const,
  })),
  { key: "blue_card", group: "licence", title: "Blue card (Working with Children Check)", detail: "Fleet Formal requirement · $108.30 · 3 years", href: "/owners/requirements#blue_card", icon: "id" },
  { key: "driver_authorisation", group: "licence", title: "Driver Authorisation (Booked hire/taxi)", detail: "TMR · from $233.40", href: "/owners/requirements#driver_authorisation", icon: "id" },
  { key: "coi", group: "licence", title: "Certificate of Inspection", detail: "Approved Inspection Station · yearly", href: "/owners/requirements#coi", icon: "car" },
  { key: "rego_bkhr", group: "licence", title: "Rego changed to Booked Hire + CTP Class 26", detail: "Ask your CTP insurer for a change-of-class letter", href: "/owners/requirements#rego_bkhr", icon: "car" },
  { key: "bhsl", group: "licence", title: "Booked Hire Service Licence (BHSL)", detail: "TMR · $294.50 · 12 months", href: "/owners/requirements#bhsl", icon: "car" },
  { key: "insurance", group: "licence", title: "Insurance that covers paid passengers", detail: "Certificate of currency from your insurer", href: "/owners/requirements#insurance", icon: "shield" },
  { key: "abn_gst", group: "licence", title: "ABN + GST registration", detail: "ATO · free · required before your first trip", href: "/owners/requirements#abn_gst", icon: "clipboard" },
];

export type Attempt = {
  id: string;
  module_slug: string;
  module_version: number;
  score: number;
  total: number;
  passed: boolean;
  created_at: string;
};
export type DriverDoc = {
  id: string;
  user_id: string;
  doc_type: string;
  file_path: string | null;
  file_name: string | null;
  doc_number: string | null;
  expiry_date: string | null;
  status: "pending" | "verified" | "rejected";
  admin_note: string | null;
  created_at: string;
};

export type StepState = "done" | "review" | "rejected" | "expired" | "progress" | "todo";

const THREE_YEARS_MS = 3 * 365.25 * 24 * 3600 * 1000;

/** A training pass counts if it's on the module's current version and less than 3 years old. */
export function currentPass(attempts: Attempt[], slug: string): Attempt | null {
  const version = slug === "start-here" ? 1 : MODULES.find((m) => m.slug === slug)?.version ?? 1;
  return (
    attempts
      .filter((a) => a.module_slug === slug && a.passed && a.module_version === version)
      .filter((a) => slug === "start-here" || Date.now() - new Date(a.created_at).getTime() < THREE_YEARS_MS)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))[0] ?? null
  );
}

export function stepState(step: Step, attempts: Attempt[], docs: DriverDoc[]): { state: StepState; label: string } {
  if (step.group === "learn") {
    const pass = currentPass(attempts, step.key);
    if (pass) return { state: "done", label: pass.total ? `✓ Passed ${pass.score}/${pass.total}` : "✓ Done" };
    const old = attempts.find((a) => a.module_slug === step.key && a.passed);
    if (old) return { state: "expired", label: "Refresh needed" };
    if (attempts.some((a) => a.module_slug === step.key)) return { state: "progress", label: "Not passed yet" };
    return { state: "todo", label: "To do" };
  }
  const mine = docs
    .filter((d) => d.doc_type === step.key)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
  const today = new Date().toISOString().slice(0, 10);
  const valid = mine.find((d) => d.status === "verified" && (!d.expiry_date || d.expiry_date >= today));
  if (valid) return { state: "done", label: "✓ Verified" };
  const latest = mine[0];
  if (!latest) return { state: "todo", label: "To do" };
  if (latest.status === "pending") return { state: "review", label: "Uploaded · in review" };
  if (latest.status === "rejected") return { state: "rejected", label: "Needs re-upload" };
  return { state: "expired", label: "Expired" };
}

export async function loadAcademy(userId: string) {
  const [att, docs] = await Promise.all([
    supabase.from("training_attempts").select("id,module_slug,module_version,score,total,passed,created_at").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase.from("driver_documents").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
  ]);
  return {
    attempts: (att.data as Attempt[]) ?? [],
    docs: (docs.data as DriverDoc[]) ?? [],
    error: att.error?.message || docs.error?.message || null,
  };
}

/** Ask the owner-alert function to email any new alerts. Never blocks the UI. */
export function pingAdminAlerts() {
  supabase.functions.invoke("owner-alert", { body: {} }).catch(() => {});
}

export async function uploadDocument(
  userId: string,
  docType: string,
  file: File,
  meta: { doc_number?: string; expiry_date?: string }
) {
  const ext = (file.name.split(".").pop() || "pdf").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${userId}/${docType}-${Date.now()}.${ext}`;
  const up = await supabase.storage.from("driver-docs").upload(path, file, { contentType: file.type || undefined });
  if (up.error) throw new Error(up.error.message);
  const { error } = await supabase.from("driver_documents").insert({
    user_id: userId,
    doc_type: docType,
    file_path: path,
    file_name: file.name,
    doc_number: meta.doc_number || null,
    expiry_date: meta.expiry_date || null,
  });
  if (error) throw new Error(error.message);
  pingAdminAlerts();
}

export async function openDocument(path: string) {
  const { data, error } = await supabase.storage.from("driver-docs").createSignedUrl(path, 120);
  if (error || !data) throw new Error(error?.message || "Couldn't open the file");
  window.open(data.signedUrl, "_blank", "noopener");
}

export const fmtDate = (iso: string | null) =>
  iso ? new Date(iso.length === 10 ? iso + "T00:00:00" : iso).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" }) : "";

/** Build the certificate PDF in the browser, save it to the driver's documents. */
export async function issueCertificate(opts: {
  userId: string;
  attemptId: string;
  name: string;
  module: TrainingModule;
  score: number;
  total: number;
  daNumber: string;
}) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = 297, H = 210;
  doc.setFillColor(1, 19, 38);
  doc.rect(0, 0, W, H, "F");
  doc.setFillColor(255, 255, 255);
  doc.rect(10, 10, W - 20, H - 20, "F");
  doc.setDrawColor(212, 169, 55);
  doc.setLineWidth(1.2);
  doc.rect(15, 15, W - 30, H - 30);
  doc.setTextColor(1, 19, 38);
  doc.setFont("helvetica", "bolditalic");
  doc.setFontSize(26);
  doc.text("FLEET FORMAL", W / 2, 42, { align: "center" });
  doc.setTextColor(168, 130, 31);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("OWNER ACADEMY  ·  CERTIFICATE OF COMPLETION", W / 2, 52, { align: "center" });
  doc.setTextColor(43, 43, 43);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.text("This certifies that", W / 2, 72, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(168, 130, 31);
  doc.text(opts.name || "Fleet Formal driver", W / 2, 88, { align: "center" });
  doc.setTextColor(43, 43, 43);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.text("has completed and passed", W / 2, 102, { align: "center" });
  doc.setFont("helvetica", "bolditalic");
  doc.setFontSize(20);
  doc.setTextColor(1, 19, 38);
  doc.text(`Training ${opts.module.num}: ${opts.module.title}`.toUpperCase(), W / 2, 118, { align: "center", maxWidth: W - 60 });
  const issued = new Date();
  const renew = new Date(issued.getTime() + THREE_YEARS_MS);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(90, 90, 90);
  const lines = [
    `Score ${opts.score}/${opts.total}  ·  Issued ${fmtDate(issued.toISOString())}  ·  Renew by ${fmtDate(renew.toISOString())}`,
    `Driver Authorisation no. ${opts.daNumber || "not provided"}  ·  Module version ${opts.module.version}  ·  Record ${opts.attemptId.slice(0, 8)}`,
    opts.module.required === "TMR"
      ? "Meets the Queensland Personalised Transport Required Driver Training Notice (section 97, Transport Operations (Passenger Transport) Regulation 2018)."
      : "Fleet Formal driver standard. Delivered online by Fleet Formal.",
  ];
  lines.forEach((l, i) => doc.text(l, W / 2, 142 + i * 8, { align: "center", maxWidth: W - 50 }));
  doc.setTextColor(168, 130, 31);
  doc.setFont("helvetica", "bold");
  doc.text("fleetformal.com", W / 2, 180, { align: "center" });

  const blob = doc.output("blob");
  const fileName = `Fleet-Formal-Certificate-${opts.module.slug}.pdf`;
  const path = `${opts.userId}/certificates/${opts.module.slug}-${Date.now()}.pdf`;
  const up = await supabase.storage.from("driver-docs").upload(path, blob, { contentType: "application/pdf" });
  if (up.error) throw new Error(up.error.message);
  const { error } = await supabase.rpc("attach_certificate", { p_attempt: opts.attemptId, p_file_path: path, p_file_name: fileName });
  if (error) throw new Error(error.message);
  return { blob, fileName };
}
