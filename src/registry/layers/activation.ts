import { LayerSchema } from '../types';

export const ReLU: LayerSchema = {
  type: 'ReLU',
  label: 'ReLU 激活函数',
  category: 'activation',
  module: 'nn.ReLU',
  params: [
    { name: 'inplace', type: 'bool', default: false, required: false, description: '是否原地操作（节省内存）' },
  ],
  inputPorts: 1,
  outputPorts: 1,
  color: '#10b981',
};

export const Sigmoid: LayerSchema = {
  type: 'Sigmoid',
  label: 'Sigmoid 激活函数',
  category: 'activation',
  module: 'nn.Sigmoid',
  params: [],
  inputPorts: 1,
  outputPorts: 1,
  color: '#10b981',
};

export const Tanh: LayerSchema = {
  type: 'Tanh',
  label: 'Tanh 激活函数',
  category: 'activation',
  module: 'nn.Tanh',
  params: [],
  inputPorts: 1,
  outputPorts: 1,
  color: '#10b981',
};

export const Softmax: LayerSchema = {
  type: 'Softmax',
  label: 'Softmax 归一化指数',
  category: 'activation',
  module: 'nn.Softmax',
  params: [
    { name: 'dim', type: 'int', default: 1, required: false, description: '计算Softmax的维度（通常为1，即类别维度）' },
  ],
  inputPorts: 1,
  outputPorts: 1,
  color: '#10b981',
};
