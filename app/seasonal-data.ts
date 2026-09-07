export const CALENDAR_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

export type CalendarMonth = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type SeasonalCategory = "migration" | "coastal" | "breeding" | "weather";

export const SEASONAL_CATEGORY_LABELS: Record<SeasonalCategory, string> = {
  migration: "Migratory birds",
  coastal: "Coastal and tidal",
  breeding: "Breeding cycles",
  weather: "Rain and weather",
};

export type SeasonalEvent = {
  id: string;
  title: string;
  emoji: string;
  category: SeasonalCategory;
  months: CalendarMonth[];
  typicalWindow: string;
  timingFactor: string;
  summary: string;
  habitat: string;
  observe: string;
  sourceName: string;
  sourceUrl: string;
  secondarySources?: Array<{ name: string; url: string }>;
};

export const SEASONAL_EVENTS: SeasonalEvent[] = [
  {
    id: "migratory-shorebirds", title: "Migratory shorebirds", emoji: "🐦", category: "migration",
    months: [1, 2, 3, 4, 8, 9, 10, 11, 12], typicalWindow: "August to April",
    timingFactor: "Long-distance migration and feeding conditions on mudflats",
    summary: "Whimbrels, Common Greenshanks, Common Redshanks, Pacific Golden Plovers and other migrants may stop in Singapore to rest and feed.",
    habitat: "Wetlands, mangroves and mudflats; use public hides and marked paths.",
    observe: "Use binoculars and keep away from feeding or resting flocks.",
    sourceName: "NParks birdwatching at Sungei Buloh",
    sourceUrl: "https://www.nparks.gov.sg/visit/parks/sungei-buloh-wetland-reserve/activities/birdwatching",
  },
  {
    id: "common-kingfisher", title: "Common Kingfisher passage", emoji: "🐦", category: "migration",
    months: [1, 2, 3, 4, 8, 9, 10, 11, 12], typicalWindow: "August to April",
    timingFactor: "Seasonal migration into freshwater and coastal wetlands",
    summary: "This small blue-and-orange migratory kingfisher can join Singapore's resident wetland birds.",
    habitat: "Ponds, streams, reservoirs and sheltered coastal edges.",
    observe: "Watch quietly from a path. Do not crowd a feeding perch.",
    sourceName: "NParks birds of Jurong Lake Gardens",
    sourceUrl: "https://juronglakegardens.nparks.gov.sg/birds/",
  },
  {
    id: "bee-eater-bittern", title: "Bee-eaters and wetland migrants", emoji: "🐦", category: "migration",
    months: [1, 2, 3, 4, 10, 11, 12], typicalWindow: "October to April",
    timingFactor: "Blue-tailed Bee-eater and Yellow Bittern migration windows overlap",
    summary: "Look for bee-eaters on open perches and bitterns moving through reeds. The main months differ by species.",
    habitat: "Grassland edges, parks, ponds and freshwater wetlands.",
    observe: "Stay on paths and avoid playback that can disturb birds.",
    sourceName: "NParks birds of Jurong Lake Gardens",
    sourceUrl: "https://juronglakegardens.nparks.gov.sg/birds/",
  },
  {
    id: "raptor-passage", title: "Raptor migration", emoji: "🦅", category: "migration",
    months: [2, 3, 4, 9, 10, 11, 12], typicalWindow: "Passage mainly September–December and February–April; wintering birds may remain between passages",
    timingFactor: "Southbound passage, wintering records and northbound return passage",
    summary: "Oriental Honey Buzzards, sparrowhawks and other migratory raptors can pass over Singapore.",
    habitat: "Open public viewpoints with a wide view of the sky.",
    observe: "Scan from one place. Do not enter closed areas to follow a bird.",
    sourceName: "Singapore Bird Group raptor report 2025–2026",
    sourceUrl: "https://singaporebirdgroup.wordpress.com/2026/08/11/singapore-raptor-report-autumn-2025-spring-2026/",
  },
  {
    id: "resident-cavity-nesters", title: "Resident cavity-nesting birds", emoji: "🐦", category: "breeding",
    months: [2, 3, 4, 5, 6, 7], typicalWindow: "February to July",
    timingFactor: "Typical breeding records for Coppersmith Barbets and Common Flamebacks",
    summary: "Adults may inspect tree holes, carry food or guard a nest cavity during this period.",
    habitat: "Wooded parks and gardens with mature trees.",
    observe: "Never approach, reveal or touch a nest. Watch normal behaviour from far away.",
    sourceName: "NParks birds of Jurong Lake Gardens",
    sourceUrl: "https://juronglakegardens.nparks.gov.sg/birds/",
  },
  {
    id: "coral-spawning", title: "Coral mass spawning window", emoji: "🪸", category: "breeding",
    months: [3, 4], typicalWindow: "Late March to April",
    timingFactor: "Lunar timing, water conditions and species biology",
    summary: "Many reef-building corals can release egg-and-sperm bundles a few nights after a full moon. The exact night and scale vary.",
    habitat: "Singapore's southern reefs; this is mainly a monitored research event, not a public shore spectacle.",
    observe: "Learn from research updates. Do not enter protected or restricted marine areas.",
    sourceName: "NUS Reef Ecology Laboratory",
    sourceUrl: "https://coralreef.nus.edu.sg/publications.html",
    secondarySources: [
      { name: "NUS coral spawning report", url: "https://news.nus.edu.sg/birthing-corals-to-protect-reefs/" },
      { name: "NUS–NParks spawning study", url: "https://doi.org/10.1111/mec.16621" },
    ],
  },
  {
    id: "hawksbill-nesting", title: "Hawksbill turtle nesting", emoji: "🐢", category: "breeding",
    months: [5, 6, 7, 8, 9, 10], typicalWindow: "May to October",
    timingFactor: "Night nesting; eggs then incubate for about 55–60 days",
    summary: "A small number of female Hawksbill Turtles may come ashore to lay eggs on Singapore beaches.",
    habitat: "Sandy shores. Nest locations are not shown to protect turtles and eggs.",
    observe: "Keep away, stay quiet, do not use flash or lights, and call NParks at 1800-476-1600.",
    sourceName: "NParks BiodiversitySG Hawksbill Turtle",
    sourceUrl: "https://biodiversitysg.nparks.gov.sg/our-biodiversity/reptiles/turtles/hawksbill-turtle/",
    secondarySources: [
      { name: "AVS encounter guidance", url: "https://avs.nparks.gov.sg/wildlife/encountering-wildlife/hawksbill-turtles/" },
    ],
  },
  {
    id: "frog-chorus", title: "After-rain frog chorus", emoji: "🐸", category: "weather",
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], typicalWindow: "Any month, during or after rain",
    timingFactor: "Recent rainfall, time of day and local water conditions",
    summary: "Frogs can become easier to hear after rain, especially after dark. This is a weather trigger, not a fixed season.",
    habitat: "Ponds, drains, wetlands and vegetated park edges viewed from public paths.",
    observe: "Listen without handling animals. Leave parks before closure and follow lightning advice.",
    sourceName: "NParks Painted Chorus Frog profile",
    sourceUrl: "https://biodiversitysg.nparks.gov.sg/our-biodiversity/amphibians/painted-chorus-frog/",
    secondarySources: [
      { name: "NParks Banded Bullfrog profile", url: "https://biodiversitysg.nparks.gov.sg/our-biodiversity/amphibians/banded-bullfrog/" },
    ],
  },
  {
    id: "intertidal-low-tide", title: "Low-tide shore life", emoji: "🦀", category: "coastal",
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], typicalWindow: "Any month, only at a suitable low tide",
    timingFactor: "Daily tide height and time, weather, waves and site access",
    summary: "Sea stars, crabs, molluscs and other shore animals are easier to see when the intertidal zone is exposed.",
    habitat: "Public sandy or rocky shores where access is open and safe.",
    observe: "Check current tide and weather data. Do not touch, collect or trample wildlife.",
    sourceName: "NParks sandy beaches guide",
    sourceUrl: "https://biodiversitysg.nparks.gov.sg/our-ecosystems/coastal-and-marine-habitats/sandy-beaches-in-singapore/",
    secondarySources: [
      { name: "NEA tide timings", url: "https://www.nea.gov.sg/corporate-functions/weather/tide-timings" },
    ],
  },
];

export const SINGAPORE_CLIMATE_PERIODS = [
  { label: "Northeast Monsoon", months: [12, 1, 2] as CalendarMonth[], note: "December to early March" },
  { label: "Monsoon transition", months: [3] as CalendarMonth[], note: "Northeast Monsoon in early March; inter-monsoon conditions toward late March" },
  { label: "First inter-monsoon", months: [4, 5] as CalendarMonth[], note: "Late March to May" },
  { label: "Southwest Monsoon", months: [6, 7, 8, 9] as CalendarMonth[], note: "June to September" },
  { label: "Second inter-monsoon", months: [10, 11] as CalendarMonth[], note: "October to November" },
];

export const CLIMATE_SOURCE = {
  name: "Meteorological Service Singapore — Climate of Singapore",
  url: "https://www.weather.gov.sg/climate-climate-of-singapore/",
};

export function getSingaporeMonth(date = new Date()): CalendarMonth {
  const month = new Intl.DateTimeFormat("en", { timeZone: "Asia/Singapore", month: "numeric" }).format(date);
  return Number(month) as CalendarMonth;
}

export function eventsForMonth(month: CalendarMonth, category?: SeasonalCategory | "all") {
  return SEASONAL_EVENTS.filter((event) => event.months.includes(month) && (!category || category === "all" || event.category === category));
}

export function climateForMonth(month: CalendarMonth) {
  return SINGAPORE_CLIMATE_PERIODS.find((period) => period.months.includes(month)) ?? SINGAPORE_CLIMATE_PERIODS[0];
}
