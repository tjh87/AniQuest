import { LOCAL_NEWS_FEEDS } from "./news-data";

export type NewsFeed = {
  id: string;
  name: string;
  scope: "singapore" | "world";
  url: string;
  official: boolean;
};

export type DailyFact = {
  text: string;
  sourceName: string;
  sourceUrl: string;
};

export type SiteSettingsValues = {
  announcementEnabled: boolean;
  announcementText: string;
  newsEnabled: boolean;
  quizHintsEnabled: boolean;
  dailyGoalXp: number;
  lessonRewardXp: number;
  quizRewardXp: number;
  defaultTheme: "system" | "light" | "dark";
  defaultDensity: 0 | 1 | 2;
  contentReviewDays: number;
  featuredBiome: "rainforest" | "mangrove" | "freshwater" | "coast";
  dailyFacts: DailyFact[];
  newsFeeds: NewsFeed[];
};

export const DEFAULT_SITE_SETTINGS: SiteSettingsValues = {
  announcementEnabled: false,
  announcementText: "",
  newsEnabled: true,
  quizHintsEnabled: true,
  dailyGoalXp: 100,
  lessonRewardXp: 120,
  quizRewardXp: 50,
  defaultTheme: "light",
  defaultDensity: 0,
  contentReviewDays: 30,
  featuredBiome: "rainforest",
  dailyFacts: [
    { text: "Sunda colugos glide rather than fly; their broad skin membrane stretches between the neck, limbs, digits and tail.", sourceName: "NParks Sunda colugo profile", sourceUrl: "https://biodiversitysg.nparks.gov.sg/our-biodiversity/mammals/other-mammals/sunda-colugo/" },
    { text: "An Oriental pied hornbill female stays inside a mostly sealed tree cavity while the male passes food through a narrow opening.", sourceName: "NParks Oriental pied hornbill profile", sourceUrl: "https://biodiversitysg.nparks.gov.sg/our-biodiversity/birds/other-birds/oriental-pied-hornbill/" },
    { text: "The Plantain squirrel is Singapore's most common squirrel and is often encountered in urban parks and gardens.", sourceName: "NParks Plantain squirrel profile", sourceUrl: "https://biodiversitysg.nparks.gov.sg/our-biodiversity/mammals/other-mammals/plantain-squirrel/" },
    { text: "Smooth-coated otters mainly eat fish and use habitats ranging from mangroves and ponds to urban canals.", sourceName: "NParks Smooth-coated otter profile", sourceUrl: "https://biodiversitysg.nparks.gov.sg/our-biodiversity/mammals/other-mammals/smooth-coated-otter/" },
    { text: "A Sunda pangolin's protective scales are made of keratin, the same type of protein found in human fingernails.", sourceName: "AVS pangolin guidance", sourceUrl: "https://avs.nparks.gov.sg/wildlife/encountering-wildlife/pangolins/" },
    { text: "The Malayan water monitor is a strong swimmer that can hunt live prey and also feed on carrion.", sourceName: "AVS monitor lizard guidance", sourceUrl: "https://avs.nparks.gov.sg/wildlife/encountering-wildlife/monitor-lizards/" },
    { text: "The mangrove horseshoe crab is listed as Vulnerable in Singapore’s third Red Data Book.", sourceName: "NParks Singapore Red Data Book", sourceUrl: "https://www.nparks.gov.sg/nature/species-list/arthropoda-horseshoe-crabs-and-marine-decapod-crustaceans" },
    { text: "Singapore has about 25 native bat species. Bats live in forests, parks, gardens and urban areas.", sourceName: "AVS Bats in Singapore", sourceUrl: "https://avs.nparks.gov.sg/wildlife/encountering-wildlife/bats/" },
    { text: "Bats are the world’s only flying mammals. They can eat nectar, fruit or insects.", sourceName: "AVS Bats in Singapore", sourceUrl: "https://avs.nparks.gov.sg/wildlife/encountering-wildlife/bats/" },
    { text: "Native bats pollinate durian, banana and petai flowers. They also spread seeds that help rainforests regenerate.", sourceName: "AVS Bats in Singapore", sourceUrl: "https://avs.nparks.gov.sg/wildlife/encountering-wildlife/bats/" },
    { text: "Less than 5% of Singapore’s original mangrove habitat from the 1800s remains today.", sourceName: "NParks Coastal and marine ecosystems", sourceUrl: "https://www.nparks.gov.sg/nature/ecosystems/coastal-marine" },
    { text: "Mangroves protect coastlines during storm surges. They also provide food and nursery habitats for fish.", sourceName: "NParks Coastal and marine ecosystems", sourceUrl: "https://www.nparks.gov.sg/nature/ecosystems/coastal-marine" },
    { text: "Singapore’s reefs support over 250 hard coral species, more than 200 sponge species and 120 reef fish species.", sourceName: "NParks Coastal and marine ecosystems", sourceUrl: "https://www.nparks.gov.sg/nature/ecosystems/coastal-marine" },
    { text: "Intertidal animals in Singapore’s shores are exposed to air twice a day between high and low tide.", sourceName: "NParks Coastal and marine ecosystems", sourceUrl: "https://www.nparks.gov.sg/nature/ecosystems/coastal-marine" },
    { text: "Singapore has four nature reserves. They protect many of the island’s rich ecosystems and biodiversity.", sourceName: "NParks Ecosystems in Singapore", sourceUrl: "https://www.nparks.gov.sg/nature/ecosystems" },
    { text: "Singapore is in a biodiversity hotspot. It has over 1,814 native vascular plants and 429 bird species.", sourceName: "BiodiversitySG: Biodiversity for beginners", sourceUrl: "https://biodiversitysg.nparks.gov.sg/our-biodiversity/biod-for-beginners/" },
    { text: "Singapore has 275 hard coral species and 12 seagrass species in its City in Nature.", sourceName: "BiodiversitySG: Biodiversity for beginners", sourceUrl: "https://biodiversitysg.nparks.gov.sg/our-biodiversity/biod-for-beginners/" },
  ],
  newsFeeds: [
    { id: "nparks", name: "NParks", scope: "singapore", url: "https://www.nparks.gov.sg/news", official: true },
    { id: "straits-times", name: "The Straits Times", scope: "singapore", url: "https://www.straitstimes.com/singapore/environment", official: false },
    { id: "cna", name: "CNA", scope: "singapore", url: "https://www.channelnewsasia.com/topic/wildlife", official: false },
    ...LOCAL_NEWS_FEEDS,
    { id: "associated-press", name: "Associated Press", scope: "world", url: "https://apnews.com/hub/animals", official: false },
    { id: "guardian", name: "The Guardian", scope: "world", url: "https://www.theguardian.com/environment/wildlife", official: false },
    { id: "science-news", name: "Science News", scope: "world", url: "https://www.sciencenews.org/topic/animals", official: false },
    { id: "mongabay", name: "Mongabay", scope: "world", url: "https://news.mongabay.com/list/animals/", official: false },
    { id: "reuters", name: "Reuters", scope: "world", url: "https://www.reuters.com/sustainability/climate-energy/", official: false },
    { id: "noaa", name: "NOAA Fisheries", scope: "world", url: "https://www.fisheries.noaa.gov/feature-stories", official: true },
  ],
};
