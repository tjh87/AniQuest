"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import directory from "./bird-directory.json";
import { SINGAPORE_SPECIES } from "./species-data";
import { FieldSource } from "./field-resources";

const familyNames: Record<string, string> = {
  Accipitridae: "Eagles, hawks, kites, buzzards and vultures",
  Pandionidae: "Osprey", Falconidae: "Falcons and falconets",
  Tytonidae: "Barn owls", Strigidae: "Other owls",
  Phasianidae: "Junglefowl and quail",
};
export const DIRECTORY_BIRDS = directory.groups.flatMap(group => group.birds.map(bird => ({ ...bird, family: group.family })));

export function BirdDirectory({ onOpen, initialQuery = "" }: { onOpen: (id: string) => void; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [expanded, setExpanded] = useState(!!initialQuery);
  const [family, setFamily] = useState("all");
  const [status, setStatus] = useState("all");
  const normalise = (text: string) => text.toLowerCase().replace(/[\s’'-]+/g, "");
  const matched = DIRECTORY_BIRDS.filter(bird => (family === "all" || bird.family === family)
    && (status === "all" || bird.statuses.includes(status))
    && normalise(`${bird.name} ${bird.scientific} ${bird.id} ${bird.id === "red-junglefowl" ? "chicken" : ""}`).includes(normalise(query)));
  return <section className="aq-panel aq-bird-directory">
    <h2>Singapore birds of prey and junglefowl</h2>
    <p>Explore {DIRECTORY_BIRDS.filter(bird => bird.family !== "Phasianidae").length} birds of prey, plus red junglefowl and king quail.</p>
    <p>This directory follows the current Bird Society of Singapore checklist, checked {directory.checkedAt}.</p>
    <p>It includes residents, migrants, visitors and vagrants. A vagrant is an irregular visitor, not a bird to expect.</p>
    <p>Each entry has a source-linked AniQuest profile, reference photograph and guided lesson.</p>
    <a href={directory.sourceUrl} target="_blank" rel="noreferrer">Bird Society of Singapore · full checklist ↗</a>
    <details className="aq-bird-list" open={expanded} onToggle={event => setExpanded(event.currentTarget.open)}><summary>Explore all {DIRECTORY_BIRDS.length} bird entries</summary>
      <div className="aq-bird-controls">
        <label>Find a bird<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Name or scientific name" /></label>
        <label>Bird family<select value={family} onChange={event => setFamily(event.target.value)}><option value="all">All families</option>{directory.groups.map(group => <option key={group.family} value={group.family}>{familyNames[group.family]}</option>)}</select></label>
        <label>Local occurrence<select value={status} onChange={event => setStatus(event.target.value)}><option value="all">All occurrences</option>{[...new Set(DIRECTORY_BIRDS.flatMap(bird => bird.statuses))].sort().map(value => <option key={value}>{value}</option>)}</select></label>
        <Button variant="outline" onClick={() => { setQuery(""); setFamily("all"); setStatus("all"); }}>Reset bird filters</Button>
      </div>
      <p role="status">Showing {matched.length} of {DIRECTORY_BIRDS.length} entries. Occurrence labels are not conservation assessments.</p>
      <div className="aq-bird-cards">{matched.map(bird => {
        const profile = SINGAPORE_SPECIES.find(species => species.id === bird.id);
        return <article key={bird.id}>
          <h3>{bird.name}</h3><p><em>{bird.scientific}</em></p><small>{familyNames[bird.family]} · {bird.family}</small>
          <p>{bird.localStatus}</p>
          <a href={bird.sourceUrl} target="_blank" rel="noreferrer">Bird Society account and photographs ↗</a>
          {profile && <Button variant="outline" onClick={() => onOpen(profile.id)}>AniQuest profile: {profile.name}</Button>}
        </article>;
      })}</div>
      {!matched.length && <p>No matching birds. Clear the search or reset the filters.</p>}
    </details>
    <details><summary>Names and checklist limits</summary>
      <p>Different lists can use different names and acceptance rules. This is not a list of every historical or disputed report.</p>
      <p>The current checklist uses Collared scops owl. Older Singapore sources can call the local bird Sunda scops owl.</p>
      <p>Do not count both names as two local species without checking the taxonomy.</p>
      <p>King quail shares the junglefowl family. It is not a chicken.</p>
    </details>
  </section>;
}

export function ChickenGuide({ onOpen }: { onOpen: (id: string) => void }) {
  return <section className="aq-panel aq-chicken-guide">
    <h2>Red junglefowl, domestic chickens and mixed ancestry</h2>
    <p>Singapore’s free-ranging flocks can include wild-type birds, domestic chickens and birds with mixed ancestry.</p>
    <div className="aq-info-grid">
      <article><h3>Red junglefowl</h3><p>The wild species is <em>Gallus gallus</em>. Compare several traits with the existing profile.</p><p>NParks describes brighter plumage and grey feet. These clues alone do not prove wild ancestry.</p><Button variant="outline" onClick={() => onOpen("red-junglefowl")}>Open red junglefowl profile and lesson</Button></article>
      <article><h3>Domestic chicken</h3><p>Domestic chickens descend from red junglefowl. Breeds are domestic forms, not separate Singapore wildlife species.</p><p>Do not assign a breed from feather colour alone. This guide does not list every captive breed.</p></article>
      <article><h3>Mixed ancestry</h3><p>NParks records frequent interbreeding between wild junglefowl and domestic chickens in Singapore.</p><p>A wild-looking bird can have domestic ancestry. Record uncertain birds as “junglefowl or chicken; ancestry unknown”.</p></article>
      <article><h3>Observe without interference</h3><p>Keep away from adults and chicks. Do not feed, chase, capture or release birds.</p><p>Use the official encounter guide if a bird is injured or trapped.</p><FieldSource source="encounters" /></article>
    </div>
    <section className="aq-chicken-comparison" aria-labelledby="chicken-comparison-heading"><h3 id="chicken-comparison-heading">If a bird is already close enough to observe</h3><p>Do not move closer to identify it. Watch from the path and use a zoom lens or binoculars.</p><dl><div><dt>Leg colour</dt><dd>Look for grey feet on a red junglefowl. Do not decide from this feature alone.</dd></div><div><dt>Plumage</dt><dd>Look for the brighter plumage described by NParks. Domestic chickens can have many colours and patterns.</dd></div><div><dt>More than one trait</dt><dd>Compare feet and plumage together. Record “junglefowl or chicken; ancestry unknown” when the signs conflict.</dd></div><div><dt>Chicks and nests</dt><dd>Do not separate a group, touch eggs or approach a hen with chicks.</dd></div></dl><p>Mixed ancestry can hide or combine visible features. A photograph cannot confirm ancestry.</p><FieldSource source="chicken" /></section>
    <div className="aq-source-list"><FieldSource source="chicken" /><FieldSource source="guide" /></div>
  </section>;
}
