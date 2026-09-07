import { SINGAPORE_SPECIES, STATUS_LABELS } from "./species-data";
import { OTTER_QUESTIONS } from "./otter-lesson-data";
import type { QuizQuestion } from "./quiz-data";

function questionVersion(value: unknown) {
  let hash = 2166136261;
  for (const character of JSON.stringify(value)) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  return (hash >>> 0) || 1;
}

type Species = (typeof SINGAPORE_SPECIES)[number];

export function createSpeciesLesson(species: Species, speciesIndex: number, allSpecies = SINGAPORE_SPECIES) {
  const alternatives = allSpecies.filter(s => s.group !== species.group).filter((s, i, all) => all.findIndex(a => a.group === s.group) === i).slice(0, 2);
  const otherStatuses = Object.values(STATUS_LABELS).filter(label => label !== species.singaporeStatus).slice(0, 2);
  const content = [
    { objective: "Recognise the animal", before: `Which description matches ${species.name}?`, after: `You compare an animal with the ${species.name} profile. Which traits should match?`,
      answers: [{ value: species.id, label: species.identification }, ...alternatives.map(s => ({ value: s.id, label: s.identification }))], correctAnswer: species.id,
      explanation: species.identification, sourceUrl: species.sourceUrl, source: species.sourceName ?? "Species reference" },
    { objective: "Interpret national status", before: `What Singapore status does this guide record for ${species.name}?`, after: `You explain the local conservation context of ${species.name}. Which Singapore status should you use?`,
      answers: [{ value: "national", label: species.singaporeStatus }, ...otherStatuses.map((label, i) => ({ value: `other-${i}`, label }))], correctAnswer: "national",
      explanation: `This guide records ${species.singaporeStatus} for Singapore. This does not establish its global status or guarantee a sighting. ${species.statusNote ?? ""}`,
      sourceUrl: species.statusSourceUrl, source: "Singapore status reference" },
    { objective: "Choose a safe response", before: `Which viewing advice applies to ${species.name}?`, after: `You plan an encounter with ${species.name}. Which response follows its profile guidance?`,
      answers: [{ value: "care", label: species.watch }, { value: "feed", label: "Use food to draw the animal closer for a photograph." }, { value: "follow", label: "Follow the animal off the marked path and block its escape." }], correctAnswer: "care",
      explanation: `${species.watch} A lesson does not replace official site restrictions or wildlife advice.`,
      sourceUrl: "https://www.nparks.gov.sg/visit/when-visiting-parks/when-encountering-animals", source: "NParks encounter guidance and linked profile" },
  ];
  const questions: QuizQuestion[] = species.id === "smooth-coated-otter" ? OTTER_QUESTIONS : (["pre", "post"] as const).flatMap((phase, phaseIndex) => content.map((item, index) => {
    const offset = (speciesIndex + index + phaseIndex) % item.answers.length;
    return { id: `${species.id}-${phase}-${index + 1}`, version: questionVersion({ item, habitats: species.habitats }), difficulty: "beginner", emoji: species.emoji, topic: item.objective,
      question: phase === "pre" ? item.before : item.after, answers: [...item.answers.slice(offset), ...item.answers.slice(0, offset)],
      correctAnswer: item.correctAnswer, explanation: item.explanation, hint: "Review the recognition, status and viewing sections of this profile.",
      source: item.source, sourceUrl: item.sourceUrl, speciesIds: [species.id], habitats: species.habitats, objective: item.objective };
  }));
  return { id: species.id, species, questions };
}

export const SPECIES_LESSONS = SINGAPORE_SPECIES.map(createSpeciesLesson);

export const GUIDED_QUESTIONS = SPECIES_LESSONS.flatMap(lesson => lesson.questions);
export function guidedPhase(questionId: string) {
  if (!GUIDED_QUESTIONS.some(q => q.id === questionId)) return undefined;
  return questionId.includes("-pre-") ? "pre" : "post";
}
