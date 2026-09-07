import { readFile, writeFile } from 'node:fs/promises';
import { collectContent } from './content-ledger.mjs';
import { validateReview } from './review-content.mjs';

// Record explicit human/agent source comparisons. Fetch success never creates approval.
const batch = JSON.parse(await readFile('docs/editorial/profile-evidence-followup-2026-09-07.json', 'utf8'));
const content = await collectContent(process.cwd());
const file = 'app/content-reviews.json';
const existing = JSON.parse(await readFile(file, 'utf8'));
const additions = [];
const keys = new Set();
for (const decision of batch.decisions) {
  for (const id of decision.ids.split(' ')) {
    const p = content['profile:' + id];
    if (!p) throw new Error(`Unknown profile: ${id}`);
    const sources = decision.sources.map(source => source === 'primary' ? p.sourceUrl : batch.sources[source] ?? source);
    for (const claim of decision.claims.split(' ')) {
      const key = `${id}:${claim}`;
      if (keys.has(key)) throw new Error(`Duplicate decision: ${key}`);
      keys.add(key);
      const review = validateReview(content, { id: 'profile:' + id, claim, source: sources[0], additionalSources: sources.slice(1), newSource: 'true', status: decision.status ?? 'supported', reviewer: 'Source review record', note: decision.note });
      const last = existing.findLast(r => r.contentId === review.contentId && r.claim === claim);
      if (last?.hash === review.hash && last.note === review.note && last.status === review.status && JSON.stringify([last.sourceUrl, ...(last.additionalSources ?? [])]) === JSON.stringify(sources)) continue;
      additions.push(review);
    }
  }
}
if (additions.length) {
  await writeFile(`docs/editorial/reviews/evidence-followup-${Date.now()}.json`, JSON.stringify({ scope: 'Follow-up of the 200 incomplete profile claims', reviews: additions }, null, 2) + '\n', { flag: 'wx' });
  await writeFile(file, JSON.stringify([...existing, ...additions], null, 2) + '\n');
}
const latest = new Map([...existing, ...additions].filter(r => r.contentId.startsWith('profile:')).map(r => [`${r.contentId}:${r.claim}`, r]));
const supported = [...latest.values()].filter(r => r.status === 'supported').length;
const unresolved = [...latest.values()].filter(r => r.status !== 'supported');
const rows = Object.entries(content).filter(([id]) => id.startsWith('profile:')).map(([id, p]) => `| ${p.name} | ${unresolved.filter(r => r.contentId === id).map(r => r.claim).join(', ') || 'None'} |`);
await writeFile('docs/profile-evidence-followup-2026-09-07.md', `# Profile evidence follow-up — 7 September 2026\n\nInitial state: 339 supported claims and 200 incomplete claims, across 49 profiles.\n\nCurrent state: ${supported} supported claims and ${unresolved.length} incomplete claims, out of ${latest.size}. This follow-up resolves ${supported - 339} initial gaps.\n\nReview records link the sources used. General viewing advice is separate from measured species behaviour. A dated category is not a new assessment. No inaccessible page or working link counts as factual approval.\n\nEarlier reviews remain in the audit trail. The latest review for each claim determines these counts.\n\n## Remaining evidence gaps\n\n| Profile | Incomplete claims |\n| --- | --- |\n${rows.join('\n')}\n`);
console.log(JSON.stringify({ added: additions.length, supported, unresolved: unresolved.length, total: latest.size }));
