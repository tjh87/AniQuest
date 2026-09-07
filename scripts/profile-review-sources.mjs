import { collectContent } from './content-ledger.mjs';
import { writeFile, mkdir } from 'node:fs/promises';

const profiles = Object.values(await collectContent(process.cwd())).filter(value => value?.scientific);
const urls = [...new Set(profiles.flatMap(p => [p.sourceUrl, p.statusSourceUrl, p.globalSourceUrl, ...p.sources.map(s => s.url)]).filter(Boolean))];
const sources = {};
let next = 0;
await Promise.all(Array.from({length: 6}, async () => {
  while (next < urls.length) {
    const url = urls[next++];
    try {
      const response = await fetch(url, {signal: AbortSignal.timeout(15000)});
      const html = await response.text();
      const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? html;
      const text = main.replace(/<(script|style|nav|footer|header)\b[^>]*>[\s\S]*?<\/\1>/gi, '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
      sources[url] = {status: response.status, finalUrl: response.url, text};
    } catch (error) { sources[url] = {status: 0, error: error.message, text: ''}; }
  }
}));
await mkdir('tmp/profile-review', {recursive: true});
await writeFile('tmp/profile-review/sources.json', JSON.stringify(sources, null, 2));
await writeFile('tmp/profile-review/profiles.json', JSON.stringify(profiles, null, 2));
console.log(JSON.stringify({profiles:profiles.length, sources:urls.length, accessible:Object.values(sources).filter(s=>s.status===200).length}));
