import { TemplateDefinition } from '../types';

export const transformerTemplate: TemplateDefinition = {
  id: 'transformer-encoder',
  name: 'Transformer 编码器',
  description: 'Transformer编码器结构，适用于NLP和序列建模',
  nodes: [
    { type: 'Linear', params: { in_features: 128, out_features: 512 }, position: { x: 300, y: 0 } },
    { type: 'TransformerEncoderLayer', params: { d_model: 512, nhead: 8, dim_feedforward: 2048, dropout: 0.1 }, position: { x: 300, y: 120 } },
    { type: 'TransformerEncoderLayer', params: { d_model: 512, nhead: 8, dim_feedforward: 2048, dropout: 0.1 }, position: { x: 300, y: 240 } },
    { type: 'Linear', params: { in_features: 512, out_features: 256 }, position: { x: 300, y: 360 } },
    { type: 'ReLU', params: {}, position: { x: 300, y: 480 } },
    { type: 'Linear', params: { in_features: 256, out_features: 10 }, position: { x: 300, y: 600 } },
  ],
  edges: [
    { sourceIndex: 0, targetIndex: 1 },
    { sourceIndex: 1, targetIndex: 2 },
    { sourceIndex: 2, targetIndex: 3 },
    { sourceIndex: 3, targetIndex: 4 },
    { sourceIndex: 4, targetIndex: 5 },
  ],
};
