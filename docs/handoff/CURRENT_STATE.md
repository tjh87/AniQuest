# Current state — 25 September 2026

An offline Windows export of the latest recovered AniQuest source, with enough files and context to continue without past chats or Sites.

## Provenance

- Repository: https://github.com/tjh87/AniQuest (`main`).
- GitHub baseline: `4660f5cc9986cd10e6a6a0fe4ff2d0d0134ab237`.
- Recovered source: `91af695b4c87cd0f13898dcf7bded1fe147d4ade`, hosted version 23.
- Export does not change the hosted deployment.
- The first GitHub attempt returned HTTP 403. Write access was later confirmed, and the user authorized the prepared source update with a screenshot near the README's top. See `GITHUB_HANDOFF.md` and `GITHUB_UPDATE_2026-09-25.md`; verify the remote commit when resuming.
- `.openai/hosting.json` is absent from this standalone checkout. No credentials, remote database data or account exports are included.

## Measured inventory

| Item | Count |
| --- | ---: |
| Profiles | 141 |
| Birds / mammals / reptiles / amphibians | 91 / 29 / 14 / 7 |
| Guided questions (6 per profile) | 846 |
| Practice questions | 27 |
| Total questions | 873 |
| Bundled profile photos | 51 |
| External photo references | 90 |

`npm run offline:inventory` regenerates these counts from real modules. `OFFLINE_INVENTORY.json` lists paths, credits, licence fields and bundled/linked state. The corpus includes introduced species labelled as such; it does not establish complete coverage of all Singapore native species or all birds. Fish/invertebrate profile groups are not newly completed here.

## Profile decisions to preserve

- Shared components apply improvements to every animal, not just the Sunda colugo example.
- Seven main sections and related subgroups start expanded. Version 2 saved manual choices persist. Legacy preferences migrate once to expanded defaults.
- Compact vertical gaps coexist with readable text and adequate tap targets.
- Cytoscape is the default graph; Photo cards remain an alternative.
- Desktop graph: current animal, relationship groups, up to six other profiles. Narrow layout: vertical, two columns when room allows and one at very narrow widths.
- Independent connector/outline/arrow tokens, curved routes, triangle arrowheads, zoom/reset, keyboard movement and mobile Move mode are already implemented.
- Genus/family matches differ from broad group/habitat browsing matches. No ancestry, genetic distance or time is inferred.
- PhotoSwipe retains real full-frame images, credit, fit/zoom/close, focus and reduced motion.
- Book's persisted style key is `cute`; Pixelated uses `retro`. Keep compatibility.
- **Commonly found in** currently displays existing `habitat` text, plus a separate encounter guide. This is not a newly verified list of named parks or a promise of sightings. A sourced rare-species-aware location model is future work.

## Export changes

Restored the newer profile, lesson, calendar, source, PhotoSwipe and Cytoscape work missing from GitHub. Made default commands local. Added offline media gating, a local resource policy, portable Windows scripts, verified runtime preparation, packaging/inventory checks and this handover. The ZIP includes the built app/runtime; Git tracks source, assets and documentation.

## Honest limits

- Sign-in, shared progress, cross-user statistics and protected admin remain separate server features, not migrated local features.
- Live source checks and fresh news/events need internet. Existing editorial dates are preserved.
- All 90 linked photo records currently lack a declared reuse licence. Obtain permission or correctly identified licensed alternatives before bundling their bytes.
- There is no progress export/import UI yet; browser storage is the save mechanism.
- Codex and model weights are not bundled.
- The main JS chunk remains about 3.25 MB before gzip; optimise later without losing records or changing identities.
- Native Windows and browser visual verification are not claimed complete; consult `TEST_REPORT.md`.

Older `docs/` files can mention 94 profiles, 591 questions and previous UI states. Retain them as history; use this handover and generated inventory for the current baseline.
