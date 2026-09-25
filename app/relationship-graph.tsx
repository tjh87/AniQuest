"use client";

import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight, Hand, Maximize, Minus, Network, Plus } from "lucide-react";
import type { Core, StylesheetJson } from "cytoscape";
import type { SingaporeSpecies } from "./species-data";
import { relationshipGraphData, type RelatedGroup, type RelatedMatch } from "./relationship-graph-data";

export function RelationshipGraph({ species, relations, groups, onOpen }: {
  species: SingaporeSpecies; relations: RelatedMatch[]; groups: RelatedGroup[]; onOpen: (id: string) => void;
}) {
  const graphId = useId();
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const labels = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const [width, setWidth] = useState(1000);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [zoom, setZoom] = useState(100);
  const [mobilePan, setMobilePan] = useState(false);
  const graph = useMemo(() => relationshipGraphData(species, relations, groups, width), [species, relations, groups, width]);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      cyRef.current?.resize();
      if (entry.contentRect.width > 0) setWidth(Math.round(entry.contentRect.width));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = canvas.current;
    const wrapper = host.current;
    if (!container || !wrapper) return;
    let disposed = false;
    let cy: Core | undefined;
    let frame = 0;
    let themeObserver: MutationObserver | undefined;

    function styles(): StylesheetJson {
      const colors = getComputedStyle(wrapper!);
      const color = (name: string) => colors.getPropertyValue(name).trim();
      const pixelated = document.documentElement.dataset.uiStyle === "retro";
      return [
        { selector: "node", style: { width: "data(width)", height: "data(height)", shape: pixelated ? "rectangle" : "round-rectangle",
          "background-color": color("--network-node"), "border-width": 2, "border-color": color("--network-root"),
          "overlay-opacity": 0, "underlay-color": color("--network-root"), "underlay-opacity": .08, "underlay-padding": 5 } },
        { selector: 'node[kind = "current"]', style: { "background-color": color("--network-root"), "border-width": 3, "underlay-opacity": .16 } },
        ...[0, 1, 2, 3].flatMap(rank => [
          { selector: `node[rank = ${rank}]`, style: { "border-color": color(`--network-${rank}`), "underlay-color": color(`--network-${rank}`) } },
          { selector: `node[kind = "animal"][rank = ${rank}]`, style: { "background-color": color(`--network-animal-${rank}`) } },
          { selector: `node[kind = "group"][rank = ${rank}]`, style: { "background-color": color(`--network-fill-${rank}`), "border-width": 2.5 } },
          { selector: `edge[rank = ${rank}]`, style: { "line-color": color(`--network-line-${rank}`), "target-arrow-color": color("--network-arrow"), "underlay-color": color(`--network-line-${rank}`) } },
        ]),
        { selector: "edge", style: { width: 2.5, "curve-style": "unbundled-bezier", "control-point-distances": "data(bend)",
          "control-point-weights": .5, "line-cap": "round", "target-arrow-shape": "triangle", "arrow-scale": 1.15, "opacity": .92,
          "underlay-opacity": .16, "underlay-padding": 3 } },
        { selector: 'edge[root = "yes"]', style: { width: 3.5, "line-color": color("--network-line-root"), "target-arrow-color": color("--network-arrow"), "underlay-color": color("--network-line-root"), "underlay-opacity": .22, "underlay-padding": 4 } },
        { selector: "edge[rank = 3]", style: { "line-style": "dashed" } },
        ...(graph.narrow ? [
          { selector: "edge", style: { "curve-style": "round-taxi", "taxi-direction": "downward", "taxi-turn": -16, "taxi-turn-min-distance": 8, "taxi-radius": 12 } },
          ...(graph.columns === 1 ? [{ selector: 'edge[root = "no"]', style: {
            "curve-style": "round-segments", "edge-distances": "node-position", "segment-weights": [0, 1],
            "segment-distances": [graph.width / 2 - 14, graph.width / 2 - 14], "segment-radii": 8,
          } }] : []),
          { selector: 'edge[root = "yes"]', style: graph.activeGroups.length === 1 ? { "curve-style": "straight" } : {
            "curve-style": "round-segments", "edge-distances": "node-position", "segment-weights": [0, 1],
            "segment-distances": [graph.width / 2 - 6, graph.width / 2 - 6], "segment-radii": 10,
          } },
        ] as StylesheetJson : []),
        { selector: "node.is-active", style: { "border-width": 3.5, "underlay-opacity": .25, "underlay-padding": 7 } },
        { selector: "edge.is-active", style: { width: 4, opacity: 1 } },
      ] as StylesheetJson;
    }

    function placeLabels() {
      if (!cy || disposed) return;
      const scale = cy.zoom();
      labels.current?.querySelectorAll<HTMLElement>("[data-node-id]").forEach(label => {
        const node = cy!.getElementById(label.dataset.nodeId!);
        const position = node.renderedPosition();
        label.style.transform = `translate(${position.x - node.width() * scale / 2}px, ${position.y - node.height() * scale / 2}px) scale(${scale})`;
      });
      setZoom(Math.round(scale * 100));
    }

    import("cytoscape").then(({ default: cytoscape }) => {
      if (disposed) return;
      cy = cytoscape({ container,
        elements: [
          ...graph.nodes.map(node => ({ data: { ...node }, position: { x: node.x, y: node.y } })),
          ...graph.edges.map(edge => ({ data: { ...edge, root: edge.root ? "yes" : "no" } })),
        ],
        style: styles(), layout: { name: "preset", fit: false }, minZoom: .5, maxZoom: 2,
        zoom: 1, pan: { x: 0, y: 0 }, autoungrabify: true, autounselectify: true,
        boxSelectionEnabled: false, userZoomingEnabled: false,
      });
      cyRef.current = cy;
      cy.on("render pan zoom resize", () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(placeLabels); });
      themeObserver = new MutationObserver(() => { cy?.style(styles()); });
      themeObserver.observe(document.documentElement, { attributes: true });
      setState("ready");
      frame = requestAnimationFrame(() => { cy?.resize(); placeLabels(); });
    }).catch(() => { if (!disposed) setState("error"); });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      themeObserver?.disconnect();
      cy?.destroy();
      if (cyRef.current === cy) cyRef.current = null;
    };
  }, [graph]);

  function reset() {
    cyRef.current?.viewport({ zoom: 1, pan: { x: 0, y: 0 } });
  }
  function changeZoom(factor: number) {
    const cy = cyRef.current;
    if (!cy) return;
    cy.zoom({ level: Math.min(2, Math.max(.5, cy.zoom() * factor)), renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } });
  }
  function highlight(id?: string) {
    const cy = cyRef.current;
    if (!cy) return;
    cy.elements().removeClass("is-active");
    if (id) {
      const node = cy.getElementById(id);
      node.union(node.incomers()).union(node.incomers("node").incomers()).addClass("is-active");
    }
  }
  function focusNode(id: string) {
    const cy = cyRef.current;
    if (!cy) return;
    const node = cy.getElementById(id);
    const box = node.renderedBoundingBox();
    if (box.x1 < 0 || box.y1 < 0 || box.x2 > cy.width() || box.y2 > cy.height()) cy.center(node);
    highlight(id);
  }

  return <div className="aq-relation-graph aq-network" role="group" aria-label={`Relationship graph for ${species.name}`}>
    <div className="aq-network-toolbar">
      <span>{graph.narrow ? "Select an animal. Enable Move to drag the graph." : "Drag the background to move. Select an animal to open its profile."}</span>
      <div className="aq-network-controls" role="group" aria-label="Graph view controls">
        {graph.narrow && <button type="button" aria-label="Move relationship graph" aria-pressed={mobilePan} disabled={state !== "ready"} onClick={() => setMobilePan(value => !value)}><Hand aria-hidden="true" /><span>Move</span></button>}
        <button type="button" aria-label="Zoom out relationship graph" disabled={state !== "ready" || zoom <= 50} onClick={() => changeZoom(1 / 1.2)}><Minus aria-hidden="true" /></button>
        <output aria-label="Graph zoom">{zoom}%</output>
        <button type="button" aria-label="Zoom in relationship graph" disabled={state !== "ready" || zoom >= 200} onClick={() => changeZoom(1.2)}><Plus aria-hidden="true" /></button>
        <button type="button" aria-label="Reset relationship graph view" disabled={state !== "ready"} onClick={reset}><Maximize aria-hidden="true" /><span>Reset</span></button>
      </div>
    </div>
    <div ref={host} className={`aq-network-stage ${state === "ready" ? "is-ready" : ""}`} data-pan-enabled={!graph.narrow || mobilePan} style={{ "--network-height": `${graph.height}px` } as CSSProperties}
      tabIndex={state === "ready" ? 0 : -1} role="group" aria-label="Graph canvas. Use arrow keys to move, plus or minus to zoom, and Home to reset."
      onKeyDown={event => {
        if (event.target !== event.currentTarget) return;
        const directions: Record<string, { x: number; y: number }> = { ArrowLeft: { x: 40, y: 0 }, ArrowRight: { x: -40, y: 0 }, ArrowUp: { x: 0, y: 40 }, ArrowDown: { x: 0, y: -40 } };
        if (directions[event.key]) { event.preventDefault(); cyRef.current?.panBy(directions[event.key]); }
        else if (event.key === "+" || event.key === "=") { event.preventDefault(); changeZoom(1.2); }
        else if (event.key === "-") { event.preventDefault(); changeZoom(1 / 1.2); }
        else if (event.key === "Home") { event.preventDefault(); reset(); }
      }}>
      <div ref={canvas} className="aq-network-canvas" aria-hidden="true" />
      <div ref={labels} className="aq-network-labels">
        {graph.nodes.map(node => {
          const content = <>{node.kind === "current" && <span className="aq-network-eyebrow"><Network aria-hidden="true" />Current animal</span>}
            <strong>{node.title}</strong>{node.kind === "group" ? <span>{node.subtitle}</span> : <em id={`${graphId}-${node.id}-scientific`}>{node.subtitle}</em>}
            {node.kind === "animal" && <ArrowUpRight className="aq-network-open" aria-hidden="true" />}</>;
          const className = `aq-network-node aq-network-${node.kind} aq-network-rank-${node.rank}`;
          const style: CSSProperties | undefined = state === "ready" ? { width: node.width, height: node.height,
            transform: `translate(${node.x - node.width / 2}px, ${node.y - node.height / 2}px)`, transformOrigin: "0 0" } : undefined;
          return node.kind === "animal" ? <button key={node.id} type="button" data-node-id={node.id} className={className} style={style}
            aria-label={`Open related profile: ${node.title}`} aria-describedby={`${graphId}-${node.id}-scientific ${graphId}-group-${node.rank}`}
            onClick={() => onOpen(node.profileId!)} onPointerEnter={() => highlight(node.id)} onPointerLeave={() => highlight()}
            onFocus={() => focusNode(node.id)} onBlur={() => highlight()}>{content}</button>
            : <div key={node.id} data-node-id={node.id} className={className} style={style}>{content}</div>;
        })}
      </div>
    </div>
    {state !== "ready" && <p role="status" className="aq-network-status">{state === "loading" ? "Loading relationship graph…" : "The interactive graph could not load. Use the profile buttons above."}</p>}
    <div className="aq-network-legend">{graph.activeGroups.map(group => <p key={group.rank} id={`${graphId}-group-${group.rank}`} className={`aq-network-rank-${group.rank}`}><i aria-hidden="true" /><strong>{group.title}:</strong> {group.detail}</p>)}</div>
    <p className="aq-related-graph-note">Links show shared classifications or habitats. They do not show ancestry, genetic distance or time.</p>
  </div>;
}
