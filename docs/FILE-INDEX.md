# AniQuest ZIP file index

Revision: 6 September 2026 — full-width desktop, visible themes, visual statistics and sourced events.

## Start and read

| File | Purpose |
| --- | --- |
| `START-HERE.txt` | Short Windows start instructions; opens in Notepad |
| `Start-AniQuest.cmd` | Start the included build and open the browser |
| `Build-AniQuest.cmd` | Install locked dependencies and rebuild after source edits |
| `README.md` | Project overview and developer commands |
| `docs/WINDOWS-10-SETUP.md` | Full setup, data limits and troubleshooting |
| `docs/ANIQUEST-PLAN.md` | Current scope, verified counts, planned phases and acceptance gates |
| `docs/ANIQUEST-BUILD-PROMPTS.md` | 17 staged prompts; local first, optional cloud/AI later |
| `docs/PLAN-REVIEW.md` | Findings, corrections and recommended features |
| `docs/SOURCES-AND-CONTENT.md` | Source hierarchy, news policy, question rules and picture credits |
| `docs/ANIMAL-CATALOGUE.md` | All 45 animals, category counts and direct references |
| `docs/ui/` | Current expansion references and clearly labelled historical desktop captures |
| `docs/research/` | Research records for 15 new animals, the existing-content audit and global-assessment review |

The screenshot index records which working-app captures belong to this expansion and which are historical. Do not use old counts or missing filters in 5 September images to override the 45-species data or current source. The old cloud-first prompt pack is superseded. Screenshots are not needed to start the app.

## Exact source and assets for a coding tool

| File or folder | Purpose |
| --- | --- |
| `app/aniquest-app.tsx` | Nine learner views, visible theme/palette modes, site map and statistics visuals |
| `app/aniquest-logo.tsx` | Shared 148px logo display with a background-removal mask |
| `app/globals.css` | Base layout and Classic theme tokens |
| `app/interface-design.css` | Compact containment rules and Pixelated palette tokens |
| `app/species-data.ts` | 45 Singapore records, dated conservation sources, search and filters |
| `app/species-profiles.ts` | Previous 30 biological profiles and their fun facts |
| `app/species-expansion.ts` | 15 new full profiles, 30 additional facts and supporting evidence |
| `app/species-assessments.ts` | Nine recovered global references for previous animals, with date distinctions |
| `app/animal-atlas.tsx` | Selectable profiles, catalogue controls and fun-fact cards |
| `app/quiz-data.ts` | 18 questions with answers, hints and sources |
| `app/news-data.ts` | 8 Singapore and 6 World news stories |
| `app/default-settings.ts` | 7 facts, 11 source-directory entries and defaults |
| `app/seasonal-data.ts` | 9 seasonal signals and Singapore climate context |
| `app/animal-events-data.ts` | 11 dated sessions, 4 organisers and ICS helpers |
| `app/animal-events-calendar.tsx` | Coloured calendar grid, direct event sources, filters and event export |
| `app/local-progress.ts` | Browser progress format and validation |
| `app/wildlife-photos.tsx` | Photo display, source pages and licences |
| `public/aniquest-logo.png` | The supplied AniQuest logo, unchanged |
| `public/wildlife/` | Three real, credited teaching photos |
| `local/`, `vite.local.config.ts`, `tsconfig.local.json` | Portable entry, build configuration and local type-check boundary |
| `scripts/serve-local.mjs` | Dependency-free loopback server for the included build |
| `dist-local/` | Ready-to-run local app, including logo and photos |
| `package.json` and `package-lock.json` | Commands and locked dependencies |
| `tests/` | Existing checks and local-server tests |
| `AGENTS.md` | Local-only, publishing and evidence rules |

The retained hosted app under `app/api`, `app/room`, `db` and related server files requires its own environment. It is source for future work, not a working local username/password backend.

The unused legacy `public/aniquest-wildlife.png` may remain in the source history/package. It is not the logo and must not replace the real animal photos.

User data, credentials, `node_modules`, databases and remote Git credentials are not included. The app ZIP does not contain browser progress.
