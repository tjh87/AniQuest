import { sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { siteAnalytics } from "../../../db/schema";
import { getChatGPTUser } from "../../chatgpt-auth";
import { isAppViewId } from "../../view-data";

function response(status: number) {
  return new Response(null, {
    status,
    headers: { "cache-control": "no-store", "x-content-type-options": "nosniff" },
  });
}

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  if (request.headers.get("origin") !== requestUrl.origin) return response(403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return response(415);
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 512) return response(413);

  try {
    if (!(await getChatGPTUser())) return response(401);
    const body = await request.text();
    if (new TextEncoder().encode(body).byteLength > 512) return response(413);
    let payload: { view?: unknown };
    try { payload = JSON.parse(body) as { view?: unknown }; } catch { return response(400); }
    if (!isAppViewId(payload.view)) return response(400);
    const db = getDb();
    await db.insert(siteAnalytics).values({ view: payload.view, visits: 1 })
      .onConflictDoUpdate({
        target: siteAnalytics.view,
        set: { visits: sql`${siteAnalytics.visits} + 1`, updatedAt: sql`CURRENT_TIMESTAMP` },
      });
    return response(204);
  } catch {
    return response(503);
  }
}
