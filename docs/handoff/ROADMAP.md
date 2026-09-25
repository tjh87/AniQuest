# Development roadmap

Implemented locally on 25 September 2026: validated progress export/import in Collection, with a review step, Merge/Replace, appearance opt-in, recovery copies and private-file exclusions. Automated round-trip and failure checks pass; browser interaction and native Windows acceptance remain open. The earlier Windows ZIP predates this increment.

## Remaining work

| Priority | Work | Completion evidence | Prompt |
| --- | --- | --- | --- |
| P0 | Real Windows x64 test, path with spaces, disconnected network | Launcher, graph, viewer, quiz and persistence results with OS/browser/runtime | 01, 13 |
| P0 | Browser review at 360/390/768/1440px across themes | Screenshots and interactions; no clipped labels or graph disappearance | 05–08, 13 |
| P1 | License/localise remaining 90 photos or obtain licensed replacements | Verified identity, credit/licence, local asset and updated inventory per record | 08 |
| P1 | Verify progress backup controls in a real browser and Windows release | Download/upload round trip, keyboard operation, reload persistence, theme/layout review and recovery | 10, 13 |
| P1 | Improve sourced “Commonly found in” data | Per-record sources, occurrence qualifiers and sensitive-species-safe wording | 04 |
| P1 | Reduce main bundle size | Measured cold-load improvement, unchanged records and no remote chunks | 12 |
| P2 | Expand catalogue against a source checklist | Correct origin/inclusion, complete profile and six checks; no premature completeness claim | 03 |
| P2 | Refresh events/news/evidence online | Real review dates and confirmed-date versus seasonal distinctions | 11 |
| P2 | Portable-release automation and Windows CI | Reproducible hashes and verified clean artifact | 13 |
| Optional | Independently hosted account/admin backend | Approved design, real auth/roles, migration and deny-by-default tests | 14 |

Keep the local app working after each increment. A disconnected AI coding environment is a separate workstation setup; no model weights or hardware assumptions are part of this app export.
