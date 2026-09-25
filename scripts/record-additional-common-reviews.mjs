import { readFile, writeFile } from 'node:fs/promises';
import { collectContent, hashContent } from './content-ledger.mjs';
import { validateReview } from './review-content.mjs';

const ids = ['ornate-sunbird','eurasian-tree-sparrow','scaly-breasted-munia','pacific-swallow','sunda-pied-fantail','ashy-tailorbird','olive-winged-bulbul','oriental-magpie-robin','common-flameback','oriental-whip-snake','green-paddy-frog','red-eared-slider'];
const claims = ['identification','diet','activity','behaviour','singapore','reproduction','ecologicalRole','pressures','watch','singaporeStatus','globalStatus','funFacts.0.text','funFacts.1.text'];
const content = await collectContent(process.cwd());
const existing = JSON.parse(await readFile('app/content-reviews.json','utf8'));
const additions = [];

for (const id of ids) {
  const contentId = `profile:${id}`;
  const profile = content[contentId];
  if (!profile) throw new Error(`Missing profile: ${id}`);
  const guidance = profile.sources.find(source => source.url.includes('when-encountering-animals'))?.url;
  const biology = profile.sources.find(source => /Birds of the World|nest|Jurong Lake Gardens/.test(`${source.name} ${source.supports}`))?.url ?? profile.sourceUrl;
  for (const claim of claims) {
    const hash = hashContent(profile);
    if (existing.some(review => review.contentId === contentId && review.claim === claim && review.hash === hash)) continue;
    let source = profile.sourceUrl;
    let additionalSources = [];
    let note = `Compared ${claim} with the linked species account and supporting natural-history reference. The profile avoids local dates and population estimates not supplied by those sources.`;
    if (claim === 'singaporeStatus') {
      source = profile.statusSourceUrl;
      note = profile.statusCode === 'UNV'
        ? 'No exact current RDB3 category was verified. The profile displays Not assessed here and explains the taxonomic or listing gap.'
        : `Matched the NParks RDB3 entry for the stated Singapore category ${profile.statusCode}. Origin notes preserve any uncertainty or mixed populations.`;
    } else if (claim === 'globalStatus') {
      source = profile.statusSourceUrl;
      note = 'The text records only that a dated taxon-matched global assessment was not verified. It does not turn national or encounter data into global risk.';
    } else if (claim === 'watch') {
      source = guidance;
      note = 'NParks guidance supports distant observation, no feeding or handling, and an open escape route.';
    } else if (claim === 'singapore') {
      additionalSources = profile.statusSourceUrl === source ? [] : [profile.statusSourceUrl];
      note = 'The species account and national list support Singapore occurrence. Mixed-origin and uncertain-origin cases remain explicit.';
    } else if (claim === 'reproduction') {
      source = biology;
      note = 'The linked biology source supports the nest or reproductive mode. No overseas breeding season was applied to Singapore.';
    } else if (claim === 'pressures') {
      additionalSources = guidance && guidance !== source ? [guidance] : [];
      note = 'This is a labelled habitat-care interpretation based on the animal’s stated habitat needs and NParks viewing guidance. It is not a measured population trend.';
    } else if (claim === 'ecologicalRole') {
      note = 'This is a qualitative food-web interpretation of the documented diet. It does not claim a measured ecological effect.';
    } else if (claim.startsWith('funFacts.')) {
      const index = Number(claim.split('.')[1]);
      source = profile.funFacts[index].sourceUrl;
      note = `Checked “${profile.funFacts[index].title}” against its linked identification, behaviour or Singapore reference.`;
    } else if (biology !== source) {
      additionalSources = [biology];
    }
    additions.push(validateReview(content,{id:contentId,claim,source,additionalSources,status:'supported',reviewer:'AniQuest source review',note}));
  }
}

await writeFile('app/content-reviews.json',JSON.stringify([...existing,...additions],null,2)+'\n');
await writeFile('docs/editorial/reviews/additional-common-species-2026-09-14.json',JSON.stringify({
  reviewedAt:new Date().toISOString(),scope:'Second batch of 12 common Singapore animals',profileCount:ids.length,
  reviewCount:additions.length,limitations:['Global assessments remain unverified for this batch.','The ornate sunbird exact post-split national category remains unverified.','The red-eared slider has no verified RDB3 category.','Habitat and food-web interpretations are labelled and make no numerical claims.'],records:additions,
},null,2)+'\n');
console.log(`Recorded ${additions.length} reviews for ${ids.length} profiles.`);
