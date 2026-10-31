import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { FileIcon } from './FileIcon';
import { getLanguageFromFilename } from '../types';
import { X, Sparkles, Play, Eye, Maximize2, Minimize2, Code2 } from 'lucide-react';

export function EditorArea({
  openFiles = [],
  activeFileId = null,
  activeFile = null,
  onSelectTab,
  onCloseTab,
  onCodeChange,
  onSave,
  onCursorChange,
  editorSettings = {
    fontSize: 14,
    tabSize: 2,
    wordWrap: 'on',
    minimap: false,
  },
}) {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Track cursor position for status bar
    editor.onDidChangeCursorPosition((e) => {
      if (onCursorChange) {
        onCursorChange({
          lineNumber: e.position.lineNumber,
          column: e.position.column,
        });
      }
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (onSave) onSave();
    });

    // Focus editor
    editor.focus();
  };

  // If no files open
  if (!activeFile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#1e1e1e] text-slate-400 select-none p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mb-4 text-brand-400 shadow-inner">
          <Code2 className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-200 mb-1">No file is currently open</h3>
        <p className="text-xs text-slate-500 max-w-sm mb-4">
          Select a file from the explorer on the left or create a new one to begin coding.
        </p>
        <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
          <span><kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">S</kbd> to save</span>
          <span>•</span>
          <span><kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">Enter</kbd> to run</span>
        </div>
      </div>
    );
  }

  const currentLanguage = getLanguageFromFilename(activeFile.name);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1e1e1e] overflow-hidden">
      {/* Editor Tabs Header */}
      <div className="h-9 bg-[#252526] flex items-center overflow-x-auto border-b border-[#1e1e1e] scrollbar-none select-none">
        <div className="flex items-center h-full">
          {openFiles.map((file) => {
            const isActive = file.id === activeFileId;
            return (
              <div
                key={file.id}
                onClick={() => onSelectTab(file.id)}
                className={`group flex items-center gap-2 h-full px-3.5 border-r border-[#1e1e1e] cursor-pointer text-xs font-mono transition-all relative ${
                  isActive
                    ? 'bg-[#1e1e1e] text-white font-medium shadow-sm'
                    : 'bg-[#2d2d2d] text-slate-400 hover:bg-[#282828] hover:text-slate-200'
                }`}
              >
                {/* Active Tab Accent Line */}
                {isActive && (
                  <span className="absolute top-0 left-0 right-0 h-[2px] bg-brand-500" />
                )}

                <FileIcon name={file.name} isFolder={false} className="w-3.5 h-3.5" />

                <span className="truncate max-w-[140px]" title={file.name}>
                  {file.name}
                </span>

                {/* Dirty indicator / Close button */}
                <div className="flex items-center ml-1">
                  {file.isDirty ? (
                    <button
                      type="button"
                      title="Unsaved changes (Click to close)"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloseTab(file.id);
                      }}
                      className="w-4 h-4 rounded-full flex items-center justify-center text-amber-400 hover:bg-slate-700 hover:text-white"
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-400 group-hover:hidden" />
                      <X className="w-3 h-3 hidden group-hover:block" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      title="Close Tab"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloseTab(file.id);
                      }}
                      className="w-4 h-4 rounded flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 w-full h-full relative">
        <Editor
          height="100%"
          language={currentLanguage}
          value={activeFile.content || ''}
          theme="vs-dark"
          onMount={handleEditorDidMount}
          onChange={(val) => onCodeChange(activeFile.id, val ?? '')}
          options={{
            fontSize: editorSettings.fontSize || 14,
            tabSize: editorSettings.tabSize || 2,
            wordWrap: editorSettings.wordWrap || 'on',
            minimap: { enabled: !!editorSettings.minimap },
            bracketPairColorization: { enabled: true },
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            formatOnPaste: true,
            formatOnType: true,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            folding: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
            fontLigatures: true,
            renderWhitespace: 'selection',
            smoothScrolling: true,
          }}
        />
      </div>
    </div>
  );
}
