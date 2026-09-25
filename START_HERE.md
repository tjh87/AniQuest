# Start here — AniQuest Windows handover

Package date: 25 September 2026. Repository: https://github.com/tjh87/AniQuest

GitHub publication was blocked by integration write permissions. The complete prepared source is here; `GITHUB_HANDOFF.md` explains the bundled Git history and how to publish it later.

## Run the prepared ZIP

1. Extract **all** files. Do not launch inside the ZIP viewer.
2. Double-click `Start-AniQuest.cmd` in the extracted `AniQuest` folder.
3. Use `http://127.0.0.1:5173` and leave the console open.
4. Browse profiles, expand/minimise sections, use graphs, open local photos and try lessons without internet.
5. Stop with `Ctrl+C` when finished.

The ZIP includes Windows x64 Node.js and prebuilt `dist-local/`. A source-only GitHub download needs `WINDOWS_SETUP.md` first. Native Windows execution must still be checked on your machine; the export was built/tested on Linux.

## Continue in Codex

Open the whole folder as a local project in your installed Codex client, or change into it before starting Codex in a terminal. Retain normal sandbox/approval protections. Paste:

```text
Continue this local AniQuest project. Read AGENTS.md, START_HERE.md,
WINDOWS_SETUP.md, CODEX_BUILD_PROMPTS.md and docs/handoff/CURRENT_STATE.md.
Use the Master continuation prompt as the brief, then apply Prompt 01.
Preserve the 141 profiles, 873 questions, full-frame photos, PhotoSwipe,
Cytoscape graphs and expanded profile defaults. Work from these files,
not unavailable past chats. Run local checks and report the next concrete
improvement from docs/handoff/ROADMAP.md. Do not deploy to Sites or push
remotely unless I authorize it in this session.
```

The app needs no AI. Cloud model assistance needs internet; a compatible local provider/model must be prepared separately for offline AI development. No Codex credentials, API keys or model weights are included.

Keep source, `runtime/`, `dist-local/`, `scripts/`, `public/`, tests, docs, lockfile and launchers together. The prepared ZIP's `PACKAGE_MANIFEST.json` lists hashes, excluding itself.

There are 51 bundled photos. Another 90 profiles keep their credits/source links with a placeholder. **Default view** restores all profile sections to expanded if you previously minimised them.
