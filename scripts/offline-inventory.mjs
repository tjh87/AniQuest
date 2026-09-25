import { createServer } from "vite";
import { access, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const vite = await createServer({ configFile: false, root, appType: "custom", resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false } });
try {
  const { SINGAPORE_SPECIES: species } = await vite.ssrLoadModule("/app/species-data.ts");
  const { PROFILE_PHOTOS: photos } = await vite.ssrLoadModule("/app/profile-photos.ts");
  const { ALL_LEARNING_QUESTIONS: questions } = await vite.ssrLoadModule("/app/learning-records.ts");
  const rows = [];
  for (const animal of species) {
    const photo = photos[animal.id];
    if (!photo) throw new Error(`Missing photo metadata: ${animal.id}`);
    const bundled = photo.src.startsWith("/") && !photo.src.startsWith("//");
    if (bundled) await access(path.join(root, "public", photo.src.slice(1)));
    rows.push({ id: animal.id, name: animal.name, group: animal.group, habitat: animal.habitat, bundled, ...photo });
  }
  const report = { schemaVersion: 1, profileCount: species.length, questionCount: questions.length,
    groups: Object.fromEntries(["Bird", "Mammal", "Reptile", "Amphibian"].map(group => [group, species.filter(s => s.group === group).length])),
    bundledPhotos: rows.filter(r => r.bundled).length, linkedPhotos: rows.filter(r => !r.bundled).length, photos: rows };
  await mkdir(path.join(root, "docs", "handoff"), { recursive: true });
  await writeFile(path.join(root, "docs", "handoff", "OFFLINE_INVENTORY.json"), JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify({ ...report, photos: undefined }, null, 2));
} finally { await vite.close(); }
