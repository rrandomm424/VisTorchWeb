import { LayerSchema } from '../types';

export const Flatten: LayerSchema = {
  type: 'Flatten',
  label: 'Flatten 展平层',
  category: 'reshape',
  module: 'nn.Flatten',
  params: [
    { name: 'start_dim', type: 'int', default: 1, required: false, description: '开始展平的维度（默认1，保留batch维度）' },
    { name: 'end_dim', type: 'int', default: -1, required: false, description: '结束展平的维度（默认-1，展平到最后一维）' },
  ],
  inputPorts: 1,
  outputPorts: 1,
  color: '#6366f1',
};
