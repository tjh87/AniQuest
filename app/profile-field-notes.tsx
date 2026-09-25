import { ExternalLink, ScanEye, SunMoon, Trees, Utensils, Waypoints } from "lucide-react";
import type { SingaporeSpecies } from "./species-data";

export function ProfileFieldNotes({ species }: { species: SingaporeSpecies }) {
  // Keep the complete recorded wording, including cautions and age differences.
  const clues = species.identification.split(/(?<=[.!?])\s+(?=[A-Z])/u).filter(Boolean);
  const facts = [
    { label: "Diet", value: species.diet, icon: Utensils },
    { label: "Activity", value: species.activity, icon: SunMoon },
    { label: "Commonly found in", value: species.habitat, icon: Trees },
    { label: "Family", value: species.family, icon: Waypoints },
  ];
  return <>
    <section className="aq-field-marks" aria-label="Identification clues">
      <div className="aq-field-marks-heading"><ScanEye aria-hidden="true" /><h3>How to recognise it</h3></div>
      <ul>{clues.map((clue, index) => <li key={`${species.id}-${index}`}>{clue}</li>)}</ul>
      <a className="aq-field-source" href={species.sourceUrl} target="_blank" rel="noopener noreferrer">Species reference <ExternalLink aria-hidden="true" /></a>
    </section>
    <dl className="aq-profile-quickfacts" aria-label="Animal facts">{facts.map(({ label, value, icon: Icon }) => <div key={label}>
      <dt><Icon aria-hidden="true" />{label}</dt><dd>{value}</dd>
    </div>)}</dl>
    <div className="aq-profile-encounter"><strong>Local encounter guide</strong><p>{species.rarity}</p></div>
  </>;
}
