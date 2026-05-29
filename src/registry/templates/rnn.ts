import { TemplateDefinition } from '../types';

export const rnnTemplate: TemplateDefinition = {
  id: 'rnn-simple',
  name: 'RNN 循环网络',
  description: '简单循环神经网络，适用于序列数据处理',
  nodes: [
    { type: 'LSTM', params: { input_size: 128, hidden_size: 256, num_layers: 2, batch_first: true }, position: { x: 300, y: 0 } },
    { type: 'Dropout', params: { p: 0.3 }, position: { x: 300, y: 120 } },
    { type: 'Linear', params: { in_features: 256, out_features: 10 }, position: { x: 300, y: 240 } },
  ],
  edges: [
    { sourceIndex: 0, targetIndex: 1 },
    { sourceIndex: 1, targetIndex: 2 },
  ],
};

export const lstmTemplate: TemplateDefinition = {
  id: 'lstm-classifier',
  name: 'LSTM 分类器',
  description: '基于LSTM的序列分类网络，含双向和多层结构',
  nodes: [
    { type: 'LSTM', params: { input_size: 64, hidden_size: 128, num_layers: 2, batch_first: true, bidirectional: true, dropout: 0.2 }, position: { x: 300, y: 0 } },
    { type: 'BatchNorm1d', params: { num_features: 256 }, position: { x: 300, y: 120 } },
    { type: 'Dropout', params: { p: 0.5 }, position: { x: 300, y: 240 } },
    { type: 'Linear', params: { in_features: 256, out_features: 64 }, position: { x: 300, y: 360 } },
    { type: 'ReLU', params: {}, position: { x: 300, y: 480 } },
    { type: 'Linear', params: { in_features: 64, out_features: 10 }, position: { x: 300, y: 600 } },
  ],
  edges: [
    { sourceIndex: 0, targetIndex: 1 },
    { sourceIndex: 1, targetIndex: 2 },
    { sourceIndex: 2, targetIndex: 3 },
    { sourceIndex: 3, targetIndex: 4 },
    { sourceIndex: 4, targetIndex: 5 },
  ],
};
