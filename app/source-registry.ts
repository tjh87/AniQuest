import type { SiteSettingsValues } from "./default-settings";
import { ALL_NEWS_STORIES } from "./news-data";
import { ALL_LEARNING_QUESTIONS } from "./learning-records";
import { CLIMATE_SOURCE, SEASONAL_EVENTS } from "./seasonal-data";
import { SINGAPORE_SPECIES } from "./species-data";
import { ANIMAL_EVENTS, EVENT_ORGANISERS } from "./animal-events-data";
import { canonicalSourceKey } from "./source-url-policy";
import birdDirectory from "./bird-directory.json";
import { FIELD_SOURCES } from "./field-resources";

export type SourceKind = "fact" | "news-feed" | "news-story" | "species-profile" | "sg-status" | "global-status" | "quiz" | "calendar" | "guidance";

export type SourceLink = {
  url: string;
  canonicalKey: string;
  label: string;
  labels: string[];
  categories: SourceKind[];
};

type InputSource = { url: string; label: string; kind: SourceKind };

const GUIDANCE_SOURCES: InputSource[] = [
  { label: "Plantain squirrel lesson source", url: "https://biodiversitysg.nparks.gov.sg/our-biodiversity/mammals/other-mammals/plantain-squirrel/", kind: "guidance" },
  { label: "Lower Peirce water monitor lesson source", url: "https://www.nparks.gov.sg/visit/parks/park-detail/lower-peirce-reservoir-park/", kind: "guidance" },
  { label: "Gardenwise forest structure lesson source", url: "https://www.nparks.gov.sg/sbg/research/publications/-/media/sbg/gardenwise/1997-jul-gardenwise-vol-09.pdf", kind: "guidance" },
  { label: "NParks BiodiversitySG", url: "https://biodiversitysg.nparks.gov.sg/", kind: "guidance" },
  { label: "NParks Singapore species lists", url: "https://www.nparks.gov.sg/nature/species-list", kind: "guidance" },
  { label: "AVS wildlife encounter guidance", url: "https://avs.nparks.gov.sg/wildlife/encountering-wildlife/", kind: "guidance" },
  { label: "Singapore Red Data Book methodology", url: "https://www.nparks.gov.sg/resources/singapore-species-red-data-book", kind: "guidance" },
  { label: "NParks animal encounter guidance", url: "https://www.nparks.gov.sg/visit/when-visiting-parks/when-encountering-animals", kind: "guidance" },
  { label: "NEA tide timings", url: "https://www.nea.gov.sg/corporate-functions/weather/tide-timings", kind: "guidance" },
  { label: "NEA weather forecast", url: "https://www.nea.gov.sg/corporate-functions/weather", kind: "guidance" },
];

export function collectSourceLinks(settings: SiteSettingsValues): SourceLink[] {
  const inputs: InputSource[] = [
    ...settings.dailyFacts.map((fact) => ({ url: fact.sourceUrl, label: fact.sourceName, kind: "fact" as const })),
    ...settings.newsFeeds.map((feed) => ({ url: feed.url, label: feed.name, kind: "news-feed" as const })),
    ...ALL_NEWS_STORIES.map((story) => ({ url: story.href, label: story.title, kind: "news-story" as const })),
    ...ALL_LEARNING_QUESTIONS.map((question) => ({ url: question.sourceUrl, label: question.source, kind: "quiz" as const })),
    ...SINGAPORE_SPECIES.flatMap((species): InputSource[] => [
      { url: species.sourceUrl, label: `${species.name} profile`, kind: "species-profile" },
      { url: species.statusSourceUrl, label: `${species.name} Singapore status`, kind: "sg-status" },
      ...(species.globalSourceUrl ? [{ url: species.globalSourceUrl, label: `${species.name} global status`, kind: "global-status" as const }] : []),
      ...species.sources.map((source) => ({ url: source.url, label: `${species.name}: ${source.name}`, kind: "species-profile" as const })),
      ...species.funFacts.filter((fact) => fact.sourceUrl).map((fact) => ({ url: fact.sourceUrl!, label: `${species.name}: ${fact.title}`, kind: "fact" as const })),
    ]),
    ...SEASONAL_EVENTS.flatMap((event): InputSource[] => [
      { url: event.sourceUrl, label: event.sourceName, kind: "calendar" },
      ...(event.secondarySources ?? []).map((source) => ({ url: source.url, label: source.name, kind: "calendar" as const })),
    ]),
    { url: CLIMATE_SOURCE.url, label: CLIMATE_SOURCE.name, kind: "calendar" },
    ...ANIMAL_EVENTS.map((event) => ({ url: event.sourceUrl, label: event.title, kind: "calendar" as const })),
    ...EVENT_ORGANISERS.map((org) => ({ url: org.url, label: org.name, kind: "calendar" as const })),
    { url: "https://avs.nparks.gov.sg/outreach/events/pets-day-out/", label: "Pets’ Day Out · undated programme", kind: "calendar" },
    ...GUIDANCE_SOURCES,
    ...Object.values(FIELD_SOURCES).map(source => ({ url: source.url, label: source.name, kind: "guidance" as const })),
    { url: birdDirectory.sourceUrl, label: "Singapore bird checklist", kind: "guidance" },
    ...birdDirectory.groups.flatMap(group => group.birds.map(bird => ({ url: bird.sourceUrl, label: `${bird.name} reference account`, kind: "guidance" as const }))),
  ];

  const merged = new Map<string, { url: string; labels: Set<string>; categories: Set<SourceKind> }>();
  for (const source of inputs) {
    const key = canonicalSourceKey(source.url);
    if (!key) continue;
    const current = merged.get(key) ?? { url: source.url, labels: new Set<string>(), categories: new Set<SourceKind>() };
    current.labels.add(source.label);
    current.categories.add(source.kind);
    merged.set(key, current);
  }

  return [...merged.entries()].map(([canonicalKey, source]) => ({
    url: source.url,
    canonicalKey,
    label: [...source.labels][0] ?? new URL(source.url).hostname,
    labels: [...source.labels].sort(),
    categories: [...source.categories].sort(),
  })).sort((a, b) => a.label.localeCompare(b.label));
}
