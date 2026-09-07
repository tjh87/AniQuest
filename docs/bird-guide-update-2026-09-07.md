# Bird guide and journey navigation

## Scope

The user selected all recorded wild species plus a domestic-chicken guide.
The reference directory follows the current Bird Society of Singapore checklist.
It contains 47 birds of prey, red junglefowl and king quail.
The raptor total includes 10 owls.
Historical, disputed or removed reports are outside this checklist snapshot.
Captive breeds are not separate wild species.

All 49 directory entries now link to full AniQuest profiles and guided lessons.
The 45 new profiles use the Bird Society account text and credited reference photographs.
The full-profile total is now 94.
Each new profile has 11 linked claim-review records.
Local Red Data Book categories stay unassessed when this review did not match a taxon to an NParks row.

## Sources

- [Bird Society checklist](https://singaporebirds.com/checklist?view=basic): names, family membership and occurrence labels.
- [NParks birdwatching](https://www.nparks.gov.sg/visit/activities/birdwatching): quiet observation, binoculars, no playback, nest protection.
- [NParks reserve rules](https://www.nparks.gov.sg/visit/when-visiting-parks/etiquette/nature-parks-reserve-dos-donts): marked trails, distance, no feeding, no collection or release.
- [NParks Garden Bird Watch](https://www.nparks.gov.sg/nature/community-in-nature/garden-bird-watch): volunteer survey, training and registration.
- [NParks bird guide](https://www.nparks.gov.sg/-/media/nparks-real-content/about-us/publications/garden_bird_watch_lowres.pdf): local bird reference and mixed chicken flocks.
- [NParks red junglefowl](https://www.nparks.gov.sg/florafaunaweb/fauna/2/6/265): identification clues and domestic interbreeding.
- [Visual raptor guide](https://singaporebirds.com/raptor-guide/): flight identification reference.

`scripts/fetch-bird-directory.mjs` reads six public family endpoints.
It saves the account snapshot needed for a source-linked profile build.
It does not save nest locations.
The review records cite the source. They do not infer a missing local assessment.

## Interface

All three journey steps accept mouse and keyboard input.
Selecting a step does not award completion or save an answer.
The review shows saved-check counts until both sets contain three answers.
Free navigation means a later baseline may follow lesson reading. The page states this limit.
The observation exercise is original practice guidance, not the official survey method.

## Validation

- Local TypeScript check and production build passed.
- 22 directory, editorial, learning and profile tests passed.
- Five local server tests passed. One test was skipped because Windows denied symbolic-link creation.
- Editorial snapshots match 784 content records.
- All 94 animal profiles have six guided checks.
- Otter and colugo lessons allowed selection of all three sections.
- Unanswered checks showed incomplete counts. No test answers or actions were submitted.
- Keyboard focus on journey buttons had a visible three-pixel outline.
- Classic and Pixelated modes passed mobile light and dark checks.
- Vagrant filtering returned 11 entries. Junglefowl search returned one entry.
- The main animal search opened the directory and found Brahminy kite.
- Browser error logs were empty.
- The build retained its existing large-bundle warning. It did not block local launch.
