import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const lock = JSON.parse(await readFile(path.join(root, "package-lock.json"), "utf8"));
const records = [];
const sections = ["AniQuest installed dependency licence notices\nGenerated from package-lock.json and installed packages.\nNode's portable runtime has its own LICENSE and bundled npm notices.\n"];
for (const location of Object.keys(lock.packages).filter(p => p.startsWith("node_modules/")).sort()) {
  const folder = path.join(root, location);
  let pkg;
  try { pkg = JSON.parse(await readFile(path.join(folder, "package.json"), "utf8")); }
  catch (error) { if (error.code === "ENOENT") continue; throw error; }
  const files = (await readdir(folder)).filter(name => /^(licen[sc]e|copying|notice)([.\-_]|$)/i.test(name));
  const record = { name: pkg.name, version: pkg.version, license: pkg.license ?? "See upstream package", location, noticeFiles: files };
  records.push(record);
  sections.push(`\n${"=".repeat(72)}\n${pkg.name}@${pkg.version}\nPackage: ${location}\nDeclared licence: ${JSON.stringify(record.license)}\n`);
  for (const name of files) {
    try { sections.push(`\n--- ${name} ---\n${await readFile(path.join(folder, name), "utf8")}\n`); }
    catch (error) { if (error.code !== "EISDIR") throw error; }
  }
  if (!files.length) sections.push("No top-level licence text in this installed package; consult its upstream package for terms.\n");
}
await mkdir(path.join(root, "docs/licenses"), { recursive: true });
await writeFile(path.join(root, "docs/licenses/DEPENDENCIES.json"), JSON.stringify(records, null, 2) + "\n");
await writeFile(path.join(root, "docs/licenses/THIRD_PARTY_LICENSES.txt"), sections.join("").replaceAll("\r\n", "\n").split("\n").map(line => line.trimEnd()).join("\n").trimEnd() + "\n");
console.log(`Recorded ${records.length} installed packages and their available licence notices.`);
