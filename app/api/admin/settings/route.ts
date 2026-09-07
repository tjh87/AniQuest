import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { getAdminUser } from "../../../admin-auth";
import { getAdminDashboard, getOrCreateSiteSettings, publicValuesFromRow, type SiteSettingsValues } from "../../../site-settings";
import { getDb } from "../../../../db";
import { adminAudit, adminWriteLimits, siteSettings } from "../../../../db/schema";
import { isPublicHttpsUrl } from "../../../source-url-policy";

const newsFeedSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]{3,64}$/),
  name: z.string().trim().min(2).max(60),
  scope: z.enum(["singapore", "world"]),
  url: z.string().trim().url().max(500).refine(isPublicHttpsUrl, "News feeds must use a public HTTPS URL."),
  official: z.boolean(),
}).strict();

const dailyFactSchema = z.object({
  text: z.string().trim().min(5).max(180),
  sourceName: z.string().trim().min(2).max(80),
  sourceUrl: z.string().trim().url().max(500).refine(isPublicHttpsUrl, "Fact sources must use a public HTTPS URL."),
}).strict();

const updateSchema = z.object({
  expectedVersion: z.number().int().min(1),
  announcementEnabled: z.boolean(),
  announcementText: z.string().trim().max(180),
  newsEnabled: z.boolean(),
  quizHintsEnabled: z.boolean(),
  dailyGoalXp: z.number().int().min(25).max(500),
  lessonRewardXp: z.number().int().min(10).max(500),
  quizRewardXp: z.number().int().min(5).max(250),
  defaultTheme: z.enum(["system", "light", "dark"]),
  defaultDensity: z.union([z.literal(0), z.literal(1), z.literal(2)]),
  contentReviewDays: z.number().int().min(7).max(90),
  featuredBiome: z.enum(["rainforest", "mangrove", "freshwater", "coast"]),
  dailyFacts: z.array(dailyFactSchema).min(3).max(24),
  newsFeeds: z.array(newsFeedSchema).max(20),
}).strict().refine((value) => !value.announcementEnabled || value.announcementText.length >= 3, {
  message: "Add announcement text before you turn on the announcement.",
  path: ["announcementText"],
}).superRefine((value, context) => {
  if (new Set(value.newsFeeds.map((feed) => feed.id)).size !== value.newsFeeds.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Each news feed must have a unique ID.", path: ["newsFeeds"] });
  }
});

const settingKeys: Array<keyof SiteSettingsValues> = [
  "announcementEnabled", "announcementText", "newsEnabled", "quizHintsEnabled",
  "dailyGoalXp", "lessonRewardXp", "quizRewardXp", "defaultTheme",
  "defaultDensity", "contentReviewDays", "featuredBiome", "dailyFacts", "newsFeeds",
];

function settingChanged(before: SiteSettingsValues[keyof SiteSettingsValues], after: SiteSettingsValues[keyof SiteSettingsValues]) {
  return Array.isArray(before) || Array.isArray(after)
    ? JSON.stringify(before) !== JSON.stringify(after)
    : before !== after;
}

function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { "cache-control": "no-store", "x-content-type-options": "nosniff" },
  });
}

async function consumeWriteLimit(actorUserId: string) {
  const db = getDb();
  const now = Math.floor(Date.now() / 1000);
  const [current] = await db.select().from(adminWriteLimits)
    .where(eq(adminWriteLimits.actorUserId, actorUserId)).limit(1);
  if (!current || now - current.windowStartedAt >= 60) {
    await db.insert(adminWriteLimits).values({ actorUserId, windowStartedAt: now, requestCount: 1 })
      .onConflictDoUpdate({ target: adminWriteLimits.actorUserId, set: { windowStartedAt: now, requestCount: 1 } });
    return true;
  }
  if (current.requestCount >= 10) return false;
  await db.update(adminWriteLimits).set({ requestCount: sql`${adminWriteLimits.requestCount} + 1` })
    .where(eq(adminWriteLimits.actorUserId, actorUserId));
  return true;
}

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return json({ error: "Not found" }, 404);
  try {
    return json(await getAdminDashboard());
  } catch {
    return json({ error: "Admin settings are temporarily unavailable." }, 503);
  }
}

export async function PATCH(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return json({ error: "Not found" }, 404);

  const requestUrl = new URL(request.url);
  if (request.headers.get("origin") !== requestUrl.origin) return json({ error: "Request rejected" }, 403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json({ error: "JSON is required" }, 415);
  }
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 65_536) return json({ error: "Request is too large" }, 413);

  try {
    if (!(await consumeWriteLimit(admin.userId))) return json({ error: "Wait before you save again." }, 429);
    const body = await request.text();
    if (new TextEncoder().encode(body).byteLength > 65_536) return json({ error: "Request is too large" }, 413);
    let payload: unknown;
    try { payload = JSON.parse(body); } catch { return json({ error: "Invalid JSON" }, 400); }
    const parsed = updateSchema.safeParse(payload);
    if (!parsed.success) {
      return json({ error: parsed.error.issues[0]?.message ?? "Check the settings." }, 400);
    }

    const { expectedVersion, ...nextValues } = parsed.data;
    const db = getDb();
    const currentRow = await getOrCreateSiteSettings();
    if (currentRow.version !== expectedVersion) {
      return json({ error: "These settings changed in another session. Reload the page." }, 409);
    }
    const currentValues = publicValuesFromRow(currentRow);
    const changedKeys = settingKeys.filter((key) => settingChanged(currentValues[key], nextValues[key]));
    if (changedKeys.length === 0) return json(await getAdminDashboard());

    const [updated] = await db.update(siteSettings).set({
      ...nextValues,
      dailyFacts: JSON.stringify(nextValues.dailyFacts),
      newsFeeds: JSON.stringify(nextValues.newsFeeds),
      version: currentRow.version + 1,
      updatedBy: admin.userId,
      updatedAt: sql`CURRENT_TIMESTAMP`,
    }).where(and(eq(siteSettings.id, 1), eq(siteSettings.version, expectedVersion))).returning();

    if (!updated) return json({ error: "These settings changed in another session. Reload the page." }, 409);

    await db.insert(adminAudit).values({
      actorUserId: admin.userId,
      action: "update_global_settings",
      changedKeys: JSON.stringify(changedKeys),
      beforeSettings: JSON.stringify(currentValues),
      afterSettings: JSON.stringify(nextValues),
    });

    return json(await getAdminDashboard());
  } catch {
    return json({ error: "The settings could not be saved." }, 503);
  }
}
