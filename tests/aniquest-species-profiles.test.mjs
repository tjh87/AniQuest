import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false } });
after(() => vite.close());

test("all catalogue animals resolve to complete, distinct profiles with sourced facts", async () => {
  const { SINGAPORE_SPECIES, speciesById } = await vite.ssrLoadModule("/app/species-data.ts");
  assert.equal(SINGAPORE_SPECIES.length, 94);
  assert.equal(new Set(SINGAPORE_SPECIES.map(s => s.id)).size, 94);
  assert.equal(new Set(SINGAPORE_SPECIES.map(s => s.scientific)).size, 94);
  const counts = {};
  for (const animal of SINGAPORE_SPECIES) {
    counts[animal.group] = (counts[animal.group] || 0) + 1;
    assert.equal(speciesById(animal.id), animal);
    for (const field of ["family", "summary", "identification", "diet", "activity", "behaviour", "reproduction", "singapore", "ecologicalRole", "pressures", "watch", "rarity", "singaporeStatus"]) {
      assert.ok(typeof animal[field] === "string" && animal[field].trim().length > 0, `${animal.id}: ${field}`);
      assert.doesNotMatch(animal[field], /lorem ipsum|coming soon|TODO/);
    }
    assert.equal(animal.funFacts.length, 2);
    assert.notEqual(animal.funFacts[0].text, animal.funFacts[1].text);
    for (const fact of animal.funFacts) assert.equal(new URL(fact.sourceUrl || animal.sourceUrl).protocol, "https:");
    assert.equal(new URL(animal.statusSourceUrl).protocol, "https:");
    assert.ok(animal.habitats.length > 0, `${animal.id}: missing habitat detail`);
    const profileReferenceUrls = [animal.sourceUrl, ...animal.sources.map(source => source.url)].filter(Boolean);
    assert.ok(profileReferenceUrls.length > 0, `${animal.id}: missing profile references`);
    for (const url of profileReferenceUrls) assert.equal(new URL(url).protocol, "https:");
    for (const source of animal.sources) {
      assert.ok(source.name && source.supports, `${animal.id}: unnamed or unexplained reference`);
      assert.equal(new URL(source.url).protocol, "https:");
    }
  }
  assert.deepEqual(counts, { Mammal: 19, Bird: 61, Reptile: 10, Amphibian: 4 });
  assert.equal(SINGAPORE_SPECIES.flatMap(s => s.funFacts).length, 188);
  assert.equal(speciesById("not-an-animal"), undefined);
});

test("names, aliases, scientific names and filters lead to the intended animals", async () => {
  const { filterSpecies } = await vite.ssrLoadModule("/app/species-data.ts");
  assert.equal(filterSpecies("common palm civet")[0].id, "sumatran-palm-civet");
  assert.equal(filterSpecies("flying lemur")[0].id, "sunda-colugo");
  assert.equal(filterSpecies("  lesser mouse-deer ")[0].id, "lesser-mousedeer");
  assert.equal(filterSpecies("Polypedates leucomystax")[0].id, "four-lined-tree-frog");
  assert.equal(filterSpecies("uwu bird")[0].id, "asian-koel");
  assert.equal(filterSpecies("Megophrys nasuta")[0].id, "malayan-horned-frog");
  assert.equal(filterSpecies("Varanus bengalensis nebulosus")[0].id, "clouded-monitor");
  assert.equal(filterSpecies("Spizaetus cirrhatus")[0].id, "changeable-hawk-eagle");
  assert.equal(filterSpecies("three-striped palm civet")[0].id, "small-toothed-palm-civet");
  assert.equal(filterSpecies("Horsfield’s flying squirrel")[0].id, "horsfields-flying-squirrel");
  assert.equal(filterSpecies("", "Bird").length, 61);
  assert.ok(filterSpecies("", "Mammal", "Rare or restricted").every(s => s.group === "Mammal" && s.encounter === "Rare or restricted"));
  assert.equal(filterSpecies("nonexistent animal name").length, 0);
  assert.equal(filterSpecies("", "Fish").length, 0);
  assert.equal(filterSpecies("", "Insect").length, 0);
});

test("national conservation filters and chart counts agree with the reviewed RDB3 categories", async () => {
  const { filterSpecies, getSpeciesStatusCounts, speciesById } = await vite.ssrLoadModule("/app/species-data.ts");
  const expectedCounts = { LC: 17, NT: 4, VU: 2, EN: 8, CR: 15, NA: 2, UNV: 46 };
  const chart = getSpeciesStatusCounts();
  assert.deepEqual(Object.fromEntries(chart.map(row => [row.code, row.count])), expectedCounts);
  assert.equal(chart.reduce((total, row) => total + row.count, 0), 94);
  for (const [code, expected] of Object.entries(expectedCounts)) {
    const matches = filterSpecies("", "All", "All", code);
    assert.equal(matches.length, expected, `${code}: filter count`);
    assert.ok(matches.every(species => species.statusCode === code));
  }
  assert.deepEqual(filterSpecies("", "All", "All", "VU").map(s => s.id).sort(), ["buffy-fish-owl", "changeable-hawk-eagle"]);
  assert.equal(speciesById("blue-eared-kingfisher").statusCode, "EN");
  assert.equal(speciesById("great-billed-heron").statusCode, "CR");
  assert.equal(speciesById("purple-heron").statusCode, "EN");
  const threatened = filterSpecies("", "All", "All", "Threatened");
  assert.equal(threatened.length, 25);
  assert.ok(threatened.every(species => ["VU", "EN", "CR"].includes(species.statusCode)));
  assert.ok(!threatened.some(species => ["long-tailed-macaque", "javan-myna", "banded-bullfrog"].includes(species.id)), "national filter must not use global risk or unknown status");
  assert.deepEqual(filterSpecies("heron", "Bird", "Rare or restricted", "CR").map(s => s.id), ["great-billed-heron"]);
  assert.equal(filterSpecies("heron", "Mammal", "All", "Threatened").length, 0);
  assert.equal(filterSpecies("", "All", "All", "INVALID").length, 0);
  assert.equal(filterSpecies("", "All", "All", "All").length, 94);
});

test("origin, national risk and dated global assessments remain separate", async () => {
  const { SINGAPORE_SPECIES, speciesById } = await vite.ssrLoadModule("/app/species-data.ts");
  assert.equal(speciesById("javan-myna").origin, "Introduced");
  assert.equal(speciesById("javan-myna").statusCode, "NA");
  assert.equal(speciesById("red-junglefowl").statusCode, "NT");
  assert.equal(speciesById("banded-bullfrog").statusCode, "UNV");
  assert.ok(speciesById("banded-bullfrog").statusNote.includes("No RDB3 row"));
  assert.match(speciesById("javan-myna").globalStatus, /Vulnerable.*2020/);
  assert.equal(speciesById("long-tailed-macaque").statusCode, "LC");
  assert.match(speciesById("long-tailed-macaque").globalStatus, /Endangered.*2025/);
  assert.equal(speciesById("long-tailed-macaque").globalAssessedAt, undefined, "announcement date must not become an assessment date");
  assert.equal(speciesById("house-crow").origin, "Introduced", "global geographic metadata must not overwrite NParks local origin");
  const python = speciesById("reticulated-python");
  assert.match(python.globalStatus, /Least Concern.*2018/);
  assert.equal(python.globalAssessedAt, "2011-09-02", "assessment and publication dates must remain distinct");
  for (const id of ["clouded-monitor", "sumatran-palm-civet"]) {
    const animal = speciesById(id);
    assert.match(animal.globalStatus, /^Not separately assessed/);
    assert.match(animal.globalAssessmentNote, /broader/i);
    assert.equal(animal.globalAssessedAt, undefined, "a broader taxon must not create a separate assessment date");
  }
  assert.match(speciesById("malayan-horned-frog").globalAssessmentNote, /Megophrys nasuta/);
  assert.equal(SINGAPORE_SPECIES.filter(animal => animal.globalSourceUrl).length, 94);
  for (const animal of SINGAPORE_SPECIES) {
    if (!animal.globalSourceUrl) {
      assert.match(animal.globalStatus, /not verified/);
      assert.equal(animal.globalAssessedAt, undefined, `${animal.id}: unknown assessment must not have an invented date`);
    } else {
      assert.equal(new URL(animal.globalSourceUrl).protocol, "https:");
      assert.ok(/20\d{2}/.test(animal.globalStatus) || /not evaluated/i.test(animal.globalStatus), `${animal.id}: global claim needs a dated assessment or an explicit non-assessment`);
    }
  }
});

test("profile review dates are preserved when only global assessment evidence is refreshed", async () => {
  const { SINGAPORE_SPECIES, speciesById } = await vite.ssrLoadModule("/app/species-data.ts");
  assert.equal(SINGAPORE_SPECIES.filter(s => s.reviewedAt === "2026-09-05").length, 30);
  assert.equal(SINGAPORE_SPECIES.filter(s => s.reviewedAt === "2026-09-06").length, 19);
  for (const id of ["long-tailed-macaque", "javan-myna", "house-crow", "asian-koel", "black-naped-oriole", "collared-kingfisher", "red-junglefowl", "malayan-water-monitor", "reticulated-python"]) {
    const animal = speciesById(id);
    assert.equal(animal.reviewedAt, "2026-09-05", `${id}: older full-profile date must survive`);
    const renewed = ["javan-myna", "house-crow", "black-naped-oriole", "collared-kingfisher"].includes(id);
    assert.equal(animal.globalReviewedAt, renewed ? "2026-09-07" : "2026-09-06", `${id}: global review date mismatch`);
  }
  assert.equal(speciesById("sunda-colugo").globalReviewedAt, undefined, "untouched global evidence must not be stamped as freshly reviewed");
  assert.equal(speciesById("great-billed-heron").globalAssessedAt, "2024-07-22");
  assert.equal(speciesById("purple-heron").globalAssessedAt, "2019-08-14");
});

test("reference publisher names match source ownership instead of labelling every source NParks", async () => {
  const { SINGAPORE_SPECIES, speciesById } = await vite.ssrLoadModule("/app/species-data.ts");
  for (const animal of SINGAPORE_SPECIES) {
    const hostname = new URL(animal.sourceUrl).hostname;
    assert.ok(animal.sourceName?.trim(), `${animal.id}: missing reference publisher`);
    if (hostname === "nparks.gov.sg" || hostname.endsWith(".nparks.gov.sg")) {
      assert.match(animal.sourceName, /NParks|National Parks/i);
    } else {
      assert.doesNotMatch(animal.sourceName, /NParks|National Parks/i, `${animal.id}: wrong publisher attribution`);
    }
  }
  assert.match(speciesById("blue-eared-kingfisher").sourceName, /Bird Society/i);
  for (const id of ["small-toothed-palm-civet", "malayan-horned-frog"]) {
    assert.match(speciesById(id).sourceName, /NUS|National University|Lee Kong Chian/i);
  }
});

test("source registry checks every profile, global assessment and fun-fact source beyond 96 links", async () => {
  const { SINGAPORE_SPECIES } = await vite.ssrLoadModule("/app/species-data.ts");
  const { collectSourceLinks } = await vite.ssrLoadModule("/app/source-registry.ts");
  const { canonicalSourceKey, isApprovedCheckUrl } = await vite.ssrLoadModule("/app/source-url-policy.ts");
  const links = collectSourceLinks({ dailyFacts: [], newsFeeds: [] });
  const keys = new Set(links.map(s => s.canonicalKey));
  assert.ok(links.length > 96);
  for (const animal of SINGAPORE_SPECIES) {
    for (const url of [animal.sourceUrl, animal.statusSourceUrl, animal.globalSourceUrl, ...animal.sources.map(s => s.url), ...animal.funFacts.map(f => f.sourceUrl || animal.sourceUrl)].filter(Boolean)) {
      assert.ok(keys.has(canonicalSourceKey(url)), `${animal.id}: missing ${url}`);
      assert.ok(isApprovedCheckUrl(url), `${animal.id}: source host omitted from automatic checks: ${url}`);
    }
    if (animal.globalSourceUrl) {
      const globalLink = links.find(link => link.canonicalKey === canonicalSourceKey(animal.globalSourceUrl));
      assert.ok(globalLink.categories.includes("global-status"), `${animal.id}: global evidence lost its category when deduplicating`);
    }
  }
  const { checkSourceLinks } = await vite.ssrLoadModule("/app/source-checker.ts");
  const calls = [];
  const result = await checkSourceLinks(links, new Map(), async (url) => { calls.push(url); return new Response(null, {status: 200}); });
  assert.equal(result.length, links.length);
  assert.equal(new Set(calls).size, result.filter(r => r.approvedHost).length);
  assert.ok(result.slice(96).every(r => r.status === "healthy" || !r.approvedHost));
});
