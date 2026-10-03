import { database, settings } from "./storage";
import { monitor } from "./feeds";
import { getArea } from "./locations";
export async function evaluateProfile(profile: any, data: any) {
  if (!profile.enabled) return 0;
  let count = 0;
  const db = database();
  for (const hazard of data.hazards) {
    if (
      !["caution", "danger"].includes(hazard.level) ||
      (profile.threshold === "danger" && hazard.level !== "danger")
    )
      continue;
    const period = Math.floor(Date.now() / (6 * 3600000));
    const id = `${profile.user_id}:${profile.area_id}:${hazard.id}:${hazard.level}:${period}`;
    const title = `${hazard.label} · ${data.area.name}`;
    const body = `${hazard.metric}. ${hazard.detail} Official warnings: https://sachet.ndma.gov.in/`;
    const result = await db
      .prepare(
        "INSERT OR IGNORE INTO alerts(id,user_id,area_id,hazard,level,title,body,created_at) VALUES(?,?,?,?,?,?,?,?)",
      )
      .bind(
        id,
        profile.user_id,
        profile.area_id,
        hazard.id,
        hazard.level,
        title,
        body,
        new Date().toISOString(),
      )
      .run();
    if (!result.meta.changes) continue;
    count++;
    const config = settings();
    if (
      profile.email_enabled &&
      config.RESEND_API_KEY &&
      config.ALERT_FROM_EMAIL
    ) {
      let state = "failed";
      try {
        const r = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${config.RESEND_API_KEY}`,
            "Content-Type": "application/json",
            "Idempotency-Key": id,
          },
          body: JSON.stringify({
            from: config.ALERT_FROM_EMAIL,
            to: [profile.email],
            subject: `Prithvi research watch: ${title}`,
            text: body,
          }),
        });
        if (r.ok) state = "sent";
      } catch (e) {
        console.error("email send failed", String(e));
      }
      await db
        .prepare("UPDATE alerts SET email_state=? WHERE id=?")
        .bind(state, id)
        .run();
    }
  }
  return count;
}
export async function runMonitoring() {
  const db = database();
  const { results } = await db
    .prepare("SELECT * FROM profiles WHERE enabled=1")
    .all<any>();
  let created = 0;
  const areas = [...new Set(results.map((x) => x.area_id))];
  for (const id of areas) {
    const area = getArea(id);
    if (!area) continue;
    const data = await monitor(area);
    for (const p of results.filter((x) => x.area_id === id))
      created += await evaluateProfile(p, data);
  }
  await db
    .prepare(
      "INSERT INTO monitor_runs(id,ran_at,profiles,alerts) VALUES(?,?,?,?)",
    )
    .bind(
      crypto.randomUUID(),
      new Date().toISOString(),
      results.length,
      created,
    )
    .run();
  return {
    profiles: results.length,
    alerts: created,
    checkedAt: new Date().toISOString(),
  };
}
