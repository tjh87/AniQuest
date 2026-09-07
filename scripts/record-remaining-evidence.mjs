import { readFile, writeFile } from 'node:fs/promises';
import { collectContent, hashContent } from './content-ledger.mjs';
import { validateReview } from './review-content.mjs';

// This command records explicit comparisons. It never turns a successful fetch into approval.
const batch = JSON.parse(await readFile('docs/editorial/remaining-78-decisions-2026-09-07.json', 'utf8'));
const content = await collectContent(process.cwd());
const file = 'app/content-reviews.json';
const existing = JSON.parse(await readFile(file, 'utf8'));
const latest = new Map(existing.map(review => [`${review.contentId}:${review.claim}`, review]));
const additions = [];
const decisions = new Set();
for (const decision of batch.decisions) {
  for (const id of decision.ids.split(' ')) {
    const contentId = `profile:${id}`;
    const profile = content[contentId];
    if (!profile) throw new Error(`Unknown profile: ${id}`);
    for (const [field, value] of Object.entries(decision.replacements ?? {})) {
      if (profile[field] !== value) throw new Error(`Reviewed correction is not applied: ${id}:${field}`);
    }
    const sources = decision.sources.map(source => source === 'primary' ? profile.sourceUrl : batch.sources[source] ?? source);
    for (const claim of decision.claims.split(' ')) {
      const key = `${contentId}:${claim}`;
      if (decisions.has(key)) throw new Error(`Duplicate decision: ${key}`);
      decisions.add(key);
      const review = validateReview(content, { id: contentId, claim, source: sources[0], additionalSources: sources.slice(1), newSource: 'true', status: 'supported', reviewer: 'Source review record', note: decision.note });
      const prior = latest.get(key);
      if (prior?.hash === review.hash && prior.note === review.note && prior.status === review.status) continue;
      // Six explanatory status notes were corrected after the first displayed-page check.
      // Their claim text, source comparisons and dates remain unchanged.
      if (prior?.hash === batch.approvedSnapshotHashes?.[contentId] && prior.status === 'supported' && prior.claimText === review.claimText && prior.note === review.note) {
        additions.push({ ...prior, hash: review.hash, carriedForwardFromHash: prior.hash, carriedForwardAt: new Date().toISOString(), carryForwardReason: 'Updated the stale explanatory status note; claim text and evidence are unchanged.' });
        continue;
      }
      if (prior?.hash !== batch.baselineHashes[contentId] || prior.status === 'supported') {
        throw new Error(`The original incomplete review changed: ${key}`);
      }
      additions.push(review);
    }
  }
}
if (decisions.size !== 78) throw new Error(`Expected 78 explicit decisions, found ${decisions.size}`);

// Whole-profile hashes change after an edit. Retain prior support only for identical claim text.
// Keep its original review date and source. Do not renew the review or approve changed claims.
for (const [key, prior] of latest) {
  if (!prior.contentId.startsWith('profile:') || decisions.has(key)) continue;
  const profile = content[prior.contentId];
  const hash = hashContent(profile);
  if (prior.hash === hash) continue;
  if (![batch.baselineHashes[prior.contentId], batch.approvedSnapshotHashes?.[prior.contentId]].includes(prior.hash) || prior.status !== 'supported' || prior.claimText !== profile[prior.claim]) {
    throw new Error(`A separate source comparison is required: ${key}`);
  }
  additions.push({ ...prior, hash, carriedForwardFromHash: prior.hash, carriedForwardAt: new Date().toISOString(),
    note: `${prior.note} Unchanged claim carried forward after the documented 78-check corrections. Its source and original review date are unchanged.` });
}
const combined = [...existing, ...additions];
const finalReviews = [...new Map(combined.filter(r => r.contentId.startsWith('profile:')).map(r => [`${r.contentId}:${r.claim}`, r])).values()];
const incomplete = finalReviews.filter(r => r.status !== 'supported' || r.hash !== hashContent(content[r.contentId]) || r.claimText !== content[r.contentId][r.claim]);
if (finalReviews.length !== 539 || incomplete.length) throw new Error(`${incomplete.length} incomplete or stale reviews remain.`);
if (additions.length) {
  await writeFile(`docs/editorial/reviews/remaining-78-${Date.now()}.json`, JSON.stringify({ scope: batch.scope, reviews: additions }, null, 2) + '\n', { flag: 'wx' });
  await writeFile(file, JSON.stringify(combined, null, 2) + '\n');
}
const rows = batch.decisions.map(d => `| ${content['profile:' + d.ids].name} | ${d.claims} | ${d.replacements?.[d.claims] ? 'Corrected or narrowed' : 'Existing wording supported'} |`);
const report = `# Profile evidence follow-up — 7 September 2026

All 78 remaining review gaps are resolved: 32 global-status records and 46 other claims.

Current coverage: 539 supported claim records across 49 profiles. No incomplete or stale profile claim remains in this snapshot.

This is source support for the current wording, not proof that every earlier statement was correct. Unsupported details were corrected or removed. Care advice is labelled as advice. Range-wide evidence is not presented as a measured Singapore trend.

## Important limits

- The clouded monitor and Sumatran palm civet have no separate assessment in the inspected IUCN taxonomy. Their profiles explain the broader taxon instead of borrowing its risk category.
- The Malayan horned frog assessment uses the older name Megophrys nasuta. Its current profile name remains Pelobatrachus nasutus.
- Years beside global categories follow the cited records. They are not source-review dates or new field surveys. The white-bellied sea eagle follows the IUCN dataset's 2020 citation. The dugong record has a 2019 citation with a 2015 DOI edition code.
- The banded bullfrog has no row in the inspected RDB3 amphibian table. Not assessed here remains a guide limitation, not an invented official category.
- Existing unchanged claims retain their original review dates and source records. The audit trail records their transfer to each edited profile hash.
- These 539 checks cover the 11 declared profile claim fields. They do not certify every news story, random fact, photograph or quiz in the site. Reviews still become due after 30 days.

## Sources and audit

The explicit decisions and source links are in [the decision register](editorial/remaining-78-decisions-2026-09-07.json). The saved IUCN records are in [the research record](research/iucn-remaining-78-2026-09-07.json). Each profile displays its review sources.

The first follow-up resolved 122 of 200 gaps. This follow-up resolves the remaining 78. Earlier unsupported reviews remain in the history.

## Decisions

| Profile | Claim | Result |
| --- | --- | --- |
${rows.join('\n')}
`;
await writeFile('docs/profile-evidence-followup-2026-09-07.md', report);
console.log(JSON.stringify({ newComparisons: additions.filter(r => !r.carriedForwardFromHash).length, unchangedClaimsCarriedForward: additions.filter(r => r.carriedForwardFromHash).length, supported: finalReviews.length, incomplete: incomplete.length }));
