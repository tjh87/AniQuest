import { createHash } from "node:crypto";
import { readFile, mkdir, writeFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

export const hashContent = value => createHash("sha256").update(JSON.stringify(value)).digest("hex");
export function contentChanges(previous, current) {
  return [...new Set([...Object.keys(previous), ...Object.keys(current)])].sort().flatMap(id => {
    const before = previous[id] ?? null, after = current[id] ?? null;
    return hashContent(before) === hashContent(after) ? [] : [{ id, before, after, hash: hashContent(after) }];
  });
}

export async function collectContent(root) {
  const vite = await createServer({ configFile: false, root, appType: "custom", server: { middlewareMode: true, hmr: false }, optimizeDeps: { noDiscovery: true, include: [] } });
  try {
    const { SINGAPORE_SPECIES } = await vite.ssrLoadModule("/app/species-data.ts");
    const { ALL_LEARNING_QUESTIONS } = await vite.ssrLoadModule("/app/learning-records.ts");
    const content = {};
    for (const species of SINGAPORE_SPECIES) content[`profile:${species.id}`] = species;
    for (const q of ALL_LEARNING_QUESTIONS) content[`quiz:${q.id}`] = q;
    const app = await readFile(path.join(root, "app/aniquest-app.tsx"), "utf8");
    content["lesson:rainforest-01"] = app.slice(app.indexOf("function LearnView("), app.indexOf("function FieldView("));
    const files = await readdir(path.join(root, "app"));
    const template = files.includes("species-journey.tsx") ? "species-journey.tsx" : "otter-journey.tsx";
    content["lesson-template:journey"] = await readFile(path.join(root, "app", template), "utf8");
    content["guide:bird-directory-data"] = JSON.parse(await readFile(path.join(root, "app/bird-directory.json"), "utf8"));
    for (const file of ["bird-directory.tsx", "field-resources.tsx"]) content[`guide:${file}`] = await readFile(path.join(root, "app", file), "utf8");
    for (const s of SINGAPORE_SPECIES) {
      const questions = ALL_LEARNING_QUESTIONS.filter(q => q.speciesIds.includes(s.id) && (q.id.includes("-pre-") || q.id.includes("-post-")));
      if (questions.length) content[`lesson:${s.id}`] = { species: s, questions, templateHash: hashContent(content["lesson-template:journey"]) };
    }
    return content;
  } finally { await vite.close(); }
}

async function main() {
  const root = fileURLToPath(new URL("..", import.meta.url));
  const folder = path.join(root, "docs/editorial/changes");
  await mkdir(folder, { recursive: true });
  const previous = {};
  const files = (await readdir(folder)).filter(f => /^\d+\.json$/.test(f)).sort();
  for (const file of files) for (const change of JSON.parse(await readFile(path.join(folder, file), "utf8")).changes) {
    if (change.after === null) delete previous[change.id]; else previous[change.id] = change.after;
  }
  const current = await collectContent(root);
  const changes = contentChanges(previous, current);
  for (const change of changes) {
    if (change.id.startsWith("quiz:") && change.before && change.after && change.before.version === change.after.version) {
      throw new Error(`Update the question version before recording changed quiz content: ${change.id}`);
    }
  }
  if (process.argv.includes("--check")) {
    if (changes.length) throw new Error(`${changes.length} content records lack an editorial snapshot. Run npm run content:record.`);
    console.log(`Editorial snapshots match ${Object.keys(current).length} content records.`); return;
  }
  if (changes.length) {
    const number = String(files.length + 1).padStart(6, "0");
    const event = { recordedAt: new Date().toISOString(), actor: process.env.ANIQUEST_EDITOR || "local build (automated snapshot)", reason: process.env.ANIQUEST_EDIT_REASON || "Capture source changes; not a factual approval", changes };
    await writeFile(path.join(folder, `${number}.json`), JSON.stringify(event, null, 2) + "\n", { flag: "wx" });
  }
  // A compact index enters the application. Full before/after text stays in the local ledger.
  const index = {};
  for (const file of (await readdir(folder)).filter(f => /^\d+\.json$/.test(f)).sort()) {
    const event = JSON.parse(await readFile(path.join(folder, file), "utf8"));
    for (const change of event.changes) index[change.id] = { hash: change.hash, recordedAt: event.recordedAt, revision: (index[change.id]?.revision ?? 0) + 1 };
  }
  await writeFile(path.join(root, "app/content-index.json"), JSON.stringify(index, null, 2) + "\n");
  console.log(`Recorded ${changes.length} content changes. No factual approvals were inferred.`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { console.error(error.message); process.exitCode = 1; });
