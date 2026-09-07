# AniQuest: current product plan

Revision: **6 September 2026 — full-width desktop discovery, sourced events and visual statistics**.

This is the current plan for this ZIP. It replaces the earlier cloud-first and forest-green prompt specifications. A planned feature is not a claim that the feature works in this build. The review in `PLAN-REVIEW.md` records the main gaps.

## Goal and limits

Help people recognise Singapore animals, understand habitats and conservation, check evidence, and learn through short lessons and quizzes. Keep the desktop interface compact, consistent and easy to read.

- The animal catalogue and lessons cover Singapore. This edition covers mammals, birds, reptiles and amphibians; no insect or fish profile is included. World animal news is available through an explicit World selector.
- Windows 10 local use is the default. The included build works after Node.js is installed. Source links need internet access.
- Desktop is the current design target. Preserve existing mobile code; full mobile and tablet review remains a later phase.
- Preserve the supplied AniQuest PNG file. Display it through the shared background-removal mask at a consistent 148px square size without a surrounding frame. It is artwork for branding, not a species-identification chart.
- Classic supports light and dark themes. Pixelated supports Arcade blue, Forest green and Sunset amber palettes in light and dark. The Pixelated style changes panels, borders and interface type. Animal photos keep their original appearance; the logo keeps its colours and proportions while its outer white surround is removed in the display component. Text stays selectable and smooth.
- Do not add custom SVG animal illustrations or diagrams. The shared SVG mask may composite the supplied logo for seamless display; it is not a new illustration. Keep the existing functional icon components. Use real, credited animal photos for teaching.
- Do not commit, push, save a remote Site version, publish or deploy unless the user asks and approves that specific action. Earlier approval in another chat does not apply.

## Verified contents of this package

Counts below were read from the current source arrays. They are counts of AniQuest records, not Singapore wildlife totals.

| Content | Current count | Coverage |
| --- | ---: | --- |
| Singapore animal catalogue | 49 | 19 mammals, 16 birds, 10 reptiles, 4 amphibians |
| Expanded animal profiles | 49 | Every catalogue animal has identification, life history, ecology, conservation and sources |
| Animal fun facts | 98 | Two source-linked facts per profile; separate from the daily banner |
| Real local species photos | 3 | Colugo, Oriental pied hornbill, smooth-coated otters |
| Completed lesson content | 1 | Rainforest lesson |
| Quiz questions | 18 | 6 beginner, 6 intermediate, 6 advanced |
| Singapore news stories | 8 | Saved summaries with publisher links |
| World news stories | 6 | Saved summaries with publisher links |
| News source directory | 11 | 5 Singapore, 6 world sources |
| Daily facts | 7 | Deterministic rotation by Singapore date |
| Seasonal wildlife signals | 9 | Approximate activity windows |
| Dated animal-event sessions | 11 | Past and upcoming entries; not all future events |
| Event organiser directory | 4 | AVS, Nature Society, SPCA and ACRES |
| Main learner views | 9 | Shared navigation and themes |

All previous 30 species remain. Fifteen additions deepen coverage of Singapore forest mammals, wetland birds, turtles, a monitor and frogs, including nationally threatened species. See `ANIMAL-CATALOGUE.md` for all 49 species and source links. All have biological profiles and two fun facts. Coverage remains separate: 3 embedded photographs, 24 dated global assessment references and 25 global fields explicitly unverified. Twelve global references were added in this pass: nine for existing animals and three for the new birds. A dated reference is not a claim that every latest assessment was exhaustively checked. Banded bullfrog remains nationally unassigned here because the checked RDB3 amphibian table does not contain a matching row. There are 25 nationally threatened records (VU, EN or CR), not 23 global Endangered assessments.

## What works and what is still planned

| Area | Current local edition | Required next work |
| --- | --- | --- |
| Start and stop | Windows start/build files; local server; prebuilt assets | Test on a real Windows 10 PC |
| Branding | Original PNG; shared seamless 148px display; fixed desktop sidebar | Enlarged-text checks |
| Themes | Visible Classic/Pixelated selector; three Pixelated palettes; light first-visit default; three spacing choices | Continue state and enlarged-text checks as content grows |
| Learn | One lesson, source links and one-time XP | Complete follow-up lessons with genuine learning checks |
| Atlas | 49 full selectable profiles; 98 fun facts; alias/group/encounter and national-status filters | Resolve 25 remaining global evidence gaps; expand licensed photo coverage |
| Search | Common/scientific name, alias and habitat search; group/encounter/national-status filters | Search lessons, sources, events and news; shareable local view URLs |
| Quizzes | Fixed tiers, level recommendation, hints and answers | Balanced reasoning questions; saved attempts, confidence and review schedule |
| Progress | Browser save, XP, level and repeat-award prevention | Export/import, data migration, daily XP, working streak and measured mastery |
| Collection | Nine earned badges based on the current lesson, correct quiz answers and level | Add evidence-reading and field-note badges only when those actions can be recorded honestly |
| Field Lab | Observation and ethics guidance | Private notes, edit/delete and export |
| News | Singapore/World filter; Mothership and MustShareNews included | Editorial queue, article editor, valid optional RSS/Atom import |
| Wildlife calendar | Seasonal signals and separate dated events; category colours; direct source links; filters; ICS export | Event changes, cancellation status, deduplication and review dates |
| Daily fact | Seven source-linked facts selected by Singapore day | Stable fact IDs; refresh an open page at midnight; local editor |
| Accounts | No local username/password accounts | Separate authenticated local-server edition |
| Admin `/room` | Honest server-required page | Local server permission checks and content editors |
| Source checks | Retained server scans the full registry; portable edition does not run it | Local checker, persisted resumable cursor and optional scheduled run |
| Site statistics | No analytics submissions in local mode | Local aggregate reports only after the server edition exists |

The original hosted source is retained. It uses ChatGPT sign-in and D1, not local username/password accounts. It has global settings, fact and source-directory editing, aggregate statistics, audit records and source-link checks. These functions do not become available by starting the portable app. Its admin permission check currently uses a configured server-side email list; a stronger role model remains planned.

## Interface specification

The current source is the visual authority: `app/globals.css`, then `app/interface-design.css`, and the corresponding components. Older green mockups, Georgia headings, 240px sidebars and 80px headers are superseded.

- Classic uses blue and slate semantic tokens. Pixelated uses Arcade blue, Forest green or Sunset amber semantic tokens in light/dark pairs. Keep one token set per selected theme across all views, including forms, tables, charts and admin panels.
- Fixed, non-collapsing desktop sidebar: `13rem`. The learner workspace uses the full remaining desktop width with small fluid gutters; do not restore a narrow centred content cap. Header minimum: `3.75rem`; let it grow when controls wrap. Do not force a fixed text height.
- Make Classic and **Pixelated** visible choices rather than hiding the style in a native menu. Show the Pixel palette control only while Pixelated is active. Light is the first-visit default. Preserve a learner's saved style, palette and theme after selection.
- Compact spacing: `.75rem` gap and `.9rem` card padding. Standard: `1rem` and `1.1rem`. Comfortable: `1.2rem` and `1.3rem`.
- Main text: `1rem`; common labels: at least `.875rem`; secondary metadata: at least `.75rem`. Density changes spacing, not the minimum reading size.
- Use `minmax(0, 1fr)`, `min-width: 0`, content-driven heights, wrapping labels and flexible toolbars. Reduce wasted space without crowding controls.
- Render the original PNG with the shared SVG display mask, removing the outer white surround/frame while preserving the interior scene and white wordmark. No CSS border, opaque tile, rounding or shadow surrounds it. Keep its display at 148 × 148px across themes and densities; do not collapse desktop navigation. Do not recolour, stretch or pixelate the artwork. Full branding and factual photos serve different roles.
- Charts need titles, units, record scope, source dates and a visible text equivalent. The Singapore Wild overview includes group composition and national-threat proportion visuals backed by the profile data and linked methodology. The status chart describes these 49 records only: LC 17, NT 4, VU 2, EN 8, CR 15, NA 2 and “Not assessed here” 1. Its seven rows must sum to 49; VU must remain visible as the catalogue grows. The last label is an editorial unknown, not an official national category. Keep the habitat/photo/status overview expandable above the catalogue so the animal cards are easy to reach.
- Target 1280, 1440 and 1920px desktop widths, fixed sidebar, every Classic and Pixelated palette/theme combination, keyboard focus and 200% text enlargement. Record actual checks; do not mark untested sizes as passed. Follow [W3C reflow guidance](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) and [contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

## Content and learning rules

Each species needs a stable ID, accepted scientific name, common names, Singapore occurrence evidence, native/introduced status, habitats, ecology, visible traits, rarity wording, Singapore assessment and global assessment. Keep each status scope, assessment date, publication year, reference URL and review date separate. An IUCN publication year must not be relabelled as the date the assessment was performed. An unavailable assessment is unknown, not Least Concern.

Maintain the **49 complete profiles** in this edition, covering common, elusive, rare and well-known Singapore animals. No insects or fish should be added under the current scope. Each profile includes two playful but readable source-linked fun-fact cards. Verify taxonomy, local occurrence, assessment scope and image rights before adding further animals. A logo animal is not automatically a catalogue record. In particular, the NParks mammal list records Variable/Finlayson's squirrel as introduced; do not label every pictured animal native. See the [NParks mammal list](https://www.nparks.gov.sg/nature/species-list/terrestrial-mammals).

The next question-bank target is **60 reviewed questions**, 20 per tier. This is a target, not the current count. Write original questions from source facts. Do not copy commercial question banks. Every item needs one supported answer, plausible alternatives, an explanation, a hint, topic and habitat tags, source evidence and a review date. Advanced questions should test evidence, uncertainty and decisions, not only difficult numbers.

Proposed four-week path: three 10–15 minute sessions each week.

| Week | Subject | Learn | Check |
| --- | --- | --- | --- |
| 1 | Forest and canopy | Animal traits, forest layers, gliding and feeding | Recognise traits; explain one adaptation |
| 2 | Mangroves and freshwater | Otters, monitors, food webs and animal signs | Compare habitats; separate an observation from an inference |
| 3 | Coast and conservation | Turtles, shore animals, migration and status scopes | Compare Singapore and global assessments |
| 4 | Urban coexistence and evidence | Common birds/mammals, safe viewing, news and source checks | Evaluate a report and complete a mixed review |

Only the first rainforest lesson is complete today. The remaining path requires sourced lesson records and assessment content.

## News, facts and events

Singapore news sources: NParks, CNA, The Straits Times, Mothership and MustShareNews. World sources: AP, Reuters, The Guardian, Mongabay, Science News and NOAA Fisheries. These directory links are not proof of RSS availability. Use publisher permission and actual feed endpoints before importing.

Keep a short original summary, publisher, direct article URL, publication date, event date when known, learning point and review date. Store imported records as drafts. Keep duplicate reports linked to one event where useful. A successful HTTP request does not confirm the claim.

Use NParks/AVS, Nature Society Singapore, ACRES, SPCA and relevant organisers for event verification. Confirm the specific session, date, time, venue and registration link at the organiser page. Preserve archived records. Mark cancellation, postponement and full registration separately. Never invent recurring dates from a general programme page. [NParks events](https://www.nparks.gov.sg/visit/events) is a starting directory, not proof of a particular session.

Use `Asia/Singapore` for display and date boundaries. Store timed sessions with explicit offsets or UTC timestamps. Store all-day events as dates. Seasonal patterns are approximate and must stay in their own tab. ICS export is a calendar file, not event registration or a live subscription.

Daily facts rotate in a stable cycle by Singapore date. Admin edits affect a reviewed fact pool. Add preview, effective date and an optional dated override. Keep a local preference separate from a global setting.

## Next local-server edition: proposed architecture

Preserve the simple portable edition. Add a separately launched local server when implementing accounts and admin. Use the existing React UI with a server adapter and a local SQLite database. Choose and test a Node/SQLite combination on Windows before claiming support. Never put the database in the public build folder.

| Store | Important fields and rules |
| --- | --- |
| Users | Stable user ID, normalised login ID, display name, password hash, enabled state, role |
| Sessions | Hashed random session token, user reference, expiry and revocation |
| Content | Stable ID, revision, draft/published state, source references, review date |
| Progress awards | Unique user/kind/content-version award; XP value recorded at award time |
| Attempts | Question version, selected option, correctness, hint use, confidence, Singapore date |
| Field notes | Owner, date, general habitat, observation, uncertainty; optional private photo |
| Settings | Version, appearance defaults, facts, feeds, rewards and review interval |
| Audit | Actor, action, changed groups, before/after version and time; no secrets |
| Source checks | Canonical URL, checked time, result class, failure count, scan cursor and owned lease |

Provide real login-ID/password authentication, account isolation and server-authorised `/room` access. A hidden route and localStorage role flags are not security. Use maintained password hashing and session handling. A PC owner who can read or modify local files remains outside this application's security boundary. See [OWASP authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) and [password storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).

Admin tabs: Overview, Content, Learning, Events, News sources, Analytics, Source health, Appearance and Audit. Add versioned drafts, preview, validation, explicit global publish and conflict handling. Admin changes must not silently overwrite another admin's revision. Show data scope and real counts; do not call section opens unique visitors.

Automatic link checks need a real scheduler. On Windows, a proposed Task Scheduler job can invoke a local checker without opening the UI. It must be opt-in, run with the user's account and resume safely after the PC was off. The current ZIP does not install this job. [Microsoft Task Scheduler](https://learn.microsoft.com/en-us/windows/win32/taskschd/task-scheduler-start-page) provides the operating-system mechanism.

The checker must use reviewed hosts, validate DNS addresses and redirects, limit requests and classify blocked/rate-limited sources for review. The retained server now checks the full registry instead of truncating at 96, sizes its lease to the bounded request workload and guards writes/releases with the owning start timestamp. A future local checker should additionally persist a resumable cursor and renew its lease. Exercise ownership races against the actual database before production use. Source results must not delete content automatically. See [OWASP SSRF guidance](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html).

## Delivery order

| Phase | Work | Exit condition |
| --- | --- | --- |
| A: current package | 49 complete profiles, 98 fun facts, 25 nationally threatened records, national-status filters, seamless logo, Windows guide and reviewed sources | ZIP opens; included local build starts; tests report their true scope |
| B: deepen the learning core | 60 reviewed questions, lesson path, correct metrics; dated global assessments and licensed photos for more profiles | All content has evidence; every active control works |
| C: keep local data safe | Progress backup/restore, migrations, private notes, dated review state | Round-trip backup works and invalid imports leave data intact |
| D: local accounts and admin | Local database, username/password, sessions, content editors and audit | Cross-user/admin denial and concurrent writes tested on Windows |
| E: current-source operations | News/event review queues, complete link scans, optional monthly schedule | Freshness labels and missed-run recovery verified |
| F: later options | Mobile review, optional cloud/Firebase port, optional AI image assistance | Separate scope and explicit deployment approval |

The Google AI Studio prompt pack is an authoring route. It does not require adding Gemini to the running app. Its official documentation supports React/Node web work and ZIP export; account integrations still need feature-specific implementation and tests. See [Google AI Studio Build](https://ai.google.dev/gemini-api/docs/aistudio-build-mode).

## Release gates

- Build the portable app and test it from an extracted ZIP with no dependencies installed.
- Confirm the supplied logo and all three photos load. Compare the logo PNG bytes with the supplied original; inspect the seamless display separately. Check all 49 profile selections and 98 fun-fact sources. Verify the threatened filter returns the VU/EN/CR union, exact-category filters and reset remain consistent, and the chart includes every populated category.
- Verify species/question/news/event counts from data, never from a screenshot.
- Verify local progress survives restart; new users start at 0 XP and level 1.
- Check every theme/palette combination and text containment. Do not claim a full accessibility audit from colour calculations alone.
- Report Windows tests, browser tests, source checks and security checks separately.
- Keep release notes, the setup guide, plan, prompts and source policy together in the ZIP.
