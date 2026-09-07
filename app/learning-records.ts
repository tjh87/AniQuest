import { QUIZ_QUESTIONS, type QuizQuestion } from "./quiz-data";
import { GUIDED_QUESTIONS } from "./species-lessons";

export type AttemptContext = { hintUsed: boolean; phase?: "practice" | "pre" | "post"; sessionId?: string; submissionId?: string };
export type Attempt = {
  kind: "attempt"; id: string; questionId: string; questionVersion: number; selected: string; correct: boolean;
  hintUsed: boolean; phase: "practice" | "pre" | "post"; sessionId: string; recordedAt: string;
  speciesIds: string[]; habitats: string[]; objective: string;
};
export type ActionRecord = { kind: "action"; id: string; actionId: "guidance" | "observation"; status: "guidance-opened" | "self-reported"; sessionId: string; recordedAt: string };
export type LearningRecord = Attempt | ActionRecord;
export type AnswerFeedback = { correct: boolean; correctAnswer: string; explanation: string; attempt: Attempt };
export type AnswerHandler = (question: QuizQuestion, answer: string, context: AttemptContext) => Promise<AnswerFeedback | null>;
export const ALL_LEARNING_QUESTIONS = [...QUIZ_QUESTIONS, ...GUIDED_QUESTIONS];
export const RECORD_LIMIT = 500;

export function gradeAnswer(question: QuizQuestion, selected: string, context: AttemptContext, id: string): AnswerFeedback {
  if (!question.answers.some((answer) => answer.value === selected)) throw new Error("Choose one of the listed answers.");
  const correct = selected === question.correctAnswer;
  return { correct, correctAnswer: question.correctAnswer, explanation: question.explanation, attempt: {
    kind: "attempt", id, questionId: question.id, questionVersion: question.version, selected, correct,
    hintUsed: context.hintUsed, phase: context.phase ?? "practice", sessionId: context.sessionId ?? "",
    recordedAt: new Date().toISOString(), speciesIds: question.speciesIds, habitats: question.habitats, objective: question.objective,
  } };
}

export function appendRecord(records: LearningRecord[], record: LearningRecord) {
  return records.some((item) => item.id === record.id) ? records : [...records, record].slice(-RECORD_LIMIT);
}

export function readLearningRecords(value: unknown): LearningRecord[] {
  if (!Array.isArray(value)) return [];
  return value.filter((record): record is LearningRecord => {
    if (!record || typeof record !== "object" || typeof record.id !== "string" || typeof record.sessionId !== "string" || !Number.isFinite(Date.parse(record.recordedAt))) return false;
    if (record.kind === "action") return (record.actionId === "guidance" && record.status === "guidance-opened") || (record.actionId === "observation" && record.status === "self-reported");
    return record.kind === "attempt" && typeof record.questionId === "string" && Number.isInteger(record.questionVersion) && typeof record.selected === "string" && typeof record.correct === "boolean" && typeof record.hintUsed === "boolean" && ["practice", "pre", "post"].includes(record.phase) && Array.isArray(record.speciesIds) && record.speciesIds.every((id: unknown) => typeof id === "string") && Array.isArray(record.habitats) && record.habitats.every((id: unknown) => typeof id === "string") && typeof record.objective === "string";
  }).slice(-RECORD_LIMIT);
}

export function currentAttempts(records: LearningRecord[], questions = ALL_LEARNING_QUESTIONS): Attempt[] {
  return records.filter((record): record is Attempt => record.kind === "attempt" && questions.some((question) => question.id === record.questionId && question.version === record.questionVersion));
}

export function nextPracticeQuestion(questions: QuizQuestion[], records: LearningRecord[], currentId?: string) {
  const attempts = currentAttempts(records, questions).filter((item) => item.phase === "practice");
  const latest = (id: string) => attempts.filter((item) => item.questionId === id).at(-1);
  const candidates = questions.filter((q) => q.id !== currentId);
  // Wait for an intervening answer before revisiting a missed or hinted question.
  const review = candidates.find((q) => { const last = latest(q.id); return last && (!last.correct || last.hintUsed) && attempts.at(-1)?.id !== last.id; });
  if (review) return { question: review, reason: `Review suggested: ${latest(review.id)?.correct ? "you used a hint" : "you missed this question"}.` };
  const unseen = candidates.find((q) => !latest(q.id));
  if (unseen) return { question: unseen, reason: "Try a new question." };
  const oldest = [...candidates].sort((a, b) => (latest(a.id)?.recordedAt ?? "").localeCompare(latest(b.id)?.recordedAt ?? ""))[0];
  return { question: oldest ?? questions[0], reason: "Revisit an earlier question." };
}

export function firstAttemptStats(records: LearningRecord[]) {
  const first = new Map<string, Attempt>();
  for (const attempt of currentAttempts(records).filter((item) => item.phase === "practice")) {
    if (!first.has(attempt.questionId)) first.set(attempt.questionId, attempt);
  }
  const attempts = [...first.values()];
  return { total: attempts.length, correct: attempts.filter((item) => item.correct).length, hinted: attempts.filter((item) => item.hintUsed).length, attempts };
}
