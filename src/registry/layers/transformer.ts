import { LayerSchema } from '../types';

export const MultiheadAttention: LayerSchema = {
  type: 'MultiheadAttention',
  label: 'MultiheadAttention 多头注意力',
  category: 'attention',
  module: 'nn.MultiheadAttention',
  params: [
    { name: 'embed_dim', type: 'int', default: 512, required: true, description: '嵌入维度（模型的总维度）', min: 1 },
    { name: 'num_heads', type: 'int', default: 8, required: true, description: '注意力头数（embed_dim必须能被num_heads整除）', min: 1 },
    { name: 'dropout', type: 'float', default: 0.0, required: false, description: '注意力权重的Dropout比例', min: 0, max: 1 },
    { name: 'batch_first', type: 'bool', default: true, required: false, description: '输入格式是否为(batch, seq, feature)' },
  ],
  inputPorts: 1,
  outputPorts: 1,
  color: '#e11d48',
};

export const TransformerEncoderLayer: LayerSchema = {
  type: 'TransformerEncoderLayer',
  label: 'TransformerEncoder 编码器层',
  category: 'attention',
  module: 'nn.TransformerEncoderLayer',
  params: [
    { name: 'd_model', type: 'int', default: 512, required: true, description: '模型维度（输入和输出的特征大小）', min: 1 },
    { name: 'nhead', type: 'int', default: 8, required: true, description: '多头注意力的头数', min: 1 },
    { name: 'dim_feedforward', type: 'int', default: 2048, required: false, description: '前馈网络的中间层维度', min: 1 },
    { name: 'dropout', type: 'float', default: 0.1, required: false, description: 'Dropout比例', min: 0, max: 1 },
    { name: 'batch_first', type: 'bool', default: true, required: false, description: '输入格式是否为(batch, seq, feature)' },
  ],
  inputPorts: 1,
  outputPorts: 1,
  color: '#e11d48',
};
