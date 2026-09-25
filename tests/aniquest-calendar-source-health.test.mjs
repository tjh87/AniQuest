import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({
  appType: "custom",
  configFile: false,
  root,
  resolve: { alias: { "@": root } },
  server: { middlewareMode: true },
});

after(async () => {
  await vite.close();
});

test("calendar data covers all Singapore months with sourced guidance", async () => {
  const {
    CALENDAR_MONTHS, SEASONAL_EVENTS, eventsForMonth, getSingaporeMonth,
  } = await vite.ssrLoadModule("/app/seasonal-data.ts");

  assert.equal(CALENDAR_MONTHS.length, 12);
  assert.equal(new Set(SEASONAL_EVENTS.map((event) => event.id)).size, SEASONAL_EVENTS.length);
  for (const event of SEASONAL_EVENTS) {
    assert.ok(event.months.length > 0);
    assert.match(event.sourceUrl, /^https:\/\//);
    assert.ok(event.timingFactor.length > 10);
    assert.ok(event.observe.length > 10);
  }
  for (let month = 1; month <= 12; month += 1) assert.ok(eventsForMonth(month).length > 0);
  assert.equal(getSingaporeMonth(new Date("2026-08-31T15:59:59Z")), 8);
  assert.equal(getSingaporeMonth(new Date("2026-08-31T16:00:00Z")), 9);
  assert.ok(eventsForMonth(1).some((event) => event.id === "migratory-shorebirds"));
  assert.ok(eventsForMonth(9).some((event) => event.id === "migratory-shorebirds"));
});

test("source registry deduplicates links and keeps current admin sources", async () => {
  const { collectSourceLinks } = await vite.ssrLoadModule("/app/source-registry.ts");
  const settings = {
    announcementEnabled: false,
    announcementText: "",
    newsEnabled: true,
    quizHintsEnabled: true,
    dailyGoalXp: 100,
    lessonRewardXp: 120,
    quizRewardXp: 50,
    defaultTheme: "system",
    defaultDensity: 0,
    contentReviewDays: 30,
    featuredBiome: "rainforest",
    dailyFacts: [
      { text: "One", sourceName: "One", sourceUrl: "https://www.nparks.gov.sg/nature/species-list?utm_source=test#top" },
      { text: "Two", sourceName: "Two", sourceUrl: "https://www.nparks.gov.sg/nature/species-list" },
    ],
    newsFeeds: [
      { id: "custom", name: "Custom source", scope: "singapore", url: "https://example.org/animals", official: false },
    ],
  };
  const links = collectSourceLinks(settings);
  assert.equal(new Set(links.map((link) => link.canonicalKey)).size, links.length);
  assert.ok(links.some((link) => link.url === "https://example.org/animals"));
  const speciesList = links.filter((link) => link.canonicalKey === "https://www.nparks.gov.sg/nature/species-list");
  assert.equal(speciesList.length, 1);
  assert.ok(speciesList[0].categories.includes("fact"));
  assert.ok(speciesList[0].categories.includes("guidance"));
});

test("source URL policy rejects private and unapproved targets", async () => {
  const { isApprovedCheckUrl, isPublicHttpsUrl } = await vite.ssrLoadModule("/app/source-url-policy.ts");
  for (const value of [
    "http://www.nparks.gov.sg/news",
    "https://user:pass@www.nparks.gov.sg/news",
    "https://localhost/source",
    "https://127.0.0.1/source",
    "https://2130706433/source",
    "https://[::1]/source",
    "https://animals.internal/source",
    "https://www.nparks.gov.sg:8443/news",
  ]) assert.equal(isPublicHttpsUrl(value), false, value);
  assert.equal(isApprovedCheckUrl("https://www.nparks.gov.sg/news"), true);
  assert.equal(isApprovedCheckUrl("https://mothership.sg/category/environment/"), true);
  assert.equal(isApprovedCheckUrl("https://mustsharenews.com/category/singapore/environment/"), true);
  assert.equal(isApprovedCheckUrl("https://www.nparks.gov.sg.example.com/news"), false);
  assert.equal(isApprovedCheckUrl("https://example.org/animals"), false);
});

test("Singapore news includes Mothership and MustShareNews sources and stories", async () => {
  const { LOCAL_NEWS_FEEDS, SINGAPORE_NEWS_STORIES } = await vite.ssrLoadModule("/app/news-data.ts");
  assert.deepEqual(LOCAL_NEWS_FEEDS.map((feed) => feed.id), ["mothership", "mustsharenews"]);
  for (const feed of LOCAL_NEWS_FEEDS) {
    assert.equal(feed.scope, "singapore");
    assert.ok(SINGAPORE_NEWS_STORIES.some((story) => story.feedId === feed.id));
  }
});

test("source checker classifies responses and never follows unsafe redirects", async () => {
  const { checkSourceLink } = await vite.ssrLoadModule("/app/source-checker.ts");
  const source = {
    url: "https://www.nparks.gov.sg/news",
    canonicalKey: "https://www.nparks.gov.sg/news",
    label: "NParks",
    labels: ["NParks"],
    categories: ["news-feed"],
  };
  let calls = 0;
  let options;
  const healthy = await checkSourceLink(source, 2, async (_url, init) => {
    calls += 1;
    options = init;
    return new Response(null, { status: 200 });
  });
  assert.equal(healthy.status, "healthy");
  assert.equal(healthy.failureStreak, 0);
  assert.equal(options.method, "HEAD");
  assert.equal(options.redirect, "manual");

  const missing = await checkSourceLink(source, 0, async () => new Response(null, { status: 404 }));
  assert.equal(missing.status, "broken");

  const firstFailure = await checkSourceLink(source, 0, async () => { throw new Error("offline"); });
  const repeatedFailure = await checkSourceLink(source, 2, async () => { throw new Error("offline"); });
  assert.equal(firstFailure.status, "warning");
  assert.equal(repeatedFailure.status, "warning");
  assert.match(repeatedFailure.detail, /does not confirm/i);

  calls = 0;
  const unsafeRedirect = await checkSourceLink(source, 0, async () => {
    calls += 1;
    return new Response(null, { status: 302, headers: { location: "https://127.0.0.1/private" } });
  });
  assert.equal(unsafeRedirect.status, "warning");
  assert.equal(calls, 1);

  calls = 0;
  const custom = { ...source, url: "https://example.org/animals", canonicalKey: "https://example.org/animals" };
  const unchecked = await checkSourceLink(custom, 0, async () => { calls += 1; return new Response(null, { status: 200 }); });
  assert.equal(unchecked.status, "unchecked");
  assert.equal(calls, 0);
});

test("shared public view registry includes the wildlife calendar", async () => {
  const { APP_VIEW_IDS, VIEW_LABELS, isAppViewId } = await vite.ssrLoadModule("/app/view-data.ts");
  assert.equal(APP_VIEW_IDS.filter((id) => id === "calendar").length, 1);
  assert.equal(APP_VIEW_IDS.includes("room"), false);
  assert.equal(VIEW_LABELS.calendar, "Wildlife Calendar");
  assert.equal(isAppViewId("calendar"), true);
  assert.equal(isAppViewId("room"), false);
});
