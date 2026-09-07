import { readFile, writeFile, mkdir } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { collectContent, hashContent } from "./content-ledger.mjs";

export function validateReview(content, args) {
  const record = content[args.id];
  if (!record) throw new Error("Choose a known content ID from app/content-index.json.");
  const value = args.claim?.split(".").reduce((item, key) => item?.[key], record);
  if (typeof value !== "string" || !value.trim()) throw new Error("Choose a text field from that content record.");
  if (!["supported", "needs-correction", "unverified"].includes(args.status)) throw new Error("Choose supported, needs-correction or unverified.");
  if (!args.reviewer?.trim() || !args.note || args.note.length < 20) throw new Error("Supply a reviewer and a specific support or correction note of at least 20 characters.");
  if (args.additionalSources !== undefined && !Array.isArray(args.additionalSources)) throw new Error("Additional sources must be an array of HTTPS URLs.");
  const sourceUrls = [...new Set([args.source, ...(args.additionalSources ?? [])])];
  for (const source of sourceUrls) {
    const url = new URL(source);
    if (url.protocol !== "https:" || url.username || url.password) throw new Error("Use HTTPS sources without credentials.");
    if (!JSON.stringify(record).includes(source) && args.newSource !== "true") throw new Error("Use a linked source, or explicitly record a new source with --newSource true.");
  }
  return { contentId: args.id, claim: args.claim, claimText: value, hash: hashContent(record), sourceUrl: args.source, ...(sourceUrls.length > 1 ? { additionalSources: sourceUrls.slice(1) } : {}), status: args.status, reviewer: args.reviewer.trim(), note: args.note, reviewedAt: new Date().toISOString() };
}

async function main() {
  const args = {};
  for (let i = 2; i < process.argv.length; i += 2) args[process.argv[i].replace(/^--/, "")] = process.argv[i + 1];
  const root = fileURLToPath(new URL("..", import.meta.url));
  const review = validateReview(await collectContent(root), args);
  const folder = path.join(root, "docs/editorial/reviews");
  await mkdir(folder, { recursive: true });
  await writeFile(path.join(folder, `${Date.now()}-${randomUUID()}.json`), JSON.stringify(review, null, 2) + "\n", { flag: "wx" });
  const file = path.join(root, "app/content-reviews.json");
  const records = JSON.parse(await readFile(file, "utf8"));
  await writeFile(file, JSON.stringify([...records, review], null, 2) + "\n");
  console.log("Claim review recorded. No network check or factual conclusion was inferred by this command.");
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { console.error(error.message); process.exitCode = 1; });
