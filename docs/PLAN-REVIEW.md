# AniQuest: implementation review and release notes

Revision: **6 September 2026 — full-width desktop, Pixelated palettes and accurate admin metrics**.

This report describes the completed local expansion and its release checks. The rebuilt app, extracted ZIP and all 45 profile selections were checked on 6 September 2026. Results from the earlier 30-profile edition are historical.

## What changed

This desktop pass removes the narrow centred content cap and uses the workspace width with small fluid gutters. It makes Classic and **Pixelated** visible segmented choices, adds Pixelated Arcade blue, Forest green and Sunset amber palettes, sets light mode as the first-visit default, keeps saved learner choices, and adds a compact site map to every learner page. The Home banner now says **Fact of the day** and the former “Sources checked” badge is absent.

The Collection now has nine obtainable badges. Each rule uses lesson completion, saved correct answers by difficulty or level progress, so the portable app does not claim to track an action it cannot verify.

Singapore Wild now opens with three credited real animal photographs and adds group-composition and national-threat visuals. The visuals state that their denominator is this 45-profile guide and link to the Singapore Red Data Book methodology. The calendar now keeps organiser links visible above the grid, adds a direct source link to every dated event card, and uses distinct colours for walks, workshops, talks, festivals and fundraisers.

The catalogue expands from **30 to 45 complete biological profiles**: 17 mammals, 14 birds, 10 reptiles and 4 amphibians. All existing animals remain. There are **90 animal fun facts**, two per animal. These are separate from the seven daily banner facts and the unchanged 18-question quiz bank. No insect or fish profiles were added.

| Added group | New animals |
| --- | --- |
| Mammals | Greater mousedeer; Malayan porcupine; Horsfield’s flying squirrel; red-cheeked flying squirrel; small-toothed palm civet |
| Birds | Buffy fish owl; blue-eared kingfisher; great-billed heron; changeable hawk-eagle; purple heron |
| Reptiles | Spiny hill turtle; Asian leaf turtle; clouded monitor |
| Amphibians | Malayan horned frog; black-eyed litter frog |

Every addition has identification, diet, activity, behaviour, reproduction, broad Singapore occurrence, ecology, pressures, safe viewing, aliases, origin and source evidence. Fun facts use the existing playful cards and shared palette. Sensitive resting/nesting coordinates and invented local breeding dates are excluded.

- Added a **national conservation filter**, including a threatened group defined as VU, EN or CR. That group contains **23 records**. Exact-category filters support more focused browsing.
- Updated the status chart to retain the newly populated VU category and derive values from the catalogue. Its seven non-empty rows are LC15, NT4, VU2, EN8, CR13, NA2 and UNV1, totalling 45. Removed stale hard-coded 30-animal copy.
- Recovered **12 dated global references**: nine for existing animals and three for new birds. There are now 24 dated global fields and 21 explicitly unverified fields.
- Separated assessment dates from publication years and review dates. An assessment published in 2021 may have been performed in 2018; an announcement date is not an assessment date.
- Corrected source-card labels so BiodiversitySG, Flora & Fauna Web, Singapore Red List tables and Jurong Lake Gardens are identified accurately.
- Widened the national-status selector and aligned the six filter controls in a compact two-row desktop grid, fixing visible truncation in Retro mode. Added initial chart dimensions to prevent the initial negative-size warning while responsive measurement starts.
- Preserved the seamless, consistent 148px logo display, fixed desktop sidebar, Classic and Pixelated palette pairs, source registry coverage and existing local progress.
- Updated the Windows handoff, current plan, 17 prompts, catalogue, source policy and research trail. Screenshot dates and release checks are documented separately.

## Evidence review: corrections and remaining uncertainty

The independent audit confirmed all **29 previously claimed national RDB3 categories**. It found no basis for changing those categories. The remaining previous record, Banded bullfrog, has introduced origin in NParks Flora & Fauna Web but no matching row in the reviewed amphibian table. Its editorial **“Not assessed here”** remains; it is not silently reclassified as NA or LC.

There are **42 native and 3 introduced records**. National risk, global risk, origin and encounter frequency remain separate. Long-tailed macaque is LC nationally and EN in the recovered 2025 global publication. Javan myna is introduced/NA locally and VU in its dated 2020 global reference.

The new profiles use RDB3 rather than older species-page labels. Examples include buffy fish owl VU, blue-eared kingfisher EN, changeable hawk-eagle VU, spiny hill turtle EN, Malayan horned frog CR and black-eyed litter frog NT. These are corrections to source conflicts before publication, not claims that the previous app already had those species with wrong badges.

Accepted *Pelobatrachus nasutus* is used for Malayan horned frog, with *Megophrys nasuta* as an alias and an explanation of the typo on the NParks table. Clouded monitor remains *Varanus nebulosus*; an older broader *V. bengalensis* global assessment is not automatically transferred. Existing civet, koel and sea-eagle naming notes are preserved.

Research files in `docs/research/` preserve direct source links and limits. Some global evidence was recovered through a primary-source citation or indexed factsheet rather than a fully accessible current IUCN page. These references are **dated evidence, not a certification that every latest global assessment was checked**. The original twelve global references remain dated snapshots. Twenty-one global fields still need a supported, taxon-matched reference.

Only **three real animal photographs are embedded**: colugo, hornbill and otters. The other 42 profiles link to reference pictures. No generated or unrelated photo was substituted. The user's logo is brand artwork, not identification evidence.

This pass did not independently reverify every older news story, event or quiz claim. Saved collections remain dated collections, not live feeds. A reachable source does not establish factual accuracy; a temporary source block does not prove the link is broken.

## Remaining findings and priorities

| Priority | Remaining gap | Recommended next work |
| --- | --- | --- |
| High | Browser progress has no export/import; clearing storage loses it | Add validated backup/restore and versioned migrations |
| High | Local username/password accounts and admin editors do not exist; `/room` explains the requirement | Build the separate local account server in prompts 11–12 with real sessions, ownership and admin checks |
| High | Only one complete lesson and 18 questions exist | Build the four-week path and a reviewed 60-question bank; 90 fun facts are not 90 questions |
| High | Wrong attempts and confidence are not retained; no valid session score or mastery history | Add an attempt ledger, documented denominators and due-review scheduling |
| High | 21 global evidence gaps and only 3 embedded photos | Match remaining taxa to dated assessments; add correctly identified, licensed photos with credits |
| Medium | News/events are static and review fields are not uniform | Add draft queues, per-record review dates, cancellation/change states and deduplication |
| Medium | Portable mode does not run the source checker or a background schedule | Add a local checker and optional Windows task with missed-run recovery |
| Medium | Retained server scans are not checkpointed between batches | Add a persisted resume cursor and verify database lease ownership races |
| Medium | Navigation uses component state; search covers animal profiles | Add shareable profile URLs with reload/back support and search across published learning content |
| Medium | Daily activity and XP ledgers are absent; badge rules are incomplete | Implement Singapore-date activity before displaying streak, daily XP or mastery statistics |
| Low | Portable JavaScript is 951.50 kB minified (284.20 kB gzip); Vite reports its 500 kB advisory | Split heavier routes/charts if measured local startup justifies it; the included build starts successfully |

The retained hosted app is not the requested local login-ID/password edition. A hidden `/room` URL or client role flag must never confer authority. Portable answer keys are inspectable self-study material; a later authenticated scoring edition needs server-owned answers and awards.

## Design review scope

The current CSS and shared components are the visual authority. Keep one coherent palette per theme, legible normal text, wrapping source cards, content-driven heights and real photos unchanged in Retro mode. National-status controls must wrap with the existing filters without squeezing labels out of their boxes. The fixed logo and expandable overview remain.

Existing 5 September screenshots are historical references. Four new expansion screenshots are saved under `docs/ui/aniquest-expansion-*.jpg`, at 1363 × 936 CSS pixels with Compact density. Do not treat a screenshot as proof that unseen tabs, layouts or admin features work.

The design review follows [W3C reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) and [contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Checks are not accessibility certification.

## Recommended next features

1. **Progress backup/restore**, so browser resets do not erase learning or earned badges.
2. **Spaced quiz review**, with saved mistakes, confidence and better explanations.
3. **Four lesson paths and a 60-question bank**, so badges reward wider learning instead of repeating one lesson.
4. **Private field notes**, with broad habitat, uncertainty, export and delete; then add observation badges based on saved records.
5. **Event change tracking**, so organiser changes can be flagged on saved entries.
6. **Complete assessment and photo coverage**, including clear source dates and image licences.
7. **Local accounts and admin publishing**, in a separately authenticated server edition.

## Validation results — release gate

**Passed: 28 automated tests, local TypeScript, both builds and the extracted-copy startup check.** Browser checks cover the stated desktop scope; they are not a full-device certification.

| Gate | Current release result |
| --- | --- |
| Actual catalogue, group, origin, fact and status counts | Passed: 45 animals / 90 facts; groups 17/14/10/4; origin 42/3; categories LC15/NT4/VU2/EN8/CR13/NA2/UNV1 |
| National filters, search, reset, unknown inputs and profile navigation | Passed automated search/filter checks; all 45 profiles selected in browser, each rendered two facts. Threatened filter showed 23/45, VU 2/45; legacy frog-name search opened the accepted-name profile |
| Source registry and date distinctions | Passed: 187 unique registered links before configurable daily facts/feed entries; every profile/global/fact reference covered and on the reviewed check allowlist. 24 dated global fields / 21 explicitly unverified. Browser showed python published 2018, assessed 2011-09-02 |
| Local TypeScript and builds | `npm run typecheck:local`, `npm run build:local` and the retained server build passed. Local build retains the documented bundle-size advisory |
| Theme contrast and text containment | Every Classic and Pixelated palette/theme token pair has contrast regression coverage. Full-width Home, Singapore Wild and Calendar had no horizontal document overflow or clipped checked text at the recorded desktop check; the collection total is forced to stay on one line |
| Keyboard focus and logo | Keyboard Tab reached the Sort selector with visible 3px outline. SVG logo measured exactly 148 × 148 in all four palettes |
| Image identity and loading | Original PNG and all three WebPs byte-identical to the previous ZIP. Extracted server returned HTTP 200 with non-empty image bytes |
| Current screenshots | Four final full-width Singapore Wild captures saved and visually inspected; filenames and scope in docs/ui/README.md |
| ZIP and extracted-copy startup | CRC integrity passed; required source/build/docs present, dependencies and user databases excluded. Extracted path contained spaces, launched from unrelated `/tmp` without node_modules. App, `/room`, JS, CSS, logo and three photos returned 200. Own test server stopped cleanly |

Automated command (28/28 passed):

```sh
node --test --test-concurrency=1 tests/aniquest-desktop-review.test.mjs tests/aniquest-local-server.test.mjs tests/aniquest-local-events.test.mjs tests/aniquest-calendar-source-health.test.mjs tests/aniquest-species-profiles.test.mjs
```

The source-health tests use controlled responses to verify classification and coverage; they do not claim that all 187 external websites were live-tested. Browser diagnostics contained earlier chart initialization warnings and unrelated browser-extension messages. After the chart change and reload, no additional chart warnings appeared in the captured log. The temporary preview was stopped.

Prior logo SHA-256: `ad7aaa2543f89de7f0df291c463b06bc503c5eb9e0a1adef97d00ae66042ed3c`. Compare the supplied PNG bytes separately from the display mask.

**Unrun unless explicitly completed and recorded:** actual Windows 10 double-click experience, full 1280/1440/1920px and 200% enlarged-text matrix, mobile certification, local account-server tests and production database/security audit. A Linux startup test does not certify Windows launchers. Source-check test responses do not certify every external URL as reachable. No Git commit/push, remote Site save or deployment is part of this local update.

## Coastal and waterway update — 6 September 2026

Added dugong, Indo-Pacific humpback dolphin, grey heron and little egret. Each has a full profile and two sourced facts. Existing tag, conservation-colour and evolution-tree features consume the same catalogue. The guide now has 49 animals: 19 mammals, 16 birds, 10 reptiles and 4 amphibians. National categories total LC17, NT4, VU2, EN8, CR15, NA2 and UNV1; 25 are nationally threatened. Global references remain 24 verified dated references and 25 unverified fields.

Checked NParks RDB3 marine-mammal and bird sources. Kept overseas dolphin breeding information separate from Singapore seasonality. Added the exact source hosts to link-check policy. Removed the hard-coded threatened-record count and retained the original catalogue order. Fish and insects remain excluded. Embedded photographs remain three; other profiles link to reference pictures.

Validation: local TypeScript check, portable build and server build passed. All 20 targeted species, desktop-rule and local-server tests passed. No new browser inspection or native Windows execution was performed. Earlier browser results above are historical.
