export type QuizDifficulty = "beginner" | "intermediate" | "advanced";

export type QuizQuestion = {
  id: string;
  difficulty: QuizDifficulty;
  emoji: string;
  topic: string;
  question: string;
  answers: Array<{ value: string; label: string }>;
  correctAnswer: string;
  explanation: string;
  hint: string;
  source: string;
  sourceUrl: string;
  version: number;
  speciesIds: string[];
  habitats: string[];
  objective: string;
};

const QUESTION_CONTENT: Omit<QuizQuestion, "version" | "speciesIds" | "habitats" | "objective">[] = [
  {
    id: "pangolin-scales-01", difficulty: "beginner", emoji: "🦔", topic: "Body coverings",
    question: "Which Singapore mammal is covered in protective keratin scales?",
    answers: [{ value: "pangolin", label: "Sunda pangolin" }, { value: "colugo", label: "Sunda colugo" }, { value: "otter", label: "Smooth-coated otter" }, { value: "macaque", label: "Long-tailed macaque" }],
    correctAnswer: "pangolin", explanation: "The Sunda pangolin is the only mammal in Singapore with a body covered in protective keratin scales.",
    hint: "Its name is often translated as an animal that rolls up.", source: "NParks / AVS", sourceUrl: "https://avs.nparks.gov.sg/wildlife/encountering-wildlife/pangolins/",
  },
  {
    id: "otter-species-01", difficulty: "beginner", emoji: "🦦", topic: "Singapore wildlife",
    question: "How many otter species occur in Singapore?",
    answers: [{ value: "one", label: "One" }, { value: "two", label: "Two" }, { value: "three", label: "Three" }, { value: "four", label: "Four" }],
    correctAnswer: "two", explanation: "Singapore has two otter species: the Smooth-coated otter and the Asian small-clawed otter.",
    hint: "One is much more often seen than the other.", source: "NParks / AVS", sourceUrl: "https://avs.nparks.gov.sg/wildlife/encountering-wildlife/otters/",
  },
  {
    id: "hornbill-resident-01", difficulty: "beginner", emoji: "🐦", topic: "Birds",
    question: "Which hornbill is a resident bird in Singapore?",
    answers: [{ value: "oriental-pied", label: "Oriental pied hornbill" }, { value: "great", label: "Great hornbill" }, { value: "rhinoceros", label: "Rhinoceros hornbill" }, { value: "wreathed", label: "Wreathed hornbill" }],
    correctAnswer: "oriental-pied", explanation: "The Oriental pied hornbill is Singapore's native resident hornbill and a well-known conservation comeback.",
    hint: "Look for the black-and-white bird with a pale bill and casque.", source: "NParks BiodiversitySG", sourceUrl: "https://biodiversitysg.nparks.gov.sg/our-biodiversity/birds/other-birds/oriental-pied-hornbill/",
  },
  {
    id: "monitor-common-01", difficulty: "beginner", emoji: "🦎", topic: "Reptiles",
    question: "Which of Singapore's monitor lizards is the most common?",
    answers: [{ value: "water", label: "Malayan water monitor" }, { value: "clouded", label: "Clouded monitor" }, { value: "dumerils", label: "Dumeril's monitor" }, { value: "komodo", label: "Komodo dragon" }],
    correctAnswer: "water", explanation: "The Malayan water monitor is the monitor lizard most commonly encountered in Singapore.",
    hint: "It is often seen close to canals, ponds and reservoirs.", source: "NParks / AVS", sourceUrl: "https://avs.nparks.gov.sg/wildlife/encountering-wildlife/monitor-lizards/",
  },
  {
    id: "squirrel-common-01", difficulty: "beginner", emoji: "🐿️", topic: "Urban nature",
    question: "Which squirrel is most commonly encountered in Singapore's urban parks and gardens?",
    answers: [{ value: "plantain", label: "Plantain squirrel" }, { value: "red-giant", label: "Red giant flying squirrel" }, { value: "cream", label: "Cream-coloured giant squirrel" }, { value: "variable", label: "Variable squirrel" }],
    correctAnswer: "plantain", explanation: "NParks describes the Plantain squirrel as Singapore's most common squirrel and one of its most encountered urban mammals.",
    hint: "Its common name is also a kind of banana.", source: "NParks BiodiversitySG", sourceUrl: "https://biodiversitysg.nparks.gov.sg/our-biodiversity/mammals/other-mammals/plantain-squirrel/",
  },
  {
    id: "bats-count-02", difficulty: "intermediate", emoji: "🦇", topic: "Biodiversity",
    question: "About how many native bat species does the AVS Singapore guide report?",
    answers: [{ value: "five", label: "About 5" }, { value: "twelve", label: "About 12" }, { value: "twenty-five", label: "About 25" }, { value: "sixty", label: "About 60" }],
    correctAnswer: "twenty-five", explanation: "NParks notes that Singapore has about 25 bat species, all native to the country.",
    hint: "It is more than twenty but fewer than thirty.", source: "NParks / AVS", sourceUrl: "https://avs.nparks.gov.sg/wildlife/encountering-wildlife/bats/",
  },
  {
    id: "civet-relative-02", difficulty: "intermediate", emoji: "🌙", topic: "Classification",
    question: "Civets are more closely related to which animals than to cats?",
    answers: [{ value: "mongooses", label: "Mongooses" }, { value: "otters", label: "Otters" }, { value: "squirrels", label: "Squirrels" }, { value: "pangolins", label: "Pangolins" }],
    correctAnswer: "mongooses", explanation: "Despite the name 'civet cat', civets are more closely related to mongooses than to cats.",
    hint: "Choose another small carnivoran with a long body and tail.", source: "NParks / AVS", sourceUrl: "https://avs.nparks.gov.sg/wildlife/encountering-wildlife/civets/",
  },
  {
    id: "macaque-role-02", difficulty: "intermediate", emoji: "🐒", topic: "Ecosystem roles",
    question: "What forest service can long-tailed macaques provide after eating fruit?",
    answers: [{ value: "seed-dispersal", label: "Disperse seeds" }, { value: "make-honey", label: "Make honey" }, { value: "filter-water", label: "Filter water" }, { value: "build-nests", label: "Build bird nests" }],
    correctAnswer: "seed-dispersal", explanation: "Seeds carried or passed after fruit is eaten can be moved away from the parent plant.",
    hint: "Think about what happens to the seeds inside a fruit.", source: "NParks / AVS", sourceUrl: "https://avs.nparks.gov.sg/wildlife/encountering-wildlife/macaques/",
  },
  {
    id: "hornbill-nest-02", difficulty: "intermediate", emoji: "🐦", topic: "Life cycles",
    question: "What typically happens while an Oriental pied hornbill female nests?",
    answers: [{ value: "sealed-cavity", label: "She stays in a mostly sealed tree cavity" }, { value: "floating-nest", label: "She builds a floating nest" }, { value: "ground-burrow", label: "She digs a ground burrow" }, { value: "open-branch", label: "She nests on an open branch" }],
    correctAnswer: "sealed-cavity", explanation: "The female and chicks stay inside a tree hole sealed with mud and fibres, leaving a narrow opening for food from the male.",
    hint: "Large old trees can provide an important hollow space.", source: "NParks BiodiversitySG", sourceUrl: "https://biodiversitysg.nparks.gov.sg/our-biodiversity/birds/other-birds/oriental-pied-hornbill/",
  },
  {
    id: "horseshoe-group-02", difficulty: "intermediate", emoji: "🦀", topic: "Classification",
    question: "A mangrove horseshoe crab belongs to which broad animal group?",
    answers: [{ value: "chelicerate", label: "Chelicerates" }, { value: "true-crab", label: "True crabs" }, { value: "mollusc", label: "Molluscs" }, { value: "fish", label: "Fishes" }],
    correctAnswer: "chelicerate", explanation: "Horseshoe crabs are chelicerates, not true crabs; they share their broader group with spiders and scorpions.",
    hint: "Its common name is misleading.", source: "NParks Flora & Fauna Web", sourceUrl: "https://www.nparks.gov.sg/FloraFaunaWeb/Fauna/4/3/438",
  },
  {
    id: "hawksbill-nesting-03", difficulty: "advanced", emoji: "🐢", topic: "Marine life",
    question: "At which Singapore park have female hawksbill turtles been recorded coming ashore to lay eggs?",
    answers: [{ value: "east-coast", label: "East Coast Park" }, { value: "bishan", label: "Bishan-Ang Mo Kio Park" }, { value: "fort-canning", label: "Fort Canning Park" }, { value: "hortpark", label: "HortPark" }],
    correctAnswer: "east-coast", explanation: "Female hawksbill turtles have been recorded nesting along Singapore's coast, including East Coast Park.",
    hint: "Choose the park with a long marine shoreline.", source: "NParks / AVS", sourceUrl: "https://avs.nparks.gov.sg/wildlife/encountering-wildlife/hawksbill-turtles/",
  },
  {
    id: "pangolin-diet-03", difficulty: "advanced", emoji: "🦔", topic: "Feeding ecology",
    question: "According to AVS, about how many ants and termites may an adult pangolin consume in a year?",
    answers: [{ value: "seventy-thousand", label: "70 thousand" }, { value: "seven-million", label: "7 million" }, { value: "seventy-million", label: "70 million" }, { value: "seven-billion", label: "7 billion" }],
    correctAnswer: "seventy-million", explanation: "NParks estimates that one adult pangolin can consume about 70 million ants and termites in a year.",
    hint: "The estimate is in the tens of millions.", source: "NParks / AVS", sourceUrl: "https://avs.nparks.gov.sg/wildlife/encountering-wildlife/pangolins/",
  },
  {
    id: "otter-dive-03", difficulty: "advanced", emoji: "🦦", topic: "Adaptations",
    question: "What approximate maximum dive time does the AVS otter guide mention?",
    answers: [{ value: "thirty-seconds", label: "30 seconds" }, { value: "two-minutes", label: "2 minutes" }, { value: "eight-minutes", label: "8 minutes" }, { value: "thirty-minutes", label: "30 minutes" }],
    correctAnswer: "eight-minutes", explanation: "The AVS guide mentions up to about eight minutes. This is a reported upper limit, not a typical dive duration for every otter.",
    hint: "It is longer than five minutes but under ten.", source: "NParks / AVS", sourceUrl: "https://avs.nparks.gov.sg/wildlife/encountering-wildlife/otters/",
  },
  {
    id: "pangolin-status-03", difficulty: "advanced", emoji: "🦔", topic: "Conservation",
    question: "What is the Sunda pangolin's Singapore Red List status in the 2024 Red Data Book?",
    answers: [{ value: "lc", label: "Least Concern" }, { value: "nt", label: "Near Threatened" }, { value: "en", label: "Endangered" }, { value: "cr", label: "Critically Endangered" }],
    correctAnswer: "cr", explanation: "The Sunda pangolin is Critically Endangered in Singapore's 2024 Red Data Book.",
    hint: "It is the highest threatened category before national extinction.", source: "NParks Singapore Red Data Book", sourceUrl: "https://www.nparks.gov.sg/nature/species-list/terrestrial-mammals",
  },
  {
    id: "status-scope-03", difficulty: "advanced", emoji: "📚", topic: "Source literacy",
    question: "Why can a species have different Singapore and global conservation statuses?",
    answers: [{ value: "different-areas", label: "They assess different geographic areas" }, { value: "one-is-fake", label: "One of the lists must be wrong" }, { value: "names-change", label: "Common names always change" }, { value: "weather", label: "Status changes with daily weather" }],
    correctAnswer: "different-areas", explanation: "A national assessment examines the population within Singapore, while a global assessment considers the species across its wider range.",
    hint: "Look at the place covered by each assessment.", source: "NParks National Biodiversity Strategy", sourceUrl: "https://www.nparks.gov.sg/nature/national-biodiversity-strategy-action-plan/strategies-actions",
  },
  {
    id: "freshwater-crab-endemic-01", difficulty: "beginner", emoji: "🦀", topic: "Endemic species",
    question: "Which animal is endemic to Singapore, meaning it is found nowhere else in the wild?",
    answers: [{ value: "freshwater-crab", label: "Singapore freshwater crab" }, { value: "water-monitor", label: "Malayan water monitor" }, { value: "hornbill", label: "Oriental pied hornbill" }, { value: "otter", label: "Smooth-coated otter" }],
    correctAnswer: "freshwater-crab", explanation: "The Singapore freshwater crab, Johora singaporensis, is unique to Singapore.",
    hint: "Its place name is part of both its common and scientific names.", source: "NUS Biological Sciences", sourceUrl: "https://www.dbs.nus.edu.sg/2018/05/31/critically-endangered-singapore-freshwater-crab/",
  },
  {
    id: "horseshoe-genomics-02", difficulty: "intermediate", emoji: "🧬", topic: "Research methods",
    question: "What evidence did NUS researchers use to build a population baseline for three Asian horseshoe crab species?",
    answers: [{ value: "genomes", label: "Genomic data" }, { value: "feather-colour", label: "Feather colour" }, { value: "birdsong", label: "Birdsong recordings" }, { value: "tree-rings", label: "Tree rings" }],
    correctAnswer: "genomes", explanation: "The NUS team used genome-wide DNA evidence to study genetic diversity, past ranges and possible future conservation pressures.",
    hint: "The study examined inherited information in DNA.", source: "NUS Faculty of Science", sourceUrl: "https://www.science.nus.edu.sg/blog/2025/05/asias-horseshoe-crabs-thrive-on-the-shelf/",
  },
  {
    id: "bulbul-threat-03", difficulty: "advanced", emoji: "🐦", topic: "Conservation threats",
    question: "What has driven the Straw-headed bulbul's severe decline across much of Southeast Asia?",
    answers: [{ value: "songbird-trade", label: "Capture for the songbird trade" }, { value: "volcanic-eruptions", label: "Volcanic eruptions" }, { value: "sea-ice-loss", label: "Sea-ice loss" }, { value: "road-salt", label: "Road salt" }],
    correctAnswer: "songbird-trade", explanation: "Its prized bubbling song has made the species a major target of trapping and illegal trade; Singapore remains an important stronghold.",
    hint: "The threat is linked to the bird's distinctive voice.", source: "BirdLife International", sourceUrl: "https://www.birdlife.org/news/2023/07/20/birdlifes-global-bird-walks-for-the-new-york-times-birding-project/",
  },
  {
    id: "koel-nest-01", difficulty: "beginner", emoji: "🐦", topic: "Bird behaviour",
    question: "Which bird may raise an Asian koel chick?",
    answers: [{ value: "crow", label: "A House Crow or Large-billed Crow" }, { value: "hornbill", label: "An Oriental pied hornbill" }, { value: "egret", label: "A Little egret" }, { value: "koel", label: "Another Asian koel" }],
    correctAnswer: "crow", explanation: "Asian koels lay eggs in House Crow or Large-billed Crow nests. The host parents raise the chicks.",
    hint: "This koel uses another bird’s nest.", source: "NParks BiodiversitySG", sourceUrl: "https://biodiversitysg.nparks.gov.sg/our-biodiversity/birds/other-birds/asian-koel/",
  },
  {
    id: "macaque-common-01", difficulty: "beginner", emoji: "🐒", topic: "Singapore wildlife",
    question: "What is Singapore’s most common non-human primate?",
    answers: [{ value: "macaque", label: "Long-tailed macaque" }, { value: "langur", label: "Raffles’s banded langur" }, { value: "loris", label: "Sunda slow loris" }, { value: "colugo", label: "Sunda colugo" }],
    correctAnswer: "macaque", explanation: "AVS identifies the Long-tailed macaque as Singapore’s most common non-human primate.",
    hint: "It is also called the Crab-eating macaque.", source: "AVS Macaques in Singapore", sourceUrl: "https://avs.nparks.gov.sg/wildlife/encountering-wildlife/macaques/",
  },
  {
    id: "wild-boar-native-01", difficulty: "beginner", emoji: "🐗", topic: "Native species",
    question: "Which animal is a native Singapore species and can weigh up to 100 kg?",
    answers: [{ value: "boar", label: "Wild boar" }, { value: "otter", label: "Smooth-coated otter" }, { value: "civet", label: "Sumatran palm civet" }, { value: "monitor", label: "Malayan water monitor" }],
    correctAnswer: "boar", explanation: "AVS states that the native Wild boar can weigh up to 100 kg.",
    hint: "It is a pig relative.", source: "AVS Wild Boars in Singapore", sourceUrl: "https://avs.nparks.gov.sg/wildlife/encountering-wildlife/wild-boars/",
  },
  {
    id: "macaque-habitat-02", difficulty: "intermediate", emoji: "🐒", topic: "Habitat",
    question: "Besides forests, which habitat can Long-tailed macaques use naturally?",
    answers: [{ value: "mangroves", label: "Mangroves" }, { value: "coral-reefs", label: "Coral reefs" }, { value: "open-sea", label: "Open sea" }, { value: "caves", label: "Deep caves" }],
    correctAnswer: "mangroves", explanation: "Long-tailed macaques naturally live in forested areas and can also be found in mangroves.",
    hint: "It is a coastal forest habitat.", source: "AVS Macaques in Singapore", sourceUrl: "https://avs.nparks.gov.sg/wildlife/encountering-wildlife/macaques/",
  },
  {
    id: "macaque-seed-02", difficulty: "intermediate", emoji: "🌱", topic: "Ecosystem roles",
    question: "Why can feeding macaques disrupt their role in forests?",
    answers: [{ value: "foraging", label: "It can draw them away from natural foraging and seed dispersal" }, { value: "more-seeds", label: "It always increases the number of forest seeds they disperse" }, { value: "unchanged", label: "It changes where they eat but cannot affect forest plants" }, { value: "seasonal", label: "It affects seed dispersal only during rain" }],
    correctAnswer: "foraging", explanation: "Human food can draw macaques away from forest foraging. This can disrupt the seed dispersal they provide.",
    hint: "Think about where the macaques find their food.", source: "AVS Macaques in Singapore", sourceUrl: "https://avs.nparks.gov.sg/wildlife/encountering-wildlife/macaques/",
  },
  {
    id: "coral-communities-02", difficulty: "intermediate", emoji: "🪸", topic: "Marine habitats",
    question: "Which reef zone has the highest density of marine life, according to NParks?",
    answers: [{ value: "crest", label: "Reef crest" }, { value: "flat", label: "Reef flat" }, { value: "slope", label: "Reef slope" }, { value: "beach", label: "Sandy beach" }],
    correctAnswer: "crest", explanation: "NParks states that the submerged reef crest has the highest density of marine life.",
    hint: "It lies between the flat and slope.", source: "NParks Coastal and marine ecosystems", sourceUrl: "https://www.nparks.gov.sg/nature/ecosystems/coastal-marine",
  },
  {
    id: "bird-count-03", difficulty: "advanced", emoji: "🦜", topic: "Biodiversity statistics",
    question: "A Singapore guide lists 429 bird species. Can you use that number as a bird population count?",
    answers: [{ value: "no", label: "No. It counts species, not individual birds" }, { value: "yes", label: "Yes. It means exactly 429 birds live in Singapore" }, { value: "park", label: "Yes. Each park must contain 429 birds" }, { value: "native", label: "Yes. It counts only individual native birds" }],
    correctAnswer: "no", explanation: "Species richness counts distinct species. It does not state how many individual birds live in Singapore.",
    hint: "Check what the number measures.", source: "BiodiversitySG: Biodiversity for beginners", sourceUrl: "https://biodiversitysg.nparks.gov.sg/our-biodiversity/biod-for-beginners/",
  },
  {
    id: "nature-reserves-03", difficulty: "advanced", emoji: "🌳", topic: "Conservation areas",
    question: "What conservation problem does Eco-Link@BKE help address?",
    answers: [{ value: "connection", label: "The expressway separated two forest reserves" }, { value: "tides", label: "Tides isolated a coral reef from a mangrove" }, { value: "nesting", label: "A lack of artificial nest boxes in both reserves" }, { value: "food", label: "A need to feed forest animals at fixed stations" }],
    correctAnswer: "connection", explanation: "Eco-Link@BKE reconnects Bukit Timah and Central Catchment reserves to support animal movement and seed dispersal.",
    hint: "Consider how roads divide habitat.", source: "NParks Nature areas and networks", sourceUrl: "https://www.nparks.gov.sg/visit/when-visiting-parks/about-parks-nature-reserves-pcns",
  },
  {
    id: "coral-count-03", difficulty: "advanced", emoji: "🪸", topic: "Marine biodiversity",
    question: "Why should a reef survey record depth and reef zone when comparing marine communities?",
    answers: [{ value: "conditions", label: "Depth and light affect which communities occur in each zone" }, { value: "identical", label: "Every zone supports the same community at the same density" }, { value: "flat", label: "Only the reef flat contains living organisms" }, { value: "air", label: "Every zone is exposed to air at each low tide" }],
    correctAnswer: "conditions", explanation: "Reef flats, crests and slopes support different communities. Depth and available light affect these patterns.",
    hint: "Compare the conditions on a shallow flat and a deeper slope.", source: "NParks Coastal and marine ecosystems", sourceUrl: "https://www.nparks.gov.sg/nature/ecosystems/coastal-marine",
  },
];

const QUESTION_LINKS: Record<string, [string[], string[]]> = {
  pangolin: [["sunda-pangolin"], ["Forest"]], otter: [["smooth-coated-otter"], ["Waterways"]],
  hornbill: [["oriental-pied-hornbill"], ["Forest", "Parks"]], monitor: [["malayan-water-monitor"], ["Waterways"]],
  squirrel: [["plantain-squirrel"], ["Parks"]], bats: [["lesser-dog-faced-fruit-bat"], ["Forest", "Parks"]],
  civet: [["sumatran-palm-civet", "small-toothed-palm-civet"], ["Forest"]], macaque: [["long-tailed-macaque"], ["Forest"]],
  horseshoe: [[], ["Coast"]], hawksbill: [["hawksbill-turtle"], ["Coast"]], freshwater: [[], ["Freshwater"]],
  bulbul: [["straw-headed-bulbul"], ["Forest"]], koel: [["asian-koel", "house-crow"], ["Parks"]],
  wild: [["wild-boar"], ["Forest"]], coral: [[], ["Coast"]], bird: [[], ["Across habitats"]],
  nature: [[], ["Forest"]], status: [[], ["Across habitats"]],
};
const REVISED_QUESTIONS = new Set(["macaque-seed-02", "bird-count-03", "nature-reserves-03", "coral-count-03"]);
export const QUIZ_QUESTIONS: QuizQuestion[] = QUESTION_CONTENT.map((question) => {
  const [speciesIds, habitats] = QUESTION_LINKS[question.id.split("-")[0]];
  return { ...question, version: REVISED_QUESTIONS.has(question.id) ? 2 : 1, speciesIds, habitats, objective: question.topic };
});
export const QUIZ_ANSWER_KEY = Object.fromEntries(QUIZ_QUESTIONS.map((question) => [question.id, question.correctAnswer]));
