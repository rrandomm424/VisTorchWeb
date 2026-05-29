import { useModelStore } from '../../store/useModelStore';
import { getSchema } from '../../registry';
import type { ParamDef } from '../../registry';

export default function ParamEditor() {
  const selectedNodeId = useModelStore(s => s.selectedNodeId);
  const nodes = useModelStore(s => s.nodes);
  const updateNodeParams = useModelStore(s => s.updateNodeParams);
  const renameNodeVariable = useModelStore(s => s.renameNodeVariable);
  const removeNode = useModelStore(s => s.removeNode);
  const selectNode = useModelStore(s => s.selectNode);

  if (!selectedNodeId) return null;

  const node = nodes.find(n => n.id === selectedNodeId);
  if (!node) return null;

  const schema = getSchema(node.data.layerType);
  if (!schema) return null;

  const handleParamChange = (paramName: string, value: unknown) => {
    updateNodeParams(selectedNodeId, { [paramName]: value });
  };

  const renderInput = (param: ParamDef) => {
    const value = node.data.params[param.name];

    if (param.type === 'bool') {
      return (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={value as boolean}
            onChange={(e) => handleParamChange(param.name, e.target.checked)}
            className="w-4 h-4 rounded border-slate-300"
          />
          <span className="text-xs text-slate-500">{value ? '是' : '否'}</span>
        </label>
      );
    }

    if (param.type === 'tuple') {
      const arr = (value as number[]) || [0, 0];
      return (
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={arr[0]}
            min={param.min}
            max={param.max}
            onChange={(e) => handleParamChange(param.name, [parseInt(e.target.value) || 0, arr[1]])}
            className="w-16 px-2 py-1 text-sm border border-slate-300 rounded"
          />
          <span className="text-slate-400 text-xs">x</span>
          <input
            type="number"
            value={arr[1]}
            min={param.min}
            max={param.max}
            onChange={(e) => handleParamChange(param.name, [arr[0], parseInt(e.target.value) || 0])}
            className="w-16 px-2 py-1 text-sm border border-slate-300 rounded"
          />
        </div>
      );
    }

    if (param.type === 'select' && param.options) {
      return (
        <select
          value={value as string}
          onChange={(e) => handleParamChange(param.name, e.target.value)}
          className="w-full px-2 py-1 text-sm border border-slate-300 rounded"
        >
          {param.options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }

    if (param.type === 'int') {
      return (
        <input
          type="number"
          value={value as number}
          min={param.min}
          max={param.max}
          step={1}
          onChange={(e) => handleParamChange(param.name, parseInt(e.target.value) || 0)}
          className="w-full px-2 py-1 text-sm border border-slate-300 rounded"
        />
      );
    }

    if (param.type === 'float') {
      return (
        <input
          type="number"
          value={value as number}
          min={param.min}
          max={param.max}
          step={0.01}
          onChange={(e) => handleParamChange(param.name, parseFloat(e.target.value) || 0)}
          className="w-full px-2 py-1 text-sm border border-slate-300 rounded"
        />
      );
    }

    return (
      <input
        type="text"
        value={String(value ?? '')}
        onChange={(e) => handleParamChange(param.name, e.target.value)}
        className="w-full px-2 py-1 text-sm border border-slate-300 rounded"
      />
    );
  };

  return (
    <div className="absolute top-4 right-4 z-50 w-72 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden">
      <div
        className="px-4 py-2 text-white text-sm font-medium flex justify-between items-center"
        style={{ backgroundColor: schema.color }}
      >
        <span>{schema.label}</span>
        <button
          onClick={() => selectNode(null)}
          className="text-white/80 hover:text-white text-lg leading-none"
        >
          ×
        </button>
      </div>

      <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
        <div>
          <label className="text-xs text-slate-500 block mb-1">变量名</label>
          <input
            type="text"
            value={node.data.variableName}
            onChange={(e) => renameNodeVariable(selectedNodeId, e.target.value)}
            className="w-full px-2 py-1 text-sm border border-slate-300 rounded font-mono"
          />
        </div>

        {schema.params.map(param => (
          <div key={param.name}>
            <label className="text-xs text-slate-500 block mb-1">
              {param.name}
              {param.required && <span className="text-red-400 ml-0.5">*</span>}
            </label>
            <div className="text-xs text-slate-400 mb-1">{param.description}</div>
            {renderInput(param)}
          </div>
        ))}

        <button
          onClick={() => { removeNode(selectedNodeId); selectNode(null); }}
          className="w-full mt-2 px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors"
        >
          删除此层
        </button>
      </div>
    </div>
  );
}
