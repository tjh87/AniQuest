export const FIELD_SOURCES = {
  birdwatching: { name: "NParks · birdwatching and etiquette", url: "https://www.nparks.gov.sg/visit/activities/birdwatching" },
  trails: { name: "NParks · nature park and reserve rules", url: "https://www.nparks.gov.sg/visit/when-visiting-parks/etiquette/nature-parks-reserve-dos-donts" },
  watch: { name: "NParks · Garden Bird Watch", url: "https://www.nparks.gov.sg/nature/community-in-nature/garden-bird-watch" },
  guide: { name: "NParks · garden bird guide (PDF)", url: "https://www.nparks.gov.sg/-/media/nparks-real-content/about-us/publications/garden_bird_watch_lowres.pdf" },
  raptors: { name: "Bird Society of Singapore · visual raptor guide", url: "https://singaporebirds.com/raptor-guide/" },
  encounters: { name: "NParks · animal encounter guidance", url: "https://www.nparks.gov.sg/visit/when-visiting-parks/when-encountering-animals" },
  chicken: { name: "NParks · red junglefowl", url: "https://www.nparks.gov.sg/florafaunaweb/fauna/2/6/265" },
} as const;

export function FieldSource({ source }: { source: keyof typeof FIELD_SOURCES }) {
  const item = FIELD_SOURCES[source];
  return <a href={item.url} target="_blank" rel="noreferrer">{item.name} ↗</a>;
}

export function FieldResources() {
  return <section className="aq-panel aq-field-resources" aria-labelledby="field-practice-heading">
    <h2 id="field-practice-heading">Try a short observation exercise</h2>
    <p>This is a practice task, not an official survey. Use your notebook; AniQuest does not save field notes.</p>
    <ol>
      <li>Choose a safe place on an open trail. Note your start time and habitat.</li>
      <li>Watch for five minutes without moving towards the animal. Use binoculars if available.</li>
      <li>Write three observed traits. For birds, compare the bill, tail and wing shape.</li>
      <li>List two possible matches. Record one feature that separates them.</li>
      <li>Keep “unidentified” if the evidence is weak. Record your end time and viewing limits.</li>
    </ol>
    <div className="aq-info-grid">
      <article><h3>Listen without playback</h3><p>Listen for rhythm and repeated phrases. Check reference recordings away from wildlife. Do not play calls to attract birds.</p><FieldSource source="birdwatching" /></article>
      <article><h3>Compare birds in flight</h3><p>Record wing shape, tail shape and flight pattern. Check the visual guide before naming a distant raptor.</p><p>View from a safe path. Do not step into roads while watching the sky.</p><FieldSource source="raptors" /></article>
      <article><h3>Leave tracks and nests untouched</h3><p>Photograph signs from the trail. Do not collect feathers, move branches or approach a nest for a better picture.</p><FieldSource source="trails" /></article>
      <article><h3>Use a local reference</h3><p>Compare several traits with the NParks bird guide. Age, sex and viewing angle can affect appearance.</p><p>Older guides can contain older conservation labels. Check the current profile sources for status.</p><FieldSource source="guide" /></article>
    </div>
    <h3>Make notes that another observer can use</h3>
    <p><strong>Observed:</strong> “One bird circled above the water. Its head looked white and its belly looked brown.”</p>
    <p><strong>Possible match:</strong> “Brahminy kite. I did not see its tail clearly.” This is an example, not an identification.</p>
    <p>Record weather, viewing distance and time spent watching. Do not count the same moving bird twice.</p>
    <p>Keep original photos or audio. Remove sensitive nest locations before sharing a record publicly.</p>
    <div className="aq-info-grid">
      <article><h3>Join a trained survey</h3><p>Garden Bird Watch uses volunteer observations to study Singapore’s garden birds.</p><p>Check its current registration and training instructions. Follow the survey method, not this five-minute practice task.</p><FieldSource source="watch" /></article>
      <article><h3>If an animal needs help</h3><p>Keep your distance. Open the official encounter guide for contact advice. Do not catch or handle the animal.</p><p>AniQuest does not send sightings or rescue requests.</p><FieldSource source="encounters" /></article>
    </div>
    <small>Sources checked 7 September 2026. Read the source for current rules and programme dates.</small>
  </section>;
}
