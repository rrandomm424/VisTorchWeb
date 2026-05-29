import { create } from 'zustand';
import { Node, Edge, Connection, addEdge as rfAddEdge } from 'reactflow';
import { LAYER_REGISTRY, TEMPLATE_REGISTRY, getSchema } from '../registry';

export interface LayerNodeData {
  layerType: string;
  label: string;
  params: Record<string, unknown>;
  variableName: string;
}

interface VariableCounter {
  [key: string]: number;
}

export interface ModelStore {
  nodes: Node<LayerNodeData>[];
  edges: Edge[];
  className: string;
  selectedNodeId: string | null;
  syncDirection: 'canvas' | 'code' | null;
  variableCounters: VariableCounter;

  addNode: (type: string, position: { x: number; y: number }) => void;
  removeNode: (id: string) => void;
  updateNodeParams: (id: string, params: Record<string, unknown>) => void;
  updateNodePosition: (id: string, position: { x: number; y: number }) => void;
  renameNodeVariable: (id: string, name: string) => void;
  onNodesChange: (changes: unknown[]) => void;
  addEdge: (connection: Connection) => void;
  removeEdge: (id: string) => void;
  setEdges: (edges: Edge[]) => void;
  selectNode: (id: string | null) => void;
  setClassName: (name: string) => void;
  loadTemplate: (templateId: string) => void;
  addTemplate: (templateId: string, position: { x: number; y: number }) => void;
  replaceModel: (nodes: Node<LayerNodeData>[], edges: Edge[], className: string) => void;
  setSyncDirection: (dir: 'canvas' | 'code' | null) => void;
  setNodes: (nodes: Node<LayerNodeData>[]) => void;
}

let nodeIdCounter = 0;

function generateNodeId(): string {
  return `node_${++nodeIdCounter}`;
}

function generateVariableName(type: string, counters: VariableCounter): { name: string; counters: VariableCounter } {
  const base = type.toLowerCase().replace(/[^a-z0-9]/g, '');
  const count = (counters[base] || 0) + 1;
  const newCounters = { ...counters, [base]: count };
  return { name: `${base}${count}`, counters: newCounters };
}

export const useModelStore = create<ModelStore>((set, get) => ({
  nodes: [],
  edges: [],
  className: 'MyModel',
  selectedNodeId: null,
  syncDirection: null,
  variableCounters: {},

  addNode: (type, position) => {
    const schema = getSchema(type);
    if (!schema) return;

    const state = get();
    const { name, counters } = generateVariableName(type, state.variableCounters);

    const defaultParams: Record<string, unknown> = {};
    for (const p of schema.params) {
      defaultParams[p.name] = p.default;
    }

    const newNode: Node<LayerNodeData> = {
      id: generateNodeId(),
      type: 'layerNode',
      position,
      data: {
        layerType: type,
        label: schema.label,
        params: defaultParams,
        variableName: name,
      },
    };

    set({
      nodes: [...state.nodes, newNode],
      variableCounters: counters,
    });
  },

  removeNode: (id) => {
    const state = get();
    set({
      nodes: state.nodes.filter(n => n.id !== id),
      edges: state.edges.filter(e => e.source !== id && e.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    });
  },

  updateNodeParams: (id, params) => {
    set({
      nodes: get().nodes.map(n =>
        n.id === id ? { ...n, data: { ...n.data, params: { ...n.data.params, ...params } } } : n
      ),
    });
  },

  updateNodePosition: (id, position) => {
    set({
      nodes: get().nodes.map(n =>
        n.id === id ? { ...n, position } : n
      ),
    });
  },

  renameNodeVariable: (id, name) => {
    const state = get();
    const exists = state.nodes.some(n => n.id !== id && n.data.variableName === name);
    if (exists) return;
    set({
      nodes: state.nodes.map(n =>
        n.id === id ? { ...n, data: { ...n.data, variableName: name } } : n
      ),
    });
  },

  onNodesChange: (_changes) => {
    // Handled by React Flow's internal state; we sync positions on drag stop
  },

  addEdge: (connection) => {
    const state = get();
    if (!connection.source || !connection.target) return;
    if (connection.source === connection.target) return;
    const duplicate = state.edges.some(
      e => e.source === connection.source && e.target === connection.target
    );
    if (duplicate) return;

    set({
      edges: rfAddEdge(connection, state.edges),
    });
  },

  removeEdge: (id) => {
    set({ edges: get().edges.filter(e => e.id !== id) });
  },

  setEdges: (edges) => {
    set({ edges });
  },

  setNodes: (nodes) => {
    set({ nodes });
  },

  selectNode: (id) => {
    set({ selectedNodeId: id });
  },

  setClassName: (name) => {
    set({ className: name });
  },

  loadTemplate: (templateId) => {
    const template = TEMPLATE_REGISTRY.get(templateId);
    if (!template) return;

    let counters: VariableCounter = {};
    const nodes: Node<LayerNodeData>[] = [];

    for (const tNode of template.nodes) {
      const schema = LAYER_REGISTRY.get(tNode.type);
      if (!schema) continue;

      const { name, counters: newCounters } = generateVariableName(tNode.type, counters);
      counters = newCounters;

      const params: Record<string, unknown> = {};
      for (const p of schema.params) {
        params[p.name] = p.default;
      }
      Object.assign(params, tNode.params);

      nodes.push({
        id: generateNodeId(),
        type: 'layerNode',
        position: tNode.position,
        data: {
          layerType: tNode.type,
          label: schema.label,
          params,
          variableName: name,
        },
      });
    }

    const edges: Edge[] = template.edges.map((e, i) => ({
      id: `edge_${Date.now()}_${i}`,
      source: nodes[e.sourceIndex].id,
      target: nodes[e.targetIndex].id,
    }));

    set({
      nodes,
      edges,
      variableCounters: counters,
      selectedNodeId: null,
      className: 'MyModel',
    });
  },

  addTemplate: (templateId, position) => {
    const template = TEMPLATE_REGISTRY.get(templateId);
    if (!template) return;

    const state = get();
    let counters = { ...state.variableCounters };
    const newNodes: Node<LayerNodeData>[] = [];

    const minX = Math.min(...template.nodes.map(n => n.position.x));
    const minY = Math.min(...template.nodes.map(n => n.position.y));

    for (const tNode of template.nodes) {
      const schema = LAYER_REGISTRY.get(tNode.type);
      if (!schema) continue;

      const { name, counters: newCounters } = generateVariableName(tNode.type, counters);
      counters = newCounters;

      const params: Record<string, unknown> = {};
      for (const p of schema.params) {
        params[p.name] = p.default;
      }
      Object.assign(params, tNode.params);

      newNodes.push({
        id: generateNodeId(),
        type: 'layerNode',
        position: {
          x: position.x + (tNode.position.x - minX),
          y: position.y + (tNode.position.y - minY),
        },
        data: {
          layerType: tNode.type,
          label: schema.label,
          params,
          variableName: name,
        },
      });
    }

    const newEdges: Edge[] = template.edges.map((e, i) => ({
      id: `edge_${Date.now()}_${i}`,
      source: newNodes[e.sourceIndex].id,
      target: newNodes[e.targetIndex].id,
    }));

    set({
      nodes: [...state.nodes, ...newNodes],
      edges: [...state.edges, ...newEdges],
      variableCounters: counters,
    });
  },

  replaceModel: (nodes, edges, className) => {
    const counters: VariableCounter = {};
    for (const n of nodes) {
      const base = n.data.layerType.toLowerCase().replace(/[^a-z0-9]/g, '');
      const match = n.data.variableName.match(/(\d+)$/);
      const num = match ? parseInt(match[1], 10) : 1;
      counters[base] = Math.max(counters[base] || 0, num);
    }
    set({ nodes, edges, className, selectedNodeId: null, variableCounters: counters });
  },

  setSyncDirection: (dir) => {
    set({ syncDirection: dir });
  },
}));
