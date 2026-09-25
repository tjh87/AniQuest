"use client";

import { useId, useMemo, useState } from "react";
import { ArrowUpRight, ChevronDown, Images, Network } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SINGAPORE_SPECIES, STATUS_LABELS, type SingaporeSpecies } from "./species-data";
import { profilePhotoFor } from "./wildlife-photos";
import { isBundledPhoto, useOfflineEdition } from "./offline-context";
import { RelationshipGraph } from "./relationship-graph";
import { relationshipGroupsFor, type RelatedMatch } from "./relationship-graph-data";
import { RELATED_GROUP_KEYS, type ProfileSectionId } from "./profile-sections";

export function speciesTags(species: SingaporeSpecies) {
  return [...new Set([...(species.tags ?? []), species.group, species.origin, species.encounter, ...species.habitats])];
}

export function SpeciesTags({ species, onTag }: { species: SingaporeSpecies; onTag: (tag: string) => void }) {
  return <div className="aq-click-tags" aria-label={`Explore tags for ${species.name}`}>{speciesTags(species).map(tag => <button type="button" className={tag === "Migratory" ? "is-migratory" : undefined} key={tag} onClick={() => onTag(tag)}>{tag}</button>)}</div>;
}

export function relatedProfiles(species: SingaporeSpecies) {
  return SINGAPORE_SPECIES.filter((item) => item.id !== species.id).map((item) => {
    if (item.scientific.split(" ")[0] === species.scientific.split(" ")[0]) return { item, label: `Same genus · ${species.scientific.split(" ")[0]}`, rank: 0 };
    if (item.family === species.family) return { item, label: `Same family · ${species.family}`, rank: 1 };
    if (item.group === species.group) return { item, label: `Same animal group · ${species.group}`, rank: 2 };
    const habitat = species.habitats.find((value) => item.habitats.includes(value));
    return habitat ? { item, label: `Shared habitat · ${habitat}`, rank: 3 } : null;
  }).filter((relation): relation is { item: SingaporeSpecies; label: string; rank: number } => relation !== null)
    .sort((a, b) => a.rank - b.rank || a.item.name.localeCompare(b.item.name)).slice(0, 6);
}

type RelatedGroupControls = {
  sections: Partial<Record<ProfileSectionId, boolean>>;
  setSection: (key: ProfileSectionId, open: boolean) => void;
};

function RelatedProfileCard({ relation, onOpen }: { relation: RelatedMatch; onOpen: (id: string) => void }) {
  const { item, label, rank } = relation;
  const photo = profilePhotoFor(item.id);
  const [photoFailed, setPhotoFailed] = useState(false);
  const externalPhoto = useOfflineEdition() && !!photo && !isBundledPhoto(photo.src);
  return <li>
    <Card className={`aq-related-card aq-related-card-rank-${rank}`}>
      <button type="button" className="aq-related-card-open" onClick={() => onOpen(item.id)} aria-label={`Read profile: ${item.name}`}>
        <span className="aq-related-card-photo">
          {photo && !photoFailed && !externalPhoto
            ? <img src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} loading="lazy" decoding="async" onError={() => setPhotoFailed(true)} />
            : <span className="aq-related-photo-unavailable">{externalPhoto ? "Photo source online" : "Photo unavailable"}</span>}
        </span>
        <span className="aq-related-card-copy">
          <strong>{item.name}</strong>
          <em>{item.scientific}</em>
          <Badge variant="secondary" className="aq-related-match-label">{label}</Badge>
          <span className="aq-related-card-action">Read profile <ArrowUpRight aria-hidden="true" /></span>
        </span>
      </button>
      {photo && <div className="aq-related-photo-credit">
        <a href={photo.sourceUrl} target="_blank" rel="noreferrer">Photo: {photo.photographer}</a>
        {photo.license && photo.licenseUrl && <a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a>}
      </div>}
    </Card>
  </li>;
}

function RelatedProfileGroup({ title, detail, rank, relations, onOpen, controls }: {
  title: string; detail: string; rank: number; relations: RelatedMatch[]; onOpen: (id: string) => void; controls?: RelatedGroupControls;
}) {
  const titleId = useId();
  const [localOpen, setLocalOpen] = useState(true);
  const groupKey = RELATED_GROUP_KEYS[rank];
  const open = controls?.sections[groupKey] ?? localOpen;
  const setOpen = (next: boolean) => controls ? controls.setSection(groupKey, next) : setLocalOpen(next);
  return <Collapsible open={open} onOpenChange={setOpen} asChild>
    <section className={`aq-related-group aq-related-group-rank-${rank}`} aria-labelledby={titleId}>
      <h3 className="aq-related-group-heading">
        <CollapsibleTrigger className="aq-related-group-trigger" aria-label={`${open ? "Minimise" : "Expand"} ${title}`}>
          <span className="aq-related-group-copy"><span id={titleId}>{title}<Badge variant="outline" className="aq-related-count">{relations.length}</Badge></span><small>{detail}</small></span>
          <span className="aq-related-group-action">{open ? "Minimise" : "Expand"}<ChevronDown aria-hidden="true" /></span>
        </CollapsibleTrigger>
      </h3>
      <CollapsibleContent className="aq-related-group-content">
        <ul className="aq-related-card-grid">{relations.map(relation => <RelatedProfileCard key={relation.item.id} relation={relation} onOpen={onOpen} />)}</ul>
      </CollapsibleContent>
    </section>
  </Collapsible>;
}

export function RelatedSpecies({ species, onOpen, embedded = false, groupControls }: { species: SingaporeSpecies; onOpen: (id: string) => void; embedded?: boolean; groupControls?: RelatedGroupControls }) {
  const [tag, setTag] = useState("");
  const relations = useMemo(() => relatedProfiles(species), [species]);
  const groups = useMemo(() => relationshipGroupsFor(species), [species]);
  return <section className={`${embedded ? "" : "aq-panel "}aq-related-section`}>{!embedded && <h2>Related profiles</h2>}
    <p className="aq-related-intro">Explore {relations.length} profiles from {species.name}. Genus and family matches appear first.</p>
    <Tabs defaultValue="graph" className="aq-related-views">
      <TabsList aria-label="Related profile views"><TabsTrigger value="graph"><Network aria-hidden="true" />Relationship graph</TabsTrigger><TabsTrigger value="cards"><Images aria-hidden="true" />Photo cards</TabsTrigger></TabsList>
      <TabsContent value="graph"><RelationshipGraph species={species} relations={relations} groups={groups} onOpen={onOpen} /></TabsContent>
      <TabsContent value="cards"><div className="aq-related-groups">{groups.map(group => {
        const matches = relations.filter(relation => relation.rank === group.rank);
        return matches.length > 0 && <RelatedProfileGroup key={group.rank} {...group} relations={matches} onOpen={onOpen} controls={groupControls} />;
      })}</div></TabsContent>
    </Tabs>
    <div className="aq-related-tags"><h3>Explore more tags</h3><SpeciesTags species={species} onTag={setTag} />{tag && <div className="aq-related-results"><p role="status">Animals tagged “{tag}”</p>{SINGAPORE_SPECIES.filter(item => speciesTags(item).includes(tag)).map(item => <button type="button" key={item.id} onClick={() => onOpen(item.id)}>{item.name}</button>)}</div>}</div></section>;
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
