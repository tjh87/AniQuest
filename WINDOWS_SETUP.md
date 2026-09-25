# Windows setup and offline operation

## Offline capability

| Activity | Requirement |
| --- | --- |
| Run prepared ZIP, profiles, graphs, questions, local saves, bundled photos | No internet or package installation |
| 90 externally hosted profile photos | Source-link placeholder; bytes not bundled |
| Open sources, refresh content, GitHub push/pull | Internet |
| Rebuild with dependencies already installed on this Windows machine | Works offline with unchanged dependencies |
| First install, new dependencies, runtime download | Internet |
| Codex using a hosted model | Service connection |
| Codex using a compatible local provider/model | Separate workstation preparation; not bundled |

The app runs independently of ChatGPT Sites. Retained cloud source does not activate accounts or administration offline.

## Launch

Target: Windows x64 with a modern browser. The ZIP includes **Node.js v22.23.3 for Windows x64**. It is not ARM64-native or 32-bit. No WSL, Python or Bash is needed for local launch/build scripts.

Extract to a short, user-writable path such as `C:\AniQuest`, double-click `Start-AniQuest.cmd`, and use `http://127.0.0.1:5173`. Keep the console open; `Ctrl+C` stops the server.

The launcher prefers `runtime\windows-x64\node.exe`, checks runtime/build availability, then runs `scripts/serve-local.mjs`. It never installs packages or fetches updates. The server binds to loopback, serves only built assets, rejects unsafe paths/hosts and blocks remote runtime resources with a Content Security Policy. It is not a LAN/public server.

Do not open the HTML using `file://`. Use the same origin/port/browser profile to retain access to saved progress.

## Source-only GitHub checkout

With Git for Windows installed:

```powershell
git clone https://github.com/tjh87/AniQuest.git
Set-Location .\AniQuest
```

GitHub's source ZIP is also usable. Source excludes the compiled build, portable runtime and development dependencies.

Install compatible Node.js yourself, or review and run the portable runtime preparation script while online:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\Prepare-Windows-Runtime.ps1
```

This policy applies only to that process, not the machine. The script downloads the official archive and verifies its SHA-256:

```text
2b0ff57b049cda1bbcea2240eec20467018713c1efe1f7360c2681859b90ed71
```

- Archive: https://nodejs.org/dist/v22.23.3/node-v22.23.3-win-x64.zip
- Checksums: https://nodejs.org/dist/v22.23.3/SHASUMS256.txt

It refuses to replace an existing runtime directory. Upgrade version/checksum together after reviewing compatibility, then rebuild and retest.

## Prepare development once while online

Double-click `Setup-Development.cmd`. It uses the bundled runtime when available, runs `npm ci --cache .npm-cache`, then `npm test`. Keep `node_modules` and `.npm-cache` on this machine afterward. Native build packages are platform-specific; do not copy Linux/macOS development dependencies to Windows.

The runtime's own `runtime/windows-x64/node_modules/npm` is separate from root development `node_modules` and must remain in the portable package.

To start a development terminal:

```powershell
$env:Path = "$PWD\runtime\windows-x64;$env:Path"
npm.cmd run dev:local
```

Omit the PATH line when using system Node. `npm.cmd` avoids PowerShell's `npm.ps1` policy issue without changing machine security. Stop the normal launcher first because both use port 5173.

## Rebuild offline

Keep installed dependencies and the lockfile. Run `Build-AniQuest.cmd`, restart the launcher and reload. The build launcher checks TypeScript, builds, regenerates inventory and verifies the output. Before release also run:

```powershell
npm.cmd test
npm.cmd run content:check
npm.cmd run offline:inventory
npm.cmd run offline:verify
```

A complete Windows-specific npm cache may support `npm.cmd ci --offline --cache .npm-cache`; a partial cache is insufficient. Preserve working dependencies before trying this because `npm ci` replaces `node_modules`. New dependency versions require online preparation.

Default scripts are cross-platform. Historical cloud `:site`, database and environment helper commands can require Bash/service bindings and are not part of the offline path.

## Codex on Windows

Open the local project and paste the master prompt in `CODEX_BUILD_PROMPTS.md`. Do not add AI services or keys to AniQuest merely to launch it.

For AI assistance without internet, separately prepare Codex CLI, a supported local provider such as Ollama or LM Studio, and a compatible downloaded model. Hardware and tool-use support vary. The official CLI documents `--oss` and `--local-provider`; verify your installed CLI's `--help`. After that separate preparation, an example is:

```powershell
codex --oss --local-provider ollama --model YOUR_INSTALLED_MODEL
```

Replace the placeholder with an installed model. This AI configuration is not bundled or tested here. Retain sandbox and approval protections.

Official references checked 25 September 2026:

- https://learn.chatgpt.com/docs/windows/windows-sandbox
- https://learn.chatgpt.com/docs/developer-commands?surface=cli

## Local saves

`aniquest-local-progress-v1` stores progress under the browser origin. Other `aniquest-` keys store preferences. These values are not in the app folder/ZIP and do not transfer automatically from the hosted Site.

Clearing browser data or private browsing can remove saves. Use the same browser profile and address. In the updated source/build, open **Collection → Back up your progress → Export progress** and keep the JSON file outside the app folder. The earlier Windows ZIP from 25 September predates these controls; rebuild the updated source first.

To move progress, select the exported file on the destination browser. Review the counts, then choose **Merge** or confirm **Replace**. Merge keeps the higher XP total and the latest 500 learning records; it does not add XP totals. Importing appearance settings is optional. Files must use AniQuest schema 1 or the older local save version 1 and be no larger than 2 MiB.

Each import preserves one previous save in browser storage. **Download previous save** creates a file you can import with **Replace** to undo the last import. This recovery copy is also lost if browser data is cleared, so keep a separate export. Do not publish learning records to GitHub or include them in release packages. Recognised progress download filenames and the root `backups/` folder are excluded automatically.

## Package again

After tests/build and runtime preparation:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\Package-Windows.ps1
```

It verifies, stages `portable-stage\AniQuest`, writes a hash manifest and creates a ZIP under `releases`. It refuses an existing stage; move the prior stage outside `portable-stage` before packaging again. Review staged files for private material. Configuration dotfiles and runtime npm files are retained. Root dependency caches, credentials, Git internals and known temporary directories are excluded.

Extract a new ZIP to a fresh folder and test disconnected on Windows before distribution. A Linux build is not evidence that Windows launchers ran.

## Troubleshooting

| Problem | Action |
| --- | --- |
| Node/build missing | Use the prepared ZIP or complete source setup/build |
| Port 5173 occupied | Stop the previous AniQuest console or identify the owner; do not kill unrelated processes |
| Download blocked | Check source/hash and follow device policy; do not disable Defender/SmartScreen globally |
| npm native package missing offline | Prepare dependencies online on this Windows architecture |
| Progress missing | Check exact origin/browser profile before touching saved data |
| “Photo source online” | Expected for external references; profile text/lessons still work |
| Sections remain collapsed | Click Default view or Expand all |
| Graph hidden | Expand Related profiles, choose Relationship graph and Reset |
| `/room` explanation | Expected: admin needs a separately configured server |
| Stale news/event link | Verify online before editing dates/status; packaging is not a factual refresh |
