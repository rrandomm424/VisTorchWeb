import { LayerSchema } from '../types';

export const Linear: LayerSchema = {
  type: 'Linear',
  label: 'Linear 全连接层',
  category: 'linear',
  module: 'nn.Linear',
  params: [
    { name: 'in_features', type: 'int', default: 512, required: true, description: '输入特征数（上一层的输出维度）', min: 1 },
    { name: 'out_features', type: 'int', default: 256, required: true, description: '输出特征数（本层神经元数量）', min: 1 },
    { name: 'bias', type: 'bool', default: true, required: false, description: '是否添加偏置项' },
  ],
  inputPorts: 1,
  outputPorts: 1,
  color: '#f59e0b',
};
