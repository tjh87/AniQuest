> Historical review from an earlier pass on the same day. The current release is documented in `PLAN-REVIEW.md`; current counts, seamless logo and fixed desktop navigation supersede older descriptions below.

Historical review of an earlier build. Use `PLAN-REVIEW.md`, `ANIQUEST-PLAN.md` and `ANIMAL-CATALOGUE.md` for the current 45-profile release; the counts and verification claims below are not current-release results.

# AniQuest desktop review — 5 September 2026

## Outcome

The desktop design now uses one forest-green system across learner pages and the control-room styles. Main titles, cards, spacing, navigation, inputs and charts share consistent rules. Light and dark themes remain available. Mobile code is retained; this was not a mobile redesign or mobile certification.

The current app still uses Sites, D1 and ChatGPT sign-in. The Google AI Studio/Firebase prompt pack describes a separate future port, not a migration performed in this review. This revision is saved without publishing it to the live site.

## Design and interaction changes

- 240px desktop sidebar, 80px top bar, common heading placement and 1520px content cap.
- Readable 16px body text, 14px controls and at least 12px metadata in checked learner pages.
- One emerald accent, neutral forest surfaces, higher-contrast muted text and opaque focus outlines. Locked collection cards retain readable opacity.
- Home has a two-column lesson hero beside a progress/next-actions card. Real photography is separate from text, with no readability-dependent image overlay.
- Learn's title spans the page above aligned lesson and sidebar cards. The calendar's current-month summaries use rows rather than cramped nested columns.
- Search supports common names, scientific names and habitats. Results appear near the top; singular/plural counts and an explicit empty state work.
- News is sorted newest first within Singapore and World, and described as curated rather than a live feed.
- The density select is keyboard-operable. Featured habitat and suggested XP goal settings remain reflected on Home; actual daily-goal tracking is marked as planned.
- Admin styling uses the same tokens and spacing. A local light/dark toggle is provided without changing the global default setting.

## Evidence and photography

All 12 displayed Singapore conservation labels were compared with NParks' third-edition Red Data Book lists. Local rarity, national conservation status and global assessments remain separate. Global labels retain assessment years; this review did not independently establish the latest IUCN assessment for every species.

- [NParks mammals](https://www.nparks.gov.sg/nature/species-list/terrestrial-mammals)
- [NParks birds](https://www.nparks.gov.sg/nature/species-list/birds)
- [NParks reptiles](https://www.nparks.gov.sg/nature/species-list/reptiles)

The colugo, hornbill and otter images are real Singapore photographs, not generated identification images. Each has a species-specific alt description, photographer credit, location, date, original source and licence link in `app/wildlife-photos.tsx`. WebP files were resized/re-encoded without adding animal details; display crops are disclosed. The unused older generated asset is retained, not deleted.

Facts and quiz explanations were checked against relevant NParks/AVS and university sources. Over-specific unsupported wording was replaced or attributed to the source's reported estimate. Lesson references now point to the individual species records. The old horseshoe-crab fact has a directly supporting RDB source. The seeded correction preserves other administrator-written facts.

News references were reviewed at their publishers. Planned work is not described as completed, and event dates are distinguished from announcement dates. Some publisher or government pages did not open directly in the research tool; indexed source evidence was available. These cases are access/review warnings, not proof of a broken link or proof that an article is false. Some NParks profile pages also displayed a scheduled-maintenance notice during this review.

Calendar wording now matches its raptor month markers and recognises the March monsoon transition. Wildlife windows remain typical periods, not guaranteed sightings. The climate layer links to [Meteorological Service Singapore](https://www.weather.gov.sg/climate-climate-of-singapore/).

The daily fact rotates by the Singapore date, remains the same within that day, and avoids consecutive repeats when the pool contains more than one item. An open Home page checks the clock every minute.

## Checks and limits

| Check | Result / limit |
| --- | --- |
| Production build | Passed using the required Sites build entry point |
| Regression suite | 16 tests passed, including four new evidence/design/date tests |
| Contrast | Core text, muted text on card/background/accent/muted surfaces, primary/accent labels, warnings, focus and input borders pass automated token-pair targets in both themes |
| Browser viewport | 1363px desktop browser viewport; page screenshots have a scrollbar-dependent content width |
| Learner pages | All nine opened in light and dark; no document-width overflow found in inspected states |
| Light metadata audit | No visible text under 12px found in the checked `p`, `small`, `span`, `a` and table-heading elements after fixes |
| Photos | Colugo, hornbill and otter assets loaded; the original source identities and displayed crops were inspected |
| Interactions | Theme switch, three density settings, Atlas conservation tab, quiz hint/wrong/correct feedback, Singapore/World news, animal and empty searches, clear search, and calendar month/category selection checked |
| Lint | No errors in changed TypeScript/JavaScript. The native-image advisory remains intentional: local WebP assets already have dimensions, loading policy and optimised bytes |
| Standalone type check | Blocked by missing Cloudflare runtime declarations in the recovered project. Runtime-type generation could not complete; no access restriction was bypassed |
| Not claimed | Other viewport sizes, zoom/reflow matrix, full WCAG certification, mobile QA, authenticated admin screenshots, password authentication, production security certification, or live deployment |

The captures use an anonymous test session with one correctly answered quiz question. The displayed XP is preview activity, not a claim about a real account.

## Next priorities from the plan review

1. Keep scoring and answer keys on the server; make XP and completion updates idempotent and verify persistence with an authorised test account.
2. Finish the desktop width/zoom/state matrix and authenticated control-room QA before publication.
3. Add a real draft/review/publish content workflow and independent scheduled source checks. The current automatic scan runs when an administrator opens the room and a check is due; it is not an unattended scheduler.
4. Expand the one working guided lesson, 18-question bank and single full Atlas profile before adding more rewards. Field-note saving, further badges and wider habitat mastery remain planned.
5. Reconfirm dated global conservation records and any inaccessible sources. Then handle mobile as a separate phase.

The revised AI Studio prompt pack also resolves conflicting desktop tokens, durable migration records, admin role schema, cross-service registration recovery, and cursor-based source-scan batching. It requires a separate IAM-private worker for scheduled scans and explicit owner permission before publishing.
