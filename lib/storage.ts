import { env } from "cloudflare:workers";
export function database() {
  if (!env.DB) throw new Error("Storage temporarily unavailable");
  return env.DB;
}
export function settings() {
  return env as unknown as Record<string, string | undefined>;
}
export async function cached<T>(
  key: string,
  seconds: number,
  fn: () => Promise<T>,
): Promise<{ data: T; fetchedAt: string }> {
  const db = database();
  const row = await db
    .prepare("SELECT payload, fetched_at FROM feed_cache WHERE cache_key=?")
    .bind(key)
    .first<any>();
  if (row && Date.now() - Date.parse(row.fetched_at) < seconds * 1000)
    return { data: JSON.parse(row.payload), fetchedAt: row.fetched_at };
  // Persist a short provider cooldown so reloading the page does not keep
  // hitting a rate-limited provider. Keep successful measurements separate.
  const failureKey = `failure:${key}`;
  const failure = await db
    .prepare("SELECT payload FROM feed_cache WHERE cache_key=?")
    .bind(failureKey)
    .first<any>();
  if (failure) {
    const previous = JSON.parse(failure.payload);
    if (Date.parse(previous.retryAt) > Date.now())
      throw Object.assign(new Error(previous.message), previous);
  }
  let data: T;
  try {
    data = await fn();
  } catch (error: any) {
    const retryAt = error.retryAt || new Date(Date.now() + 60000).toISOString();
    await db
      .prepare(
        "INSERT INTO feed_cache(cache_key,payload,fetched_at) VALUES(?,?,?) ON CONFLICT(cache_key) DO UPDATE SET payload=excluded.payload,fetched_at=excluded.fetched_at",
      )
      .bind(
        failureKey,
        JSON.stringify({
          message: String(error.message || error),
          status: error.status,
          retryAt,
        }),
        new Date().toISOString(),
      )
      .run();
    throw Object.assign(error, { retryAt });
  }
  const fetchedAt = new Date().toISOString();
  await db
    .prepare(
      "INSERT INTO feed_cache(cache_key,payload,fetched_at) VALUES(?,?,?) ON CONFLICT(cache_key) DO UPDATE SET payload=excluded.payload,fetched_at=excluded.fetched_at",
    )
    .bind(key, JSON.stringify(data), fetchedAt)
    .run();
  return { data, fetchedAt };
}
