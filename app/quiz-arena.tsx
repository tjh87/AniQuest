"use client";

import { useState } from "react";
import { QUIZ_QUESTIONS, type QuizDifficulty } from "./quiz-data";
import { currentAttempts, nextPracticeQuestion, type AnswerHandler, type LearningRecord } from "./learning-records";
import { QuestionChallenge } from "./question-challenge";
import { LearningSummary } from "./learning-summary";

export function QuizArena({ onAnswer, records, level, xp, hintsEnabled, rewardXp, answeredQuizzes }: {
  onAnswer: AnswerHandler; records: LearningRecord[]; level: number; xp: number; hintsEnabled: boolean; rewardXp: number; answeredQuizzes: string[];
}) {
  const recommended: QuizDifficulty = level <= 1 ? "beginner" : level === 2 ? "intermediate" : "advanced";
  const [difficulty, setDifficulty] = useState(recommended);
  const questions = QUIZ_QUESTIONS.filter((q) => q.difficulty === difficulty);
  const [choice, setChoice] = useState(() => nextPracticeQuestion(questions, records));
  const [round, setRound] = useState(0);
  const question = choice.question;
  const attempts = currentAttempts(records, questions).filter((a) => a.phase === "practice");
  const misses = attempts.filter((a) => a.objective === question.objective && !a.correct).length;
  const changeTier = (tier: QuizDifficulty) => { setDifficulty(tier); setChoice(nextPracticeQuestion(QUIZ_QUESTIONS.filter((q) => q.difficulty === tier), records)); setRound((r) => r + 1); };
  return <div className="aq-view aq-quiz-layout">
    <div className="aq-page-title"><div><span className="aq-eyebrow">Quiz Arena</span><h1>Singapore wildlife challenge</h1><p>{QUIZ_QUESTIONS.length} questions · practise a tier and revisit what needs work</p></div><span>{xp} XP · Level {level}</span></div>
    <section className="aq-panel aq-quiz-card">
      <div className="aq-difficulty-tabs" role="group" aria-label="Quiz difficulty">{(["beginner", "intermediate", "advanced"] as const).map((tier) => <button key={tier} aria-pressed={difficulty === tier} className={difficulty === tier ? "active" : ""} onClick={() => changeTier(tier)}><span>{tier}</span>{tier === recommended && <small>Suggested starting tier</small>}</button>)}</div>
      <p>{questions.filter((q) => answeredQuizzes.includes(q.id)).length} of {questions.length} completed · {choice.reason}</p>
      {misses >= 2 && <aside className="aq-hint-copy"><strong>Review suggested: {question.objective}</strong><p>You missed this topic {misses} times. Read the source or use a hint before answering.</p><a href={question.sourceUrl} target="_blank" rel="noreferrer">Review the explanation at {question.source} ↗</a></aside>}
      <QuestionChallenge key={`${question.id}-${round}`} question={question} hintsEnabled={hintsEnabled} onAnswer={onAnswer} onNext={() => { setChoice(nextPracticeQuestion(questions, records, question.id)); setRound((r) => r + 1); }} />
      <p className="aq-muted">First correct completion +{rewardXp} XP. Repeat answers do not add XP. Review follows errors and hint use.</p>
    </section>
    <aside className="aq-quiz-side"><LearningSummary records={records} /></aside>
  </div>;
}
