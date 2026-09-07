import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const read = name => readFile(new URL(`../${name}`, import.meta.url), "utf8");
const directory = JSON.parse(await read("app/bird-directory.json"));
const birds = directory.groups.flatMap(group => group.birds);
const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false } });
after(() => vite.close());

test("the source snapshot covers all six selected checklist families", () => {
  assert.deepEqual(Object.fromEntries(directory.groups.map(group => [group.family, group.birds.length])), {
    Accipitridae: 30, Pandionidae: 1, Falconidae: 6, Tytonidae: 1, Strigidae: 9, Phasianidae: 2,
  });
  assert.equal(new Set(birds.map(bird => bird.id)).size, 49);
  assert.equal(birds.filter(bird => bird.id === "red-junglefowl").length, 1);
  assert.ok(birds.some(bird => bird.statuses.includes("Vagrant")));
  assert.ok(birds.some(bird => bird.statuses.includes("Migrant")));
  for (const bird of birds) {
    assert.ok(bird.scientific && bird.name && bird.localStatus && bird.statuses.length, bird.id);
    assert.equal(bird.sourceUrl, `https://singaporebirds.com/species/${bird.id}/`);
    assert.equal("globalStatus" in bird, false, "Occurrence must not become a global risk assessment");
    assert.equal("reviewedAt" in bird, false, "A metadata fetch is not a full factual review");
  }
});

test("every listed bird now has an AniQuest profile and a credited photograph", async () => {
  const { SINGAPORE_SPECIES } = await vite.ssrLoadModule("/app/species-data.ts");
  const { profilePhotoFor } = await vite.ssrLoadModule("/app/wildlife-photos.tsx");
  for (const bird of birds) {
    const profile = SINGAPORE_SPECIES.find((species) => species.id === bird.id);
    assert.ok(profile, `${bird.id}: missing profile`);
    assert.ok(profile.sources.length >= 1, `${bird.id}: missing linked sources`);
    const photo = profilePhotoFor(bird.id);
    assert.ok(photo?.src && photo?.photographer && photo?.sourceUrl, `${bird.id}: missing credited photograph`);
  }
});

test("all journey sections are buttons and incomplete checks do not produce comparison scores", async () => {
  const journey = await read("app/species-journey.tsx");
  for (const id of ["encounter", "learn", "review"]) assert.ok(journey.includes(`['${id}',`));
  assert.match(journey, /button type="button" aria-current=.*onClick=\{\(\) => chooseStep\(id\)\}/);
  assert.match(journey, /before.length === 3 && after.length === 3 \?/);
  assert.match(journey, /No complete comparison yet/);
  assert.match(journey, /findIndex\(q => !answered.some/);
});

test("the field guide gives safe methods without claiming uploads or survey submission", async () => {
  const guide = await read("app/field-resources.tsx");
  assert.match(guide, /not an official survey/);
  assert.match(guide, /does not save field notes/);
  assert.match(guide, /does not send sightings or rescue requests/);
  assert.match(guide, /Do not play calls to attract birds/);
  assert.match(guide, /Garden Bird Watch/);
  assert.match(guide, /raptor-guide/);
});
