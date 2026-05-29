import { Edge } from 'reactflow';

export function validateConnection(
  source: string,
  target: string,
  existingEdges: Edge[]
): boolean {
  if (source === target) return false;
  if (existingEdges.some(e => e.source === source && e.target === target)) return false;
  return true;
}

export function getDisconnectedNodes(nodeIds: string[], edges: Edge[]): string[] {
  const connected = new Set<string>();
  for (const edge of edges) {
    connected.add(edge.source);
    connected.add(edge.target);
  }
  return nodeIds.filter(id => !connected.has(id));
}

export function findConnectedComponents(nodeIds: string[], edges: Edge[]): string[][] {
  const parent = new Map<string, string>();
  for (const id of nodeIds) {
    parent.set(id, id);
  }

  function find(x: string): string {
    while (parent.get(x) !== x) {
      parent.set(x, parent.get(parent.get(x)!)!);
      x = parent.get(x)!;
    }
    return x;
  }

  function union(a: string, b: string) {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent.set(ra, rb);
  }

  for (const edge of edges) {
    if (parent.has(edge.source) && parent.has(edge.target)) {
      union(edge.source, edge.target);
    }
  }

  const groups = new Map<string, string[]>();
  for (const id of nodeIds) {
    const root = find(id);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root)!.push(id);
  }

  return Array.from(groups.values());
}
