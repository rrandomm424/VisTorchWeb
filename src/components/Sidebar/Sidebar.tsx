import { getLayersByCategory, CATEGORY_LABELS, TEMPLATE_REGISTRY } from '../../registry';
import type { LayerCategory } from '../../registry';

const categoryOrder: LayerCategory[] = [
  'convolution', 'pooling', 'linear', 'normalization',
  'dropout', 'activation', 'reshape', 'recurrent', 'attention',
];

export default function Sidebar() {
  const layersByCategory = getLayersByCategory();
  const templates = Array.from(TEMPLATE_REGISTRY.values());

  const onLayerDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('application/vistorch-layer', type);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onTemplateDragStart = (e: React.DragEvent, templateId: string) => {
    e.dataTransfer.setData('application/vistorch-template', templateId);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="p-3">
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">网络模板</h3>
        <div className="space-y-1">
          {templates.map(t => (
            <div
              key={t.id}
              draggable
              onDragStart={(e) => onTemplateDragStart(e, t.id)}
              className="w-full text-left px-3 py-2 rounded text-sm bg-white border border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-grab active:cursor-grabbing"
            >
              <div className="font-medium text-slate-700">{t.name}</div>
              <div className="text-xs text-slate-400 mt-0.5">{t.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">网络组件</h3>
        {categoryOrder.map(cat => {
          const layers = layersByCategory.get(cat);
          if (!layers) return null;
          return (
            <div key={cat} className="mb-3">
              <div className="text-xs text-slate-400 mb-1 font-medium">{CATEGORY_LABELS[cat]}</div>
              <div className="space-y-1">
                {layers.map(layer => (
                  <div
                    key={layer.type}
                    draggable
                    onDragStart={(e) => onLayerDragStart(e, layer.type)}
                    className="px-3 py-1.5 rounded text-sm bg-white border border-slate-200 cursor-grab hover:shadow-sm hover:border-slate-300 transition-all active:cursor-grabbing"
                    style={{ borderLeftColor: layer.color, borderLeftWidth: '3px' }}
                  >
                    {layer.type}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
