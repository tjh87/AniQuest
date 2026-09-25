import contentIndex from "./content-index.json";
import reviewData from "./content-reviews.json";

export type ClaimReview = { contentId: string; claim: string; hash: string; sourceUrl: string; additionalSources?: string[]; status: "supported" | "needs-correction" | "unverified"; reviewer: string; note: string; reviewedAt: string };
export const PROFILE_CLAIMS = ["identification", "diet", "activity", "behaviour", "singapore", "reproduction", "ecologicalRole", "pressures", "watch", "singaporeStatus", "globalStatus"];
export function claimReviewStatus(review: ClaimReview | undefined, hash: string | undefined, now = Date.now()) {
  if (!review) return "Not reviewed";
  if (review.hash !== hash) return "Content changed — review again";
  if (now - Date.parse(review.reviewedAt) > 30 * 86400000) return "Review due";
  return { supported: "Source support recorded", "needs-correction": "Correction needed", unverified: "Support not confirmed" }[review.status];
}
const titleCase = (value: string) => value.replace(/([A-Z])/g, " $1").trim().replace(/\b\w/g, letter => letter.toUpperCase());

export function ContentReviewNote({ contentId, claims = ["question", "explanation"], embedded = false }: { contentId: string; claims?: string[]; embedded?: boolean }) {
  const record = (contentIndex as Record<string, { hash: string; revision: number; recordedAt: string }>)[contentId];
  const reviews = reviewData as ClaimReview[];
  const outcomes = claims.map(claim => claimReviewStatus(reviews.findLast(r => r.contentId === contentId && r.claim === claim), record?.hash));
  const supported = outcomes.filter(status => status === "Source support recorded").length;
  const unreviewed = outcomes.filter(status => status === "Not reviewed").length;
  const content = <>
    <p>{claims.length - unreviewed} of {claims.length} claims reviewed · {supported} supported · {claims.length - supported - unreviewed} need evidence or a new review.</p>
    <p>{record ? `Editorial revision ${record.revision}. Snapshot: ${record.recordedAt.slice(0, 10)}.` : "Editorial snapshot pending the next build."}</p>
    <p>A working link shows availability, not factual accuracy. These claim checks are separate from automated link checks.</p>
    <ul>{claims.map(claim => { const review = reviews.findLast(r => r.contentId === contentId && r.claim === claim); return <li key={claim}><strong>{titleCase(claim)}: {titleCase(claimReviewStatus(review, record?.hash))}</strong>{review && <><p>{review.note}</p><small>Reviewed: {review.reviewedAt.slice(0, 10)}</small>{[review.sourceUrl, ...(review.additionalSources ?? [])].map((url, index) => <a key={url} href={url} target="_blank" rel="noreferrer">Review source{index ? ` ${index + 1}` : ""} ↗</a>)}</>}</li>; })}</ul>
    <p>Support not confirmed means more evidence is needed. Reviews apply to the recorded content and source dates.</p>
  </>;
  return embedded ? <div className="aq-content-review aq-content-review-embedded">{content}</div> : <details className="aq-content-review"><summary>Content Record and Factual Review</summary>{content}</details>;
}

export function EditorialOverview() {
  const entries = Object.entries(contentIndex);
  const reviews = reviewData as ClaimReview[];
  return <section className="room-panel"><h2>Editorial records and factual review</h2><p>{entries.length} content records have versioned snapshots. Full before-and-after text is in the project’s editorial ledger.</p><p>Snapshots record builds, not every keystroke. They do not prove factual accuracy. Earlier edit history is not reconstructed.</p><p>{reviews.length} claim reviews recorded. A review expires after 30 days or when its content changes.</p><p>Use the documented local editorial commands to record a source check. This page does not grant file-edit access.</p><details><summary>Browse content revisions</summary><ul>{entries.map(([id, record]) => <li key={id}>{id} · revision {record.revision} · {record.recordedAt.slice(0, 10)}</li>)}</ul></details></section>;
}
