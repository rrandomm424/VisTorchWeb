import { Node, Edge } from 'reactflow';
import { LayerNodeData } from '../store/useModelStore';
import { getSchema } from '../registry';
import { topologicalSort } from '../utils/topologicalSort';
import { findConnectedComponents } from '../utils/graphValidation';

function formatParamValue(value: unknown, type: string): string {
  if (type === 'tuple') {
    const arr = value as number[];
    if (Array.isArray(arr)) {
      if (arr.length === 2 && arr[0] === arr[1]) return String(arr[0]);
      return `(${arr.join(', ')})`;
    }
    return String(value);
  }
  if (type === 'bool') return value ? 'True' : 'False';
  if (type === 'string') return `'${value}'`;
  if (type === 'float') {
    const n = value as number;
    if (n === 1e-5) return '1e-05';
    if (n === 1e-4) return '1e-04';
    return String(n);
  }
  return String(value);
}

function arraysEqual(a: unknown, b: unknown): boolean {
  if (!Array.isArray(a) || !Array.isArray(b)) return a === b;
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

function buildParamString(node: Node<LayerNodeData>): string {
  const schema = getSchema(node.data.layerType);
  if (!schema) return '';

  const parts: string[] = [];
  for (const paramDef of schema.params) {
    const value = node.data.params[paramDef.name];
    const isDefault = paramDef.type === 'tuple'
      ? arraysEqual(value, paramDef.default)
      : value === paramDef.default;

    if (paramDef.required || !isDefault) {
      parts.push(`${paramDef.name}=${formatParamValue(value, paramDef.type)}`);
    }
  }
  return parts.join(', ');
}

function generateClassCode(
  classNodes: Node<LayerNodeData>[],
  classEdges: Edge[],
  name: string
): string {
  const nodeMap = new Map(classNodes.map(n => [n.id, n]));
  const nodeIds = classNodes.map(n => n.id);
  const { sorted, hasCycle } = topologicalSort(nodeIds, classEdges);

  const allSorted = [...sorted];
  for (const id of nodeIds) {
    if (!allSorted.includes(id)) allSorted.push(id);
  }

  let code = `class ${name}(nn.Module):\n`;
  code += `    def __init__(self):\n`;
  code += `        super().__init__()\n`;

  for (const id of allSorted) {
    const node = nodeMap.get(id)!;
    const schema = getSchema(node.data.layerType);
    if (!schema) continue;
    const paramStr = buildParamString(node);
    code += `        self.${node.data.variableName} = ${schema.module}(${paramStr})\n`;
  }

  code += `\n    def forward(self, x):\n`;

  if (hasCycle) {
    code += `        # WARNING: 检测到循环连接，请检查网络结构\n`;
  }

  const outVarMap = new Map<string, string>();
  let lastVar = 'x';

  for (const id of allSorted) {
    const node = nodeMap.get(id)!;
    const incomingEdges = classEdges.filter(e => e.target === id);
    let inputVar = 'x';
    if (incomingEdges.length > 0) {
      const sourceVar = outVarMap.get(incomingEdges[0].source);
      if (sourceVar) inputVar = sourceVar;
    }
    const outVar = node.data.variableName;
    outVarMap.set(id, outVar);
    code += `        ${outVar} = self.${node.data.variableName}(${inputVar})\n`;
    lastVar = outVar;
  }

  code += `        return ${lastVar}\n`;

  return code;
}

export function generateCode(
  nodes: Node<LayerNodeData>[],
  edges: Edge[],
  className: string
): string {
  if (nodes.length === 0) {
    return `import torch
import torch.nn as nn


class ${className}(nn.Module):
    def __init__(self):
        super().__init__()
        pass

    def forward(self, x):
        return x
`;
  }

  const nodeIds = nodes.map(n => n.id);
  const components = findConnectedComponents(nodeIds, edges);

  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const classCodes: string[] = [];

  for (let i = 0; i < components.length; i++) {
    const group = components[i];
    const groupSet = new Set(group);
    const groupNodes = group.map(id => nodeMap.get(id)!);
    const groupEdges = edges.filter(e => groupSet.has(e.source) && groupSet.has(e.target));

    const name = components.length === 1 ? className : `${className}${i + 1}`;
    classCodes.push(generateClassCode(groupNodes, groupEdges, name));
  }

  let code = `import torch\nimport torch.nn as nn\n\n\n`;
  code += classCodes.join('\n\n');

  return code;
}
