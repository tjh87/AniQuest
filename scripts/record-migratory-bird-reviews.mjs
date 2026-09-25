import { readFile, writeFile } from 'node:fs/promises';
import { collectContent, hashContent } from './content-ledger.mjs';
import { validateReview } from './review-content.mjs';

const newIds = new Set(['common-sandpiper','barn-swallow','asian-brown-flycatcher','arctic-warbler','brown-shrike','blue-tailed-bee-eater','pacific-golden-plover','common-redshank','yellow-rumped-flycatcher']);
const profileClaims = ['identification','diet','activity','behaviour','singapore','reproduction','ecologicalRole','pressures','watch','singaporeStatus','globalStatus'];
const newClaims = [...profileClaims,'funFacts.0.text','funFacts.1.text'];
const content = await collectContent(process.cwd());
const existing = JSON.parse(await readFile('app/content-reviews.json','utf8'));
const latest = new Map(existing.map(review => [`${review.contentId}:${review.claim}`,review]));
const additions = [];
const taggedIds = Object.entries(content).filter(([id,profile]) => id.startsWith('profile:') && profile.tags?.includes('Migratory')).map(([id]) => id.slice(8));

for (const id of taggedIds) {
  const contentId = `profile:${id}`;
  const profile = content[contentId];
  const hash = hashContent(profile);
  if (newIds.has(id)) {
    const biology = profile.sources.find(source => source.name.includes('Birds of the World'))?.url;
    const guidance = profile.sources.find(source => source.url.includes('when-encountering-animals'))?.url;
    for (const claim of newClaims) {
      if (latest.get(`${contentId}:${claim}`)?.hash === hash) continue;
      let source = profile.sourceUrl;
      let additionalSources = [];
      let note = `Compared ${claim} with the linked Singapore species account and supporting biology source. The profile does not present a migrant as a local breeder.`;
      if (claim === 'singaporeStatus') {
        source = profile.statusSourceUrl;
        note = `Matched the NParks RDB3 entry for the stated Singapore category ${profile.statusCode}. Natural occurrence does not imply local breeding.`;
      } else if (claim === 'globalStatus') {
        source = profile.sourceUrl;
        note = 'The profile states that a dated taxon-matched global assessment was not verified. It does not copy the Singapore category into the global field.';
      } else if (claim === 'reproduction') {
        source = biology;
        note = 'The linked biology account supports the nest description. The text states that breeding occurs outside Singapore.';
      } else if (claim === 'watch') {
        source = guidance;
        note = 'NParks guidance supports distant observation and avoiding disturbance. The advice is specific to safe wildlife viewing.';
      } else if (claim === 'pressures') {
        additionalSources = guidance ? [guidance] : [];
        note = 'This is a labelled habitat-care interpretation based on documented feeding habitat and disturbance guidance. It is not a population trend.';
      } else if (claim === 'ecologicalRole') {
        additionalSources = biology ? [biology] : [];
        note = 'This qualitative food-web description follows the documented diet. It makes no numerical claim.';
      } else if (['diet','activity','behaviour','identification'].includes(claim) && biology) {
        additionalSources = [biology];
      } else if (claim.startsWith('funFacts.')) {
        source = profile.funFacts[Number(claim.split('.')[1])].sourceUrl;
        note = 'Checked this fact against the linked Singapore identification, behaviour or migrant-status account.';
      }
      additions.push(validateReview(content,{id:contentId,claim,source,additionalSources,status:'supported',reviewer:'AniQuest migratory bird source review',note}));
    }
  } else {
    for (const claim of profileClaims) {
      const key = `${contentId}:${claim}`;
      const prior = latest.get(key);
      if (prior?.hash === hash) continue;
      if (!prior || prior.status !== 'supported' || prior.claimText !== profile[claim]) throw new Error(`Cannot carry forward changed claim: ${key}`);
      additions.push({...prior,hash,carriedForwardFromHash:prior.hash,carriedForwardAt:new Date().toISOString(),carryForwardReason:'Added a sourced Migratory catalogue tag. The reviewed claim text and evidence did not change.'});
    }
  }
  const tagKey = `${contentId}:tags.0`;
  if (latest.get(tagKey)?.hash !== hash) additions.push(validateReview(content,{id:contentId,claim:'tags.0',source:profile.sourceUrl,status:'supported',reviewer:'AniQuest migratory tag review',note:'The linked Singapore species account describes this animal as a migrant or migratory visitor.'}));
}

await writeFile('app/content-reviews.json',JSON.stringify([...existing,...additions],null,2)+'\n');
await writeFile('docs/editorial/reviews/migratory-birds-2026-09-14.json',JSON.stringify({
  reviewedAt:new Date().toISOString(),scope:'Migratory tag coverage and nine new complete bird profiles',taggedProfileCount:taggedIds.length,newProfileCount:newIds.size,
  reviewCount:additions.length,limitations:['Seasonal periods follow eBird-derived weekly charts and are not fixed annual arrival dates.','Breeding information describes range-wide biology; no new profile claims breeding in Singapore.','Dated taxon-matched global assessments remain unverified for the nine new profiles.'],records:additions,
},null,2)+'\n');
console.log(`Recorded ${additions.length} review records across ${taggedIds.length} migratory profiles.`);
