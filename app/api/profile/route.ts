import { getChatGPTUser } from "@/app/chatgpt-auth";
import { database, settings } from "@/lib/storage";
import { getArea } from "@/lib/locations";
export async function GET() {
  try {
    const user = await getChatGPTUser();
    const config = settings();
    const lastRun = await database()
      .prepare("SELECT ran_at FROM monitor_runs ORDER BY ran_at DESC LIMIT 1")
      .first();
    return Response.json({
      user: user
        ? { name: user.fullName || user.email, email: user.email }
        : null,
      profile: user
        ? await database()
            .prepare(
              "SELECT area_id,enabled,threshold,email_enabled FROM profiles WHERE user_id=?",
            )
            .bind(user.userId)
            .first()
        : null,
      emailConfigured: !!(config.RESEND_API_KEY && config.ALERT_FROM_EMAIL),
      lastRun,
    });
  } catch {
    return Response.json(
      { error: "Account settings are temporarily unavailable." },
      { status: 503 },
    );
  }
}
export async function POST(req: Request) {
  const user = await getChatGPTUser();
  if (!user)
    return Response.json(
      { error: "Please sign in to save your area." },
      { status: 401 },
    );
  if (req.headers.get("origin") !== new URL(req.url).origin)
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  try {
    const b = (await req.json()) as any;
    if (
      !getArea(b.area_id) ||
      !["caution", "danger"].includes(b.threshold) ||
      typeof b.enabled !== "boolean" ||
      typeof b.email_enabled !== "boolean"
    )
      return Response.json({ error: "Invalid preferences." }, { status: 400 });
    const s = settings();
    if (b.email_enabled && !(s.RESEND_API_KEY && s.ALERT_FROM_EMAIL))
      return Response.json(
        { error: "Email delivery is not configured yet." },
        { status: 400 },
      );
    await database()
      .prepare(
        "INSERT INTO profiles(user_id,email,area_id,enabled,threshold,email_enabled,updated_at) VALUES(?,?,?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET email=excluded.email,area_id=excluded.area_id,enabled=excluded.enabled,threshold=excluded.threshold,email_enabled=excluded.email_enabled,updated_at=excluded.updated_at",
      )
      .bind(
        user.userId,
        user.email,
        b.area_id,
        b.enabled ? 1 : 0,
        b.threshold,
        b.email_enabled ? 1 : 0,
        new Date().toISOString(),
      )
      .run();
    return Response.json({ saved: true });
  } catch {
    return Response.json(
      { error: "Could not save your preferences. Please try again." },
      { status: 503 },
    );
  }
}
