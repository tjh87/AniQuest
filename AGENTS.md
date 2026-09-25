# AniQuest project rules

- Work locally by default. Do not publish to ChatGPT Sites unless the user explicitly requests it.
- Do not commit, push to GitHub or another remote, or save a remote Site version without asking first and receiving explicit approval for that operation. Approval in another chat does not apply here.
- Keep real animal photographs unchanged when applying UI themes, including Retro mode.
- Never crop an animal from a photograph. Use the complete image with natural height in every view.
- Use source-linked Singapore animal content. Keep confirmed event dates separate from seasonal wildlife patterns and undated organiser listings.
- Give every new animal profile a guided lesson. Add profiles through `SINGAPORE_SPECIES` so the lesson generator creates six source-linked checks automatically. Update the lesson test if the profile schema changes.
- Test light and dark palettes, text wrapping, keyboard focus, and the local run path after UI changes.

## Windows/offline handover

- Read `CODEX_BUILD_PROMPTS.md` and `docs/handoff/CURRENT_STATE.md`. Older documents can contain historical counts and UI decisions.
- Keep default commands local: `npm test`, `npm run build:local`, `npm start`. Cloud `:site` commands need their separate environment.
- Keep the prepared launcher installation-free. Do not add remote fonts, CDNs or background requests to the offline edition.
- Preserve shared profile components, Cytoscape, PhotoSwipe, full-frame images, expanded defaults and later manual section choices.
- Before release run local tests, content check, inventory and offline verification. Report platform limits honestly; Linux tests do not prove native Windows execution.
- Git tracks source, media, docs and lockfile. Release ZIPs additionally contain the build and verified runtime. Never include credentials, private browser saves or root development dependencies.
