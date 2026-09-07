import { QUIZ_QUESTIONS } from "./quiz-data";
import { VIEW_LABELS } from "./view-data";
import { readLearningRecords, type LearningRecord } from "./learning-records";

export const LOCAL_PROGRESS_KEY = "aniquest-local-progress-v1";
export type LocalProgress = { xp: number; level: number; streakDays: number; completedLessons: string[]; answeredQuizzes: string[]; quizBest: number; lastView: string; learningRecords?: LearningRecord[] };
type StorageLike = Pick<Storage, "getItem" | "setItem">;

export function readLocalProgress(storage: StorageLike): { progress?: LocalProgress; error?: string } {
  try {
    const raw = storage.getItem(LOCAL_PROGRESS_KEY);
    if (!raw) return {};
    const value = JSON.parse(raw);
    if (value.version !== 1 || !value.progress || typeof value.progress !== "object") throw new Error("Invalid local record");
    const p = value.progress;
    if (!["xp", "level", "streakDays", "quizBest"].every((key) => Number.isSafeInteger(p[key]) && p[key] >= 0) || p.xp > 1_000_000 || p.quizBest > 100 || !Array.isArray(p.completedLessons) || !Array.isArray(p.answeredQuizzes)) throw new Error("Invalid progress");
    const quizIds = new Set(QUIZ_QUESTIONS.map((q) => q.id));
    return { progress: {
      xp: p.xp, level: Math.floor(p.xp / 250) + 1, streakDays: p.streakDays, quizBest: p.quizBest,
      completedLessons: p.completedLessons.includes("rainforest-01") ? ["rainforest-01"] : [],
      answeredQuizzes: [...new Set<string>(p.answeredQuizzes.filter((id: unknown): id is string => typeof id === "string" && quizIds.has(id)))],
      lastView: Object.hasOwn(VIEW_LABELS, p.lastView) ? p.lastView : "home",
      learningRecords: readLearningRecords(p.learningRecords),
    } };
  } catch { return { error: "Saved progress could not be read. Existing data has not been replaced." }; }
}

export function writeLocalProgress(storage: StorageLike, progress: LocalProgress): string | null {
  try { storage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify({ version: 1, progress })); return null; }
  catch { return "Progress is not saved: browser storage is unavailable or full."; }
}
