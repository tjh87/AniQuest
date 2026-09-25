import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({
  appType: "custom", configFile: false, root,
  cacheDir: "node_modules/.vite-profile-graphs-test",
  resolve: { alias: { "@": root } }, esbuild: { jsx: "automatic" },
  server: { middlewareMode: true, hmr: false, ws: false },
});
after(() => vite.close());

test("all 141 profiles show an expanded relationship graph with six working profile targets", async () => {
  const [{ AnimalAtlas }, { SINGAPORE_SPECIES }] = await Promise.all([
    vite.ssrLoadModule("/app/animal-atlas.tsx"),
    vite.ssrLoadModule("/app/species-data.ts"),
  ]);
  assert.equal(SINGAPORE_SPECIES.length, 141);
  for (const species of SINGAPORE_SPECIES) {
    const html = renderToStaticMarkup(createElement(AnimalAtlas, { selectedId: species.id, onSelect() {}, onBrowse() {} }));
    assert.match(html, /aria-label="Minimise Related profiles"/, species.id);
    assert.match(html, /aria-label="Relationship graph for /, species.id);
    assert.equal((html.match(/aria-label="Open related profile: /g) ?? []).length, 6, species.id);
    assert.match(html, />Photo cards<\//, species.id);
    assert.equal((html.match(/class="aq-profile-section-trigger"[^>]*aria-label="Minimise /g) ?? []).length, 7, species.id);
  }
});

test("new and upgraded profiles open all sections, while later saved choices remain respected", async () => {
  const { restoreProfileSections } = await vite.ssrLoadModule("/app/profile-sections.tsx");
  const initial = restoreProfileSections(null);
  assert.ok(Object.values(initial).every(value => value === true));
  const minimised = Object.fromEntries(Object.keys(initial).map(key => [key, false]));
  assert.deepEqual(restoreProfileSections(minimised, true), initial);
  assert.deepEqual(restoreProfileSections(minimised), minimised);
  assert.deepEqual(restoreProfileSections({ related: false, facts: "false", extra: true }), { ...initial, related: false });
});

test("Cytoscape layouts keep all profile targets connected and separated at phone, tablet and desktop widths", async () => {
  const [{ relationshipGraphData, relationshipGroupsFor }, { relatedProfiles }, { SINGAPORE_SPECIES }, { default: cytoscape }] = await Promise.all([
    vite.ssrLoadModule("/app/relationship-graph-data.ts"), vite.ssrLoadModule("/app/species-explorer.tsx"),
    vite.ssrLoadModule("/app/species-data.ts"), import("cytoscape"),
  ]);
  for (const species of SINGAPORE_SPECIES) {
    const matches = relatedProfiles(species);
    for (const width of [220, 260, 390, 700, 860, 1017]) {
      const graph = relationshipGraphData(species, matches, relationshipGroupsFor(species), width);
      const context = `${species.id} at ${width}px`;
      assert.equal(graph.nodes.filter(node => node.kind === "animal").length, 6, context);
      const cy = cytoscape({ headless: true, elements: [
        ...graph.nodes.map(node => ({ data: { id: node.id }, position: { x: node.x, y: node.y } })),
        ...graph.edges.map(edge => ({ data: edge })),
      ], layout: { name: "preset" } });
      assert.equal(cy.elements().components().length, 1, context);
      assert.equal(cy.edges().length, cy.nodes().length - 1, context);
      cy.destroy();
      for (const [index, node] of graph.nodes.entries()) {
        assert.ok(node.x - node.width / 2 >= 0 && node.x + node.width / 2 <= width, `${context}: ${node.id} fits horizontally`);
        assert.ok(node.y - node.height / 2 >= 0 && node.y + node.height / 2 <= graph.height, `${context}: ${node.id} fits vertically`);
        for (const other of graph.nodes.slice(index + 1)) {
          const separate = Math.abs(node.x - other.x) >= (node.width + other.width) / 2 || Math.abs(node.y - other.y) >= (node.height + other.height) / 2;
          assert.ok(separate, `${context}: ${node.id} does not overlap ${other.id}`);
        }
      }
      if (!graph.narrow) for (const edge of graph.edges) {
        const from = graph.nodes.find(node => node.id === edge.source);
        const to = graph.nodes.find(node => node.id === edge.target);
        assert.ok(to.x - to.width / 2 - (from.x + from.width / 2) >= 90, `${context}: ${edge.id} has a visible long branch`);
      }
    }
  }
});
