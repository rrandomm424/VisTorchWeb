import { LayerSchema } from '../types';

export const Dropout: LayerSchema = {
  type: 'Dropout',
  label: 'Dropout 随机丢弃',
  category: 'dropout',
  module: 'nn.Dropout',
  params: [
    { name: 'p', type: 'float', default: 0.5, required: false, description: '丢弃概率（训练时随机置零的比例）', min: 0, max: 1 },
    { name: 'inplace', type: 'bool', default: false, required: false, description: '是否原地操作（节省内存但可能影响梯度）' },
  ],
  inputPorts: 1,
  outputPorts: 1,
  color: '#ec4899',
};
