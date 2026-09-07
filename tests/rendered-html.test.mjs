import assert from "node:assert/strict";
import test from "node:test";
import { unstable_dev } from "wrangler";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

test("renders development preview metadata", async () => {
  const worker = await unstable_dev("dist/server/index.js", {
    config: "dist/server/wrangler.json",
    local: true,
    logLevel: "none",
    persist: false,
    experimental: {
      disableExperimentalWarning: true,
      disableDevRegistry: true,
      testMode: true,
      watch: false,
    },
  });
  try {
    const response = await worker.fetch("http://localhost/", { headers: { accept: "text/html" } });
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
    assert.match(await response.text(), developmentPreviewMeta);
  } finally {
    await worker.stop();
  }
});
