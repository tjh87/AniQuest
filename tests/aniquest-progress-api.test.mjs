import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const fixture = await mkdtemp(path.join(tmpdir(), "aniquest-server-proof-"));
let sqlite = new DatabaseSync(path.join(fixture, "progress.sqlite"));
sqlite.exec(await readFile(`${root}/drizzle/0000_optimal_reavers.sql`, "utf8"));
sqlite.exec(await readFile(`${root}/drizzle/0005_learning_records.sql`, "utf8"));
globalThis.__learningHeaders = new Headers();
globalThis.__learningD1 = { prepare(query) {
  return { bind(...values) {
    return {
      async raw() { const stmt = sqlite.prepare(query); stmt.setReturnArrays(true); return stmt.all(...values); },
      async all() { return { results: sqlite.prepare(query).all(...values) }; },
      async run() { return { success: true, meta: sqlite.prepare(query).run(...values) }; },
    };
  } };
} };
const vite = await createServer({ configFile: false, root, server: { middlewareMode: true, hmr: false }, plugins: [{
  name: "progress-test-bindings",
  enforce: "pre",
  transform(code, id) {
    if (!id.replaceAll("\\", "/").endsWith("/app/api/progress/route.ts")) return;
    return code.replace('"next/headers"', '"learning-test-headers"');
  },
  resolveId(id, importer) {
    if (!importer?.replaceAll("\\", "/").endsWith("/app/api/progress/route.ts")) return;
    if (id === "../../../db") return "\0learning-db";
    if (id === "learning-test-headers") return "\0learning-headers";
    if (id === "../../site-settings") return "\0learning-settings";
  },
  load(id) {
    if (id === "\0learning-db") return 'import { drizzle } from "drizzle-orm/d1"; export const getDb = () => drizzle(globalThis.__learningD1);';
    if (id === "\0learning-headers") return 'export const headers = async () => globalThis.__learningHeaders;';
    if (id === "\0learning-settings") return 'export const getPublicSiteSettings = async () => ({ quizRewardXp: 50, lessonRewardXp: 120 });';
  },
}] });
after(async () => { await vite.close(); sqlite.close(); await rm(fixture, { recursive: true, force: true }); delete globalThis.__learningD1; delete globalThis.__learningHeaders; });
const { GET, POST } = await vite.ssrLoadModule("/app/api/progress/route.ts");
const { QUIZ_QUESTIONS } = await vite.ssrLoadModule("/app/quiz-data.ts");
const { OTTER_QUESTIONS } = await vite.ssrLoadModule("/app/otter-lesson-data.ts");
const { SPECIES_LESSONS, guidedPhase } = await vite.ssrLoadModule("/app/species-lessons.ts");
const q = QUIZ_QUESTIONS[0];
const post = body => POST(new Request("http://localhost/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }));
const payload = (question, submissionId, answer = question.correctAnswer) => ({ action: "answer_quiz", quizId: question.id, questionVersion: question.version, answer, submissionId, hintUsed: false, phase: "practice", sessionId: "" });

test("server saves wrong answers, grades choices, prevents duplicate XP, and bounds records", async () => {
  assert.equal((await GET()).status, 401);
  globalThis.__learningHeaders = new Headers({ "oai-authenticated-user-id": "test-learner", "oai-authenticated-user-email": "learner@example.test" });
  assert.equal((await GET()).status, 200);
  const wrong = q.answers.find(a => a.value !== q.correctAnswer).value;
  let response = await post({ ...payload(q, "wrong-1", wrong), hintUsed: true, correct: true });
  assert.equal(response.status, 200);
  let body = await response.json();
  assert.equal(body.feedback.correct, false);
  assert.equal(body.feedback.correctAnswer, q.correctAnswer);
  assert.equal(body.feedback.explanation, q.explanation);
  assert.equal(body.progress.xp, 0);
  assert.equal(body.progress.learningRecords[0].hintUsed, true);
  assert.equal(body.progress.learningRecords[0].selected, wrong);
  const firstRecord = body.progress.learningRecords[0];
  body = await (await post(payload(q, "correct-1"))).json();
  assert.equal(body.progress.xp, 50);
  assert.equal(body.progress.learningRecords.length, 2);
  body = await (await post(payload(q, "correct-1"))).json();
  assert.equal(body.progress.xp, 50);
  assert.equal(body.progress.learningRecords.length, 2);
  body = await (await post(payload(q, "correct-2"))).json();
  assert.equal(body.progress.xp, 50);
  assert.equal(body.progress.learningRecords.length, 3);
  assert.equal((await post(payload(q, "correct-1", wrong))).status, 409);
  assert.equal((await post(payload(q, "bad-choice", "fake"))).status, 400);
  assert.equal((await post({ ...payload(q, "stale-question"), questionVersion: 0 })).status, 409);
  assert.equal((await post({ ...payload(q, "bad-phase"), phase: "pre", sessionId: "session" })).status, 400);
  assert.equal((await post(payload(OTTER_QUESTIONS[0], "wrong-context"))).status, 400);
  body = await (await post({ ...payload(OTTER_QUESTIONS[0], "guided-1"), phase: "pre", sessionId: "session" })).json();
  assert.equal(body.progress.xp, 50);
  assert.equal(body.progress.learningRecords.at(-1).phase, "pre");
  const action = { action: "record_action", actionId: "observation", sessionId: "session" };
  body = await (await post(action)).json();
  const count = body.progress.learningRecords.length;
  body = await (await post(action)).json();
  assert.equal(body.progress.learningRecords.length, count);
  assert.equal(body.progress.learningRecords.at(-1).status, "self-reported");
  for (const lesson of SPECIES_LESSONS) for (const question of lesson.questions) {
    response = await post({ ...payload(question, `all-${question.id}`), phase: guidedPhase(question.id), sessionId: `session-${lesson.id}` });
    assert.equal(response.status, 200, question.id);
    const result = await response.json();
    assert.equal(result.feedback.correct, true, question.id);
    assert.equal(result.progress.xp, 50, "Guided checks must not give XP");
  }
  const full = Array.from({ length: 500 }, (_, i) => ({ ...firstRecord, id: `old-${i}` }));
  sqlite.prepare("UPDATE user_progress SET learning_records = ? WHERE user_id = ?").run(JSON.stringify(full), "test-learner");
  body = await (await post(payload(q, "latest"))).json();
  assert.equal(body.progress.learningRecords.length, 500);
  assert.equal(body.progress.learningRecords[0].id, "old-1");
  assert.equal(body.progress.learningRecords.at(-1).id, "latest");
  sqlite.close();
  sqlite = new DatabaseSync(path.join(fixture, "progress.sqlite"));
  body = await (await GET()).json();
  assert.equal(body.progress.learningRecords.at(-1).id, "latest", "Records must survive a database restart");
  assert.equal(body.progress.xp, 50);
  globalThis.__learningHeaders = new Headers({ "oai-authenticated-user-id": "second-learner", "oai-authenticated-user-email": "second@example.test" });
  body = await (await GET()).json();
  assert.equal(body.progress.xp, 0);
  assert.deepEqual(body.progress.learningRecords, []);
});
