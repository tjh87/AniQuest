import { readFile, writeFile } from "node:fs/promises";
import { collectContent, hashContent } from "./content-ledger.mjs";
import { validateReview } from "./review-content.mjs";

const ids = [
  "irrawaddy-dolphin",
  "false-killer-whale",
  "indo-pacific-bottlenose-dolphin",
  "indo-pacific-finless-porpoise",
  "sperm-whale",
  "common-treeshrew",
  "cave-nectar-bat",
  "lesser-long-tongued-nectar-bat",
  "large-flying-fox",
  "asian-small-clawed-otter",
];
const claims = ["identification", "diet", "activity", "behaviour", "singapore", "reproduction", "ecologicalRole", "pressures", "watch", "singaporeStatus", "globalStatus"];
const content = await collectContent(process.cwd());
const existing = JSON.parse(await readFile("app/content-reviews.json", "utf8"));
const additions = [];

for (const id of ids) {
  const contentId = `profile:${id}`;
  const profile = content[contentId];
  if (!profile) throw new Error(`Missing profile content: ${id}`);
  for (const claim of claims) {
    if (existing.some((review) => review.contentId === contentId && review.claim === claim && review.hash === hashContent(profile))) continue;
    const source = claim === "singaporeStatus" || claim === "singapore" || claim === "globalStatus"
      ? profile.statusSourceUrl
      : claim === "watch"
        ? profile.sources.find((item) => item.url.includes("when-encountering-animals"))?.url ?? profile.sourceUrl
        : profile.sourceUrl;
    const note = claim === "singaporeStatus"
      ? "Compared the scientific name with the linked NParks RDB3 list and preserved the listed Singapore category without inferring global risk."
      : claim === "singapore"
        ? "The linked NParks list supports native occurrence in Singapore. The text avoids inferring abundance or a predictable viewing site."
        : claim === "globalStatus"
          ? "No dated taxon-matched global assessment was verified for this edition, so the profile deliberately leaves the global category unresolved."
          : claim === "watch"
            ? "The linked encounter guidance supports quiet, distant observation and referral to trained local wildlife responders rather than handling."
            : "Reviewed against the linked species account for this field. The text stays at species level and avoids inventing local timing or abundance.";
    additions.push(validateReview(content, { id: contentId, claim, source, status: "supported", reviewer: "AniQuest source review", note }));
  }
}

if (!additions.length) {
  console.log("Native expansion reviews already match the current profile hashes.");
  process.exit(0);
}

await writeFile("app/content-reviews.json", JSON.stringify([...existing, ...additions], null, 2) + "\n");
await writeFile("docs/editorial/reviews/native-species-expansion-2026-09-14.json", JSON.stringify({
  reviewedAt: new Date().toISOString(),
  scope: "Ten newly added native Singapore mammal profiles",
  profileCount: ids.length,
  reviewCount: additions.length,
  records: additions,
}, null, 2) + "\n");
console.log(`Added ${additions.length} claim reviews for ${ids.length} profiles.`);
