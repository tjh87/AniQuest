# Export verification — 25 September 2026

## Checks executed successfully

| Check | Result |
| --- | --- |
| Locked dependency installation | `npm ci --no-audit --no-fund` installed 679 packages on Linux |
| Local TypeScript | `npm run typecheck:local` passed |
| Production local build | Vite build passed; 2,559 modules transformed |
| Local test suite through `npm test` | **62 passed, 0 failed, 0 skipped** |
| Editorial snapshot check | Matches **1,160** content records; build inferred no new factual approvals |
| Generated inventory | **141 profiles, 873 questions, 51 bundled photos, 90 external references** |
| Built offline verification | **63 build files**, all bundled photo paths present, HTML assets served, local-only CSP and API/source-file 404 checks passed |
| Windows runtime archive | Official Node v22.23.3 win-x64 archive SHA-256 matches the pinned official checksum |
| Diff whitespace check | Passed with explicit Windows line-ending attributes |

The local suite includes all-profile graph targets and layout checks, expanded-default preference migration, source/claim boundaries, question validity, grading/history, photo coverage, all-profile offline media rendering, calendar/ICS, persistence and local server protections. It uses Node tests, Vite module loading and static rendering; these are not a substitute for visual interaction checks.

The offline verifier starts the built server and checks actual HTTP responses. It checks packaged paths and initial entry assets. All-profile static rendering verifies that external profile images are omitted in offline mode. It does not claim exhaustive browser network or gesture testing.

## Warnings and unverified areas

- Vite reports a large main JS chunk (about 3.25 MB uncompressed, 597 KB gzip). Cytoscape and PhotoSwipe are separate local chunks. Performance optimisation is future work.
- Native Windows `.cmd`/PowerShell launch, packaging, runtime execution and rebuilding were **not run** on this Linux environment. The official Windows binary was checksum-verified, not executed.
- Browser visual/interaction checks were attempted but the preview connection was refused/blocked by the browser environment. No successful screenshots or visual QA are claimed for this export. Use `ACCEPTANCE_CHECKLIST.md` on the target machine.
- Fully disconnected operation should be confirmed on Windows with a fresh browser cache. The build/server/media checks pass, but no real Windows network-disconnection exercise is claimed.
- Cloud service deployment, real account sign-in, remote database migration and live admin workflows were not exercised. Local mode intentionally keeps those unavailable.
- Publisher photo licences and current source facts were not newly re-reviewed for every animal. Existing evidence dates/credits are retained; 90 external photo bytes are excluded.
- This report describes the export baseline. Future edits must update results honestly and retain failures/not-run states where appropriate.

## Reproduce

After installing locked development dependencies on your platform:

```sh
npm test
npm run content:check
npm run offline:inventory
npm run offline:verify
```

The ZIP manifest provides file hashes. Follow the Windows checklist after extraction; keep generated personal progress outside the source/release artifacts.
