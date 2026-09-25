import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createLocalServer } from "./serve-local.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const report = JSON.parse(await readFile(path.join(root, "docs/handoff/OFFLINE_INVENTORY.json"), "utf8"));
const build = path.join(root, "dist-local");
const html = await readFile(path.join(build, "index.html"), "utf8");
assert.doesNotMatch(html, /(?:src|href)=["']https?:/);
let files = 0;
async function walk(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, item.name);
    if (item.isDirectory()) await walk(p);
    else { assert.ok((await stat(p)).size > 0, p); files++; }
  }
}
await walk(build);
for (const photo of report.photos.filter(p => p.bundled)) await stat(path.join(build, photo.src.slice(1)));
const server = await createLocalServer({ root: build });
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
try {
  const origin = `http://127.0.0.1:${server.address().port}`;
  const home = await fetch(origin);
  assert.equal(home.status, 200);
  assert.match(home.headers.get("content-security-policy"), /connect-src 'self'/);
  assert.match(home.headers.get("content-security-policy"), /img-src 'self' data: blob:/);
  for (const match of html.matchAll(/(?:src|href)=["'](\/[^"']+)["']/g)) {
    const response = await fetch(origin + match[1]);
    assert.equal(response.status, 200, match[1]);
  }
  assert.equal((await fetch(origin + "/api/progress")).status, 404);
  assert.equal((await fetch(origin + "/package.json")).status, 404);
  console.log(`Offline package: ${report.profileCount} profiles, ${report.questionCount} questions, ${report.bundledPhotos} bundled photos, ${files} build files verified.`);
} finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
