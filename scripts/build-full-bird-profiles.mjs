import { readFile, writeFile } from "node:fs/promises";

const snapshot = JSON.parse(await readFile(new URL("../docs/research/bird-profile-snapshot-2026-09-07.json", import.meta.url), "utf8"));
const emojiFor = (family) => family === "Phasianidae" ? "🐔" : family === "Strigidae" || family === "Tytonidae" ? "🦉" : "🦅";
const encounterFor = (occurrence) => /common|very common/i.test(occurrence) ? "Commonly seen" : /vagrant|visitor|rare/i.test(occurrence) ? "Rare or restricted" : "Elusive";
const sourceUrl = "https://www.nparks.gov.sg/nature/species-list/birds";
const guideUrl = "https://www.nparks.gov.sg/visit/when-visiting-parks/when-encountering-animals";
const profiles = snapshot.records.map((bird) => {
  const behaviour = bird.behaviour || "The linked Bird Society account records identification and habitat. It does not give a behaviour summary for this entry.";
  const role = bird.family === "Phasianidae" ? "A ground-foraging bird that links seeds and small invertebrates to the food web." : "A predator or scavenger in the local food web.";
  return {
    ...bird,
    emoji: emojiFor(bird.family), group: "Bird", aliases: [], origin: "Native", encounter: encounterFor(bird.occurrence),
    habitats: bird.habitat.split(/[;,]/).map((item) => item.trim()).filter(Boolean),
    summary: `${bird.occurrence}. ${bird.habitat}`,
    diet: "Use the linked Bird Society account for its recorded food and hunting details.",
    activity: behaviour,
    behaviour,
    reproduction: "This profile does not infer Singapore breeding. Check the linked Bird Society account before you record nesting behaviour.",
    singapore: `Bird Society of Singapore records this as ${bird.occurrence.toLowerCase()}.`,
    ecologicalRole: role,
    pressures: "This profile does not infer local threats from occurrence. Check the Singapore Red Data Book for an assessment.",
    watch: "Keep a safe distance. Do not feed, call, chase, or approach a bird or nest.",
    funFacts: [
      { title: "Field note", text: bird.fact, sourceUrl: bird.sourceUrl },
      { title: "Observation", text: bird.identification, sourceUrl: bird.sourceUrl },
    ],
    sources: [
      { name: "Bird Society of Singapore account", url: bird.sourceUrl, supports: "Identification, habitat, local occurrence, behaviour and field note." },
      { name: "NParks Singapore birds list", url: sourceUrl, supports: "Singapore Red Data Book reference." },
      { name: "NParks animal encounter guide", url: guideUrl, supports: "Safe wildlife observation." },
    ],
    statusNote: "No local Red Data Book category is inferred here. Open the NParks list for the current assessment.",
    habitat: bird.habitat,
    rarity: bird.occurrence,
    singaporeStatus: "Not assessed here",
    statusCode: "UNV",
    globalStatus: `${bird.status}${bird.citation ? ` · ${bird.citation}` : ""}`,
    sourceUrl: bird.sourceUrl,
    sourceName: "Bird Society of Singapore",
    statusSourceUrl: sourceUrl,
    globalSourceUrl: bird.sourceUrl,
    reviewedAt: "2026-09-07",
  };
});
await writeFile(new URL("../app/full-bird-profiles.json", import.meta.url), JSON.stringify(profiles, null, 2) + "\n");
console.log(`Built ${profiles.length} full bird profiles.`);
