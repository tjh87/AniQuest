# AniQuest: Windows 10 setup

Revision: 6 September 2026. Applies to this ZIP and its included local build.

## First start

1. Install **Node.js 22 LTS**, at least version 22.13. Use the [official Node.js 22 downloads](https://nodejs.org/download/release/latest-v22.x/). For a standard 64-bit Windows 10 PC, select the file ending in **-x64.msi**. Keep **Add to PATH** selected. Node.js is a separate prerequisite; it is not included in this ZIP.
2. Right-click **AniQuest-Local-Project.zip** and choose **Extract All**. A short local path such as `C:\AniQuest` is suitable. Paths with spaces are supported. Keep all extracted files together.
3. Double-click **Start-AniQuest.cmd**. Keep its command window open. The browser should open **http://127.0.0.1:5173**.
4. Select Classic or Pixelated UI, a light or dark theme, and the spacing you prefer. In Pixelated UI, select Arcade blue, Forest green or Sunset amber. Light is the first-visit default. Open Singapore Wild to browse 49 full animal profiles; use the national-status filter for 25 threatened species. Learn, Quiz Arena, News Nest and Wildlife Calendar remain available.
5. Stop the app with **Ctrl+C** in the command window, or close the window. If Command Prompt asks to terminate the batch job, enter **Y**.

Do not open `dist-local/index.html` directly. The included local server loads the app modules and photos. The start file does not install project dependencies or contact a cloud service.

## Internet and saved progress

| Action | Internet needed? | Where data goes |
| --- | --- | --- |
| Start the included app after Node.js is installed | No | Local PC |
| Read included lessons, species, news summaries and calendars | No | Local PC |
| Answer included quizzes | No | This browser's local storage |
| Open a source, registration or organiser link | Yes | The source website |
| Rebuild after a code change | Usually, for dependency installation | Local project files |
| Sign in, use shared settings or scan links through the retained hosted app | Separate server setup | Not enabled by this launcher |

Use the same browser profile and exact address each time. `localhost` and `127.0.0.1` have separate browser storage. Private browsing and browser-data cleanup can remove saved progress. The ZIP contains the program, not your browser progress. A built-in progress backup is a high-priority planned feature.

The local server listens on **127.0.0.1**, not the network. It provides no account or administrator authority. Typing `/room` shows the local limitation page. It does not sign you in as an admin.

## After a source change

1. Stop the running app.
2. Save your source changes.
3. Double-click **Build-AniQuest.cmd**. It runs `npm.cmd ci`, then `npm.cmd run build:local`.
4. Wait for **Build complete**. If a command fails, the window remains open with the error.
5. Double-click **Start-AniQuest.cmd** again. Reload the browser page.

For development with automatic reload, open Command Prompt in the project folder:

```bat
npm.cmd ci
npm.cmd run dev
```

For a manual start of the included build:

```bat
node scripts/serve-local.mjs
```

`npm run build`, `npm test`, and the `:site` commands belong to the retained hosted app and its existing Linux toolchain. For Windows local work, use the supplied `.cmd` files, `typecheck:local`, `build:local` and `test:local-server`. Do not change PowerShell security settings to run these commands; use `npm.cmd` when needed.

## Troubleshooting

| Message or symptom | What to do |
| --- | --- |
| Node.js is not found | Install Node.js with PATH enabled. Close the old command window, then open the start file again. |
| A newer Node.js version is required | Install a current Node.js 22 LTS patch, at least 22.13. |
| The built app is missing | Extract the whole ZIP. If using source only, run Build-AniQuest.cmd. |
| Port 5173 is in use | Close the other AniQuest command window or the known app using that port. The launcher does not stop other programs or silently change the address. |
| The browser does not open | Type `http://127.0.0.1:5173` in the browser while the command window is running. |
| A source page cannot be reached | Check your internet connection and try the original source later. A site block is not proof that the fact is false. |
| Saved progress is missing | Check the browser profile and address. Do not clear browser data. There is no cloud copy in this edition. |
| Build fails during npm installation | Keep the error text. Check internet access and Node.js version. Do not delete the lockfile to force installation. |
| UI is stale after rebuilding | Stop and restart AniQuest, then reload the page. Use Ctrl+F5 if needed. |

## Checks and limits

The included server has checks for app routes, correct file types, missing assets, source-file isolation, Windows-style path escapes, unexpected Host headers and occupied ports. Previous startup checks covered a path with spaces and no `node_modules`. See `PLAN-REVIEW.md` for this expanded release’s final package checks.

These checks ran in Linux. No Windows 10 operating-system or double-click test was available. The app does not require a GitHub connection, a remote Site version or publication.
