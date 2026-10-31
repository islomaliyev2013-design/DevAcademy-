import React, { useState } from 'react';
import { FileIcon } from './FileIcon';
import {
  FilePlus,
  FolderPlus,
  ChevronRight,
  ChevronDown,
  Trash2,
  Edit2,
  MoreVertical,
  FolderMinus,
  Sparkles,
  FileCode,
} from 'lucide-react';

export function FileExplorer({
  files = [],
  activeFileId = null,
  projectName = 'DevAcademy Project',
  onSelectFile,
  onCreateFile,
  onCreateFolder,
  onRenameItem,
  onDeleteItem,
}) {
  const [openFolders, setOpenFolders] = useState({});
  const [hoveredItemId, setHoveredItemId] = useState(null);

  const toggleFolder = (folderId, e) => {
    e?.stopPropagation();
    setOpenFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const collapseAllFolders = () => {
    setOpenFolders({});
  };

  // Group items by parentId
  const getChildren = (parentId) => {
    return files
      .filter((item) => (parentId === null ? !item.parentId : item.parentId === parentId))
      .sort((a, b) => {
        // Folders first, then alphabetical
        if (a.type === 'folder' && b.type !== 'folder') return -1;
        if (a.type !== 'folder' && b.type === 'folder') return 1;
        return a.name.localeCompare(b.name);
      });
  };

  const renderTree = (parentId = null, depth = 0) => {
    const items = getChildren(parentId);

    if (items.length === 0 && parentId === null) {
      return (
        <div className="p-4 text-center text-xs text-slate-500">
          <p>No files yet.</p>
          <div className="mt-2 flex justify-center gap-2">
            <button
              onClick={() => onCreateFile(null)}
              className="px-2 py-1 bg-slate-800 text-slate-300 hover:text-white rounded text-[11px] flex items-center gap-1"
            >
              <FilePlus className="w-3 h-3 text-brand-400" />
              <span>New File</span>
            </button>
          </div>
        </div>
      );
    }

    return items.map((item) => {
      const isFolder = item.type === 'folder';
      const isOpen = !!openFolders[item.id];
      const isActive = item.id === activeFileId;
      const isHovered = hoveredItemId === item.id;

      return (
        <div key={item.id} className="select-none">
          <div
            onMouseEnter={() => setHoveredItemId(item.id)}
            onMouseLeave={() => setHoveredItemId(null)}
            onClick={() => {
              if (isFolder) {
                toggleFolder(item.id);
              } else {
                onSelectFile(item.id);
              }
            }}
            style={{ paddingLeft: `${depth * 14 + 12}px` }}
            className={`group relative flex items-center justify-between py-1.5 pr-2 cursor-pointer text-xs font-mono transition-colors ${
              isActive
                ? 'bg-[#37373d] text-white font-medium border-l-2 border-brand-500'
                : 'text-slate-300 hover:bg-[#2a2d2e] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-2">
              {isFolder ? (
                <button
                  type="button"
                  onClick={(e) => toggleFolder(item.id, e)}
                  className="p-0.5 text-slate-400 hover:text-white"
                >
                  {isOpen ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                </button>
              ) : (
                <span className="w-3.5" />
              )}

              <FileIcon name={item.name} isFolder={isFolder} isOpen={isOpen} className="w-4 h-4" />

              <span className="truncate" title={item.name}>
                {item.name}
              </span>

              {item.isDirty && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 ml-1" title="Unsaved changes" />
              )}
            </div>

            {/* Hover Actions */}
            <div
              className={`flex items-center gap-1 shrink-0 ${
                isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              } transition-opacity`}
              onClick={(e) => e.stopPropagation()}
            >
              {isFolder && (
                <>
                  <button
                    type="button"
                    title="New File in Folder"
                    onClick={() => onCreateFile(item.id)}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700/60"
                  >
                    <FilePlus className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    title="New Subfolder"
                    onClick={() => onCreateFolder(item.id)}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700/60"
                  >
                    <FolderPlus className="w-3 h-3" />
                  </button>
                </>
              )}
              <button
                type="button"
                title="Rename"
                onClick={() => onRenameItem(item)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700/60"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button
                type="button"
                title="Delete"
                onClick={() => onDeleteItem(item)}
                className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-950/40"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Children items */}
          {isFolder && isOpen && renderTree(item.id, depth + 1)}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#252526] text-slate-300 border-r border-[#1e1e1e] select-none">
      {/* Explorer Header */}
      <div className="h-9 px-3 flex items-center justify-between border-b border-[#1e1e1e] bg-[#252526]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Explorer
          </span>
          <span className="text-[11px] text-slate-500 font-mono truncate max-w-[100px]">
            {projectName}
          </span>
        </div>

        {/* Global Explorer Actions */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            title="New File (Root)"
            onClick={() => onCreateFile(null)}
            className="p-1 rounded hover:bg-[#37373d] text-slate-400 hover:text-white transition"
          >
            <FilePlus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="New Folder (Root)"
            onClick={() => onCreateFolder(null)}
            className="p-1 rounded hover:bg-[#37373d] text-slate-400 hover:text-white transition"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Collapse All Folders"
            onClick={collapseAllFolders}
            className="p-1 rounded hover:bg-[#37373d] text-slate-400 hover:text-white transition"
          >
            <FolderMinus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Project Root Label */}
      <div className="px-3 py-1.5 text-[10px] uppercase font-semibold text-slate-500 flex items-center justify-between bg-[#1f1f20]">
        <span className="truncate">WORKSPACE / {projectName}</span>
        <span className="text-[9px] bg-slate-800 text-slate-400 px-1 rounded">
          {files.filter((f) => f.type === 'file').length} files
        </span>
      </div>

      {/* File Tree List */}
      <div className="flex-1 overflow-y-auto py-1">
        {renderTree(null, 0)}
      </div>
    </div>
  );
}
