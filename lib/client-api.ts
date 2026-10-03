// Bound every request so an expired session or stalled connection cannot leave
// the overview in a permanent loading state. Never interpret HTML as feed data.
export async function api(path: string, options?: RequestInit) {
  const controller = new AbortController();
  const cancel = () => controller.abort();
  options?.signal?.addEventListener("abort", cancel, { once: true });
  if (options?.signal?.aborted) controller.abort();
  const timer = setTimeout(cancel, 30000);
  try {
    const response = await fetch(path, {
      ...options,
      signal: controller.signal,
    });
    if (response.redirected || [401, 403].includes(response.status)) {
      throw new Error(
        "Your session needs refreshing. Reload Prithvi and sign in again.",
      );
    }
    let data: any;
    try {
      data = await response.json();
    } catch {
      throw new Error(
        "The server returned an unreadable response. Please try again.",
      );
    }
    if (!response.ok)
      throw new Error(
        data.error || "Could not load the data. Please try again.",
      );
    return data;
  } catch (error) {
    if (controller.signal.aborted && !options?.signal?.aborted) {
      throw new Error(
        "The request took too long. Try again; missing data does not mean low risk.",
      );
    }
    throw error;
  } finally {
    clearTimeout(timer);
    options?.signal?.removeEventListener("abort", cancel);
  }
}
