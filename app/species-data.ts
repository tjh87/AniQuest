import { ANIMAL_PROFILES, type AnimalProfile } from "./species-profiles";

import { EXPANDED_SPECIES } from "./species-expansion";
import { WATER_SPECIES } from "./water-species";
import { ASSESSMENT_UPDATES } from "./species-assessments";
import evidenceUpdates from "./species-evidence-updates.json";
import fullBirdProfiles from "./full-bird-profiles.json";
import type { ProfileSource } from "./species-profiles";

export const SPECIES_REVIEW_DATE = "2026-09-05";
export const STATUS_LABELS = { LC: "Least Concern", NT: "Near Threatened", VU: "Vulnerable", EN: "Endangered", CR: "Critically Endangered", NA: "Not Applicable", UNV: "Not assessed here" } as const;
export const THREATENED_STATUS_CODES = new Set<string>(["VU", "EN", "CR"]);
export type SpeciesRecord = {
  emoji: string;
  name: string;
  scientific: string;
  habitat: string;
  fact: string;
  rarity: string;
  singaporeStatus: string;
  statusCode: keyof typeof STATUS_LABELS;
  globalStatus: string;
  sourceUrl: string;
  sourceName?: string;
  globalAssessedAt?: string;
  globalReviewedAt?: string;
  globalAssessmentNote?: string;
  statusSourceUrl: string;
  globalSourceUrl: string;
};

export type SingaporeSpecies = SpeciesRecord & AnimalProfile & { reviewedAt: string };
const FULL_BIRD_PROFILES = fullBirdProfiles as unknown as SingaporeSpecies[];

// Explicit source comparisons from docs/editorial/remaining-78-decisions-2026-09-07.json.
// Fetch success alone must never change these records.
const EVIDENCE_UPDATES: Record<string, Partial<SingaporeSpecies> & { evidenceSources?: ProfileSource[] }> = evidenceUpdates;

const ORIGINAL_SPECIES: SpeciesRecord[] = [
  {
    emoji: "🌙", name: "Sunda colugo", scientific: "Galeopterus variegatus", habitat: "Tall forest, nearby parkland and plantations",
    fact: "Its broad patagium supports controlled glides between trees.", rarity: "Restricted range; rarely seen, but locally common at some sites", singaporeStatus: "Near Threatened", statusCode: "NT", globalStatus: "Least Concern · 2008",
    sourceUrl: "https://biodiversitysg.nparks.gov.sg/our-biodiversity/mammals/other-mammals/sunda-colugo/", statusSourceUrl: "https://www.nparks.gov.sg/nature/species-list/terrestrial-mammals", globalSourceUrl: "https://doi.org/10.2305/IUCN.UK.2008.RLTS.T41502A10479343.en",
  },
  {
    emoji: "🦔", name: "Sunda pangolin", scientific: "Manis javanica", habitat: "Forests and vegetated corridors",
    fact: "Large claws open ant and termite nests; a sticky tongue gathers prey.", rarity: "Infrequently seen", singaporeStatus: "Critically Endangered", statusCode: "CR", globalStatus: "Critically Endangered · 2019",
    sourceUrl: "https://avs.nparks.gov.sg/wildlife/encountering-wildlife/pangolins/", statusSourceUrl: "https://www.nparks.gov.sg/nature/species-list/terrestrial-mammals", globalSourceUrl: "https://doi.org/10.2305/IUCN.UK.2019-3.RLTS.T12763A123584856.en",
  },
  {
    emoji: "🐆", name: "Mainland leopard cat", scientific: "Prionailurus bengalensis", habitat: "Forest, scrubland and plantations",
    fact: "This nocturnal hunter is mainly terrestrial but also climbs easily.", rarity: "Rare", singaporeStatus: "Critically Endangered", statusCode: "CR", globalStatus: "Least Concern · 2022",
    sourceUrl: "https://www.nparks.gov.sg/florafaunaweb/fauna/2/2/229", statusSourceUrl: "https://www.nparks.gov.sg/nature/species-list/terrestrial-mammals", globalSourceUrl: "https://doi.org/10.2305/IUCN.UK.2022-1.RLTS.T18146A212958253.en",
  },
  {
    emoji: "🦦", name: "Smooth-coated otter", scientific: "Lutrogale perspicillata", habitat: "Mangroves, reservoirs, ponds and urban canals",
    fact: "Social family groups use both natural and highly urban waterways.", rarity: "Regular at some waterways; nationally threatened", singaporeStatus: "Endangered", statusCode: "EN", globalStatus: "Vulnerable · 2021",
    sourceUrl: "https://biodiversitysg.nparks.gov.sg/our-biodiversity/mammals/other-mammals/smooth-coated-otter/", statusSourceUrl: "https://www.nparks.gov.sg/nature/species-list/terrestrial-mammals", globalSourceUrl: "https://doi.org/10.2305/IUCN.UK.2021-3.RLTS.T12427A164579961.en",
  },
  {
    emoji: "🌙", name: "Sunda slow loris", scientific: "Nycticebus coucang", habitat: "Forest canopy in nature reserves and Pulau Tekong",
    fact: "Large, forward-facing eyes support its activity at night.", rarity: "Rare and secretive", singaporeStatus: "Endangered", statusCode: "EN", globalStatus: "Endangered · 2020",
    sourceUrl: "https://biodiversitysg.nparks.gov.sg/our-biodiversity/mammals/primates/sunda-slow-loris/", statusSourceUrl: "https://www.nparks.gov.sg/nature/species-list/terrestrial-mammals", globalSourceUrl: "https://doi.org/10.2305/IUCN.UK.2020-2.RLTS.T163017685A17970966.en",
  },
  {
    emoji: "🐒", name: "Raffles's banded langur", scientific: "Presbytis femoralis", habitat: "Mature forest canopy in the Central Catchment",
    fact: "This arboreal leaf-eater digests vegetation in a multi-chambered stomach.", rarity: "Rare; very small, restricted population", singaporeStatus: "Critically Endangered", statusCode: "CR", globalStatus: "Critically Endangered · 2022",
    sourceUrl: "https://biodiversitysg.nparks.gov.sg/our-biodiversity/mammals/primates/raffles-banded-langur/", statusSourceUrl: "https://www.nparks.gov.sg/nature/species-list/terrestrial-mammals", globalSourceUrl: "https://doi.org/10.2305/IUCN.UK.2022-1.RLTS.T39801A215090780.en",
  },
  {
    emoji: "🐦", name: "Straw-headed bulbul", scientific: "Pycnonotus zeylanicus", habitat: "Dense foliage near rivers and forest edges",
    fact: "Its loud song has made it a target of the illegal songbird trade.", rarity: "Uncommon; often heard before seen", singaporeStatus: "Endangered", statusCode: "EN", globalStatus: "Critically Endangered · 2018",
    sourceUrl: "https://biodiversitysg.nparks.gov.sg/our-biodiversity/birds/bulbuls-sparrows-and-munias/straw-headed-bulbul/", statusSourceUrl: "https://www.nparks.gov.sg/nature/species-list/birds", globalSourceUrl: "https://doi.org/10.2305/IUCN.UK.2018-2.RLTS.T22712603A132470468.en",
  },
  {
    emoji: "🐦", name: "Oriental pied hornbill", scientific: "Anthracoceros albirostris", habitat: "Parks and wooded areas with fruiting trees",
    fact: "A nesting female stays inside a mostly sealed tree cavity while the male brings food.", rarity: "Recovered; often visible at suitable sites", singaporeStatus: "Near Threatened", statusCode: "NT", globalStatus: "Least Concern · 2020",
    sourceUrl: "https://biodiversitysg.nparks.gov.sg/our-biodiversity/birds/other-birds/oriental-pied-hornbill/", statusSourceUrl: "https://www.nparks.gov.sg/nature/species-list/birds", globalSourceUrl: "https://doi.org/10.2305/IUCN.UK.2020-3.RLTS.T22682437A184925767.en",
  },
  {
    emoji: "🦅", name: "White-bellied sea eagle", scientific: "Haliaeetus leucogaster", habitat: "Reservoirs, rivers and coastlines",
    fact: "Broad wings form a shallow V while it soars above waterways.", rarity: "Common around suitable waterways", singaporeStatus: "Least Concern", statusCode: "LC", globalStatus: "Least Concern · 2022",
    sourceUrl: "https://biodiversitysg.nparks.gov.sg/our-biodiversity/birds/raptors/white-bellied-sea-eagle/", statusSourceUrl: "https://www.nparks.gov.sg/nature/species-list/birds", globalSourceUrl: "https://www.iucnredlist.org/species/22695097/216253643",
  },
  {
    emoji: "🐢", name: "Hawksbill turtle", scientific: "Eretmochelys imbricata", habitat: "Shallow reefs and sandy nesting beaches",
    fact: "Its narrow beak helps it reach food such as sponges in reef crevices.", rarity: "Nesting records do not establish abundance", singaporeStatus: "Critically Endangered", statusCode: "CR", globalStatus: "Critically Endangered · 2008",
    sourceUrl: "https://biodiversitysg.nparks.gov.sg/our-biodiversity/reptiles/turtles/hawksbill-turtle/", statusSourceUrl: "https://www.nparks.gov.sg/nature/species-list/reptiles", globalSourceUrl: "https://doi.org/10.2305/IUCN.UK.2008.RLTS.T8005A12881238.en",
  },
  {
    emoji: "🐢", name: "Green turtle", scientific: "Chelonia mydas", habitat: "Shallow coastal water, reefs and seagrass beds",
    fact: "Paddle-shaped limbs power long-distance swimming.", rarity: "Sighted locally; abundance not inferred", singaporeStatus: "Critically Endangered", statusCode: "CR", globalStatus: "Least Concern · 2025",
    sourceUrl: "https://www.nparks.gov.sg/florafaunaweb/fauna/2/6/263", statusSourceUrl: "https://www.nparks.gov.sg/nature/species-list/reptiles", globalSourceUrl: "https://doi.org/10.2305/IUCN.UK.2025-2.RLTS.T4615A285108125.en",
  },
  {
    emoji: "🐊", name: "Estuarine crocodile", scientific: "Crocodylus porosus", habitat: "Estuaries, mangroves and former prawn ponds",
    fact: "It often basks by day and hunts mainly at night.", rarity: "Rare", singaporeStatus: "Critically Endangered", statusCode: "CR", globalStatus: "Least Concern · 2021",
    sourceUrl: "https://www.nparks.gov.sg/florafaunaweb/fauna/2/5/259", statusSourceUrl: "https://www.nparks.gov.sg/nature/species-list/reptiles", globalSourceUrl: "https://doi.org/10.2305/IUCN.UK.2021-2.RLTS.T5668A3047556.en",
  },
];

const SG_STATUS_ROOT = "https://www.nparks.gov.sg/nature/species-list/";
const BIO_ROOT = "https://biodiversitysg.nparks.gov.sg/our-biodiversity/";

function added(scientific: string, name: string, emoji: string, habitat: string, rarity: string, statusCode: SpeciesRecord["statusCode"], sourceUrl: string): SpeciesRecord {
  const profile = ANIMAL_PROFILES[scientific];
  const taxon = { Mammal: "terrestrial-mammals", Bird: "birds", Reptile: "reptiles", Amphibian: "amphibians" }[profile.group];
  return {
    scientific, name, emoji, habitat, rarity, statusCode, singaporeStatus: STATUS_LABELS[statusCode],
    fact: profile.funFacts[0].text,
    sourceUrl: sourceUrl.startsWith("https:") ? sourceUrl : `${BIO_ROOT}${sourceUrl}/`,
    statusSourceUrl: statusCode === "UNV" ? "https://www.nparks.gov.sg/florafaunaweb/fauna/4/5/455" : `${SG_STATUS_ROOT}${taxon}`,
    // Do not silently copy a status from a different taxon or an undated search result.
    globalStatus: "Dated assessment not verified in this edition",
    globalSourceUrl: "",
  };
}

const ADDED_SPECIES: SpeciesRecord[] = [
  added("Macaca fascicularis", "Long-tailed macaque", "🐒", "Forest edges, mangroves and parks", "Commonly encountered in suitable areas", "LC", "mammals/primates/long-tailed-macaque"),
  added("Callosciurus notatus", "Plantain squirrel", "🐿️", "Trees in forests, parks and gardens", "Common and widespread", "LC", "mammals/other-mammals/plantain-squirrel"),
  added("Paradoxurus musangus", "Sumatran palm civet", "🐾", "Woodland, gardens and some urban areas", "Widespread but mostly hidden by day", "LC", "mammals/other-mammals/sumatran-palm-civet"),
  added("Sus scrofa", "Wild boar", "🐗", "Forest, scrub and adjoining green spaces", "Regular in suitable habitat; varies by site", "LC", "mammals/ungulates-hoofed-animals/wild-boar"),
  added("Tragulus kanchil", "Lesser mousedeer", "🦌", "Dense mature forest and its undergrowth", "Elusive and restricted to suitable forest", "EN", "mammals/ungulates-hoofed-animals/lesser-mousedeer"),
  added("Cynopterus brachyotis", "Lesser dog-faced fruit bat", "🦇", "Trees and roosts in urban and forest habitats", "Common; hard to identify in flight", "LC", "https://www.nparks.gov.sg/florafaunaweb/fauna/5/6/562"),
  added("Acridotheres javanicus", "Javan myna", "🐦", "Lawns, streets, parks and other urban spaces", "Very common introduced resident", "NA", "birds/crows-starlings-mynas/javan-myna"),
  added("Corvus splendens", "House crow", "🐦‍⬛", "Urban areas, parks and coastal greenery", "Common introduced resident", "NA", "birds/crows-starlings-mynas/house-crow"),
  added("Eudynamys scolopaceus", "Asian koel", "🐦", "Fruiting trees in parks and woodland", "Common; often heard rather than seen", "LC", "birds/other-birds/asian-koel"),
  added("Oriolus chinensis", "Black-naped oriole", "🐦", "Tree canopies in parks, gardens and woodland", "Common in suitable wooded areas", "LC", "birds/other-birds/black-naped-oriole"),
  added("Todiramphus chloris", "Collared kingfisher", "🐦", "Mangroves, coasts, canals and parks", "Common and widespread", "LC", "birds/kingfishers/collared-kingfisher"),
  added("Gallus gallus", "Red junglefowl", "🐓", "Forest edges, scrub and wooded parks", "Often seen; domestic hybrids complicate identification", "NT", "https://www.nparks.gov.sg/florafaunaweb/fauna/2/6/265"),
  added("Varanus salvator", "Malayan water monitor", "🦎", "Mangroves, ponds, reservoirs and parks", "Common near suitable water bodies", "LC", "https://www.nparks.gov.sg/florafaunaweb/fauna/8/4/842"),
  added("Malayopython reticulatus", "Reticulated python", "🐍", "Forest, waterways and urban cover", "Common resident, but secretive", "LC", "https://www.nparks.gov.sg/florafaunaweb/fauna/6/4/6449"),
  added("Naja sumatrana", "Equatorial spitting cobra", "🐍", "Scrub, forest edges and suburban greenery", "Common resident, but often concealed", "LC", "https://www.nparks.gov.sg/florafaunaweb/fauna/4/8/480"),
  added("Hemidactylus frenatus", "Common house gecko", "🦎", "Buildings, gardens and nearby woodland", "Common around buildings", "LC", "https://juronglakegardens.nparks.gov.sg/reptiles-and-amphibians/"),
  added("Kaloula pulchra", "Banded bullfrog", "🐸", "Gardens, built areas and temporary pools", "Common introduced resident", "UNV", "amphibians/banded-bullfrog"),
  added("Polypedates leucomystax", "Four-lined tree frog", "🐸", "Trees and shrubs near breeding water", "Common in suburban and disturbed habitats", "LC", "amphibians/four-lined-tree-frog"),
];

function sourcePublisher(url: string) {
  if (url.includes("biodiversitysg.nparks.gov.sg")) return "NParks · BiodiversitySG";
  if (url.includes("florafaunaweb")) return "NParks · Flora & Fauna Web";
  if (url.includes("juronglakegardens.nparks.gov.sg")) return "NParks · Jurong Lake Gardens";
  return "NParks · wildlife reference";
}

export const SINGAPORE_SPECIES: SingaporeSpecies[] = [
  ...[...ORIGINAL_SPECIES, ...ADDED_SPECIES].map((species) => {
    const profile = ANIMAL_PROFILES[species.scientific];
    if (!profile) throw new Error(`Missing complete profile: ${species.scientific}`);
    const update = ASSESSMENT_UPDATES[species.scientific];
    return { ...species, ...profile, ...update, sourceName: sourcePublisher(species.sourceUrl), sources: [...profile.sources, ...(update?.assessmentSources ?? [])], reviewedAt: SPECIES_REVIEW_DATE };
  }),
  ...EXPANDED_SPECIES.map(({ profile, ...species }) => ({ ...species, ...profile, singaporeStatus: STATUS_LABELS[species.statusCode] })),
  ...WATER_SPECIES,
  ...FULL_BIRD_PROFILES,
].map(species => {
  const update = EVIDENCE_UPDATES[species.id];
  if (!update) return species;
  const { evidenceSources = [], ...fields } = update;
  return { ...species, ...fields, sources: [...species.sources, ...evidenceSources.filter(source => !species.sources.some(existing => existing.url === source.url))] };
});

export function speciesById(id: string) {
  return SINGAPORE_SPECIES.find((species) => species.id === id);
}

function searchable(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function getSpeciesStatusCounts() {
  return Object.entries(STATUS_LABELS).map(([code, name]) => ({ code, name, count: SINGAPORE_SPECIES.filter((species) => species.statusCode === code).length }));
}

export function filterSpecies(query = "", group = "All", encounter = "All", conservation = "All") {
  const terms = searchable(query).split(" ").filter(Boolean);
  return SINGAPORE_SPECIES.filter((species) => {
    const haystack = searchable([species.name, species.scientific, species.habitat, species.family, species.group, ...species.aliases, ...species.habitats].join(" "));
    const matchesStatus = conservation === "All" || (conservation === "Threatened" ? THREATENED_STATUS_CODES.has(species.statusCode) : species.statusCode === conservation);
    return (group === "All" || species.group === group) && (encounter === "All" || species.encounter === encounter) && matchesStatus && terms.every((term) => haystack.includes(term));
  });
}
