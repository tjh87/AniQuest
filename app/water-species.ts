import type { SingaporeSpecies } from "./species-data";

const marine = "https://www.nparks.gov.sg/nature/species-list/marine-mammals";
const birds = "https://www.nparks.gov.sg/nature/species-list/birds";
const dugong = "https://www.nparks.gov.sg/florafaunaweb/fauna/2/3/232";
const dolphin = "https://www.opcf.org.hk/en/species/indo-pacific-humpback-dolphin";
const grey = "https://www.nparks.gov.sg/florafaunaweb/fauna/1/7/172";
const egret = "https://biodiversitysg.nparks.gov.sg/our-biodiversity/birds/herons/little-egret/";
const shared = { origin: "Native", reviewedAt: "2026-09-06", globalStatus: "Dated global assessment not verified in this edition", globalSourceUrl: "" } as const;

export const WATER_SPECIES: SingaporeSpecies[] = [
  {
    ...shared, id: "dugong", name: "Dugong", scientific: "Dugong dugon", emoji: "🌊", group: "Mammal", family: "Dugongidae", aliases: ["Sea cow"],
    habitat: "Coastal seas, estuaries and seagrass beds", habitats: ["Marine", "Seagrass", "Estuary", "Coast"], encounter: "Rare or restricted", rarity: "Rarely seen in Singapore waters; no population estimate implied",
    statusCode: "CR", singaporeStatus: "Critically Endangered", statusSourceUrl: marine, sourceUrl: dugong, sourceName: "NParks · Flora & Fauna Web",
    summary: "A marine mammal that grazes on seagrass. Singapore records link this quiet swimmer to shallow coastal waters and river mouths.",
    identification: "A bulky grey-brown body, blunt bristled muzzle, paired front flippers and a fluked tail. It has no dorsal fin.",
    diet: "Mainly seagrass, gathered from underwater meadows.", activity: "Feeding and resting alternate; the local NParks account describes night feeding and daytime rest in deeper water.",
    behaviour: "May travel alone, with another dugong or in small groups. It surfaces to breathe and remains fully aquatic.",
    reproduction: "A female normally produces one calf after a pregnancy lasting about thirteen to fourteen months. She nurses the calf. These general life-history notes do not establish a Singapore breeding season.",
    singapore: "NParks records it mainly from the north-eastern Johor Straits. Records also include Changi, Pulau Ubin, Pulau Tekong and Labrador. A recorded location does not guarantee a sighting.",
    ecologicalRole: "Seagrass feeding connects coastal vegetation with the marine food web.",
    pressures: "Boat propellers, fishing-net entanglement, water pollution and loss of seagrass feeding grounds threaten dugongs.",
    watch: "Observe from shore where possible. Never chase, feed or approach an animal with a boat. Report a stranded animal to NParks or ACRES and follow their instructions.",
    fact: "A dugong has no dorsal fin.",
    funFacts: [{ title: "A smooth back", text: "Unlike a dolphin, a dugong has no dorsal fin.", sourceUrl: "https://animaldiversity.org/accounts/Dugong_dugon/" }, { title: "An underwater grazer", text: "Its food meadow grows beneath the sea: dugongs feed on seagrass.", sourceUrl: dugong }],
    taxonomyNote: "A sirenian mammal, not a dolphin or a fish. Similar swimming shapes do not imply close ancestry.",
    statusNote: "RDB3 lists CR. The older Flora & Fauna Web label also says CR, but dates from RDB2.",
    sources: [{ name: "NParks · Marine mammals RDB3", url: marine, supports: "Current Singapore conservation category" }, { name: "University of Michigan · Animal Diversity Web", url: "https://animaldiversity.org/accounts/Dugong_dugon/", supports: "Anatomy, breathing and general reproduction" }],
  },
  {
    ...shared, id: "indo-pacific-humpback-dolphin", name: "Indo-Pacific humpback dolphin", scientific: "Sousa chinensis", emoji: "🐬", group: "Mammal", family: "Delphinidae", aliases: ["Chinese white dolphin", "Pink dolphin"],
    habitat: "Shallow coastal seas and estuaries", habitats: ["Marine", "Coast", "Estuary"], encounter: "Rare or restricted", rarity: "Infrequently seen locally; sightings do not establish population size",
    statusCode: "CR", singaporeStatus: "Critically Endangered", statusSourceUrl: marine, sourceUrl: dolphin, sourceName: "Ocean Park Conservation Foundation Hong Kong",
    summary: "A coastal dolphin recorded in Singapore waters. Its common pink-dolphin name does not mean every individual is pink.",
    identification: "A long narrow beak and a dorsal fin on a raised back area. Colour varies with age and region; grey markings may remain on pale adults.",
    diet: "Small fish captured in coastal waters.", activity: "Surfaces regularly to breathe between dives; Singapore-specific daily activity patterns are not established here.",
    behaviour: "A social, fully aquatic mammal. Surface behaviour can include leaps and raising the head above water.",
    reproduction: "Females give birth to calves. Hong Kong research reports a pregnancy of about eleven months. Its seasonal calving pattern must not be treated as a Singapore breeding calendar.",
    singapore: "NParks includes this dolphin in Singapore's marine mammal list. Its St John's Island trail factsheet documents sightings around the southern islands. This is wild occurrence, not a captive attraction record.",
    ecologicalRole: "A predator of coastal fish and part of the marine food web.",
    pressures: "Fishing gear, vessel strikes, pollution and coastal habitat disturbance are recognised threats across its range.",
    watch: "Do not follow, encircle or feed dolphins. Give them space to travel. Report strandings through local wildlife authorities.",
    fact: "Colour changes with age and differs between regions.",
    funFacts: [{ title: "Pink is not a rule", text: "Dolphin colour varies with age and location; some pale adults retain grey spots.", sourceUrl: dolphin }, { title: "A breath at the surface", text: "This sea-dwelling mammal uses lungs and must surface to breathe.", sourceUrl: "https://www.afcd.gov.hk/english/conservation/con_mar/con_mar_chi/con_mar_chi_chi/con_mar_chi_chi_int.html" }],
    statusNote: "RDB3 lists CR. Older Singapore sources list EN; that older category is not used for the card colour.",
    sources: [{ name: "NParks · Marine mammals RDB3", url: marine, supports: "Singapore occurrence and CR assessment" }, { name: "NParks · St John's Island trail factsheet (2017)", url: "https://www.nas.gov.sg/archivesonline/data/pdfdoc/20170902002/Factsheet%20A%20St%20Johns%20Island%20Trail.pdf", supports: "Local wild sightings; historical EN label is superseded" }, { name: "Hong Kong AFCD · Life history", url: "https://www.afcd.gov.hk/english/conservation/con_mar/con_mar_chi/con_mar_chi_chi/con_mar_chi_chi_life.html", supports: "Regional reproductive biology, not Singapore seasonality" }],
  },
  {
    ...shared, id: "grey-heron", name: "Grey heron", scientific: "Ardea cinerea", emoji: "🐦", group: "Bird", family: "Ardeidae", aliases: ["Gray heron"],
    habitat: "River edges, ponds, marshes, mangroves and mudflats", habitats: ["River", "Freshwater", "Mangrove", "Mudflat", "Coast"], encounter: "Commonly seen", rarity: "Common in suitable Singapore wetlands",
    statusCode: "LC", singaporeStatus: "Least Concern", statusSourceUrl: birds, sourceUrl: grey, sourceName: "NParks · Flora & Fauna Web",
    summary: "A large wading bird that links inland water habitats with the coast. Singapore has both resident and visiting grey herons.",
    identification: "Grey and white plumage, long legs, a long neck and a yellowish pointed bill. Adults have a dark stripe extending behind the eye.",
    diet: "Fish and other small animals captured near water.", activity: "Can feed during daylight or at night, depending on conditions.",
    behaviour: "Often waits motionless before striking at prey. It usually draws its neck back during flight.",
    reproduction: "Builds stick nests, often in colonies. Adults incubate eggs and feed dependent chicks. Do not approach nesting trees or infer local nesting dates from overseas accounts.",
    singapore: "Recorded at Sungei Buloh, Kranji and other wetlands. Freshwater margins, mangroves and coastal feeding areas all support it.",
    ecologicalRole: "Transfers energy from aquatic prey into the wider wetland food web.",
    pressures: "Wetland loss, polluted water and disturbance at feeding or nesting sites can reduce habitat quality. Common sightings are not a population census.",
    watch: "Stay on paths and use binoculars. Do not enter colonies, feed birds or approach nests for photographs.",
    fact: "A flying heron usually folds its neck back.",
    funFacts: [{ title: "A folded flight posture", text: "Herons usually fly with the neck pulled back, unlike the extended-neck posture of storks.", sourceUrl: "https://www.nparks.gov.sg/publications-resources/articles/herons-vs-storks--telling-them-apart" }, { title: "Residents and visitors", text: "Singapore's grey herons include both resident and migratory birds.", sourceUrl: "https://biodiversitysg.nparks.gov.sg/our-biodiversity/birds/herons/grey-heron/" }],
    sources: [{ name: "University of Michigan · Animal Diversity Web", url: "https://animaldiversity.org/accounts/Ardea_cinerea/", supports: "Identification, feeding, nesting and parental care" }, { name: "NParks · Birds RDB3", url: birds, supports: "National conservation category" }],
  },
  {
    ...shared, id: "little-egret", name: "Little egret", scientific: "Egretta garzetta", emoji: "🐦", group: "Bird", family: "Ardeidae", aliases: [],
    habitat: "Rivers, canals, ponds and coastal wetlands", habitats: ["River", "Freshwater", "Canal", "Mudflat", "Coast"], encounter: "Commonly seen", rarity: "Common migrant; abundance varies with season and site",
    statusCode: "LC", singaporeStatus: "Least Concern", statusSourceUrl: birds, sourceUrl: egret, sourceName: "NParks · BiodiversitySG",
    summary: "A small white heron that feeds in shallow water. It uses both urban waterways and natural coastal wetlands.",
    identification: "White plumage, a slender dark bill, dark legs and yellow feet in typical adults. Young birds can have greener legs.",
    diet: "Small fish, crustaceans and insects. Fish and insects are prey here, not added catalogue groups.", activity: "Often seen feeding in daylight; feeding opportunities depend on water levels.",
    behaviour: "May disturb the water with its feet to reveal prey. It can feed with other egrets.",
    reproduction: "Builds nests and lays eggs, often in colonies with other waterbirds. Both parents contribute to care. These species-level notes do not claim a local breeding colony.",
    singapore: "A familiar migrant at Sungei Buloh and other wetlands, including pond and canal edges. NParks records it throughout the year, with higher numbers commonly between November and January.",
    ecologicalRole: "A shallow-water predator that connects small aquatic animals to the wetland food web.",
    pressures: "Wetland disturbance and loss can remove feeding and resting places. A locally common visitor still depends on suitable habitat elsewhere along its migration route.",
    watch: "Watch from paths or hides. Avoid making birds fly away from feeding or resting areas, and never feed them.",
    fact: "Its yellow feet can stir hidden prey from shallow water.",
    funFacts: [{ title: "Feet that find food", text: "A little egret can use its feet to stir prey from the water before striking.", sourceUrl: egret }, { title: "Seasonal head plumes", text: "Breeding plumage can include two narrow plumes behind the head.", sourceUrl: "https://www.nparks.gov.sg/florafaunaweb/fauna/2/8/28" }],
    sources: [{ name: "NParks · Flora & Fauna Web", url: "https://www.nparks.gov.sg/florafaunaweb/fauna/2/8/28", supports: "Local seasonal records and breeding plumage" }, { name: "IUCN SSC Heron Specialist Group", url: "https://heronconservation.org/herons-of-the-world/list/little-egret/", supports: "General nesting and parental care" }, { name: "NParks · Birds RDB3", url: birds, supports: "National conservation category" }],
  },
];
