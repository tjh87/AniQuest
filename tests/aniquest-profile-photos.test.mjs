import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import path from "node:path";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false } });
after(() => vite.close());

test("every animal profile has a distinct credited reference photograph", async () => {
  const [{ SINGAPORE_SPECIES }, { PROFILE_PHOTOS }] = await Promise.all([
    vite.ssrLoadModule("/app/species-data.ts"),
    vite.ssrLoadModule("/app/profile-photos.ts"),
  ]);
  assert.equal(Object.keys(PROFILE_PHOTOS).length, SINGAPORE_SPECIES.length);
  assert.equal(new Set(Object.values(PROFILE_PHOTOS).map((photo) => photo.src)).size, SINGAPORE_SPECIES.length);
  for (const animal of SINGAPORE_SPECIES) {
    const photo = PROFILE_PHOTOS[animal.id];
    assert.ok(photo, `${animal.id}: missing profile photograph`);
    const normalise = (value) => value.toLowerCase().replace(/[’']/g, "");
    assert.ok(normalise(photo.alt).includes(normalise(animal.name)), `${animal.id}: photo caption must name the animal`);
    assert.match(photo.sourceUrl, /^https:\/\//);
    assert.match(photo.src, /^(?:\/|https:\/\/)/);
    if (photo.src.startsWith("/")) {
      assert.match(photo.licenseUrl ?? "", /^https?:\/\//);
      assert.doesNotMatch(photo.license ?? "", /all rights reserved|licence shown/i);
      await access(path.join(root, "public", photo.src.slice(1)));
    } else {
      assert.ok(photo.photographer, `${animal.id}: external image needs credit`);
    }
  }
});
