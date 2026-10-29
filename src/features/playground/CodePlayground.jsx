import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { AIMentorWidget } from '../ai-mentor/AIMentorWidget';
import { useToast } from '../../components/ui/Toast';
import {
  Play,
  RotateCcw,
  Save,
  Download,
  Share2,
  Sparkles,
  Terminal,
  Code,
  Layers,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
} from 'lucide-react';

const STARTER_TEMPLATES = {
  counter: {
    name: 'Interactive Counter',
    html: `<div class="card">
  <h2>Interactive Counter</h2>
  <div class="counter-box">
    <button id="decBtn" class="btn">-</button>
    <span id="counterDisplay">0</span>
    <button id="incBtn" class="btn">+</button>
  </div>
</div>`,
    css: `body {
  font-family: 'Inter', system-ui, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  margin: 0;
  background: #f8f9fe;
}
.card {
  background: white;
  padding: 2.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 10px 25px rgba(124, 58, 237, 0.1);
  text-align: center;
  border: 1px solid #ede9fe;
}
h2 {
  color: #1e1b4b;
  margin-top: 0;
  font-size: 1.5rem;
}
.counter-box {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1.5rem;
}
.btn {
  background: #7c3aed;
  color: white;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  font-size: 1.25rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.1s, background 0.2s;
}
.btn:hover {
  background: #6d28d9;
}
.btn:active {
  transform: scale(0.95);
}
#counterDisplay {
  font-size: 2.5rem;
  font-weight: 800;
  color: #4c1d95;
  min-width: 60px;
  font-family: monospace;
}`,
    js: `let count = 0;
const display = document.getElementById('counterDisplay');

document.getElementById('incBtn').addEventListener('click', () => {
  count++;
  display.textContent = count;
  console.log('Incremented to:', count);
});

document.getElementById('decBtn').addEventListener('click', () => {
  count--;
  display.textContent = count;
  console.log('Decremented to:', count);
});`,
  },
  todo: {
    name: 'Modern Task List',
    html: `<div class="todo-app">
  <h2>DevAcademy Tasks</h2>
  <div class="input-row">
    <input id="todoInput" placeholder="Add a new task..." />
    <button id="addTodoBtn">Add</button>
  </div>
  <ul id="todoList"></ul>
</div>`,
    css: `body {
  font-family: 'Inter', system-ui, sans-serif;
  background: #f8f9fe;
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;
}
.todo-app {
  background: white;
  width: 100%;
  max-width: 420px;
  padding: 2rem;
  border-radius: 1.25rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}
h2 { color: #0f172a; margin-top: 0; }
.input-row { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
input {
  flex: 1;
  padding: 0.6rem 0.8rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  outline: none;
}
input:focus { border-color: #7c3aed; }
button {
  background: #7c3aed;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 0.5rem;
  cursor: pointer;
}
ul { list-style: none; padding: 0; margin: 0; }
li {
  padding: 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
li.completed { text-decoration: line-through; color: #94a3b8; }`,
    js: `const input = document.getElementById('todoInput');
const btn = document.getElementById('addTodoBtn');
const list = document.getElementById('todoList');

btn.onclick = () => {
  const val = input.value.trim();
  if (!val) return;
  const li = document.createElement('li');
  li.textContent = val;
  li.onclick = () => li.classList.toggle('completed');
  list.appendChild(li);
  input.value = '';
};`,
  },
};

export function CodePlayground({
  initialHtml = '',
  initialCss = '',
  initialJs = '',
  onAssignmentSubmit = null,
  assignmentTitle = '',
}) {
  const [activeTab, setActiveTab] = useState('html'); // 'html' | 'css' | 'js' | 'console'
  const [htmlCode, setHtmlCode] = useState(initialHtml || STARTER_TEMPLATES.counter.html);
  const [cssCode, setCssCode] = useState(initialCss || STARTER_TEMPLATES.counter.css);
  const [jsCode, setJsCode] = useState(initialJs || STARTER_TEMPLATES.counter.js);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [showAIMentor, setShowAIMentor] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const iframeRef = useRef(null);
  const { addToast } = useToast();

  // Run the sandboxed code
  const runCode = () => {
    setIsRunning(true);
    setConsoleLogs([]);

    const combinedHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>${cssCode}</style>
          <script>
            // Intercept console.log and errors for playground console
            const originalLog = console.log;
            const originalError = console.error;
            window.onerror = function(msg, url, line) {
              window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'error', text: 'Error on line ' + line + ': ' + msg }, '*');
              return false;
            };
            console.log = function(...args) {
              originalLog.apply(console, args);
              window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'log', text: args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') }, '*');
            };
            console.error = function(...args) {
              originalError.apply(console, args);
              window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'error', text: args.join(' ') }, '*');
            };
          </script>
        </head>
        <body>
          ${htmlCode}
          <script>
            try {
              ${jsCode}
            } catch (err) {
              console.error(err.message);
            }
          </script>
        </body>
      </html>
    `;

    if (iframeRef.current) {
      iframeRef.current.srcdoc = combinedHtml;
    }
    setTimeout(() => setIsRunning(false), 300);
  };

  // Listen to message events from iframe
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data?.type === 'CONSOLE_LOG') {
        setConsoleLogs((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            time: new Date().toLocaleTimeString(),
            level: e.data.level,
            text: e.data.text,
          },
        ]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Initial run on mount
  useEffect(() => {
    runCode();
  }, []);

  const handleTemplateSelect = (key) => {
    const tmpl = STARTER_TEMPLATES[key];
    if (tmpl) {
      setHtmlCode(tmpl.html);
      setCssCode(tmpl.css);
      setJsCode(tmpl.js);
      addToast(`Loaded "${tmpl.name}" template`, 'info');
      setTimeout(runCode, 50);
    }
  };

  const handleReset = () => {
    setHtmlCode(initialHtml || STARTER_TEMPLATES.counter.html);
    setCssCode(initialCss || STARTER_TEMPLATES.counter.css);
    setJsCode(initialJs || STARTER_TEMPLATES.counter.js);
    addToast('Code reset to default starter template', 'info');
    setTimeout(runCode, 50);
  };

  const handleSaveLocal = () => {
    const project = { html: htmlCode, css: cssCode, js: jsCode, savedAt: new Date().toISOString() };
    localStorage.setItem('devacademy_playground_saved', JSON.stringify(project));
    addToast('Project saved successfully to local storage!', 'success');
  };

  const activeCodeContent =
    activeTab === 'html' ? htmlCode : activeTab === 'css' ? cssCode : jsCode;

  const currentEditorLang =
    activeTab === 'html' ? 'html' : activeTab === 'css' ? 'css' : 'javascript';

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] min-h-[640px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Top action toolbar */}
      <div className="bg-navy-950 px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Editor language tabs */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('html')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'html'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-amber-400" />
            <span>HTML</span>
          </button>
          <button
            onClick={() => setActiveTab('css')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'css'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>CSS</span>
          </button>
          <button
            onClick={() => setActiveTab('js')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'js'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-yellow-400" />
            <span>JavaScript</span>
          </button>
          <button
            onClick={() => setActiveTab('console')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'console'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Console</span>
            {consoleLogs.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-slate-700 text-[10px] flex items-center justify-center text-slate-300">
                {consoleLogs.length}
              </span>
            )}
          </button>
        </div>

        {/* Templates dropdown & main actions */}
        <div className="flex items-center gap-2">
          {/* Templates */}
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400">Templates:</span>
            <button
              onClick={() => handleTemplateSelect('counter')}
              className="text-[11px] px-2 py-1 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
            >
              Counter
            </button>
            <button
              onClick={() => handleTemplateSelect('todo')}
              className="text-[11px] px-2 py-1 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
            >
              Todo App
            </button>
          </div>

          <button
            onClick={handleReset}
            title="Reset code"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleSaveLocal}
            title="Save Project"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
          >
            <Save className="w-4 h-4" />
          </button>

          <Button
            variant="primary"
            size="sm"
            onClick={runCode}
            isLoading={isRunning}
            icon={Play}
            className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/30 font-semibold"
          >
            Run Code
          </Button>

          {/* Toggle AI Mentor panel */}
          <button
            onClick={() => setShowAIMentor(!showAIMentor)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              showAIMentor
                ? 'bg-brand-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-300" />
            <span>AI Mentor</span>
          </button>

          {/* Submit assignment button if in assignment mode */}
          {onAssignmentSubmit && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onAssignmentSubmit({ html: htmlCode, css: cssCode, js: jsCode })}
            >
              Submit Assignment
            </Button>
          )}
        </div>
      </div>

      {/* Main split work area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Code Editor or Console */}
        <div className={`flex-1 flex flex-col min-w-0 ${activeTab === 'console' ? 'bg-slate-950' : 'bg-slate-900'}`}>
          {activeTab === 'console' ? (
            <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-2 text-slate-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
                <span>Playground Execution Console</span>
                <button
                  onClick={() => setConsoleLogs([])}
                  className="text-[11px] hover:text-slate-200"
                >
                  Clear logs
                </button>
              </div>
              {consoleLogs.length === 0 ? (
                <p className="text-slate-500 italic pt-4">No console logs yet. Call console.log() in your JS to inspect output here.</p>
              ) : (
                consoleLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`flex items-start gap-2 py-1 ${
                      log.level === 'error' ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    <span className="text-[10px] text-slate-600 select-none">[{log.time}]</span>
                    <span className="font-semibold select-none">{log.level === 'error' ? 'ERR:' : '>'}</span>
                    <span className="whitespace-pre-wrap">{log.text}</span>
                  </div>
                ))
              )}
            </div>
          ) : (
            <Editor
              height="100%"
              language={currentEditorLang}
              value={activeCodeContent}
              onChange={(val) => {
                if (activeTab === 'html') setHtmlCode(val || '');
                else if (activeTab === 'css') setCssCode(val || '');
                else setJsCode(val || '');
              }}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                fontFamily: '"JetBrains Mono", Consolas, monospace',
                tabSize: 2,
              }}
            />
          )}
        </div>

        {/* Middle: Live Sandboxed Preview */}
        <div className="flex-1 flex flex-col min-w-0 bg-white border-t lg:border-t-0 lg:border-l border-slate-800">
          <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Live Browser Preview
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Isolated Sandbox</span>
          </div>
          <iframe
            ref={iframeRef}
            title="DevAcademy Code Preview"
            sandbox="allow-scripts"
            className="w-full flex-1 border-none bg-white"
          />
        </div>

        {/* Right Drawer: AI Mentor Panel */}
        {showAIMentor && (
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-800 bg-white h-72 lg:h-auto">
            <AIMentorWidget
              codeContext={`// ACTIVE CODE IN DEVACADEMY PLAYGROUND\n// HTML:\n${htmlCode}\n\n// JAVASCRIPT:\n${jsCode}\n\n// CSS:\n${cssCode}`}
              lessonContext={assignmentTitle || "Coding Playground Exploration"}
            />
          </div>
        )}
      </div>
    </div>
  );
}
