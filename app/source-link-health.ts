import { eq } from "drizzle-orm";
import { getD1, getDb } from "../db";
import { sourceCheckState, sourceLinkHealth } from "../db/schema";
import type { SiteSettingsValues } from "./default-settings";
import { collectSourceLinks } from "./source-registry";
import { isApprovedCheckUrl, type LinkHealthStatus } from "./source-url-policy";
import { checkSourceLinks, sourceScanLeaseSeconds, type FetchLike } from "./source-checker";

const CHECK_COOLDOWN_SECONDS = 300;

export type SourceHealthRow = {
  url: string;
  label: string;
  categories: string[];
  status: LinkHealthStatus;
  httpStatus: number | null;
  detail: string;
  failureStreak: number;
  latencyMs: number | null;
  checkedAt: string | null;
  approvedHost: boolean;
};

export type SourceHealthSnapshot = {
  lastCompletedAt: string | null;
  nextDueAt: string | null;
  isRunning: boolean;
  lastError: string;
  counts: Record<"total" | LinkHealthStatus, number>;
  rows: SourceHealthRow[];
};

export function isAutomaticSourceCheckDue(lastCompletedAt: string | null, reviewDays: number, now = Date.now()) {
  if (!lastCompletedAt) return true;
  const checked = new Date(lastCompletedAt).getTime();
  if (!Number.isFinite(checked)) return true;
  return now - checked >= reviewDays * 86_400_000;
}

function isoFromSeconds(value: number | null | undefined) {
  return value ? new Date(value * 1_000).toISOString() : null;
}

function safeStatus(value: string): LinkHealthStatus {
  return ["healthy", "warning", "broken", "unchecked"].includes(value) ? value as LinkHealthStatus : "unchecked";
}

async function ensureCheckState() {
  await getD1().prepare("INSERT INTO source_check_state (id) VALUES (1) ON CONFLICT(id) DO NOTHING").run();
}

async function claimCheckLease(sourceCount: number) {
  await ensureCheckState();
  const now = Math.floor(Date.now() / 1_000);
  const claimed = await getD1().prepare(`
    UPDATE source_check_state
    SET running = 1, lease_until = ?, last_started_at = ?, last_error = ''
    WHERE id = 1
      AND (running = 0 OR lease_until <= ?)
      AND (last_started_at IS NULL OR last_started_at <= ?)
    RETURNING id
  `).bind(now + sourceScanLeaseSeconds(sourceCount), now, now, now - CHECK_COOLDOWN_SECONDS).first();
  return claimed ? now : null;
}

async function releaseCheckLease(message: string, startedAt: number) {
  await getD1().prepare("UPDATE source_check_state SET running = 0, lease_until = 0, last_error = ? WHERE id = 1 AND last_started_at = ?")
    .bind(message.slice(0, 240), startedAt).run();
}

export async function getSourceHealthSnapshot(settings: SiteSettingsValues): Promise<SourceHealthSnapshot> {
  const links = collectSourceLinks(settings);
  const db = getDb();
  const [storedRows, stateRows] = await Promise.all([
    db.select().from(sourceLinkHealth),
    db.select().from(sourceCheckState).where(eq(sourceCheckState.id, 1)).limit(1),
  ]);
  const stored = new Map(storedRows.map((row) => [row.url, row]));
  const rows: SourceHealthRow[] = links.map((link) => {
    const row = stored.get(link.canonicalKey) ?? stored.get(link.url);
    return {
      url: link.url,
      label: link.label,
      categories: link.categories,
      status: row ? safeStatus(row.status) : "unchecked",
      httpStatus: row?.httpStatus ?? null,
      detail: row?.detail || "Waiting for the first automatic check.",
      failureStreak: row?.failureStreak ?? 0,
      latencyMs: row?.latencyMs ?? null,
      checkedAt: isoFromSeconds(row?.checkedAt),
      approvedHost: isApprovedCheckUrl(link.url),
    };
  });
  const priority: Record<LinkHealthStatus, number> = { broken: 0, warning: 1, unchecked: 2, healthy: 3 };
  rows.sort((a, b) => priority[a.status] - priority[b.status] || a.label.localeCompare(b.label));
  const counts = { total: rows.length, healthy: 0, warning: 0, broken: 0, unchecked: 0 };
  for (const row of rows) counts[row.status] += 1;
  const state = stateRows[0];
  const lastCompletedAt = isoFromSeconds(state?.lastCompletedAt);
  const nextDueAt = lastCompletedAt
    ? new Date(new Date(lastCompletedAt).getTime() + settings.contentReviewDays * 86_400_000).toISOString()
    : null;
  return {
    lastCompletedAt,
    nextDueAt,
    isRunning: Boolean(state?.running && state.leaseUntil > Math.floor(Date.now() / 1_000)),
    lastError: state?.lastError ?? "",
    counts,
    rows,
  };
}

export async function scanCurrentSources(settings: SiteSettingsValues, fetchImpl: FetchLike = fetch) {
  const links = collectSourceLinks(settings);
  const claimed = await claimCheckLease(links.length);
  if (claimed === null) return { scanned: false, reason: "cooldown_or_running" as const, sourceHealth: await getSourceHealthSnapshot(settings) };

  try {
    const previousRows = await getDb().select().from(sourceLinkHealth);
    const previousFailures = new Map(previousRows.map((row) => [row.url, row.failureStreak]));
    const results = await checkSourceLinks(links, previousFailures, fetchImpl);
    const checkedAt = Math.floor(Date.now() / 1_000);
    const counts = { healthy: 0, warning: 0, broken: 0, unchecked: 0 };
    for (const result of results) counts[result.status] += 1;

    const statements = [getD1().prepare("UPDATE source_link_health SET active = 0 WHERE EXISTS (SELECT 1 FROM source_check_state WHERE id = 1 AND running = 1 AND last_started_at = ?)").bind(claimed)];
    for (let index = 0; index < links.length; index += 1) {
      const link = links[index];
      const result = results[index];
      statements.push(getD1().prepare(`
        INSERT INTO source_link_health
          (url, label, categories, status, http_status, detail, failure_streak, latency_ms, checked_at, active, updated_at)
        SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP
        WHERE EXISTS (SELECT 1 FROM source_check_state WHERE id = 1 AND running = 1 AND last_started_at = ?)
        ON CONFLICT(url) DO UPDATE SET
          label = excluded.label,
          categories = excluded.categories,
          status = excluded.status,
          http_status = excluded.http_status,
          detail = excluded.detail,
          failure_streak = excluded.failure_streak,
          latency_ms = excluded.latency_ms,
          checked_at = excluded.checked_at,
          active = 1,
          updated_at = CURRENT_TIMESTAMP
      `).bind(
        link.canonicalKey, link.label, JSON.stringify(link.categories), result.status,
        result.httpStatus, result.detail, result.failureStreak, result.latencyMs, checkedAt, claimed,
      ));
    }
    statements.push(getD1().prepare(`
      UPDATE source_check_state SET
        running = 0, lease_until = 0, last_completed_at = ?, total = ?, healthy = ?, warning = ?, broken = ?, unchecked = ?, last_error = ''
      WHERE id = 1 AND last_started_at = ?
    `).bind(checkedAt, links.length, counts.healthy, counts.warning, counts.broken, counts.unchecked, claimed));
    await getD1().batch(statements);
    return { scanned: true, reason: "completed" as const, sourceHealth: await getSourceHealthSnapshot(settings) };
  } catch {
    await releaseCheckLease("The source scan could not finish. Try again later.", claimed);
    throw new Error("Source scan failed");
  }
}
