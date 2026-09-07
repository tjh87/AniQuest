import { getAdminUser } from "../../../admin-auth";
import { getPublicSiteSettings } from "../../../site-settings";
import { getSourceHealthSnapshot, scanCurrentSources } from "../../../source-link-health";

function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { "cache-control": "no-store", "x-content-type-options": "nosniff" },
  });
}

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return json({ error: "Not found" }, 404);
  try {
    const settings = await getPublicSiteSettings();
    return json({ sourceHealth: await getSourceHealthSnapshot(settings) });
  } catch {
    return json({ error: "Source health is temporarily unavailable." }, 503);
  }
}

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return json({ error: "Not found" }, 404);
  const requestUrl = new URL(request.url);
  if (request.headers.get("origin") !== requestUrl.origin) return json({ error: "Request rejected" }, 403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json({ error: "JSON is required" }, 415);
  }
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 128) return json({ error: "Request is too large" }, 413);

  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).byteLength > 128) return json({ error: "Request is too large" }, 413);
    let payload: unknown;
    try { payload = JSON.parse(body); } catch { return json({ error: "Invalid JSON" }, 400); }
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) return json({ error: "Invalid request" }, 400);
    const entries = Object.entries(payload as Record<string, unknown>);
    if (entries.length !== 1 || entries[0][0] !== "mode" || !["automatic", "manual"].includes(String(entries[0][1]))) {
      return json({ error: "Invalid request" }, 400);
    }
    const settings = await getPublicSiteSettings();
    return json(await scanCurrentSources(settings));
  } catch {
    return json({ error: "The source scan could not finish. Try again later." }, 503);
  }
}
