"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SINGAPORE_SPECIES, STATUS_LABELS, filterSpecies, speciesById, type SingaporeSpecies } from "./species-data";
import { WildlifePhoto, profilePhotoFor } from "./wildlife-photos";
import { SingaporeInsights } from "./singapore-insights";
import { ConservationLegend, EvolutionTree, RelatedSpecies, SpeciesTags, speciesTags } from "./species-explorer";
import { ContentReviewNote, PROFILE_CLAIMS } from "./content-review";

export function AnimalFunFact({ species, index = 0, compact = false }: { species: SingaporeSpecies; index?: number; compact?: boolean }) {
  const fact = species.funFacts[index];
  if (!fact) return null;
  return <aside className={`aq-animal-fun-fact ${compact ? "compact" : ""}`} aria-label={`Fun fact about ${species.name}`}>
    <div className="aq-fun-label"><Sparkles aria-hidden="true" /><span>Did you know?</span></div>
    <h3>{fact.title}</h3><p>{fact.text}</p>
    <a href={fact.sourceUrl || species.sourceUrl} target="_blank" rel="noreferrer">Fact source <ExternalLink aria-hidden="true" /></a>
  </aside>;
}

export function SpeciesLibrary({ query = "", onOpen, onClear }: { query?: string; onOpen: (id: string) => void; onClear?: () => void }) {
  const [search, setSearch] = useState(query);
  const [group, setGroup] = useState("All");
  const [encounter, setEncounter] = useState("All");
  const [conservation, setConservation] = useState("All");
  const [order, setOrder] = useState("featured");
  const [tag, setTag] = useState("");
  useEffect(() => { setTag(""); }, [query]);
  useEffect(() => { setSearch(query); setGroup("All"); setEncounter("All"); setConservation("All"); }, [query]);
  const matches = filterSpecies(search, group, encounter, conservation).filter(species => !tag || speciesTags(species).includes(tag));
  const ordered = order === "name" ? [...matches].sort((a, b) => a.name.localeCompare(b.name)) : matches;
  const clear = () => { setSearch(""); setGroup("All"); setEncounter("All"); setConservation("All"); setOrder("featured"); setTag(""); onClear?.(); };
  return <section className="aq-species-library" aria-labelledby="animal-library-heading">
    <div className="aq-section-head"><h2 id="animal-library-heading">Explore the animal guide</h2><span className="aq-muted">{SINGAPORE_SPECIES.length} complete profiles · no insects or fish</span></div>
    <div className="aq-library-controls">
      <label className="aq-library-search"><span>Find an animal</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, habitat or familiar nickname" /></label>
      <label><span>Animal group</span><select value={group} onChange={(event) => setGroup(event.target.value)}><option value="All">All groups</option>{["Mammal", "Bird", "Reptile", "Amphibian"].map((value) => <option key={value}>{value}</option>)}</select></label>
      <label><span>Encounter guide</span><select value={encounter} onChange={(event) => setEncounter(event.target.value)}><option value="All">All encounters</option>{["Commonly seen", "Elusive", "Rare or restricted"].map((value) => <option key={value}>{value}</option>)}</select></label>
      <label><span>Singapore conservation</span><select value={conservation} onChange={(event) => setConservation(event.target.value)}><option value="All">All national statuses</option><option value="Threatened">Threatened · VU / EN / CR</option>{Object.entries(STATUS_LABELS).map(([code, label]) => <option key={code} value={code}>{label}{code === "UNV" ? "" : ` · ${code}`}</option>)}</select></label>
      <label><span>Sort</span><select value={order} onChange={(event) => setOrder(event.target.value)}><option value="featured">Featured order</option><option value="name">Name A–Z</option></select></label>
      <Button variant="outline" onClick={() => { clear(); setTag(""); }}>Reset filters</Button>
    </div>
    <p className="aq-library-count" role="status">Showing {matches.length} of {SINGAPORE_SPECIES.length} animals{search ? ` for “${search}”` : ""}. Threatened means Vulnerable, Endangered or Critically Endangered in Singapore. Encounter groups describe visibility, not population counts.</p>
    <ConservationLegend />
    <SingaporeInsights />
    {tag && <p role="status">Tag: {tag} <Button variant="outline" onClick={() => setTag("")}>Clear tag</Button></p>}
    <EvolutionTree onOpen={onOpen} />
    <div className="aq-species-grid">{ordered.map((species) => <article key={species.id} className={`aq-panel aq-species-card aq-status-card status-${species.statusCode.toLowerCase()}`}>
      <div className="aq-species-card-head"><span className="aq-species-emoji" aria-hidden="true">{species.emoji}</span><span className={`aq-status-badge status-${species.statusCode.toLowerCase()}`}>{species.statusCode === "UNV" ? "Not assessed here" : `SG ${species.statusCode}`}</span></div>
      <div className="aq-card-classification">{species.group} · {species.origin}</div>
      <h3><button className="aq-animal-title" onClick={() => onOpen(species.id)}>{species.name}</button></h3>
      <em>{species.scientific}</em><p className="aq-habitat-label">{species.habitat}</p>
      <SpeciesTags species={species} onTag={setTag} />
      <dl className="aq-species-facts"><div><dt>Local rarity</dt><dd>{species.rarity}</dd></div><div><dt>{species.statusCode === "UNV" ? "National status" : "Singapore RDB3"}</dt><dd>{species.singaporeStatus}</dd></div></dl>
      <AnimalFunFact species={species} compact />
      <Button className="aq-read-profile" onClick={() => onOpen(species.id)} aria-label={`Read full profile: ${species.name}`}>Read full profile <ArrowRight aria-hidden="true" /></Button>
    </article>)}</div>
    {!matches.length && <section className="aq-panel aq-library-empty"><h3>No matching animals</h3><p>Try a different name or reset the filters to see all {SINGAPORE_SPECIES.length} profiles.</p><Button onClick={clear}>Show all animals</Button></section>}
  </section>;
}

export function AnimalAtlas({ selectedId, onSelect, onBrowse, onJourney }: { selectedId: string; onSelect: (id: string) => void; onBrowse: () => void; onJourney?: (id: string) => void }) {
  const species = speciesById(selectedId) ?? SINGAPORE_SPECIES[0];
  const photo = profilePhotoFor(species.id);
  const sources = [{ name: species.sourceName ?? "Animal reference", url: species.sourceUrl, supports: "Identification, local habitat and natural history; reference pictures" }, ...species.sources];
  const uniqueSources = sources.filter((source, index) => sources.findIndex((other) => other.url === source.url) === index);
  return <div className="aq-view aq-animal-profile">
    <div className="aq-profile-navigation"><Button variant="outline" onClick={onBrowse}><ArrowLeft aria-hidden="true" /> All animals</Button><label><span className="sr-only">Choose an animal</span><select aria-label="Choose an animal" value={species.id} onChange={(event) => onSelect(event.target.value)}>{SINGAPORE_SPECIES.map((animal) => <option key={animal.id} value={animal.id}>{animal.name}</option>)}</select></label><span className="aq-muted">Profile {SINGAPORE_SPECIES.indexOf(species) + 1} of {SINGAPORE_SPECIES.length}</span></div>
    <div className="aq-page-title aq-profile-title"><div><span className="aq-eyebrow">Singapore Animal Atlas</span><h1>{species.name}</h1><p className="aq-scientific">{species.scientific}</p><div className="aq-tags"><span>{species.group}</span><span>{species.origin}</span><span>{species.encounter}</span></div></div><div className="aq-profile-title-facts">{species.funFacts.map((fact, index) => <AnimalFunFact key={`${species.id}-${fact.title}`} species={species} index={index} compact />)}</div></div>
    <section className={`aq-panel aq-profile-intro aq-status-card status-${species.statusCode.toLowerCase()}`}><strong>Singapore: {species.singaporeStatus}</strong><p>{species.summary}</p></section>
    <div className="aq-profile-columns">
      <div className="aq-profile-reading">
        <section className="aq-panel aq-profile-details">
          <Tabs key={species.id} defaultValue="overview">
            <TabsList aria-label="Animal profile sections"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="life">Life & habitat</TabsTrigger><TabsTrigger value="conservation">Conservation</TabsTrigger></TabsList>
            <TabsContent value="overview"><h2>How to recognise it</h2><p>{species.identification}</p><dl className="aq-profile-quickfacts"><div><dt>Diet</dt><dd>{species.diet}</dd></div><div><dt>Activity</dt><dd>{species.activity}</dd></div><div><dt>Family</dt><dd>{species.family}</dd></div><div><dt>Local rarity</dt><dd>{species.rarity}</dd></div></dl><h2>Behaviour</h2><p>{species.behaviour}</p>{species.aliases.length > 0 && <div className="aq-aliases"><strong>Also found under</strong><span>{species.aliases.join(" · ")}</span></div>}</TabsContent>
            <TabsContent value="life"><h2>At home in Singapore</h2><p>{species.singapore}</p><h2>Reproduction & young</h2><p>{species.reproduction}</p><h2>Its role in nature</h2><p>{species.ecologicalRole}</p><p className="aq-review-note">Life-history notes describe the species. They are not forecasts of when or where it will breed in Singapore.</p></TabsContent>
            <TabsContent value="conservation"><h2>Conservation at two scales</h2><div className="aq-profile-status"><div><small>Singapore · {species.statusCode === "UNV" ? "assessment not assigned" : "RDB3, 2024"}</small><strong className={`status-${species.statusCode.toLowerCase()}`}>{species.singaporeStatus}</strong><a href={species.statusSourceUrl} target="_blank" rel="noreferrer">{species.statusCode === "UNV" ? "Introduced-species source" : "National assessment source"} <ExternalLink aria-hidden="true" /></a></div><div><small>Global · separate assessment</small><strong>{species.globalStatus}</strong>{species.globalAssessedAt && <span className="aq-review-note">Assessed: {species.globalAssessedAt}</span>}{species.globalAssessmentNote && <p className="aq-review-note">{species.globalAssessmentNote}</p>}{species.globalSourceUrl ? <a href={species.globalSourceUrl} target="_blank" rel="noreferrer">Global assessment reference <ExternalLink aria-hidden="true" /></a> : <span className="aq-review-note">No global risk category is inferred from the Singapore label. A checked, taxon-matched IUCN assessment is required before a label is added.</span>}</div></div><h2>Pressures & protection</h2><p>{species.pressures}</p>{species.statusNote && <p className="aq-evidence-note">{species.statusNote}</p>}{species.origin === "Introduced" && <p className="aq-evidence-note">Introduced means brought here through human activity. It is an origin category, not a statement that the species is secure everywhere.</p>}</TabsContent>
          </Tabs>
        </section>
        <section className="aq-panel aq-watch-panel"><h2>Watch with care</h2><p>{species.watch}</p><a href="https://www.nparks.gov.sg/visit/when-visiting-parks/when-encountering-animals" target="_blank" rel="noreferrer">Official wildlife encounter guidance <ExternalLink aria-hidden="true" /></a></section>
      </div>
      <aside className="aq-profile-evidence">
        {photo && <section className="aq-panel aq-profile-media"><WildlifePhoto animal={species.id} /></section>}
        <section className="aq-panel"><h2>Sources & reference pictures</h2><p className="aq-review-note">Profile review: {species.reviewedAt}.{species.globalReviewedAt ? ` Global reference checked: ${species.globalReviewedAt}.` : ""} Read the linked source for its publication date and scope.</p><div className="aq-profile-source-list">{uniqueSources.map((source) => <article key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.name} <ExternalLink aria-hidden="true" /></a><p>{source.supports}</p></article>)}</div>{!photo && <p className="aq-evidence-note">A verified reference photograph is not available for this profile yet.</p>}{species.taxonomyNote && <p className="aq-evidence-note">{species.taxonomyNote}</p>}</section>
      </aside>
    </div>
    <RelatedSpecies key={species.id} species={species} onOpen={onSelect} />
    {onJourney && <section className="aq-panel aq-journey-entry"><h2>Learn about {species.name}</h2><p>Follow a guided lesson, compare your answers, and choose a responsible action.</p><Button onClick={() => onJourney(species.id)}>Start this animal’s journey</Button></section>}
    <SingaporeInsights species={species} />
    <ContentReviewNote contentId={`profile:${species.id}`} claims={PROFILE_CLAIMS} />
  </div>;
}
