import { getChatGPTUser } from "@/app/chatgpt-auth";
import { database } from "@/lib/storage";
export async function GET() {
  const u = await getChatGPTUser();
  if (!u) return Response.json({ alerts: [] });
  try {
    const r = await database()
      .prepare(
        "SELECT id,area_id,hazard,level,title,body,created_at,read_at,email_state FROM alerts WHERE user_id=? ORDER BY created_at DESC LIMIT 50",
      )
      .bind(u.userId)
      .all();
    return Response.json({ alerts: r.results });
  } catch {
    return Response.json(
      { error: "Alert inbox temporarily unavailable." },
      { status: 503 },
    );
  }
}
export async function PATCH(req: Request) {
  const u = await getChatGPTUser();
  if (!u) return Response.json({ error: "Sign in required" }, { status: 401 });
  if (req.headers.get("origin") !== new URL(req.url).origin)
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  try {
    await database()
      .prepare(
        "UPDATE alerts SET read_at=? WHERE user_id=? AND read_at IS NULL",
      )
      .bind(new Date().toISOString(), u.userId)
      .run();
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Could not update alerts" }, { status: 503 });
  }
}
