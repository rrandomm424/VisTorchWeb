import { Edge } from 'reactflow';

export interface TopoSortResult {
  sorted: string[];
  hasCycle: boolean;
  cycleNodes: string[];
}

export function topologicalSort(nodeIds: string[], edges: Edge[]): TopoSortResult {
  const inDegree = new Map<string, number>();
  const adjacency = new Map<string, string[]>();

  for (const id of nodeIds) {
    inDegree.set(id, 0);
    adjacency.set(id, []);
  }

  for (const edge of edges) {
    if (inDegree.has(edge.source) && inDegree.has(edge.target)) {
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
      adjacency.get(edge.source)!.push(edge.target);
    }
  }

  const queue: string[] = [];
  for (const [id, degree] of inDegree) {
    if (degree === 0) queue.push(id);
  }

  const sorted: string[] = [];
  while (queue.length > 0) {
    const node = queue.shift()!;
    sorted.push(node);
    for (const neighbor of adjacency.get(node) || []) {
      const newDegree = (inDegree.get(neighbor) || 0) - 1;
      inDegree.set(neighbor, newDegree);
      if (newDegree === 0) queue.push(neighbor);
    }
  }

  const hasCycle = sorted.length !== nodeIds.length;
  const cycleNodes = hasCycle
    ? nodeIds.filter(id => !sorted.includes(id))
    : [];

  return { sorted, hasCycle, cycleNodes };
}
