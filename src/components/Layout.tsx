import { ReactNode } from 'react';

interface LayoutProps {
  sidebar: ReactNode;
  canvas: ReactNode;
  codePanel: ReactNode;
}

export default function Layout({ sidebar, canvas, codePanel }: LayoutProps) {
  return (
    <div className="flex flex-col h-screen w-screen">
      <header className="h-12 bg-slate-800 text-white flex items-center px-4 shrink-0">
        <h1 className="text-lg font-bold">VisTorch</h1>
        <span className="ml-3 text-sm text-slate-400">神经网络可视化构建器</span>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-60 bg-slate-50 border-r border-slate-200 overflow-y-auto shrink-0">
          {sidebar}
        </aside>
        <main className="flex-1 relative">
          {canvas}
        </main>
        <aside className="w-[420px] border-l border-slate-200 shrink-0">
          {codePanel}
        </aside>
      </div>
    </div>
  );
}
