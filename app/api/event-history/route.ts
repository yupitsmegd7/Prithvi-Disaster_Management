import { HISTORIC_EVENTS } from "@/lib/historic-events";
import { eventHistory } from "@/lib/feeds";
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("event") || "";
  if (!HISTORIC_EVENTS.some((e) => e.id === id))
    return Response.json(
      { error: "Choose an event from the atlas." },
      { status: 400 },
    );
  return Response.json(await eventHistory(id));
}
