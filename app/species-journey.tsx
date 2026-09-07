"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WildlifePhoto } from "./wildlife-photos";
import { SPECIES_LESSONS } from "./species-lessons";
import { currentAttempts, type ActionRecord, type AnswerHandler, type LearningRecord } from "./learning-records";
import { QuestionChallenge } from "./question-challenge";

export function SpeciesJourney({ speciesId, records, onAnswer, onAction, onProfile, onChoose }: {
  speciesId: string; records: LearningRecord[]; onAnswer: AnswerHandler;
  onAction: (actionId: ActionRecord["actionId"], sessionId: string) => Promise<boolean>; onProfile: () => void; onChoose: (id: string) => void;
}) {
  const lesson = SPECIES_LESSONS.find(l => l.id === speciesId) ?? SPECIES_LESSONS[0];
  const { species, questions } = lesson;
  const attempts = currentAttempts(records, questions);
  const [sessionId, setSessionId] = useState(() => attempts.at(-1)?.sessionId || crypto.randomUUID());
  const sample = (phase: "pre" | "post") => [...new Map(attempts.filter(a => a.sessionId === sessionId && a.phase === phase).map(a => [a.questionId, a])).values()];
  const before = sample("pre"), after = sample("post");
  const [step, setStep] = useState<"encounter" | "learn" | "review">(() => after.length === 3 ? "review" : before.length === 3 ? "learn" : "encounter");
  const [index, setIndex] = useState(() => before.length < 3 ? before.length : after.length < 3 ? after.length : 0);
  const [challengeOpen, setChallengeOpen] = useState(after.length > 0 && after.length < 3);
  const [actionMessage, setActionMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const chooseStep = (destination: "encounter" | "learn" | "review") => {
    const targetPhase = destination === "encounter" ? "pre" : "post";
    const answered = sample(targetPhase);
    const nextIndex = questions.filter(q => q.id.includes(`-${targetPhase}-`)).findIndex(q => !answered.some(a => a.questionId === q.id));
    setIndex(nextIndex < 0 ? 0 : nextIndex);
    setChallengeOpen(destination === "learn" && answered.length > 0 && answered.length < 3);
    setStep(destination);
  };
  const phase = step === "encounter" ? "pre" : "post";
  const question = questions.filter(q => q.id.includes(`-${phase}-`))[index];
  const guidance = species.id === "smooth-coated-otter" ? "https://avs.nparks.gov.sg/wildlife/encountering-wildlife/otters/" : "https://www.nparks.gov.sg/visit/when-visiting-parks/when-encountering-animals";
  const recordAction = async (id: ActionRecord["actionId"]) => {
    if (saving) return;
    setSaving(true);
    try { setActionMessage(await onAction(id, sessionId) ? "Action recorded." : "Action could not be saved. Try again."); }
    catch { setActionMessage("Action could not be saved. Try again."); }
    finally { setSaving(false); }
  };
  const next = () => {
    if (index < 2) setIndex(index + 1);
    else { setStep(step === "encounter" ? "learn" : "review"); setIndex(0); setChallengeOpen(false); window.scrollTo({ top: 0 }); }
  };
  const challenge = <section className="aq-panel"><h2>{phase === "pre" ? "Before" : "After"} learning · {index + 1} of 3</h2><p>No hints in these checks. Each answer includes feedback.</p><QuestionChallenge key={`${sessionId}-${question.id}`} question={question} onAnswer={onAnswer} context={{ phase, sessionId }} hintsEnabled={false} onNext={next} nextLabel={index === 2 ? phase === "pre" ? "Read the lesson" : "See my result" : "Next question"} /></section>;
  return <div className="aq-view aq-otter-journey">
    <label className="aq-profile-navigation">Choose a guided animal<select aria-label="Choose a guided animal" value={species.id} onChange={event => onChoose(event.target.value)}>{SPECIES_LESSONS.map(item => <option key={item.id} value={item.id}>{item.species.name}</option>)}</select></label>
    <div className="aq-page-title"><div><span className="aq-eyebrow">Guided wildlife journey · about 5 minutes</span><h1>{species.name}: learn and act</h1><p>Compare traits, connect the animal to its habitat, and choose a responsible response.</p></div><Button variant="outline" onClick={onProfile}>Back to profile</Button></div>
    <ol className="aq-journey-steps" aria-label="Learning journey">{([['encounter', '1 · Encounter and compare'], ['learn', '2 · Learn and answer'], ['review', '3 · Review and act']] as const).map(([id, label]) => <li key={id}><button type="button" aria-current={step === id ? "step" : undefined} onClick={() => chooseStep(id)}>{label}</button></li>)}</ol>
    <p className="aq-muted">Choose any section. Opening a section does not complete its checks.</p>
    {step === "encounter" && <><section className="aq-panel"><h2>Start with careful observation</h2><p>{species.watch}</p><a href={guidance} target="_blank" rel="noreferrer">Official encounter guidance ↗</a><p>Compare this reference photo. AniQuest does not identify uploaded photographs or guarantee a sighting.</p><div className="aq-profile-media"><WildlifePhoto animal={species.id} /></div><p>Use visible traits, habitat and behaviour together. Do not approach the animal to confirm a detail.</p></section>{challenge}</>}
    {step === "learn" && <><section className="aq-panel"><h2>Recognise {species.name}</h2><p>{species.identification}</p><div className="aq-info-grid"><article><h3>Habitat</h3><p>{species.singapore}</p></article><article><h3>Food and activity</h3><p>{species.diet}</p><p>{species.activity}</p></article><article><h3>Behaviour and adaptation</h3><p>{species.behaviour}</p></article><article><h3>Its role in nature</h3><p>{species.ecologicalRole}</p></article></div><h2>Connect the ideas</h2><p>Use the notes above to explain how this animal finds food or shelter in its habitat.</p><details><summary>Read the profile explanation</summary><p>{species.summary}</p><p>{species.ecologicalRole}</p></details><a href={species.sourceUrl} target="_blank" rel="noreferrer">Read the species source ↗</a></section>
      <section className="aq-panel"><h2>Conservation at two scales</h2><div className="aq-profile-status"><div><small>Singapore · {species.statusCode === "UNV" ? "not assessed here" : "RDB3, 2024"}</small><strong>{species.singaporeStatus}</strong><a href={species.statusSourceUrl} target="_blank" rel="noreferrer">National reference ↗</a></div><div><small>Global · separate assessment</small><strong>{species.globalStatus}</strong>{species.globalSourceUrl && <a href={species.globalSourceUrl} target="_blank" rel="noreferrer">Global reference ↗</a>}</div></div><p>{species.pressures}</p>{species.statusNote && <p>{species.statusNote}</p>}<p>Local sightings do not replace a conservation assessment. A local label does not establish the global label.</p></section>
      <section className="aq-panel"><h2>Choose a responsible action</h2><p>{species.watch}</p><a href={guidance} target="_blank" rel="noreferrer">Official viewing guidance ↗</a>{!challengeOpen && <Button onClick={() => setChallengeOpen(true)}>Check what you learned</Button>}</section>{challengeOpen && challenge}</>}
    {step === "review" && <><section className="aq-panel"><h2>What changed?</h2>{before.length === 3 && after.length === 3 ? <p className="aq-journey-score">{before.filter(a => a.correct).length}/3 before → {after.filter(a => a.correct).length}/3 after</p> : <p role="status">No complete comparison yet. Before: {before.length}/3 checks saved. After: {after.length}/3 checks saved.</p>}<ul>{after.map(a => <li key={a.id}>{a.objective}: {a.correct ? "answered correctly after learning" : "needs another review"}</li>)}</ul><p>You can read the lesson first. A later “before” check is not an independent baseline.</p><p>These checks describe this session, not lasting knowledge. Feedback also supports learning.</p><p>Guided checks give no XP. Find the result in your learning records.</p><Button variant="outline" onClick={() => { setSessionId(crypto.randomUUID()); setStep("encounter"); setIndex(0); setChallengeOpen(false); setActionMessage(""); }}>Try a new session</Button></section>
      <section className="aq-panel"><h2>Your next action</h2><p>{species.watch}</p><a href={guidance} target="_blank" rel="noreferrer" onClick={() => void recordAction("guidance")}>Open official viewing and contact guidance ↗</a><p>This link does not submit a sighting. Report an observation action only if you completed it.</p><Button variant="outline" disabled={saving || records.some(r => r.kind === "action" && r.sessionId === sessionId && r.actionId === "observation")} onClick={() => void recordAction("observation")}>I followed the viewing guidance without feeding or disturbing the animal</Button><p>This is a self-report, not independent verification.</p><p role="status">{actionMessage}</p><Button onClick={onProfile}>Explore the full profile</Button></section></>}
  </div>;
}
