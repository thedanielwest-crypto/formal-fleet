// owner-alert: emails Owner Academy alerts (training passed, document uploaded)
// to the address in academy_settings.alert_email (admin@fleetformal.com.au).
//
// Called by the site after a driver passes a module or uploads a document.
// It sends every alert that hasn't been emailed yet, so a missed call is
// picked up by the next one. Alerts always show in /admin either way.
//
// Needs the secret RESEND_API_KEY (resend.com). Optional: ALERT_FROM, e.g.
// "Fleet Formal <alerts@fleetformal.com.au>" (the domain must be verified in Resend).
import { createClient } from "jsr:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const url = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Only signed-in users can trigger a send.
  const userClient = createClient(url, anonKey, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
  });
  const { data: userData } = await userClient.auth.getUser();
  if (!userData?.user) return json({ error: "not_signed_in" }, 401);

  const db = createClient(url, serviceKey);
  const { data: settings } = await db.from("academy_settings").select("alert_email").eq("id", 1).maybeSingle();
  const to = settings?.alert_email || "admin@fleetformal.com.au";

  const { data: alerts, error } = await db
    .from("admin_alerts")
    .select("id, kind, title, body, created_at")
    .is("emailed_at", null)
    .order("created_at", { ascending: true })
    .limit(20);
  if (error) return json({ error: error.message }, 500);
  if (!alerts || alerts.length === 0) return json({ sent: 0 });

  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) return json({ sent: 0, pending: alerts.length, reason: "no_email_provider" });
  const from = Deno.env.get("ALERT_FROM") || "Fleet Formal <alerts@fleetformal.com.au>";

  let sent = 0;
  for (const a of alerts) {
    const when = new Date(a.created_at).toLocaleString("en-AU", { timeZone: "Australia/Brisbane" });
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;border:1px solid #e5e5e5;border-radius:12px;overflow:hidden">
        <div style="background:#011326;color:#d4a937;padding:16px 20px;font-weight:900;font-style:italic;text-transform:uppercase;letter-spacing:.04em">
          Fleet Formal · Owner Academy alert
        </div>
        <div style="padding:20px;color:#2b2b2b">
          <p style="font-size:16px;margin:0 0 8px"><b>${esc(a.title)}</b></p>
          ${a.body ? `<p style="margin:0 0 8px;color:#6b7280">${esc(a.body)}</p>` : ""}
          <p style="margin:0 0 18px;color:#6b7280;font-size:13px">${esc(when)}</p>
          <a href="https://fleetformal.com/admin" style="background:#d4a937;color:#011326;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:bold">Review in Admin</a>
        </div>
      </div>`;
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject: `Owner Academy: ${a.title}`, html }),
    });
    if (res.ok) {
      await db.from("admin_alerts").update({ emailed_at: new Date().toISOString() }).eq("id", a.id);
      sent++;
    }
  }
  return json({ sent, pending: alerts.length - sent });
});
