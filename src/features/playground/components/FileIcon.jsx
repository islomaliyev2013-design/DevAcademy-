import React from 'react';
import {
  FileCode,
  Folder,
  FolderOpen,
  FileText,
  FileJson,
  Terminal,
  Settings,
  HelpCircle,
} from 'lucide-react';

export function FileIcon({ name = '', isFolder = false, isOpen = false, className = 'w-4 h-4' }) {
  if (isFolder) {
    if (isOpen) {
      return <FolderOpen className={`${className} text-amber-400 shrink-0`} />;
    }
    return <Folder className={`${className} text-amber-400 shrink-0`} />;
  }

  const lower = name.toLowerCase();

  // Python
  if (lower.endsWith('.py')) {
    return (
      <svg
        className={`${className} shrink-0`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2C6.48 2 6 4.5 6 4.5V7H12V8H4C4 8 2 8.4 2 13.5C2 18.6 4.5 18.5 4.5 18.5H6.5V16C6.5 14.5 7.7 13.5 9 13.5H15C16.3 13.5 17 12.3 17 11V4.5C17 4.5 17.5 2 12 2ZM9 4.5C9.55 4.5 10 4.95 10 5.5C10 6.05 9.55 6.5 9 6.5C8.45 6.5 8 6.05 8 5.5C8 4.95 8.45 4.5 9 4.5Z"
          fill="#38BDF8"
        />
        <path
          d="M12 22C17.52 22 18 19.5 18 19.5V17H12V16H20C20 16 22 15.6 22 10.5C22 5.4 19.5 5.5 19.5 5.5H17.5V8C17.5 9.5 16.3 10.5 15 10.5H9C7.7 10.5 7 11.7 7 13V19.5C7 19.5 6.5 22 12 22ZM15 19.5C14.45 19.5 14 19.05 14 18.5C14 17.95 14.45 17.5 15 17.5C15.55 17.5 16 17.95 16 18.5C16 19.05 15.55 19.5 15 19.5Z"
          fill="#FACC15"
        />
      </svg>
    );
  }

  // HTML
  if (lower.endsWith('.html') || lower.endsWith('.htm')) {
    return <FileCode className={`${className} text-orange-500 shrink-0`} />;
  }

  // CSS
  if (lower.endsWith('.css') || lower.endsWith('.scss') || lower.endsWith('.sass')) {
    return <FileCode className={`${className} text-sky-400 shrink-0`} />;
  }

  // JavaScript
  if (lower.endsWith('.js') || lower.endsWith('.mjs')) {
    return (
      <span className={`${className} font-bold text-[10px] bg-amber-400 text-slate-900 rounded-[2px] flex items-center justify-center shrink-0 leading-none`}>
        JS
      </span>
    );
  }

  // TypeScript / JSX / TSX
  if (lower.endsWith('.ts') || lower.endsWith('.tsx') || lower.endsWith('.jsx')) {
    return (
      <span className={`${className} font-bold text-[10px] bg-blue-500 text-white rounded-[2px] flex items-center justify-center shrink-0 leading-none`}>
        TS
      </span>
    );
  }

  // JSON
  if (lower.endsWith('.json')) {
    return <FileJson className={`${className} text-yellow-400 shrink-0`} />;
  }

  // Markdown
  if (lower.endsWith('.md') || lower.endsWith('.markdown')) {
    return <FileText className={`${className} text-indigo-400 shrink-0`} />;
  }

  // TXT / Requirements
  if (lower.endsWith('.txt') || lower === 'requirements.txt') {
    return <FileText className={`${className} text-slate-400 shrink-0`} />;
  }

  // Config / Settings
  if (lower.includes('config') || lower.endsWith('.env')) {
    return <Settings className={`${className} text-slate-400 shrink-0`} />;
  }

  // Default file
  return <FileCode className={`${className} text-slate-400 shrink-0`} />;
}
