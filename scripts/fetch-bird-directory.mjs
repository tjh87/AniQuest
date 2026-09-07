// Read public checklist metadata only. No photographs, location records or factual approvals are copied.
import { writeFile } from "node:fs/promises";

const origin = "https://singaporebirds.com";
const families = ["accipitridae", "pandionidae", "falconidae", "tytonidae", "strigidae", "phasianidae"];
const groups = await Promise.all(families.map(async family => {
  const response = await fetch(`${origin}/api/family/${family}`);
  if (!response.ok) throw new Error(`${family}: HTTP ${response.status}`);
  const data = await response.json();
  if (!data.species?.length || data.species.length !== data.speciesCount) throw new Error(`Incomplete family: ${family}`);
  return {
    family: data.familyScientific,
    sourceUrl: `${origin}/family/${family}`,
    birds: data.species.map(bird => ({
      id: bird.slug, name: bird.common, scientific: bird.sci,
      localStatus: bird.localStatus,
      statuses: (bird.statusesSg ?? []).map(status => status.short_name),
      sourceUrl: `${origin}/species/${bird.slug}/`,
    })),
  };
}));
const snapshot = { checkedAt: new Date().toISOString().slice(0, 10), source: "Bird Society of Singapore", sourceUrl: `${origin}/checklist?view=basic`, scope: "Current accepted checklist; not every historical or disputed record", groups };
await writeFile(new URL("../app/bird-directory.json", import.meta.url), JSON.stringify(snapshot, null, 2) + "\n");
console.log(groups.map(group => `${group.family}: ${group.birds.length}`).join("\n"));
