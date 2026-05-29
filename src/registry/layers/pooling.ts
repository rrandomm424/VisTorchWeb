import { LayerSchema } from '../types';

export const MaxPool2d: LayerSchema = {
  type: 'MaxPool2d',
  label: 'MaxPool2d 最大池化',
  category: 'pooling',
  module: 'nn.MaxPool2d',
  params: [
    { name: 'kernel_size', type: 'tuple', default: [2, 2], required: true, description: '池化窗口大小' },
    { name: 'stride', type: 'tuple', default: [2, 2], required: false, description: '步幅大小（默认等于kernel_size）' },
    { name: 'padding', type: 'tuple', default: [0, 0], required: false, description: '填充大小' },
  ],
  inputPorts: 1,
  outputPorts: 1,
  color: '#8b5cf6',
};

export const AvgPool2d: LayerSchema = {
  type: 'AvgPool2d',
  label: 'AvgPool2d 平均池化',
  category: 'pooling',
  module: 'nn.AvgPool2d',
  params: [
    { name: 'kernel_size', type: 'tuple', default: [2, 2], required: true, description: '池化窗口大小' },
    { name: 'stride', type: 'tuple', default: [2, 2], required: false, description: '步幅大小（默认等于kernel_size）' },
    { name: 'padding', type: 'tuple', default: [0, 0], required: false, description: '填充大小' },
  ],
  inputPorts: 1,
  outputPorts: 1,
  color: '#8b5cf6',
};
