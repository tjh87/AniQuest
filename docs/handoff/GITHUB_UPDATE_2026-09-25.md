# GitHub continuation — 25 September 2026

## Current completeness check

The current GitHub source is published. At the start of this check, `main` pointed to `4c4d09e8929637ed1eff27b43a069aa2db47c8d6`. All 371 tracked files matched the latest local working source by Git object hash.

| Check | Result |
| --- | --- |
| Prepared source coverage | All 367 prepared files remain present; 0 missing |
| Later files | 4: backup logic, backup controls, backup tests and this publication record |
| Later updates | 13 prepared files have newer content for progress backup, documentation or README presentation |
| README links | All 26 local link occurrences resolve to tracked files |
| README screenshots | All 4 dated JPEG files are tracked |
| Bundled profile photographs | All 51 inventory paths are tracked |
| Current catalogue inventory | 141 profiles and 873 questions; 90 photos remain credited external references |
| Private/generated files | Runtime, build output, development dependencies and private progress downloads remain excluded |

This documentation follow-up corrects stale publication wording and identifies both older portable ZIP source versions. It changes no application code. The existing 77-test result remains in `TEST_REPORT.md`; this file audit did not rerun that suite. GitHub has the full source and build instructions, but no ready-built Windows release asset. The older portable ZIP predates progress backup/restore.

The following sections record the earlier source publication. Their package hash, screenshot count and test scope are historical.

## Starting state

- GitHub `main`: `4660f5cc9986cd10e6a6a0fe4ff2d0d0134ab237`.
- Prepared source: `c46435139fcd122b6a9c143730ed7ec6384c4b5e`, restored from the Windows ZIP's Git bundle.
- The prepared source changes 104 files relative to the original GitHub release.
- The user approved this GitHub update and requested a screenshot near the top.

## This continuation

- Updated the README introduction, placed one existing app screenshot immediately below it, and kept features near the top.
- Labelled the screenshot as a 6 September capture with historical counts and labels. It is not a new screenshot.
- Updated publication notes after confirming GitHub blob write access.
- Application code, animal data, dependency versions and the existing Windows ZIP remain unchanged from the prepared source.

## Checks completed

- ZIP SHA-256 matched `26b8737a91db6769749d916989c2389196f0fef88b2d17a31fad19f378003fe5`.
- All 2,464 files matched the package manifest's size and SHA-256.
- All 367 tracked source files matched the extracted package, allowing declared Windows line-ending conversion in two PowerShell files.
- The original GitHub commit is an ancestor of the prepared source.
- The prepared diff passed `git diff --check`.
- Offline verification passed: 141 profiles, 873 questions, 51 bundled photos and 63 build files.
- All six local-server tests passed, including paths with spaces and runtime without development dependencies.
- These checks ran on Linux. The previous export's full 62-test result is documented in `TEST_REPORT.md`; this continuation did not rerun that full suite.

## Limits and next work

- Native Windows execution remains untested in this environment.
- The browser blocked the current local preview. No new app screenshot or browser interaction pass is claimed.
- The existing screenshot is a real earlier app capture; current counts are stated beside it.
- The catalogue remains at 141 profiles, 873 questions, 51 bundled photos and 90 external photo references.
- Verify the published GitHub commit and README image. Then run the Windows acceptance checklist on the target computer.
- This update does not publish or change the Sites deployment or repository visibility.
