import { Node, Edge } from 'reactflow';
import { LayerNodeData } from '../store/useModelStore';
import { LAYER_REGISTRY, getSchema } from '../registry';

export interface ParseResult {
  nodes: Node<LayerNodeData>[];
  edges: Edge[];
  className: string;
}

function parseParamValue(raw: string, type: string): unknown {
  const trimmed = raw.trim();
  if (type === 'bool') return trimmed === 'True';
  if (type === 'int') return parseInt(trimmed, 10);
  if (type === 'float') return parseFloat(trimmed);
  if (type === 'tuple') {
    const match = trimmed.match(/^\(([^)]+)\)$/);
    if (match) {
      return match[1].split(',').map(s => parseInt(s.trim(), 10));
    }
    const num = parseInt(trimmed, 10);
    if (!isNaN(num)) return [num, num];
    return [0, 0];
  }
  if (type === 'string') return trimmed.replace(/^['"]|['"]$/g, '');
  return trimmed;
}

function parseParamString(paramStr: string, layerType: string): Record<string, unknown> {
  const schema = getSchema(layerType);
  if (!schema) return {};

  const params: Record<string, unknown> = {};
  for (const p of schema.params) {
    params[p.name] = p.default;
  }

  if (!paramStr.trim()) return params;

  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of paramStr) {
    if (ch === '(' || ch === '[') depth++;
    if (ch === ')' || ch === ']') depth--;
    if (ch === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) parts.push(current.trim());

  let positionalIndex = 0;
  for (const part of parts) {
    const eqIndex = part.indexOf('=');
    if (eqIndex > 0 && !part.startsWith('(')) {
      const key = part.substring(0, eqIndex).trim();
      const val = part.substring(eqIndex + 1).trim();
      const paramDef = schema.params.find(p => p.name === key);
      if (paramDef) {
        params[key] = parseParamValue(val, paramDef.type);
      }
    } else {
      if (positionalIndex < schema.params.length) {
        const paramDef = schema.params[positionalIndex];
        params[paramDef.name] = parseParamValue(part, paramDef.type);
      }
      positionalIndex++;
    }
  }

  return params;
}

function splitClassBlocks(code: string): { name: string; body: string }[] {
  const results: { name: string; body: string }[] = [];
  const classRegex = /class\s+(\w+)\s*\(\s*nn\.Module\s*\)/g;
  const matches: { name: string; start: number }[] = [];

  let m: RegExpExecArray | null;
  while ((m = classRegex.exec(code)) !== null) {
    matches.push({ name: m[1], start: m.index });
  }

  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].start;
    const end = i + 1 < matches.length ? matches[i + 1].start : code.length;
    results.push({ name: matches[i].name, body: code.substring(start, end) });
  }

  return results;
}

function parseClassBlock(
  block: string,
  nodeOffset: number,
  yOffset: number,
  xOffset: number
): { nodes: Node<LayerNodeData>[]; edges: Edge[]; nodeCount: number } {
  const initLayerRegex = /self\.(\w+)\s*=\s*nn\.(\w+)\(([^)]*(?:\([^)]*\)[^)]*)*)\)/g;
  const nodes: Node<LayerNodeData>[] = [];
  const varToNodeId = new Map<string, string>();

  let match: RegExpExecArray | null;
  let nodeIndex = nodeOffset;

  while ((match = initLayerRegex.exec(block)) !== null) {
    const variableName = match[1];
    const layerType = match[2];
    const paramStr = match[3];

    if (!LAYER_REGISTRY.has(layerType)) continue;

    const schema = LAYER_REGISTRY.get(layerType)!;
    const params = parseParamString(paramStr, layerType);
    const nodeId = `parsed_${++nodeIndex}`;

    nodes.push({
      id: nodeId,
      type: 'layerNode',
      position: { x: xOffset, y: yOffset + (nodes.length) * 120 },
      data: {
        layerType,
        label: schema.label,
        params,
        variableName,
      },
    });

    varToNodeId.set(variableName, nodeId);
  }

  const edges: Edge[] = [];
  const forwardCallRegex = /(\w+)\s*=\s*self\.(\w+)\((\w+)\)/g;
  const outVarToNode = new Map<string, string>();

  while ((match = forwardCallRegex.exec(block)) !== null) {
    const outVar = match[1];
    const selfVar = match[2];
    const inputVar = match[3];

    const targetId = varToNodeId.get(selfVar);
    if (!targetId) continue;

    outVarToNode.set(outVar, targetId);

    const sourceId = outVarToNode.get(inputVar);
    if (sourceId && sourceId !== targetId) {
      edges.push({
        id: `edge_parsed_${nodeOffset}_${edges.length}`,
        source: sourceId,
        target: targetId,
      });
    }
  }

  return { nodes, edges, nodeCount: nodeIndex };
}

export function parseCode(code: string): ParseResult | null {
  const classBlocks = splitClassBlocks(code);
  if (classBlocks.length === 0) return null;

  const allNodes: Node<LayerNodeData>[] = [];
  const allEdges: Edge[] = [];
  let nodeOffset = 0;

  for (let i = 0; i < classBlocks.length; i++) {
    const block = classBlocks[i];
    const xOffset = 300 + i * 300;
    const { nodes, edges, nodeCount } = parseClassBlock(block.body, nodeOffset, 0, xOffset);
    allNodes.push(...nodes);
    allEdges.push(...edges);
    nodeOffset = nodeCount;
  }

  if (allNodes.length === 0) return null;

  const baseName = classBlocks[0].name.replace(/\d+$/, '') || 'MyModel';

  return { nodes: allNodes, edges: allEdges, className: baseName };
}
