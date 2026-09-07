# Dashboard and evidence checks — 7 September 2026

## Layout

- Learning activity starts beside the encounter box on desktop.
- The encounter box uses content height, without a fixed minimum height.
- Spotlight and News Nest follow the rainforest panel with a 10-pixel gap.
- Your learning picture follows these cards, before the habitat guides.
- Mobile puts learning activity immediately after the encounter box.

## Evidence

The follow-up records 122 supported claims from the initial 200 incomplete claims.
The site now has 461 supported profile claims and 78 incomplete claims, across 49 profiles.
This is partial evidence completion, not approval of every profile claim.

Each new record includes source links, a comparison note, the profile hash, and a review date.
Some comparisons need several sources. The review panel now shows each source link.
Earlier review records remain unchanged in the audit trail.

See `profile-evidence-followup-2026-09-07.md` for the remaining claims by profile.

## Checks

- Local type check passed.
- Local production build passed.
- All 10 editorial and learning tests passed.
- Five local server tests passed. The Windows symlink test was skipped because this account cannot create symlinks.
- Classic and Pixelated modes were checked with light and dark colours.
- Desktop and 390-pixel mobile checks measured 10-pixel gaps between the main sections.
- Mobile checks found no horizontal page overflow.
- Keyboard focus remained visible.
- Animal photos loaded and retained `filter: none` across theme changes.
- The local colugo profile displayed 11 supported claims and multiple review source links.
- The browser reported no console errors during the final check.

The build still warns about a JavaScript chunk larger than 500 kB. This did not prevent the local launch.
No commit, remote push, or publication was made.
