import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { mkdtemp, mkdir, copyFile, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false } });
after(() => vite.close());
const backup = await vite.ssrLoadModule("/app/progress-backup.ts");
const local = await vite.ssrLoadModule("/app/local-progress.ts");
const learning = await vite.ssrLoadModule("/app/learning-records.ts");
const { QUIZ_QUESTIONS } = await vite.ssrLoadModule("/app/quiz-data.ts");
const q = QUIZ_QUESTIONS[0];
const nextQuestion = QUIZ_QUESTIONS[1];
const date = "2026-09-25T08:00:00.000Z";
const appearance = { theme: "dark", density: 2, uiStyle: "retro", pixelPalette: "forest" };
const empty = { xp: 0, level: 1, streakDays: 0, quizBest: 0, completedLessons: [], answeredQuizzes: [], lastView: "collection", learningRecords: [] };
const envelope = (progress, preferences) => JSON.stringify({ app: "aniquest-progress", schemaVersion: 1, exportedAt: date, progress, ...(preferences ? { preferences } : {}) });
const parse = (progress, preferences) => backup.parseProgressBackup(envelope(progress, preferences));
const attempt = (id, correct = true, recordedAt = date) => ({
  ...learning.gradeAnswer(q, correct ? q.correctAnswer : q.answers.find(a => a.value !== q.correctAnswer).value, { hintUsed: false }, id).attempt,
  recordedAt,
});
const action = (id, second) => ({ kind: "action", id, actionId: "guidance", status: "guidance-opened", sessionId: "journey-1", recordedAt: new Date(Date.parse(date) + second * 1000).toISOString() });
const stored = (progress) => JSON.stringify({ version: 1, progress });
function memory(progress = empty, initial = {}) {
  const items = new Map(Object.entries(initial));
  if (progress !== null) items.set(local.LOCAL_PROGRESS_KEY, stored(progress));
  const writes = [];
  return { items, writes, getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => { writes.push(key); items.set(key, value); },
    removeItem: (key) => items.delete(key) };
}
function importInto(store, current, incoming, mode = "merge", withAppearance = false) {
  return backup.applyProgressImport(store, current, incoming, mode, withAppearance, store.getItem(local.LOCAL_PROGRESS_KEY));
}

test("versioned exports round-trip progress, learning evidence and appearance", () => {
  const progress = { ...empty, xp: 620, level: 99, streakDays: 3, quizBest: 80, completedLessons: ["rainforest-01"], answeredQuizzes: [q.id], learningRecords: [attempt("answer-1"), action("visit-1", 1)] };
  const before = structuredClone(progress);
  const result = backup.parseProgressBackup(backup.createProgressBackup(progress, appearance, new Date(date)));
  assert.deepEqual(result.progress, { ...progress, level: 3 });
  assert.deepEqual(result.preferences, appearance);
  assert.deepEqual(progress, before, "export must not mutate current progress");
  assert.equal(result.exportedAt, date);
  assert.equal(result.legacy, false);
  assert.deepEqual(result.warnings, []);
});

test("legacy v1 saves import without inventing evidence or appearance", () => {
  const { learningRecords, ...legacy } = { ...empty, xp: 50, answeredQuizzes: [q.id] };
  const result = backup.parseProgressBackup(stored(legacy));
  assert.equal(result.legacy, true);
  assert.equal(result.progress.xp, 50);
  assert.deepEqual(result.progress.learningRecords, []);
  assert.equal(result.preferences, undefined);
  assert.equal(result.exportedAt, undefined);
});

test("malformed, oversized and unsupported backups fail before any save is touched", () => {
  const invalid = ["{broken", "null", "[]", "42", JSON.stringify({ version: 2, progress: empty }),
    JSON.stringify({ app: "aniquest-progress", schemaVersion: 2, exportedAt: date, progress: empty }),
    envelope({ ...empty, xp: -1 }), envelope({ ...empty, xp: 1_000_001 }), envelope({ ...empty, xp: 0.5 }),
    envelope({ ...empty, streakDays: "2" }), envelope({ ...empty, quizBest: 101 }),
    envelope({ ...empty, completedLessons: "rainforest-01" }), envelope({ ...empty, answeredQuizzes: [null] }),
    envelope({ ...empty, learningRecords: null }), envelope({ ...empty, lastView: ["home"] }),
    envelope(empty, { ...appearance, theme: ["dark"] }), envelope(empty, { ...appearance, uiStyle: ["retro"] }),
    envelope(empty, { ...appearance, pixelPalette: ["forest"] }), envelope(empty, { ...appearance, density: "2" }),
    envelope({ ...empty, learningRecords: [null] }), envelope({ ...empty, learningRecords: [attempt("bad", true, "yesterday")] }),
    envelope(empty).replace(date, "not-a-date"),
    envelope(empty).replace('"progress":', '"__proto__":{"polluted":true},"progress":'),
    " ".repeat(backup.MAX_BACKUP_BYTES + 1)];
  const store = memory();
  const before = [...store.items];
  for (const text of invalid) assert.throws(() => importInto(store, empty, backup.parseProgressBackup(text)), Error);
  assert.deepEqual([...store.items], before);
  assert.deepEqual(store.writes, []);
  assert.equal({}.polluted, undefined);
});

test("answer validation rejects mismatches and restores trusted question metadata", () => {
  for (const record of [{ ...attempt("a"), correct: false }, { ...attempt("a"), selected: "invented" }, { ...attempt("a"), phase: ["practice"] }, { ...attempt("a"), questionVersion: 0 }, { ...action("a", 0), status: "self-reported" }]) {
    assert.throws(() => parse({ ...empty, learningRecords: [record] }));
  }
  const record = { ...attempt("a"), speciesIds: ["invented"], habitats: [], objective: "invented" };
  const validated = parse({ ...empty, learningRecords: [record] }).progress.learningRecords[0];
  assert.deepEqual(validated.speciesIds, q.speciesIds);
  assert.deepEqual(validated.habitats, q.habitats);
  assert.equal(validated.objective, q.objective);
});

test("unknown question versions remain outside current scores and unavailable activities are explained", () => {
  const historical = { ...attempt("old"), questionVersion: q.version + 1 };
  const result = parse({ ...empty, xp: 170, completedLessons: ["rainforest-01", "future-lesson"], answeredQuizzes: [q.id, "future-question"], learningRecords: [historical] });
  assert.equal(result.progress.xp, 170);
  assert.deepEqual(result.progress.learningRecords, [historical]);
  assert.equal(learning.currentAttempts(result.progress.learningRecords).length, 0);
  assert.deepEqual(result.progress.completedLessons, ["rainforest-01"]);
  assert.deepEqual(result.progress.answeredQuizzes, [q.id]);
  assert.equal(result.warnings.length, 2);
});

test("merges keep the higher XP and earliest answer evidence without duplicate rewards", () => {
  const first = attempt("first", false);
  const retry = attempt("retry", true, "2026-09-25T08:01:00.000Z");
  const current = { ...empty, xp: 120, completedLessons: ["rainforest-01"], answeredQuizzes: [nextQuestion.id], learningRecords: [first] };
  const incoming = { ...empty, xp: 250, quizBest: 100, streakDays: 2, answeredQuizzes: [q.id], learningRecords: [retry, first] };
  const merged = backup.planProgressImport(current, incoming, "merge");
  assert.equal(merged.xp, 250);
  assert.equal(merged.level, 2);
  assert.equal(merged.quizBest, 100);
  assert.equal(merged.streakDays, 2);
  assert.deepEqual(merged.completedLessons, ["rainforest-01"]);
  assert.deepEqual(merged.answeredQuizzes, [nextQuestion.id, q.id]);
  assert.deepEqual(merged.learningRecords, [first, retry]);
  assert.equal(learning.firstAttemptStats(merged.learningRecords).correct, 0);
  assert.deepEqual(backup.planProgressImport(merged, incoming, "merge"), merged, "re-importing must be idempotent");
  assert.equal(current.learningRecords.length, 1, "planning must not mutate state");
});

test("merged histories keep the latest 500 records and reject conflicting identifiers", () => {
  const current = { ...empty, learningRecords: Array.from({ length: 500 }, (_, i) => action(`record-${i}`, i)) };
  const incoming = { ...empty, learningRecords: [action("newest", 500)] };
  const merged = backup.planProgressImport(current, incoming, "merge");
  assert.equal(merged.learningRecords.length, 500);
  assert.equal(merged.learningRecords[0].id, "record-1");
  assert.equal(merged.learningRecords.at(-1).id, "newest");
  assert.throws(() => parse({ ...current, learningRecords: [...current.learningRecords, action("overflow", 501)] }), /at most 500/);
  assert.throws(() => backup.planProgressImport({ ...empty, learningRecords: [attempt("same", false)] }, { ...empty, learningRecords: [attempt("same", true)] }, "merge"), /share an identifier/);
});

test("replacement saves a recoverable original and survives the existing local reader", () => {
  const current = { ...empty, xp: 620, level: 3, completedLessons: ["rainforest-01"], learningRecords: [attempt("original")] };
  const originalAppearance = { "aniquest-theme": "light", "aniquest-density": "1", "aniquest-ui-style": "cute", "aniquest-pixel-palette": "sunset" };
  const store = memory(current, originalAppearance);
  const result = importInto(store, current, parse({ ...empty, xp: 50, answeredQuizzes: [q.id] }, appearance), "replace", true);
  assert.equal(result.progress.xp, 50);
  assert.deepEqual(result.progress.completedLessons, []);
  assert.deepEqual(result.preferences, appearance);
  assert.deepEqual(local.readLocalProgress(store).progress, result.progress);
  assert.equal(store.getItem("aniquest-theme"), "dark");
  assert.equal(store.getItem("aniquest-ui-style"), "retro");
  assert.equal(store.writes[0], backup.RECOVERY_KEY);
  assert.equal(store.writes.at(-1), local.LOCAL_PROGRESS_KEY);
  const recovered = backup.parseProgressBackup(backup.readRecoveryBackup(store));
  assert.deepEqual(recovered.progress, current);
  assert.deepEqual(recovered.preferences, { theme: "light", density: 1, uiStyle: "cute", pixelPalette: "sunset" });
  const restored = importInto(store, result.progress, recovered, "replace", true);
  assert.deepEqual(restored.progress, current);
  assert.equal(store.getItem("aniquest-theme"), "light");
});

test("appearance imports are opt-in and a first import can recover empty progress", () => {
  const store = memory(null, { "aniquest-theme": "light" });
  const result = importInto(store, empty, parse({ ...empty, xp: 120 }, appearance));
  assert.equal(result.preferences, undefined);
  assert.equal(store.getItem("aniquest-theme"), "light");
  assert.equal(store.getItem("aniquest-density"), null);
  const recovered = backup.parseProgressBackup(backup.readRecoveryBackup(store));
  assert.deepEqual(recovered.progress, empty);
  assert.equal(recovered.preferences, undefined);
});

test("changed or unreadable existing saves are never overwritten by an import", () => {
  const store = memory();
  const preview = store.getItem(local.LOCAL_PROGRESS_KEY);
  store.items.set(local.LOCAL_PROGRESS_KEY, stored({ ...empty, xp: 50 }));
  const changed = [...store.items];
  assert.throws(() => backup.applyProgressImport(store, empty, parse(empty), "replace", false, preview), /changed after the preview/);
  assert.deepEqual([...store.items], changed);
  for (const text of ["broken json", JSON.stringify({ version: 2, progress: empty })]) {
    store.items.set(local.LOCAL_PROGRESS_KEY, text);
    assert.throws(() => importInto(store, empty, parse(empty), "replace"));
    assert.equal(store.getItem(local.LOCAL_PROGRESS_KEY), text);
  }
  assert.deepEqual(store.writes, []);
});

test("a blocked recovery write cancels import before progress or appearance changes", () => {
  const store = memory(empty, { "aniquest-theme": "light" });
  const original = [...store.items];
  const storage = { ...store, setItem: (key, value) => { if (key === backup.RECOVERY_KEY) throw Error("quota"); store.setItem(key, value); } };
  assert.throws(() => importInto(storage, empty, parse({ ...empty, xp: 50 }, appearance), "replace", true), /recovery copy could not be saved/);
  assert.deepEqual([...store.items], original);
  assert.deepEqual(store.writes, []);
});

test("a failed final write rolls appearance back, including originally absent keys", () => {
  const store = memory(empty, { "aniquest-theme": "light" });
  const original = [...store.items];
  const storage = { ...store, setItem: (key, value) => { if (key === local.LOCAL_PROGRESS_KEY) throw Error("quota"); store.setItem(key, value); } };
  assert.throws(() => importInto(storage, empty, parse({ ...empty, xp: 50 }, appearance), "replace", true), /have not changed/);
  assert.deepEqual([...store.items].filter(([key]) => key !== backup.RECOVERY_KEY), original);
  assert.equal(backup.parseProgressBackup(backup.readRecoveryBackup(store)).progress.xp, 0);
});

test("unrecoverable storage failures are explicit and leave a downloadable recovery copy", () => {
  const store = memory(empty, { "aniquest-theme": "light" });
  const storage = { ...store, setItem: (key, value) => {
    if (key === "aniquest-density" || (key === "aniquest-theme" && value === "light")) throw Error("blocked");
    store.setItem(key, value);
  } };
  assert.throws(() => importInto(storage, empty, parse({ ...empty, xp: 50 }, appearance), "replace", true), /some appearance settings could not be restored/);
  assert.equal(store.getItem(local.LOCAL_PROGRESS_KEY), stored(empty));
  assert.ok(backup.readRecoveryBackup(store));
});

test("backup controls expose a labelled file picker and protect loading saves", async () => {
  const { ProgressBackupControls } = await vite.ssrLoadModule("/app/progress-backup-controls.tsx");
  const render = (ready) => renderToStaticMarkup(React.createElement(ProgressBackupControls, { progress: empty, preferences: appearance, ready, onImport: () => {} }));
  const html = render(true);
  assert.match(html, /aria-labelledby="progress-backup-title"/);
  assert.match(html, /Export progress/);
  assert.match(html, /<label[^>]*>Choose a backup to import<input[^>]*type="file"/);
  assert.match(html, /aria-describedby="progress-backup-limit"/);
  assert.doesNotMatch(html, /disabled=""/);
  const loading = render(false);
  assert.equal((loading.match(/disabled=""/g) ?? []).length, 2);
  assert.match(loading, /paused to protect it/);
});

test("portable packages and Git exclude progress downloads at any folder depth", async () => {
  const scratch = await mkdtemp(path.join(tmpdir(), "aniquest-private-backup-"));
  try {
    for (const dir of ["scripts", "dist-local", "runtime/windows-x64", "nested"]) await mkdir(path.join(scratch, dir), { recursive: true });
    await copyFile(path.join(root, "scripts/package-offline.mjs"), path.join(scratch, "scripts/package-offline.mjs"));
    for (const name of ["dist-local/index.html", "runtime/windows-x64/node.exe", "nested/catalogue.json", "aniquest-progress-2026-09-25.json", "nested/aniquest-before-import-2026-09-25.json"]) await writeFile(path.join(scratch, name), "fixture");
    execFileSync(process.execPath, ["scripts/package-offline.mjs"], { cwd: scratch });
    const manifest = JSON.parse(await readFile(path.join(scratch, "portable-stage/AniQuest/PACKAGE_MANIFEST.json"), "utf8"));
    assert.ok(manifest.files.some(file => file.path === "nested/catalogue.json"));
    assert.ok(manifest.files.every(file => !/aniquest-(progress|before-import)-/.test(file.path)));
    const ignored = execFileSync("git", ["check-ignore", "aniquest-progress-example.json", "nested/aniquest-before-import-example.json"], { cwd: root, encoding: "utf8" });
    assert.equal(ignored.trim().split("\n").length, 2);
  } finally { await rm(scratch, { recursive: true, force: true }); }
});
