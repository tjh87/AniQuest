import assert from "node:assert/strict";
import test, { after } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const vite = await createServer({ configFile: false, root, appType: "custom", resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false } });
after(() => vite.close());
test("standalone profiles render only bundled photographs without losing source links", async () => {
  const { PROFILE_PHOTOS } = await vite.ssrLoadModule("/app/profile-photos.ts");
  const { WildlifePhoto } = await vite.ssrLoadModule("/app/wildlife-photos.tsx");
  const { OfflineContext } = await vite.ssrLoadModule("/app/offline-context.tsx");
  for (const [id, photo] of Object.entries(PROFILE_PHOTOS)) {
    const html = renderToStaticMarkup(React.createElement(OfflineContext.Provider, { value: true }, React.createElement(WildlifePhoto, { animal: id })));
    assert.doesNotMatch(html, /<img[^>]+src="https?:/, id);
    assert.ok(html.includes(photo.photographer.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;')) || html.includes('Photo:'), id);
    if (photo.src.startsWith('/')) assert.match(html, /<img /, id);
    else assert.match(html, /Photo source online/, id);
  }
});
