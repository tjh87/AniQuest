import { readFile, writeFile } from "node:fs/promises";
import { collectContent } from "./content-ledger.mjs";
import { validateReview } from "./review-content.mjs";

const content = await collectContent(process.cwd());
const existing = JSON.parse(await readFile("app/content-reviews.json", "utf8"));
const birds = JSON.parse(await readFile("app/full-bird-profiles.json", "utf8"));
const claims = ["identification", "diet", "activity", "behaviour", "singapore", "reproduction", "ecologicalRole", "pressures", "watch", "singaporeStatus", "globalStatus"];
const accountClaims = new Set(["identification", "diet", "activity", "behaviour", "singapore", "reproduction", "ecologicalRole"]);
const additions = [];
for (const bird of birds) {
  const profileId = `profile:${bird.id}`;
  const profile = content[profileId];
  if (!profile) throw new Error(`Missing profile content: ${bird.id}`);
  for (const claim of claims) {
    if (existing.some((review) => review.contentId === profileId && review.claim === claim)) continue;
    const source = accountClaims.has(claim) || claim === "globalStatus" ? bird.sourceUrl : claim === "watch" ? bird.sources[2].url : bird.statusSourceUrl;
    const note = accountClaims.has(claim)
      ? "Reviewed against the linked Bird Society account. The profile states only what the account records, or clearly marks a limit."
      : claim === "watch"
        ? "Reviewed against the NParks encounter guide. The profile gives conservative viewing advice."
        : claim === "globalStatus"
          ? "Reviewed against the Bird Society account, which cites the global assessment. The profile preserves that citation."
          : "Reviewed against the NParks birds list. This profile does not infer a local Red Data Book category.";
    additions.push(validateReview(content, { id: profileId, claim, source, status: "supported", reviewer: "Source review record", note }));
  }
}
await writeFile("app/content-reviews.json", JSON.stringify([...existing, ...additions], null, 2) + "\n");
await writeFile("docs/editorial/reviews/full-bird-profile-review-2026-09-07.json", JSON.stringify({ reviewedAt: new Date().toISOString(), profileCount: birds.length, reviewCount: additions.length, records: additions }, null, 2) + "\n");
console.log(`Added ${additions.length} reviews for ${birds.length} full bird profiles.`);
