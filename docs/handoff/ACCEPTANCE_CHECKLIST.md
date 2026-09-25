# Acceptance checklist

Mark passed, failed or not run with environment/evidence. An unchecked list is not a test report.

## Build/content

- [ ] `npm test`, `content:check`, `offline:inventory`, `offline:verify` pass.
- [ ] Counts match modules; no missing profiles, duplicate questions, broken joins or uncredited new media.
- [ ] Editorial changes have truthful audit records, independent of URL reachability.

## Windows release

- [ ] Extract cleanly to a short path and one with spaces on Windows x64.
- [ ] Start as normal user without root development dependencies; browser opens port 5173.
- [ ] Stop/start and occupied-port errors work.
- [ ] Disconnect and repeat profiles, graph, photo viewer, lessons, quiz and calendar.
- [ ] Runtime requests stay local until the reader clicks a source link.
- [ ] Bundled Node/npm/licences exist; manifest hashes match.
- [ ] Setup once online then rebuild offline on the same Windows machine.

## Profiles and media

- [ ] Fresh profile starts expanded; individual/all controls and Default view work.
- [ ] Choices persist through navigation/reload; graph survives collapse and resize.
- [ ] Group legends and all related targets are correct.
- [ ] Curves, larger arrowheads and independently coloured outlines/lines remain visible across themes.
- [ ] Zoom/reset/keyboard/Move work without trapping mobile scrolling.
- [ ] Photo cards work if graph initialisation fails.
- [ ] PhotoSwipe fit/zoom/close/Escape/focus return and reduced motion work, with full-frame image and credits.
- [ ] External photos show placeholders and make no image requests.
- [ ] 360/390/768/1440px and 200% text zoom preserve labels and touch targets.

## Learning, dates and boundaries

- [ ] Wrong/right/hinted answers retain evidence; duplicate submissions do not duplicate XP.
- [ ] Incomplete checks do not fabricate comparisons; local saves survive restart.
- [ ] Old saves and storage failures remain handled.
- [ ] Dated sessions, seasonal patterns and undated listings stay distinct; ICS times/escaping work.
- [ ] Local `/room` explanation remains; protected APIs are not exposed.
- [ ] No credentials, private browser data or hosted-site tokens in ZIP/Git.

## Publish

- [ ] Review diff, preserve history, publish only with current authorization.
- [ ] Verify remote commit and final ZIP/hash.
- [ ] Report media, OS/browser verification and content freshness limits honestly.
