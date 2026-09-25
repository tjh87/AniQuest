export const EVENTS_REVIEWED_ON = "2026-09-14";
export const EVENT_TIME_ZONE = "Asia/Singapore";

export type AnimalEvent = {
  id: string;
  title: string;
  organiser: "avs" | "nparks" | "nss" | "spca";
  partners?: string;
  category: "walk" | "workshop" | "talk" | "festival" | "fundraiser" | "conservation";
  start: string;
  end?: string;
  location: string;
  summary: string;
  sourceUrl: string;
  registrationDeadline?: string;
  registrationNote?: string;
};

export const EVENT_ORGANISERS = [
  { id: "avs", name: "Animal & Veterinary Service", kind: "Government", url: "https://avs.nparks.gov.sg/outreach/events/", note: "Government-led animal welfare, pet-care and community events." },
  { id: "nparks", name: "NParks", kind: "Government", url: "https://www.nparks.gov.sg/visit/events", note: "Official biodiversity walks and public nature programmes. Registration arrangements vary by session." },
  { id: "nss", name: "Nature Society Singapore", kind: "Nature organisation", url: "https://nss.org.sg/events/", note: "Walks and talks. An NSS account is required to register; places may fill early." },
  { id: "spca", name: "SPCA Singapore", kind: "Animal welfare charity", url: "https://spca.org.sg/events/", note: "See the organiser for its next campaign or education programme." },
  { id: "acres", name: "ACRES", kind: "Animal welfare charity", url: "https://acres.org.sg/contact/", note: "Visits and education enquiries. No dated public event is included in this collection." },
] as const;

export const EVENT_CATEGORY_LABELS = { walk: "Wildlife walks", workshop: "Workshops", talk: "Talks", festival: "Community events", fundraiser: "Fundraisers", conservation: "Conservation action" } as const;
const WAD = "https://avs.nparks.gov.sg/outreach/events/world-animal-day/";

// Curated, dated sessions from organiser pages. Never expand these into annual repeats.
export const ANIMAL_EVENTS: AnimalEvent[] = [
  { id: "spca-gala-2026", title: "SPCA Paws for a Cause", organiser: "spca", category: "fundraiser", start: "2026-08-01T18:30:00+08:00", location: "One Farrer Hotel", summary: "Animal-welfare fundraising gala. Cocktails at 18:30; dinner at 19:00. End time not listed.", sourceUrl: "https://spca.org.sg/events/spca-paws-for-a-cause-2026/" },
  { id: "nss-hortpark-sep-2026", title: "Nature Walk at HortPark", organiser: "nss", category: "walk", start: "2026-09-09T08:30:00+08:00", end: "2026-09-09T10:30:00+08:00", location: "HortPark, 33 Hyderabad Road", summary: "Discover the park’s butterflies, birds and other wildlife with Nature Stewards volunteers.", sourceUrl: "https://nss.org.sg/events/nature-walk-at-hortpark-2/", registrationDeadline: "2026-09-06" },
  { id: "avs-dog-workshop-2026", title: "Be Next Level Good", organiser: "avs", partners: "NLB · Chain Dog Awareness Singapore", category: "workshop", start: "2026-09-12T13:00:00+08:00", end: "2026-09-12T19:00:00+08:00", location: "Central Public Library, Submarine", summary: "Dog body language and safe interactions.", sourceUrl: WAD },
  { id: "avs-parrot-workshop-2026", title: "Parrots Learn and Play Like Us Too!", organiser: "avs", partners: "NLB · Parrot Society (Singapore)", category: "workshop", start: "2026-09-13T14:00:00+08:00", end: "2026-09-13T16:00:00+08:00", location: "Central Public Library, Submarine", summary: "A children’s workshop about parrot enrichment.", sourceUrl: WAD },
  { id: "avs-choosing-joy-story-2026", title: "Choosing Joy, Choosing You", organiser: "avs", partners: "NLB · animal-welfare volunteers", category: "talk", start: "2026-09-19T12:00:00+08:00", end: "2026-09-19T12:45:00+08:00", location: "Central Public Library, Submarine", summary: "Lakshimi shares an adoption story, followed by a game and quiz.", sourceUrl: WAD },
  { id: "avs-homebound-screening-2026", title: "SOSD Homebound Screening", organiser: "avs", partners: "NLB · SOSD", category: "festival", start: "2026-09-19T13:00:00+08:00", end: "2026-09-19T18:00:00+08:00", location: "Central Public Library, Programme Rooms 1 and 2", summary: "A dog-welfare film and merchandise programme. The organiser lists short screenings at 14:00 and 17:00.", sourceUrl: WAD },
  { id: "nss-rail-corridor-tree-planting-sep-2026", title: "Rail Corridor tree planting", organiser: "nss", category: "conservation", start: "2026-09-19T09:00:00+08:00", end: "2026-09-19T12:00:00+08:00", location: "Rail Corridor opposite Jalan Bumbong, Jalan Bumbong", summary: "Help the NSS Rewilding Project restore native vegetation along the Rail Corridor.", sourceUrl: "https://nss.org.sg/events/nss-rewilding-project-tree-planting-along-rail-corridor-7/", registrationDeadline: "2026-09-11" },
  { id: "nss-nature-photography-talk-sep-2026", title: "Capturing nature’s unexpected moments", organiser: "nss", category: "talk", start: "2026-09-19T14:00:00+08:00", end: "2026-09-19T16:00:00+08:00", location: "NSS Office, The Sunflower, 510 Geylang Road #02-05, Singapore 389466", summary: "A nature-photography and wildlife storytelling session about observing unexpected behaviour responsibly.", sourceUrl: "https://nss.org.sg/events/talk-capturing-natures-unexpected-moments-stories/", registrationDeadline: "2026-09-13" },
  { id: "nparks-lim-chu-kang-biodiversity-sep-2026", title: "Biodiversity Walk at Lim Chu Kang / Cashin House", organiser: "nparks", category: "walk", start: "2026-09-19T09:00:00+08:00", end: "2026-09-19T11:00:00+08:00", location: "Bus bay drop-off, Visitor Centre carpark, Sungei Buloh Wetland Reserve, 60 Kranji Way, Singapore 739453", summary: "A guided exploration of the Lim Chu Kang nature area and Cashin House landscape.", sourceUrl: "https://www.nparks.gov.sg/visit/events/event-detail/SBWRLCK4/1757_Biodiversity-Walk-at-Lim-Chu-Kang-Cashin-House", registrationNote: "Registration is full; check the organiser page for wait-list availability." },
  { id: "nparks-mangrove-sep-19-2026", title: "What’s in my mangrove?", organiser: "nparks", category: "walk", start: "2026-09-19T09:30:00+08:00", end: "2026-09-19T11:00:00+08:00", location: "Information Counter, Visitor Centre, Sungei Buloh Wetland Reserve, 60 Kranji Way, Singapore 739453", summary: "A guided look at the plants and animals that make up a mangrove ecosystem.", sourceUrl: "https://www.nparks.gov.sg/visit/events/event-detail/SBWRMAN5/1847_What-s-in-my-mangrove", registrationNote: "Register on site at least 15 minutes before the walk; places are first come, first served." },
  { id: "nss-buloh-sep-2026", title: "Birdwatching at Sungei Buloh", organiser: "nss", category: "walk", start: "2026-09-20T07:30:00+08:00", end: "2026-09-20T10:30:00+08:00", location: "Sungei Buloh Wetland Reserve", summary: "Look for resident and migrant birds with NSS birders. Sightings are not guaranteed.", sourceUrl: "https://nss.org.sg/events/birdwatching-at-sungei-buloh-wetland-reserve-4/", registrationDeadline: "2026-09-13" },
  { id: "avs-oscas-workshop-2026", title: "OSCAS Adoption Awareness & Activity", organiser: "avs", partners: "NLB · OSCAS", category: "workshop", start: "2026-09-20T10:00:00+08:00", end: "2026-09-20T12:00:00+08:00", location: "Central Public Library, Programme Room 2", summary: "Learn about adoption through badge-making.", sourceUrl: WAD },
  { id: "avs-two-species-story-2026", title: "A Tail of Two Species", organiser: "avs", partners: "NLB · animal-welfare volunteers", category: "talk", start: "2026-09-20T16:00:00+08:00", end: "2026-09-20T16:45:00+08:00", location: "Central Public Library, Submarine", summary: "Arshwini shares an adoption story, followed by a game and quiz.", sourceUrl: WAD },
  { id: "nss-songbird-talk-2026", title: "The Songbird Trade in Southeast Asia", organiser: "nss", partners: "Speaker: Serene Chng, TRAFFIC", category: "talk", start: "2026-09-21T20:00:00+08:00", end: "2026-09-21T21:00:00+08:00", location: "Online · Zoom", summary: "A talk on songbird trade, its conservation effects and work to reduce demand.", sourceUrl: "https://nss.org.sg/events/online-talk-the-songbird-trade-in-southeast-asia/", registrationDeadline: "2026-09-13" },
  { id: "nss-dairy-farm-2026", title: "Butterfly Walk at Dairy Farm", organiser: "nss", category: "walk", start: "2026-09-27T09:00:00+08:00", end: "2026-09-27T11:30:00+08:00", location: "Dairy Farm Nature Park", summary: "Explore accessible forest trails for butterflies in this nature-reserve buffer park.", sourceUrl: "https://nss.org.sg/events/butterfly-walk-at-dairy-farm-nature-park/", registrationDeadline: "2026-09-20" },
  { id: "nparks-mangrove-sep-26-2026", title: "What’s in my mangrove?", organiser: "nparks", category: "walk", start: "2026-09-26T09:30:00+08:00", end: "2026-09-26T11:00:00+08:00", location: "Information Counter, Visitor Centre, Sungei Buloh Wetland Reserve, 60 Kranji Way, Singapore 739453", summary: "A guided look at the plants and animals that make up a mangrove ecosystem.", sourceUrl: "https://www.nparks.gov.sg/visit/events/event-detail/SBWRMAN5/1848_What-s-in-my-mangrove", registrationNote: "Register on site at least 15 minutes before the walk; places are first come, first served." },
  { id: "nss-rail-corridor-walk-sep-2026", title: "Nature Walk at Rail Corridor", organiser: "nss", category: "walk", start: "2026-09-27T09:00:00+08:00", end: "2026-09-27T11:00:00+08:00", location: "Rail Corridor; confirmed participants receive the exact meeting point", summary: "Explore the Rail Corridor’s plants, birds and other wildlife with Nature Society volunteers.", sourceUrl: "https://nss.org.sg/events/nature-walk-at-rail-corridor/", registrationDeadline: "2026-09-20" },
  { id: "nss-sungei-buloh-birdwatch-oct-2026", title: "Birdwatching at Sungei Buloh Wetland Reserve", organiser: "nss", category: "walk", start: "2026-10-03T07:30:00+08:00", end: "2026-10-03T10:30:00+08:00", location: "Sungei Buloh Wetland Reserve, 301 Neo Tiew Crescent, Singapore 718925", summary: "A guided birdwatching session for eligible early-bird Singapore Bird Race registrants.", sourceUrl: "https://nss.org.sg/events/birdwatching-at-sungei-buloh-wetland-reserve-5/", registrationDeadline: "2026-09-26", registrationNote: "Restricted to eligible Singapore Bird Race early-bird registrants; sightings are not guaranteed." },
  { id: "nparks-mangrove-oct-03-2026", title: "What’s in my mangrove?", organiser: "nparks", category: "walk", start: "2026-10-03T09:30:00+08:00", end: "2026-10-03T11:00:00+08:00", location: "Information Counter, Visitor Centre, Sungei Buloh Wetland Reserve, 60 Kranji Way, Singapore 739453", summary: "A guided look at the plants and animals that make up a mangrove ecosystem.", sourceUrl: "https://www.nparks.gov.sg/visit/events/event-detail/SBWRMAN6/1849_What-s-in-my-mangrove", registrationNote: "Register on site at least 15 minutes before the walk; places are first come, first served." },
  { id: "avs-world-animal-day-sat-2026", title: "World Animal Day · Saturday", organiser: "avs", partners: "NLB · SPCA", category: "festival", start: "2026-10-03T10:00:00+08:00", end: "2026-10-03T17:00:00+08:00", location: "The Plaza, National Library Building", summary: "Animal-welfare activities. Programme details may change.", sourceUrl: WAD },
  { id: "avs-world-animal-day-sun-2026", title: "World Animal Day · Sunday", organiser: "avs", partners: "NLB · SPCA", category: "festival", start: "2026-10-04T10:00:00+08:00", end: "2026-10-04T17:00:00+08:00", location: "The Plaza, National Library Building", summary: "Second day of the animal-welfare event.", sourceUrl: WAD },
  { id: "nparks-water-oct-10-2026", title: "What’s in my water?", organiser: "nparks", category: "walk", start: "2026-10-10T09:30:00+08:00", end: "2026-10-10T11:00:00+08:00", location: "Information Counter, Visitor Centre, Sungei Buloh Wetland Reserve, 60 Kranji Way, Singapore 739453", summary: "A guided freshwater exploration of aquatic life and water quality at the wetland reserve.", sourceUrl: "https://www.nparks.gov.sg/visit/events/event-detail/SBWRWAT4/1852_What-s-in-my-water", registrationNote: "Register on site at least 15 minutes before the walk; places are first come, first served." },
  { id: "nparks-wader-watch-oct-10-2026", title: "Wader Watch", organiser: "nparks", category: "walk", start: "2026-10-10T09:30:00+08:00", end: "2026-10-10T11:00:00+08:00", location: "Sungei Buloh Wetland Reserve, 301 Neo Tiew Crescent, Singapore 718925", summary: "Learn how migratory shorebirds use the reserve and practise responsible observation.", sourceUrl: "https://www.nparks.gov.sg/visit/events/event-detail/SBWRWW3/4167_Wader-Watch", registrationNote: "Check the organiser page for the exact meeting point and current registration status; no closing date is published." },
  { id: "nss-pasir-ris-mangroves-oct-2026", title: "Nature Walk at Pasir Ris Mangroves", organiser: "nss", category: "walk", start: "2026-10-11T09:00:00+08:00", end: "2026-10-11T12:00:00+08:00", location: "Pasir Ris Park; confirmed participants receive the exact meeting point", summary: "Explore mangrove wildlife and learn how this habitat supports biodiversity and protects the coast.", sourceUrl: "https://nss.org.sg/events/nature-walk-at-pasir-ris-mangroves-2/", registrationDeadline: "2026-10-04" },
  { id: "nss-rail-corridor-maintenance-oct-2026", title: "Rail Corridor site maintenance", organiser: "nss", category: "conservation", start: "2026-10-17T09:00:00+08:00", end: "2026-10-17T12:00:00+08:00", location: "Rail Corridor opposite Jalan Bumbong, Jalan Bumbong", summary: "Help maintain an NSS Rewilding Project restoration site along the Rail Corridor.", sourceUrl: "https://nss.org.sg/events/nss-rewilding-project-site-maintenance-along-rail-corridor-5/", registrationDeadline: "2026-10-11" },
  { id: "nparks-mangrove-oct-17-2026", title: "What’s in my mangrove?", organiser: "nparks", category: "walk", start: "2026-10-17T09:30:00+08:00", end: "2026-10-17T11:00:00+08:00", location: "Information Counter, Visitor Centre, Sungei Buloh Wetland Reserve, 60 Kranji Way, Singapore 739453", summary: "A guided look at the plants and animals that make up a mangrove ecosystem.", sourceUrl: "https://www.nparks.gov.sg/visit/events/event-detail/SBWRMAN6/1850_What-s-in-my-mangrove", registrationNote: "Register on site at least 15 minutes before the walk; places are first come, first served." },
  { id: "nss-rifle-range-2026", title: "Butterfly Walk at Rifle Range Trail", organiser: "nss", category: "walk", start: "2026-10-18T09:00:00+08:00", end: "2026-10-18T12:00:00+08:00", location: "Rifle Range Nature Park, 5 Rifle Range Road, Singapore 588900", summary: "Join NSS to look for forest butterflies. Check the organiser’s final meeting details.", sourceUrl: "https://nss.org.sg/events/butterfly-walk-at-rifle-range-trail/", registrationDeadline: "2026-10-11" },
  { id: "nparks-lim-chu-kang-biodiversity-oct-2026", title: "Biodiversity Walk at Lim Chu Kang / Cashin House", organiser: "nparks", category: "walk", start: "2026-10-24T09:00:00+08:00", end: "2026-10-24T11:00:00+08:00", location: "Bus bay drop-off, Visitor Centre carpark, Sungei Buloh Wetland Reserve, 60 Kranji Way, Singapore 739453", summary: "A guided exploration of the Lim Chu Kang nature area and Cashin House landscape.", sourceUrl: "https://www.nparks.gov.sg/visit/events/event-detail/LCKBIO1/4166_Biodiversity-Walk-at-Lim-Chu-Kang-Cashin-House", registrationNote: "Registration is required; the organiser page does not publish a closing date." },
  { id: "nparks-water-oct-24-2026", title: "What’s in my water?", organiser: "nparks", category: "walk", start: "2026-10-24T09:30:00+08:00", end: "2026-10-24T11:00:00+08:00", location: "Information Counter, Visitor Centre, Sungei Buloh Wetland Reserve, 60 Kranji Way, Singapore 739453", summary: "A guided freshwater exploration of aquatic life and water quality at the wetland reserve.", sourceUrl: "https://www.nparks.gov.sg/visit/events/event-detail/SBWRWAT4/1853_What-s-in-my-water", registrationNote: "Register on site at least 15 minutes before the walk; places are first come, first served." },
  { id: "nparks-mangrove-oct-31-2026", title: "What’s in my mangrove?", organiser: "nparks", category: "walk", start: "2026-10-31T09:30:00+08:00", end: "2026-10-31T11:00:00+08:00", location: "Information Counter, Visitor Centre, Sungei Buloh Wetland Reserve, 60 Kranji Way, Singapore 739453", summary: "A guided look at the plants and animals that make up a mangrove ecosystem.", sourceUrl: "https://www.nparks.gov.sg/visit/events/event-detail/SBWRMAN6/1851_What-s-in-my-mangrove", registrationNote: "Register on site at least 15 minutes before the walk; places are first come, first served." },
  { id: "nparks-water-nov-07-2026", title: "What’s in my water?", organiser: "nparks", category: "walk", start: "2026-11-07T09:30:00+08:00", end: "2026-11-07T11:00:00+08:00", location: "Information Counter, Visitor Centre, Sungei Buloh Wetland Reserve, 60 Kranji Way, Singapore 739453", summary: "A guided freshwater exploration of aquatic life and water quality at the wetland reserve.", sourceUrl: "https://www.nparks.gov.sg/visit/events/event-detail/SBWRWAT5/1854_What-s-in-my-water", registrationNote: "Register on site at least 15 minutes before the walk; places are first come, first served." },
  { id: "nparks-mangrove-nov-14-2026", title: "What’s in my mangrove?", organiser: "nparks", category: "walk", start: "2026-11-14T09:30:00+08:00", end: "2026-11-14T11:00:00+08:00", location: "Information Counter, Visitor Centre, Sungei Buloh Wetland Reserve, 60 Kranji Way, Singapore 739453", summary: "A guided look at the plants and animals that make up a mangrove ecosystem.", sourceUrl: "https://www.nparks.gov.sg/visit/events/event-detail/SBWRMAN7/1856_What-s-in-my-mangrove", registrationNote: "Register on site at least 15 minutes before the walk; places are first come, first served." },
  { id: "nparks-mangrove-nov-21-2026", title: "What’s in my mangrove?", organiser: "nparks", category: "walk", start: "2026-11-21T09:30:00+08:00", end: "2026-11-21T11:00:00+08:00", location: "Information Counter, Visitor Centre, Sungei Buloh Wetland Reserve, 60 Kranji Way, Singapore 739453", summary: "A guided look at the plants and animals that make up a mangrove ecosystem.", sourceUrl: "https://www.nparks.gov.sg/visit/events/event-detail/SBWRMAN7/1857_What-s-in-my-mangrove", registrationNote: "Register on site at least 15 minutes before the walk; places are first come, first served." },
  { id: "nparks-water-nov-28-2026", title: "What’s in my water?", organiser: "nparks", category: "walk", start: "2026-11-28T09:30:00+08:00", end: "2026-11-28T11:00:00+08:00", location: "Information Counter, Visitor Centre, Sungei Buloh Wetland Reserve, 60 Kranji Way, Singapore 739453", summary: "A guided freshwater exploration of aquatic life and water quality at the wetland reserve.", sourceUrl: "https://www.nparks.gov.sg/visit/events/event-detail/SBWRWAT5/1855_What-s-in-my-water", registrationNote: "Register on site at least 15 minutes before the walk; places are first come, first served." },
  { id: "nparks-water-dec-12-2026", title: "What’s in my water?", organiser: "nparks", category: "walk", start: "2026-12-12T09:30:00+08:00", end: "2026-12-12T11:00:00+08:00", location: "Information Counter, Visitor Centre, Sungei Buloh Wetland Reserve, 60 Kranji Way, Singapore 739453", summary: "A guided freshwater exploration of aquatic life and water quality at the wetland reserve.", sourceUrl: "https://www.nparks.gov.sg/visit/events/event-detail/SBWRWAT2/1860_What-s-in-my-water", registrationNote: "Register on site at least 15 minutes before the walk; places are first come, first served." },
  { id: "nparks-wader-watch-dec-12-2026", title: "Wader Watch", organiser: "nparks", category: "walk", start: "2026-12-12T09:30:00+08:00", end: "2026-12-12T11:00:00+08:00", location: "Sungei Buloh Wetland Reserve, 301 Neo Tiew Crescent, Singapore 718925", summary: "Learn how migratory shorebirds use the reserve and practise responsible observation.", sourceUrl: "https://www.nparks.gov.sg/visit/events/event-detail/SBWRWW3/4168_Wader-Watch", registrationNote: "Check the organiser page for the exact meeting point and current registration status; no closing date is published." },
  { id: "nparks-water-dec-26-2026", title: "What’s in my water?", organiser: "nparks", category: "walk", start: "2026-12-26T09:30:00+08:00", end: "2026-12-26T11:00:00+08:00", location: "Information Counter, Visitor Centre, Sungei Buloh Wetland Reserve, 60 Kranji Way, Singapore 739453", summary: "A guided freshwater exploration of aquatic life and water quality at the wetland reserve.", sourceUrl: "https://www.nparks.gov.sg/visit/events/event-detail/SBWRWAT2/1861_What-s-in-my-water", registrationNote: "Register on site at least 15 minutes before the walk; places are first come, first served." },
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
  const registration = event.registrationDeadline
    ? `Registration deadline listed: ${event.registrationDeadline}.${event.registrationNote ? ` ${event.registrationNote}` : ""}`
    : event.registrationNote ?? "Confirm time and registration with the organiser.";
  return ["BEGIN:VEVENT",`UID:${event.id}@aniquest.local`, `DTSTAMP:${utcIcs(now)}`,`DTSTART:${utcIcs(event.start)}`,...(event.end ? [`DTEND:${utcIcs(event.end)}`] : []),`SUMMARY:${escapeIcs(event.title)}`,`LOCATION:${escapeIcs(event.location)}`,`DESCRIPTION:${escapeIcs(`${organiser}. ${event.summary}\n${registration}\n${event.sourceUrl}`)}`,`URL:${event.sourceUrl}`,"END:VEVENT"];
}
export function eventsCalendarFile(events: AnimalEvent[], now = new Date()): string {
  return ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//AniQuest//Animal Events//EN","CALSCALE:GREGORIAN",...events.flatMap((event) => eventCalendarLines(event, now)),"END:VCALENDAR"].map(foldIcs).join("\r\n") + "\r\n";
}
export function eventCalendarFile(event: AnimalEvent, now = new Date()): string {
  return eventsCalendarFile([event], now);
}
