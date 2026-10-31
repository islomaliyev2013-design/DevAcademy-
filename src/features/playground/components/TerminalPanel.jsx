import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal as TerminalIcon,
  Trash2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  X,
  Maximize2,
  Minimize2,
  AlertCircle,
  Info,
  CheckCircle2,
} from 'lucide-react';

export function TerminalPanel({
  terminalLogs = [],
  consoleLogs = [],
  outputLogs = [],
  isOpen = true,
  onToggle,
  onClear,
  onRunCommand,
  isPythonRunning = false,
  pythonStatus = '',
  height = 200,
  onHeightChange,
}) {
  const [activeTab, setActiveTab] = useState('terminal'); // 'terminal' | 'console' | 'output'
  const [commandInput, setCommandInput] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const bottomScrollRef = useRef(null);

  // Auto-scroll on new logs
  useEffect(() => {
    if (bottomScrollRef.current) {
      bottomScrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs, consoleLogs, outputLogs, activeTab]);

  const handleCopyLogs = () => {
    let text = '';
    if (activeTab === 'terminal') {
      text = terminalLogs.map((l) => `[${l.time}] ${l.text}`).join('\n');
    } else if (activeTab === 'console') {
      text = consoleLogs.map((l) => `[${l.time}] [${l.level?.toUpperCase()}] ${l.text}`).join('\n');
    } else {
      text = outputLogs.map((l) => `[${l.time}] ${l.text}`).join('\n');
    }

    if (text) {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    }
  };

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    const cmd = commandInput.trim();
    if (!cmd) return;

    if (onRunCommand) {
      onRunCommand(cmd);
    }
    setCommandInput('');
  };

  if (!isOpen) return null;

  const currentHeight = isMaximized ? 'h-96' : 'h-52';

  return (
    <div
      className={`w-full ${currentHeight} bg-[#181818] border-t border-[#2d2d2d] flex flex-col font-mono text-xs select-none transition-all duration-200 shrink-0 z-10`}
    >
      {/* Terminal Tab Bar */}
      <div className="h-8 px-3 bg-[#1e1e1e] border-b border-[#2d2d2d] flex items-center justify-between text-slate-400">
        <div className="flex items-center h-full">
          <button
            type="button"
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-1.5 h-full px-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition ${
              activeTab === 'terminal'
                ? 'border-brand-500 text-white bg-[#181818]'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>Terminal</span>
            {isPythonRunning && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('console')}
            className={`flex items-center gap-1.5 h-full px-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition ${
              activeTab === 'console'
                ? 'border-brand-500 text-white bg-[#181818]'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            <span>Console</span>
            {consoleLogs.length > 0 && (
              <span className="px-1.5 py-0.2 bg-slate-800 text-[10px] rounded text-slate-300">
                {consoleLogs.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('output')}
            className={`flex items-center gap-1.5 h-full px-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition ${
              activeTab === 'output'
                ? 'border-brand-500 text-white bg-[#181818]'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            <span>Output</span>
          </button>
        </div>

        {/* Terminal Controls */}
        <div className="flex items-center gap-1">
          {pythonStatus && (
            <span className="text-[11px] text-slate-400 mr-2 flex items-center gap-1 hidden sm:flex">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
              {pythonStatus}
            </span>
          )}

          <button
            type="button"
            title="Copy Logs"
            onClick={handleCopyLogs}
            className="p-1 rounded hover:bg-slate-700/60 text-slate-400 hover:text-white transition"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            title="Clear Terminal"
            onClick={() => onClear(activeTab)}
            className="p-1 rounded hover:bg-slate-700/60 text-slate-400 hover:text-white transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            title={isMaximized ? 'Restore Terminal' : 'Maximize Terminal'}
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1 rounded hover:bg-slate-700/60 text-slate-400 hover:text-white transition"
          >
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            title="Hide Terminal"
            onClick={onToggle}
            className="p-1 rounded hover:bg-slate-700/60 text-slate-400 hover:text-white transition ml-1"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 p-3 overflow-y-auto space-y-1 font-mono text-[12px] leading-relaxed selection:bg-brand-600 selection:text-white">
        {/* Terminal Tab */}
        {activeTab === 'terminal' && (
          <div>
            {terminalLogs.length === 0 ? (
              <div className="text-slate-500 py-2">
                <p className="text-slate-400">DevAcademy Integrated Terminal v2.0</p>
                <p>Type commands or click <strong className="text-brand-400">Run</strong> to execute code.</p>
                <p className="text-slate-600 mt-1">Supported commands: <code>help</code>, <code>clear</code>, <code>python main.py</code>, <code>run</code>, <code>status</code></p>
              </div>
            ) : (
              terminalLogs.map((log) => {
                const isError = log.level === 'error';
                const isCmd = log.isCommand;
                const isSuccess = log.level === 'success';

                return (
                  <div
                    key={log.id}
                    className={`whitespace-pre-wrap ${
                      isCmd
                        ? 'text-brand-400 font-semibold'
                        : isError
                        ? 'text-rose-400'
                        : isSuccess
                        ? 'text-emerald-400'
                        : 'text-slate-200'
                    }`}
                  >
                    {isCmd && <span className="text-emerald-400 mr-2">$</span>}
                    {log.text}
                  </div>
                );
              })
            )}
            <div ref={bottomScrollRef} />
          </div>
        )}

        {/* Console Tab */}
        {activeTab === 'console' && (
          <div>
            {consoleLogs.length === 0 ? (
              <p className="text-slate-500 py-2">No browser console output. Run JavaScript code or interact with the preview to see logs.</p>
            ) : (
              consoleLogs.map((log) => {
                const isErr = log.level === 'error';
                const isWarn = log.level === 'warn';

                return (
                  <div
                    key={log.id}
                    className={`flex items-start gap-2 py-0.5 border-b border-slate-800/40 ${
                      isErr
                        ? 'text-rose-400 bg-rose-950/20'
                        : isWarn
                        ? 'text-amber-400 bg-amber-950/20'
                        : 'text-slate-200'
                    }`}
                  >
                    <span className="text-[10px] text-slate-500 font-sans shrink-0">
                      {log.time}
                    </span>
                    <span
                      className={`text-[9px] px-1 rounded uppercase font-bold shrink-0 ${
                        isErr
                          ? 'bg-rose-900/60 text-rose-300'
                          : isWarn
                          ? 'bg-amber-900/60 text-amber-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {log.level || 'LOG'}
                    </span>
                    <span className="whitespace-pre-wrap flex-1">{log.text}</span>
                  </div>
                );
              })
            )}
            <div ref={bottomScrollRef} />
          </div>
        )}

        {/* Output Tab */}
        {activeTab === 'output' && (
          <div>
            {outputLogs.length === 0 ? (
              <p className="text-slate-500 py-2">No system build or file events recorded yet.</p>
            ) : (
              outputLogs.map((log) => (
                <div key={log.id} className="text-slate-300 flex items-start gap-2 py-0.5">
                  <span className="text-slate-500 text-[10px]">{log.time}</span>
                  <span>{log.text}</span>
                </div>
              ))
            )}
            <div ref={bottomScrollRef} />
          </div>
        )}
      </div>

      {/* Terminal Interactive Input Prompt */}
      {activeTab === 'terminal' && (
        <form
          onSubmit={handleCommandSubmit}
          className="h-8 px-3 bg-[#141414] border-t border-[#262626] flex items-center gap-2"
        >
          <span className="text-emerald-400 font-bold">$</span>
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            placeholder="Type command (e.g. python main.py, clear, help)..."
            className="flex-1 bg-transparent text-slate-200 placeholder-slate-600 focus:outline-none text-xs"
          />
        </form>
      )}
    </div>
  );
}
