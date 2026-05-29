import { LayerSchema } from '../types';

export const Conv2d: LayerSchema = {
  type: 'Conv2d',
  label: 'Conv2d 二维卷积',
  category: 'convolution',
  module: 'nn.Conv2d',
  params: [
    { name: 'in_channels', type: 'int', default: 3, required: true, description: '输入通道数（例如RGB图像为3）', min: 1 },
    { name: 'out_channels', type: 'int', default: 64, required: true, description: '输出通道数（卷积核的数量）', min: 1 },
    { name: 'kernel_size', type: 'tuple', default: [3, 3], required: true, description: '卷积核大小（高度, 宽度）' },
    { name: 'stride', type: 'tuple', default: [1, 1], required: false, description: '步幅大小（控制卷积核移动的步长）' },
    { name: 'padding', type: 'tuple', default: [0, 0], required: false, description: '填充大小（在输入边缘补零的像素数）' },
    { name: 'bias', type: 'bool', default: true, required: false, description: '是否添加偏置项' },
  ],
  inputPorts: 1,
  outputPorts: 1,
  color: '#3b82f6',
};
