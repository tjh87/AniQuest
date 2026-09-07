import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { contentChanges, hashContent } from "../scripts/content-ledger.mjs";
import { validateReview } from "../scripts/review-content.mjs";
import { readFile } from "node:fs/promises";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ configFile: false, root, server: { middlewareMode: true, hmr: false } });
after(() => vite.close());

test("editorial changes preserve before and after, including removed records", () => {
  const before = { "profile:test": { name: "First" }, "quiz:old": { question: "Old" } };
  const after = { "profile:test": { name: "Changed" }, "lesson:new": { title: "New" } };
  const changes = contentChanges(before, after);
  assert.equal(changes.length, 3);
  assert.deepEqual(changes.find(c => c.id === "profile:test").before, before["profile:test"]);
  assert.deepEqual(changes.find(c => c.id === "profile:test").after, after["profile:test"]);
  assert.equal(changes.find(c => c.id === "quiz:old").after, null);
  assert.deepEqual(contentChanges(after, after), []);
});

test("claim review needs a reviewer, a linked source, a real field and a support note", () => {
  const content = { "profile:test": { identification: "Visible traits", sourceUrl: "https://www.nparks.gov.sg/test" } };
  const args = { id: "profile:test", claim: "identification", source: content["profile:test"].sourceUrl, status: "supported", reviewer: "Test reviewer", note: "The linked reference describes these visible traits." };
  const review = validateReview(content, args);
  assert.equal(review.hash, hashContent(content[args.id]));
  assert.equal(review.claimText, "Visible traits");
  const extra = "https://www.nparks.gov.sg/new-evidence";
  assert.throws(() => validateReview(content, { ...args, additionalSources: [extra] }));
  assert.throws(() => validateReview(content, { ...args, newSource: "true", additionalSources: extra }));
  assert.deepEqual(validateReview(content, { ...args, newSource: "true", additionalSources: [extra] }).additionalSources, [extra]);
  for (const source of ["http://example.com", "https://user:secret@example.com"]) assert.throws(() => validateReview(content, { ...args, source, newSource: "true" }));
  for (const invalid of [{ reviewer: "" }, { claim: "missing" }, { source: "https://example.com/unlinked" }, { note: "OK" }, { status: "healthy" }]) assert.throws(() => validateReview(content, { ...args, ...invalid }));
});

test("link availability never creates a factual approval; stale content needs review", async () => {
  const { claimReviewStatus } = await vite.ssrLoadModule("/app/content-review.tsx");
  assert.equal(claimReviewStatus(undefined, "hash"), "Not reviewed");
  const now = Date.now();
  const review = { hash: "hash", reviewedAt: new Date(now).toISOString(), status: "supported" };
  assert.equal(claimReviewStatus(review, "hash", now), "Source support recorded");
  assert.match(claimReviewStatus(review, "changed", now), /Content changed/);
  assert.equal(claimReviewStatus(review, "hash", now + 31 * 86400000), "Review due");
});

test("the 78-check follow-up covers every declared profile claim without stale hashes", async () => {
  const { SINGAPORE_SPECIES } = await vite.ssrLoadModule("/app/species-data.ts");
  const { PROFILE_CLAIMS } = await vite.ssrLoadModule("/app/content-review.tsx");
  const reviews = JSON.parse(await readFile(new URL("../app/content-reviews.json", import.meta.url), "utf8"));
  const latest = new Map(reviews.map(review => [`${review.contentId}:${review.claim}`, review]));
  let count = 0;
  for (const species of SINGAPORE_SPECIES) {
    for (const claim of PROFILE_CLAIMS) {
      const review = latest.get(`profile:${species.id}:${claim}`);
      assert.equal(review?.status, "supported", `${species.id}:${claim}`);
      assert.equal(review.hash, hashContent(species), `${species.id}:${claim}: stale hash`);
      assert.equal(review.claimText, species[claim], `${species.id}:${claim}: changed text`);
      if (review.carriedForwardFromHash) {
        const prior = reviews.findLast(r => r.contentId === review.contentId && r.claim === claim && r.hash === review.carriedForwardFromHash);
        assert.equal(prior?.claimText, review.claimText);
        assert.equal(prior?.reviewedAt, review.reviewedAt, "carry-forward must not renew a source review");
        assert.equal(prior?.sourceUrl, review.sourceUrl);
      }
      count++;
    }
  }
  assert.equal(count, SINGAPORE_SPECIES.length * PROFILE_CLAIMS.length);
  const batch = JSON.parse(await readFile(new URL("../docs/editorial/remaining-78-decisions-2026-09-07.json", import.meta.url), "utf8"));
  assert.equal(batch.decisions.filter(d => d.claims === "globalStatus").length, 32);
  assert.equal(batch.decisions.filter(d => d.claims !== "globalStatus").length, 46);
});
