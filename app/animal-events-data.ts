export const EVENTS_REVIEWED_ON = "2026-09-05";
export const EVENT_TIME_ZONE = "Asia/Singapore";

export type AnimalEvent = {
  id: string;
  title: string;
  organiser: "avs" | "nss" | "spca";
  partners?: string;
  category: "walk" | "workshop" | "talk" | "festival" | "fundraiser";
  start: string;
  end?: string;
  location: string;
  summary: string;
  sourceUrl: string;
  registrationDeadline?: string;
};

export const EVENT_ORGANISERS = [
  { id: "avs", name: "AVS / NParks", kind: "Government", url: "https://avs.nparks.gov.sg/outreach/events/", note: "Government-led animal welfare and conservation events." },
  { id: "nss", name: "Nature Society Singapore", kind: "Nature organisation", url: "https://nss.org.sg/events/", note: "Walks and talks. An NSS account is required to register; places may fill early." },
  { id: "spca", name: "SPCA Singapore", kind: "Animal welfare charity", url: "https://spca.org.sg/", note: "See the organiser for its next campaign or education programme." },
  { id: "acres", name: "ACRES", kind: "Animal welfare charity", url: "https://acres.org.sg/contact/", note: "Visits and education enquiries. No dated public event is included in this collection." },
] as const;

export const EVENT_CATEGORY_LABELS = { walk: "Wildlife walks", workshop: "Workshops", talk: "Talks", festival: "Community events", fundraiser: "Fundraisers" } as const;
const WAD = "https://avs.nparks.gov.sg/outreach/events/world-animal-day/";

// Curated, dated sessions from organiser pages. Never expand these into annual repeats.
export const ANIMAL_EVENTS: AnimalEvent[] = [
  { id: "spca-gala-2026", title: "SPCA Paws for a Cause", organiser: "spca", category: "fundraiser", start: "2026-08-01T18:30:00+08:00", location: "One Farrer Hotel", summary: "Animal-welfare fundraising gala. Cocktails at 18:30; dinner at 19:00. End time not listed.", sourceUrl: "https://spca.org.sg/events/spca-paws-for-a-cause-2026/" },
  { id: "nss-hortpark-sep-2026", title: "Nature Walk at HortPark", organiser: "nss", category: "walk", start: "2026-09-09T08:30:00+08:00", end: "2026-09-09T10:30:00+08:00", location: "HortPark, 33 Hyderabad Road", summary: "Discover the park’s butterflies, birds and other wildlife with Nature Stewards volunteers.", sourceUrl: "https://nss.org.sg/events/nature-walk-at-hortpark-2/", registrationDeadline: "2026-09-06" },
  { id: "avs-dog-workshop-2026", title: "Be Next Level Good", organiser: "avs", partners: "NLB · Chain Dog Awareness Singapore", category: "workshop", start: "2026-09-12T13:00:00+08:00", end: "2026-09-12T19:00:00+08:00", location: "Central Public Library, Submarine", summary: "Dog body language and safe interactions.", sourceUrl: WAD },
  { id: "avs-parrot-workshop-2026", title: "Parrots Learn and Play Like Us Too!", organiser: "avs", partners: "NLB · Parrot Society (Singapore)", category: "workshop", start: "2026-09-13T14:00:00+08:00", end: "2026-09-13T16:00:00+08:00", location: "Central Public Library, Submarine", summary: "A children’s workshop about parrot enrichment.", sourceUrl: WAD },
  { id: "nss-buloh-sep-2026", title: "Birdwatching at Sungei Buloh", organiser: "nss", category: "walk", start: "2026-09-20T07:30:00+08:00", end: "2026-09-20T10:30:00+08:00", location: "Sungei Buloh Wetland Reserve", summary: "Look for resident and migrant birds with NSS birders. Sightings are not guaranteed.", sourceUrl: "https://nss.org.sg/events/birdwatching-at-sungei-buloh-wetland-reserve-4/", registrationDeadline: "2026-09-13" },
  { id: "avs-oscas-workshop-2026", title: "OSCAS Adoption Awareness & Activity", organiser: "avs", partners: "NLB · OSCAS", category: "workshop", start: "2026-09-20T10:00:00+08:00", end: "2026-09-20T12:00:00+08:00", location: "Central Public Library, Programme Room 2", summary: "Learn about adoption through badge-making.", sourceUrl: WAD },
  { id: "nss-songbird-talk-2026", title: "The Songbird Trade in Southeast Asia", organiser: "nss", partners: "Speaker: Serene Chng, TRAFFIC", category: "talk", start: "2026-09-21T20:00:00+08:00", end: "2026-09-21T21:00:00+08:00", location: "Online · Zoom", summary: "A talk on songbird trade, its conservation effects and work to reduce demand.", sourceUrl: "https://nss.org.sg/events/online-talk-the-songbird-trade-in-southeast-asia/", registrationDeadline: "2026-09-13" },
  { id: "nss-dairy-farm-2026", title: "Butterfly Walk at Dairy Farm", organiser: "nss", category: "walk", start: "2026-09-27T09:00:00+08:00", end: "2026-09-27T11:30:00+08:00", location: "Dairy Farm Nature Park", summary: "Explore accessible forest trails for butterflies in this nature-reserve buffer park.", sourceUrl: "https://nss.org.sg/events/butterfly-walk-at-dairy-farm-nature-park/", registrationDeadline: "2026-09-20" },
  { id: "avs-world-animal-day-sat-2026", title: "World Animal Day · Saturday", organiser: "avs", partners: "NLB · SPCA", category: "festival", start: "2026-10-03T10:00:00+08:00", end: "2026-10-03T17:00:00+08:00", location: "The Plaza, National Library Building", summary: "Animal-welfare activities. Programme details may change.", sourceUrl: WAD },
  { id: "avs-world-animal-day-sun-2026", title: "World Animal Day · Sunday", organiser: "avs", partners: "NLB · SPCA", category: "festival", start: "2026-10-04T10:00:00+08:00", end: "2026-10-04T17:00:00+08:00", location: "The Plaza, National Library Building", summary: "Second day of the animal-welfare event.", sourceUrl: WAD },
  { id: "nss-rifle-range-2026", title: "Butterfly Walk at Rifle Range Trail", organiser: "nss", category: "walk", start: "2026-10-18T09:00:00+08:00", end: "2026-10-18T12:00:00+08:00", location: "Rifle Range Trail", summary: "Join NSS to look for forest butterflies. Check the organiser’s final meeting details.", sourceUrl: "https://nss.org.sg/events/butterfly-walk-at-rifle-range-trail/" },
];

export function singaporeDateKey(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: EVENT_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

export function eventState(event: AnimalEvent, now = new Date()): "Past" | "Today" | "Upcoming" {
  const today = singaporeDateKey(now);
  const eventDay = event.start.slice(0, 10);
  if (eventDay < today || (event.end && new Date(event.end) <= now)) return "Past";
  return eventDay === today ? "Today" : "Upcoming";
}

export function eventsInMonth(month: string, organiser = "all", category = "all"): AnimalEvent[] {
  return ANIMAL_EVENTS.filter((event) => event.start.startsWith(month) && (organiser === "all" || event.organiser === organiser) && (category === "all" || event.category === category)).sort((a,b) => a.start.localeCompare(b.start));
}

export function calendarCells(month: string): Array<string | null> {
  const [year, number] = month.split("-").map(Number);
  const leading = (new Date(Date.UTC(year, number - 1, 1)).getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(year, number, 0)).getUTCDate();
  const cells: Array<string | null> = Array(leading).fill(null);
  for (let day = 1; day <= days; day++) cells.push(`${month}-${String(day).padStart(2,"0")}`);
  while (cells.length % 7) cells.push(null);
  return cells;
}

const escapeIcs = (value: string) => value.replace(/\\/g,"\\\\").replace(/\r?\n/g,"\\n").replace(/;/g,"\\;").replace(/,/g,"\\,");
const utcIcs = (value: string | Date) => new Date(value).toISOString().replace(/[-:]/g,"").replace(/\.\d{3}Z$/,"Z");
// RFC 5545: fold at 75 UTF-8 octets, including the continuation space.
function foldIcs(line: string): string {
  const encoder = new TextEncoder();
  let output = "", chunk = "", count = 0;
  for (const char of line) {
    const length = encoder.encode(char).length;
    if (count + length > 75) { output += chunk + "\r\n"; chunk = " "; count = 1; }
    chunk += char; count += length;
  }
  return output + chunk;
}
function eventCalendarLines(event: AnimalEvent, now: Date): string[] {
  const organiser = EVENT_ORGANISERS.find((item) => item.id === event.organiser)?.name ?? event.organiser;
  return ["BEGIN:VEVENT",`UID:${event.id}@aniquest.local`, `DTSTAMP:${utcIcs(now)}`,`DTSTART:${utcIcs(event.start)}`,...(event.end ? [`DTEND:${utcIcs(event.end)}`] : []),`SUMMARY:${escapeIcs(event.title)}`,`LOCATION:${escapeIcs(event.location)}`,`DESCRIPTION:${escapeIcs(`${organiser}. ${event.summary}\nConfirm time and registration with the organiser.\n${event.sourceUrl}`)}`,`URL:${event.sourceUrl}`,"END:VEVENT"];
}
export function eventsCalendarFile(events: AnimalEvent[], now = new Date()): string {
  return ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//AniQuest//Animal Events//EN","CALSCALE:GREGORIAN",...events.flatMap((event) => eventCalendarLines(event, now)),"END:VCALENDAR"].map(foldIcs).join("\r\n") + "\r\n";
}
export function eventCalendarFile(event: AnimalEvent, now = new Date()): string {
  return eventsCalendarFile([event], now);
}
