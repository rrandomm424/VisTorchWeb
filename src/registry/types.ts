export type ParamType = 'int' | 'float' | 'bool' | 'string' | 'tuple' | 'select';

export interface ParamDef {
  name: string;
  type: ParamType;
  default: unknown;
  required: boolean;
  description: string;
  options?: string[];
  min?: number;
  max?: number;
}

export interface LayerSchema {
  type: string;
  label: string;
  category: LayerCategory;
  module: string;
  params: ParamDef[];
  inputPorts: number;
  outputPorts: number;
  color: string;
}

export type LayerCategory =
  | 'convolution'
  | 'pooling'
  | 'linear'
  | 'normalization'
  | 'dropout'
  | 'activation'
  | 'reshape'
  | 'recurrent'
  | 'attention';

export interface TemplateNode {
  type: string;
  params: Record<string, unknown>;
  position: { x: number; y: number };
}

export interface TemplateEdge {
  sourceIndex: number;
  targetIndex: number;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  nodes: TemplateNode[];
  edges: TemplateEdge[];
}
