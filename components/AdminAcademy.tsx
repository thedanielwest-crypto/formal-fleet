"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { docTitle, fmtDate, openDocument, pingAdminAlerts, type DriverDoc } from "@/lib/academy";

type Alert = { id: string; kind: string; title: string; body: string | null; read: boolean; emailed_at: string | null; created_at: string };
type Row = { user_id: string; name: string | null; email: string | null; car: string | null; steps_done: number; bookable: boolean; pending_docs: number; expiring_soon: number; last_activity: string | null };

/** Admin > Owner Academy: alerts, documents to verify, driver compliance and the booking lock. */
export default function AdminAcademy({ adminId }: { adminId: string }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [pending, setPending] = useState<DriverDoc[]>([]);
  const [lock, setLock] = useState(false);
  const [alertEmail, setAlertEmail] = useState("admin@fleetformal.com.au");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setErr(null);
    const [a, o, p, s] = await Promise.all([
      supabase.from("admin_alerts").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.rpc("academy_admin_overview"),
      supabase.from("driver_documents").select("*").eq("status", "pending").order("created_at"),
      supabase.from("academy_settings").select("*").eq("id", 1).maybeSingle(),
    ]);
    if (a.error || o.error || p.error) setErr(a.error?.message || o.error?.message || p.error?.message || null);
    setAlerts((a.data as Alert[]) ?? []);
    setRows((o.data as Row[]) ?? []);
    setPending((p.data as DriverDoc[]) ?? []);
    if (s.data) {
      setLock(!!s.data.enforce_booking_lock);
      setAlertEmail(s.data.alert_email);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const nameFor = (uid: string) => {
    const r = rows.find((x) => x.user_id === uid);
    return r?.name || r?.email || "Driver";
  };

  async function review(d: DriverDoc, status: "verified" | "rejected") {
    const note = notes[d.id]?.trim() || null;
    if (status === "rejected" && !note) return setErr("Add a short note so the driver knows what to fix.");
    const { error } = await supabase
      .from("driver_documents")
      .update({ status, admin_note: note, verified_by: adminId, verified_at: new Date().toISOString() })
      .eq("id", d.id);
    if (error) return setErr(error.message);
    load();
  }

  async function markAllRead() {
    await supabase.from("admin_alerts").update({ read: true }).eq("read", false);
    load();
  }

  async function toggleLock() {
    const next = !lock;
    if (next && !confirm("Turn on the booking lock? Cars whose owners haven't finished all 12 steps can no longer be invited or enquired about.")) return;
    const { error } = await supabase.from("academy_settings").update({ enforce_booking_lock: next, updated_at: new Date().toISOString() }).eq("id", 1);
    if (error) return setErr(error.message);
    setLock(next);
  }

  const unread = alerts.filter((a) => !a.read).length;
  const unemailed = alerts.filter((a) => !a.emailed_at).length;

  if (loading) return <p className="text-muted">Loading…</p>;

  return (
    <div className="grid gap-6">
      {err && <p className="text-red-600 text-[13.5px]">{err}</p>}

      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr] items-start">
        <section className="bg-white border border-line rounded-2xl p-6">
          <div className="flex justify-between items-center gap-2 flex-wrap">
            <h2 className="font-serif text-[19px]">Documents to verify ({pending.length})</h2>
            <a
              href="https://www.service.transport.qld.gov.au/personalisedtransportregister/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12.5px] underline text-gold-dark"
            >
              TMR public register ↗
            </a>
          </div>
          <p className="text-muted text-[12.5px] mt-1">Check DA and BHSL numbers on the TMR register before verifying.</p>
          {pending.length === 0 && <p className="text-muted text-[13.5px] mt-4">Nothing waiting. Nice.</p>}
          {pending.map((d) => (
            <div key={d.id} className="border-t border-line mt-4 pt-4">
              <div className="flex justify-between gap-3 flex-wrap">
                <div>
                  <div className="font-semibold text-[14px]">{nameFor(d.user_id)}: {docTitle(d.doc_type)}</div>
                  <div className="text-[12.5px] text-muted">
                    {[d.doc_number && `No. ${d.doc_number}`, d.expiry_date && `expires ${fmtDate(d.expiry_date)}`, `uploaded ${fmtDate(d.created_at)}`].filter(Boolean).join(" · ")}
                  </div>
                </div>
                {d.file_path && (
                  <button onClick={() => openDocument(d.file_path!).catch((e) => setErr(e.message))} className="px-3 py-1.5 rounded-lg border border-line text-[12.5px] font-semibold">
                    View file
                  </button>
                )}
              </div>
              <div className="flex gap-2 mt-3 flex-wrap">
                <input
                  placeholder="Note to driver (needed to reject)"
                  value={notes[d.id] ?? ""}
                  onChange={(e) => setNotes((n) => ({ ...n, [d.id]: e.target.value }))}
                  className="flex-1 min-w-[180px] border border-line rounded-lg px-3 py-2 text-[13px]"
                />
                <button onClick={() => review(d, "verified")} className="bg-[#1d7a4c] text-white rounded-lg px-4 py-2 font-bold text-[12.5px]">
                  Verify
                </button>
                <button onClick={() => review(d, "rejected")} className="bg-white border border-red-300 text-red-600 rounded-lg px-4 py-2 font-bold text-[12.5px]">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </section>

        <section className="bg-white border border-line rounded-2xl p-6">
          <div className="flex justify-between items-center gap-2 flex-wrap">
            <h2 className="font-serif text-[19px]">Alerts {unread > 0 && <span className="text-[13px] text-red-600">({unread} new)</span>}</h2>
            <div className="flex gap-3">
              {unemailed > 0 && (
                <button onClick={() => { pingAdminAlerts(); setTimeout(load, 2500); }} className="text-[12.5px] underline text-muted">
                  Retry emails
                </button>
              )}
              {unread > 0 && (
                <button onClick={markAllRead} className="text-[12.5px] underline text-muted">
                  Mark all read
                </button>
              )}
            </div>
          </div>
          <p className="text-muted text-[12.5px] mt-1">Also emailed to {alertEmail}.</p>
          <ul className="mt-3 max-h-[420px] overflow-y-auto">
            {alerts.length === 0 && <li className="text-muted text-[13.5px]">No alerts yet.</li>}
            {alerts.map((a) => (
              <li key={a.id} className="py-2.5 border-t border-line first:border-t-0 text-[13.5px]">
                <div className="flex gap-2 items-start">
                  {!a.read && <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />}
                  <div>
                    <div className="font-semibold">{a.title}</div>
                    <div className="text-[12px] text-muted">
                      {[a.body, fmtDate(a.created_at), a.emailed_at ? "emailed" : "not emailed yet"].filter(Boolean).join(" · ")}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="bg-white border border-line rounded-2xl p-6">
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <h2 className="font-serif text-[19px]">Driver compliance</h2>
          <label className="flex items-center gap-2.5 text-[13px] cursor-pointer">
            <span>
              Booking lock <span className="text-muted">({lock ? "on: only Bookable cars can be booked" : "off"})</span>
            </span>
            <button
              onClick={toggleLock}
              role="switch"
              aria-checked={lock}
              className={`w-11 h-6 rounded-full relative transition-colors ${lock ? "bg-[#1d7a4c]" : "bg-line"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${lock ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </label>
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-[13px] min-w-[620px]">
            <thead>
              <tr className="text-left bg-[#f8f6f0] font-serif font-extrabold text-[11.5px] uppercase tracking-[0.06em]">
                <th className="p-3">Driver</th>
                <th className="p-3">Car</th>
                <th className="p-3">Progress</th>
                <th className="p-3">Status</th>
                <th className="p-3">Last activity</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-3 text-muted">No owner accounts yet.</td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={r.user_id} className="border-t border-line">
                  <td className="p-3">
                    <div className="font-semibold">{r.name || "—"}</div>
                    <div className="text-muted text-[12px]">{r.email}</div>
                  </td>
                  <td className="p-3">{r.car || "—"}</td>
                  <td className="p-3">{r.steps_done}/12</td>
                  <td className="p-3">
                    {r.bookable ? (
                      <span className="px-2.5 py-1 rounded-full text-[11.5px] font-semibold bg-[#e7f4ec] text-[#2e8b57]">Bookable</span>
                    ) : r.pending_docs > 0 ? (
                      <span className="px-2.5 py-1 rounded-full text-[11.5px] font-semibold bg-amber-bg text-amber">{r.pending_docs} to verify</span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[11.5px] font-semibold bg-[#eef0f4] text-[#5d6878]">In progress</span>
                    )}
                    {r.expiring_soon > 0 && (
                      <span className="ml-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-semibold bg-red-50 text-red-600">{r.expiring_soon} expiring</span>
                    )}
                  </td>
                  <td className="p-3 text-muted">{r.last_activity ? fmtDate(r.last_activity) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
