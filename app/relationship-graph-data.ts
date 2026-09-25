import type { SingaporeSpecies } from "./species-data";

export type RelatedMatch = { item: SingaporeSpecies; label: string; rank: number };
export type RelatedGroup = { title: string; detail: string; rank: number };
export type RelationshipNode = {
  id: string; kind: "current" | "group" | "animal"; title: string; subtitle: string;
  rank: number; width: number; height: number; x: number; y: number; profileId?: string;
};

export function relationshipGroupsFor(species: SingaporeSpecies): RelatedGroup[] {
  const groupName = { Mammal: "Other mammals", Bird: "Other birds", Reptile: "Other reptiles", Amphibian: "Other amphibians" }[species.group];
  return [
    { title: "Same genus", detail: `Shared genus: ${species.scientific.split(" ")[0]}`, rank: 0 },
    { title: "Same family", detail: `Shared family: ${species.family}`, rank: 1 },
    { title: groupName, detail: "Same broad animal group. Close relationship is not implied.", rank: 2 },
    { title: "Shared habitat", detail: "A habitat match. Close relationship is not implied.", rank: 3 },
  ];
}

export function relationshipGraphData(species: SingaporeSpecies, relations: RelatedMatch[], groups: RelatedGroup[], width: number) {
  const narrow = width < 860;
  const columns = width < 260 ? 1 : 2;
  const activeGroups = groups.filter(group => relations.some(match => match.rank === group.rank));
  const nodes: RelationshipNode[] = [];
  const edges: { id: string; source: string; target: string; rank: number; root: boolean; bend: number }[] = [];
  const height = Math.max(360, relations.length * 86 + 32);
  nodes.push({ id: "current", kind: "current", title: species.name, subtitle: species.scientific, rank: -1,
    width: narrow ? Math.min(width - 48, 248) : 200, height: 92, x: narrow ? width / 2 : 122, y: narrow ? 60 : height / 2 });
  let offset = 0;
  let rowTop = 188;
  for (const group of activeGroups) {
    const matches = relations.filter(match => match.rank === group.rank);
    const groupId = `group-${group.rank}`;
    const groupY = narrow ? rowTop : 60 + (offset + (matches.length - 1) / 2) * 86;
    nodes.push({ id: groupId, kind: "group", title: group.title, subtitle: `${matches.length} ${matches.length === 1 ? "profile" : "profiles"}`,
      rank: group.rank, width: narrow ? Math.min(width - 48, 240) : 182, height: 72, x: narrow ? width / 2 : width * .47, y: groupY });
    edges.push({ id: `from-current-${group.rank}`, source: "current", target: groupId, rank: group.rank, root: true, bend: 0 });
    matches.forEach((match, index) => {
      const nodeWidth = narrow ? (columns === 1 ? width - 48 : (width - 64) / 2) : 224;
      const id = `animal-${match.item.id}`;
      nodes.push({ id, kind: "animal", title: match.item.name, subtitle: match.item.scientific, profileId: match.item.id,
        rank: group.rank, width: nodeWidth, height: narrow ? 120 : 74,
        x: narrow ? (columns === 1 ? width / 2 : index % 2 === 0 ? 12 + nodeWidth / 2 : width - 12 - nodeWidth / 2) : width - 134,
        y: narrow ? rowTop + 140 + Math.floor(index / columns) * 148 : 60 + (offset + index) * 86 });
      // Larger offsets make the six sibling paths read as separate, soft curves.
      edges.push({ id: `to-${match.item.id}`, source: groupId, target: id, rank: group.rank, root: false, bend: (index - (matches.length - 1) / 2) * 34 });
    });
    offset += matches.length;
    rowTop += 140 + Math.ceil(matches.length / columns) * 148 + 28;
  }
  return { nodes, edges, narrow, columns, width, height: narrow ? rowTop - 56 : height, activeGroups };
}
