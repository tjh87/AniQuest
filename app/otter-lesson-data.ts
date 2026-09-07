import type { QuizQuestion } from "./quiz-data";

export const OTTER_SOURCE = "https://avs.nparks.gov.sg/wildlife/encountering-wildlife/otters/";
export const OTTER_PROFILE_SOURCE = "https://biodiversitysg.nparks.gov.sg/our-biodiversity/mammals/other-mammals/smooth-coated-otter/";
export const OTTER_LESSON_VERSION = 1;

// Parallel prompts test the same objectives before and after the lesson.
const pairs = [
  { objective: "Recognise an otter", topic: "Recognition", pre: "Which set of traits best supports an otter identification?", post: "An animal swims beside a canal. Which traits fit an otter?", answers: [{ value: "otter", label: "Fur, webbed feet and a streamlined body" }, { value: "monitor", label: "Scales, claws and a forked tongue" }, { value: "turtle", label: "A shell and a toothless beak" }], correctAnswer: "otter", explanation: "Otters are furred mammals with webbed feet and streamlined bodies. Compare several traits before choosing a profile." },
  { objective: "Interpret conservation status", topic: "Conservation", pre: "You often see smooth-coated otters. What does that tell you about their Singapore conservation status?", post: "Several otter sightings appear online. Which conclusion follows?", answers: [{ value: "safe", label: "Frequent sightings mean the species is no longer threatened" }, { value: "check", label: "Sightings alone do not replace a national conservation assessment" }, { value: "global", label: "The local and global statuses must now be identical" }], correctAnswer: "check", explanation: "Smooth-coated otters are nationally Endangered despite regular sightings. Visibility and conservation risk measure different things." },
  { objective: "Choose a safe response", topic: "Responsible observation", pre: "An otter family crosses your path. What should you do?", post: "Otter pups are close to the path. Which response follows AVS guidance?", answers: [{ value: "food", label: "Offer fish to keep the family together" }, { value: "close", label: "Move closer for a clear photograph" }, { value: "space", label: "Give them space and avoid feeding or following them" }], correctAnswer: "space", explanation: "Observe quietly from a distance. Do not feed, chase or corner otters, especially families with pups." },
];

export const OTTER_QUESTIONS: QuizQuestion[] = (["pre", "post"] as const).flatMap((phase) => pairs.map((pair, index) => ({
  id: `otter-${phase}-${index + 1}`, version: OTTER_LESSON_VERSION, difficulty: "beginner", emoji: "🦦", topic: pair.topic,
  question: pair[phase], answers: pair.answers, correctAnswer: pair.correctAnswer, explanation: pair.explanation,
  hint: "Review the otter traits, conservation context and viewing guidance.", source: "AVS Otters in Singapore", sourceUrl: OTTER_SOURCE,
  speciesIds: ["smooth-coated-otter"], habitats: ["Waterways"], objective: pair.objective,
})));
