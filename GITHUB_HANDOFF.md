# GitHub publication handoff

## Status of this export

The first publication attempt on 25 September 2026 failed with **HTTP 403: Resource not accessible by integration**. A later check confirmed write access. The user authorized publication of the prepared source and a README screenshot in this session. See `docs/handoff/GITHUB_UPDATE_2026-09-25.md` for the checks and source provenance. Confirm the remote branch before treating any local copy as published.

The prepared ZIP is usable independently. Its `git-export/AniQuest-source.bundle` contains the repository history and prepared source commit `c46435139fcd122b6a9c143730ed7ec6384c4b5e`. It predates the README screenshot and later publication notes. `git-export/COMMIT.txt` identifies that frozen commit. The bundle contains Git objects, not credentials or local Git configuration. It does not include generated runtime/build files; those are separately included in the ZIP.

## Continue from the bundle without internet

Install Git for Windows before disconnecting if it is not already available. From the extracted AniQuest folder, clone the bundled history into a **new** folder:

```powershell
git clone --branch main .\git-export\AniQuest-source.bundle C:\AniQuest-Source
Set-Location C:\AniQuest-Source
git status
git log -1 --oneline
```

Use a different destination if that folder already exists. This restores source history offline. To run the ready-built app immediately, continue using the original extracted ZIP folder; a source checkout needs the documented build/runtime preparation. To develop offline, retain development dependencies previously installed on the target Windows computer.

## Publish when write access is available

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

Alternatively reconnect the GitHub integration with write access to `tjh87/AniQuest`, then ask Codex to publish this exact prepared update. Do not share passwords or access tokens in chat or add them to project files.

## Future packages

`git-export/` is a frozen handoff snapshot, not a live mirror of edits. Before distributing a later package, regenerate the bundle/commit file from the intended clean committed branch or omit that folder and update this note. The source itself remains authoritative for uncommitted work. Never claim GitHub was updated solely because the bundle exists.
