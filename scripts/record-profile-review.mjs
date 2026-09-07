import { readFile, writeFile } from 'node:fs/promises';
import { collectContent } from './content-ledger.mjs';
import { validateReview } from './review-content.mjs';

// Records the explicit source-comparison decisions. This script does not verify facts.
const decisions = JSON.parse(await readFile('docs/editorial/profile-review-decisions-2026-09-07.json', 'utf8'));
const content = await collectContent(process.cwd());
const existing = JSON.parse(await readFile('app/content-reviews.json', 'utf8'));
const claims = ['identification', 'diet', 'activity', 'behaviour', 'singapore', 'reproduction', 'ecologicalRole', 'pressures', 'watch', 'singaporeStatus', 'globalStatus'];
const notes = {
  identification: 'Identification features were compared with the source description. This is a recognition guide, not identification from a single trait.',
  diet: 'The food categories match the inspected feeding account. No measured Singapore diet proportions are inferred.',
  activity: 'The activity statement matches the inspected account or field observation. It does not promise a sighting at a fixed time.',
  behaviour: 'The behaviour statement matches the inspected account. Observation cautions are editorial guidance, not measured behaviour.',
  singapore: 'The local habitat and occurrence statement matches the inspected record. Historical records are not current population estimates.',
  reproduction: 'The reproduction statement matches the inspected account. General life history is not a Singapore breeding calendar.',
  ecologicalRole: 'The recorded feeding or life-cycle evidence supports this qualitative food-web interpretation. It does not establish a measured local impact.',
  pressures: 'The inspected habitat or threat account supports this conservation summary. Habitat recommendations are inferences, not measured local decline rates.',
  watch: 'The encounter guidance supports the main actions. Conservative viewing cautions are editorial advice, not guarantees of safety.',
};
const additions = [];
for (const [id, p] of Object.entries(content).filter(([id]) => id.startsWith('profile:'))) {
  const decision = decisions[p.id];
  if (!decision) throw new Error(`Missing decision: ${id}`);
  const urls = [...new Set([p.sourceUrl, ...p.sources.map(s => s.url), p.statusSourceUrl, p.globalSourceUrl].filter(Boolean))];
  for (const claim of claims) {
    if (existing.some(r => r.contentId === id && r.claim === claim)) continue;
    let status = 'unverified';
    let source = claim === 'globalStatus' ? p.globalSourceUrl || p.sourceUrl : p.sourceUrl;
    let note = `Reviewed ${claim.replace(/([A-Z])/g, ' $1').toLowerCase()}: full source support was not established. ${decision.gap}`;
    if ((decision.primary || '').split(' ').includes(claim) || decision.extra?.[claim]) {
      if (decision.extra?.[claim]) {
        source = urls.find(url => url.includes(decision.extra[claim]));
        if (!source) throw new Error(`No matching source: ${id} ${claim}`);
      }
      status = 'supported';
      note = notes[claim];
    }
    if (claim === 'singaporeStatus') {
      source = p.statusSourceUrl;
      if (p.statusCode !== 'UNV') {
        status = 'supported';
        note = `Compared ${p.scientific} with the NParks RDB3 row: ${p.statusCode} (${p.singaporeStatus}). Used RDB3, not the older RDB2 column.`;
        if (p.id === 'malayan-horned-frog') note += ' The table spells the genus Pelobratrachus; the common name and species epithet identify the matching row.';
      } else note = 'Reviewed: the linked NParks account records introduced origin, but does not assign an RDB3 risk category. The site correctly leaves the assessment unassigned; this is not a verified risk category.';
    }
    if (claim === 'globalStatus') {
      note = p.globalSourceUrl
        ? 'Reviewed: the complete dated global category could not be independently confirmed from the accessible source text. Some assessment pages block retrieval or return an empty application shell. Do not treat a national category as global evidence.'
        : 'Reviewed: this profile explicitly withholds a dated global assessment. No taxon-matched, dated global category has been verified in this review; the placeholder is not a conservation category.';
      if (['great-billed-heron', 'purple-heron'].includes(p.id)) {
        status = 'supported';
        note = `The Heron Specialist Group Red List table lists ${p.scientific} under Least Concern, with the assessment year shown in this profile. This supports the dated assessment, not a claim of a new 2026 assessment.`;
      }
      if (p.id === 'changeable-hawk-eagle') {
        status = 'supported';
        note = 'The Peregrine Fund account gives Least Concern and cites the BirdLife 2020 IUCN assessment. This supports the dated category, not a new assessment.';
      }
    }
    additions.push(validateReview(content, {id, claim, source, status, reviewer:'Source review record', note}));
  }
}
if (additions.length) {
  await writeFile('docs/editorial/reviews/profile-review-2026-09-07.json', JSON.stringify({reviewedAt:new Date().toISOString(), scope:'All previously unreviewed profile fields; supported and unresolved outcomes are distinct.', reviews:additions}, null, 2) + '\n', {flag:'wx'});
  await writeFile('app/content-reviews.json', JSON.stringify([...existing, ...additions], null, 2) + '\n');
}
const all = [...existing, ...additions].filter(r => r.contentId.startsWith('profile:'));
const supported = all.filter(r=>r.status==='supported').length;
const unresolved = all.filter(r=>r.status==='unverified').length;
const report = `# Profile claim review — 7 September 2026\n\nReviewed 49 profiles and 539 tracked claims. Added ${additions.length} review records.\n\n${supported} claims have source support. ${unresolved} claims still need evidence. No unresolved claim was labelled verified.\n\nThe review covers identification, diet, activity, behaviour, Singapore occurrence, reproduction, ecological role, pressures, viewing advice, national status and global status. It does not certify every untracked sentence or photograph.\n\nThe review compared NParks profile pages and RDB3 tables, AVS guidance, Animal Diversity Web, NOAA, local research papers and specialist bird sources. Retrieval alone did not count as verification.\n\nMany global assessment pages blocked access. Some profiles already withhold global assessments. Other gaps involve details beyond the inspected source text, or claims that combine several sources.\n\n## Open evidence checks\n\n| Profile | Claims needing evidence |\n| --- | --- |\n${Object.keys(decisions).map(id=>`| ${content['profile:'+id].name} | ${all.filter(r=>r.contentId==='profile:'+id && r.status==='unverified').map(r=>r.claim).join(', ') || 'None'} |`).join('\n')}\n`;
await writeFile('docs/profile-claim-review-2026-09-07.md', report);
console.log(JSON.stringify({added:additions.length, supported, unresolved, total:all.length}));
