/**
 * Project and File Data Models & Utilities for DevAcademy IDE Playground
 */

export const FILE_EXTENSIONS = {
  html: 'html',
  htm: 'html',
  css: 'css',
  scss: 'css',
  sass: 'css',
  js: 'javascript',
  jsx: 'javascript',
  mjs: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  py: 'python',
  json: 'json',
  md: 'markdown',
  markdown: 'markdown',
  txt: 'plaintext',
  sql: 'sql',
};

export function getLanguageFromFilename(filename = '') {
  const parts = filename.split('.');
  if (parts.length <= 1) return 'plaintext';
  const ext = parts.pop().toLowerCase();
  return FILE_EXTENSIONS[ext] || 'plaintext';
}

export function isPythonProject(files = []) {
  return files.some(
    (f) =>
      f.type === 'file' &&
      (f.name.toLowerCase() === 'main.py' ||
        f.name.toLowerCase() === 'app.py' ||
        f.name.toLowerCase().endsWith('.py'))
  );
}

export function isFrontendProject(files = []) {
  return files.some(
    (f) =>
      f.type === 'file' &&
      (f.name.toLowerCase() === 'index.html' || f.name.toLowerCase().endsWith('.html'))
  );
}

// Built-in starter projects
export const DEFAULT_PROJECTS = [
  {
    id: 'frontend-starter',
    name: 'Modern Web App',
    description: 'Interactive HTML, modern CSS, and JavaScript with counter and theme toggle.',
    isDefault: true,
    files: [
      {
        id: 'file-html-1',
        name: 'index.html',
        path: '/index.html',
        type: 'file',
        parentId: null,
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DevAcademy Modern Web App</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="app-container">
    <header class="app-header">
      <div class="brand">
        <div class="logo-icon">⚡</div>
        <h1>DevAcademy Studio</h1>
      </div>
      <div class="badge">Live Playground</div>
    </header>

    <main class="card">
      <div class="card-hero">
        <h2>Interactive Web Application</h2>
        <p>Edit HTML, CSS, and JavaScript files on the left and see changes instantly!</p>
      </div>

      <div class="counter-box">
        <span class="label">Click Counter</span>
        <div id="counter" class="counter-val">0</div>
        <div class="button-group">
          <button id="decrement" class="btn btn-outline">− Decrease</button>
          <button id="reset" class="btn btn-secondary">Reset</button>
          <button id="increment" class="btn btn-primary">+ Increase</button>
        </div>
      </div>

      <div class="features-grid">
        <div class="feature-item">
          <span class="feat-icon">🚀</span>
          <strong>Monaco Editor</strong>
          <span>Real VS Code editing engine</span>
        </div>
        <div class="feature-item">
          <span class="feat-icon">🎨</span>
          <strong>Live Preview</strong>
          <span>Instant rendering with console logs</span>
        </div>
        <div class="feature-item">
          <span class="feat-icon">🐍</span>
          <strong>Python Support</strong>
          <span>Real in-browser Python execution</span>
        </div>
      </div>
    </main>

    <footer class="app-footer">
      <span>Built with ❤️ for DevAcademy Students</span>
    </footer>
  </div>

  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        id: 'file-css-1',
        name: 'style.css',
        path: '/style.css',
        type: 'file',
        parentId: null,
        content: `:root {
  --bg-primary: #0f172a;
  --card-bg: #1e293b;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --accent: #6366f1;
  --accent-hover: #4f46e5;
  --border: rgba(255, 255, 255, 0.1);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

body {
  background: radial-gradient(circle at top right, #1e1b4b, #0f172a);
  color: var(--text-main);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
}

.app-container {
  width: 100%;
  max-width: 640px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 24px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
}

.app-header h1 {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.badge {
  background: rgba(99, 102, 241, 0.15);
  color: #818cf8;
  border: 1px solid rgba(99, 102, 241, 0.3);
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 9999px;
}

.card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
}

.card-hero h2 {
  font-size: 22px;
  margin-bottom: 8px;
  background: linear-gradient(to right, #ffffff, #cbd5e1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.card-hero p {
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 24px;
}

.counter-box {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  margin-bottom: 24px;
}

.counter-box .label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-muted);
  font-weight: 600;
}

.counter-val {
  font-size: 48px;
  font-weight: 800;
  color: #a5b4fc;
  margin: 10px 0;
  transition: transform 0.15s ease;
}

.counter-val.pop {
  transform: scale(1.15);
}

.button-group {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.btn {
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background: var(--accent);
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.btn-primary:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.feature-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.feat-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.feature-item strong {
  font-size: 13px;
  color: #e2e8f0;
}

.feature-item span {
  font-size: 11px;
  color: var(--text-muted);
}

.app-footer {
  text-align: center;
  font-size: 12px;
  color: var(--text-muted);
}

@media (max-width: 500px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}`,
      },
      {
        id: 'file-js-1',
        name: 'script.js',
        path: '/script.js',
        type: 'file',
        parentId: null,
        content: `// DevAcademy Interactive Playground Script
console.log('⚡ Initializing DevAcademy App...');

let count = 0;
const counterDisplay = document.getElementById('counter');
const incBtn = document.getElementById('increment');
const decBtn = document.getElementById('decrement');
const resetBtn = document.getElementById('reset');

function updateDisplay() {
  counterDisplay.textContent = count;
  counterDisplay.classList.add('pop');
  setTimeout(() => counterDisplay.classList.remove('pop'), 150);
  console.log('Counter updated:', count);
}

incBtn.addEventListener('click', () => {
  count += 1;
  updateDisplay();
});

decBtn.addEventListener('click', () => {
  count -= 1;
  updateDisplay();
});

resetBtn.addEventListener('click', () => {
  count = 0;
  updateDisplay();
  console.log('Counter reset to 0');
});

console.log('🚀 Ready! Try clicking the buttons or editing the code.');
`,
      },
      {
        id: 'file-md-1',
        name: 'README.md',
        path: '/README.md',
        type: 'file',
        parentId: null,
        content: `# Modern Web App Starter

Welcome to your DevAcademy Coding Playground!

## Features
- **Monaco Editor**: Industry-standard code editor engine.
- **Multi-file System**: Organize your project with folders and multiple files.
- **Live Preview**: See your changes in real-time.
- **Integrated Terminal**: View console logs and runtime status.

## Tips
- Press \`Ctrl + S\` to save your files.
- Press \`Ctrl + Enter\` to run your project.
- Click the **+** icons in the file explorer to create new files or folders.
`,
      },
    ],
  },
  {
    id: 'python-starter',
    name: 'Python Backend App',
    description: 'Python project with main.py, algorithms, helper modules, and requirements.txt.',
    files: [
      {
        id: 'file-py-main',
        name: 'main.py',
        path: '/main.py',
        type: 'file',
        parentId: null,
        content: `"""
DevAcademy Python Playground
Entry point for Python backend execution
"""

import sys
import time
from utils import calculate_stats, fibonacci

def main():
    print("=" * 50)
    print("  🐍 DevAcademy Python Backend Runtime")
    print(f"  Python Version: {sys.version.split()[0]}")
    print("=" * 50)
    
    # 1. Fibonacci demonstration
    n = 10
    print(f"\\n[1] Generating first {n} Fibonacci numbers:")
    fib_series = fibonacci(n)
    print(f"    Sequence: {fib_series}")
    
    # 2. Statistical calculation
    scores = [88, 92, 79, 95, 84, 91, 100, 76]
    print(f"\\n[2] Analyzing Student Scores: {scores}")
    stats = calculate_stats(scores)
    for key, value in stats.items():
        print(f"    - {key}: {value}")
        
    # 3. Simple Object Oriented Programming
    print("\\n[3] DevAcademy Course Enrollment Simulation:")
    
    class Student:
        def __init__(self, name, track):
            self.name = name
            self.track = track
            self.xp = 0
            
        def complete_assignment(self, points):
            self.xp += points
            print(f"    ⭐ {self.name} earned {points} XP in {self.track}! Total: {self.xp} XP")

    alex = Student("Alex Rivera", "Fullstack Web & Python")
    alex.complete_assignment(150)
    alex.complete_assignment(200)

    print("\\n" + "=" * 50)
    print("✅ Python execution completed successfully!")
    print("=" * 50)

if __name__ == "__main__":
    main()
`,
      },
      {
        id: 'file-py-app',
        name: 'app.py',
        path: '/app.py',
        type: 'file',
        parentId: null,
        content: `"""
Microservice application mockup
"""

def create_app():
    return {
        "name": "DevAcademy Microservice",
        "status": "online",
        "routes": ["/", "/api/courses", "/api/students", "/api/grade"]
    }

if __name__ == "__main__":
    app = create_app()
    print("App config loaded:")
    for k, v in app.items():
        print(f"  {k}: {v}")
`,
      },
      {
        id: 'file-py-utils',
        name: 'utils.py',
        path: '/utils.py',
        type: 'file',
        parentId: null,
        content: `"""
Mathematical and utility helper functions
"""

def fibonacci(n):
    """Generate first n Fibonacci numbers."""
    if n <= 0:
        return []
    if n == 1:
        return [0]
    seq = [0, 1]
    while len(seq) < n:
        seq.append(seq[-1] + seq[-2])
    return seq

def calculate_stats(numbers):
    """Compute basic statistics for a list of numbers."""
    if not numbers:
        return {}
    total = sum(numbers)
    count = len(numbers)
    mean = total / count
    sorted_nums = sorted(numbers)
    median = sorted_nums[count // 2] if count % 2 != 0 else (sorted_nums[count // 2 - 1] + sorted_nums[count // 2]) / 2
    return {
        "Count": count,
        "Total": total,
        "Average": round(mean, 2),
        "Highest": max(numbers),
        "Lowest": min(numbers),
        "Median": median
    }
`,
      },
      {
        id: 'file-py-req',
        name: 'requirements.txt',
        path: '/requirements.txt',
        type: 'file',
        parentId: null,
        content: `# Python dependencies
requests>=2.31.0
numpy>=1.26.0
pandas>=2.1.0
pytest>=8.0.0
`,
      },
      {
        id: 'file-py-md',
        name: 'README.md',
        path: '/README.md',
        type: 'file',
        parentId: null,
        content: `# Python Backend Project

This project contains Python backend scripts:
- \`main.py\`: Primary entry point. Click **Run Python** to execute!
- \`app.py\`: Microservice logic.
- \`utils.py\`: Reusable helper modules imported into \`main.py\`.
- \`requirements.txt\`: Package manifest.

Execution runs via WebAssembly Python 3.11 with standard output streaming directly to the integrated terminal.
`,
      },
    ],
  },
  {
    id: 'fullstack-starter',
    name: 'Fullstack App (Web + Python + Data)',
    description: 'Complete project with frontend HTML/CSS/JS, Python backend script, and JSON data.',
    files: [
      {
        id: 'file-fs-html',
        name: 'index.html',
        path: '/index.html',
        type: 'file',
        parentId: null,
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fullstack Student Dashboard</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <header>
      <h1>DevAcademy Fullstack Portal</h1>
      <p class="tagline">Connected to Python backend services and data store</p>
    </header>

    <div class="dashboard-grid">
      <div class="card">
        <h3>Backend Status</h3>
        <p class="status-indicator"><span class="dot"></span> Python Service Ready</p>
        <button id="pingBtn" class="btn">Test Backend Ping</button>
      </div>

      <div class="card">
        <h3>Loaded Courses</h3>
        <ul id="courseList" class="course-list">
          <li>Loading data.json...</li>
        </ul>
      </div>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        id: 'file-fs-css',
        name: 'style.css',
        path: '/style.css',
        type: 'file',
        parentId: null,
        content: `body {
  background: #111827;
  color: #f3f4f6;
  font-family: system-ui, sans-serif;
  padding: 30px;
}
.container {
  max-width: 720px;
  margin: 0 auto;
}
header {
  margin-bottom: 24px;
}
h1 {
  font-size: 24px;
  color: #60a5fa;
}
.tagline {
  color: #9ca3af;
  font-size: 14px;
}
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.card {
  background: #1f2937;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #374151;
}
.card h3 {
  margin-bottom: 12px;
  font-size: 16px;
}
.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  margin-right: 6px;
}
.btn {
  margin-top: 14px;
  background: #2563eb;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}
.btn:hover {
  background: #1d4ed8;
}
.course-list {
  list-style: none;
  padding: 0;
  font-size: 13px;
  color: #d1d5db;
}
.course-list li {
  padding: 6px 0;
  border-bottom: 1px solid #374151;
}`,
      },
      {
        id: 'file-fs-js',
        name: 'script.js',
        path: '/script.js',
        type: 'file',
        parentId: null,
        content: `console.log('Connecting to student API...');

const courses = [
  { id: 1, title: 'Fullstack JavaScript Bootcamp', level: 'Intermediate' },
  { id: 2, title: 'Python for Data & Backend', level: 'Beginner' },
  { id: 3, title: 'Modern UI/UX with Tailwind', level: 'All Levels' }
];

const list = document.getElementById('courseList');
if (list) {
  list.innerHTML = courses.map(c => '<li><strong>' + c.title + '</strong> (' + c.level + ')</li>').join('');
}

document.getElementById('pingBtn')?.addEventListener('click', () => {
  console.log('[API] Ping sent to Python microservice: status 200 OK');
  alert('Backend ping responded in 12ms (status: healthy)');
});
`,
      },
      {
        id: 'file-fs-py',
        name: 'main.py',
        path: '/main.py',
        type: 'file',
        parentId: null,
        content: `"""
Python Backend API logic for Fullstack Starter
"""
import json

def get_courses():
    return [
        {"id": 101, "name": "Frontend Mastery", "students": 240},
        {"id": 102, "name": "Python Systems & APIs", "students": 195},
        {"id": 103, "name": "Fullstack Cloud Deployments", "students": 128}
    ]

if __name__ == "__main__":
    courses = get_courses()
    print("Fetched courses from backend database:")
    print(json.dumps(courses, indent=2))
`,
      },
      {
        id: 'file-fs-json',
        name: 'data.json',
        path: '/data.json',
        type: 'file',
        parentId: null,
        content: `{
  "school": "DevAcademy",
  "version": "2.0.0",
  "tracks": [
    "Frontend Development",
    "Python Backend",
    "Fullstack Engineering"
  ],
  "settings": {
    "autoSave": true,
    "theme": "dark"
  }
}`,
      },
      {
        id: 'file-fs-md',
        name: 'README.md',
        path: '/README.md',
        type: 'file',
        parentId: null,
        content: `# Fullstack Project Starter

This project demonstrates a combined frontend and Python backend architecture.
- Frontend files: \`index.html\`, \`style.css\`, \`script.js\`
- Backend files: \`main.py\`
- Configuration: \`data.json\`
`,
      },
    ],
  },
];
