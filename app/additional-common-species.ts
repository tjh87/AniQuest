import type { SingaporeSpecies } from './species-data';

const birdList = 'https://www.nparks.gov.sg/nature/species-list/birds';
const reptileList = 'https://www.nparks.gov.sg/nature/species-list/reptiles';
const frogList = 'https://www.nparks.gov.sg/nature/species-list/amphibians';
const birds = 'https://juronglakegardens.nparks.gov.sg/birds/';
const herps = 'https://juronglakegardens.nparks.gov.sg/reptiles-and-amphibians/';
const guidance = 'https://www.nparks.gov.sg/visit/when-visiting-parks/when-encountering-animals';

type Entry = Pick<SingaporeSpecies, 'id'|'name'|'scientific'|'family'|'habitats'|'summary'|'identification'|'diet'|'activity'|'behaviour'|'reproduction'|'ecologicalRole'|'pressures'> & {
  group?: SingaporeSpecies['group']; origin?: SingaporeSpecies['origin']; aliases?: string[];
  sourceUrl?: string; extraSources?: { name:string; url:string; supports:string }[];
  statusCode: 'LC'|'VU'|'UNV'; statusNote?: string; taxonomyNote?: string; singapore?: string;
  facts: [{ title:string; text:string; sourceUrl?:string }, { title:string; text:string; sourceUrl?:string }];
};

const entries: Entry[] = [
  {
    id:'ornate-sunbird', name:'Ornate sunbird', scientific:'Cinnyris ornatus', family:'Nectariniidae', statusCode:'UNV',
    aliases:['Olive-backed sunbird','Cinnyris jugularis ornatus'], habitats:['Gardens','Parks','Mangroves','Forest edge'],
    summary:'A tiny flower visitor with a curved bill and bright yellow underside.',
    identification:'Males have olive upperparts, a glossy blue-black forehead, throat and breast, and a yellow belly. Females have yellow underparts, a curved bill and white in the tail.',
    diet:'Nectar and small insects, especially when feeding young.', activity:'Feeds by day among flowering shrubs and trees.',
    behaviour:'Moves quickly between flowers, sometimes hovering briefly before perching to feed.',
    reproduction:'Builds a hanging pouch nest from leaves, grass and spider web.',
    ecologicalRole:'Carries pollen between flowers and consumes small insects.',
    pressures:'Loss of flowering plants removes food. Pruning can disturb occupied hanging nests.',
    extraSources:[{name:'NParks · Jurong Lake Gardens',url:birds,supports:'Diet and hanging-nest biology under the former broader Olive-backed Sunbird treatment'}],
    taxonomyNote:'Bird Society of Singapore uses Cinnyris ornatus after the Olive-backed Sunbird complex was split. The current NParks RDB3 table still lists the broader name Cinnyris jugularis.',
    statusNote:'No exact RDB3 row was verified for Cinnyris ornatus after the split. AniQuest does not copy the LC category of the broader Cinnyris jugularis entry.',
    facts:[{title:'A curved drinking straw',text:'Its down-curved bill reaches nectar inside narrow flowers.'},{title:'Two different outfits',text:'The male has a glossy dark throat, while the female is olive and yellow.'}],
  },
  {
    id:'eurasian-tree-sparrow', name:'Eurasian tree sparrow', scientific:'Passer montanus', family:'Passeridae', statusCode:'LC',
    aliases:['Tree sparrow'], habitats:['Urban','Parks','Grassland','Fields'],
    summary:'A familiar brown sparrow that gathers near buildings, lawns and open ground.',
    identification:'Chestnut crown, white cheeks with a black cheek spot, black throat patch and brown streaked wings. Both sexes look alike.',
    diet:'Seeds, grains and small invertebrates; chicks receive more animal food.', activity:'Feeds by day, often in active groups.',
    behaviour:'Forages mainly on the ground and gathers in flocks near people.',
    reproduction:'Uses sheltered cavities in trees and buildings, where it builds a grass-lined nest.',
    ecologicalRole:'Eats seeds and invertebrates and provides prey for urban predators.',
    pressures:'Sealed building cavities and loss of seed-rich open ground can reduce nesting and feeding spaces.',
    statusNote:'NParks RDB3 lists Passer montanus as LC and marks its Singapore origin “Native?”. Bird Society of Singapore treats it as a natural resident.',
    singapore:'A very common Singapore resident around open urban areas, parks, grassland and fields. NParks records uncertainty about its historical origin.',
    extraSources:[{name:'Cornell Lab · Birds of the World',url:'https://doi.org/10.2173/bow.eutspa.01',supports:'Diet, behaviour and breeding biology'}],
    facts:[{title:'Matching pair',text:'Adult males and females have similar plumage.'},{title:'Cheek check',text:'The black spot on each white cheek helps identify this sparrow.'}],
  },
  {
    id:'scaly-breasted-munia', name:'Scaly-breasted munia', scientific:'Lonchura punctulata', family:'Estrildidae', statusCode:'LC',
    aliases:['Spotted munia','Nutmeg mannikin','Spice finch'], habitats:['Grassland','Scrub','Urban','Fields'],
    summary:'A small seed-eater whose patterned breast looks covered with scales.',
    identification:'Adults have a brown head and upperparts, a thick grey bill and dark scale-like marks below. Juveniles are plain brown and lack strong scaling.',
    diet:'Grass seeds and other small seeds.', activity:'Feeds by day, often in small groups.',
    behaviour:'Forms social flocks and can forage with other munias on grass stems or the ground.',
    reproduction:'Builds a rounded grass nest with a side entrance in dense vegetation.',
    ecologicalRole:'Transfers energy from grass seeds into the food web and may move some seeds between feeding sites.',
    pressures:'Frequent mowing and clearing of dense grass can remove feeding and nesting cover.',
    taxonomyNote:'Singapore has the native subspecies fretensis and an introduced population of subspecies topela. Both belong to one species profile.',
    singapore:'NParks lists the species as native and LC. Bird Society of Singapore records both a native resident and an introduced resident population.',
    extraSources:[{name:'Cornell Lab · Birds of the World',url:'https://doi.org/10.2173/bow.nutman.01',supports:'Diet, behaviour and breeding biology'}],
    facts:[{title:'One species, two arrivals',text:'Singapore records include a native subspecies and an introduced subspecies.'},{title:'Juvenile disguise',text:'Young birds are plain brown before their scale-like breast pattern develops.'}],
  },
  {
    id:'pacific-swallow', name:'Pacific swallow', scientific:'Hirundo javanica', family:'Hirundinidae', statusCode:'LC',
    aliases:['Hirundo tahitica','House swallow'], habitats:['Open country','Coast','Wetlands','Forest edge','Urban'],
    summary:'A fast resident swallow that catches insects while flying.',
    identification:'Glossy dark-blue upperparts, rufous forehead and throat, grey underparts and a short, shallowly forked tail.',
    diet:'Flying insects caught in the air.', activity:'Feeds by day in fast, low flight over open areas.',
    behaviour:'Often feeds in small groups and rests on wires, railings and exposed perches.',
    reproduction:'Builds a neat cup from mud pellets under cliffs, bridges, towers and sheltered building ledges.',
    ecologicalRole:'Consumes flying insects over land, freshwater and coastal habitats.',
    pressures:'Removing active mud nests or sealing sheltered ledges during breeding can destroy nesting sites.',
    extraSources:[{name:'NParks · Jurong Lake Gardens',url:birds,supports:'Singapore residency, aerial diet and mud-cup nesting'}],
    taxonomyNote:'Bird Society of Singapore uses Hirundo javanica. The current NParks pages retain Hirundo tahitica for the Singapore Pacific Swallow.',
    facts:[{title:'Dinner on the wing',text:'It catches insects without landing.'},{title:'Tiny mason',text:'It presses mud pellets together to make a cup-shaped nest.',sourceUrl:birds}],
  },
  {
    id:'sunda-pied-fantail', name:'Sunda pied fantail', scientific:'Rhipidura javanica', family:'Rhipiduridae', statusCode:'LC',
    aliases:['Malaysian pied fantail','Pied fantail'], habitats:['Gardens','Forest','Scrub','Mangroves','Wetlands'],
    summary:'A lively black-and-white bird that fans its tail while searching for insects.',
    identification:'Blackish head, white eyebrow and throat, black breast band, pale belly and a broad fan-shaped tail with white outer tips.',
    diet:'Small flying and foliage-dwelling insects.', activity:'Feeds by day in low and middle vegetation.',
    behaviour:'Forages actively in pairs or mixed flocks and darts from perches to catch insects.',
    reproduction:'Builds a small woven cup from fine plant material, bound with spider web on a branch.',
    ecologicalRole:'Consumes insects in gardens, mangroves and forest understorey.',
    pressures:'Loss of dense waterside shrubs removes feeding cover and nest sites.',
    extraSources:[{name:'Bird Ecology Study Group · regional nest account',url:'https://besgroup.org/2024/07/25/aberrant-nesting-site-and-nest-structure-of-the-malaysian-pied-fantail/',supports:'Typical woven cup structure; regional observation does not set Singapore dates'}],
    facts:[{title:'Portable fan',text:'White-tipped outer feathers become conspicuous when the tail spreads.'},{title:'Dash and return',text:'It launches from a perch to catch insects and often returns to nearby cover.'}],
  },
  {
    id:'ashy-tailorbird', name:'Ashy tailorbird', scientific:'Orthotomus ruficeps', family:'Cisticolidae', statusCode:'LC',
    aliases:[], habitats:['Mangroves','Coastal forest','Wetlands','Gardens','Forest edge'],
    summary:'A small grey tailorbird with a rusty face, often heard inside dense vegetation.',
    identification:'Slate-grey upperparts, white belly and a chestnut forehead, crown and face. Females have duller colours.',
    diet:'Small insects and other invertebrates picked from vegetation.', activity:'Feeds by day, usually inside shrubs and low trees.',
    behaviour:'Moves quietly through cover and is often detected by its repeated call.',
    reproduction:'Joins leaves around a concealed nest using plant fibres or spider silk.',
    ecologicalRole:'Consumes small invertebrates in mangrove, wetland and garden vegetation.',
    pressures:'Mangrove loss and heavy pruning of dense shrubs remove cover and may disturb nests.',
    extraSources:[{name:'NParks · Jurong Lake Gardens',url:birds,supports:'Singapore identification, diet comparison and habitat change'}],
    facts:[{title:'Mangrove beginnings',text:'It was chiefly associated with mangroves before it spread into more urban wetlands.',sourceUrl:birds},{title:'Often heard first',text:'Dense leaves can hide this bird even when it calls nearby.'}],
  },
  {
    id:'olive-winged-bulbul', name:'Olive-winged bulbul', scientific:'Pycnonotus plumosus', family:'Pycnonotidae', statusCode:'LC',
    aliases:[], habitats:['Forest','Forest edge','Woodland','Mangroves'],
    summary:'A brown forest-edge bulbul with muted olive flight feathers and reddish eyes.',
    identification:'Brown upperparts, pale streaked ear coverts, dark red eyes, dark bill and yellow-olive edges to the wing feathers.',
    diet:'Fruit and small invertebrates.', activity:'Feeds by day in shrubs and trees.',
    behaviour:'Moves through wooded edges alone, in pairs or with other fruit-eating birds.',
    reproduction:'Builds a cup nest from plant material in a shrub or small tree.',
    ecologicalRole:'Disperses seeds from fruit and consumes small invertebrates.',
    pressures:'Loss of forest edges, fruiting shrubs and mangroves reduces feeding and nesting habitat.',
    extraSources:[{name:'Cornell Lab · Birds of the World',url:'https://doi.org/10.2173/bow.olwbul1.01',supports:'Diet, behaviour and breeding biology'}],
    facts:[{title:'Quiet olive wings',text:'Yellow-olive flight-feather edges give the folded wing a muted green tone.'},{title:'Red-eyed adult',text:'Adults have dark red eyes, while juveniles have browner eyes.'}],
  },
  {
    id:'oriental-magpie-robin', name:'Oriental magpie-robin', scientific:'Copsychus saularis', family:'Muscicapidae', statusCode:'VU',
    aliases:['Magpie-robin'], habitats:['Parks','Gardens','Forest edge','Mangroves','Woodland'],
    summary:'A confident black-and-white songbird that hunts on lawns and beneath trees.',
    identification:'Males are glossy black above with a white belly and bold white wing stripe. Females replace the black areas with slate grey.',
    diet:'Mainly insects and other small invertebrates gathered from the ground and vegetation.', activity:'Feeds and sings by day.',
    behaviour:'Hops with its tail raised and searches both trees and open ground.',
    reproduction:'Nests in sheltered holes and cavities, where the pair raises its young.',
    ecologicalRole:'Consumes ground and plant-dwelling invertebrates.',
    pressures:'Past cage-bird trapping reduced the local population. Nest disturbance and loss of wooded park habitat remain concerns.',
    extraSources:[
      {name:'NParks · Jurong Lake Gardens',url:birds,supports:'Singapore history, recovery context, identification and feeding'},
      {name:'Cornell Lab · Birds of the World',url:'https://doi.org/10.2173/bow.magrob.01',supports:'Diet, behaviour and breeding biology'},
    ],
    taxonomyNote:'Bird Society of Singapore records both resident and introduced Singapore populations. NParks RDB3 lists the species as native.',
    facts:[{title:'Tail held high',text:'It often raises its tail while hopping across the ground.'},{title:'A recovering voice',text:'NParks reports recovery after heavy historical trapping in Singapore.',sourceUrl:birds}],
  },
  {
    id:'common-flameback', name:'Common flameback', scientific:'Dinopium javanense', family:'Picidae', statusCode:'LC',
    aliases:['Common goldenback'], habitats:['Forest edge','Parks','Gardens','Mangroves','Woodland'],
    summary:'A golden-backed woodpecker that climbs trunks and drills into wood for food.',
    identification:'Golden-yellow back, black hindneck and scaled pale underparts. Males have a red crown; females have a black crown with pale streaks.',
    diet:'Wood-dwelling insects and some fruit.', activity:'Feeds by day on trunks, branches and fruiting trees.',
    behaviour:'Usually seen in pairs. Uses a strong bill to probe bark and excavate wood.',
    reproduction:'Excavates a nest hole, usually in a dead branch or snag several metres above ground.',
    ecologicalRole:'Controls wood-dwelling insects and creates cavities that may later shelter other animals.',
    pressures:'Removing dead branches and snags can reduce feeding material and nest sites.',
    extraSources:[{name:'NParks · Jurong Lake Gardens',url:birds,supports:'Diet, territorial behaviour, nest holes and Singapore habitat'}],
    facts:[{title:'Crown tells the sex',text:'Males have a red crown; females have a black crown.'},{title:'Sap feather care',text:'NParks reports that this woodpecker applies tree sap to its feathers to help remove parasites.',sourceUrl:birds}],
  },
  {
    id:'oriental-whip-snake', name:'Oriental whip snake', scientific:'Ahaetulla prasina', family:'Colubridae', group:'Reptile', statusCode:'LC',
    aliases:['Asian vine snake','Green whip snake'], habitats:['Forest','Gardens','Mangroves','Coast','Shrubland'], sourceUrl:herps,
    summary:'A slender tree snake whose green body blends into leaves and thin branches.',
    identification:'Long, narrow body, pointed snout, yellow eyes and horizontal pupils. Adults are often bright green; juveniles can be brown.',
    diet:'Mainly lizards, plus frogs and small birds.', activity:'Active by day in trees and shrubs.',
    behaviour:'Moves through foliage and relies on camouflage. When threatened, it may hold out its tongue as a warning.',
    reproduction:'Retains eggs inside the body until they hatch, then gives birth to live young.',
    ecologicalRole:'A small predator of lizards, frogs and birds in tree and shrub food webs.',
    pressures:'Clearing connected shrubs and mangroves removes hunting cover. Persecution caused by fear can kill harmlessly resting snakes.',
    facts:[{title:'Sideways pupils',text:'Its pupils are horizontal rather than round.'},{title:'Hidden hatchlings',text:'Its eggs hatch inside the mother before the young are born.'}],
  },
  {
    id:'green-paddy-frog', name:'Green paddy frog', scientific:'Hylarana erythraea', family:'Ranidae', group:'Amphibian', statusCode:'LC',
    aliases:['Common greenback','Green-backed frog'], habitats:['Ponds','Reservoirs','Wetlands','Ditches','Parks'], sourceUrl:herps,
    summary:'A green freshwater frog that rests beside ponds and calls after dark.',
    identification:'Bright green or brown upperparts, a white upper lip and a clear white stripe along each side of the body.',
    diet:'Mainly insects.', activity:'Mostly nocturnal; remains close to freshwater and waterside plants.',
    behaviour:'Waits beside water for prey and escapes by jumping into vegetation or water.',
    reproduction:'Lays eggs in freshwater. Its large tadpoles develop in still ponds and ditches.',
    ecologicalRole:'Consumes insects, feeds wetland predators and can help indicate freshwater habitat condition.',
    pressures:'Pollution, bank clearing and loss of still freshwater reduce breeding habitat.',
    facts:[{title:'White racing stripe',text:'A white line along the body helps separate it from other green frogs.'},{title:'Pond health helper',text:'NParks describes freshwater amphibians as useful biological indicators of ecosystem health.'}],
  },
  {
    id:'red-eared-slider', name:'Red-eared slider', scientific:'Trachemys scripta elegans', family:'Emydidae', group:'Reptile', origin:'Introduced', statusCode:'UNV',
    aliases:['Red-eared terrapin','Red-eared slider turtle'], habitats:['Ponds','Reservoirs','Urban wetlands','Parks'], sourceUrl:herps,
    summary:'An introduced freshwater turtle established after unwanted pets were released.',
    identification:'Olive-brown domed shell with yellow streaks and a broad red patch behind each eye. Adults commonly have shells around 15–20 cm long.',
    diet:'An adaptable omnivore; older animals often eat more plant material.', activity:'Feeds by day and often basks on rocks, logs and banks.',
    behaviour:'Moves between water and basking sites. It may slide quickly into water when approached.',
    reproduction:'Lays shelled eggs in nests dug on land; hatchlings move towards freshwater.',
    ecologicalRole:'An introduced omnivore that can compete with native freshwater wildlife for food and basking sites.',
    pressures:'Pet release spreads this species into new wetlands. Releasing or abandoning animals in parks is illegal.',
    singapore:'NParks describes it as an exotic species found in many Singapore ponds and reservoirs after pet releases.',
    statusNote:'No matching current NParks RDB3 row was verified. AniQuest records its introduced origin without inventing a national threat category.',
    facts:[{title:'The red clue',text:'A broad red stripe behind the eye gives this turtle its name.'},{title:'Never release pets',text:'NParks states that releasing or abandoning animals in parks and nature reserves is illegal.'}],
  },
];

export const ADDITIONAL_COMMON_SPECIES: SingaporeSpecies[] = entries.map(entry => {
  const { facts, extraSources = [], ...fields } = entry;
  const group = entry.group ?? 'Bird';
  const sourceUrl = entry.sourceUrl ?? `https://singaporebirds.com/species/${entry.id}/`;
  const statusSourceUrl = entry.statusCode === 'UNV' ? sourceUrl : group === 'Bird' ? birdList : group === 'Reptile' ? reptileList : frogList;
  const singaporeStatus = entry.statusCode === 'LC' ? 'Least Concern' : entry.statusCode === 'VU' ? 'Vulnerable' : 'Not assessed here';
  return {
    ...fields, group, origin:entry.origin ?? 'Native', aliases:entry.aliases ?? [],
    emoji:group === 'Bird' ? '🐦' : group === 'Reptile' ? '🦎' : '🐸',
    encounter:'Commonly seen', habitat:entry.habitats.join(', '), rarity:'Common in suitable habitat; sightings are not guaranteed',
    singapore:entry.singapore ?? `Recorded in Singapore in ${entry.habitats.join(', ').toLowerCase()}. Use public paths and do not disturb nests or shelter sites.`,
    watch:'Watch quietly from a distance. Do not feed, catch or handle wildlife. Leave the animal an open escape route.',
    pressures:`Habitat considerations: ${entry.pressures}`,
    statusCode:entry.statusCode, singaporeStatus, statusSourceUrl,
    statusNote:entry.statusNote ?? `Singapore RDB3: ${singaporeStatus}. National status is separate from global risk and encounter frequency.`,
    globalStatus:'Dated global assessment not verified in this edition', globalSourceUrl:'', reviewedAt:'2026-09-14',
    sourceUrl, sourceName:sourceUrl.includes('singaporebirds.com') ? 'Bird Society of Singapore' : 'NParks · Jurong Lake Gardens',
    fact:facts[0].text, funFacts:facts.map(fact => ({...fact,sourceUrl:fact.sourceUrl ?? sourceUrl})),
    sources:[
      {name:sourceUrl.includes('singaporebirds.com') ? 'Bird Society of Singapore · species account' : 'NParks · Jurong Lake Gardens',url:sourceUrl,supports:'Identification, Singapore occurrence, habitat and natural history'},
      ...extraSources,
      ...(statusSourceUrl === sourceUrl ? [] : [{name:'NParks · Singapore Red Data Book 3',url:statusSourceUrl,supports:'National conservation category and recorded origin'}]),
      {name:'NParks · responsible wildlife observation',url:guidance,supports:'Safe encounters and avoiding disturbance'},
    ],
  };
});
