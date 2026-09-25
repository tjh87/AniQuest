"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { createClientId } from "./client-id";
import type { QuizQuestion } from "./quiz-data";
import type { AnswerFeedback, AnswerHandler, AttemptContext } from "./learning-records";
import { ContentReviewNote } from "./content-review";

export function QuestionChallenge({ question, onAnswer, onNext, context, hintsEnabled = true, nextLabel = "Next question" }: {
  question: QuizQuestion; onAnswer: AnswerHandler; onNext: () => void; context?: Omit<AttemptContext, "hintUsed">;
  hintsEnabled?: boolean; nextLabel?: string;
}) {
  const [selected, setSelected] = useState("");
  const [hintOpen, setHintOpen] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inFlight = useRef(false);
  const submissionId = useRef("");
  const feedbackRef = useRef<HTMLDivElement>(null);
  const submit = async () => {
    if (!selected || inFlight.current || feedback) return;
    inFlight.current = true;
    setBusy(true); setError("");
    try {
      if (!submissionId.current) submissionId.current = createClientId();
      const result = await onAnswer(question, selected, { ...context, hintUsed, submissionId: submissionId.current });
      if (!result) { setError("Your answer could not be saved. Try again."); return; }
      setFeedback(result);
      requestAnimationFrame(() => feedbackRef.current?.focus());
    } catch { setError("Your answer could not be saved. Try again."); }
    finally { inFlight.current = false; setBusy(false); }
  };
  return <div className="aq-challenge">
    <h2>{question.question}</h2>
    <fieldset className="aq-answer-list" disabled={busy || !!feedback || !!error}>
      <legend className="sr-only">Choose one answer</legend>
      {question.answers.map((answer, index) => <label key={answer.value} className={`aq-answer-option ${selected === answer.value ? "selected" : ""} ${feedback && answer.value === feedback.correctAnswer ? "correct" : feedback && selected === answer.value ? "wrong" : ""}`}>
        <input type="radio" name={`answer-${question.id}`} value={answer.value} checked={selected === answer.value} onChange={() => setSelected(answer.value)} />
        <span>{String.fromCharCode(65 + index)}. {answer.label}{feedback && answer.value === feedback.correctAnswer && <strong> · Correct answer</strong>}{feedback && !feedback.correct && selected === answer.value && <strong> · Your answer</strong>}</span>
      </label>)}
    </fieldset>
    {hintsEnabled && !feedback && <><button type="button" disabled={busy || !!error} className="aq-power" aria-expanded={hintOpen} aria-controls={`hint-${question.id}`} onClick={() => { setHintOpen(!hintOpen); setHintUsed(true); }}>{hintOpen ? "Hide hint" : "Show a hint"}</button>{hintOpen && <p className="aq-hint-copy" id={`hint-${question.id}`}>{question.hint}</p>}</>}
    {feedback && <div ref={feedbackRef} tabIndex={-1} className={`aq-result ${feedback.correct ? "correct" : "wrong"}`} role="status">
      <strong>{feedback.correct ? "Correct" : "Not quite. Correct answer:"} {!feedback.correct && question.answers.find((answer) => answer.value === feedback.correctAnswer)?.label}</strong>
      <p>{feedback.explanation}</p>
    </div>}
    {error && <p role="alert">{error}</p>}
    <div className="aq-quiz-actions"><Button disabled={busy || (!selected && !feedback)} onClick={feedback ? onNext : () => void submit()}>{busy ? "Saving answer…" : feedback ? nextLabel : "Check answer"}</Button></div>
    <a className="aq-question-source" href={question.sourceUrl} target="_blank" rel="noreferrer">Source: {question.source} ↗</a>
    <ContentReviewNote contentId={`quiz:${question.id}`} />
  </div>;
}
