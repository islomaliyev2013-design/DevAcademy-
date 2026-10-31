import React, { useState } from 'react';
import {
  Play,
  Save,
  FilePlus,
  FolderPlus,
  Eye,
  EyeOff,
  Terminal as TerminalIcon,
  Settings,
  Sparkles,
  Maximize2,
  Minimize2,
  FolderOpen,
  Edit2,
  Check,
  Code2,
} from 'lucide-react';

export function IDEHeader({
  projectName = 'DevAcademy Project',
  onRenameProject,
  onCreateFile,
  onCreateFolder,
  onSave,
  onRun,
  hasUnsavedChanges = false,
  showPreview = true,
  onTogglePreview,
  showTerminal = true,
  onToggleTerminal,
  showAIMentor = false,
  onToggleAIMentor,
  onOpenSettings,
  onOpenTemplates,
  isFullscreen = false,
  onToggleFullscreen,
  isPython = false,
  isRunning = false,
}) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(projectName);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (tempName.trim()) {
      onRenameProject(tempName.trim());
    }
    setIsEditingName(false);
  };

  return (
    <header className="h-11 px-3 bg-[#2d2d2d] border-b border-[#1e1e1e] flex items-center justify-between gap-2 select-none text-slate-200">
      {/* Left: Brand, Project Name & Badge */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-sm font-bold text-xs">
            <Code2 className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-xs tracking-tight text-white hidden md:inline">
            DevAcademy<span className="text-brand-400">IDE</span>
          </span>
        </div>

        <div className="h-4 w-[1px] bg-slate-700 hidden sm:block" />

        {/* Project Name & Edit */}
        {isEditingName ? (
          <form onSubmit={handleNameSubmit} className="flex items-center gap-1">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              autoFocus
              onBlur={handleNameSubmit}
              className="px-2 py-0.5 text-xs bg-[#1e1e1e] border border-brand-500 rounded text-white focus:outline-none font-mono"
            />
            <button
              type="submit"
              className="p-1 rounded text-emerald-400 hover:bg-slate-700"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <div
            onClick={() => {
              setTempName(projectName);
              setIsEditingName(true);
            }}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-[#383838] cursor-pointer group transition"
            title="Click to rename project"
          >
            <span className="text-xs font-semibold text-slate-200 truncate max-w-[160px]">
              {projectName}
            </span>
            <Edit2 className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}

        {/* Backend / Framework Indicator Badge */}
        {isPython ? (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 hidden lg:inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Python Backend
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-950/80 text-brand-400 border border-brand-800/60 hidden lg:inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
            Frontend App
          </span>
        )}
      </div>

      {/* Center: File & Project Action Buttons */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onCreateFile(null)}
          title="New File"
          className="flex items-center gap-1 px-2.5 py-1 text-xs rounded bg-[#383838] hover:bg-[#444444] text-slate-200 transition font-medium"
        >
          <FilePlus className="w-3.5 h-3.5 text-brand-400" />
          <span className="hidden sm:inline">New File</span>
        </button>

        <button
          type="button"
          onClick={() => onCreateFolder(null)}
          title="New Folder"
          className="flex items-center gap-1 px-2.5 py-1 text-xs rounded bg-[#383838] hover:bg-[#444444] text-slate-200 transition font-medium"
        >
          <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">New Folder</span>
        </button>

        <button
          type="button"
          onClick={onOpenTemplates}
          title="Templates & Starter Projects"
          className="flex items-center gap-1 px-2.5 py-1 text-xs rounded bg-[#383838] hover:bg-[#444444] text-slate-200 transition font-medium"
        >
          <FolderOpen className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden md:inline">Templates</span>
        </button>

        <div className="h-4 w-[1px] bg-slate-700 mx-1" />

        {/* Save Button */}
        <button
          type="button"
          onClick={onSave}
          title="Save Project (Ctrl+S)"
          className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded font-medium transition ${
            hasUnsavedChanges
              ? 'bg-amber-600/90 hover:bg-amber-600 text-white shadow-sm'
              : 'bg-[#383838] hover:bg-[#444444] text-slate-300'
          }`}
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save</span>
          {hasUnsavedChanges && (
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          )}
        </button>

        {/* Run Button (Primary Action) */}
        <button
          type="button"
          onClick={onRun}
          disabled={isRunning}
          title="Run Code (Ctrl+Enter)"
          className="flex items-center gap-1.5 px-3.5 py-1 text-xs rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition shadow-sm shadow-emerald-950/40 disabled:opacity-50"
        >
          <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-pulse' : ''}`} />
          <span>{isPython ? 'Run Python' : 'Run'}</span>
          <span className="text-[10px] text-emerald-200 font-mono hidden xl:inline">^↵</span>
        </button>
      </div>

      {/* Right: Panels & View Controls */}
      <div className="flex items-center gap-1">
        {/* Preview Panel Toggle */}
        <button
          type="button"
          onClick={onTogglePreview}
          title={showPreview ? 'Hide Preview' : 'Show Live Preview'}
          className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded transition ${
            showPreview
              ? 'bg-brand-600 text-white font-medium'
              : 'bg-[#383838] text-slate-300 hover:bg-[#444444]'
          }`}
        >
          {showPreview ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span className="hidden lg:inline">Preview</span>
        </button>

        {/* Terminal Toggle */}
        <button
          type="button"
          onClick={onToggleTerminal}
          title={showTerminal ? 'Hide Terminal' : 'Show Integrated Terminal'}
          className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded transition ${
            showTerminal
              ? 'bg-slate-700 text-white font-medium'
              : 'bg-[#383838] text-slate-300 hover:bg-[#444444]'
          }`}
        >
          <TerminalIcon className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Terminal</span>
        </button>

        {/* AI Mentor Toggle */}
        <button
          type="button"
          onClick={onToggleAIMentor}
          title="Toggle DevAcademy AI Mentor"
          className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition ${
            showAIMentor
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
              : 'bg-[#383838] text-slate-300 hover:bg-[#444444]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden xl:inline">AI Mentor</span>
        </button>

        {/* Settings */}
        <button
          type="button"
          onClick={onOpenSettings}
          title="IDE Settings"
          className="p-1.5 rounded bg-[#383838] hover:bg-[#444444] text-slate-300 hover:text-white transition"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen IDE'}
          className="p-1.5 rounded bg-[#383838] hover:bg-[#444444] text-slate-300 hover:text-white transition"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  );
}
