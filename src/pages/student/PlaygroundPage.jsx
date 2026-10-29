import React from 'react';
import { CodePlayground } from '../../features/playground/CodePlayground';

export function PlaygroundPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Interactive Code Playground
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Write HTML, modern CSS, and JavaScript. Run code in an isolated sandbox with real-time AI guidance.
          </p>
        </div>
      </div>

      <CodePlayground />
    </div>
  );
}
