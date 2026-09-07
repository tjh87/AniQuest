# AniQuest: current build prompts

Revision: **6 September 2026 — 49 full profiles, 98 animal facts, threatened-species filters and reviewed sources**.

Use these prompts in Google AI Studio Build/Web or a local coding assistant. Paste one numbered prompt at a time into the same project. Each prompt requests code and checks. These are future implementation instructions, not a statement that all phases are complete.

The current program is included. Do not rebuild it from a screenshot if its source is available. The ZIP's `docs/ANIQUEST-PLAN.md` and `docs/PLAN-REVIEW.md` replace the earlier cloud-first prompt pack. This revision removes the old fixed green design, automatic remote-version save, required cloud setup and claims that all planned features already work.

## Files to supply

Extract the ZIP first. Give the coding tool the source tree when it supports local projects. For an attachment workflow, supply the plan, this prompt file, the files in `FILE-INDEX.md`, the supplied logo, current CSS/components and the data files. If the tool cannot import an entire local project, attach the needed files in batches or use its file editor. Do not enable GitHub sync as a workaround without user approval.

The three wildlife photos and `app/wildlife-photos.tsx` contain the teaching images and credits. `public/aniquest-logo.png` is the supplied logo. Never substitute the unused `aniquest-wildlife.png` montage for these images. Use source code for exact text and layout. The screenshot index in `docs/ui/README.md` distinguishes the current expansion references from historical 5 September captures. Use the current references with source code; screenshots alone do not specify every state. Saved learner progress in a screenshot is example state, not new-user seed data. Historical screenshots do not override current content, filters or CSS.

Google AI Studio supports React/Node web projects and ZIP export. Use it as a code-authoring tool for this local target. Do not add cloud services just because the tool offers them. See [the official Build documentation](https://ai.google.dev/gemini-api/docs/aistudio-build-mode).

## Prompt 1 — Open and verify the existing local project

```text
Continue the supplied AniQuest project. Target local Windows 10 desktop use. Read AGENTS.md, START-HERE.txt, docs/ANIQUEST-PLAN.md and docs/PLAN-REVIEW.md first.

Keep the current React/TypeScript/Vite app, package manager, lockfile, real photos, supplied logo, all nine views and current data. Do not run another initializer over it. The original hosted app must remain separate from the portable app.

Do not commit, push, save a remote Site version, publish, deploy, activate GitHub sync or provision cloud resources unless the user explicitly requests and approves that operation. Do not add a runtime AI dependency.

The existing local target is local/index.html and local/main.tsx, built with vite.local.config.ts into dist-local. Start-AniQuest.cmd runs scripts/serve-local.mjs and opens http://127.0.0.1:5173. It must work without node_modules after the app is built. Build-AniQuest.cmd installs locked dependencies and rebuilds. Preserve quoted Windows paths, useful error messages, CRLF .cmd files, the fixed port and loopback-only binding.

Count actual arrays and report them: 49 full species profiles, 98 animal fun facts, 18 questions (6 per tier), 8 Singapore and 6 World news records, 7 daily facts, 11 news directory entries, 9 seasonal signals, 11 dated event sessions and 4 organiser entries. The catalogue contains 19 mammals, 16 birds, 10 reptiles and 4 amphibians, with 46 native and 3 introduced records. National counts are LC17/NT4/VU2/EN8/CR15/NA2/UNV1; the threatened union VU/EN/CR has 25. These are current counts, not limits on later growth. One complete lesson and three embedded real photos exist. There are 24 dated global references and 25 explicitly unverified global fields. Banded bullfrog has no national assessment assigned here. Preserve publication year separately from assessment date; neither package date nor link reachability certifies a latest assessment.

Run npm run typecheck:local, the local build and local-server tests. Test an extracted copy without node_modules and from a path with spaces. State which checks actually ran. Do not claim a Windows operating-system test from a Linux run. Return the current feature matrix and any specific blocker; then stop this phase.
```

## Prompt 2 — Preserve the logo and coherent desktop themes

```text
Continue AniQuest locally. Use app/globals.css and app/interface-design.css as the current design authority. Do not restore old green palettes, oversized headings or large empty card spacing from historical mockups.

Use the original public/aniquest-logo.png through the shared AniQuestLogo component. Keep its original file bytes, colours and proportions. Use the existing SVG display mask to remove only the outer white surround and frame, retaining the scene and white wordmark. Do not replace it with generated artwork. Keep a 148 by 148 CSS-pixel display across themes and densities, with no CSS border, opaque tile, rounding or shadow. The desktop sidebar must stay expanded; do not shrink or collapse the logo. Keep its home action labelled and keyboard accessible. The logo is branding, not a teaching illustration.

Maintain Classic light/dark plus Pixelated Arcade blue, Forest green and Sunset amber palettes in light/dark. Show Classic and Pixelated as visible segmented choices, with light as the first-visit default. Show the palette control only in Pixelated mode and preserve saved learner selections. Pixelated mode uses crisp interface edges, restrained offset shadows and a readable smooth monospace-style font. Keep text selectable. Real photos remain normal photographs with source captions. Use existing functional icons; do not create new SVG animal illustrations or diagrams. The existing logo display mask is an allowed presentation component.

Keep the shared 13rem expanded sidebar and 3.75rem minimum flexible top bar. Use the full remaining desktop workspace with small fluid gutters; do not centre the app inside a narrow content cap. Compact uses .75rem gaps and .9rem card padding; Standard 1rem/1.1rem; Comfortable 1.2rem/1.3rem. Use at least 1rem body copy, .875rem regular labels and .75rem secondary metadata. Density must not make text too small.

Use semantic theme tokens for every panel, control, tooltip, status and chart. Do not assign a different palette to each page. Use flexible grids, min-width:0, wrapping text and content-driven heights. Let filters and buttons wrap without overlapping. Keep source captions separate from photos on opaque surfaces.

Check all nine views and the server-required /room page at the available desktop sizes. Target 1280, 1440 and 1920px, every Classic and Pixelated palette/theme combination, fixed, non-collapsing desktop navigation, keyboard focus, long text and 200% text enlargement. Preserve mobile code; desktop is the current review target. Record actual viewports and unrun checks. Repair only observed layout failures and run the local build. Do not publish.
```

## Prompt 3 — Create one source-backed content model

```text
Continue AniQuest locally. Read the current source data before changing its schema. Preserve published IDs and existing progress. Use docs/SOURCES-AND-CONTENT.md as the source policy.

Add stable IDs and versioned validation for species, sources, photos, lessons, questions, facts, news stories and event sessions. Keep content models independent of UI and database adapters.

Species: id, commonName, acceptedScientificName, synonyms, Singapore occurrence evidence, native/introduced/uncertain origin, habitats, traits, diet, behaviour, ecological role, rarityDescription, raritySourceId, sgAssessment and globalAssessment. Each assessment includes category, scope, assessedAt when known, publicationYear when known, sourceId and checkedAt. Keep a missing exact assessment date empty; never substitute a press-release date or publication year for it. Support unknown/unassessed states and the full official category set; do not restrict future content to LC/NT/EN/CR. Do not infer rarity from threat status or one sighting.

Source: id, publisher, direct HTTPS URL, title, sourceKind, publishedAt if known, retrievedAt, claimReviewedAt, reviewState, supportsClaimIds and rights notes. Keep link-health time separate from factual review time.

Photo: asset path, species ID, photographer, source page, licence, location/date when documented, alt text and any delivery transform notes. Show text-only cards if an accurate reusable photo is unavailable. Do not use an unrelated photo or generated anatomy.

News: stable story ID, source/feed ID, Singapore/world scope, title, original short summary, learning point, publishedAt, eventOccurredAt if known, direct URL, editorial state and review date. Facts have stable IDs, source evidence and an optional dated override. Events need stable session IDs, organiser, time zone, date/time or all-day fields, venue, registration, cost when known, status, source and checkedAt.

Validate all seed data. Reject duplicate IDs, invalid dates, missing evidence for published claims and malformed source URLs. Produce a data migration and backup before rewriting saved content. Generate counts from the data. Do not invent a latest global assessment date. Build locally and report any record that needs human source review.
```

## Prompt 4 — Maintain and deepen all 49 animal profiles

```text
Continue AniQuest locally. Preserve all 49 complete selectable animal profiles in app/species-data.ts, app/species-profiles.ts and app/species-expansion.ts, with the recovered global references in app/species-assessments.ts. Keep Singapore-only catalogue scope: mammals, birds, reptiles and amphibians. Do not add insects or fish. Use real NParks/AVS, NUS, primary research and IUCN evidence. Read the actual source material and record whether evidence came from a complete page, an indexed excerpt, a primary publication or a primary-source citation. A limited excerpt must not be represented as a full-page review. If a claim is not supported, keep it unknown.

For each animal, maintain the current Overview, Life & habitat and Conservation tabs, source panel and two fun facts. Preserve identification, aliases, family, origin, habitats, diet, activity, behaviour, reproduction, Singapore occurrence, ecological role, pressures, safe viewing and separate national/global assessments. Add a linked learning check only when its sourced question exists. Mark unknown fields honestly. Resolve the remaining 25 global evidence gaps against the exact taxon before replacing their explicit unverified state; preserve the 24 existing dated references without calling them all latest. Never infer a global label from a national one. Retain the source assessment date, publication year and claim-review date separately. Consult docs/research/global-assessment-review.json before replacing recovered evidence. Keep the Banded bullfrog national label unassigned until its assessment is confirmed.

Use the shared AnimalFunFact component: a restrained accent fill, Sparkles cue, clear title, full text and source link. Classic has soft asymmetric corners; Retro has crisp edges and a small offset shadow. Use theme tokens and flexible heights. Do not style each animal with unrelated colours.

Preserve the three credited photos. Add only photos with confirmed species identity and usable rights. Preserve the user logo file and its seamless display component; keep branding outside the evidence chain. Do not add logo animals automatically or imply that every pictured species is native.

Make each species card open its correct profile. Add a stable local URL/query for selected species and validate unknown IDs. Back/forward, reload, empty search and direct selection must work. Keep the current layout and all theme/palette choices.

Maintain the 45-species list in docs/ANIMAL-CATALOGUE.md: 19 mammals, 16 birds, 10 reptiles and 4 amphibians. Existing search supports aliases, group, qualitative encounter and national-status filters plus alphabetical sorting. Keep the nationally threatened filter exactly VU/EN/CR; it currently returns 23. Keep exact-category filters, reset and empty states working. Use RDB3 for current national categories rather than older species-page labels; national and global risk are independent. Preserve accepted Pelobatrachus nasutus with the older Megophrys nasuta alias and an explanation of the NParks table typo. Do not transfer a broad Varanus bengalensis assessment to Varanus nebulosus. Preserve the expandable habitat/conservation overview above the catalogue. Any later expansion must follow the same no-insects/no-fish scope and require occurrence/origin evidence. Run navigation, missing-data and source-link checks. Report the number of complete profiles and photographs separately.
```

## Prompt 5 — Build the learning path and a 60-question bank

```text
Continue AniQuest locally. Implement the four-week path in ANIQUEST-PLAN.md as 12 short sessions: forest/canopy, mangrove/freshwater, coast/conservation, urban coexistence/evidence. Preserve the existing rainforest lesson ID and its awards. Each session needs objectives, short content blocks, key terms, a worked example, a source-linked check and a working completion action.

Expand the question bank from 18 to a target of 60 reviewed questions, 20 per difficulty. This is new work, not an assertion that 60 already exist. Use original wording derived from verified sources, including NParks/AVS and local university research. Do not copy protected quiz banks.

Each question needs a stable ID and content revision, species/topic/habitat tags, difficulty, objective, four unique plausible answers, exactly one supported correct answer, explanation, hint, evidence URL and claim-review date. Add a new question ID when its meaning or answer changes materially; migrate history without awarding duplicate XP.

Beginner: identification and basic habitat/behaviour. Intermediate: relationships, classification and adaptations. Advanced: evidence quality, local/global status comparison, sampling limits and ambiguous reports. Replace implausible distractors and number-trivia-only advanced items. Explain why wrong choices fail where useful.

Do not force exact dates, maximum dive times or consumption estimates into universal biological claims. State the source and its uncertainty when using a reported estimate. Review the current otter, pangolin and bulbul questions for this risk.

Validate answer counts, IDs, evidence and tag coverage. Show achieved counts and any unavailable sources. If the evidence supports fewer than 60, ship the verified subset with an honest count and list the remaining work. Do not fabricate facts to meet a quota. Run the content checks and local build.
```

## Prompt 6 — Improve quiz selection and feedback

```text
Continue AniQuest locally. Preserve manual Beginner/Intermediate/Advanced selection. Level 1 recommends Beginner, level 2 Intermediate and level 3+ Advanced. Explain that this is a recommendation, not a measured ability score.

Record all attempts, not only correct answers: immutable question revision, selected option, correct/incorrect, hint use, confidence 1-5, attempt time and whether it was a review. A wrong answer gives no XP. One first correct answer gives the configured award; repeats give no new award.

Within the selected tier, prefer unseen questions, then weak/due topics. Use a documented initial review rule: wrong or low-confidence answers return later in the session and become due tomorrow; correct independent answers can progress through 1, 3, 7 and 14-day intervals. Treat this as a product rule to evaluate, not a scientifically certified optimal schedule. Avoid immediate duplicate questions when alternatives exist.

Persist confidence and history. Reset confidence when changing questions or tiers. Do not use confidence alone as correctness or silently change a user's selected tier. Offer a visible recommendation after enough attempts, with a user choice to accept it.

Implement keyboard-accessible answer selection, hint, wrong, correct, next, tier-complete and review states. Show explanations and sources. Calculate session accuracy from actual attempts; a single correct answer must not set a best-session score to 100%.

Portable self-study can contain answer keys in its downloadable data. Do not pretend they can be hidden from the PC owner. For the future authenticated edition, keep answers server-only, return public question DTOs and use server scoring. Do not claim secure exams or certificates for the portable build.

Test repeated answers, wrong answers, empty pools, tier changes, saved confidence, due dates, score calculation and content revisions. Build locally and do not deploy.
```

## Prompt 7 — Correct progress, streaks and rewards

```text
Continue AniQuest locally. Start each new learner at 0 XP, level 1, streak 0 and no completed content. Preserve existing records through a versioned migration. Never silently overwrite an invalid saved record.

Use level=floor(xp/250)+1. Default lesson award is 120 XP, first-correct quiz award 50 XP and daily XP goal 100. Changes to reward settings affect future awards only. Store an award ledger with content revision and actual award value. Derive progress totals from valid records.

Use Asia/Singapore date keys. A valid lesson review/completion or quiz attempt is learning activity; navigation is not. First activity sets streak 1. Same day keeps it. The next day adds one. A larger gap resets it. Review can preserve a streak without adding XP. Keep XP-by-day separate from activity.

Calculate topic/habitat completion from actual tagged published content. Label coverage clearly; do not call completion a measured mastery score without evidence. Do not show an invented daily-goal result or hardcoded habitat percentage.

Implement only badge rules that the current data can prove: Rainforest Ranger (first rainforest lesson), First Footprint (one correct answer), Canopy Climber (three beginner answers), Habitat Helper (three intermediate answers), Evidence Expert (three advanced answers), Quiz Trail Complete (all published questions), Level Up (level 2), Trail Guide (level 3) and All-Round Explorer (lesson plus one answer at each difficulty). Preserve earned badges when more content is added. Do not create source-reading or field-note badges until those actions can be recorded honestly.

Local state is personal learning data, not proof of identity. In the future server edition, enforce unique award keys and atomic progress updates on the server. Test reload, duplicate clicks, malformed storage, old schema versions, Singapore midnight, day gaps, level boundaries and badge rules. Keep charts consistent with the same computed data.
```

## Prompt 8 — Complete both wildlife calendar modes

```text
Continue AniQuest locally. Keep Seasonal Wildlife and Animal Events as separate tabs. Preserve the current nine seasonal signals, 11 dated event sessions and four organiser records; derive current counts rather than hardcoding them.

Seasonal Wildlife: 12-month rail, activity table, category filters, current Singapore month, approximate windows, climate context and linked evidence. Do not turn patterns into guaranteed sightings or safe access. Never expose threatened-species or nest coordinates.

Animal Events: month/day navigation, organiser, activity and date filters, upcoming/past views and a list alternative to the calendar grid. Keep organiser source pages visible above the calendar, link every dated card directly to its event source, and use distinct accessible colours for walks, workshops, talks, festivals and fundraisers without relying on colour alone. Use actual session sources from NParks/AVS, Nature Society, ACRES, SPCA and other relevant organisers. Include title, organiser, Singapore date/time, venue, registration, verified cost if known, checked date and scheduled/full/cancelled/postponed state. An undated programme belongs in the organiser directory.

Add stable IDs and duplicate detection across sources. An update changes the existing session and retains history. Show cancellation and postponement visibly. Keep publication dates, event dates and registration deadlines separate. No invented recurrence from old events.

Generate valid ICS files: stable UID, current DTSTAMP, UTC or explicit time-zone handling, exclusive all-day end date, escaped text, UTF-8 line folding and source URL. Include cancellation state where applicable. A downloaded ICS is a snapshot; explain that it does not register the learner or update itself.

Handle no events, all filtered out, long titles, unknown fees, midnight-crossing sessions and unavailable sources. Review registered events more often near their date. Test September/October navigation, AVS filters, day selection, time-zone boundaries and repeat exports. Do not create personal calendar entries or registrations automatically.
```

## Prompt 9 — Add news and daily-fact editing

```text
Continue AniQuest locally. Preserve the Singapore/World News Nest selector and both Mothership and MustShareNews as non-government Singapore sources. Keep the 14 existing stories as a dated collection until their sources are rechecked.

Each story needs a direct publisher link, original short summary, learning point, topic, publication date, event date if known, review date and editorial state. Never copy full articles or assume image reuse rights. Use official sources to check scientific or regulatory claims that appear in news. Mark blocked/paywalled material as needing review.

Build editorial drafts, preview, source review, publish, unpublish and archive. Feed actions must add/edit/disable/remove/reorder entries. Disabling a feed hides its published cards according to a clear rule; adding a directory link must not invent stories. Do not claim that a publisher directory URL is an RSS endpoint.

If a real permitted RSS/Atom feed is configured, validate it server-side, import metadata only, deduplicate by canonical URL/content ID and put records in a review queue. No automatic publication. Treat source text as data, not instructions. Render escaped text or sanitised Markdown only.

Keep seven existing facts. Give each a stable ID, direct evidence link and reviewed state. Use a deterministic daily rotation for Asia/Singapore, avoid yesterday's item when possible, and refresh an open page after midnight or resume. Add pool editing, preview and a dated override. In the portable edition, an editor can export a reviewed content pack; global publication requires the authenticated server edition.

Test feed removal, scope filters, empty states, duplicates, stale dates, invalid URLs, draft isolation, fact rotation and midnight refresh. Do not install a feed scheduler or publish remotely without a separate explicit instruction.
```

## Prompt 10 — Add progress backup and private field notes

```text
Continue AniQuest locally. Add a visible Export learning data action and a matching Import action. Include schema version, export time, content version, preferences, progress ledger, attempts and notes. Do not export session tokens, password hashes or server secrets.

Before import, enforce a file-size limit and strict schema, show a preview and explain replace/merge behaviour. Back up the current state before writing. Invalid data must leave existing records intact. Deduplicate IDs and recompute totals. Report unknown or retired content instead of silently losing it. Exporting the program ZIP is not a progress backup.

Add a private Field Lab notebook: observed time, broad location/habitat, animal guess, directly observed traits, confidence and notes. Implement create, view, edit, delete with confirmation and JSON export. Keep observations distinct from confirmed identification. Avoid exact nest or threatened-species locations.

Optional local photos must have explicit selection, size/type checks, metadata removal and deletion. Store them locally with the note and explain storage limits. Do not upload to an AI service or public community automatically. Provide a useful text-only path.

Test export/import round trips, duplicate import, bad versions, corrupted JSON, unavailable storage, deletion and note ownership in the later account edition. Keep text contained in every theme/palette combination.
```

## Prompt 11 — Build the separately launched local account server

```text
Implement the next local-server edition of AniQuest. Preserve the current dependency-free portable edition and its Start-AniQuest.cmd. Add a separate clearly named launcher for the account edition. Do not silently switch the old launcher to a database server or add cloud accounts.

Reuse the UI behind a tested data adapter. Use a local SQLite database outside public/dist-local and outside the source ZIP. Select a supported Node/SQLite driver combination after checking Windows 10 compatibility and availability of required binaries. Keep database migrations versioned and back up before migration. Store application data under the user's local app-data directory, with an explicit override if needed.

Implement a login ID and password. Normalise login IDs only: lowercase, 3-24 characters from a-z/0-9/period/underscore/hyphen; reserve system route names. Keep a separate display name. Enforce uniqueness in the database. Do not trim or transform passwords. Allow passphrases, paste and password managers. For password-only accounts use a 15-character minimum and a documented maximum of at least 64; avoid arbitrary letter/number composition rules.

Hash passwords with a maintained Argon2id implementation, or Node's asynchronous scrypt if that is the more portable supported option. Follow current OWASP parameters, generate a unique salt and store the algorithm/version with the hash. Never store plaintext or use a fast SHA hash. Bound concurrent password work and use generic login errors and rate limits.

Use random opaque sessions with hashed tokens in the database, expiry, rotation after sign-in and revocation after sign-out/password reset. Verify identity and ownership on every request. Never trust a client role, user ID, XP total or correctAnswer. Provide local command-line first-admin provisioning and account recovery; no default password or public make-admin route.

Bind to 127.0.0.1 only. Validate Host and Origin, use CSRF protection, strict JSON schemas, request-size limits and no permissive CORS. Loopback HTTP needs an explicitly local cookie policy; do not label an HTTP cookie Secure or use a __Host- prefix when requirements are not met. Any later network/production mode must fail closed without HTTPS and secure host-only HttpOnly cookies. Do not expose this local setup to the LAN as if it were production-ready.

GET/POST progress and all note operations must use the verified user ID. Store awards and progress atomically, with unique award keys. Keep answer keys out of the account edition's public bundle and responses. Do not import portable scores as trusted server awards.

Run cross-user access, invalid-session, admin-denial, password, concurrency, migration and restart-persistence tests. Test the account launcher on Windows before saying it works there. Do not deploy or provision Firebase.
```

## Prompt 12 — Build the secure `/room` admin interface

```text
Continue the authenticated local AniQuest server from Prompt 11. The portable /room limitation page remains unchanged. For the account edition, implement a real /room page protected by server-side identity, enabled-user state and an admin role check. Keep the path out of normal navigation and search. A hidden path alone is not access control.

Reuse the same logo, typography, semantic tokens, Classic and Pixelated palette choices, and wrapping controls as the learner UI. Admin tabs: Overview, Content, Learning, Events, News sources, Analytics, Source health, Appearance and Audit. Use responsive grids, readable tables and a save bar that cannot cover content or focus.

Overview: real content counts, accounts with learning records, source review backlog, upcoming events and last successful backup. Show unknown values as unavailable, not zero.
Content: draft/review/publish editors for species, lessons, questions and daily facts with evidence and photo-credit fields.
Learning: reward values, hint setting, daily goal and content/tier coverage. Show how changes affect future awards.
Events: session editor, preview, cancellation/postponement, registration and duplicate review.
News sources: add/edit/disable/remove/reorder feeds; story draft queue and scope validation.
Analytics: aggregate section opens, attempts, correctness and completions with clear date ranges and metric definitions. Label section opens as recorded signed-in openings, never people or unique visits. Mark an item Active only after its stored data and interface are released; otherwise mark it Planned or Needs check and exclude it from statistics.
Source health: results, progress, last/next scan, manual check and filters.
Appearance: default Classic/Pixelated style, Pixelated palette, system/light/dark theme and density. Saved user choices override defaults.
Audit: actor-safe label, action, changed groups, version, time and outcome. Do not show secrets or private field notes.

Keep draft and saved state separate. Validate next to fields. Show a changed-group summary before Publish globally. Use expectedVersion and an atomic transaction for content/settings, version and audit. Conflicts return 409; no-op saves do not make a version. Discard restores the saved revision. A scanner failure must not erase a valid published record.

Keep existing limits unless the product plan changes them: facts 3-14, feeds up to 20, announcement up to 180 characters, review interval 7-90 days, goal 25-500 XP, lesson award 10-500 and quiz award 5-250. Reject unknown fields and unsafe URLs.

Test direct admin URL/API denial, disabled accounts, wrong roles, two simultaneous edits, failed audit writes, malformed content and every theme/palette combination. Do not add a back door for screenshots or demonstrations.
```

## Prompt 13 — Complete source checks and optional Windows scheduling

```text
Continue AniQuest's local-server edition. Implement a local source-check command and a protected admin API that checks only registered content sources. Never accept an arbitrary fetch URL from a public request. Portable learning must still work when the checker is unavailable or offline.

Canonicalise HTTPS URLs, reject credentials and unsafe ports, remove tracking parameters/fragments and merge duplicate source references. Use a code-reviewed exact-host list. An unapproved source remains Not checked without an outbound request.

Before each request and redirect, resolve and validate all addresses. Reject loopback/private/link-local/reserved/metadata targets and IPv4-mapped bypasses. Pin the validated address or use equivalent constrained egress to prevent DNS rebinding. Keep certificate verification on. Follow current OWASP SSRF guidance.

Use HEAD first, with a small ranged GET only when HEAD is unsupported. Limit redirects to two, use short timeouts and at most eight concurrent checks. Store status metadata, not article bodies. The retained hosted checker already checks the full registry without the former 96-link cap and guards writes/releases by its owning start timestamp. Preserve this fix. For the new local-server checker, use persisted batches and a cursor that continue until every registry URL is checked; add restart/resume and renewable leases.

Classify 2xx as reachable, 404/410 as broken, authentication/rate-limit blocks as review, and repeated network/5xx failures as review then broken after the configured threshold. Offline runs remain deferred and must not make every source broken. Reachable is not fact-verified.

Use a unique scan owner, renewable lease, heartbeat, cooldown and owner-checked release. Test expired-worker/new-worker races. Show processed/total, the last full completion, next due time, review reasons and a safe retry action. Never delete or unpublish content automatically.

Prepare an optional Windows Task Scheduler setup file and removal file. It should invoke the local command under the user's account, check whether review is due (default 30 days), and resume after a missed run when the PC is next available. No password or secret in task arguments. Do not register the scheduled task automatically; supply its exact name, action, working directory and schedule for the user to enable.

Test with fake DNS/HTTP and a registry larger than 96 entries. Check blocked addresses, redirects, HEAD fallback, timeouts, offline state, cursor continuation, cooldown and ownership races. Document that no work runs while the PC is off and that this is separate from any ChatGPT reminder.
```

## Prompt 14 — Use meaningful charts and private aggregate statistics

```text
Continue AniQuest locally. Draw charts only from recorded or explicitly curated data. Give each chart a title, scope, denominator, date range and text/table equivalent. Do not use colour alone or claim sample counts represent all wildlife in Singapore.

Learner charts: correct/incorrect attempts by topic, due-review count, completed content by habitat, XP earned per Singapore date and question completion. Empty history is an empty state, not synthetic data. Call content completion completion, not measured expertise.

Species chart: counts of Singapore status categories in the current catalogue, dynamically calculated. The current seven non-empty categories are LC17, NT4, VU2, EN8, CR15, NA2 and UNV1, totalling 49. Keep VU visible; do not let new categories vanish from a hard-coded chart. UNV is an editorial unknown, not an official Red List category. Keep national and global assessments in different charts/fields. Do not aggregate ordinal threat categories into a fake risk score.

Admin charts in the account edition: section-open totals, active signed-in learners by day, lesson completions, quiz attempt/correct counts and source-review backlog. Define an active learner from a learning action, not a page refresh. Deduplicate daily active counts atomically without storing a user navigation timeline. Do not call section opens visits or unique visitors.

Keep analytics aggregate-only. Do not collect IP addresses, search text, exact locations, private notes or per-user browsing history for these charts. Explain local data scope. Server infrastructure logs need their own retention/redaction policy.

Test chart totals against the underlying records, empty periods, dates at Singapore midnight and label contrast in every theme/palette. Do not create metrics whose inputs do not yet exist.
```

## Prompt 15 — Acceptance checks, documentation and the release ZIP

```text
Review the implemented AniQuest phases against ANIQUEST-PLAN.md. Fix actual failures and update the current-versus-planned matrix. Do not delete a requested working feature just to pass a build. Keep unimplemented functions clearly marked.

Run meaningful checks for: content IDs and evidence fields; all 49 profile selections and 98 fun-fact references; national-status filters including 25 threatened records and every populated chart category; actual tier counts; quiz attempt/scoring rules; Singapore dates; fact rotation; local saves and backup restore; news scope and disabled feeds; event dates/ICS; source-check coverage; account/admin denial if built; concurrent awards/settings; and logo/photo loading.

Inspect desktop at 1280, 1440 and 1920px where supported, every theme/palette combination, all densities, fixed, non-collapsing desktop navigation, keyboard focus, 200% text enlargement, long source names and empty/error/success states. Check that no text leaves its box or is hidden by the header/save bar. Record actual dimensions and failed or unavailable tests. Preserve mobile code and defer mobile certification.

Build the portable app. Extract a new ZIP into a path with spaces. Start the included build with no node_modules. Verify HTML, JS, CSS, logo, photos, local /room behaviour and shutdown. Test .cmd start/build on a real Windows 10 PC when available; a Linux test is not a Windows test.

Update START-HERE.txt, WINDOWS-10-SETUP.md, ANIQUEST-PLAN.md, this prompt pack, PLAN-REVIEW.md, SOURCES-AND-CONTENT.md, ANIMAL-CATALOGUE.md and FILE-INDEX.md. Refresh docs/ui screenshots from the actual running app and label retained earlier captures historical. Preserve docs/research evidence and distinguish factual/source review from runtime validation. Include the source, lockfile, launchers, built assets, logo, photos and licences. Exclude credentials, database files, user exports, node_modules, caches and Git credentials. Use a version/date and include actual counts.

Report what changed, what passed, what remains unavailable and how to start locally. Return the ZIP. Do not commit, push, save remote versions or deploy.
```

## Prompt 16 — Optional later Google/Firebase port

Use this only after the user requests a cloud edition. This phase is not required for Windows local use.

```text
Prepare a separate AniQuest Google AI Studio/Firebase port of the accepted local app. Do not change the working local edition or migrate an existing live Site. Do not provision paid resources or publish without explicit approval. Keep all nine views, the supplied logo, source records and coherent Classic/Pixelated palette design.

Check current official Google AI Studio, Firebase Auth, Firestore and Cloud Run documentation. Use verified server sessions and server-only Firebase Admin access. The platform's automatic Google sign-in is not a completed username/password implementation. Implement the requested login-ID mapping and recovery explicitly; do not silently substitute email-only login.

If using an internal HMAC-derived Auth identity, version the key scheme. Registration spans Auth and Firestore: use idempotent reservations, collision handling, compensating cleanup and reconciliation. Do not claim a cross-service atomic transaction. Never rotate a mapping key without an account migration/recovery design.

Keep progress, private notes, content, awards, settings and audit in durable stores. Deny inappropriate direct client access. Admin requires a verified claim and an enabled stable-UID role record, plus appropriate administrator reauthentication/MFA. Do not use a public email allowlist or client role flag.

Keep answer keys server-only. Use transactional awards and versioned admin publishing. Scheduled source work belongs in a separately IAM-private worker with authenticated scheduling, full cursor coverage and owner-safe leases. A hidden path on a public app is not a private worker. Migration IDs/checksums remain durable; TTL belongs only on ephemeral records.

Do not add Gemini unless a runtime AI feature is separately requested. Prepare emulator tests, data migration, a cost summary, manual console steps, security checks and rollback instructions. Cloud Run local files are not the durable user database. Stop at a reviewable export and request any needed deployment approval as the final step.
```

## Prompt 17 — Optional later image assistance

Use only after the user requests this feature and chooses its online scope.

```text
Design and then implement optional animal-photo assistance for AniQuest without changing the offline learning core. This is a tentative matching aid, not a confirmed species ID. Check current provider terms and choose a supported model only at implementation time.

Get explicit upload consent. Accept bounded JPEG/PNG/WebP files, decode and re-encode them, remove GPS/metadata and keep uploads private. Show up to three plausible local matches, visible evidence, conflicting evidence and what extra view would help. Permit Unable to narrow down. Do not invent a confidence percentage or conservation status.

Run model calls on the server, keep keys out of the browser and logs, validate output and handle offline/quota/timeouts. Do not allow source pages, image metadata or model text to instruct the app. Do not automatically save uploads or publish observations. Provide deletion and clear retention.

Keep official safety guidance and curated source records authoritative. Do not identify sensitive nest locations or advise capture/handling. Label AI suggestions, show supporting evidence and require review before any result becomes catalogue content. Test malformed files, metadata stripping, deletion, invalid responses and the fully offline fallback. No deployment without approval.
```

## Repair prompts

**Content:** “Review AniQuest's changed facts and questions against their direct sources. Correct scope/date errors, flag unsupported claims, and preserve versioned IDs. Do not mark a reachable link fact-verified.”

**UI:** “Check the changed AniQuest controls in Classic/Pixelated palettes and light/dark, fixed, non-collapsing desktop navigation and enlarged text. Fix actual overflow at the shared component/token level. Preserve original photos and logo. Report tested sizes.”

**Local start:** “Repair the included Windows local run path without requiring GitHub, WSL or cloud accounts. Preserve the lockfile and loopback-only server. Test an extracted path with spaces and state if Windows itself was unavailable.”

**Security:** “For the account edition, assume a hostile browser. Test cross-user records, roles, XP claims, answer keys, settings versions and scanner targets. Fix server authority and atomic writes; do not add a demonstration bypass.”

**Delivery:** “Update the plan, setup guide, prompts and review to match the code. Build and check the ZIP. Clearly list working, planned and untested features. Do not publish or push.”
