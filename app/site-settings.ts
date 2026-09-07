import { desc, eq, sql } from "drizzle-orm";
import { getD1, getDb } from "../db";
import { adminAudit, siteAnalytics, siteSettings, userProgress } from "../db/schema";
import { LOCAL_NEWS_FEEDS } from "./news-data";
import { isPublicHttpsUrl } from "./source-url-policy";

const LOCAL_NEWS_BACKFILL_ID = "2026-09-04-local-news-sources-v1";

export type { NewsFeed, DailyFact, SiteSettingsValues } from "./default-settings";
import type { NewsFeed, DailyFact, SiteSettingsValues } from "./default-settings";
import { DEFAULT_SITE_SETTINGS } from "./default-settings";
import { QUIZ_QUESTIONS } from "./quiz-data";
export { DEFAULT_SITE_SETTINGS } from "./default-settings";

export type SiteSettingsSnapshot = SiteSettingsValues & {
  version: number;
  updatedAt: string;
};

export type AdminStats = {
  learners: number;
  activeLearners7d: number;
  totalXp: number;
  averageXp: number;
  lessonCompletions: number;
  lessonLearners: number;
  correctAnswers: number;
  quizLearners: number;
  quizCompleteLearners: number;
  totalVisits: number;
};

export type AdminViewStat = { view: string; visits: number };

export type AdminAuditEntry = {
  id: number;
  changedKeys: string[];
  createdAt: string;
};


async function applyContentBackfills() {
  const d1 = getD1();
  const applied = await d1.prepare("SELECT id FROM app_data_migrations WHERE id = ? LIMIT 1")
    .bind(LOCAL_NEWS_BACKFILL_ID).first();
  if (applied) return;

  const statements = LOCAL_NEWS_FEEDS.map((feed) => d1.prepare(`
    UPDATE site_settings
    SET news_feeds = json_insert(
      news_feeds,
      '$[#]',
      json_object('id', ?, 'name', ?, 'scope', ?, 'url', ?, 'official', json(?))
    ),
      version = version + 1,
      updated_by = 'system',
      updated_at = CURRENT_TIMESTAMP
    WHERE id = 1
      AND json_valid(news_feeds)
      AND NOT EXISTS (
        SELECT 1 FROM json_each(news_feeds) AS item
        WHERE json_extract(item.value, '$.id') = ?
          OR json_extract(item.value, '$.url') = ?
      )
  `).bind(feed.id, feed.name, feed.scope, feed.url, JSON.stringify(feed.official), feed.id, feed.url));
  statements.push(d1.prepare("UPDATE source_check_state SET last_completed_at = NULL WHERE id = 1"));
  statements.push(d1.prepare("INSERT OR IGNORE INTO app_data_migrations (id) VALUES (?)").bind(LOCAL_NEWS_BACKFILL_ID));
  await d1.batch(statements);
}

function parseDailyFacts(value: string): DailyFact[] {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      const facts = parsed.flatMap((fact): DailyFact[] => {
        if (typeof fact === "string" && fact.trim().length >= 5) {
          return [{ text: fact.trim(), sourceName: "NParks BiodiversitySG animal profiles", sourceUrl: "https://biodiversitysg.nparks.gov.sg/our-biodiversity/" }];
        }
        if (!fact || typeof fact !== "object") return [];
        const candidate = fact as Partial<DailyFact>;
        if (typeof candidate.text !== "string" || candidate.text.trim().length < 5 || typeof candidate.sourceName !== "string" || candidate.sourceName.trim().length < 2 || typeof candidate.sourceUrl !== "string") return [];
        try {
          if (!isPublicHttpsUrl(candidate.sourceUrl)) return [];
          const url = new URL(candidate.sourceUrl);
          return [{ text: candidate.text.trim() === "Mangrove horseshoe crabs breathe with book gills and are chelicerates, so they are not true crabs." ? "The mangrove horseshoe crab is listed as Vulnerable in Singapore’s third Red Data Book." : candidate.text.trim(), sourceName: candidate.sourceName.trim(), sourceUrl: url.href }];
        } catch { return []; }
      });
      if (facts.length >= 3) return facts;
    }
  } catch {}
  return DEFAULT_SITE_SETTINGS.dailyFacts;
}

function parseNewsFeeds(value: string): NewsFeed[] {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      const valid = parsed.every((feed) => Boolean(
        feed && typeof feed === "object" && typeof feed.id === "string" && typeof feed.name === "string" &&
        (feed.scope === "singapore" || feed.scope === "world") && typeof feed.url === "string" && isPublicHttpsUrl(feed.url) && typeof feed.official === "boolean",
      ));
      if (valid) return parsed as NewsFeed[];
    }
  } catch {}
  return DEFAULT_SITE_SETTINGS.newsFeeds;
}

function valuesFromRow(row: typeof siteSettings.$inferSelect): SiteSettingsValues {
  const theme = ["system", "light", "dark"].includes(row.defaultTheme) ? row.defaultTheme : "system";
  const density = [0, 1, 2].includes(row.defaultDensity) ? row.defaultDensity : 0;
  const biome = ["rainforest", "mangrove", "freshwater", "coast"].includes(row.featuredBiome) ? row.featuredBiome : "rainforest";
  return {
    announcementEnabled: row.announcementEnabled,
    announcementText: row.announcementText,
    newsEnabled: row.newsEnabled,
    quizHintsEnabled: row.quizHintsEnabled,
    dailyGoalXp: row.dailyGoalXp,
    lessonRewardXp: row.lessonRewardXp,
    quizRewardXp: row.quizRewardXp,
    defaultTheme: theme as SiteSettingsValues["defaultTheme"],
    defaultDensity: density as SiteSettingsValues["defaultDensity"],
    contentReviewDays: row.contentReviewDays,
    featuredBiome: biome as SiteSettingsValues["featuredBiome"],
    dailyFacts: parseDailyFacts(row.dailyFacts),
    newsFeeds: parseNewsFeeds(row.newsFeeds),
  };
}

export async function getOrCreateSiteSettings() {
  await applyContentBackfills();
  const db = getDb();
  const [existing] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);
  if (existing) return existing;
  await db.insert(siteSettings).values({
    id: 1,
    ...DEFAULT_SITE_SETTINGS,
    dailyFacts: JSON.stringify(DEFAULT_SITE_SETTINGS.dailyFacts),
    newsFeeds: JSON.stringify(DEFAULT_SITE_SETTINGS.newsFeeds),
  }).onConflictDoNothing();
  const [row] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);
  if (!row) throw new Error("Global settings are unavailable.");
  return row;
}

export async function getPublicSiteSettings(): Promise<SiteSettingsValues> {
  try {
    return valuesFromRow(await getOrCreateSiteSettings());
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function getAdminDashboard(): Promise<{
  settings: SiteSettingsSnapshot;
  stats: AdminStats;
  views: AdminViewStat[];
  audit: AdminAuditEntry[];
}> {
  const db = getDb();
  const row = await getOrCreateSiteSettings();
  const [statsRow] = await db.select({
    learners: sql<number>`count(*)`,
    activeLearners7d: sql<number>`coalesce(sum(case when ${userProgress.updatedAt} >= datetime('now', '-7 days') then 1 else 0 end), 0)`,
    totalXp: sql<number>`coalesce(sum(${userProgress.xp}), 0)`,
    lessonCompletions: sql<number>`coalesce(sum(case when json_valid(${userProgress.completedLessons}) then json_array_length(${userProgress.completedLessons}) else 0 end), 0)`,
    lessonLearners: sql<number>`coalesce(sum(case when json_valid(${userProgress.completedLessons}) and json_array_length(${userProgress.completedLessons}) > 0 then 1 else 0 end), 0)`,
    correctAnswers: sql<number>`coalesce(sum(case when json_valid(${userProgress.answeredQuizzes}) then json_array_length(${userProgress.answeredQuizzes}) else 0 end), 0)`,
    quizLearners: sql<number>`coalesce(sum(case when json_valid(${userProgress.answeredQuizzes}) and json_array_length(${userProgress.answeredQuizzes}) > 0 then 1 else 0 end), 0)`,
    quizCompleteLearners: sql<number>`coalesce(sum(case when json_valid(${userProgress.answeredQuizzes}) and json_array_length(${userProgress.answeredQuizzes}) = ${QUIZ_QUESTIONS.length} then 1 else 0 end), 0)`,
  }).from(userProgress);
  const auditRows = await db.select({
    id: adminAudit.id,
    changedKeys: adminAudit.changedKeys,
    createdAt: adminAudit.createdAt,
  }).from(adminAudit).orderBy(desc(adminAudit.id)).limit(12);
  const viewRows = await db.select({ view: siteAnalytics.view, visits: siteAnalytics.visits })
    .from(siteAnalytics).orderBy(desc(siteAnalytics.visits));
  const totalVisits = viewRows.reduce((sum, item) => sum + Number(item.visits), 0);

  return {
    settings: { ...valuesFromRow(row), version: row.version, updatedAt: row.updatedAt },
    stats: (() => {
      const learners = Number(statsRow?.learners ?? 0);
      const totalXp = Number(statsRow?.totalXp ?? 0);
      return {
        learners,
        activeLearners7d: Number(statsRow?.activeLearners7d ?? 0),
        totalXp,
        averageXp: learners ? Math.round(totalXp / learners) : 0,
        lessonCompletions: Number(statsRow?.lessonCompletions ?? 0),
        lessonLearners: Number(statsRow?.lessonLearners ?? 0),
        correctAnswers: Number(statsRow?.correctAnswers ?? 0),
        quizLearners: Number(statsRow?.quizLearners ?? 0),
        quizCompleteLearners: Number(statsRow?.quizCompleteLearners ?? 0),
        totalVisits,
      };
    })(),
    views: viewRows.map((item) => ({ view: item.view, visits: Number(item.visits) })),
    audit: auditRows.map((entry) => {
      let changedKeys: string[] = [];
      try {
        const parsed = JSON.parse(entry.changedKeys);
        if (Array.isArray(parsed)) changedKeys = parsed.filter((key) => typeof key === "string");
      } catch {}
      return { id: entry.id, changedKeys, createdAt: entry.createdAt };
    }),
  };
}

export function publicValuesFromRow(row: typeof siteSettings.$inferSelect) {
  return valuesFromRow(row);
}
