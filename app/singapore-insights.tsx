import type { SingaporeSpecies } from './species-data';

// NParks metadata retrieved with Singapore MCP, datagov_get_dataset_metadata, 7 September 2026.
const facts = {
  reserves: {
    title: '4 nature reserves',
    text: 'NParks’ gazette dataset records land parcels for four Singapore nature reserves.',
    scope: 'Gazette: 2005 · Land record coverage: May 2018 · Dataset updated: 22 Aug 2026',
    source: 'Nature Reserves Gazette 2005',
    id: 'd_dfd037f5064cb2e2b2e358ceeccb4af7',
  },
  connections: {
    title: 'Green spaces need connections',
    text: 'Nature Ways use layered planting to help birds and butterflies move between green spaces.',
    scope: 'Route dataset coverage: Oct 2025 · Dataset updated: 22 Aug 2026',
    source: 'Nature Ways',
    id: 'd_af948e3f29cd12bc8b0caea19ae68286',
  },
  coast: {
    title: 'Mapping coastal habitats',
    text: 'NParks’ 2018 coastal habitat map combines satellite images, water-depth data and expert knowledge.',
    scope: 'Map edition: 2018 · Dataset updated: 18 Mar 2026',
    source: 'Coastal and Marine Habitat Map of Singapore 2018',
    id: 'd_18bcfe0a1b8c77f9b4493cef72ffd717',
  },
};

export function SingaporeInsights({ species, embedded = false }: { species?: SingaporeSpecies; embedded?: boolean }) {
  const selected = species
    ? (species.habitats.some(h => ['Marine', 'Coast', 'Seagrass', 'Estuary', 'Mangrove', 'Mudflat'].includes(h))
      ? [facts.coast]
      : species.group === 'Bird' || species.habitats.includes('Parks')
        ? [facts.connections]
        : [facts.reserves])
    : Object.values(facts);
  return <section className="aq-singapore-insights" aria-label="Singapore habitat facts">
    <div className="aq-insight-heading">{!embedded && <span>Singapore in focus</span>}<small>NParks public data · Checked 7 Sep 2026</small></div>
    <div className="aq-insight-grid">{selected.map(fact => <article key={fact.id}>
      <h2>{fact.title}</h2><p>{fact.text}</p>
      <a href={`https://data.gov.sg/datasets/${fact.id}/view`} target="_blank" rel="noreferrer">NParks · {fact.source} ↗</a>
      <small>{fact.scope}</small>
    </article>)}</div>
    {species && <p className="aq-insight-scope">Habitat context for {species.name}. These records do not measure its population or confirm sightings.</p>}
  </section>;
}
