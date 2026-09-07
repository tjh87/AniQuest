import { readFile, writeFile } from 'node:fs/promises';
import { collectContent } from './content-ledger.mjs';

const content = await collectContent(process.cwd());
const batch = JSON.parse(await readFile('docs/editorial/remaining-78-decisions-2026-09-07.json', 'utf8'));
const ids = batch.decisions.filter(r => r.claims === 'globalStatus').map(r => r.ids);
const dataset = '19491596-35ae-4a91-9a98-85cf505f1bd3';
const results = [];
for (const id of ids) {
  const p = content['profile:' + id];
  try {
    const response = await fetch(`https://api.gbif.org/v1/species/search?datasetKey=${dataset}&q=${encodeURIComponent(p.scientific)}&limit=10`, { signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`Search HTTP ${response.status}`);
    const data = await response.json();
    const match = data.results.find(r => r.canonicalName === p.scientific);
    if (!match) { results.push({ id, scientific: p.scientific, error: 'No exact species match', candidates: data.results.map(r => r.canonicalName) }); continue; }
    const referenceResponse = await fetch(`https://api.gbif.org/v1/species/${match.key}/verbatim`, { signal: AbortSignal.timeout(20000) });
    if (!referenceResponse.ok) throw new Error(`References HTTP ${referenceResponse.status}`);
    const references = await referenceResponse.json();
    const record = { id, scientific: p.scientific, retrievedAt: new Date().toISOString(), sourceUrl: `https://www.gbif.org/dataset/${dataset}/taxon/${match.taxonID}`, match, references };
    if (match.acceptedKey) {
      record.acceptedSourceUrl = `https://api.gbif.org/v1/species/${match.acceptedKey}/verbatim`;
      const acceptedResponse = await fetch(record.acceptedSourceUrl, { signal: AbortSignal.timeout(20000) });
      if (!acceptedResponse.ok) throw new Error(`Accepted record HTTP ${acceptedResponse.status}`);
      record.acceptedReferences = await acceptedResponse.json();
    }
    results.push(record);
    console.log(JSON.stringify({ id, rank: match.rank, taxonomicStatus: match.taxonomicStatus, status: match.threatStatuses, accepted: match.accepted, citation: references['http://purl.org/dc/terms/bibliographicCitation'], reference: references['http://purl.org/dc/terms/references'] }));
  } catch (error) { results.push({ id, scientific: p.scientific, error: error.message }); }
}
if (results.length !== 32 || results.some(r => r.error)) throw new Error('Incomplete retrieval; the prior evidence file was not replaced.');
await writeFile('docs/research/iucn-remaining-78-2026-09-07.json', JSON.stringify(results, null, 2) + '\n');
console.log(JSON.stringify({ total: results.length, failures: results.filter(r => r.error) }));
