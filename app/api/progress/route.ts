import { headers } from "next/headers";
import { and, eq, sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { userProgress } from "../../../db/schema";
import { getPublicSiteSettings } from "../../site-settings";
import { ALL_LEARNING_QUESTIONS, gradeAnswer, readLearningRecords, type AnswerFeedback, type LearningRecord } from "../../learning-records";
import { isAppViewId } from "../../view-data";
import { guidedPhase } from "../../species-lessons";

type ProgressAction =
  | { action: "complete_lesson"; lessonId: string }
  | { action: "answer_quiz"; quizId: string; questionVersion: number; answer: string; hintUsed: boolean; phase: "practice" | "pre" | "post"; sessionId: string; submissionId: string }
  | { action: "record_action"; actionId: "guidance" | "observation"; sessionId: string }
  | { action: "set_last_view"; view: string };

const LESSON_IDS = new Set(["rainforest-01"]);
const XP_PER_LEVEL = 250;

function parseList(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function parseRecords(value: string) {
  try { return readLearningRecords(JSON.parse(value)); } catch { return []; }
}

function appendRecordSql(record: LearningRecord) {
  return sql`(SELECT json_group_array(json(value)) FROM (
    SELECT value FROM (
      SELECT key, value FROM json_each(json_insert(${userProgress.learningRecords}, '$[#]', json(${JSON.stringify(record)})))
      ORDER BY key DESC LIMIT 500
    ) ORDER BY key
  ))`;
}

async function identity() {
  const requestHeaders = await headers();
  const userId = requestHeaders.get("oai-authenticated-user-id");
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedName = requestHeaders.get("oai-authenticated-user-full-name");
  const encoding = requestHeaders.get("oai-authenticated-user-full-name-encoding");
  if (!userId || !email) return null;
  let displayName = email;
  if (encodedName && encoding === "percent-encoded-utf-8") {
    try { displayName = decodeURIComponent(encodedName); } catch { displayName = email; }
  }
  return { userId, email, displayName };
}

function publicProgress(row: typeof userProgress.$inferSelect) {
  return {
    xp: row.xp,
    level: Math.floor(row.xp / XP_PER_LEVEL) + 1,
    streakDays: row.streakDays,
    completedLessons: parseList(row.completedLessons),
    answeredQuizzes: parseList(row.answeredQuizzes),
    quizBest: row.quizBest,
    lastView: row.lastView,
    learningRecords: parseRecords(row.learningRecords),
  };
}

async function getOrCreateProgress() {
  const user = await identity();
  if (!user) return null;
  const db = getDb();
  const [existing] = await db.select().from(userProgress)
    .where(eq(userProgress.userId, user.userId)).limit(1);
  if (existing) return existing;
  const [created] = await db.insert(userProgress).values(user)
    .onConflictDoNothing().returning();
  if (created) return created;
  const [concurrent] = await db.select().from(userProgress)
    .where(eq(userProgress.userId, user.userId)).limit(1);
  return concurrent;
}

export async function GET() {
  try {
    const row = await getOrCreateProgress();
    if (!row) return Response.json({ error: "Sign in required" }, { status: 401 });
    return Response.json({ progress: publicProgress(row) });
  } catch {
    return Response.json({ error: "Progress is temporarily unavailable." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const row = await getOrCreateProgress();
    if (!row) return Response.json({ error: "Sign in required" }, { status: 401 });
    const payload = (await request.json()) as Partial<ProgressAction>;
    const db = getDb();
    const settings = await getPublicSiteSettings();
    let feedback: AnswerFeedback | undefined;

    if (payload.action === "complete_lesson") {
      const lessonId = typeof payload.lessonId === "string" ? payload.lessonId : "";
      if (!LESSON_IDS.has(lessonId)) return Response.json({ error: "Unknown lesson" }, { status: 400 });
      await db.update(userProgress).set({
        xp: sql`${userProgress.xp} + ${settings.lessonRewardXp}`,
        completedLessons: sql`json_insert(${userProgress.completedLessons}, '$[#]', ${lessonId})`,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      }).where(and(
        eq(userProgress.userId, row.userId),
        sql`not exists (select 1 from json_each(${userProgress.completedLessons}) where json_each.value = ${lessonId})`,
      ));
    } else if (payload.action === "answer_quiz") {
      const question = ALL_LEARNING_QUESTIONS.find((q) => q.id === payload.quizId);
      if (!question || !question.answers.some((a) => a.value === payload.answer)) return Response.json({ error: "Unknown question or answer" }, { status: 400 });
      if (payload.questionVersion !== question.version) return Response.json({ error: "This question has changed. Reload the page." }, { status: 409 });
      const phase = payload.phase ?? "practice";
      const sessionId = payload.sessionId ?? "";
      const submissionId = payload.submissionId;
      if (!["practice", "pre", "post"].includes(phase) || typeof payload.hintUsed !== "boolean" ||
        typeof submissionId !== "string" || !/^[a-zA-Z0-9-]{1,80}$/.test(submissionId) ||
        typeof sessionId !== "string" || sessionId.length > 80 ||
        (phase !== "practice" && (!/^[a-zA-Z0-9-]{1,80}$/.test(sessionId) || guidedPhase(question.id) !== phase)) ||
        (phase === "practice" && guidedPhase(question.id))) {
        return Response.json({ error: "Invalid learning context" }, { status: 400 });
      }
      const existing = parseRecords(row.learningRecords).find((record) => record.id === submissionId);
      if (existing) {
        if (existing.kind !== "attempt" || existing.questionId !== question.id || existing.selected !== payload.answer ||
          existing.questionVersion !== question.version || existing.phase !== phase || existing.sessionId !== sessionId || existing.hintUsed !== payload.hintUsed) {
          return Response.json({ error: "This submission was already used. Reload the question." }, { status: 409 });
        }
        feedback = { correct: existing.correct, correctAnswer: question.correctAnswer, explanation: question.explanation, attempt: existing };
      } else {
        feedback = gradeAnswer(question, payload.answer!, { hintUsed: payload.hintUsed, phase, sessionId }, submissionId);
        await db.update(userProgress).set({
          learningRecords: appendRecordSql(feedback.attempt),
          xp: sql`${userProgress.xp} + CASE WHEN ${feedback.correct && phase === "practice" ? 1 : 0} = 1
            AND NOT EXISTS (SELECT 1 FROM json_each(${userProgress.answeredQuizzes}) WHERE value = ${question.id})
            THEN ${settings.quizRewardXp} ELSE 0 END`,
          answeredQuizzes: sql`CASE WHEN ${feedback.correct && phase === "practice" ? 1 : 0} = 1
            AND NOT EXISTS (SELECT 1 FROM json_each(${userProgress.answeredQuizzes}) WHERE value = ${question.id})
            THEN json_insert(${userProgress.answeredQuizzes}, '$[#]', ${question.id}) ELSE ${userProgress.answeredQuizzes} END`,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        }).where(and(eq(userProgress.userId, row.userId),
          sql`NOT EXISTS (SELECT 1 FROM json_each(${userProgress.learningRecords}) WHERE json_extract(value, '$.id') = ${submissionId})`));
      }
    } else if (payload.action === "record_action") {
      if (!["guidance", "observation"].includes(payload.actionId ?? "") || typeof payload.sessionId !== "string" || !/^[a-zA-Z0-9-]{1,80}$/.test(payload.sessionId)) {
        return Response.json({ error: "Invalid action" }, { status: 400 });
      }
      const actionId = payload.actionId!;
      const record: LearningRecord = { kind: "action", id: `${payload.sessionId}-${actionId}`, actionId,
        status: actionId === "guidance" ? "guidance-opened" : "self-reported", sessionId: payload.sessionId, recordedAt: new Date().toISOString() };
      await db.update(userProgress).set({ learningRecords: appendRecordSql(record), updatedAt: sql`CURRENT_TIMESTAMP` })
        .where(and(eq(userProgress.userId, row.userId),
          sql`NOT EXISTS (SELECT 1 FROM json_each(${userProgress.learningRecords}) WHERE json_extract(value, '$.id') = ${record.id})`));
    } else if (payload.action === "set_last_view") {
      const view = typeof payload.view === "string" ? payload.view : "";
      if (!isAppViewId(view)) return Response.json({ error: "Unknown view" }, { status: 400 });
      await db.update(userProgress).set({ lastView: view, updatedAt: sql`CURRENT_TIMESTAMP` })
        .where(eq(userProgress.userId, row.userId));
    } else {
      return Response.json({ error: "Unknown action" }, { status: 400 });
    }

    const [updated] = await db.select().from(userProgress)
      .where(eq(userProgress.userId, row.userId)).limit(1);
    return Response.json({ correct: feedback?.correct ?? true, feedback, progress: publicProgress(updated ?? row) });
  } catch {
    return Response.json({ error: "Progress could not be saved." }, { status: 503 });
  }
}
