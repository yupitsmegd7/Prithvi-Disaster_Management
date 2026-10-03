import { getArea } from "@/lib/locations";
import { historical } from "@/lib/feeds";
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const a = getArea(q.get("area") || "bhubaneswar");
  const y = Number(q.get("year") || 2025);
  if (!a || !Number.isInteger(y) || y < 2000 || y > 2025)
    return Response.json(
      { error: "Choose a city and a year from 2000–2025." },
      { status: 400 },
    );
  try {
    return Response.json(await historical(a, y));
  } catch {
    return Response.json({ error: "History unavailable." }, { status: 503 });
  }
}
