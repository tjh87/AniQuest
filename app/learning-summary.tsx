import { speciesById } from "./species-data";
import { currentAttempts, firstAttemptStats, type LearningRecord } from "./learning-records";

export function LearningSummary({ records }: { records: LearningRecord[] }) {
  const stats = firstAttemptStats(records);
  const habitats = [...new Set(stats.attempts.flatMap((attempt) => attempt.habitats))];
  const attempts = currentAttempts(records);
  const sessions = [...new Set(attempts.filter((a) => a.phase === "post").map((a) => a.sessionId))];
  const completed = sessions.map((session) => {
    const sample = (phase: string) => [...new Map(attempts.filter((a) => a.sessionId === session && a.phase === phase).map((a) => [a.questionId, a])).values()];
    return { before: sample("pre"), after: sample("post"), speciesId: sample("post")[0]?.speciesIds[0] };
  }).filter((session) => session.before.length === 3 && session.after.length === 3).at(-1);
  return <section className="aq-panel aq-learning-summary"><h2>Your learning evidence</h2>
    {stats.total ? <p>First recorded answers: <strong>{stats.correct} of {stats.total} correct ({Math.round(stats.correct / stats.total * 100)}%)</strong>. Hints used on {stats.hinted}.</p> : <p>Answer practice questions to start measuring first-attempt accuracy.</p>}
    <p className="aq-muted">Based on the latest 500 records. Earlier completions have no attempt history. Revised questions start a new measurement.</p>
    {habitats.length > 0 && <ul>{habitats.map((habitat) => { const items = stats.attempts.filter((a) => a.habitats.includes(habitat)); return <li key={habitat}>{habitat}: {items.filter((a) => a.correct).length} of {items.length} first answers correct</li>; })}</ul>}
    {completed && <p>Latest journey · {speciesById(completed.speciesId)?.name ?? "Animal"}: <strong>{completed.before.filter((a) => a.correct).length}/3 before → {completed.after.filter((a) => a.correct).length}/3 after</strong>. This measures these questions, not lasting knowledge.</p>}
    <p>Guidance opened: {records.filter((r) => r.kind === "action" && r.status === "guidance-opened").length}. Observation actions reported by you: {records.filter((r) => r.kind === "action" && r.status === "self-reported").length}. These actions are not independently verified.</p>
  </section>;
}
