import type { AnimalProfile } from "./species-profiles";
import type { SpeciesRecord } from "./species-data";

// Source-backed additions reviewed 6 September 2026. Research trail: docs/research/.
export const EXPANDED_SPECIES = [
  {
    "scientific": "Tragulus napu",
    "name": "Greater mousedeer",
    "emoji": "🐾",
    "habitat": "Forest understorey",
    "rarity": "Restricted and elusive",
    "statusCode": "CR",
    "sourceUrl": "https://www.nparks.gov.sg/florafaunaweb/fauna/1/1/11",
    "statusSourceUrl": "https://www.nparks.gov.sg/nature/species-list/terrestrial-mammals",
    "globalStatus": "Dated assessment not verified in this edition",
    "globalSourceUrl": "",
    "profile": {
      "id": "greater-mousedeer",
      "group": "Mammal",
      "family": "Tragulidae",
      "aliases": [
        "Greater mouse-deer",
        "Greater mouse deer",
        "Greater Malay chevrotain",
        "napu",
        "napuh"
      ],
      "origin": "Native",
      "encounter": "Rare or restricted",
      "habitats": [
        "Forest",
        "Offshore islands"
      ],
      "summary": "A small hoofed forest browser with a rounded body and very slender legs. Its rediscovery on Pulau Ubin shows why an animal missing from casual sightings is not necessarily gone.",
      "identification": "Reddish-brown fur, pale underparts and contrasting throat markings. More robust than the lesser mousedeer; useful photographs show the neck and chest, not just apparent size. It has no antlers.",
      "diet": "Fallen fruit, tender leaves and other low-growing plant material.",
      "activity": "Mostly nocturnal; usually feeds quietly on the forest floor.",
      "behaviour": "Typically encountered alone while browsing or resting under cover. A published Singapore survey also recorded more than one animal together, so solitary does not mean never seen with another.",
      "reproduction": "Usually produces one well-developed young. Regional accounts describe a pregnancy of roughly five months; this is not a prediction of Singapore birth dates. Juveniles were documented during the Ubin rediscovery study.",
      "singapore": "Confirmed on Pulau Ubin in 2008 after a long gap in verified records. NParks still includes the species in its 2025 Ubin conservation work. Its limited Singapore distribution does not mean every suitable mainland forest contains it.",
      "ecologicalRole": "A forest-floor plant consumer and part of the food web linking vegetation to predators.",
      "pressures": "Habitat disturbance and fragmentation can affect its restricted local habitat. Hunting is a pressure across its wider range. Protecting forest cover and limiting disturbance support its persistence.",
      "watch": "Keep to permitted paths, observe quietly and never feed or pursue it. Leave dense undergrowth undisturbed and do not share exact resting locations.",
      "funFacts": [
        {
          "title": "A comeback in the records",
          "text": "The decisive 2008 rediscovery photographs showed the throat and chest markings needed to identify the species.",
          "sourceUrl": "https://lkcnhm.nus.edu.sg/wp-content/uploads/sites/11/app/uploads/2017/04/2009nis373-378.pdf"
        },
        {
          "title": "Tiny hooves, no antlers",
          "text": "Despite the name, a mousedeer is a chevrotain. Males have enlarged canine teeth rather than antlers.",
          "sourceUrl": "https://animaldiversity.org/accounts/Tragulus_napu/"
        }
      ],
      "sources": [
        {
          "name": "NUS · Greater mousedeer rediscovery study (2009)",
          "url": "https://lkcnhm.nus.edu.sg/wp-content/uploads/sites/11/app/uploads/2017/04/2009nis373-378.pdf",
          "supports": "Singapore occurrence, diagnostic markings, juveniles and conservation context"
        },
        {
          "name": "NParks · Ubin conservation update (2025)",
          "url": "https://www.nparks.gov.sg/news/news-detail/the-next-bound-of-the-ubin-project-makes-headway-with-conservation--and-community-driven-initiatives",
          "supports": "Continued inclusion of greater mousedeer in local habitat conservation"
        },
        {
          "name": "Animal Diversity Web · University of Michigan",
          "url": "https://animaldiversity.org/accounts/Tragulus_napu/",
          "supports": "General reproduction and absence of antlers; older taxonomy and global range text are not adopted"
        },
        {
          "name": "NParks · wildlife encounters",
          "url": "https://www.nparks.gov.sg/visit/when-visiting-parks/when-encountering-animals",
          "supports": "No feeding or removal of wildlife"
        }
      ],
      "taxonomyNote": "A chevrotain in Tragulidae, distinct from true deer in Cervidae. Older sources include the Philippine mousedeer under Tragulus napu; no Philippine conservation label is transferred to Singapore animals.",
      "statusNote": "Singapore: Critically Endangered in RDB3 (2024), checked 6 September 2026. The older NParks profile's 'Indeterminate' field is not used as the current national assessment. A dated global IUCN assessment could not be directly verified in this review."
    },
    "sourceName": "NParks · Flora & Fauna Web",
    "reviewedAt": "2026-09-06",
    "fact": "The decisive 2008 rediscovery photographs showed the throat and chest markings needed to identify the species."
  },
  {
    "scientific": "Hystrix brachyura",
    "name": "Malayan porcupine",
    "emoji": "🐾",
    "habitat": "Mature forest",
    "rarity": "Rare and nocturnal",
    "statusCode": "CR",
    "sourceUrl": "https://www.nparks.gov.sg/florafaunaweb/fauna/2/3/238",
    "statusSourceUrl": "https://www.nparks.gov.sg/nature/species-list/terrestrial-mammals",
    "globalStatus": "Dated assessment not verified in this edition",
    "globalSourceUrl": "",
    "profile": {
      "id": "malayan-porcupine",
      "group": "Mammal",
      "family": "Hystricidae",
      "aliases": [
        "Himalayan porcupine",
        "East Asian porcupine"
      ],
      "origin": "Native",
      "encounter": "Rare or restricted",
      "habitats": [
        "Forest",
        "Offshore islands"
      ],
      "summary": "A large ground-dwelling rodent with striking defensive quills. Camera traps helped establish that this secretive native mammal still survived in Singapore after decades with few reports.",
      "identification": "A blunt muzzle, stout body, short legs and a short tail. The longest back quills are strongly patterned in black and white. It is a porcupine, not a hedgehog.",
      "diet": "Fruit, roots and stems, gathered while foraging on the ground.",
      "activity": "Nocturnal; normally shelters in burrows during daylight.",
      "behaviour": "Digs burrows and travels on land. A threatened animal can raise its quills, rattle its tail and back towards a threat; leave it room to retreat.",
      "reproduction": "Gives birth to live young. The Singapore field sources reviewed here do not establish a local breeding season or typical litter size, so no exact reproductive timetable is claimed.",
      "singapore": "Rediscovered on an offshore island in 2005. Later camera-trap records documented animals in mainland forest reserves and other wooded areas. RDB3 continues to recognise a native, nationally Critically Endangered population.",
      "ecologicalRole": "Its plant feeding links roots, stems and fallen fruit to the forest food web; burrowing also disturbs small patches of soil.",
      "pressures": "Forest loss and fragmentation reduce habitat. Hunting for meat and trade in body parts are documented regional pressures; the reviewed sources do not provide a current Singapore hunting rate.",
      "watch": "Keep a generous distance and never block its path or approach a burrow. Do not attempt to handle an animal or remove its quills.",
      "funFacts": [
        {
          "title": "No quill launcher",
          "text": "Porcupines cannot shoot their quills. A quill can detach after contact, which helps explain the familiar myth.",
          "sourceUrl": "https://lkcnhm.nus.edu.sg/wp-content/uploads/sites/11/app/uploads/2017/06/2016nis063-068.pdf"
        },
        {
          "title": "A warning with a rattle",
          "text": "Hollow quills on the short tail make a rattling sound when shaken.",
          "sourceUrl": "https://lkcnhm.nus.edu.sg/wp-content/uploads/sites/11/app/uploads/2017/06/2016nis063-068.pdf"
        }
      ],
      "sources": [
        {
          "name": "NUS / NParks · Malayan porcupine records (2016)",
          "url": "https://lkcnhm.nus.edu.sg/wp-content/uploads/sites/11/app/uploads/2017/06/2016nis063-068.pdf",
          "supports": "Rediscovery, camera-trap occurrence, defensive behaviour, tail quills and pressures"
        },
        {
          "name": "NParks · wildlife encounters",
          "url": "https://www.nparks.gov.sg/visit/when-visiting-parks/when-encountering-animals",
          "supports": "No feeding or removal of wildlife"
        }
      ],
      "statusNote": "Singapore: Critically Endangered in RDB3 (2024), checked 6 September 2026. This national category is separate from global risk. A dated global IUCN assessment could not be directly verified in this review."
    },
    "sourceName": "NParks · Flora & Fauna Web",
    "reviewedAt": "2026-09-06",
    "fact": "Porcupines cannot shoot their quills. A quill can detach after contact, which helps explain the familiar myth."
  },
  {
    "scientific": "Iomys horsfieldii",
    "name": "Horsfield’s flying squirrel",
    "emoji": "🐿️",
    "habitat": "Forest canopy",
    "rarity": "Elusive night-time glider",
    "statusCode": "EN",
    "sourceUrl": "https://www.nparks.gov.sg/florafaunaweb/fauna/2/3/236",
    "statusSourceUrl": "https://www.nparks.gov.sg/nature/species-list/terrestrial-mammals",
    "globalStatus": "Dated assessment not verified in this edition",
    "globalSourceUrl": "",
    "profile": {
      "id": "horsfields-flying-squirrel",
      "group": "Mammal",
      "family": "Sciuridae",
      "aliases": [
        "Horsfield's flying squirrel",
        "Javanese flying squirrel"
      ],
      "origin": "Native",
      "encounter": "Rare or restricted",
      "habitats": [
        "Forest",
        "Wooded parks"
      ],
      "summary": "A nocturnal squirrel that glides between trees on a membrane joining its limbs. Its quiet life above the ground makes it much less conspicuous than the daytime squirrels in parks.",
      "identification": "Dark brown upperparts, a paler orange-buff or whitish underside and rusty edges to the gliding membrane. A rounded head, large eyes and long, flattened, feather-like tail complete its outline.",
      "diet": "Mainly fruit, with insects also listed in the NParks species account.",
      "activity": "Active at night; rests in a tree cavity by day.",
      "behaviour": "Climbs using sharp claws and spreads its membrane to glide. It depends on trees for feeding, shelter and travel. Detailed social behaviour remains poorly studied.",
      "reproduction": "Gives birth to live young, but the reviewed species account does not establish its mating system, breeding season or litter size. Values from larger flying squirrels are not substituted.",
      "singapore": "Recorded in Singapore's central forest reserves and in a wooded nature park outside them. Local records require careful identification; difficulty seeing a nocturnal animal is not a population estimate.",
      "ecologicalRole": "A canopy fruit consumer that also eats small invertebrates. Its precise contribution to seed dispersal in Singapore has not been quantified in the reviewed sources.",
      "pressures": "Loss of forest and suitable cavity-bearing trees removes shelter and foraging areas. Maintaining connected wooded habitat is important for a species that travels between trees.",
      "watch": "Observe from permitted routes and avoid flash, sustained spotlighting or disturbance of tree holes. Never lure an animal with food or enter closed areas to seek it.",
      "funFacts": [
        {
          "title": "A squirrel with a sail",
          "text": "Its gliding membrane stretches between all four limbs; the long tail is flattened rather than round and bushy.",
          "sourceUrl": "https://www.nparks.gov.sg/florafaunaweb/fauna/2/3/236"
        },
        {
          "title": "Two names, one animal",
          "text": "Horsfield’s flying squirrel and Javanese flying squirrel are common names for the same species, Iomys horsfieldii.",
          "sourceUrl": "https://animaldiversity.org/accounts/Iomys_horsfieldii/"
        }
      ],
      "sources": [
        {
          "name": "Animal Diversity Web · University of Michigan",
          "url": "https://animaldiversity.org/accounts/Iomys_horsfieldii/",
          "supports": "Alternative name, climbing anatomy and explicit reproductive knowledge gaps"
        },
        {
          "name": "Nick Baker · published Singapore flying-squirrel study",
          "url": "https://www.ecologyasia.com/html-menu/eco-location.htm",
          "supports": "Author's abstract of Chua et al. (2013), documenting a record beyond the central reserves"
        },
        {
          "name": "NUS · Nature in Singapore volume 6 (2013)",
          "url": "https://lkcnhm.nus.edu.sg/nis-volumes/volume-6-2013/",
          "supports": "Publication record for the Singapore locality study"
        },
        {
          "name": "NParks · wildlife encounters",
          "url": "https://www.nparks.gov.sg/visit/when-visiting-parks/when-encountering-animals",
          "supports": "No feeding or removal of wildlife"
        }
      ],
      "taxonomyNote": "Use Iomys horsfieldii. 'Javanese' in a common name does not mean the species is introduced from Java; NParks lists Singapore animals as native.",
      "statusNote": "Singapore: Endangered in RDB3 (2024), checked 6 September 2026. Older descriptions of the species as possibly extinct in Singapore are not used. A dated global IUCN assessment could not be directly verified in this review."
    },
    "sourceName": "NParks · Flora & Fauna Web",
    "reviewedAt": "2026-09-06",
    "fact": "Its gliding membrane stretches between all four limbs; the long tail is flattened rather than round and bushy."
  },
  {
    "scientific": "Hylopetes spadiceus",
    "name": "Red-cheeked flying squirrel",
    "emoji": "🐿️",
    "habitat": "Mature forest canopy",
    "rarity": "Rare and restricted",
    "statusCode": "CR",
    "sourceUrl": "https://www.nparks.gov.sg/florafaunaweb/fauna/0/7/07",
    "statusSourceUrl": "https://www.nparks.gov.sg/nature/species-list/terrestrial-mammals",
    "globalStatus": "Dated assessment not verified in this edition",
    "globalSourceUrl": "",
    "profile": {
      "id": "red-cheeked-flying-squirrel",
      "group": "Mammal",
      "family": "Sciuridae",
      "aliases": [
        "Red-cheeked gliding squirrel"
      ],
      "origin": "Native",
      "encounter": "Rare or restricted",
      "habitats": [
        "Forest"
      ],
      "summary": "A tiny forest squirrel with warm-coloured cheeks and a broad gliding membrane. It is one of Singapore's least conspicuous mammals and needs careful observation to separate it from other gliders.",
      "identification": "Grey-brown upperparts with rusty colouring, a pale underside, orange-brown cheeks and a flattened tail. NParks describes a narrow white edge along the side of the gliding membrane.",
      "diet": "Regional observations describe fruit, flowers and leaves, with some insects.",
      "activity": "Nocturnal and mainly active in trees.",
      "behaviour": "Glides between trees and shelters in cavities in tall trunks. It appears largely solitary, but detailed social studies are limited.",
      "reproduction": "Uses sheltered tree holes. Reliable species-specific breeding dates and litter sizes were not established in this review. Frequently repeated numbers in one educational account are actually attributed to a different Hylopetes species.",
      "singapore": "Recorded from Bukit Timah and Central Catchment forests. The latter records were published in 2013, so the older statement that it occurs only in Bukit Timah is not retained.",
      "ecologicalRole": "Connects canopy plant resources and small invertebrates with the forest food web. No measured Singapore seed-dispersal rate is claimed.",
      "pressures": "Loss or degradation of mature forest can remove both food and cavity shelters. Its restricted habitat and small size also make monitoring difficult.",
      "watch": "Watch quietly from open trails without flash or prolonged direct light. Do not inspect occupied tree cavities or publish exact shelter locations.",
      "funFacts": [
        {
          "title": "An arrow-shaped tail",
          "text": "Its broad, flattened tail gives the group its 'arrow-tailed flying squirrel' nickname.",
          "sourceUrl": "https://animaldiversity.org/accounts/Hylopetes_spadiceus/"
        },
        {
          "title": "A pale edge to the sail",
          "text": "A thin white margin outlines the sides of the gliding membrane described by NParks.",
          "sourceUrl": "https://www.nparks.gov.sg/florafaunaweb/fauna/0/7/07"
        }
      ],
      "sources": [
        {
          "name": "Animal Diversity Web · University of Michigan",
          "url": "https://animaldiversity.org/accounts/Hylopetes_spadiceus/",
          "supports": "Tail form, regional diet and the limits of reproductive evidence"
        },
        {
          "name": "Nick Baker · published Singapore flying-squirrel study",
          "url": "https://www.ecologyasia.com/html-menu/eco-location.htm",
          "supports": "Author's abstract of the 2013 Central Catchment locality record"
        },
        {
          "name": "NUS · Nature in Singapore volume 6 (2013)",
          "url": "https://lkcnhm.nus.edu.sg/nis-volumes/volume-6-2013/",
          "supports": "Publication record for the Singapore locality study"
        },
        {
          "name": "NParks · wildlife encounters",
          "url": "https://www.nparks.gov.sg/visit/when-visiting-parks/when-encountering-animals",
          "supports": "No feeding or removal of wildlife"
        }
      ],
      "taxonomyNote": "Hylopetes species can look similar. Breeding figures attributed to Hylopetes lepidus in older literature must not be relabelled as measurements for H. spadiceus.",
      "statusNote": "Singapore: Critically Endangered in RDB3 (2024), checked 6 September 2026. A dated global IUCN assessment could not be directly verified in this review."
    },
    "sourceName": "NParks · Flora & Fauna Web",
    "reviewedAt": "2026-09-06",
    "fact": "Its broad, flattened tail gives the group its 'arrow-tailed flying squirrel' nickname."
  },
  {
    "scientific": "Arctogalidia trivirgata",
    "name": "Small-toothed palm civet",
    "emoji": "🐾",
    "habitat": "Forest canopy",
    "rarity": "Rare and elusive",
    "statusCode": "CR",
    "sourceUrl": "https://lkcnhm.nus.edu.sg/wp-content/uploads/sites/10/2023/06/NIS-2023-0055.pdf",
    "statusSourceUrl": "https://www.nparks.gov.sg/nature/species-list/terrestrial-mammals",
    "globalStatus": "Dated assessment not verified in this edition",
    "globalSourceUrl": "",
    "profile": {
      "id": "small-toothed-palm-civet",
      "group": "Mammal",
      "family": "Viverridae",
      "aliases": [
        "Three-striped palm civet"
      ],
      "origin": "Native",
      "encounter": "Rare or restricted",
      "habitats": [
        "Forest"
      ],
      "summary": "A canopy-dwelling civet that is much less often seen than Singapore's familiar Sumatran palm civet. Published observations of adults and apparent young show how much remains to learn about its forest life.",
      "identification": "Usually brownish-grey with a darker face and tail, pale forehead marking and three dark lines along the back. Markings vary, so a quick glimpse is insufficient to identify an unfamiliar civet confidently.",
      "diet": "Fruit is important, alongside insects and small vertebrates. It belongs to the carnivore order but has an omnivorous diet.",
      "activity": "Nocturnal and strongly arboreal; often rests high in vegetation.",
      "behaviour": "Often described as solitary. Singapore observers have also recorded pairs resting close together, although their ages and relationship could not always be confirmed.",
      "reproduction": "Females produce and nurse dependent young. Published Singapore sightings include an apparent juvenile, but those observations do not establish a breeding season or confirm that every pair is a mother and offspring.",
      "singapore": "Associated with the central nature reserves. A 2023 NUS biodiversity record documents observations in secondary forest during 2022–2023. Exact resting trees are omitted from this guide.",
      "ecologicalRole": "A fruit eater and predator of small animals. Seed transport is a plausible ecological contribution, but the profile does not claim a measured local dispersal rate or a demonstrated keystone role.",
      "pressures": "Forest loss and degradation affect canopy habitat. The reviewed literature describes hunting and capture elsewhere in its range; it does not quantify current Singapore exploitation.",
      "watch": "Use binoculars from permitted paths and leave resting animals undisturbed. Never bait, feed, touch or follow a civet into the forest.",
      "funFacts": [
        {
          "title": "A treetop cuddle",
          "text": "A published Singapore record describes two civets resting against each other in the canopy; the observers could not confirm their relationship.",
          "sourceUrl": "https://lkcnhm.nus.edu.sg/wp-content/uploads/sites/10/2023/06/NIS-2023-0055.pdf"
        },
        {
          "title": "Carnivore, fruit included",
          "text": "Belonging to the order Carnivora does not mean an all-meat menu: fruit is an important food for this civet.",
          "sourceUrl": "https://animaldiversity.org/accounts/Arctogalidia_trivirgata/"
        }
      ],
      "sources": [
        {
          "name": "Animal Diversity Web · University of Michigan",
          "url": "https://animaldiversity.org/accounts/Arctogalidia_trivirgata/",
          "supports": "Identification, diet, habitat and general maternal care; speculative keystone label is not adopted"
        },
        {
          "name": "NParks · RDB3 terrestrial mammals (2024)",
          "url": "https://www.nparks.gov.sg/nature/species-list/terrestrial-mammals",
          "supports": "Native origin, family and national Critically Endangered status"
        },
        {
          "name": "NParks · wildlife encounters",
          "url": "https://www.nparks.gov.sg/visit/when-visiting-parks/when-encountering-animals",
          "supports": "No feeding or removal of wildlife"
        }
      ],
      "taxonomyNote": "This is Arctogalidia trivirgata, distinct from the Sumatran palm civet Paradoxurus musangus. 'Three-striped palm civet' is an alternative common name, not another catalogue species.",
      "statusNote": "Singapore: Critically Endangered in RDB3 (2024), checked 6 September 2026. The NUS occurrence paper cites the older RDB2 status, so the current badge uses the separate RDB3 table. A dated global IUCN assessment could not be directly verified in this review."
    },
    "sourceName": "NUS · Nature in Singapore",
    "reviewedAt": "2026-09-06",
    "fact": "A published Singapore record describes two civets resting against each other in the canopy; the observers could not confirm their relationship."
  },
  {
    "scientific": "Ketupa ketupu",
    "name": "Buffy fish owl",
    "emoji": "🦉",
    "habitat": "Forested waterways and mangroves",
    "rarity": "Uncommon resident; often hidden by day",
    "statusCode": "VU",
    "sourceUrl": "https://www.nparks.gov.sg/florafaunaweb/fauna/6/3/631",
    "statusSourceUrl": "https://www.nparks.gov.sg/nature/species-list/birds",
    "globalStatus": "Dated assessment not verified in this edition",
    "globalSourceUrl": "",
    "profile": {
      "id": "buffy-fish-owl",
      "group": "Bird",
      "family": "Strigidae",
      "aliases": [
        "Malaysian fish owl",
        "Malay fish owl",
        "Buffy fish-owl"
      ],
      "origin": "Native",
      "encounter": "Elusive",
      "habitats": [
        "Forest",
        "Freshwater",
        "Mangrove"
      ],
      "summary": "A large owl adapted to hunting beside water. Singapore has a resident population, but daytime resting and night activity can make individual birds difficult to notice.",
      "identification": "Look for yellow eyes, outward-pointing feather tufts and warm brown plumage with dark streaks. The tufts are not its actual ears. Bird Society of Singapore gives an adult length of about 46–47 cm.",
      "diet": "Fish, crabs and frogs, with other small prey such as rats taken around banks.",
      "activity": "Mostly nocturnal; rests among tree foliage during the day.",
      "behaviour": "Often watches water from a low branch before swooping for prey. Its unfeathered lower legs and gripping feet suit this fishing lifestyle.",
      "reproduction": "A documented Singapore nesting observation found a chick in a bird's-nest fern in 2016. Such records establish local breeding, but do not provide a complete island-wide breeding calendar.",
      "singapore": "Associated with wooded streams, reservoirs and mangroves. NParks records it in the Central Catchment and Pulau Ubin; these are broad occurrence areas, not nest directions or guaranteed sightings.",
      "ecologicalRole": "Its diet links aquatic prey and land animals to a nocturnal predator in the same wetland food web.",
      "pressures": "NParks identifies illegal trapping as a threat. Keeping suitable trees and quiet water margins is a habitat-based conservation priority, not a measured population trend.",
      "watch": "Watch from open paths using binoculars. Avoid flash, prolonged torchlight, playback or crowding a resting bird. Never approach a nest or publish its precise position.",
      "funFacts": [
        {
          "title": "Those ears are feathers",
          "text": "The pointed tufts on its head are feather ornaments, not exposed ears.",
          "sourceUrl": "https://biodiversitysg.nparks.gov.sg/our-biodiversity/birds/raptors/buffy-fish-owl/"
        },
        {
          "title": "An owl with audible wings",
          "text": "Its flight is less silent than that of many other owls: fish owls lack the same degree of sound-muffling feather specialisation.",
          "sourceUrl": "https://biodiversitysg.nparks.gov.sg/our-biodiversity/birds/raptors/buffy-fish-owl/"
        }
      ],
      "sources": [
        {
          "name": "NParks · BiodiversitySG",
          "url": "https://biodiversitysg.nparks.gov.sg/our-biodiversity/birds/raptors/buffy-fish-owl/",
          "supports": "Identification, nocturnal hunting, prey, feet and both fun facts; page updated 29 May 2026"
        },
        {
          "name": "Bird Society of Singapore",
          "url": "https://singaporebirds.com/species/buffy-fish-owl",
          "supports": "Resident occurrence, qualitative encounter description and size"
        },
        {
          "name": "Nature Society (Singapore) Bird Group · 2016 nesting observation",
          "url": "https://singaporebirdgroup.wordpress.com/2016/04/30/first-nesting-record-of-the-buffy-fish-owl/",
          "supports": "Direct local observation of a chick raised in a bird's-nest fern; historical evidence, not a current nest location"
        }
      ],
      "statusNote": "Singapore RDB3: Vulnerable; older RDB2: Critically Endangered. A qualitative encounter label is not a threat category."
    },
    "sourceName": "NParks · Flora & Fauna Web",
    "reviewedAt": "2026-09-06",
    "fact": "The pointed tufts on its head are feather ornaments, not exposed ears."
  },
  {
    "scientific": "Alcedo meninting",
    "name": "Blue-eared kingfisher",
    "emoji": "🐦",
    "habitat": "Shaded forest streams and mangroves",
    "rarity": "Uncommon resident of wooded water margins",
    "statusCode": "EN",
    "sourceUrl": "https://singaporebirds.com/species/blue-eared-kingfisher",
    "statusSourceUrl": "https://www.nparks.gov.sg/nature/species-list/birds",
    "globalStatus": "Dated assessment not verified in this edition",
    "globalSourceUrl": "",
    "profile": {
      "id": "blue-eared-kingfisher",
      "group": "Bird",
      "family": "Alcedinidae",
      "aliases": [
        "Blue eared kingfisher"
      ],
      "origin": "Native",
      "encounter": "Elusive",
      "habitats": [
        "Forest",
        "Freshwater",
        "Mangrove"
      ],
      "summary": "A small resident kingfisher of shaded waterways. Its strong blue-and-rust colours can disappear surprisingly well against dark water and forest cover.",
      "identification": "Around 16 cm long, with deep cobalt-blue upperparts and rich rusty underparts. Adult males have dark bills; females can show red on the lower bill or more extensively. It is smaller and darker blue than the Common Kingfisher.",
      "diet": "Small fish and aquatic invertebrates caught around sheltered water.",
      "activity": "Look for daytime perch-and-dive hunting beside shaded water; a full local daily activity pattern is not quantified here.",
      "behaviour": "May bob its head and flick its tail while watching from a perch. After a dive, it can beat captured prey against a branch before swallowing.",
      "reproduction": "Excavates a nesting tunnel in a forest-stream bank. This guide omits exact nest positions and does not extrapolate overseas clutch sizes or breeding months to Singapore.",
      "singapore": "Bird Society of Singapore lists it as an uncommon resident that favours dense woodland and mangroves. NParks has also documented use of the Eco-Link@BKE wildlife bridge; the bridge is not a public viewing site.",
      "ecologicalRole": "A small predator linking stream invertebrates and fish to the surrounding wooded food web.",
      "pressures": "Maintaining shaded waterways and undisturbed banks follows from its documented feeding and nesting needs. This is a habitat-based conservation recommendation, not a quantified local decline claim.",
      "watch": "Remain on public paths and give bank vegetation space. Do not clear branches for photographs, bait the bird, play calls or approach a burrow entrance.",
      "funFacts": [
        {
          "title": "A home under the bank",
          "text": "Its nest is reached through a tunnel it digs into a stream bank.",
          "sourceUrl": "https://singaporebirds.com/species/blue-eared-kingfisher"
        },
        {
          "title": "A tiny bridge user",
          "text": "NParks lists this kingfisher among animals recorded using Eco-Link@BKE, the wildlife connection over the expressway.",
          "sourceUrl": "https://www.nparks.gov.sg/visit/parks/bukit-timah-nature-reserve/special-features/eco-link-bke"
        }
      ],
      "sources": [
        {
          "name": "Bird Society of Singapore",
          "url": "https://singaporebirds.com/species/blue-eared-kingfisher",
          "supports": "Identification, resident occurrence, habitat, hunting and tunnel nesting"
        },
        {
          "name": "NParks · Eco-Link@BKE",
          "url": "https://www.nparks.gov.sg/visit/parks/bukit-timah-nature-reserve/special-features/eco-link-bke",
          "supports": "Documented bridge use and research-only access; does not promise public sightings"
        }
      ],
      "statusNote": "Singapore RDB3: Endangered; older RDB2: Critically Endangered. Resident status describes occurrence, not extinction risk."
    },
    "sourceName": "Bird Society of Singapore",
    "reviewedAt": "2026-09-06",
    "fact": "Its nest is reached through a tunnel it digs into a stream bank."
  },
  {
    "scientific": "Ardea sumatrana",
    "name": "Great-billed heron",
    "emoji": "🐦",
    "habitat": "Coastal shallows, mangroves and islands",
    "rarity": "Uncommon resident restricted to coastal habitat",
    "statusCode": "CR",
    "sourceUrl": "https://www.nparks.gov.sg/florafaunaweb/fauna/2/7/274",
    "statusSourceUrl": "https://www.nparks.gov.sg/nature/species-list/birds",
    "globalStatus": "Least Concern · assessed 2024",
    "globalSourceUrl": "https://heronconservation.org/conservation/red-list/",
    "profile": {
      "id": "great-billed-heron",
      "group": "Bird",
      "family": "Ardeidae",
      "aliases": [
        "Great billed heron"
      ],
      "origin": "Native",
      "encounter": "Rare or restricted",
      "habitats": [
        "Mangrove",
        "Coast",
        "Marine"
      ],
      "summary": "A very large coastal heron with an imposing bill. Singapore's population has a Critically Endangered national assessment even though the species has a much wider international range.",
      "identification": "An adult is mostly dusky grey, with a long neck and unusually heavy, dark pointed bill. Breeding birds develop elongated plumes. Young birds are warmer brown and more streaked. Bird Society of Singapore gives a length of about 114–115 cm.",
      "diet": "Fish, crustaceans and other aquatic invertebrates.",
      "activity": "Can be watched feeding at the shoreline by day. The sources used here do not establish an exclusively daytime activity cycle.",
      "behaviour": "Usually feeds alone, waiting at the water's edge or moving slowly through the shallows before striking at prey.",
      "reproduction": "NParks describes nesting in isolated mangrove stands. Protecting suitable nesting trees matters; this guide withholds precise breeding locations and gives no unverified local clutch size.",
      "singapore": "Occurs in coastal settings, including mangroves, estuaries and offshore islands. Its association with specialised coastal habitat makes everyday inland sightings unlikely; a record at one shoreline is not a population estimate.",
      "ecologicalRole": "Its prey connects intertidal and shallow-water animals to the coastal bird food web.",
      "pressures": "NParks identifies loss or disturbance of suitable coastal feeding and nesting areas as conservation concerns. Old population estimates in the legacy profile are not presented as current counts.",
      "watch": "Use coastal hides and public paths. Stay off restricted islands and mangrove nesting areas. Give a feeding bird space instead of following it along the waterline.",
      "funFacts": [
        {
          "title": "A metre of heron",
          "text": "This heron reaches roughly 1.15 metres in length—a striking contrast with Singapore's tiny kingfishers.",
          "sourceUrl": "https://singaporebirds.com/species/great-billed-heron"
        },
        {
          "title": "Wait, step, strike",
          "text": "It hunts either by standing still at the edge or by taking slow steps through shallow water.",
          "sourceUrl": "https://www.nparks.gov.sg/florafaunaweb/fauna/2/7/274"
        }
      ],
      "sources": [
        {
          "name": "Bird Society of Singapore",
          "url": "https://singaporebirds.com/species/great-billed-heron",
          "supports": "Size, identification, resident occurrence and coastal habitat"
        },
        {
          "name": "IUCN SSC Heron Specialist Group · Heron Red List 2024-2",
          "url": "https://heronconservation.org/conservation/red-list/",
          "supports": "Dated global Least Concern assessment, 22 July 2024; separate from Singapore RDB3"
        }
      ],
      "statusNote": "Singapore RDB3: Critically Endangered. Global IUCN: Least Concern, assessed 22 July 2024; the two geographic scales answer different questions."
    },
    "sourceName": "NParks · Flora & Fauna Web",
    "reviewedAt": "2026-09-06",
    "fact": "This heron reaches roughly 1.15 metres in length—a striking contrast with Singapore's tiny kingfishers.",
    "globalAssessedAt": "2024-07-22",
    "globalReviewedAt": "2026-09-06",
    "globalAssessmentNote": "Assessment date and category verified through the IUCN SSC Heron Specialist Group’s Red List table (version 2024-2)."
  },
  {
    "scientific": "Nisaetus cirrhatus",
    "name": "Changeable hawk-eagle",
    "emoji": "🦅",
    "habitat": "Forest, woodland and wooded edges",
    "rarity": "Resident; may be seen or heard near woodland",
    "statusCode": "VU",
    "sourceUrl": "https://www.nparks.gov.sg/florafaunaweb/fauna/6/9/697",
    "statusSourceUrl": "https://www.nparks.gov.sg/nature/species-list/birds",
    "globalStatus": "Least Concern · 2020",
    "globalSourceUrl": "https://peregrinefund.org/explore-raptors-species/eagles/changeable-hawk-eagle",
    "profile": {
      "id": "changeable-hawk-eagle",
      "group": "Bird",
      "family": "Accipitridae",
      "aliases": [
        "Crested hawk-eagle",
        "Spizaetus cirrhatus",
        "Changeable hawk eagle"
      ],
      "origin": "Native",
      "encounter": "Commonly seen",
      "habitats": [
        "Forest",
        "Woodland",
        "Parks"
      ],
      "summary": "A resident forest raptor whose plumage can look dramatically different between individuals. It can be conspicuous above woodland while still depending on places to hunt and nest.",
      "identification": "Adults occur in pale and dark colour forms. Pale adults have streaked light underparts; dark adults are largely dark brown. Pale juveniles can show much cleaner white underparts. Its length is about 61–75 cm, so colour alone is insufficient for identification.",
      "diet": "Birds, small mammals and reptiles such as snakes and lizards; it may occasionally scavenge.",
      "activity": "Diurnal; hunts, perches and soars during the day.",
      "behaviour": "Often hunts by waiting quietly on a concealed perch, then making a short attack when prey comes within reach. It may also soar above wooded areas.",
      "reproduction": "Both partners construct a stick nest in a tall tree, lining it with greenery. Species accounts describe a single egg and prolonged care; breeding dates differ across its range and are not a Singapore schedule.",
      "singapore": "NParks records it in forest reserves and Pulau Ubin and highlights it in woodland birdwatching at Kranji Marshes. Bird Society lists it as a common resident; frequency of observation does not remove its national Vulnerable status.",
      "ecologicalRole": "A predator of several animal groups that links different parts of the woodland food web.",
      "pressures": "The Peregrine Fund identifies habitat loss, fragmentation and persecution across the species' range. These are range-wide pressures, not a measured Singapore population trend.",
      "watch": "Scan the canopy from public trails. Never bait a raptor or approach an occupied nest. Keep the bird's flight path clear and watch through binoculars.",
      "funFacts": [
        {
          "title": "One species, two looks",
          "text": "Pale and dark hawk-eagles can belong to the same species; these colour forms are called morphs.",
          "sourceUrl": "https://singaporebirds.com/species/changeable-hawk-eagle"
        },
        {
          "title": "A nest-building team",
          "text": "Both members of a pair help build their large stick nest and finish it with green leaves.",
          "sourceUrl": "https://peregrinefund.org/explore-raptors-species/eagles/changeable-hawk-eagle"
        }
      ],
      "sources": [
        {
          "name": "Bird Society of Singapore",
          "url": "https://singaporebirds.com/species/changeable-hawk-eagle",
          "supports": "Plumage morphs, juvenile identification, size, resident occurrence and concealed-perch hunting"
        },
        {
          "name": "The Peregrine Fund",
          "url": "https://peregrinefund.org/explore-raptors-species/eagles/changeable-hawk-eagle",
          "supports": "Diurnal activity, prey, reproduction and range-wide threats; explicitly cites the 2020 IUCN assessment"
        },
        {
          "name": "NParks · Birdwatching at Kranji Marshes",
          "url": "https://www.nparks.gov.sg/visit/parks/kranji-marshes/activities/birdwatching",
          "supports": "Present-day public woodland viewing context; no nest coordinates"
        },
        {
          "name": "NParks · Rail Corridor biodiversity",
          "url": "https://railcorridor.nparks.gov.sg/biodiversity/",
          "supports": "Historical Spizaetus cirrhatus name in the May 2018 BioBlitz account; search alias only"
        }
      ],
      "taxonomyNote": "Older Singapore accounts may use Spizaetus cirrhatus. This guide follows Nisaetus cirrhatus as used in the current NParks table.",
      "statusNote": "Singapore RDB3: Vulnerable; older RDB2: Endangered. The cited global Least Concern assessment is dated 2020, not a new 2026 assessment."
    },
    "sourceName": "NParks · Flora & Fauna Web",
    "reviewedAt": "2026-09-06",
    "fact": "Pale and dark hawk-eagles can belong to the same species; these colour forms are called morphs.",
    "globalReviewedAt": "2026-09-06",
    "globalAssessmentNote": "Published assessment: 2020, cited by The Peregrine Fund. The exact assessment date was not recovered; this is a dated reference, not a claim of the latest assessment."
  },
  {
    "scientific": "Ardea purpurea",
    "name": "Purple heron",
    "emoji": "🐦",
    "habitat": "Vegetated wetlands and marshes",
    "rarity": "Resident; easily hidden in dense wetland plants",
    "statusCode": "EN",
    "sourceUrl": "https://www.nparks.gov.sg/florafaunaweb/fauna/2/7/27",
    "statusSourceUrl": "https://www.nparks.gov.sg/nature/species-list/birds",
    "globalStatus": "Least Concern · assessed 2019",
    "globalSourceUrl": "https://heronconservation.org/conservation/red-list/",
    "profile": {
      "id": "purple-heron",
      "group": "Bird",
      "family": "Ardeidae",
      "aliases": [
        "Purple heron Ardea purpurea"
      ],
      "origin": "Native",
      "encounter": "Elusive",
      "habitats": [
        "Freshwater",
        "Marsh",
        "Mangrove"
      ],
      "summary": "A slender heron adapted to wetland vegetation. Its chestnut neck, dark lines and patient stillness make it less obvious among stems than its name might suggest.",
      "identification": "Adults have a long chestnut neck marked with dark stripes, a dark cap, greyish upperparts and a narrow pointed bill. Young birds are browner and lack the adult's strong neck markings. It is around 78–90 cm long.",
      "diet": "Fish are important prey, alongside frogs, aquatic invertebrates and other small animals; diet varies with habitat and prey availability.",
      "activity": "Often forages around morning and evening, but can also feed in daylight. Local observation times do not establish a fixed island-wide schedule.",
      "behaviour": "Waits among dense plants or moves slowly through shallow water to catch prey. Long toes help it negotiate emergent and floating vegetation.",
      "reproduction": "Builds a platform of reeds or sticks in wetland vegetation; trees and thickets can also be used. Both parents incubate and feed the young. Regional breeding seasons and clutch sizes vary, so none is presented here as a Singapore norm.",
      "singapore": "A resident species recorded in freshwater wetlands and coastal vegetation. NParks lists the Central Catchment, Sungei Buloh and Pulau Ubin. It can be familiar at suitable wetlands while remaining nationally Endangered.",
      "ecologicalRole": "A wetland predator linking small aquatic animals to the bird food web.",
      "pressures": "The Heron Specialist Group identifies wetland alteration and disturbance as pressures across its range. Retaining suitable vegetated feeding and nesting habitat is a relevant local priority; no current Singapore decline rate is asserted.",
      "watch": "Use hides and stay on public paths. Do not enter reedbeds, cut vegetation or flush a hidden bird into view. Keep nesting habitat undisturbed.",
      "funFacts": [
        {
          "title": "Feet for the reeds",
          "text": "Its elongated toes help it place careful steps on marsh plants and floating vegetation.",
          "sourceUrl": "https://heronconservation.org/herons-of-the-world/list/purple-heron/"
        },
        {
          "title": "Young birds look different",
          "text": "A young Purple Heron is mostly brownish and lacks the bold neck stripes of an adult.",
          "sourceUrl": "https://singaporebirds.com/species/purple-heron"
        }
      ],
      "sources": [
        {
          "name": "Bird Society of Singapore",
          "url": "https://singaporebirds.com/species/purple-heron",
          "supports": "Identification, size, resident status and dense wetland habitat"
        },
        {
          "name": "IUCN SSC Heron Specialist Group · species account",
          "url": "https://heronconservation.org/herons-of-the-world/list/purple-heron/",
          "supports": "Diet, foraging, toes, nesting, parental care and range-wide habitat pressures; regional schedules are not Singapore forecasts"
        },
        {
          "name": "IUCN SSC Heron Specialist Group · Heron Red List 2024-2",
          "url": "https://heronconservation.org/conservation/red-list/",
          "supports": "Global Least Concern assessment dated 14 August 2019; geographic scope kept separate from Singapore"
        }
      ],
      "statusNote": "Singapore RDB3: Endangered. Global IUCN: Least Concern, assessed 14 August 2019. Encounter frequency and extinction risk are different measures."
    },
    "sourceName": "NParks · Flora & Fauna Web",
    "reviewedAt": "2026-09-06",
    "fact": "Its elongated toes help it place careful steps on marsh plants and floating vegetation.",
    "globalAssessedAt": "2019-08-14",
    "globalReviewedAt": "2026-09-06",
    "globalAssessmentNote": "Assessment date and category verified through the IUCN SSC Heron Specialist Group’s Red List table (version 2024-2)."
  },
  {
    "scientific": "Heosemys spinosa",
    "name": "Spiny hill turtle",
    "emoji": "🐢",
    "habitat": "Mature forest",
    "rarity": "Rare; forest-restricted",
    "statusCode": "EN",
    "sourceUrl": "https://www.nparks.gov.sg/florafaunaweb/fauna/0/6/06",
    "statusSourceUrl": "https://www.nparks.gov.sg/nature/species-list/reptiles",
    "globalStatus": "Dated assessment not verified in this edition",
    "globalSourceUrl": "",
    "profile": {
      "id": "spiny-hill-turtle",
      "group": "Reptile",
      "family": "Geoemydidae",
      "aliases": [
        "Spiny hill terrapin",
        "Spiny terrapin",
        "Spiny turtle",
        "Emys spinosa"
      ],
      "origin": "Native",
      "encounter": "Rare or restricted",
      "habitats": [
        "Forest",
        "Freshwater"
      ],
      "summary": "A forest-floor turtle with an especially striking shell when young. Singapore's remaining mature forests shelter this locally Endangered reptile.",
      "identification": "Brown shell with a raised middle ridge and jagged rear edge; dark head and limbs, with reddish marks beside the head. Young turtles have much sharper shell-edge projections than adults.",
      "diet": "An omnivore. Regional research records fruit and other plant material, some animal food and mushrooms; the proportions in Singapore have not been measured here.",
      "activity": "NParks describes mainly nocturnal activity; this is not a rule that excludes daytime encounters.",
      "behaviour": "Adults spend much of their time on land. Younger turtles use water more extensively, so forest-floor and stream habitats both matter.",
      "reproduction": "Lays eggs. Breeding has been achieved in conservation collections; no Singapore nesting month or clutch-size claim is made here.",
      "singapore": "Native populations are associated with the Central Nature Reserves. The national assessment is Endangered in RDB3; encounter locations and resting sites are not mapped here.",
      "ecologicalRole": "Consumes material from several parts of the forest food web. Mushroom eating is documented, but effective fungal-spore dispersal by this species remains a research question.",
      "pressures": "Forest degradation and collection for trade threaten it. Protecting habitat and preventing collection are central conservation needs.",
      "watch": "Keep to open paths, leave it where it is and avoid handling or flash. Do not disclose a precise location or collect an animal for a pet.",
      "funFacts": [
        {
          "title": "Growing out of the spikes",
          "text": "Its dramatic juvenile shell edges become much less spiky as the turtle grows.",
          "sourceUrl": "https://www.nparks.gov.sg/florafaunaweb/fauna/0/6/06"
        },
        {
          "title": "Mushroom on the menu",
          "text": "A study published in 2026 describes a wild spiny turtle eating a mushroom in Borneo, an observation made in 2020.",
          "sourceUrl": "https://herpetologynotes.org/index.php/hn/article/download/385/210/3963"
        }
      ],
      "sources": [
        {
          "name": "NParks · Flora & Fauna Web",
          "url": "https://www.nparks.gov.sg/florafaunaweb/fauna/0/6/06",
          "supports": "Identification, activity, habitat, native occurrence and local pressures; its older VU assessment is superseded by RDB3"
        },
        {
          "name": "The Reptile Database",
          "url": "https://reptile-database.reptarium.cz/Heosemys/spinosa",
          "supports": "Taxonomy, Singapore range and egg-laying reproduction"
        },
        {
          "name": "Turtle Survival Alliance · Spiny turtle",
          "url": "https://turtlesurvival.org/species/spiny-turtle/",
          "supports": "Conservation breeding and regional threats"
        },
        {
          "name": "Herpetology Notes · Mushroom feeding observation (2026)",
          "url": "https://herpetologynotes.org/index.php/hn/article/download/385/210/3963",
          "supports": "Regional diet and a documented 2020 feeding observation; spore dispersal remains unproven"
        }
      ],
      "statusNote": "Use Endangered from Singapore RDB3 (2024), rather than the older Vulnerable label still displayed on the species page. Global and Singapore categories are separate assessments."
    },
    "sourceName": "NParks · Flora & Fauna Web",
    "reviewedAt": "2026-09-06",
    "fact": "Its dramatic juvenile shell edges become much less spiky as the turtle grows."
  },
  {
    "scientific": "Cyclemys dentata",
    "name": "Asian leaf turtle",
    "emoji": "🐢",
    "habitat": "Forest streams",
    "rarity": "Rare; highly restricted records",
    "statusCode": "CR",
    "sourceUrl": "https://www.nparks.gov.sg/florafaunaweb/fauna/2/6/260",
    "statusSourceUrl": "https://www.nparks.gov.sg/nature/species-list/reptiles",
    "globalStatus": "Dated assessment not verified in this edition",
    "globalSourceUrl": "",
    "profile": {
      "id": "asian-leaf-turtle",
      "group": "Reptile",
      "family": "Geoemydidae",
      "aliases": [
        "Asian leaf terrapin"
      ],
      "origin": "Native",
      "encounter": "Rare or restricted",
      "habitats": [
        "Forest",
        "Freshwater"
      ],
      "summary": "A secretive stream-associated turtle, listed as Critically Endangered in Singapore. Its subdued colours fit the shaded forest setting.",
      "identification": "An oval, dark-brown shell with a toothed rear edge; orange lines mark the dark head and neck. Hatchlings are flatter and more densely spotted than adults.",
      "diet": "An omnivore that eats both plant and animal material.",
      "activity": "NParks describes apparent nocturnal activity; detailed Singapore activity patterns remain poorly documented.",
      "behaviour": "Associated with forest streams and their banks. Limited sightings make this an animal to learn about without seeking out sensitive sites.",
      "reproduction": "Lays eggs; local nesting timing and clutch sizes have not been verified.",
      "singapore": "NParks documents catchment-forest records from 2006 and 2007. These are historical observations, while RDB3 (2024) retains the species as nationally Critically Endangered; neither is a current population census.",
      "ecologicalRole": "Its mixed diet connects plant material and animal prey within the forest-stream food web.",
      "pressures": "Habitat degradation and collection for food or trade are identified threats. Forest streams and surrounding cover need protection.",
      "watch": "Stay out of streams and leave turtles, eggs and cover undisturbed. Do not collect or release pet turtles into natural habitats.",
      "funFacts": [
        {
          "title": "Baby shell, different look",
          "text": "The hatchling has a flattened shell densely patterned with dark spots; adults have a dark-brown shell.",
          "sourceUrl": "https://www.nparks.gov.sg/florafaunaweb/fauna/2/6/260"
        },
        {
          "title": "A hidden splash of colour",
          "text": "Look at the reference photo: the dark head and neck carry orange lines.",
          "sourceUrl": "https://www.nparks.gov.sg/florafaunaweb/fauna/2/6/260"
        }
      ],
      "sources": [
        {
          "name": "NParks · Flora & Fauna Web",
          "url": "https://www.nparks.gov.sg/florafaunaweb/fauna/2/6/260",
          "supports": "Identification, broad ecology, dated Singapore records, native origin and pressures"
        },
        {
          "name": "The Reptile Database",
          "url": "https://reptile-database.reptarium.cz/Cyclemys/dentata",
          "supports": "Taxonomy, Singapore range and egg-laying reproduction"
        }
      ],
      "statusNote": "Critically Endangered in Singapore RDB3 (2024). A national category describes the Singapore population, not the entire global range."
    },
    "sourceName": "NParks · Flora & Fauna Web",
    "reviewedAt": "2026-09-06",
    "fact": "The hatchling has a flattened shell densely patterned with dark spots; adults have a dark-brown shell."
  },
  {
    "scientific": "Varanus nebulosus",
    "name": "Clouded monitor",
    "emoji": "🦎",
    "habitat": "Forest and wooded parks",
    "rarity": "Relatively common in suitable habitat",
    "statusCode": "LC",
    "sourceUrl": "https://biodiversitysg.nparks.gov.sg/our-biodiversity/reptiles/lizards/clouded-monitor/",
    "statusSourceUrl": "https://www.nparks.gov.sg/nature/species-list/reptiles",
    "globalStatus": "Dated assessment not verified in this edition",
    "globalSourceUrl": "",
    "profile": {
      "id": "clouded-monitor",
      "group": "Reptile",
      "family": "Varanidae",
      "aliases": [
        "Clouded monitor lizard",
        "Varanus bengalensis nebulosus"
      ],
      "origin": "Native",
      "encounter": "Commonly seen",
      "habitats": [
        "Forest",
        "Parks",
        "Scrub"
      ],
      "summary": "A native monitor that is as comfortable climbing trees as exploring the forest floor. It generally favours land habitats more than the familiar water monitor.",
      "identification": "Brown with yellow spotting. Compared with a Malayan water monitor, the head is shorter, the tail more rounded and the nostril sits farther back, about midway between the eye and snout tip. Use several features together.",
      "diet": "Searches through leaf litter for worms and other invertebrates.",
      "activity": "Diurnal: active during daylight, as documented in local forest surveys.",
      "behaviour": "Forages on the ground and climbs trees. Its ability to use both levels is a useful reminder to look above ground as well as along paths.",
      "reproduction": "Lays eggs. Local nesting dates, clutch size and incubation periods are not asserted from unrelated captive accounts.",
      "singapore": "NParks describes it as relatively common in suitable habitats, including forest and wooded gardens. This does not mean it is equally frequent in every neighbourhood.",
      "ecologicalRole": "A predator of small ground-dwelling animals within the leaf-litter food web.",
      "pressures": "Retaining forest cover, leaf litter and climbing trees helps preserve its habitat. Its local Least Concern label does not remove the need for respectful encounters.",
      "watch": "Watch from a distance and allow it to pass. Never feed, corner or handle a monitor, and keep pets under control.",
      "funFacts": [
        {
          "title": "The nose knows",
          "text": "Nostril position helps tell the two common monitors apart: the clouded monitor's nostril sits farther back from the snout tip.",
          "sourceUrl": "https://biodiversitysg.nparks.gov.sg/our-biodiversity/reptiles/lizards/clouded-monitor/"
        },
        {
          "title": "A lizard upstairs",
          "text": "Clouded monitors forage on land but can also climb trees.",
          "sourceUrl": "https://biodiversitysg.nparks.gov.sg/our-biodiversity/reptiles/lizards/clouded-monitor/"
        }
      ],
      "sources": [
        {
          "name": "NParks · BiodiversitySG",
          "url": "https://biodiversitysg.nparks.gov.sg/our-biodiversity/reptiles/lizards/clouded-monitor/",
          "supports": "Identification, diet, climbing, local habitats and relative frequency; updated 15 June 2026"
        },
        {
          "name": "The Reptile Database",
          "url": "https://reptile-database.reptarium.cz/Varanus/nebulosus",
          "supports": "Accepted taxon, former subspecies name and egg-laying reproduction"
        },
        {
          "name": "NParks · Bukit Timah vertebrate inventory (2019)",
          "url": "https://www.nparks.gov.sg/sbg/research/publications/the-gardens%27-bulletin-singapore/-/media/sbg/gardens-bulletin/gbs_71_s1_y2019_v71_s1/71_s1_05_y2019_v71s1_gbs_pg145.pdf",
          "supports": "Daytime activity and documented local occurrence; survey data are historical"
        },
        {
          "name": "NParks / AVS · Monitor lizards",
          "url": "https://avs.nparks.gov.sg/wildlife/encountering-wildlife/monitor-lizards/",
          "supports": "Safe encounters and coexistence"
        }
      ],
      "taxonomyNote": "NParks treats Varanus nebulosus as a species. Some older literature and IUCN material include it within Varanus bengalensis, so an assessment of that broader taxon must not be silently relabelled.",
      "statusNote": "Least Concern in Singapore RDB3 (2024). Its global assessment needs separate taxonomic checking."
    },
    "sourceName": "NParks · BiodiversitySG",
    "reviewedAt": "2026-09-06",
    "fact": "Nostril position helps tell the two common monitors apart: the clouded monitor's nostril sits farther back from the snout tip."
  },
  {
    "scientific": "Pelobatrachus nasutus",
    "name": "Malayan horned frog",
    "emoji": "🐸",
    "habitat": "Mature forest streams",
    "rarity": "Rare; forest-restricted",
    "statusCode": "CR",
    "sourceUrl": "https://lkcnhm.nus.edu.sg/app/uploads/2017/06/2014nis049-054.pdf",
    "statusSourceUrl": "https://www.nparks.gov.sg/nature/species-list/amphibians",
    "globalStatus": "Dated assessment not verified in this edition",
    "globalSourceUrl": "",
    "profile": {
      "id": "malayan-horned-frog",
      "group": "Amphibian",
      "family": "Megophryidae",
      "aliases": [
        "Megophrys nasuta",
        "Pelobatrachus nasuta",
        "Malayan leaf frog",
        "Long-nosed horned frog"
      ],
      "origin": "Native",
      "encounter": "Rare or restricted",
      "habitats": [
        "Forest",
        "Freshwater"
      ],
      "summary": "A leaf-shaped ambush hunter from Singapore's mature forests. Its camouflage is so effective that a call may reveal a frog that the eye has missed.",
      "identification": "Broad angular head, pointed eyelid projections and a leaf-like snout and brown body. Females are larger than males. Projection length varies, so it should not be the only identification feature.",
      "diet": "Animal prey on the forest floor, including invertebrates and small vertebrates such as other frogs or lizards.",
      "activity": "Secretive; calls can be heard around dusk and were recorded during late-afternoon breeding observations in Singapore.",
      "behaviour": "Remains still in leaf litter and ambushes passing prey. Local researchers have often detected it by its distinctive loud call near streams.",
      "reproduction": "Breeds in forest streams. A Singapore field study recorded mating and a cluster of gelatinous eggs attached beneath partly submerged bark; larvae develop in water.",
      "singapore": "Associated with patches of mature forest in the Central Nature Reserves. It is nationally Critically Endangered in RDB3; this guide avoids breeding-site directions.",
      "ecologicalRole": "An ambush predator that connects leaf-litter prey with larger forest predators; its aquatic young also depend on stream habitat.",
      "pressures": "Loss or damage to moist forest and stream habitat is a concern, alongside collection for the pet trade across its range.",
      "watch": "Listen from open trails during permitted hours. Do not use call playback, move leaf litter, enter breeding streams or handle frogs and eggs.",
      "funFacts": [
        {
          "title": "A leaf with legs",
          "text": "Its angular outline and brown colouring help a motionless frog disappear among fallen leaves.",
          "sourceUrl": "https://animaldiversity.org/accounts/Megophrys_nasuta/"
        },
        {
          "title": "Tadpole with a funnel",
          "text": "The tadpole's broad funnel-shaped mouth helps it feed at the water surface.",
          "sourceUrl": "https://animaldiversity.org/accounts/Megophrys_nasuta/"
        }
      ],
      "sources": [
        {
          "name": "NUS · Singapore breeding observations (2014)",
          "url": "https://lkcnhm.nus.edu.sg/app/uploads/2017/06/2014nis049-054.pdf",
          "supports": "Singapore breeding, habitat, female/male differences and dated observations; its old EN national category is superseded"
        },
        {
          "name": "Animal Diversity Web · University of Michigan",
          "url": "https://animaldiversity.org/accounts/Megophrys_nasuta/",
          "supports": "Camouflage, ambush feeding, prey, tadpole mouth and regional pressures under the older scientific name"
        },
        {
          "name": "American Museum of Natural History · Amphibian Species of the World",
          "url": "https://amphibiansoftheworld.amnh.org/Amphibia/Anura/Megophryidae/Megophryinae/Pelobatrachus/Pelobatrachus-nasutus",
          "supports": "Accepted scientific name and synonym history"
        },
        {
          "name": "NParks · Bukit Timah vertebrate inventory (2019)",
          "url": "https://www.nparks.gov.sg/sbg/research/publications/the-gardens%27-bulletin-singapore/-/media/sbg/gardens-bulletin/gbs_71_s1_y2019_v71_s1/71_s1_05_y2019_v71s1_gbs_pg145.pdf",
          "supports": "Local stream association, camouflage and detection by calls"
        }
      ],
      "taxonomyNote": "Pelobatrachus nasutus is the accepted name in Amphibian Species of the World. Older Singapore sources use Megophrys nasuta. NParks' online RDB3 table contains the spelling Pelobratrachus nasutus; this apparent typo is not used as the accepted name.",
      "statusNote": "Critically Endangered in Singapore RDB3 (2024), superseding the Endangered category in older Singapore publications."
    },
    "sourceName": "NUS · Nature in Singapore",
    "reviewedAt": "2026-09-06",
    "fact": "Its angular outline and brown colouring help a motionless frog disappear among fallen leaves."
  },
  {
    "scientific": "Leptobrachium nigrops",
    "name": "Black-eyed litter frog",
    "emoji": "🐸",
    "habitat": "Forest floor and streams",
    "rarity": "Elusive; common within some forest habitat",
    "statusCode": "NT",
    "sourceUrl": "https://www.nparks.gov.sg/florafaunaweb/fauna/5/0/5023",
    "statusSourceUrl": "https://www.nparks.gov.sg/nature/species-list/amphibians",
    "globalStatus": "Dated assessment not verified in this edition",
    "globalSourceUrl": "",
    "profile": {
      "id": "black-eyed-litter-frog",
      "group": "Amphibian",
      "family": "Megophryidae",
      "aliases": [
        "Black eyed litter frog"
      ],
      "origin": "Native",
      "encounter": "Elusive",
      "habitats": [
        "Forest",
        "Freshwater"
      ],
      "summary": "A small leaf-litter frog with conspicuous dark eyes and a surprisingly distinctive voice. Being common within a forest patch does not mean it is widespread across Singapore.",
      "identification": "Large head and black eyes, relatively short slender limbs, and grey or brown skin marked with irregular dark patches. The pale underside has dark speckling.",
      "diet": "Insectivorous, feeding on small animal prey in its forest-floor habitat.",
      "activity": "Mainly nocturnal.",
      "behaviour": "Lives among fallen leaves. Its rapid rattling call can be easier to notice than its camouflaged body.",
      "reproduction": "Has an aquatic tadpole stage. NParks describes the larvae as large and almost black; no verified Singapore clutch-size or fixed breeding-season estimate is supplied here.",
      "singapore": "Associated with the Central Nature Reserves and forest stream habitats. NParks surveys found it frequently in suitable forest, while RDB3 assesses it as nationally Near Threatened.",
      "ecologicalRole": "An insect predator within the forest-floor food web, with aquatic larvae linking the life cycle to water.",
      "pressures": "Maintaining connected, moist forest and its water habitats is important for this habitat-associated frog; local frequency should not be confused with habitat security.",
      "watch": "Observe without moving logs or leaves. Keep out of streams, avoid playback and flash, and leave amphibians and tadpoles untouched.",
      "funFacts": [
        {
          "title": "Tiny frog, rapid rattle",
          "text": "Researchers identify its rapid, rattling call even when the frog itself stays hidden.",
          "sourceUrl": "https://www.nparks.gov.sg/sbg/research/publications/the-gardens%27-bulletin-singapore/-/media/sbg/gardens-bulletin/gbs_71_s1_y2019_v71s1_gbs_pg145.pdf"
        },
        {
          "title": "A frog doing a handstand",
          "text": "A Singapore observation documented one balancing on its front limbs while wiping its body with its back feet; the purpose was not proven.",
          "sourceUrl": "https://lkcnhm.nus.edu.sg/app/uploads/2017/04/sbr2013-050-051.pdf"
        }
      ],
      "sources": [
        {
          "name": "NParks · Flora & Fauna Web",
          "url": "https://www.nparks.gov.sg/florafaunaweb/fauna/5/0/5023",
          "supports": "Identification, larvae, activity, diet and native forest occurrence; its 1994 V label is historical"
        },
        {
          "name": "NParks · Bukit Timah vertebrate inventory (2019)",
          "url": "https://www.nparks.gov.sg/sbg/research/publications/the-gardens%27-bulletin-singapore/-/media/sbg/gardens-bulletin/gbs_71_s1_y2019_v71_s1/71_s1_05_y2019_v71s1_gbs_pg145.pdf",
          "supports": "Local encounter context, water association and characteristic calls"
        },
        {
          "name": "NUS · Body-wiping observation (2013)",
          "url": "https://lkcnhm.nus.edu.sg/app/uploads/2017/04/sbr2013-050-051.pdf",
          "supports": "A documented 2009 body-wiping observation; grooming/moisture explanations are hypotheses"
        }
      ],
      "statusNote": "Near Threatened in Singapore RDB3 (2024). The old Vulnerable (1994) label on Flora & Fauna Web is historical, and common in suitable habitat is an encounter description, not a conservation category."
    },
    "sourceName": "NParks · Flora & Fauna Web",
    "reviewedAt": "2026-09-06",
    "fact": "Researchers identify its rapid, rattling call even when the frog itself stays hidden."
  }
] satisfies Array<Omit<SpeciesRecord, "singaporeStatus"> & { profile: AnimalProfile; reviewedAt: string }>;
