import { readdir, mkdir, copyFile, readFile, writeFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(root, "portable-stage", "AniQuest");
try { await stat(output); throw new Error("portable-stage/AniQuest already exists. Move the old stage before packaging again."); }
catch (error) { if (error.code !== "ENOENT") throw error; }
await stat(path.join(root, "dist-local/index.html"));
await stat(path.join(root, "runtime/windows-x64/node.exe"));
const excluded = new Set([".git", "node_modules", ".npm-cache", ".sites-runtime", ".wrangler", ".next", "dist", "portable-stage", "releases", "outputs", "work", "backups", ".openai"]);
const manifest = [];
async function copy(dir, relative = "") {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if ((!relative && excluded.has(entry.name)) || entry.name === ".git" || (entry.name.startsWith(".env") && entry.name !== ".env.example") || /\.(pem|key|log|tsbuildinfo)$/.test(entry.name) || /^aniquest-(progress|before-import)-.*\.json$/i.test(entry.name)) continue;
    const rel = path.join(relative, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Unexpected symlink: ${rel}`);
    if (entry.isDirectory()) await copy(path.join(dir, entry.name), rel);
    else {
      const dest = path.join(output, rel);
      await mkdir(path.dirname(dest), { recursive: true });
      await copyFile(path.join(dir, entry.name), dest);
      const data = await readFile(dest);
      manifest.push({ path: rel.replaceAll("\\", "/"), bytes: data.length, sha256: createHash("sha256").update(data).digest("hex") });
    }
  }
}
await copy(root);
await writeFile(path.join(output, "PACKAGE_MANIFEST.json"), JSON.stringify({ schemaVersion: 1, files: manifest.sort((a,b) => a.path.localeCompare(b.path)) }, null, 2) + "\n");
console.log(`Staged ${manifest.length} files in ${output}`);
