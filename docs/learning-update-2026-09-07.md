# Learning update · 7 September 2026

## Changes

- Wrong answers show the correct choice and a source-linked explanation.
- The otter journey has three stages: encounter, learn, and review/action.
- Six guided questions compare the same three objectives before and after learning.
- Four existing practice questions now test reasoning and avoid repetition. Their question versions increased.
- The practice bank remains 27 questions. The combined bank contains 33 questions.
- The banner still contains 17 random facts. This update adds no banner facts.
- All 49 profiles remain available. Their photographs remain unchanged.
- Related profiles rank genus, family, profile group, then habitat. Habitat sharing does not imply close ancestry.
- The site map heading opens or closes the page directory. Disabled news is absent from that directory.
- Hint boxes use amber in most themes. Sunset amber uses blue hint boxes for clear separation.
- The confidence slider remains removed.

## Learning records

Each answer stores its choice, result, hint use, time, question version, species, habitat and objective.
The latest 500 records remain available. Earlier records drop from this window.
First-answer accuracy uses the first current-version practice answer within that window, not lifetime performance.
Old saves retain XP and completions. The app does not invent answer history for them.

The next practice question uses errors and hint use. One answer separates a question from its review.
Two errors on the current objective suggest source review. Users can still select their quiz tier.

The otter result compares three paired questions. Feedback itself supports learning.
This result does not prove long-term knowledge or a conservation outcome.
Guided checks give no XP. Only first correct practice completions give quiz XP.

Opening guidance records a guidance visit. It does not send a sighting report.
Observation actions are self-reported. The app does not verify them.

## Sources checked for this update

- [AVS otter guidance](https://avs.nparks.gov.sg/wildlife/encountering-wildlife/otters/): recognition, food, status context and safe observation.
- [NParks otter profile](https://biodiversitysg.nparks.gov.sg/our-biodiversity/mammals/other-mammals/smooth-coated-otter/): linked profile reference.
- [NParks nature reserves](https://www.nparks.gov.sg/visit/when-visiting-parks/about-parks-nature-reserves-pcns): Eco-Link and forest connections.
- [NParks coastal and marine ecosystems](https://www.nparks.gov.sg/nature/ecosystems/coastal-marine): reef zones, depth and light.

The source registry now includes the guided questions. Existing source-health checks can check those links.

## Checks

The final AniQuest test run passed 40 tests, skipped one, and reported no failures.

- Local TypeScript check and production build passed.
- Browser checks covered wrong-answer disclosure, correct answers, hint recording and spaced review.
- The complete otter journey produced 1/3 before and 3/3 after in a test session.
- The result survived a page reload. Guided answers did not increase practice XP.
- Light/dark checks covered answer contrast, narrow-screen wrapping and keyboard focus.
- Pixelated checks covered Forest green and Sunset amber. Automated checks cover all base theme palettes.
- API tests use the real progress route and an in-memory SQLite adapter for the D1 interface.
- API checks cover authentication, wrong answers, choice validation, stale versions, duplicate requests, XP, action records and the 500-record limit.
- A second test identity receives no first-user records.
- The local server tests cover folder spaces, binary assets, missing routes, path protection and launch without dependencies.
- Windows skipped the symlink test because this account cannot create symbolic links.

## Local and server limits

Local mode saves records in this browser. Clearing browser storage removes them.
Local data is not a secure account record. A storage error appears instead of a false save confirmation.
Guest use of the server app keeps session-only records until sign-in; those guest records do not merge automatically.

Server scoring derives results from the server question bank. It rejects outdated question versions.
Apply the generated `0005_learning_records` migration before using the changed server route.
The migration adds one column with a constant empty-array default. It preserves existing progress rows.
The migration and API passed SQLite tests. No remote migration or deployment was performed.

The full server TypeScript command still needs the Cloudflare runtime types in its configured environment.
The available Windows check reported missing `cloudflare:workers`, `Fetcher`, and `D1Database` declarations.
The local build remains independent of those server declarations.
The local bundler reports one large JavaScript chunk. This warning does not block launch.

## Start and recovery

Run `Start-AniQuest.cmd`, or run `npm.cmd start` from this folder.
Open `http://127.0.0.1:5173` in the same browser to retain local progress.

The earlier checkpoint remains at `.checkpoints/aniquest-checkpoint-2026-09-07-1326.zip`.
This update does not replace that checkpoint. No files were committed or published.
