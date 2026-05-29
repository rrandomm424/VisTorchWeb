import { useRef, useCallback, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { useModelStore } from '../../store/useModelStore';
import { generateCode } from '../../codegen/generator';
import { parseCode } from '../../codegen/parser';

export default function CodePanel() {
  const nodes = useModelStore(s => s.nodes);
  const edges = useModelStore(s => s.edges);
  const className = useModelStore(s => s.className);
  const syncDirection = useModelStore(s => s.syncDirection);
  const setSyncDirection = useModelStore(s => s.setSyncDirection);
  const replaceModel = useModelStore(s => s.replaceModel);

  const editorRef = useRef<unknown>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isUpdatingFromCanvas = useRef(false);

  const code = generateCode(nodes, edges, className);

  useEffect(() => {
    if (syncDirection === 'code') return;
    if (!editorRef.current) return;

    isUpdatingFromCanvas.current = true;
    const editor = editorRef.current as { getValue: () => string; setValue: (v: string) => void };
    if (editor.getValue() !== code) {
      editor.setValue(code);
    }
    setTimeout(() => {
      isUpdatingFromCanvas.current = false;
    }, 50);
  }, [code, syncDirection]);

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.setValue(code);
  };

  const handleChange = useCallback((value: string | undefined) => {
    if (isUpdatingFromCanvas.current) return;
    if (syncDirection === 'canvas') return;
    if (!value) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setSyncDirection('code');
      const result = parseCode(value);
      if (result) {
        replaceModel(result.nodes, result.edges, result.className);
      }
      setTimeout(() => setSyncDirection(null), 100);
    }, 800);
  }, [syncDirection, setSyncDirection, replaceModel]);

  return (
    <div className="h-full flex flex-col">
      <div className="h-10 bg-slate-800 flex items-center px-4 shrink-0">
        <span className="text-sm text-slate-300">PyTorch 代码</span>
        <span className="ml-auto text-xs text-slate-500">自动同步</span>
      </div>
      <div className="flex-1">
        <Editor
          defaultLanguage="python"
          theme="vs-dark"
          onMount={handleEditorMount}
          onChange={handleChange}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            wordWrap: 'on',
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
          }}
        />
      </div>
    </div>
  );
}
