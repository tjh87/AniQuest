import { ALL_LEARNING_QUESTIONS, RECORD_LIMIT, type LearningRecord } from "./learning-records";
import { LOCAL_PROGRESS_KEY, type LocalProgress } from "./local-progress";
import { QUIZ_QUESTIONS } from "./quiz-data";
import { isAppViewId } from "./view-data";

export const MAX_BACKUP_BYTES = 2 * 1024 * 1024;
export const RECOVERY_KEY = "aniquest-progress-recovery-v1";
export type ImportMode = "merge" | "replace";
export type BackupPreferences = {
  theme: "light" | "dark";
  density: 0 | 1 | 2;
  uiStyle: "classic" | "cute" | "retro";
  pixelPalette: "arcade" | "forest" | "sunset";
};
export type ProgressBackup = {
  progress: LocalProgress;
  preferences?: BackupPreferences;
  exportedAt?: string;
  legacy: boolean;
  warnings: string[];
};
type Store = Pick<Storage, "getItem" | "setItem" | "removeItem">;
type ObjectValue = Record<string, unknown>;
const QUESTIONS = new Map(ALL_LEARNING_QUESTIONS.map((question) => [question.id, question]));
const PRACTICE_IDS = new Set(QUIZ_QUESTIONS.map((question) => question.id));
const PREFERENCE_KEYS = ["aniquest-theme", "aniquest-density", "aniquest-ui-style", "aniquest-pixel-palette"] as const;
const SAVE_KEYS = [LOCAL_PROGRESS_KEY, ...PREFERENCE_KEYS];

function object(value: unknown): ObjectValue {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("The backup contains an invalid record.");
  return value as ObjectValue;
}
function integer(value: unknown, max: number): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0 || value > max) throw new Error("The backup contains a number outside the allowed range.");
  return value;
}
function string(value: unknown, max = 256): string {
  if (typeof value !== "string" || value.length > max) throw new Error("The backup contains invalid text.");
  return value;
}
function strings(value: unknown, limit = 1000, maxLength = 256): string[] {
  if (!Array.isArray(value) || value.length > limit) throw new Error("The backup contains too many items or an invalid list.");
  return value.map((item) => string(item, maxLength));
}
function timestamp(value: unknown): string {
  const text = string(value, 40);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(text) || !Number.isFinite(Date.parse(text))) throw new Error("The backup contains an invalid date.");
  return text;
}
function parseJson(text: string, limit = MAX_BACKUP_BYTES): unknown {
  if (new TextEncoder().encode(text).byteLength > limit) throw new Error("Choose a backup no larger than 2 MiB.");
  try {
    return JSON.parse(text, (key, value) => {
      if (["__proto__", "prototype", "constructor"].includes(key)) throw new Error("Unsupported property");
      return value;
    });
  } catch { throw new Error("This file is not a valid AniQuest backup."); }
}
function preferences(value: unknown): BackupPreferences {
  const p = object(value);
  if (typeof p.theme !== "string" || !["light", "dark"].includes(p.theme) || ![0, 1, 2].includes(p.density as number)
    || typeof p.uiStyle !== "string" || !["classic", "cute", "retro"].includes(p.uiStyle)
    || typeof p.pixelPalette !== "string" || !["arcade", "forest", "sunset"].includes(p.pixelPalette)) throw new Error("The backup contains invalid appearance settings.");
  return { theme: p.theme as BackupPreferences["theme"], density: p.density as BackupPreferences["density"], uiStyle: p.uiStyle as BackupPreferences["uiStyle"], pixelPalette: p.pixelPalette as BackupPreferences["pixelPalette"] };
}
function readRecord(value: unknown): LearningRecord {
  const r = object(value);
  const base = { id: string(r.id), sessionId: string(r.sessionId), recordedAt: timestamp(r.recordedAt) };
  if (!base.id) throw new Error("A learning record has no identifier.");
  if (r.kind === "action") {
    if (r.actionId === "guidance" && r.status === "guidance-opened") return { kind: "action", ...base, actionId: "guidance", status: "guidance-opened" };
    if (r.actionId === "observation" && r.status === "self-reported") return { kind: "action", ...base, actionId: "observation", status: "self-reported" };
    throw new Error("The backup contains an invalid learning action.");
  }
  if (r.kind !== "attempt" || typeof r.correct !== "boolean" || typeof r.hintUsed !== "boolean" || typeof r.phase !== "string" || !["practice", "pre", "post"].includes(r.phase)) throw new Error("The backup contains an invalid answer record.");
  const questionId = string(r.questionId);
  const questionVersion = integer(r.questionVersion, 1_000_000);
  if (!questionVersion) throw new Error("The backup contains an invalid question version.");
  const selected = string(r.selected);
  const speciesIds = strings(r.speciesIds, 32);
  const habitats = strings(r.habitats, 32);
  const objective = string(r.objective, 1000);
  const current = QUESTIONS.get(questionId);
  const sameVersion = current?.version === questionVersion;
  if (sameVersion && (!current.answers.some((answer) => answer.value === selected) || r.correct !== (selected === current.correctAnswer))) throw new Error("An answer does not match its question. Existing progress has not changed.");
  return { kind: "attempt", ...base, questionId, questionVersion, selected, correct: r.correct, hintUsed: r.hintUsed,
    phase: r.phase as "practice" | "pre" | "post",
    speciesIds: sameVersion ? [...current.speciesIds] : speciesIds,
    habitats: sameVersion ? [...current.habitats] : habitats,
    objective: sameVersion ? current.objective : objective };
}
function uniqueRecords(records: LearningRecord[]): LearningRecord[] {
  const byId = new Map<string, LearningRecord>();
  for (const record of records) {
    const previous = byId.get(record.id);
    if (previous && JSON.stringify(previous) !== JSON.stringify(record)) throw new Error("Two learning records share an identifier but contain different answers. Import was cancelled.");
    byId.set(record.id, record);
  }
  return [...byId.values()].sort((a, b) => Date.parse(a.recordedAt) - Date.parse(b.recordedAt) || a.id.localeCompare(b.id));
}
function validateProgress(value: unknown): { progress: LocalProgress; warnings: string[] } {
  const p = object(value);
  const xp = integer(p.xp, 1_000_000);
  integer(p.level, 1_000_001);
  const streakDays = integer(p.streakDays, 36_600);
  const quizBest = integer(p.quizBest, 100);
  const lessons = [...new Set(strings(p.completedLessons))];
  const quizzes = [...new Set(strings(p.answeredQuizzes))];
  const completedLessons = lessons.filter((id) => id === "rainforest-01");
  const answeredQuizzes = quizzes.filter((id) => PRACTICE_IDS.has(id));
  const rawRecords = p.learningRecords === undefined ? [] : p.learningRecords;
  if (!Array.isArray(rawRecords) || rawRecords.length > RECORD_LIMIT) throw new Error(`A backup can contain at most ${RECORD_LIMIT} learning records.`);
  const learningRecords = uniqueRecords(rawRecords.map(readRecord));
  const warnings: string[] = [];
  const unknownActivities = lessons.length + quizzes.length - completedLessons.length - answeredQuizzes.length;
  if (unknownActivities) warnings.push(`${unknownActivities} activity IDs are unavailable in this version and will be left out. Saved XP is retained.`);
  const historical = learningRecords.filter((record) => record.kind === "attempt" && QUESTIONS.get(record.questionId)?.version !== record.questionVersion).length;
  if (historical) warnings.push(`${historical} answer records use other question versions. They are retained outside current scores.`);
  const lastView = string(p.lastView);
  return { progress: { xp, level: Math.floor(xp / 250) + 1, streakDays, quizBest, completedLessons, answeredQuizzes,
    lastView: isAppViewId(lastView) ? lastView : "home", learningRecords }, warnings };
}

export function parseProgressBackup(text: string): ProgressBackup {
  const value = object(parseJson(text));
  const legacy = value.app === undefined && value.schemaVersion === undefined && value.version === 1;
  if (!legacy && (value.app !== "aniquest-progress" || value.schemaVersion !== 1)) throw new Error("This backup format is not supported. Use an AniQuest version 1 backup.");
  const validated = validateProgress(value.progress);
  return { ...validated, legacy, exportedAt: legacy ? undefined : timestamp(value.exportedAt),
    preferences: legacy || value.preferences === undefined ? undefined : preferences(value.preferences) };
}

export function createProgressBackup(progress: LocalProgress, appearance?: BackupPreferences, now = new Date()): string {
  const checked = validateProgress(progress);
  const text = JSON.stringify({ app: "aniquest-progress", schemaVersion: 1, exportedAt: now.toISOString(),
    progress: checked.progress, ...(appearance ? { preferences: preferences(appearance) } : {}) }, null, 2);
  if (new TextEncoder().encode(text).byteLength > MAX_BACKUP_BYTES) throw new Error("This backup exceeds the 2 MiB limit.");
  return text;
}

export function planProgressImport(current: LocalProgress, incoming: LocalProgress, mode: ImportMode): LocalProgress {
  const a = validateProgress(current).progress;
  const b = validateProgress(incoming).progress;
  if (mode === "replace") return { ...b, lastView: "collection" };
  if (mode !== "merge") throw new Error("Choose Merge or Replace.");
  // Legacy saves have no reward ledger. Adding XP could reward the same work twice.
  const xp = Math.max(a.xp, b.xp);
  return { xp, level: Math.floor(xp / 250) + 1, streakDays: Math.max(a.streakDays, b.streakDays), quizBest: Math.max(a.quizBest, b.quizBest),
    completedLessons: [...new Set([...a.completedLessons, ...b.completedLessons])],
    answeredQuizzes: [...new Set([...a.answeredQuizzes, ...b.answeredQuizzes])], lastView: "collection",
    learningRecords: uniqueRecords([...(a.learningRecords ?? []), ...(b.learningRecords ?? [])]).slice(-RECORD_LIMIT) };
}

export function applyProgressImport(storage: Store, current: LocalProgress, backup: ProgressBackup, mode: ImportMode,
  includeAppearance: boolean, expectedRaw: string | null): { progress: LocalProgress; preferences?: BackupPreferences } {
  const progress = planProgressImport(current, backup.progress, mode);
  const appearance = includeAppearance && backup.preferences ? preferences(backup.preferences) : undefined;
  const originals = SAVE_KEYS.map((key) => ({ key, value: storage.getItem(key) }));
  if (originals[0].value !== expectedRaw) throw new Error("Progress changed after the preview. Choose the backup again before importing.");
  // Refuse to replace an unreadable existing save, including an unsupported version.
  if (originals[0].value !== null) parseProgressBackup(originals[0].value);
  try {
    storage.setItem(RECOVERY_KEY, JSON.stringify({ version: 1, createdAt: new Date().toISOString(), items: originals }));
  } catch { throw new Error("The recovery copy could not be saved. Import was cancelled; existing progress has not changed."); }
  const written: typeof originals = [];
  try {
    const updates: { key: string; value: string }[] = appearance ? PREFERENCE_KEYS.map((key, index) => ({ key, value: [appearance.theme, String(appearance.density), appearance.uiStyle, appearance.pixelPalette][index] })) : [];
    updates.push({ key: LOCAL_PROGRESS_KEY, value: JSON.stringify({ version: 1, progress }) });
    for (const update of updates) {
      storage.setItem(update.key, update.value);
      written.push(originals.find((item) => item.key === update.key)!);
    }
  } catch {
    let rollbackFailed = false;
    for (const item of written.reverse()) {
      try { if (item.value === null) storage.removeItem(item.key); else storage.setItem(item.key, item.value); }
      catch { rollbackFailed = true; }
    }
    throw new Error(rollbackFailed ? "Import failed. A recovery copy is available; some appearance settings could not be restored." : "Import could not be saved. Existing progress and appearance settings have not changed.");
  }
  return { progress, preferences: appearance };
}

export function readRecoveryBackup(storage: Pick<Storage, "getItem">): string | null {
  const raw = storage.getItem(RECOVERY_KEY);
  if (!raw) return null;
  // The recovery envelope embeds an escaped copy of the original JSON.
  const saved = object(parseJson(raw, MAX_BACKUP_BYTES * 2 + 4096));
  if (saved.version !== 1 || !Array.isArray(saved.items) || saved.items.length !== SAVE_KEYS.length) throw new Error("The previous save copy could not be read.");
  const values = new Map<string, string | null>();
  for (const item of saved.items) {
    const row = object(item);
    if (!SAVE_KEYS.includes(row.key as string) || (row.value !== null && typeof row.value !== "string") || values.has(row.key as string)) throw new Error("The previous save copy is invalid.");
    values.set(row.key as string, row.value as string | null);
  }
  const previous = values.get(LOCAL_PROGRESS_KEY);
  const progress = previous === null ? { xp: 0, level: 1, streakDays: 0, quizBest: 0, completedLessons: [], answeredQuizzes: [], lastView: "collection", learningRecords: [] } : parseProgressBackup(previous!).progress;
  let appearance: BackupPreferences | undefined;
  try {
    if (PREFERENCE_KEYS.every((key) => values.get(key) !== null)) {
      appearance = preferences({ theme: values.get(PREFERENCE_KEYS[0]), density: Number(values.get(PREFERENCE_KEYS[1])), uiStyle: values.get(PREFERENCE_KEYS[2]), pixelPalette: values.get(PREFERENCE_KEYS[3]) });
    }
  }
  catch { /* A save without complete appearance settings still has recoverable progress. */ }
  return createProgressBackup(progress, appearance, new Date(timestamp(saved.createdAt)));
}
