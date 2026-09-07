"use client";

import { useState } from "react";
import { SINGAPORE_SPECIES, STATUS_LABELS, type SingaporeSpecies } from "./species-data";

export function speciesTags(species: SingaporeSpecies) {
  return [...new Set([species.group, species.origin, species.encounter, ...species.habitats])];
}

export function SpeciesTags({ species, onTag }: { species: SingaporeSpecies; onTag: (tag: string) => void }) {
  return <div className="aq-click-tags" aria-label={`Explore tags for ${species.name}`}>{speciesTags(species).map(tag => <button type="button" key={tag} onClick={() => onTag(tag)}>{tag}</button>)}</div>;
}

export function relatedProfiles(species: SingaporeSpecies) {
  return SINGAPORE_SPECIES.filter((item) => item.id !== species.id).map((item) => {
    if (item.scientific.split(" ")[0] === species.scientific.split(" ")[0]) return { item, label: `Same genus · ${species.scientific.split(" ")[0]}`, rank: 0 };
    if (item.family === species.family) return { item, label: `Same family · ${species.family}`, rank: 1 };
    if (item.group === species.group) return { item, label: `Same profile group · ${species.group}`, rank: 2 };
    const habitat = species.habitats.find((value) => item.habitats.includes(value));
    return habitat ? { item, label: `Shared habitat · ${habitat}`, rank: 3 } : null;
  }).filter((relation): relation is { item: SingaporeSpecies; label: string; rank: number } => relation !== null)
    .sort((a, b) => a.rank - b.rank || a.item.name.localeCompare(b.item.name)).slice(0, 6);
}

export function RelatedSpecies({ species, onOpen }: { species: SingaporeSpecies; onOpen: (id: string) => void }) {
  const [tag, setTag] = useState("");
  const relations = relatedProfiles(species);
  const branches = [
    { title: "Same genus", detail: "Closest shared classification shown", rank: 0 },
    { title: "Same family", detail: "Wider relation · different genus", rank: 1 },
    { title: "Same animal group", detail: "Broad group · closeness varies", rank: 2 },
    { title: "Shared habitat", detail: "Habitat link only · no close relation implied", rank: 3 },
  ];
  return <section className="aq-panel aq-related-section"><h2>Related profiles</h2>
    <p className="aq-related-intro">Up to six profile matches, with close relatives first. Select an animal to open its profile.</p>
    <div className="aq-relation-graph" aria-label={`Relationship graph for ${species.name}`}>
      <div className="aq-relation-root"><strong>{species.name}</strong><em>{species.scientific}</em><span>Current animal</span></div>
      <ul className="aq-relation-branches">{branches.filter(branch => relations.some(relation => relation.rank === branch.rank)).map(branch =>
        <li className={`aq-relation-branch aq-relation-rank-${branch.rank}`} key={branch.rank}>
          <div className="aq-relation-label"><h3>{branch.title}</h3><span>{branch.detail}</span></div>
          <ul className="aq-relation-leaves">{relations.filter(relation => relation.rank === branch.rank).map(({ item, label }) =>
            <li key={item.id}><button type="button" onClick={() => onOpen(item.id)}><strong>{item.name}</strong><em>{item.scientific}</em><span>{label}</span></button></li>
          )}</ul>
        </li>
      )}</ul>
    </div>
    <p className="aq-related-intro">Branches show shared classifications from these profiles. Their lengths do not measure genetic distance or time.</p>
    <h3>Explore more tags</h3><SpeciesTags species={species} onTag={setTag} />{tag && <div className="aq-related-results"><p role="status">Animals tagged “{tag}”</p>{SINGAPORE_SPECIES.filter(item => speciesTags(item).includes(tag)).map(item => <button type="button" key={item.id} onClick={() => onOpen(item.id)}>{item.name}</button>)}</div>}</section>;
}

export function EvolutionTree({ onOpen }: { onOpen: (id: string) => void }) {
  const group = (name: string) => <details><summary>{name} profiles</summary><div className="aq-tree-leaves">{SINGAPORE_SPECIES.filter(s => s.group === name).map(s => <button type="button" key={s.id} onClick={() => onOpen(s.id)}>{s.name}<small>{s.family}</small></button>)}</div></details>;
  return <section className="aq-panel aq-evolution"><h2>Animal evolution tree</h2><p>A simplified map of shared ancestry. Open a branch, then select an animal.</p><p>Branch lengths do not show time. Profile lists are not resolved species-level evolutionary branches.</p>
    <ul className="aq-evolution-tree"><li><strong>Tetrapods · shared ancestry</strong><ul><li>{group("Amphibian")}</li><li><strong>Amniotes</strong><ul><li><strong>Synapsid lineage</strong>{group("Mammal")}</li><li><strong>Sauropsid lineage · reptiles, including birds</strong><ul><li>{group("Bird")}</li><li><span>Other reptile profiles · grouped for browsing, not a separate clade</span>{group("Reptile")}</li></ul></li></ul></li></ul></li></ul>
    <p>Living animals share ancestors. One living species is not shown as the ancestor of another.</p><a href="https://ucmp.berkeley.edu/vertebrates/tetrapods/tetrafr.html" target="_blank" rel="noreferrer">Source: UC Berkeley Museum of Paleontology · tetrapod relationships</a>
  </section>;
}

export function ConservationLegend() {
  return <div className="aq-conservation-legend" aria-label="Singapore conservation colour key"><strong>Singapore conservation</strong>{Object.entries(STATUS_LABELS).map(([code, label]) => <span key={code} className={`aq-conservation-key status-${code.toLowerCase()}`}>{code} · {label}</span>)}<a href="https://www.nparks.gov.sg/resources/singapore-species-red-data-book" target="_blank" rel="noreferrer">National assessment source</a></div>;
}
