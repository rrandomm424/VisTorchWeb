import { TemplateDefinition } from '../types';

export const cnnTemplate: TemplateDefinition = {
  id: 'cnn-lenet',
  name: 'CNN (LeNet-5)',
  description: '经典卷积神经网络，适用于图像分类任务',
  nodes: [
    { type: 'Conv2d', params: { in_channels: 1, out_channels: 6, kernel_size: [5, 5] }, position: { x: 300, y: 0 } },
    { type: 'ReLU', params: {}, position: { x: 300, y: 100 } },
    { type: 'MaxPool2d', params: { kernel_size: [2, 2] }, position: { x: 300, y: 200 } },
    { type: 'Conv2d', params: { in_channels: 6, out_channels: 16, kernel_size: [5, 5] }, position: { x: 300, y: 300 } },
    { type: 'ReLU', params: {}, position: { x: 300, y: 400 } },
    { type: 'MaxPool2d', params: { kernel_size: [2, 2] }, position: { x: 300, y: 500 } },
    { type: 'Flatten', params: {}, position: { x: 300, y: 600 } },
    { type: 'Linear', params: { in_features: 400, out_features: 120 }, position: { x: 300, y: 700 } },
    { type: 'ReLU', params: {}, position: { x: 300, y: 800 } },
    { type: 'Linear', params: { in_features: 120, out_features: 10 }, position: { x: 300, y: 900 } },
  ],
  edges: [
    { sourceIndex: 0, targetIndex: 1 },
    { sourceIndex: 1, targetIndex: 2 },
    { sourceIndex: 2, targetIndex: 3 },
    { sourceIndex: 3, targetIndex: 4 },
    { sourceIndex: 4, targetIndex: 5 },
    { sourceIndex: 5, targetIndex: 6 },
    { sourceIndex: 6, targetIndex: 7 },
    { sourceIndex: 7, targetIndex: 8 },
    { sourceIndex: 8, targetIndex: 9 },
  ],
};
