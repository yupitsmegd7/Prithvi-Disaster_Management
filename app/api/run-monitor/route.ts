import { runMonitoring } from "@/lib/alerts";
import { settings } from "@/lib/storage";
export async function POST(req: Request) {
  const secret = settings().MONITOR_SECRET;
  if (
    !(secret && req.headers.get("authorization") === `Bearer ${secret}`) &&
    settings().PRIVATE_SITE_MONITOR !== "true"
  )
    return Response.json(
      { error: "Service authorization required" },
      { status: 401 },
    );
  try {
    return Response.json(await runMonitoring());
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Monitor run failed" }, { status: 503 });
  }
}
