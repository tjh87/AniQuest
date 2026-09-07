import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false } });
after(() => vite.close());
const learning = await vite.ssrLoadModule("/app/learning-records.ts");
const { QUIZ_QUESTIONS } = await vite.ssrLoadModule("/app/quiz-data.ts");
const { SINGAPORE_SPECIES } = await vite.ssrLoadModule("/app/species-data.ts");
const q = QUIZ_QUESTIONS[0];
const wrong = q.answers.find(a => a.value !== q.correctAnswer).value;
const attempt = (question, correct, id, hintUsed = false) => learning.gradeAnswer(question, correct ? question.correctAnswer : question.answers.find(a => a.value !== question.correctAnswer).value, { hintUsed }, id).attempt;

test("wrong answers disclose the correct answer and retain attempt evidence", () => {
  const result = learning.gradeAnswer(q, wrong, { hintUsed: true }, "wrong-1");
  assert.equal(result.correct, false);
  assert.equal(result.correctAnswer, q.correctAnswer);
  assert.equal(result.explanation, q.explanation);
  assert.equal(result.attempt.selected, wrong);
  assert.equal(result.attempt.questionVersion, q.version);
  assert.equal(result.attempt.hintUsed, true);
  assert.deepEqual(result.attempt.speciesIds, q.speciesIds);
  assert.deepEqual(result.attempt.habitats, q.habitats);
  assert.ok(Number.isFinite(Date.parse(result.attempt.recordedAt)));
  assert.throws(() => learning.gradeAnswer(q, "not-a-choice", { hintUsed: false }, "invalid"));
});

test("all questions have unique IDs, valid answers, and linked metadata", () => {
  const expected = 27 + SINGAPORE_SPECIES.length * 6;
  assert.equal(learning.ALL_LEARNING_QUESTIONS.length, expected);
  assert.equal(new Set(learning.ALL_LEARNING_QUESTIONS.map(q => q.id)).size, expected);
  for (const question of learning.ALL_LEARNING_QUESTIONS) {
    assert.ok(question.answers.some(a => a.value === question.correctAnswer), question.id);
    assert.ok(question.habitats.length && question.objective && question.version > 0, question.id);
    for (const id of question.speciesIds) assert.ok(SINGAPORE_SPECIES.some(s => s.id === id), `${question.id}: ${id}`);
  }
});

test("each profile has six guided checks with one distinct correct choice", async () => {
  const { SPECIES_LESSONS, createSpeciesLesson, guidedPhase } = await vite.ssrLoadModule("/app/species-lessons.ts");
  assert.equal(SPECIES_LESSONS.length, SINGAPORE_SPECIES.length);
  for (const lesson of SPECIES_LESSONS) {
    assert.equal(lesson.questions.length, 6, lesson.id);
    for (const phase of ["pre", "post"]) assert.equal(lesson.questions.filter(q => guidedPhase(q.id) === phase).length, 3);
    for (const question of lesson.questions) {
      assert.equal(new Set(question.answers.map(a => a.label)).size, question.answers.length, question.id);
      assert.equal(question.answers.filter(a => a.value === question.correctAnswer).length, 1);
      assert.deepEqual(question.speciesIds, [lesson.id]);
      assert.ok(question.explanation.length > 30);
    }
  }

  const futureSpecies = { ...SINGAPORE_SPECIES[0], id: "future-profile", name: "Future profile" };
  const futureLesson = createSpeciesLesson(futureSpecies, SINGAPORE_SPECIES.length, [...SINGAPORE_SPECIES, futureSpecies]);
  assert.equal(futureLesson.questions.length, 6);
  assert.ok(futureLesson.questions.every(q => q.speciesIds[0] === futureSpecies.id));
});

test("review waits for an intervening answer after an error or hint", () => {
  const questions = QUIZ_QUESTIONS.filter(q => q.difficulty === "beginner");
  for (const hinted of [false, true]) {
    const first = attempt(questions[0], hinted, "first", hinted);
    const next = learning.nextPracticeQuestion(questions, [first], questions[0].id);
    assert.notEqual(next.question.id, questions[0].id);
    const second = attempt(next.question, true, "second");
    const review = learning.nextPracticeQuestion(questions, [first, second], next.question.id);
    assert.equal(review.question.id, questions[0].id);
    assert.match(review.reason, hinted ? /hint/ : /missed/);
  }
});

test("first-answer evidence does not inflate after retries or question revisions", () => {
  const records = [attempt(q, false, "first"), attempt(q, true, "retry")];
  assert.equal(learning.firstAttemptStats(records).total, 1);
  assert.equal(learning.firstAttemptStats(records).correct, 0);
  assert.equal(learning.currentAttempts([{ ...records[0], questionVersion: q.version + 1 }]).length, 0);
  assert.equal(learning.appendRecord(records, records[0]).length, 2);
  const bounded = Array.from({ length: 501 }, (_, i) => ({ ...records[0], id: String(i) }));
  assert.equal(learning.readLearningRecords(bounded).length, 500);
  assert.equal(learning.readLearningRecords(bounded)[0].id, "1");
});

test("old local saves retain XP without inventing answer history", async () => {
  const { readLocalProgress } = await vite.ssrLoadModule("/app/local-progress.ts");
  const stored = { version: 1, progress: { xp: 50, level: 1, streakDays: 0, quizBest: 0, completedLessons: [], answeredQuizzes: [q.id], lastView: "quiz" } };
  const result = readLocalProgress({ getItem: () => JSON.stringify(stored) });
  assert.equal(result.progress.xp, 50);
  assert.deepEqual(result.progress.learningRecords, []);
  assert.deepEqual(result.progress.answeredQuizzes, [q.id]);
});

test("biological relatives appear before broad browsing matches", async () => {
  const { relatedProfiles } = await vite.ssrLoadModule("/app/species-explorer.tsx");
  for (const species of SINGAPORE_SPECIES) {
    const relations = relatedProfiles(species);
    assert.ok(relations.every(r => r.item.id !== species.id));
    assert.deepEqual(relations.map(r => r.rank), relations.map(r => r.rank).sort((a, b) => a - b));
    const genus = SINGAPORE_SPECIES.find(s => s.id !== species.id && s.scientific.split(" ")[0] === species.scientific.split(" ")[0]);
    if (genus) assert.equal(relations[0].rank, 0);
  }
});
