import { LayerSchema, TemplateDefinition, LayerCategory } from './types';
import { Conv2d } from './layers/conv';
import { MaxPool2d, AvgPool2d } from './layers/pooling';
import { Linear } from './layers/linear';
import { BatchNorm1d, BatchNorm2d } from './layers/normalization';
import { Dropout } from './layers/dropout';
import { ReLU, Sigmoid, Tanh, Softmax } from './layers/activation';
import { Flatten } from './layers/flatten';
import { LSTM, GRU } from './layers/recurrent';
import { MultiheadAttention, TransformerEncoderLayer } from './layers/transformer';
import { cnnTemplate } from './templates/cnn';
import { rnnTemplate, lstmTemplate } from './templates/rnn';
import { transformerTemplate } from './templates/transformer';

export const LAYER_REGISTRY: Map<string, LayerSchema> = new Map([
  ['Conv2d', Conv2d],
  ['MaxPool2d', MaxPool2d],
  ['AvgPool2d', AvgPool2d],
  ['Linear', Linear],
  ['BatchNorm1d', BatchNorm1d],
  ['BatchNorm2d', BatchNorm2d],
  ['Dropout', Dropout],
  ['ReLU', ReLU],
  ['Sigmoid', Sigmoid],
  ['Tanh', Tanh],
  ['Softmax', Softmax],
  ['Flatten', Flatten],
  ['LSTM', LSTM],
  ['GRU', GRU],
  ['MultiheadAttention', MultiheadAttention],
  ['TransformerEncoderLayer', TransformerEncoderLayer],
]);

export const TEMPLATE_REGISTRY: Map<string, TemplateDefinition> = new Map([
  ['cnn-lenet', cnnTemplate],
  ['rnn-simple', rnnTemplate],
  ['lstm-classifier', lstmTemplate],
  ['transformer-encoder', transformerTemplate],
]);

export function getSchema(type: string): LayerSchema | undefined {
  return LAYER_REGISTRY.get(type);
}

export function getLayersByCategory(): Map<LayerCategory, LayerSchema[]> {
  const map = new Map<LayerCategory, LayerSchema[]>();
  for (const schema of LAYER_REGISTRY.values()) {
    const list = map.get(schema.category) || [];
    list.push(schema);
    map.set(schema.category, list);
  }
  return map;
}

export const CATEGORY_LABELS: Record<LayerCategory, string> = {
  convolution: '卷积层',
  pooling: '池化层',
  linear: '全连接层',
  normalization: '归一化层',
  dropout: '正则化',
  activation: '激活函数',
  reshape: '形状变换',
  recurrent: '循环网络',
  attention: '注意力机制',
};

export { type LayerSchema, type TemplateDefinition, type ParamDef, type LayerCategory } from './types';
