import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { LayerNodeData } from '../../store/useModelStore';
import { getSchema } from '../../registry';
import { useModelStore } from '../../store/useModelStore';

function LayerNode({ id, data, selected }: NodeProps<LayerNodeData>) {
  const selectNode = useModelStore(s => s.selectNode);
  const schema = getSchema(data.layerType);
  const color = schema?.color || '#64748b';

  const summaryParams = schema?.params
    .filter(p => p.required)
    .slice(0, 3)
    .map(p => {
      const val = data.params[p.name];
      if (Array.isArray(val)) return `${(val as number[]).join('x')}`;
      return String(val);
    })
    .join(', ');

  return (
    <div
      className={`rounded-lg shadow-md border-2 bg-white min-w-[160px] transition-all ${
        selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200'
      }`}
      onClick={() => selectNode(id)}
    >
      <Handle type="target" position={Position.Top} className="!bg-slate-400 !w-3 !h-3" />
      <div
        className="px-3 py-1.5 rounded-t-md text-white text-xs font-medium"
        style={{ backgroundColor: color }}
      >
        {data.layerType}
      </div>
      <div className="px-3 py-2">
        <div className="text-xs text-slate-500 font-mono">{data.variableName}</div>
        {summaryParams && (
          <div className="text-xs text-slate-400 mt-0.5">{summaryParams}</div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-slate-400 !w-3 !h-3" />
    </div>
  );
}

export default memo(LayerNode);
