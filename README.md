# VisTorchWeb

神经网络可视化搭建工具。拖拽搭建网络结构，自动生成 PyTorch 代码，支持双向同步编辑。

## 功能

- 🧩 **拖拽搭建**：左侧工具栏拖拽 Conv2d、Linear、LSTM 等模块到画布，连线构建网络
- 📝 **双向同步**：画布操作实时生成代码，代码编辑同步更新画布
- 📖 **参数说明**：每个参数附带详细中文说明，适合学习
- 📦 **模板预设**：预置 LeNet、VGG16、RNN、Transformer 等完整网络模板
- 💬 **大模型助手**：对当前网络提问或提修改需求
- 🎯 **导出运行**：导出可运行的 `.py` 文件

## 技术栈

- 前端：React + TypeScript + Tailwind CSS + Zustand
- 后端：Node.js
- 代码生成：PyTorch
