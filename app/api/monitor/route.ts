import { getArea } from "@/lib/locations";
import { monitor } from "@/lib/feeds";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { database } from "@/lib/storage";
import { evaluateProfile } from "@/lib/alerts";
export async function GET(req: Request) {
  const area = getArea(
    new URL(req.url).searchParams.get("area") || "bhubaneswar",
  );
  if (!area)
    return Response.json(
      { error: "Choose a supported area." },
      { status: 400 },
    );
  try {
    const data = await monitor(area);
    let notificationError;
    // An inbox/account failure must not discard healthy environmental feeds.
    try {
      const user = await getChatGPTUser();
      if (user) {
        const profile = await database()
          .prepare("SELECT * FROM profiles WHERE user_id=? AND area_id=?")
          .bind(user.userId, area.id)
          .first();
        if (profile) await evaluateProfile(profile, data);
      }
    } catch (error) {
      console.error("monitor notification update", error);
      notificationError =
        "Area evidence loaded, but saved alerts could not be updated. Please check My alerts again.";
    }
    return Response.json(
      { ...data, notificationError },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    console.error(e);
    return Response.json(
      {
        error:
          "Monitoring is temporarily unavailable. Check official warnings.",
      },
      { status: 503 },
    );
  }
}
