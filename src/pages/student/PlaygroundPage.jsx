import React from 'react';
import { CodePlayground } from '../../features/playground/CodePlayground';

export function PlaygroundPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            DevAcademy Online IDE & Code Playground
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Professional development environment inspired by Antigravity IDE & VS Code. Multi-file tree explorer, Monaco editor, real Python backend execution, and live HTML/CSS/JS sandbox.
          </p>
        </div>
      </div>

      <CodePlayground />
    </div>
  );
}
