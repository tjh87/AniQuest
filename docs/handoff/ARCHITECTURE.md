# Architecture and source map

## Local flow

`Start-AniQuest.cmd` → bundled/system Node → `scripts/serve-local.mjs` → `dist-local/index.html` → compiled `local/main.tsx` → `AniQuestApp` in local mode.

The entrypoint supplies `OfflineContext=true`, default settings, no user and no admin role. Browser storage provides local persistence. `/room` displays a server-required explanation. Vite uses `local/` as entry root, `public/` for media, `@` for repository imports and `dist-local/` as output. Separate PhotoSwipe/Cytoscape chunks must remain in the package.

| Responsibility | Files |
| --- | --- |
| Bootstrap/build | `local/index.html`, `local/main.tsx`, `vite.local.config.ts`, `tsconfig.local.json` |
| Shell/navigation/preferences | `app/aniquest-app.tsx`, `app/view-data.ts`, `app/default-settings.ts` |
| Canonical catalogue/conservation joins | `app/species-data.ts`, `app/species-profiles.ts` |
| Additional records | `app/species-expansion.ts`, `app/common-species-expansion.ts`, `app/additional-common-species.ts`, `app/native-species-expansion.ts`, `app/migratory-bird-expansion.ts`, `app/full-bird-profiles.json` |
| Catalogue/search | `app/animal-atlas.tsx`, `app/species-explorer.tsx`, `app/bird-directory.tsx` |
| Profile sections/field notes | `app/profile-sections.tsx`, `app/profile-field-notes.tsx`, `app/species-explorer.tsx` |
| Graph layout/rendering | `app/relationship-graph-data.ts`, `app/relationship-graph.tsx` |
| Photos/viewer/offline policy | `app/profile-photos.ts`, photo JSON files, `app/wildlife-photos.tsx`, `app/photo-viewer.ts`, `app/photo-viewer.css`, `app/offline-context.tsx` |
| Guided journeys/checks | `app/species-lessons.ts`, `app/species-journey.tsx`, `app/species-assessments.ts` |
| Practice/answers | `app/quiz-data.ts`, `app/quiz-arena.tsx`, `app/question-challenge.tsx` |
| Grading/history/review | `app/learning-records.ts`, `app/learning-summary.tsx`, `app/client-id.ts` |
| Local save validation | `app/local-progress.ts` |
| Observation/resources | `app/field-resources.tsx`, `app/singapore-insights.tsx`, `app/water-species.ts` |
| Calendar/ICS/seasons | `app/animal-events-data.ts`, `app/animal-events-calendar.tsx`, `app/seasonal-data.ts` |
| News/daily facts | `app/news-data.ts`, `app/daily-fact.ts` |
| Editorial evidence | `app/content-index.json`, `app/content-reviews.json`, `app/content-review.tsx`, `docs/editorial/` |
| Sources/link health | `app/source-registry.ts`, `app/source-url-policy.ts`, `app/source-link-health.ts`, `app/source-checker.ts` |
| Styling/primitives | `app/globals.css`, `app/interface-design.css`, `components/ui/` |
| Offline tooling | `scripts/serve-local.mjs`, `scripts/offline-inventory.mjs`, `scripts/verify-offline.mjs`, `scripts/package-offline.mjs`, root Windows scripts |
| Retained cloud boundaries | `app/page.tsx`, `app/chatgpt-auth.ts`, `app/admin-auth.ts`, `app/api/`, `app/room/`, database/config files |

## Data and evidence

`SINGAPORE_SPECIES` is the joined catalogue for all views and lesson generation. Preserve stable IDs and scientific-name joins. Read exported TypeScript schemas before additions. Each catalogue record has recognition/life-history/Singapore context and explicit origin, encounter, habitat and conservation metadata.

`SPECIES_LESSONS` generates six questions per animal. Question IDs and versions affect stored grading evidence; do not reinterpret past answers after changing a question's meaning. Practice has nine questions per difficulty tier.

`PROFILE_PHOTOS` contains one metadata record per profile. `sourceUrl` is credit/reference; local `src` means packaged bytes. In offline mode, external `src` values render placeholders. Never infer a reuse licence from a source link.

`content:record` records before/after changes, not approval. Claim review needs a real reviewer, exact field/claim, supporting source/note and actual date. URL reachability is a separate signal.

## Storage compatibility

| Key | Meaning |
| --- | --- |
| `aniquest-local-progress-v1` | Version 1 validated progress envelope, up to 500 learning records |
| `aniquest-profile-sections-v2` | Shared expanded/minimised choices |
| `aniquest-profile-sections-v1` | Legacy migration input |
| `aniquest-theme` | Light/dark |
| `aniquest-density` | 0–2 |
| `aniquest-ui-style` | `classic`, `cute` (Book), `retro` (Pixelated) |
| `aniquest-pixel-palette` | Pixelated palette |

The source archive does not contain browser saves. Preserve malformed-save error handling rather than overwriting unreadable data.

## Graph design

Matching prioritises genus/family before broad group/habitat and caps at six. Stable profile IDs identify targets. `relationshipGraphData` computes preset coordinates: below 860px is narrow, below 260px is single-column. Cytoscape draws nodes/edges; DOM labels provide accessible profile buttons. Resize/theme observers and cleanup are essential for collapse, navigation and style changes.

Keep Cytoscape for runtime graphs. Mermaid is appropriate for developer documentation, not a replacement here. Arrow direction and layout distance are browsing devices, not evolutionary measurements. Preserve Photo cards as an alternate representation.

## Server and packaging

The local server imports only Node built-ins and must run without root `node_modules`. Only built files are served. Missing assets/APIs return 404. Path traversal, symlink escapes, Windows alternate paths and untrusted Host headers are rejected.

CSP permits local scripts/styles/fonts and local/data/blob images, blocks remote connections and frames/objects, and retains needed inline bootstrap/style support. Reader-clicked external source navigation is allowed. Do not remove this policy to hide a missing-image error.

Git tracks code/assets/docs/lockfile/tests. The release ZIP adds `dist-local`, `runtime/windows-x64` and a hash manifest. Root development dependencies, caches, Git internals, credentials and browser data are excluded. Native Windows development dependencies are prepared separately.
