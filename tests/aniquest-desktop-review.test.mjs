import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true } });
after(() => vite.close());

function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map((part) => {
    const c = parseInt(part, 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
function contrast(a, b) {
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

test("core text, controls and focus meet contrast targets in every theme palette", async () => {
  const css = await readFile(`${root}/app/globals.css`, "utf8");
  const designCss = await readFile(`${root}/app/interface-design.css`, "utf8");
  for (const selector of [
    ":root", ".dark", ':root[data-ui-style="retro"]', ':root.dark[data-ui-style="retro"]',
    ':root[data-ui-style="retro"][data-pixel-palette="forest"]', ':root.dark[data-ui-style="retro"][data-pixel-palette="forest"]',
    ':root[data-ui-style="retro"][data-pixel-palette="sunset"]', ':root.dark[data-ui-style="retro"][data-pixel-palette="sunset"]',
    ':root[data-ui-style="cute"]', ':root.dark[data-ui-style="cute"]',
  ]) {
    const source = selector.includes("retro") || selector.includes("cute") ? designCss : css;
    const block = source.slice(source.indexOf(`${selector} {`)).split("}")[0];
    const tokens = Object.fromEntries([...block.matchAll(/--([a-z-]+):\s*(#[0-9a-f]{6});/g)].map((m) => [m[1], m[2]]));
    const pairs = [
      ["foreground", "background", 4.5], ["card-foreground", "card", 4.5],
      ["muted-foreground", "background", 4.5], ["muted-foreground", "card", 4.5],
      ["muted-foreground", "accent", 4.5], ["muted-foreground", "muted", 4.5],
      ["primary-foreground", "primary", 4.5], ["accent-foreground", "accent", 4.5],
      ["warning", "card", 4.5], ["warning", "background", 4.5],
      ["input", "card", 3], ["input", "background", 3],
      ["ring", "card", 3], ["ring", "background", 3],
      ["secondary-foreground", "secondary", 4.5], ["sidebar-foreground", "sidebar", 4.5],
      ["sidebar-accent-foreground", "sidebar-accent", 4.5], ["success", "card", 4.5],
    ];
    for (const [foreground, background, minimum] of pairs) {
      const ratio = contrast(tokens[foreground], tokens[background]);
      assert.ok(ratio >= minimum, `${selector}: ${foreground}/${background}: ${ratio.toFixed(2)} < ${minimum}`);
    }
  }
});

test("daily facts stay stable through the Singapore calendar day", async () => {
  const { dailyFactIndex } = await vite.ssrLoadModule("/app/daily-fact.ts");
  const { DEFAULT_SITE_SETTINGS } = await vite.ssrLoadModule("/app/default-settings.ts");
  assert.equal(DEFAULT_SITE_SETTINGS.dailyFacts.length, 17);
  assert.ok(DEFAULT_SITE_SETTINGS.dailyFacts.every((fact) => fact.sourceUrl.startsWith("https://")));
  assert.equal(dailyFactIndex(0, new Date("2026-09-07T00:00:00Z")), 0);
  assert.equal(dailyFactIndex(1, new Date("2026-09-07T00:00:00Z")), 0);
  assert.equal(dailyFactIndex(7, new Date("2026-09-07T00:00:00Z")), dailyFactIndex(7, new Date("2026-09-07T15:00:00Z")));
  for (let length = 2; length <= 14; length++) {
    const index = dailyFactIndex(length, new Date("2026-09-07T00:00:00Z"));
    assert.ok(Number.isInteger(index) && index >= 0 && index < length);
  }
});

test("hint palettes keep readable text and visible borders", () => {
  for (const [background, foreground, border] of [
    ["#fff1c4", "#704500", "#a86500"], ["#4a350c", "#ffe29b", "#e5b24a"],
    ["#dff4ff", "#164665", "#28739c"], ["#153d52", "#ccefff", "#64b9d8"],
  ]) {
    assert.ok(contrast(background, foreground) >= 4.5);
    assert.ok(contrast(background, border) >= 3);
  }
});

test("quiz tiers have nine sourced questions each", async () => {
  const { QUIZ_QUESTIONS } = await vite.ssrLoadModule("/app/quiz-data.ts");
  for (const difficulty of ["beginner", "intermediate", "advanced"]) {
    const questions = QUIZ_QUESTIONS.filter((question) => question.difficulty === difficulty);
    assert.equal(questions.length, 9);
    assert.ok(questions.every((question) => question.sourceUrl.startsWith("https://")));
  }
});

test("profile photos show their full frame and omit crop wording", async () => {
  const [css, photos] = await Promise.all([
    readFile(`${root}/app/interface-design.css`, "utf8"),
    readFile(`${root}/app/wildlife-photos.tsx`, "utf8"),
  ]);
  assert.match(css, /\.aq-photo img \{ height: auto !important; min-height: 0 !important; object-fit: contain !important;/);
  assert.doesNotMatch(photos, /resized; display crop/);
});

test("all teaching photos are local WebP assets with real-photo credits", async () => {
  const component = await readFile(`${root}/app/wildlife-photos.tsx`, "utf8");
  const { WILDLIFE_PHOTOS } = await vite.ssrLoadModule("/app/wildlife-photos.tsx");
  const app = await readFile(`${root}/app/aniquest-app.tsx`, "utf8");
  for (const id of ["colugo", "hornbill", "otter"]) {
    const photo = WILDLIFE_PHOTOS[id];
    assert.ok((await stat(`${root}/public${photo.src}`)).size > 10000);
    assert.match(photo.src, /\.webp$/);
    assert.match(photo.sourceUrl, /commons\.wikimedia\.org/);
    assert.match(photo.licenseUrl, /creativecommons\.org/);
  }
  assert.match(component, /figcaption/);
  assert.doesNotMatch(app, /aniquest-wildlife\.png|aq-wildlife-photo/);
});

test("desktop discovery, theme and source affordances stay visible", async () => {
  const { DEFAULT_SITE_SETTINGS } = await vite.ssrLoadModule("/app/default-settings.ts");
  const app = await readFile(`${root}/app/aniquest-app.tsx`, "utf8");
  const layout = await readFile(`${root}/app/layout.tsx`, "utf8");
  const localIndex = await readFile(`${root}/local/index.html`, "utf8");
  const calendar = await readFile(`${root}/app/animal-events-calendar.tsx`, "utf8");
  const css = await readFile(`${root}/app/globals.css`, "utf8");
  const designCss = await readFile(`${root}/app/interface-design.css`, "utf8");
  assert.equal(DEFAULT_SITE_SETTINGS.defaultTheme, "light");
  assert.match(app, />Fact of the day</);
  assert.doesNotMatch(app, /Random fact|Singapore fact of the day|Sources checked/);
  assert.match(app, /Pixelated/);
  assert.match(app, />Book<\/button>/);
  assert.match(app, /useState<"classic" \| "cute" \| "retro">\("cute"\)/);
  assert.match(app, /storedUiStyle === "retro" \|\| storedUiStyle === "classic"/);
  assert.match(layout, /dataset\.uiStyle=u==='retro'\|\|u==='classic'\?u:'cute'/);
  assert.doesNotMatch(layout, /prefers-color-scheme/);
  assert.match(localIndex, /dataset\.uiStyle=u==='retro'\|\|u==='classic'\?u:'cute'/);
  assert.doesNotMatch(localIndex, /prefers-color-scheme/);
  assert.match(app, /Pixel palette/);
  assert.match(app, /Forest green/);
  assert.match(app, /Sunset amber/);
  assert.match(designCss, /data-pixel-palette="forest"/);
  assert.match(designCss, /data-pixel-palette="sunset"/);
  assert.match(designCss, /data-ui-style="cute"/);
  assert.match(designCss, /"Trebuchet MS"/);
  assert.match(designCss, /\[data-ui-style="cute"\] \.aq-photo img \{[^}]*image-rendering: auto;[^}]*filter: none;/s);
  assert.match(app, /Rainforest Ranger/);
  assert.match(app, /All-Round Explorer/);
  assert.match(app, /AniQuest site map/);
  assert.match(app, /aq-wild-gallery/);
  assert.match(app, /SpeciesStatistics/);
  assert.match(calendar, /Event sources/);
  assert.match(calendar, /Source: \{host\.name\} event page/);
  assert.doesNotMatch(calendar, /Sources checked/);
  assert.match(css, /\.aq-content\s*\{[^}]*max-width:\s*none/s);
  assert.match(css, /\.aq-group-visual \.aq-chart-heading > strong\s*\{[^}]*white-space:\s*nowrap/s);
});

test("admin analytics label only recorded server-side aggregates", async () => {
  const settings = await readFile(`${root}/app/site-settings.ts`, "utf8");
  const room = await readFile(`${root}/app/room/admin-room.tsx`, "utf8");
  assert.match(settings, /activeLearners7d/);
  assert.match(settings, /correctAnswers/);
  assert.match(settings, /json_valid/);
  assert.match(room, /Recorded section opens/);
  assert.match(room, /not people or unique visits/);
  assert.match(room, /Feature status/);
  assert.match(room, /Planned/);
});

test("statistics use shared theme tokens and only display recorded progress", async () => {
  const app = await readFile(`${root}/app/aniquest-app.tsx`, "utf8");
  const room = await readFile(`${root}/app/room/admin-room.tsx`, "utf8");
  const designCss = await readFile(`${root}/app/interface-design.css`, "utf8");
  assert.match(app, /Quiz progress/);
  assert.match(app, /quizProgress/);
  assert.match(room, /Learning records/);
  assert.match(room, /activeShare/);
  assert.match(designCss, /\.aq-stat-feature, \.room-stat-feature/);
  assert.match(designCss, /background: color-mix\(in srgb, var\(--primary\) 5%, var\(--card\)\)/);
  assert.match(designCss, /\.room-stat-detail-grid/);
});

test("reviewed calendar and news wording preserve evidence scope", async () => {
  const { SEASONAL_EVENTS, climateForMonth } = await vite.ssrLoadModule("/app/seasonal-data.ts");
  const raptors = SEASONAL_EVENTS.find((event) => event.id.includes("raptor"));
  assert.deepEqual(raptors.months, [2, 3, 4, 9, 10, 11, 12]);
  assert.match(raptors.typicalWindow, /February–April/);
  assert.match(climateForMonth(3).label, /transition/i);
  const { SINGAPORE_NEWS_STORIES } = await vite.ssrLoadModule("/app/news-data.ts");
  const acres = SINGAPORE_NEWS_STORIES.find((story) => story.title.includes("ACRES"));
  assert.match(acres.title, /plans/);
  assert.doesNotMatch(acres.summary, /has doubled|completed the expansion/);
});
