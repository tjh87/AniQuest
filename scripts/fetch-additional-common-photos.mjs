import { writeFile } from 'node:fs/promises';

const ids = ['ornate-sunbird','eurasian-tree-sparrow','scaly-breasted-munia','pacific-swallow','sunda-pied-fantail','ashy-tailorbird','olive-winged-bulbul','oriental-magpie-robin','common-flameback'];
const portrait = new Set(['ornate-sunbird','scaly-breasted-munia','olive-winged-bulbul','common-flameback']);
const records = await Promise.all(ids.map(async id => {
  const response = await fetch(`https://singaporebirds.com/api/species/${id}/core`, { signal:AbortSignal.timeout(90000) });
  if (!response.ok) throw new Error(`${id}: ${response.status}`);
  const { species } = await response.json();
  const photo = species.enrichment?.photoUrlVariants?.[0];
  if (!photo?.w400) throw new Error(`${id}: missing photograph`);
  return [id,{src:photo.w400,width:portrait.has(id)?267:400,height:portrait.has(id)?400:267,name:species.common,
    alt:`${species.common}. ${species.enrichment.photoCaptions?.[0] ?? 'Reference photograph'}`,
    photographer:species.enrichment.photoCredits?.[0] ?? 'Bird Society of Singapore',
    location:'Bird Society of Singapore reference photograph',
    sourceUrl:`https://singaporebirds.com/species/${id}/`,position:'50% 50%'}];
}));
await writeFile('app/additional-common-photos.json',JSON.stringify(Object.fromEntries(records),null,2)+'\n');
console.log(`Saved ${records.length} credited bird photographs.`);
