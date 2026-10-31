import React from 'react';
import { GitBranch, AlertCircle, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { getLanguageFromFilename } from '../types';

export function StatusBar({
  activeFile = null,
  cursorPosition = { lineNumber: 1, column: 1 },
  pyodideReady = false,
  isPython = false,
  errorCount = 0,
}) {
  const language = activeFile ? getLanguageFromFilename(activeFile.name) : 'Plain Text';

  return (
    <footer className="h-6 px-3 bg-[#007acc] text-white flex items-center justify-between text-[11px] font-mono select-none z-10">
      {/* Left items */}
      <div className="flex items-center gap-3">
        {/* Branch */}
        <div className="flex items-center gap-1 hover:bg-white/10 px-1 py-0.5 rounded cursor-pointer">
          <GitBranch className="w-3 h-3" />
          <span>main</span>
        </div>

        {/* Diagnostics */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 hover:bg-white/10 px-1 py-0.5 rounded cursor-pointer">
            <AlertCircle className="w-3 h-3" />
            <span>{errorCount}</span>
          </div>
        </div>

        {/* Cursor Position */}
        {activeFile && (
          <div className="hover:bg-white/10 px-1 py-0.5 rounded cursor-pointer hidden sm:block">
            Ln {cursorPosition.lineNumber}, Col {cursorPosition.column}
          </div>
        )}
      </div>

      {/* Right items */}
      <div className="flex items-center gap-3">
        {/* Python Runtime Status */}
        {isPython && (
          <div className="flex items-center gap-1 hover:bg-white/10 px-1.5 py-0.5 rounded text-[10px] bg-white/15">
            <Zap className="w-3 h-3 text-amber-300" />
            <span>{pyodideReady ? 'Pyodide 3.11 Ready' : 'Python WebAssembly'}</span>
          </div>
        )}

        <div className="hover:bg-white/10 px-1 py-0.5 rounded cursor-pointer hidden md:block">
          Spaces: 2
        </div>

        <div className="hover:bg-white/10 px-1 py-0.5 rounded cursor-pointer hidden md:block">
          UTF-8
        </div>

        <div className="hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer font-semibold uppercase">
          {language}
        </div>

        <div className="flex items-center gap-1 hover:bg-white/10 px-1.5 py-0.5 rounded hidden sm:flex">
          <ShieldCheck className="w-3 h-3 text-emerald-300" />
          <span>DevAcademy IDE</span>
        </div>
      </div>
    </footer>
  );
}
