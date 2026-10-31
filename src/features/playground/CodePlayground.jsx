import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import {
  DEFAULT_PROJECTS,
  isPythonProject,
  getLanguageFromFilename,
} from './types';
import { runPythonCode, initPyodide, isPyodideReady } from './pythonRunner';
import { FileExplorer } from './components/FileExplorer';
import { EditorArea } from './components/EditorArea';
import { PreviewPanel } from './components/PreviewPanel';
import { TerminalPanel } from './components/TerminalPanel';
import { IDEHeader } from './components/IDEHeader';
import { StatusBar } from './components/StatusBar';
import { NewItemModal } from './components/NewItemModal';
import { RenameModal } from './components/RenameModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { IDESettingsModal } from './components/IDESettingsModal';
import { TemplatesModal } from './components/TemplatesModal';
import { AIMentorWidget } from '../ai-mentor/AIMentorWidget';
import { CheckCircle2, Send, Sparkles, X } from 'lucide-react';

const STORAGE_PROJECTS_KEY = 'devacademy_ide_projects_v3';
const STORAGE_SETTINGS_KEY = 'devacademy_ide_settings_v3';

export function CodePlayground({
  initialHtml = '',
  initialCss = '',
  initialJs = '',
  onAssignmentSubmit = null,
  assignmentTitle = '',
}) {
  const { addToast } = useToast();

  // Load starter project
  const getInitialProject = () => {
    // If lesson or assignment gave initial code
    if (initialHtml || initialCss || initialJs) {
      return {
        id: 'assignment-project',
        name: assignmentTitle || 'Course Exercise',
        files: [
          {
            id: 'file-html-custom',
            name: 'index.html',
            path: '/index.html',
            type: 'file',
            parentId: null,
            content: initialHtml || '<!DOCTYPE html>\n<html>\n<head></head>\n<body>\n</body>\n</html>',
          },
          {
            id: 'file-css-custom',
            name: 'style.css',
            path: '/style.css',
            type: 'file',
            parentId: null,
            content: initialCss || '/* Styles */\n',
          },
          {
            id: 'file-js-custom',
            name: 'script.js',
            path: '/script.js',
            type: 'file',
            parentId: null,
            content: initialJs || '// JavaScript\n',
          },
        ],
      };
    }

    // Default to the first rich starter template
    const defaultTemplate = DEFAULT_PROJECTS[0];
    return {
      id: defaultTemplate.id,
      name: defaultTemplate.name,
      files: JSON.parse(JSON.stringify(defaultTemplate.files)),
    };
  };

  const initialProject = getInitialProject();

  // Core Project State
  const [projectName, setProjectName] = useState(initialProject.name);
  const [activeProjectId, setActiveProjectId] = useState(initialProject.id);
  const [files, setFiles] = useState(initialProject.files);
  const [savedProjects, setSavedProjects] = useState([]);

  // Editor Tabs State
  const [openFileIds, setOpenFileIds] = useState(() => {
    const firstFile = initialProject.files.find((f) => f.type === 'file');
    return firstFile ? [firstFile.id] : [];
  });
  const [activeFileId, setActiveFileId] = useState(() => {
    const firstFile = initialProject.files.find((f) => f.type === 'file');
    return firstFile ? firstFile.id : null;
  });

  // UI Panels
  const [showPreview, setShowPreview] = useState(true);
  const [showTerminal, setShowTerminal] = useState(true);
  const [showAIMentor, setShowAIMentor] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  // Logs & Runtime
  const [terminalLogs, setTerminalLogs] = useState([
    {
      id: 'init-1',
      time: new Date().toLocaleTimeString(),
      text: 'DevAcademy IDE Playground v3.0 ready.',
      level: 'info',
    },
    {
      id: 'init-2',
      time: new Date().toLocaleTimeString(),
      text: 'Workspace loaded: ' + initialProject.name,
      level: 'info',
    },
  ]);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [outputLogs, setOutputLogs] = useState([
    {
      id: 'out-1',
      time: new Date().toLocaleTimeString(),
      text: 'Environment ready. Monaco Editor initialized.',
    },
  ]);
  const [isPythonRunning, setIsPythonRunning] = useState(false);
  const [pythonStatus, setPythonStatus] = useState('');
  const [pyodideReady, setPyodideReady] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ lineNumber: 1, column: 1 });

  // Settings
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_SETTINGS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {
      fontSize: 14,
      tabSize: 2,
      wordWrap: 'on',
      minimap: false,
      autoRunOnSave: true,
    };
  });

  // Modals
  const [newItemModal, setNewItemModal] = useState({ isOpen: false, type: 'file', parentId: null });
  const [renameModal, setRenameModal] = useState({ isOpen: false, item: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [templatesModalOpen, setTemplatesModalOpen] = useState(false);

  // Active file object
  const activeFile = files.find((f) => f.id === activeFileId) || null;
  const openFiles = files.filter((f) => openFileIds.includes(f.id));
  const hasUnsavedChanges = files.some((f) => f.isDirty);
  const isPython = isPythonProject(files);

  // Save settings to localStorage
  const handleUpdateSettings = (newSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(newSettings));
      addToast('Editor settings saved', 'success');
    } catch (e) {}
  };

  // Load saved projects on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_PROJECTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setSavedProjects(parsed);
      }
    } catch (e) {
      console.warn('Failed to load saved projects:', e);
    }
  }, []);

  // Save projects list to localStorage
  const persistProjects = (projects) => {
    try {
      localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(projects));
      setSavedProjects(projects);
    } catch (e) {
      console.error('Storage error:', e);
      addToast('Error saving projects to localStorage', 'error');
    }
  };

  // Listen to messages from Preview sandbox iframe
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data?.type === 'PLAYGROUND_CONSOLE') {
        setConsoleLogs((prev) => [
          ...prev,
          {
            id: 'log-' + Math.random().toString(36).substr(2, 9),
            time: new Date().toLocaleTimeString(),
            level: e.data.level,
            text: e.data.text,
          },
        ]);
      } else if (e.data?.type === 'PLAYGROUND_RUNTIME_ERROR') {
        const errLog = {
          id: 'err-' + Math.random().toString(36).substr(2, 9),
          time: new Date().toLocaleTimeString(),
          level: 'error',
          text: e.data.text,
        };
        setConsoleLogs((prev) => [...prev, errLog]);
        setTerminalLogs((prev) => [...prev, errLog]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Keyboard shortcut listener: Ctrl+S to save, Ctrl+Enter to run
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [files, activeFile, isPython]);

  // File selection
  const handleSelectFile = (fileId) => {
    if (!openFileIds.includes(fileId)) {
      setOpenFileIds((prev) => [...prev, fileId]);
    }
    setActiveFileId(fileId);
  };

  // Select open tab
  const handleSelectTab = (fileId) => {
    setActiveFileId(fileId);
  };

  // Close tab
  const handleCloseTab = (fileId) => {
    const newOpenIds = openFileIds.filter((id) => id !== fileId);
    setOpenFileIds(newOpenIds);

    if (activeFileId === fileId) {
      if (newOpenIds.length > 0) {
        setActiveFileId(newOpenIds[newOpenIds.length - 1]);
      } else {
        setActiveFileId(null);
      }
    }
  };

  // Update code content
  const handleCodeChange = (fileId, newContent) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, content: newContent, isDirty: true } : f))
    );
  };

  // Save Project
  const handleSave = () => {
    const now = new Date().toISOString();
    const cleanFiles = files.map((f) => ({ ...f, isDirty: false }));
    setFiles(cleanFiles);

    const projectData = {
      id: activeProjectId || 'project-' + Date.now(),
      name: projectName.trim() || 'Untitled Project',
      files: cleanFiles,
      updatedAt: now,
    };

    const existingIndex = savedProjects.findIndex((p) => p.id === projectData.id);
    let updated;
    if (existingIndex >= 0) {
      updated = savedProjects.map((p, idx) => (idx === existingIndex ? projectData : p));
    } else {
      updated = [projectData, ...savedProjects];
    }

    persistProjects(updated);
    setActiveProjectId(projectData.id);

    setOutputLogs((prev) => [
      ...prev,
      {
        id: 'save-' + Date.now(),
        time: new Date().toLocaleTimeString(),
        text: `Project "${projectData.name}" saved successfully (${cleanFiles.length} files).`,
      },
    ]);

    addToast(`Project "${projectData.name}" saved`, 'success');

    if (settings.autoRunOnSave) {
      handleRun();
    }
  };

  // Run Code
  const handleRun = async () => {
    // If active file is Python or project is a Python project and we run Python
    const isPyActive = activeFile && activeFile.name.toLowerCase().endsWith('.py');
    const isRunningPython = isPyActive || isPython;

    if (isRunningPython) {
      // Find Python entry file: main.py, or app.py, or active .py file
      let entryFile = activeFile && isPyActive ? activeFile : null;
      if (!entryFile) {
        entryFile = files.find(
          (f) => f.type === 'file' && f.name.toLowerCase() === 'main.py'
        );
      }
      if (!entryFile) {
        entryFile = files.find(
          (f) => f.type === 'file' && f.name.toLowerCase() === 'app.py'
        );
      }
      if (!entryFile) {
        entryFile = files.find((f) => f.type === 'file' && f.name.endsWith('.py'));
      }

      if (!entryFile) {
        addToast('No Python file found to run', 'error');
        return;
      }

      setShowTerminal(true);
      setIsPythonRunning(true);
      setPythonStatus('Running ' + entryFile.name);

      setTerminalLogs((prev) => [
        ...prev,
        {
          id: 'cmd-' + Date.now(),
          time: new Date().toLocaleTimeString(),
          text: `python ${entryFile.name}`,
          isCommand: true,
        },
      ]);

      const result = await runPythonCode({
        code: entryFile.content,
        projectFiles: files,
        entryFileName: entryFile.name,
        onStdout: (out) => {
          setTerminalLogs((prev) => [
            ...prev,
            {
              id: 'out-' + Math.random().toString(36).substr(2, 9),
              time: new Date().toLocaleTimeString(),
              text: out,
              level: 'info',
            },
          ]);
        },
        onStderr: (err) => {
          setTerminalLogs((prev) => [
            ...prev,
            {
              id: 'err-' + Math.random().toString(36).substr(2, 9),
              time: new Date().toLocaleTimeString(),
              text: err,
              level: 'error',
            },
          ]);
        },
        onStatus: (status) => setPythonStatus(status),
      });

      setIsPythonRunning(false);
      setPythonStatus('');
      setPyodideReady(isPyodideReady());

      if (result.success) {
        setTerminalLogs((prev) => [
          ...prev,
          {
            id: 'done-' + Date.now(),
            time: new Date().toLocaleTimeString(),
            text: `[Process completed with exit code 0 in ${result.durationMs}ms]`,
            level: 'success',
          },
        ]);
        addToast(`Python execution finished in ${result.durationMs}ms`, 'success');
      } else {
        setTerminalLogs((prev) => [
          ...prev,
          {
            id: 'err-done-' + Date.now(),
            time: new Date().toLocaleTimeString(),
            text: `[Process exited with error in ${result.durationMs}ms]`,
            level: 'error',
          },
        ]);
        addToast('Python execution encountered errors', 'error');
      }
    } else {
      // Run Frontend Preview
      setShowPreview(true);
      setPreviewKey((k) => k + 1);

      setOutputLogs((prev) => [
        ...prev,
        {
          id: 'run-' + Date.now(),
          time: new Date().toLocaleTimeString(),
          text: `Rebuilt project and reloaded live preview at ${new Date().toLocaleTimeString()}`,
        },
      ]);

      addToast('Live preview updated', 'info');
    }
  };

  // Run Terminal Interactive Command
  const handleRunCommand = async (cmd) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setTerminalLogs((prev) => [
      ...prev,
      {
        id: 'cmd-' + Date.now(),
        time: new Date().toLocaleTimeString(),
        text: trimmed,
        isCommand: true,
      },
    ]);

    if (trimmed === 'clear' || trimmed === 'cls') {
      setTerminalLogs([]);
      return;
    }

    if (trimmed === 'help') {
      setTerminalLogs((prev) => [
        ...prev,
        {
          id: 'help-' + Date.now(),
          time: new Date().toLocaleTimeString(),
          text: `Available commands:
  - run               : Build project & trigger preview
  - python <filename> : Execute a Python file in WebAssembly
  - ls                : List files in workspace
  - clear             : Clear terminal screen
  - status            : Check runtime & project status
  - help              : Show this help guide`,
          level: 'info',
        },
      ]);
      return;
    }

    if (trimmed === 'ls' || trimmed === 'dir') {
      const listText = files
        .map((f) => (f.type === 'folder' ? `📁 ${f.name}/` : `📄 ${f.name}`))
        .join('    ');
      setTerminalLogs((prev) => [
        ...prev,
        {
          id: 'ls-' + Date.now(),
          time: new Date().toLocaleTimeString(),
          text: listText || '(empty workspace)',
          level: 'info',
        },
      ]);
      return;
    }

    if (trimmed === 'status') {
      setTerminalLogs((prev) => [
        ...prev,
        {
          id: 'stat-' + Date.now(),
          time: new Date().toLocaleTimeString(),
          text: `Workspace: ${projectName}
Total Files: ${files.length}
Python Runtime: ${isPyodideReady() ? 'Pyodide 3.11 Ready' : 'Standby / Lazy-loaded'}
Open Tabs: ${openFiles.map((f) => f.name).join(', ') || 'None'}`,
          level: 'info',
        },
      ]);
      return;
    }

    if (trimmed === 'run') {
      handleRun();
      return;
    }

    if (trimmed.startsWith('python ') || trimmed.startsWith('py ')) {
      const targetFileName = trimmed.split(' ')[1];
      const targetFile = files.find(
        (f) => f.type === 'file' && f.name.toLowerCase() === targetFileName.toLowerCase()
      );
      if (targetFile) {
        setIsPythonRunning(true);
        const result = await runPythonCode({
          code: targetFile.content,
          projectFiles: files,
          entryFileName: targetFile.name,
          onStdout: (out) => {
            setTerminalLogs((prev) => [
              ...prev,
              {
                id: 'out-' + Math.random().toString(36).substr(2, 9),
                time: new Date().toLocaleTimeString(),
                text: out,
                level: 'info',
              },
            ]);
          },
          onStderr: (err) => {
            setTerminalLogs((prev) => [
              ...prev,
              {
                id: 'err-' + Math.random().toString(36).substr(2, 9),
                time: new Date().toLocaleTimeString(),
                text: err,
                level: 'error',
              },
            ]);
          },
        });
        setIsPythonRunning(false);
        setPyodideReady(isPyodideReady());
        setTerminalLogs((prev) => [
          ...prev,
          {
            id: 'term-done-' + Date.now(),
            time: new Date().toLocaleTimeString(),
            text: `[Process completed with exit code ${result.success ? 0 : 1} in ${result.durationMs}ms]`,
            level: result.success ? 'success' : 'error',
          },
        ]);
      } else {
        setTerminalLogs((prev) => [
          ...prev,
          {
            id: 'err-fnf-' + Date.now(),
            time: new Date().toLocaleTimeString(),
            text: `python: can't open file '${targetFileName}': No such file or directory`,
            level: 'error',
          },
        ]);
      }
      return;
    }

    setTerminalLogs((prev) => [
      ...prev,
      {
        id: 'unkn-' + Date.now(),
        time: new Date().toLocaleTimeString(),
        text: `bash: ${trimmed}: command not found. Type 'help' for available commands.`,
        level: 'error',
      },
    ]);
  };

  // Clear Terminal/Console/Output
  const handleClearLogs = (tab) => {
    if (tab === 'terminal') setTerminalLogs([]);
    if (tab === 'console') setConsoleLogs([]);
    if (tab === 'output') setOutputLogs([]);
  };

  // Create File or Folder Action
  const handleCreateItemSubmit = ({ name, type, parentId }) => {
    // Check duplicate in same folder
    const exists = files.some(
      (f) => f.name.toLowerCase() === name.toLowerCase() && f.parentId === parentId
    );
    if (exists) {
      addToast(`A ${type} named "${name}" already exists in this folder`, 'error');
      return;
    }

    let defaultContent = '';
    const lower = name.toLowerCase();
    if (lower.endsWith('.html')) {
      defaultContent = '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>New Page</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>';
    } else if (lower.endsWith('.css')) {
      defaultContent = '/* New Stylesheet */\nbody {\n  margin: 0;\n}\n';
    } else if (lower.endsWith('.js')) {
      defaultContent = '// JavaScript file\nconsole.log("Loaded ' + name + '");\n';
    } else if (lower.endsWith('.py')) {
      defaultContent = '# Python script\nprint("Hello from ' + name + '!")\n';
    } else if (lower.endsWith('.json')) {
      defaultContent = '{\n  "name": "data"\n}\n';
    } else if (lower.endsWith('.md')) {
      defaultContent = '# ' + name + '\n\nDocument details here.\n';
    }

    const parentFolder = files.find((f) => f.id === parentId);
    const parentPath = parentFolder ? parentFolder.path : '';
    const newPath = `${parentPath}/${name}`;

    const newItem = {
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name,
      path: newPath,
      type,
      parentId: parentId || null,
      content: type === 'file' ? defaultContent : undefined,
      isDirty: type === 'file',
    };

    setFiles((prev) => [...prev, newItem]);

    if (type === 'file') {
      setOpenFileIds((prev) => [...prev, newItem.id]);
      setActiveFileId(newItem.id);
      addToast(`Created file "${name}"`, 'success');
    } else {
      addToast(`Created folder "${name}"`, 'success');
    }
  };

  // Rename Item Action
  const handleRenameItemSubmit = (itemId, newName) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id === itemId) {
          const parentFolder = prev.find((p) => p.id === f.parentId);
          const parentPath = parentFolder ? parentFolder.path : '';
          return {
            ...f,
            name: newName,
            path: `${parentPath}/${newName}`,
            isDirty: true,
          };
        }
        return f;
      })
    );
    addToast(`Renamed to "${newName}"`, 'info');
  };

  // Delete Item Action
  const handleDeleteItemSubmit = (itemId) => {
    // Delete target item and any children if it was a folder
    const idsToDelete = new Set([itemId]);
    let added = true;
    while (added) {
      added = false;
      files.forEach((f) => {
        if (f.parentId && idsToDelete.has(f.parentId) && !idsToDelete.has(f.id)) {
          idsToDelete.add(f.id);
          added = true;
        }
      });
    }

    setFiles((prev) => prev.filter((f) => !idsToDelete.has(f.id)));
    setOpenFileIds((prev) => prev.filter((id) => !idsToDelete.has(id)));

    if (idsToDelete.has(activeFileId)) {
      const remainingOpen = openFileIds.filter((id) => !idsToDelete.has(id));
      setActiveFileId(remainingOpen.length > 0 ? remainingOpen[0] : null);
    }

    addToast('Item deleted', 'info');
  };

  // Load Starter Template
  const handleLoadTemplate = (template) => {
    setProjectName(template.name);
    setActiveProjectId(null);
    const clonedFiles = JSON.parse(JSON.stringify(template.files));
    setFiles(clonedFiles);

    const firstFile = clonedFiles.find((f) => f.type === 'file');
    if (firstFile) {
      setOpenFileIds([firstFile.id]);
      setActiveFileId(firstFile.id);
    } else {
      setOpenFileIds([]);
      setActiveFileId(null);
    }

    setTerminalLogs((prev) => [
      ...prev,
      {
        id: 'tmpl-' + Date.now(),
        time: new Date().toLocaleTimeString(),
        text: `Loaded starter template: ${template.name}`,
        level: 'info',
      },
    ]);

    addToast(`Loaded "${template.name}" template`, 'success');
  };

  // Load Saved Project
  const handleLoadSavedProject = (project) => {
    setProjectName(project.name);
    setActiveProjectId(project.id);
    const loadedFiles = JSON.parse(JSON.stringify(project.files || []));
    setFiles(loadedFiles);

    const firstFile = loadedFiles.find((f) => f.type === 'file');
    if (firstFile) {
      setOpenFileIds([firstFile.id]);
      setActiveFileId(firstFile.id);
    } else {
      setOpenFileIds([]);
      setActiveFileId(null);
    }

    setTerminalLogs((prev) => [
      ...prev,
      {
        id: 'load-' + Date.now(),
        time: new Date().toLocaleTimeString(),
        text: `Loaded saved project "${project.name}" (${loadedFiles.length} files).`,
        level: 'info',
      },
    ]);

    addToast(`Loaded project "${project.name}"`, 'success');
  };

  // Delete Saved Project from storage
  const handleDeleteSavedProject = (projectId) => {
    const updated = savedProjects.filter((p) => p.id !== projectId);
    persistProjects(updated);
    addToast('Saved project removed', 'info');
  };

  // Assignment Submit Handler
  const handleAssignmentSubmitClick = () => {
    if (onAssignmentSubmit) {
      const htmlFile = files.find((f) => f.name === 'index.html');
      const cssFile = files.find((f) => f.name === 'style.css');
      const jsFile = files.find((f) => f.name === 'script.js');
      onAssignmentSubmit({
        html: htmlFile ? htmlFile.content : '',
        css: cssFile ? cssFile.content : '',
        js: jsFile ? jsFile.content : '',
        files: files,
      });
      addToast('Assignment submitted successfully!', 'success');
    }
  };

  // Collect folder list for modals
  const folderList = files.filter((f) => f.type === 'folder');

  // Fullscreen container styling
  const containerClass = isFullscreen
    ? 'fixed inset-0 z-50 flex flex-col bg-[#1e1e1e] overflow-hidden'
    : 'relative w-full h-[780px] min-h-[600px] flex flex-col bg-[#1e1e1e] rounded-xl border border-slate-800 shadow-2xl overflow-hidden font-sans';

  return (
    <div className={containerClass}>
      {/* IDE Top Toolbar */}
      <IDEHeader
        projectName={projectName}
        onRenameProject={(newName) => {
          setProjectName(newName);
          addToast(`Project renamed to "${newName}"`, 'info');
        }}
        onCreateFile={(parentId) =>
          setNewItemModal({ isOpen: true, type: 'file', parentId })
        }
        onCreateFolder={(parentId) =>
          setNewItemModal({ isOpen: true, type: 'folder', parentId })
        }
        onSave={handleSave}
        onRun={handleRun}
        hasUnsavedChanges={hasUnsavedChanges}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview(!showPreview)}
        showTerminal={showTerminal}
        onToggleTerminal={() => setShowTerminal(!showTerminal)}
        showAIMentor={showAIMentor}
        onToggleAIMentor={() => setShowAIMentor(!showAIMentor)}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onOpenTemplates={() => setTemplatesModalOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        isPython={isPython}
        isRunning={isPythonRunning}
      />

      {/* Assignment Banner if applicable */}
      {onAssignmentSubmit && (
        <div className="h-8 px-4 bg-brand-950/80 border-b border-brand-800/60 flex items-center justify-between text-xs text-brand-300">
          <span className="font-semibold truncate">
            Assignment: {assignmentTitle || 'Coding Exercise'}
          </span>
          <button
            onClick={handleAssignmentSubmitClick}
            className="px-2.5 py-0.5 rounded bg-brand-600 hover:bg-brand-500 text-white font-semibold transition flex items-center gap-1"
          >
            <Send className="w-3 h-3" />
            <span>Submit Solution</span>
          </button>
        </div>
      )}

      {/* Main Workspace (Explorer + Editor + Preview + AI Mentor) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: File Explorer Sidebar (240px) */}
        <div className="w-56 sm:w-60 md:w-64 shrink-0 h-full">
          <FileExplorer
            files={files}
            activeFileId={activeFileId}
            projectName={projectName}
            onSelectFile={handleSelectFile}
            onCreateFile={(parentId) =>
              setNewItemModal({ isOpen: true, type: 'file', parentId })
            }
            onCreateFolder={(parentId) =>
              setNewItemModal({ isOpen: true, type: 'folder', parentId })
            }
            onRenameItem={(item) => setRenameModal({ isOpen: true, item })}
            onDeleteItem={(item) => setDeleteModal({ isOpen: true, item })}
          />
        </div>

        {/* Center: Monaco Editor & Tabs */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <EditorArea
            openFiles={openFiles}
            activeFileId={activeFileId}
            activeFile={activeFile}
            onSelectTab={handleSelectTab}
            onCloseTab={handleCloseTab}
            onCodeChange={handleCodeChange}
            onSave={handleSave}
            onCursorChange={setCursorPosition}
            editorSettings={settings}
          />

          {/* Bottom: Integrated Terminal Panel */}
          <TerminalPanel
            terminalLogs={terminalLogs}
            consoleLogs={consoleLogs}
            outputLogs={outputLogs}
            isOpen={showTerminal}
            onToggle={() => setShowTerminal(!showTerminal)}
            onClear={handleClearLogs}
            onRunCommand={handleRunCommand}
            isPythonRunning={isPythonRunning}
            pythonStatus={pythonStatus}
          />
        </div>

        {/* Right Split: Live Web Preview Panel */}
        {showPreview && (
          <div className="w-[45%] min-w-[320px] max-w-[60%] shrink-0 h-full hidden md:flex flex-col">
            <PreviewPanel
              key={previewKey}
              files={files}
              onClose={() => setShowPreview(false)}
              isRunning={false}
              onRefresh={() => setPreviewKey((k) => k + 1)}
            />
          </div>
        )}

        {/* Right Dock: DevAcademy AI Mentor Assistant */}
        {showAIMentor && (
          <div className="w-80 shrink-0 h-full border-l border-slate-700 bg-slate-900 flex flex-col z-20 shadow-2xl">
            <div className="h-9 px-3 bg-[#252526] border-b border-[#1e1e1e] flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>DevAcademy AI Mentor</span>
              </div>
              <button
                onClick={() => setShowAIMentor(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <AIMentorWidget
                codeContext={activeFile ? `[File: ${activeFile.name}]\n${activeFile.content}` : ''}
                lessonContext={projectName}
                className="h-full border-0 rounded-none shadow-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* VS Code / Antigravity Bottom Status Bar */}
      <StatusBar
        activeFile={activeFile}
        cursorPosition={cursorPosition}
        pyodideReady={pyodideReady}
        isPython={isPython}
        errorCount={consoleLogs.filter((l) => l.level === 'error').length}
      />

      {/* Modals */}
      <NewItemModal
        isOpen={newItemModal.isOpen}
        type={newItemModal.type}
        folders={folderList}
        defaultParentId={newItemModal.parentId}
        onClose={() => setNewItemModal({ isOpen: false, type: 'file', parentId: null })}
        onSubmit={handleCreateItemSubmit}
      />

      <RenameModal
        isOpen={renameModal.isOpen}
        item={renameModal.item}
        onClose={() => setRenameModal({ isOpen: false, item: null })}
        onSubmit={handleRenameItemSubmit}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        item={deleteModal.item}
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        onConfirm={handleDeleteItemSubmit}
      />

      <IDESettingsModal
        isOpen={settingsModalOpen}
        settings={settings}
        onClose={() => setSettingsModalOpen(false)}
        onUpdateSettings={handleUpdateSettings}
      />

      <TemplatesModal
        isOpen={templatesModalOpen}
        onClose={() => setTemplatesModalOpen(false)}
        onLoadTemplate={handleLoadTemplate}
        savedProjects={savedProjects}
        onLoadSavedProject={handleLoadSavedProject}
        onDeleteSavedProject={handleDeleteSavedProject}
      />
    </div>
  );
}
