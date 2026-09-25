# GitHub publication handoff

## Current publication status

The complete source is published on `tjh87/AniQuest`, branch `main`. The current repository includes all 367 files from the prepared source, plus four later files. The later files add progress backup/restore code, its tests and the publication record.

| Published change | Commit |
| --- | --- |
| Recovered source, 141 profiles and 873 questions | `03cd8be0f905dc0fe6356123be120c19912573a4` |
| Local progress export/import and recovery | `b1885db04ad4521ad54137c207e8aeec74fbcfa8` |
| README with ten feature entries and four dated screenshots | `4c4d09e8929637ed1eff27b43a069aa2db47c8d6` |

See `docs/handoff/GITHUB_UPDATE_2026-09-25.md` for the file comparison. Fetch `main` before continuing work so that later changes are retained.

## Source downloads and portable ZIPs

GitHub contains source, bundled photographs, screenshots, tests, the dependency lockfile, Windows scripts and development prompts. GitHub's **Code → Download ZIP** is a source archive; follow `WINDOWS_SETUP.md` to build it. Generated `dist-local/`, the Windows runtime and installed development dependencies are not tracked in Git. No ready-built Windows ZIP is attached to a GitHub Release as of this check.

The separately prepared Windows ZIPs remain usable independently. Read each package's `git-export/COMMIT.txt` to identify its frozen source. The original ZIP contained `c46435139fcd122b6a9c143730ed7ec6384c4b5e`; the refreshed README package contained `1d41e4b620bc7127caec845fe93be837d931c199`. Both predate the published progress backup feature. Use current GitHub source and rebuild for that feature.

The bundle contains Git objects, not credentials or local Git configuration. It excludes generated runtime/build files; those are separately included in the portable ZIP.

## Continue from the bundle without internet

Install Git for Windows before disconnecting if it is not already available. From the extracted AniQuest folder, clone the bundled history into a **new** folder:

```powershell
git clone --branch main .\git-export\AniQuest-source.bundle C:\AniQuest-Source
Set-Location C:\AniQuest-Source
git status
git log -1 --oneline
```

Use a different destination if that folder already exists. This restores source history offline. To run the ready-built app immediately, continue using the original extracted ZIP folder; a source checkout needs the documented build/runtime preparation. To develop offline, retain development dependencies previously installed on the target Windows computer.

## Publish future local changes

In the cloned source repository, while connected:

```powershell
git remote set-url origin https://github.com/tjh87/AniQuest.git
git fetch origin main
git merge-base --is-ancestor origin/main main
```

If the last command exits with 0, the remote history is contained in the prepared branch. Review the local commit/diff, then publish using your authorized GitHub sign-in through Git's normal credential flow:

```powershell
git push origin main
git ls-remote origin refs/heads/main
```

The returned remote SHA should match the prepared commit. No force push is needed. If ancestry fails, the remote has diverged: preserve both histories and review/merge those changes before pushing. Do not overwrite newer work or change repository visibility.

An authorized GitHub connection can also publish reviewed changes. Do not share passwords or access tokens in chat or add them to project files.

## Future packages

`git-export/` is a frozen handoff snapshot, not a live mirror of edits. Before distributing a later package, regenerate the bundle/commit file from the intended clean committed branch or omit that folder and update this note. The source itself remains authoritative for uncommitted work. Never claim GitHub was updated solely because the bundle exists.
