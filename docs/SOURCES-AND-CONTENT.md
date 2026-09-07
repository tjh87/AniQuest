# AniQuest: sources and content rules

Revision: 6 September 2026. This is the source foundation for the current plan and future prompts. A source directory is not a claim that all pages were rechecked in this pass.

## Source hierarchy

| Use | Preferred source | Rule |
| --- | --- | --- |
| Singapore occurrence, biology and common names | [NParks BiodiversitySG](https://biodiversitysg.nparks.gov.sg/) and [Flora & Fauna Web](https://www.nparks.gov.sg/florafaunaweb) | Cite the exact species page for the claim |
| Singapore conservation status | NParks RDB3 [mammals](https://www.nparks.gov.sg/nature/species-list/terrestrial-mammals), [birds](https://www.nparks.gov.sg/nature/species-list/birds), [reptiles](https://www.nparks.gov.sg/nature/species-list/reptiles) and [amphibians](https://www.nparks.gov.sg/nature/species-list/amphibians) | Keep national scope and assessment edition |
| Wildlife encounters and coexistence | [NParks Animal & Veterinary Service](https://avs.nparks.gov.sg/wildlife/encountering-wildlife/) | Use current direct guidance; do not invent handling advice |
| Singapore research | NUS primary research pages and original papers | Record the actual species, sample, date and limit of the result |
| Global status | Exact dated IUCN assessment or documented primary assessor reference, including BirdLife | Retain the citation and access limit; separate publication year, assessment date and review date |
| Amphibian taxonomy | [Amphibian Species of the World · AMNH](https://amphibiansoftheworld.amnh.org/Amphibia/Anura/Megophryidae/Megophryinae/Pelobatrachus/Pelobatrachus-nasutus) | Match accepted name and synonym history before assigning a source claim |
| Seasonal weather context | [Meteorological Service Singapore](https://www.weather.gov.sg/climate-climate-of-singapore/) | Climate periods are not a live forecast or guaranteed wildlife sightings |
| Animal-related events | [NParks events](https://www.nparks.gov.sg/visit/events), [AVS World Animal Day](https://avs.nparks.gov.sg/outreach/events/world-animal-day/), [Nature Society](https://nss.org.sg/events/), [SPCA](https://spca.org.sg/events/), [ACRES](https://acres.org.sg/contact/) | Use a dated organiser page to confirm a session; directories alone are insufficient |

NParks lists additional categories such as VU, DD and NA. The current model includes LC, NT, VU, EN, CR, NA and an explicit editorial unknown. Add other official categories such as DD when a sourced record requires them. Never pass the internal UNV code off as an official Red Data Book category. For example, introduced animals must not receive an invented native-status label. The [NParks mammal table](https://www.nparks.gov.sg/nature/species-list/terrestrial-mammals) separates origin and RDB3 category.

## Profile evidence and current limits

All 49 profiles have identification, diet, activity, behaviour, reproduction, Singapore occurrence, ecology, threats, safe viewing and two source-linked fun facts. Additional natural-history sources include the University of Michigan Animal Diversity Web, NOAA Fisheries and the Bird Society of Singapore, referenced at the point of use. Original paraphrases are used. See `ANIMAL-CATALOGUE.md`.

Origin, visibility and conservation are distinct: there are 42 native and 3 introduced records. Javan myna and house crow are nationally NA. Banded bullfrog is introduced, but no matching RDB3 row was confirmed: its national label is “Not assessed here”, not an invented NA or LC. There are 24 dated global references and 21 explicitly unverified global fields. This pass recovered nine dated references for existing animals and three for new birds; the original twelve references remain dated snapshots. Some citations identify a publication year without an exact assessment day. The package date does not refresh those assessments, and an announcement/publication date must not be substituted for the assessment date.

Taxonomy checks: use Sumatran palm civet / Paradoxurus musangus for the current NParks record; retain common palm civet as a search alias and explain the older broad taxon. Preserve NParks names and relevant aliases for Asian koel and white-bellied sea eagle. Red junglefowl is nationally NT in RDB3; distinguish wild birds from domestic hybrids. Green turtle national CR and dated global LC are different scopes. Do not import a conflicting old global label from a general species page.

National counts are LC 15, NT 4, VU 2, EN 8, CR 13, NA 2 and UNV 1. The threatened filter includes VU, EN and CR only: 23 catalogue records. Keep global categories separate.

The fifteen new profiles have research records in `docs/research/`. Older species pages can carry superseded national labels: current RDB3 makes buffy fish owl VU, blue-eared kingfisher EN, changeable hawk-eagle VU, spiny hill turtle EN, Malayan horned frog CR and black-eyed litter frog NT. Use accepted *Pelobatrachus nasutus* with *Megophrys nasuta* as an alias and explain the misspelling on the NParks table. Do not transfer an assessment of the broader *Varanus bengalensis* taxon to the clouded monitor *Varanus nebulosus*.

Source-card publisher labels must identify the actual source: NParks BiodiversitySG, Flora & Fauna Web, Singapore Red List or Jurong Lake Gardens are distinct resources. A shared NParks hostname does not make every page Flora & Fauna Web.

Only three species have embedded real photos. Other profiles link to source reference pictures. Do not substitute branding animals or generated anatomy for the missing photographs. No insect or fish profile is included; prey descriptions may mention insects or fish.

## News foundation

The current directory contains these 11 sources. None is automatically fetched by the portable app.

| Scope | Source | Directory URL | Government source? |
| --- | --- | --- | --- |
| Singapore | NParks | https://www.nparks.gov.sg/news | Yes |
| Singapore | CNA | https://www.channelnewsasia.com/topic/wildlife | No |
| Singapore | The Straits Times | https://www.straitstimes.com/singapore/environment | No |
| Singapore | Mothership | https://mothership.sg/category/environment/ | No |
| Singapore | MustShareNews | https://mustsharenews.com/category/singapore/environment/ | No |
| World | Associated Press | https://apnews.com/hub/animals | No |
| World | The Guardian | https://www.theguardian.com/environment/wildlife | No |
| World | Science News | https://www.sciencenews.org/topic/animals | No |
| World | Mongabay | https://news.mongabay.com/list/animals/ | No |
| World | Reuters | https://www.reuters.com/sustainability/climate-energy/ | No |
| World | NOAA Fisheries | https://www.fisheries.noaa.gov/feature-stories | Yes |

Keep Mothership and MustShareNews for Singapore reporting. Confirm scientific claims with a primary source where needed. A paywall, 403 or 429 is a review state, not proof of a false report. Do not bypass access restrictions.

Write short original summaries. Keep the publisher and direct article link next to each story. Store publication date and the event date separately. A plan to expand a sanctuary is not proof that expansion finished; the app's ACRES wording preserves that distinction. Recheck before changing it.

Use actual RSS/Atom endpoints only after verifying the publisher provides them and the intended use is permitted. Category pages above are not RSS addresses. Imported items remain drafts. Do not copy full articles or publisher photos without reuse rights.

## Question and answer foundation

The exact current bank is `app/quiz-data.ts`: 18 original learning questions with answers, hints, explanations and links. Supporting sources include NParks/AVS, NUS and BirdLife. Review the exact cited page when expanding or materially changing an item.

| Tier | Current count | Next target | Test |
| --- | ---: | ---: | --- |
| Beginner | 6 | 20 | Visible traits, names and basic habitats |
| Intermediate | 6 | 20 | Relationships, classification and adaptations |
| Advanced | 6 | 20 | Evidence, assessment scope, uncertainty and trade-offs |

Questions from external sites can inform topics and facts. Write new wording and alternatives. Do not copy protected assessment banks. For each published item, keep one supported answer and an explanation of its evidence. Do not use web popularity as proof of accuracy.

Example reasoning patterns for new items, pending source review:

- Compare a national and global assessment without assuming one is wrong.
- Explain why five camera-trap detections do not establish a population total.
- Identify what an event announcement confirms and what it leaves unknown.
- Distinguish a reported maximum behaviour from a typical behaviour.

Retain item version/history when correcting content. Offline self-study includes answer keys in the downloadable program. In a later authenticated mode, expose only public questions and validate answers on the server.

## Picture and logo policy

- `public/aniquest-logo.png` is the supplied original artwork. Its file is unchanged. A code-native display mask removes the outside white surround/frame; it retains the interior scene and wordmark. The display stays at 148px without a surrounding border or background tile. It is not biological evidence, and its animals do not increase the catalogue count.
- Keep the three real wildlife WebP files and visible attribution in `app/wildlife-photos.tsx`.
- Retain photographer, source page and licence links. Where a share-alike condition applies, keep the required licence with the delivered image.
- Do not use the old generated `aniquest-wildlife.png` montage in a factual profile or as the new logo.
- Do not invent an accurate-looking image for a species that has no verified photo. Use a text-only record.
- Retro styling must not pixelate, recolour or redraw the photos or logo. The same logo display mask is used in all four themes.

## Review dates and link checks

Use these separate fields:

| Field | Meaning |
| --- | --- |
| Package revision | When AniQuest files changed |
| Source publication date | When the publisher released the material |
| Event date | When an event occurred or is scheduled |
| Assessment date | When the species assessment was performed, if known |
| Assessment publication year | When that assessment was released; may differ from assessment date |
| Claim reviewed date | When a person checked that the source supports the exact claim |
| Link checked date | When an automated request tested reachability |

Proposed review schedule: monthly general source review; more frequent review of upcoming events and active news; immediate review after a reported correction. A dated snapshot is acceptable when labelled. Never silently replace an unknown value with a reassuring status.

A future Windows task can check links while the PC is available. It cannot run when the PC is off, and it is separate from any ChatGPT reminder. The current ZIP creates no background scheduled task.

## Technical design references

- [W3C contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) and [reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html): check legibility and containment in all themes.
- [OWASP authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html), [password storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) and [SSRF](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html): implement the later account and checker features with server authority.
- [Google AI Studio Build](https://ai.google.dev/gemini-api/docs/aistudio-build-mode): use the current authoring/export workflow; do not treat automatic Google sign-in as a completed login-ID/password flow.
- [Microsoft Task Scheduler](https://learn.microsoft.com/en-us/windows/win32/taskschd/task-scheduler-start-page): optional later local scheduling.

These links support the planning foundation. This revision does not certify every underlying animal, news or event record as freshly verified.
