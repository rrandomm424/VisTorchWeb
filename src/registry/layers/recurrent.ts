import { LayerSchema } from '../types';

export const LSTM: LayerSchema = {
  type: 'LSTM',
  label: 'LSTM 长短期记忆',
  category: 'recurrent',
  module: 'nn.LSTM',
  params: [
    { name: 'input_size', type: 'int', default: 128, required: true, description: '输入特征维度', min: 1 },
    { name: 'hidden_size', type: 'int', default: 256, required: true, description: '隐藏状态维度（隐藏层神经元数量）', min: 1 },
    { name: 'num_layers', type: 'int', default: 1, required: false, description: '堆叠的LSTM层数', min: 1 },
    { name: 'batch_first', type: 'bool', default: true, required: false, description: '输入格式是否为(batch, seq, feature)' },
    { name: 'bidirectional', type: 'bool', default: false, required: false, description: '是否使用双向LSTM' },
    { name: 'dropout', type: 'float', default: 0, required: false, description: '层间Dropout比例（多层时有效）', min: 0, max: 1 },
  ],
  inputPorts: 1,
  outputPorts: 1,
  color: '#f97316',
};

export const GRU: LayerSchema = {
  type: 'GRU',
  label: 'GRU 门控循环单元',
  category: 'recurrent',
  module: 'nn.GRU',
  params: [
    { name: 'input_size', type: 'int', default: 128, required: true, description: '输入特征维度', min: 1 },
    { name: 'hidden_size', type: 'int', default: 256, required: true, description: '隐藏状态维度', min: 1 },
    { name: 'num_layers', type: 'int', default: 1, required: false, description: '堆叠的GRU层数', min: 1 },
    { name: 'batch_first', type: 'bool', default: true, required: false, description: '输入格式是否为(batch, seq, feature)' },
    { name: 'bidirectional', type: 'bool', default: false, required: false, description: '是否使用双向GRU' },
    { name: 'dropout', type: 'float', default: 0, required: false, description: '层间Dropout比例（多层时有效）', min: 0, max: 1 },
  ],
  inputPorts: 1,
  outputPorts: 1,
  color: '#f97316',
};
