"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LOCAL_PROGRESS_KEY, type LocalProgress } from "./local-progress";
import { createProgressBackup, MAX_BACKUP_BYTES, parseProgressBackup, planProgressImport, readRecoveryBackup,
  type BackupPreferences, type ImportMode, type ProgressBackup } from "./progress-backup";

type Draft = { backup: ProgressBackup; name: string; expectedRaw: string | null };
type Props = {
  progress: LocalProgress;
  preferences: BackupPreferences;
  ready: boolean;
  onImport: (backup: ProgressBackup, mode: ImportMode, includeAppearance: boolean, expectedRaw: string | null) => void;
};

function download(text: string, prefix: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${prefix}-${new Date().toISOString().replaceAll(":", "-")}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ProgressBackupControls({ progress, preferences, ready, onImport }: Props) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [mode, setMode] = useState<ImportMode>("merge");
  const [includeAppearance, setIncludeAppearance] = useState(false);
  const [confirmedReplace, setConfirmedReplace] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [recoveryAvailable, setRecoveryAvailable] = useState(false);
  const request = useRef(0);
  const previewHeading = useRef<HTMLHeadingElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try { setRecoveryAvailable(readRecoveryBackup(window.localStorage) !== null); }
    catch { setRecoveryAvailable(false); }
    return () => { request.current += 1; };
  }, []);
  useEffect(() => { if (draft) previewHeading.current?.focus(); }, [draft]);

  const fail = (cause: unknown) => { setError(true); setMessage(cause instanceof Error ? cause.message : "The backup could not be processed."); };
  const exportProgress = () => {
    try { download(createProgressBackup(progress, preferences), "aniquest-progress"); setError(false); setMessage("Backup download started. Keep the JSON file in a safe folder."); }
    catch (cause) { fail(cause); }
  };
  const chooseFile = async (file: File | undefined) => {
    const id = ++request.current;
    setDraft(null); setMessage(""); setError(false); setConfirmedReplace(false); setIncludeAppearance(false); setMode("merge");
    if (!file) return;
    setBusy(true);
    try {
      if (file.size > MAX_BACKUP_BYTES) throw new Error("Choose a backup no larger than 2 MiB.");
      const text = await file.text();
      if (id !== request.current) return;
      const backup = parseProgressBackup(text);
      const expectedRaw = window.localStorage.getItem(LOCAL_PROGRESS_KEY);
      setDraft({ backup, expectedRaw, name: file.name });
    } catch (cause) { if (id === request.current) fail(cause); }
    finally { if (id === request.current) setBusy(false); }
  };
  let planned: LocalProgress | null = null;
  let planError = "";
  if (draft) {
    try { planned = planProgressImport(progress, draft.backup.progress, mode); }
    catch (cause) { planError = cause instanceof Error ? cause.message : "This backup cannot be merged."; }
  }
  const importProgress = () => {
    if (!draft || !planned || (mode === "replace" && !confirmedReplace)) return;
    try {
      onImport(draft.backup, mode, includeAppearance, draft.expectedRaw);
      setDraft(null); setRecoveryAvailable(true); setError(false);
      setMessage("Progress imported. Download the previous save below if you need to undo this import.");
      fileInput.current?.focus();
    } catch (cause) {
      try { setRecoveryAvailable(readRecoveryBackup(window.localStorage) !== null); } catch { /* Keep the original import error. */ }
      fail(cause);
    }
  };
  const downloadRecovery = () => {
    try {
      const text = readRecoveryBackup(window.localStorage);
      if (!text) throw new Error("No previous save copy is available.");
      download(text, "aniquest-before-import"); setError(false);
      setMessage("Previous save download started. Import that file with Replace to restore it.");
    } catch (cause) { fail(cause); }
  };

  return <section className="aq-panel aq-progress-backup" aria-labelledby="progress-backup-title">
    <div><h2 id="progress-backup-title">Back up your progress</h2><p>Keep your learning progress when you change browsers or computers. Files stay on your device.</p></div>
    <div className="aq-backup-actions">
      <Button type="button" onClick={exportProgress} disabled={!ready || busy}><Download aria-hidden="true" />Export progress</Button>
      <label className="aq-backup-file">Choose a backup to import
        <input ref={fileInput} type="file" accept=".json,application/json" disabled={!ready || busy}
          aria-describedby="progress-backup-limit" onChange={(event) => { const file = event.currentTarget.files?.[0]; event.currentTarget.value = ""; void chooseFile(file); }} />
      </label>
      {recoveryAvailable && <Button type="button" variant="outline" onClick={downloadRecovery}><Download aria-hidden="true" />Download previous save</Button>}
    </div>
    <p className="aq-muted" id="progress-backup-limit">JSON files only, up to 2 MiB. Backups include appearance settings and up to 500 learning records.</p>
    {!ready && <p role="status">Your current save is unavailable or still loading. Import and export are paused to protect it.</p>}
    {busy && <p role="status">Reading backup…</p>}
    {draft && <div className="aq-backup-preview">
      <h3 ref={previewHeading} tabIndex={-1}>Review import</h3>
      <p className="aq-backup-filename">{draft.name}</p>
      <p>{draft.backup.exportedAt ? `Exported ${new Date(draft.backup.exportedAt).toLocaleString()}` : "Older local save · appearance settings are not included."}</p>
      <dl className="aq-backup-counts">
        <div><dt>Saved XP</dt><dd>{draft.backup.progress.xp}</dd></div>
        <div><dt>Completed lessons</dt><dd>{draft.backup.progress.completedLessons.length}</dd></div>
        <div><dt>Correct practice questions</dt><dd>{draft.backup.progress.answeredQuizzes.length}</dd></div>
        <div><dt>Learning records</dt><dd>{draft.backup.progress.learningRecords?.length ?? 0}</dd></div>
      </dl>
      {draft.backup.warnings.length > 0 && <ul>{draft.backup.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>}
      <fieldset className="aq-backup-choice"><legend>How should progress be imported?</legend>
        <label><input type="radio" name="progress-import-mode" checked={mode === "merge"} onChange={() => { setMode("merge"); setConfirmedReplace(false); }} /><span><strong>Merge</strong>Keep both sets of activities and the higher XP total. XP totals are not added together.</span></label>
        <label><input type="radio" name="progress-import-mode" checked={mode === "replace"} onChange={() => setMode("replace")} /><span><strong>Replace</strong>Use the progress in this backup. Save a recovery copy first.</span></label>
      </fieldset>
      {draft.backup.preferences && <label className="aq-backup-check"><input type="checkbox" checked={includeAppearance} onChange={(event) => setIncludeAppearance(event.target.checked)} />Also import appearance settings</label>}
      {mode === "replace" && <label className="aq-backup-check"><input type="checkbox" checked={confirmedReplace} onChange={(event) => setConfirmedReplace(event.target.checked)} />I want to replace the current progress with this backup.</label>}
      {planned && <p>After import: {planned.xp} XP, level {planned.level}, {planned.learningRecords?.length ?? 0} learning records. Combined history keeps the latest 500 records.</p>}
      {planError && <p role="alert">{planError}</p>}
      <div className="aq-backup-actions"><Button type="button" onClick={importProgress} disabled={!ready || !planned || (mode === "replace" && !confirmedReplace)}><Upload aria-hidden="true" />{mode === "merge" ? "Merge progress" : "Replace progress"}</Button>
        <Button type="button" variant="outline" onClick={() => { request.current += 1; setDraft(null); setMessage(""); fileInput.current?.focus(); }}>Cancel</Button></div>
    </div>}
    {message && <p role={error ? "alert" : "status"} className={error ? "aq-hint-copy" : "aq-save-state"}>{message}</p>}
  </section>;
}
