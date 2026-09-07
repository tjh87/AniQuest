// Build local source snapshots for the birds that do not yet have AniQuest profiles.
import { readFile, writeFile } from "node:fs/promises";

const directory = JSON.parse(await readFile(new URL("../app/bird-directory.json", import.meta.url), "utf8"));
const existing = new Set(["red-junglefowl", "buffy-fish-owl", "white-bellied-sea-eagle", "changeable-hawk-eagle"]);
const candidates = directory.groups.flatMap(group => group.birds.map(bird => ({ ...bird, family: group.family }))).filter(bird => !existing.has(bird.id));
const strip = value => (value ?? "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
const records = await Promise.all(candidates.map(async bird => {
  const response = await fetch(`https://singaporebirds.com/api/species/${bird.id}/core`);
  if (!response.ok) throw new Error(`${bird.name}: HTTP ${response.status}`);
  const { species } = await response.json();
  const data = species.enrichment;
  const missing = [
    !data?.identificationText && "identification",
    !data?.habitatText && "habitat",
    !data?.behaviourText && "behaviour",
    !data?.photoUrlVariants?.[0]?.w400 && "photo",
  ].filter(Boolean);
  return {
    id: bird.id, name: bird.name, scientific: bird.scientific, family: data.familyScientific ?? bird.family,
    occurrence: bird.localStatus, status: data.conservationStatus ?? "Not evaluated", citation: data.conservationCitation ?? null,
    identification: strip(data.identificationText), habitat: strip(data.habitatText), behaviour: strip(data.behaviourText),
    fact: strip(data.interestingInfo) || strip(data.behaviourText), sourceUrl: data.linkSite || bird.sourceUrl,
    photo: data.photoUrlVariants?.[0]?.w400 ? { src: data.photoUrlVariants[0].w400, alt: data.photoCaptions?.[0] || `Reference photograph of ${bird.name}`, photographer: data.photoCredits?.[0] || "Bird Society of Singapore", sourceUrl: data.linkSite || bird.sourceUrl } : null,
    missing,
  };
}));
await writeFile(new URL("../docs/research/bird-profile-snapshot-2026-09-07.json", import.meta.url), JSON.stringify({ checkedAt: new Date().toISOString(), source: "Bird Society of Singapore", records }, null, 2) + "\n");
console.log(`Recorded ${records.length} full Bird Society accounts.`);
