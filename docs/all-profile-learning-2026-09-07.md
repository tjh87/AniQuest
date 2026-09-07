# All-profile learning update · 7 September 2026

## Delivered

- Card gaps are 10 pixels horizontally and vertically. Density changes padding, not card spacing.
- The Singapore fact box no longer adds its own outer margins.
- All 49 profiles open a guided journey. The journey selector and Learn page also list all species.
- Each journey includes traits, habitat, food, activity, behaviour, ecological role, conservation and responsible observation.
- Each journey includes three baseline questions and three follow-up questions, with correct-answer feedback.
- The rainforest lesson remains available.
- Added 288 guided questions. There are 294 guided questions and 27 practice questions: 321 total.
- New guided questions use the existing source-linked profile records. They are template-based checks, not expert-authored lesson plans.
- Guided results save per animal and session. They give no XP and do not prove lasting knowledge.
- Existing otter question IDs and saved otter sessions remain valid.

## Findings supplied in the request

| Finding | Current result |
| --- | --- |
| No error or hint history; fixed quiz order | Already fixed in the preceding update. Current-version error and hint records drive spaced review. XP suggests a starting tier only. |
| Browser submits only correct answers and decides server results | Already fixed. Every answer reaches the account API. The UI uses returned feedback and shows no success after a failed save. |
| Local edition cannot prove server storage or admin protection | Still a deployment limit. Added file-backed server tests and tests of the actual admin guard. These do not prove hosted identity forwarding. |
| Audit only covers global settings | Added a source-edit ledger for profiles, lessons, templates and quizzes. It preserves before-and-after snapshots at build time. |
| Healthy links do not prove facts | Added a separate claim-review workflow. Source notes, reviewer, date, status and content fingerprint are required. |

## Editorial records

The ledger starts with the source state before this lesson expansion. It does not invent earlier edit history.
Each content build adds a numbered file under `docs/editorial/changes/` when content changes.
Existing files stay unchanged during normal use. These files are not a tamper-proof external audit service.

The compact index contains 421 current records: 49 profiles, 50 lessons, one shared template and 321 questions.
Full before-and-after text stays in the ledger, outside the client bundle.
The Control Room shows the compact editorial overview. Profiles and quizzes expose their own content records.

Run `npm.cmd run content:record` after source edits, or build normally.
Run `npm.cmd run content:check` to detect content without a matching snapshot.
Set `ANIQUEST_EDITOR` and `ANIQUEST_EDIT_REASON` to identify a source-edit batch.
Without those fields, the record states that it is an automated local build snapshot.

Practice question edits need a version increase. The build rejects changed questions with unchanged versions.
Generated species questions derive their version from their content. Changed content starts new learning evidence.

## Factual review

Link-health checks still test availability only. A successful response does not approve a claim.
Claim reviews require a linked HTTPS source, a content field, a reviewer, and a specific support or correction note.
Review records bind to the content fingerprint. A changed record needs another review.
A review also becomes due after 30 days. This is a fixed claim-review period, separate from the news-review setting.

Example command, after inspecting the source yourself:

```powershell
npm.cmd run content:review -- --id profile:sunda-colugo --claim activity --source https://biodiversitysg.nparks.gov.sg/our-biodiversity/mammals/other-mammals/sunda-colugo/ --status supported --reviewer "Your name" --note "Describe which source passage supports this field, including any limits."
```

Valid statuses are `supported`, `needs-correction` and `unverified`.
The command records the reviewer's conclusion. It does not infer accuracy or visit the source automatically.
Review files remain under `docs/editorial/reviews/`. Rebuild to show a new review in the local app.

Two source comparisons were recorded in this update:

- Sunda colugo activity: the NParks habitat section supports night activity and daytime rest on tree trunks.
- Otter baseline safety explanation: AVS supports distance, quiet observation, no feeding, and no chasing or cornering.

Other fields remain explicitly unreviewed in this new workflow. These two reviews do not approve whole profiles or all lessons.

## Tests and limits

- Local TypeScript check and production build passed.
- AniQuest tests: 45 passed, one skipped, no failures.
- Windows skipped its symlink test because the account cannot create symbolic links.
- The real progress route graded all 294 guided questions through a SQLite-backed D1 test adapter.
- Saved progress survived closing and reopening the database file.
- The real admin guard rejected anonymous users, ordinary users and users outside the configured allowlist.
- The test uses controlled identity headers. It does not test the hosted authentication gateway.
- Browser checks rendered all 49 journeys without horizontal overflow.
- Javan myna completed all six checks and retained its result after reload.
- The browser measured 10 pixels above and below the fact box, and between profile columns, at every density.
- Light and dark layouts, keyboard focus and 390-pixel wrapping passed.
- Photographs remain unchanged. Full-frame profile display remains in place.
- The local bundler still warns about a large JavaScript chunk. Launch succeeds.

The local edition still saves progress in browser storage. Its `/room` page remains informational.
The account app needs its configured server environment and the preceding `0005_learning_records` database migration.
No remote migration, commit, push or publication occurred. The earlier checkpoint remains unchanged.

Start with `Start-AniQuest.cmd` or `npm.cmd start`. Open `http://127.0.0.1:5173`.
