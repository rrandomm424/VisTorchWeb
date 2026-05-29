import { LayerSchema } from '../types';

export const BatchNorm1d: LayerSchema = {
  type: 'BatchNorm1d',
  label: 'BatchNorm1d 一维批归一化',
  category: 'normalization',
  module: 'nn.BatchNorm1d',
  params: [
    { name: 'num_features', type: 'int', default: 64, required: true, description: '特征数（输入的通道数或特征维度）', min: 1 },
    { name: 'momentum', type: 'float', default: 0.1, required: false, description: '动量值（用于计算运行均值和方差）', min: 0, max: 1 },
    { name: 'eps', type: 'float', default: 1e-5, required: false, description: '防止除零的极小值' },
  ],
  inputPorts: 1,
  outputPorts: 1,
  color: '#06b6d4',
};

export const BatchNorm2d: LayerSchema = {
  type: 'BatchNorm2d',
  label: 'BatchNorm2d 二维批归一化',
  category: 'normalization',
  module: 'nn.BatchNorm2d',
  params: [
    { name: 'num_features', type: 'int', default: 64, required: true, description: '特征数（输入的通道数）', min: 1 },
    { name: 'momentum', type: 'float', default: 0.1, required: false, description: '动量值（用于计算运行均值和方差）', min: 0, max: 1 },
    { name: 'eps', type: 'float', default: 1e-5, required: false, description: '防止除零的极小值' },
  ],
  inputPorts: 1,
  outputPorts: 1,
  color: '#06b6d4',
};
