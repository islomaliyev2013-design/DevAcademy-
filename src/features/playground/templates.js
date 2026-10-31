/**
 * Ready-to-use Starter Templates for the DevAcademy Coding Playground
 * 1. Interactive Counter
 * 2. Todo App
 * 3. Personal Portfolio
 * 4. Calculator
 * 5. Digital Clock
 * 6. Color Changer
 * 7. Responsive Landing Page
 */

export const STARTER_TEMPLATES = {
  counter: {
    id: 'counter',
    name: 'Interactive Counter',
    description: 'A dynamic counter with increment, decrement, step control, and animations.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Interactive Counter</title>
</head>
<body>
  <main class="container">
    <div class="counter-card">
      <div class="badge">JavaScript Counter</div>
      <h1 class="title">Interactive Counter</h1>
      <p class="subtitle">Control values with custom steps and reset animations.</p>

      <div class="display-container">
        <span id="counterValue" class="counter-display">0</span>
      </div>

      <div class="step-selector">
        <label for="stepSelect">Step size:</label>
        <select id="stepSelect">
          <option value="1">1</option>
          <option value="5" selected>5</option>
          <option value="10">10</option>
          <option value="25">25</option>
        </select>
      </div>

      <div class="controls-row">
        <button id="decrementBtn" class="btn btn-secondary" aria-label="Decrease">
          <span class="icon">−</span> Decrease
        </button>
        <button id="resetBtn" class="btn btn-outline" aria-label="Reset">
          Reset
        </button>
        <button id="incrementBtn" class="btn btn-primary" aria-label="Increase">
          <span class="icon">+</span> Increase
        </button>
      </div>

      <div class="history-card">
        <span class="history-label">Total Clicks: <strong id="totalClicks">0</strong></span>
        <span class="history-label">Status: <strong id="statusText">Neutral</strong></span>
      </div>
    </div>
  </main>
</body>
</html>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  color: #1e293b;
}

.container {
  width: 100%;
  max-width: 440px;
}

.counter-card {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 1.5rem;
  padding: 2.25rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.badge {
  display: inline-block;
  padding: 0.35rem 0.85rem;
  background: #ede9fe;
  color: #7c3aed;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}

.title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 1.5rem;
}

.display-container {
  background: #f8fafc;
  border: 2px dashed #e2e8f0;
  border-radius: 1.25rem;
  padding: 1.5rem;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.counter-display {
  font-size: 4rem;
  font-weight: 800;
  font-family: 'Courier New', monospace;
  color: #7c3aed;
  transition: transform 0.15s ease, color 0.2s ease;
  min-width: 120px;
  display: inline-block;
}

.step-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 1.5rem;
}

.step-selector select {
  padding: 0.4rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #cbd5e1;
  background: white;
  font-weight: 600;
  color: #7c3aed;
  cursor: pointer;
  outline: none;
}

.controls-row {
  display: flex;
  gap: 0.65rem;
  margin-bottom: 1.5rem;
}

.btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: all 0.15s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
}

.btn:active {
  transform: scale(0.96);
}

.btn-primary {
  background: #7c3aed;
  color: white;
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);
}

.btn-primary:hover {
  background: #6d28d9;
}

.btn-secondary {
  background: #0ea5e9;
  color: white;
  box-shadow: 0 4px 14px rgba(14, 165, 233, 0.35);
}

.btn-secondary:hover {
  background: #0284c7;
}

.btn-outline {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #cbd5e1;
}

.btn-outline:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.history-card {
  display: flex;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
  font-size: 0.8rem;
  color: #64748b;
}

.history-card strong {
  color: #0f172a;
}`,
    js: `// State management
let count = 0;
let totalClicks = 0;

// DOM Elements
const counterDisplay = document.getElementById('counterValue');
const stepSelect = document.getElementById('stepSelect');
const incrementBtn = document.getElementById('incrementBtn');
const decrementBtn = document.getElementById('decrementBtn');
const resetBtn = document.getElementById('resetBtn');
const totalClicksEl = document.getElementById('totalClicks');
const statusTextEl = document.getElementById('statusText');

function updateUI() {
  counterDisplay.textContent = count;
  totalClicksEl.textContent = totalClicks;

  // Visual cues based on value
  if (count > 0) {
    counterDisplay.style.color = '#10b981'; // Green
    statusTextEl.textContent = 'Positive';
    statusTextEl.style.color = '#10b981';
  } else if (count < 0) {
    counterDisplay.style.color = '#ef4444'; // Red
    statusTextEl.textContent = 'Negative';
    statusTextEl.style.color = '#ef4444';
  } else {
    counterDisplay.style.color = '#7c3aed'; // Purple
    statusTextEl.textContent = 'Neutral';
    statusTextEl.style.color = '#64748b';
  }

  // Animation pulse
  counterDisplay.style.transform = 'scale(1.15)';
  setTimeout(() => {
    counterDisplay.style.transform = 'scale(1)';
  }, 120);
}

function getStep() {
  return parseInt(stepSelect.value, 10) || 1;
}

incrementBtn.addEventListener('click', () => {
  count += getStep();
  totalClicks++;
  updateUI();
  console.log(\`[Counter] Incremented by \${getStep()}. Current value: \${count}\`);
});

decrementBtn.addEventListener('click', () => {
  count -= getStep();
  totalClicks++;
  updateUI();
  console.log(\`[Counter] Decremented by \${getStep()}. Current value: \${count}\`);
});

resetBtn.addEventListener('click', () => {
  count = 0;
  totalClicks++;
  updateUI();
  console.log('[Counter] Reset to 0');
});

console.log('Interactive Counter loaded successfully! Click the buttons to test.');`,
  },

  todo: {
    id: 'todo',
    name: 'Todo App',
    description: 'A full-featured task manager with filtering, completion toggling, and stats.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Todo App</title>
</head>
<body>
  <div class="todo-wrapper">
    <header class="app-header">
      <h2>My Tasks</h2>
      <span class="date-badge" id="currentDate">Today</span>
    </header>

    <form id="todoForm" class="todo-form">
      <input
        type="text"
        id="taskInput"
        placeholder="What needs to be accomplished today?"
        autocomplete="off"
        required
      />
      <button type="submit" class="add-btn">Add Task</button>
    </form>

    <div class="filter-bar">
      <button class="filter-btn active" data-filter="all">All (<span id="allCount">0</span>)</button>
      <button class="filter-btn" data-filter="active">Active (<span id="activeCount">0</span>)</button>
      <button class="filter-btn" data-filter="completed">Completed (<span id="completedCount">0</span>)</button>
    </div>

    <ul id="taskList" class="task-list"></ul>

    <footer class="app-footer">
      <span id="itemsLeft">0 tasks remaining</span>
      <button id="clearCompletedBtn" class="clear-btn">Clear Completed</button>
    </footer>
  </div>
</body>
</html>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f1f5f9;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2.5rem 1rem;
  color: #1e293b;
}

.todo-wrapper {
  background: #ffffff;
  width: 100%;
  max-width: 520px;
  border-radius: 1.25rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.app-header {
  background: linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%);
  color: white;
  padding: 1.5rem 1.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-header h2 {
  font-size: 1.4rem;
  font-weight: 700;
}

.date-badge {
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  font-weight: 500;
}

.todo-form {
  display: flex;
  padding: 1.25rem 1.5rem;
  gap: 0.75rem;
  background: #faf5ff;
  border-bottom: 1px solid #ede9fe;
}

#taskInput {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1.5px solid #ddd6fe;
  border-radius: 0.65rem;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

#taskInput:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
}

.add-btn {
  background: #7c3aed;
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 0.65rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.add-btn:hover {
  background: #6d28d9;
}

.add-btn:active {
  transform: scale(0.97);
}

.filter-bar {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  background: #ffffff;
}

.filter-btn {
  background: none;
  border: none;
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn.active {
  background: #ede9fe;
  color: #7c3aed;
}

.task-list {
  list-style: none;
  max-height: 380px;
  overflow-y: auto;
}

.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1.5rem;
  border-bottom: 1px solid #f8fafc;
  transition: background 0.15s;
}

.task-item:hover {
  background: #faf5ff;
}

.task-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.task-checkbox {
  width: 18px;
  height: 18px;
  accent-color: #7c3aed;
  cursor: pointer;
}

.task-text {
  font-size: 0.95rem;
  color: #334155;
  transition: all 0.2s;
}

.task-item.completed .task-text {
  text-decoration: line-through;
  color: #94a3b8;
}

.delete-btn {
  background: none;
  border: none;
  color: #cbd5e1;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.35rem;
  transition: color 0.2s, background 0.2s;
}

.delete-btn:hover {
  color: #ef4444;
  background: #fee2e2;
}

.empty-state {
  text-align: center;
  padding: 3rem 1.5rem;
  color: #94a3b8;
  font-size: 0.9rem;
}

.app-footer {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #64748b;
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
}

.clear-btn {
  background: none;
  border: none;
  color: #7c3aed;
  font-weight: 600;
  cursor: pointer;
}

.clear-btn:hover {
  text-decoration: underline;
}`,
    js: `// Initial tasks
let tasks = [
  { id: 1, text: 'Master modern JavaScript features', completed: true },
  { id: 2, text: 'Build an interactive web project', completed: false },
  { id: 3, text: 'Explore responsive CSS Flexbox & Grid', completed: false },
];

let currentFilter = 'all';

const todoForm = document.getElementById('todoForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const itemsLeft = document.getElementById('itemsLeft');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const currentDateEl = document.getElementById('currentDate');

// Set current date
const now = new Date();
currentDateEl.textContent = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

function renderTasks() {
  taskList.innerHTML = '';

  const filteredTasks = tasks.filter((task) => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  if (filteredTasks.length === 0) {
    taskList.innerHTML = \`<div class="empty-state">No tasks found in this view. Keep up the great work!</div>\`;
  } else {
    filteredTasks.forEach((task) => {
      const li = document.createElement('li');
      li.className = \`task-item \${task.completed ? 'completed' : ''}\`;
      li.innerHTML = \`
        <div class="task-content">
          <input type="checkbox" class="task-checkbox" \${task.completed ? 'checked' : ''} data-id="\${task.id}" />
          <span class="task-text">\${escapeHtml(task.text)}</span>
        </div>
        <button class="delete-btn" data-id="\${task.id}" title="Delete task">✕</button>
      \`;
      taskList.appendChild(li);
    });
  }

  // Update counts
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;

  document.getElementById('allCount').textContent = total;
  document.getElementById('activeCount').textContent = active;
  document.getElementById('completedCount').textContent = completed;
  itemsLeft.textContent = \`\${active} \${active === 1 ? 'task' : 'tasks'} remaining\`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;

  const newTask = {
    id: Date.now(),
    text,
    completed: false,
  };

  tasks.unshift(newTask);
  taskInput.value = '';
  renderTasks();
  console.log('[Todo] Added task:', text);
});

taskList.addEventListener('click', (e) => {
  if (e.target.classList.contains('task-checkbox')) {
    const id = Number(e.target.dataset.id);
    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
      renderTasks();
      console.log(\`[Todo] Toggled task "\${task.text}" to \${task.completed ? 'completed' : 'active'}\`);
    }
  } else if (e.target.classList.contains('delete-btn')) {
    const id = Number(e.target.dataset.id);
    const task = tasks.find((t) => t.id === id);
    tasks = tasks.filter((t) => t.id !== id);
    renderTasks();
    console.log('[Todo] Deleted task:', task ? task.text : id);
  }
});

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

clearCompletedBtn.addEventListener('click', () => {
  const initialLength = tasks.length;
  tasks = tasks.filter((t) => !t.completed);
  renderTasks();
  console.log(\`[Todo] Cleared \${initialLength - tasks.length} completed tasks\`);
});

// Initial render
renderTasks();
console.log('Todo App initialized with sample tasks.');`,
  },

  portfolio: {
    id: 'portfolio',
    name: 'Personal Portfolio',
    description: 'A stylish developer portfolio card with skills, projects, and an interactive contact modal.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Developer Portfolio</title>
</head>
<body>
  <div class="portfolio-container">
    <header class="hero">
      <div class="avatar-ring">
        <div class="avatar">⚡</div>
      </div>
      <h1 class="name">Sarah Jenkins</h1>
      <p class="role">Frontend Engineer & UI Architect</p>
      <div class="location">San Francisco, CA • Open for Opportunities</div>
    </header>

    <section class="section">
      <h2 class="section-title">Core Technologies</h2>
      <div class="tags" id="skillsContainer">
        <span class="tag">JavaScript (ESNext)</span>
        <span class="tag">React & Next.js</span>
        <span class="tag">TypeScript</span>
        <span class="tag">Tailwind CSS</span>
        <span class="tag">Node.js</span>
        <span class="tag">REST & GraphQL</span>
      </div>
    </section>

    <section class="section">
      <div class="section-header">
        <h2 class="section-title">Featured Projects</h2>
        <span class="badge" id="projectFilterNotice">Showing All (3)</span>
      </div>
      <div class="projects-grid" id="projectsGrid">
        <div class="project-card" data-title="CloudVibe Platform">
          <div class="project-header">
            <h3>CloudVibe Dashboard</h3>
            <span class="status-live">Live</span>
          </div>
          <p>Real-time analytics monitor processing 10k events/sec with WebSockets and D3 charts.</p>
          <div class="project-tech">React • TypeScript • Tailwind</div>
        </div>

        <div class="project-card" data-title="DevSync AI">
          <div class="project-header">
            <h3>DevSync AI Assistant</h3>
            <span class="status-live">Beta</span>
          </div>
          <p>Intelligent pair-programming extension for automated code review and unit test generation.</p>
          <div class="project-tech">Node.js • OpenAI • Vite</div>
        </div>

        <div class="project-card" data-title="EcoTrack UI">
          <div class="project-header">
            <h3>EcoTrack Mobile Web</h3>
            <span class="status-live">v2.0</span>
          </div>
          <p>Carbon footprint calculation engine with progressive offline capabilities.</p>
          <div class="project-tech">PWA • CSS Grid • Vanilla JS</div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <button id="contactBtn" class="primary-btn">Get In Touch</button>
      <button id="viewStatsBtn" class="secondary-btn">View GitHub Stats</button>
    </footer>

    <!-- Interactive dialog -->
    <div id="contactModal" class="modal-overlay">
      <div class="modal-box">
        <h3>Send a Message to Sarah</h3>
        <p>Thanks for visiting my portfolio! Leave your message below:</p>
        <textarea id="modalMessage" rows="4" placeholder="Hello! I would love to connect about..."></textarea>
        <div class="modal-actions">
          <button id="cancelModalBtn" class="secondary-btn">Close</button>
          <button id="sendModalBtn" class="primary-btn">Send Message</button>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #090d16;
  color: #f1f5f9;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
}

.portfolio-container {
  background: #111827;
  width: 100%;
  max-width: 580px;
  border-radius: 1.5rem;
  border: 1px solid #1f2937;
  padding: 2.25rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  position: relative;
}

.hero {
  text-align: center;
  margin-bottom: 2rem;
}

.avatar-ring {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed, #ec4899);
  padding: 3px;
  margin: 0 auto 1rem;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #1e1b4b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.name {
  font-size: 1.75rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 0.25rem;
}

.role {
  color: #a78bfa;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.location {
  font-size: 0.8rem;
  color: #94a3b8;
}

.section {
  margin-bottom: 1.75rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 0.75rem;
}

.badge {
  font-size: 0.75rem;
  background: #1e293b;
  color: #cbd5e1;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: #1f2937;
  border: 1px solid #374151;
  color: #cbd5e1;
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0.35rem 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tag:hover {
  background: #7c3aed;
  border-color: #8b5cf6;
  color: white;
  transform: translateY(-2px);
}

.projects-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.project-card {
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 0.75rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.project-card:hover {
  border-color: #7c3aed;
  transform: translateX(4px);
  background: #232d3f;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.35rem;
}

.project-header h3 {
  font-size: 0.95rem;
  color: #ffffff;
}

.status-live {
  font-size: 0.7rem;
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  font-weight: 600;
}

.project-card p {
  font-size: 0.825rem;
  color: #94a3b8;
  line-height: 1.4;
  margin-bottom: 0.5rem;
}

.project-tech {
  font-size: 0.75rem;
  color: #a78bfa;
  font-family: monospace;
}

.footer {
  display: flex;
  gap: 0.75rem;
  margin-top: 2rem;
}

.primary-btn, .secondary-btn {
  flex: 1;
  padding: 0.75rem;
  border-radius: 0.65rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.primary-btn {
  background: #7c3aed;
  color: white;
  border: none;
}

.primary-btn:hover {
  background: #6d28d9;
}

.secondary-btn {
  background: #1f2937;
  border: 1px solid #374151;
  color: #cbd5e1;
}

.secondary-btn:hover {
  background: #374151;
}

/* Modal */
.modal-overlay {
  display: none;
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  border-radius: 1.5rem;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  z-index: 10;
}

.modal-overlay.active {
  display: flex;
}

.modal-box {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 1rem;
  padding: 1.5rem;
  width: 100%;
}

.modal-box h3 {
  color: white;
  margin-bottom: 0.5rem;
}

.modal-box p {
  font-size: 0.85rem;
  color: #94a3b8;
  margin-bottom: 1rem;
}

.modal-box textarea {
  width: 100%;
  background: #0f172a;
  border: 1px solid #334155;
  color: white;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  outline: none;
  font-family: inherit;
  font-size: 0.85rem;
}

.modal-box textarea:focus {
  border-color: #7c3aed;
}

.modal-actions {
  display: flex;
  gap: 0.5rem;
}`,
    js: `const contactBtn = document.getElementById('contactBtn');
const viewStatsBtn = document.getElementById('viewStatsBtn');
const contactModal = document.getElementById('contactModal');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const sendModalBtn = document.getElementById('sendModalBtn');
const modalMessage = document.getElementById('modalMessage');
const projectCards = document.querySelectorAll('.project-card');
const tags = document.querySelectorAll('.tag');

// Open contact modal
contactBtn.addEventListener('click', () => {
  contactModal.classList.add('active');
  modalMessage.focus();
  console.log('[Portfolio] Opened contact modal');
});

// Close modal
cancelModalBtn.addEventListener('click', () => {
  contactModal.classList.remove('active');
});

// Send message
sendModalBtn.addEventListener('click', () => {
  const text = modalMessage.value.trim();
  if (!text) {
    alert('Please enter a short message before sending!');
    return;
  }
  alert('Thank you! Your message has been sent to Sarah.');
  console.log('[Portfolio] Message dispatched:', text);
  modalMessage.value = '';
  contactModal.classList.remove('active');
});

// Interactive project cards
projectCards.forEach((card) => {
  card.addEventListener('click', () => {
    const title = card.getAttribute('data-title');
    console.log(\`[Portfolio] User inspected project: "\${title}"\`);
    alert(\`Opening project details for: \${title}\`);
  });
});

// Tag click filter
tags.forEach((tag) => {
  tag.addEventListener('click', () => {
    console.log('[Portfolio] Skill tag clicked:', tag.textContent);
  });
});

viewStatsBtn.addEventListener('click', () => {
  console.log('[Portfolio] GitHub stats: 842 contributions this year, 14 repositories.');
  alert('GitHub Activity: 842 contributions in the last year across 14 open-source repositories! 🚀');
});

console.log('Portfolio template ready.');`,
  },

  calculator: {
    id: 'calculator',
    name: 'Calculator',
    description: 'A responsive digital calculator supporting arithmetic operations and clear memory.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Calculator</title>
</head>
<body>
  <div class="calc-wrapper">
    <div class="calc-card">
      <div class="brand-bar">
        <span>DEVACADEMY CALC</span>
        <span class="solar-panel"></span>
      </div>

      <div class="screen">
        <div id="prevOperand" class="prev-operand"></div>
        <div id="currOperand" class="curr-operand">0</div>
      </div>

      <div class="keypad">
        <button class="btn btn-action" data-action="clear">AC</button>
        <button class="btn btn-action" data-action="delete">DEL</button>
        <button class="btn btn-operator" data-operator="%">%</button>
        <button class="btn btn-operator" data-operator="÷">÷</button>

        <button class="btn btn-num" data-num="7">7</button>
        <button class="btn btn-num" data-num="8">8</button>
        <button class="btn btn-num" data-num="9">9</button>
        <button class="btn btn-operator" data-operator="×">×</button>

        <button class="btn btn-num" data-num="4">4</button>
        <button class="btn btn-num" data-num="5">5</button>
        <button class="btn btn-num" data-num="6">6</button>
        <button class="btn btn-operator" data-operator="−">−</button>

        <button class="btn btn-num" data-num="1">1</button>
        <button class="btn btn-num" data-num="2">2</button>
        <button class="btn btn-num" data-num="3">3</button>
        <button class="btn btn-operator" data-operator="+">+</button>

        <button class="btn btn-num btn-zero" data-num="0">0</button>
        <button class="btn btn-num" data-num=".">.</button>
        <button class="btn btn-equals" data-action="equals">=</button>
      </div>
    </div>
  </div>
</body>
</html>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace;
  background: #0f172a;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.calc-wrapper {
  width: 100%;
  max-width: 360px;
}

.calc-card {
  background: #1e293b;
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
  border: 1px solid #334155;
}

.brand-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #64748b;
  margin-bottom: 1rem;
}

.solar-panel {
  width: 50px;
  height: 14px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 3px;
}

.screen {
  background: #090d16;
  border-radius: 1rem;
  padding: 1.25rem;
  text-align: right;
  margin-bottom: 1.25rem;
  border: 1px solid #1e293b;
  min-height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.prev-operand {
  font-size: 0.9rem;
  color: #94a3b8;
  min-height: 1.2rem;
}

.curr-operand {
  font-size: 2.2rem;
  font-weight: 700;
  color: #ffffff;
  overflow-x: auto;
  white-space: nowrap;
}

.keypad {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.65rem;
}

.btn {
  border: none;
  border-radius: 0.75rem;
  font-size: 1.15rem;
  font-weight: 600;
  padding: 1rem 0;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}

.btn:active {
  transform: scale(0.95);
}

.btn-num {
  background: #334155;
  color: #ffffff;
}

.btn-num:hover {
  background: #475569;
}

.btn-zero {
  grid-column: span 2;
}

.btn-action {
  background: #475569;
  color: #fca5a5;
}

.btn-action:hover {
  background: #64748b;
}

.btn-operator {
  background: #7c3aed;
  color: #ffffff;
}

.btn-operator:hover {
  background: #6d28d9;
}

.btn-equals {
  background: #10b981;
  color: #ffffff;
}

.btn-equals:hover {
  background: #059669;
}`,
    js: `class Calculator {
  constructor(prevEl, currEl) {
    this.prevEl = prevEl;
    this.currEl = currEl;
    this.clear();
  }

  clear() {
    this.currOperand = '0';
    this.prevOperand = '';
    this.operation = undefined;
    this.updateDisplay();
  }

  delete() {
    if (this.currOperand === '0') return;
    if (this.currOperand.length === 1) {
      this.currOperand = '0';
    } else {
      this.currOperand = this.currOperand.slice(0, -1);
    }
    this.updateDisplay();
  }

  appendNumber(number) {
    if (number === '.' && this.currOperand.includes('.')) return;
    if (this.currOperand === '0' && number !== '.') {
      this.currOperand = number;
    } else {
      this.currOperand += number;
    }
    this.updateDisplay();
  }

  chooseOperation(operation) {
    if (this.currOperand === '') return;
    if (this.prevOperand !== '') {
      this.compute();
    }
    this.operation = operation;
    this.prevOperand = this.currOperand;
    this.currOperand = '0';
    this.updateDisplay();
  }

  compute() {
    let computation;
    const prev = parseFloat(this.prevOperand);
    const current = parseFloat(this.currOperand);
    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '−':
        computation = prev - current;
        break;
      case '×':
        computation = prev * current;
        break;
      case '÷':
        if (current === 0) {
          alert('Cannot divide by zero!');
          this.clear();
          return;
        }
        computation = prev / current;
        break;
      case '%':
        computation = (prev * current) / 100;
        break;
      default:
        return;
    }

    // Format output cleanly
    this.currOperand = Math.round(computation * 1000000) / 1000000 + '';
    this.operation = undefined;
    this.prevOperand = '';
    this.updateDisplay();
    console.log('[Calculator] Calculated result:', this.currOperand);
  }

  updateDisplay() {
    this.currEl.textContent = this.currOperand;
    if (this.operation != null) {
      this.prevEl.textContent = \`\${this.prevOperand} \${this.operation}\`;
    } else {
      this.prevEl.textContent = '';
    }
  }
}

const prevEl = document.getElementById('prevOperand');
const currEl = document.getElementById('currOperand');
const calc = new Calculator(prevEl, currEl);

document.querySelectorAll('[data-num]').forEach((btn) => {
  btn.addEventListener('click', () => calc.appendNumber(btn.dataset.num));
});

document.querySelectorAll('[data-operator]').forEach((btn) => {
  btn.addEventListener('click', () => calc.chooseOperation(btn.dataset.operator));
});

document.querySelectorAll('[data-action]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    if (action === 'clear') calc.clear();
    if (action === 'delete') calc.delete();
    if (action === 'equals') calc.compute();
  });
});

console.log('Calculator ready.');`,
  },

  clock: {
    id: 'clock',
    name: 'Digital Clock',
    description: 'A glowing real-time digital clock with format toggle and full date indicator.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Digital Clock</title>
</head>
<body>
  <div class="clock-container">
    <div class="clock-card">
      <div class="status-bar">
        <span class="badge">Live Time</span>
        <span id="timezoneDisplay" class="timezone">UTC</span>
      </div>

      <div class="display">
        <span id="hours" class="unit">00</span>
        <span class="colon">:</span>
        <span id="minutes" class="unit">00</span>
        <span class="colon">:</span>
        <span id="seconds" class="unit">00</span>
        <span id="ampm" class="ampm">AM</span>
      </div>

      <div class="date-row">
        <span id="dayName" class="day-name">Monday</span>,
        <span id="fullDate" class="full-date">January 1, 2026</span>
      </div>

      <div class="controls">
        <button id="formatToggleBtn" class="pill-btn">Switch to 24-Hour Format</button>
      </div>
    </div>
  </div>
</body>
</html>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: radial-gradient(circle at center, #1e1b4b 0%, #090d16 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.clock-container {
  width: 100%;
  max-width: 520px;
}

.clock-card {
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(124, 58, 237, 0.3);
  backdrop-filter: blur(12px);
  border-radius: 1.75rem;
  padding: 2.5rem 2rem;
  box-shadow: 0 0 50px rgba(124, 58, 237, 0.2);
  text-align: center;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.badge {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.4);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.timezone {
  color: #94a3b8;
  font-size: 0.85rem;
  font-family: monospace;
}

.display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.35rem;
  margin-bottom: 1.5rem;
}

.unit {
  font-size: 4rem;
  font-weight: 800;
  font-family: 'Courier New', Courier, monospace;
  color: #ffffff;
  text-shadow: 0 0 20px rgba(167, 139, 250, 0.6);
  min-width: 80px;
}

.colon {
  font-size: 3.5rem;
  color: #a78bfa;
  font-weight: 700;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.ampm {
  font-size: 1.5rem;
  font-weight: 700;
  color: #c4b5fd;
  margin-left: 0.5rem;
}

.date-row {
  color: #94a3b8;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.day-name {
  color: #a78bfa;
  font-weight: 600;
}

.full-date {
  color: #e2e8f0;
}

.controls {
  display: flex;
  justify-content: center;
}

.pill-btn {
  background: rgba(124, 58, 237, 0.2);
  border: 1px solid #7c3aed;
  color: #c4b5fd;
  padding: 0.6rem 1.25rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.pill-btn:hover {
  background: #7c3aed;
  color: white;
  box-shadow: 0 0 15px rgba(124, 58, 237, 0.4);
}`,
    js: `let is24Hour = false;

const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const ampmEl = document.getElementById('ampm');
const dayNameEl = document.getElementById('dayName');
const fullDateEl = document.getElementById('fullDate');
const timezoneDisplay = document.getElementById('timezoneDisplay');
const formatToggleBtn = document.getElementById('formatToggleBtn');

// Detect user timezone
try {
  timezoneDisplay.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;
} catch (e) {
  timezoneDisplay.textContent = 'Local Time';
}

function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  if (is24Hour) {
    ampmEl.style.display = 'none';
  } else {
    ampmEl.style.display = 'inline-block';
    ampmEl.textContent = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
  }

  hoursEl.textContent = String(hours).padStart(2, '0');
  minutesEl.textContent = String(minutes).padStart(2, '0');
  secondsEl.textContent = String(seconds).padStart(2, '0');

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  dayNameEl.textContent = days[now.getDay()];

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  fullDateEl.textContent = now.toLocaleDateString(undefined, options);
}

formatToggleBtn.addEventListener('click', () => {
  is24Hour = !is24Hour;
  formatToggleBtn.textContent = is24Hour ? 'Switch to 12-Hour Format' : 'Switch to 24-Hour Format';
  updateClock();
  console.log('[Clock] Format switched to:', is24Hour ? '24H' : '12H');
});

// Run immediately and every second
updateClock();
setInterval(updateClock, 1000);
console.log('Digital clock initialized.');`,
  },

  color_changer: {
    id: 'color_changer',
    name: 'Color Changer',
    description: 'An interactive color palette generator with hex copy and history tracking.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Color Changer</title>
</head>
<body>
  <div class="color-app">
    <div class="card">
      <header>
        <h2>Dynamic Color Studio</h2>
        <p>Generate harmonious colors, view RGB/HSL, and copy codes with one click.</p>
      </header>

      <div id="swatchPreview" class="swatch-preview">
        <span id="previewHex" class="hex-badge">#7C3AED</span>
      </div>

      <div class="metrics-row">
        <div class="metric-item">
          <label>HEX</label>
          <strong id="hexVal">#7C3AED</strong>
        </div>
        <div class="metric-item">
          <label>RGB</label>
          <strong id="rgbVal">124, 58, 237</strong>
        </div>
        <div class="metric-item">
          <label>HSL</label>
          <strong id="hslVal">262°, 83%, 58%</strong>
        </div>
      </div>

      <div class="action-buttons">
        <button id="randomizeBtn" class="btn btn-primary">🎲 Generate Random Color</button>
        <button id="copyHexBtn" class="btn btn-secondary">📋 Copy HEX Code</button>
      </div>

      <section class="history-section">
        <h3>Recent Swatches:</h3>
        <div id="historyList" class="history-list"></div>
      </section>
    </div>
  </div>
</body>
</html>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #0f172a;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.color-app {
  width: 100%;
  max-width: 480px;
}

.card {
  background: #ffffff;
  border-radius: 1.5rem;
  padding: 2.25rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
}

header h2 {
  font-size: 1.5rem;
  color: #0f172a;
  margin-bottom: 0.35rem;
}

header p {
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 1.5rem;
}

.swatch-preview {
  height: 160px;
  border-radius: 1rem;
  background: #7c3aed;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

.hex-badge {
  background: rgba(0, 0, 0, 0.45);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 9999px;
  font-family: monospace;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  backdrop-filter: blur(4px);
}

.metrics-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  background: #f8fafc;
  padding: 0.75rem;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.metric-item label {
  display: block;
  font-size: 0.65rem;
  font-weight: 700;
  color: #94a3b8;
  margin-bottom: 0.2rem;
}

.metric-item strong {
  font-size: 0.75rem;
  color: #1e293b;
  font-family: monospace;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.btn {
  flex: 1;
  padding: 0.75rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-primary {
  background: #7c3aed;
  color: white;
}

.btn-primary:hover {
  background: #6d28d9;
}

.btn-secondary {
  background: #ede9fe;
  color: #7c3aed;
}

.btn-secondary:hover {
  background: #ddd6fe;
}

.history-section h3 {
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.history-list {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
}

.history-item {
  width: 38px;
  height: 38px;
  border-radius: 0.5rem;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.15);
  flex-shrink: 0;
  transition: transform 0.15s;
}

.history-item:hover {
  transform: scale(1.15);
}`,
    js: `let currentColor = '#7C3AED';
const history = ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B'];

const swatchPreview = document.getElementById('swatchPreview');
const previewHex = document.getElementById('previewHex');
const hexVal = document.getElementById('hexVal');
const rgbVal = document.getElementById('rgbVal');
const hslVal = document.getElementById('hslVal');
const randomizeBtn = document.getElementById('randomizeBtn');
const copyHexBtn = document.getElementById('copyHexBtn');
const historyList = document.getElementById('historyList');

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function applyColor(hex) {
  currentColor = hex;
  swatchPreview.style.backgroundColor = hex;
  previewHex.textContent = hex;
  hexVal.textContent = hex;

  const rgb = hexToRgb(hex);
  rgbVal.textContent = \`\${rgb.r}, \${rgb.g}, \${rgb.b}\`;

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hslVal.textContent = \`\${hsl.h}°, \${hsl.s}%, \${hsl.l}%\`;
}

function renderHistory() {
  historyList.innerHTML = '';
  history.slice(0, 8).forEach((color) => {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.style.backgroundColor = color;
    div.title = color;
    div.onclick = () => {
      applyColor(color);
      console.log('[Color] Loaded color from history:', color);
    };
    historyList.appendChild(div);
  });
}

function generateRandomHex() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

randomizeBtn.addEventListener('click', () => {
  const newColor = generateRandomHex();
  applyColor(newColor);
  if (!history.includes(newColor)) {
    history.unshift(newColor);
    renderHistory();
  }
  console.log('[Color] Generated new color:', newColor);
});

copyHexBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(currentColor).then(() => {
    const originalText = copyHexBtn.textContent;
    copyHexBtn.textContent = '✓ Copied!';
    setTimeout(() => {
      copyHexBtn.textContent = originalText;
    }, 1500);
    console.log('[Color] Copied to clipboard:', currentColor);
  });
});

// Initialize
applyColor(currentColor);
renderHistory();
console.log('Color changer ready.');`,
  },

  landing_page: {
    id: 'landing_page',
    name: 'Responsive Landing Page',
    description: 'A modern SaaS landing page featuring a hero section, features grid, and interactive CTA.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DevFlow - Build Faster</title>
</head>
<body>
  <nav class="navbar">
    <div class="nav-container">
      <div class="logo">
        <span class="logo-icon">⚡</span>
        <strong>DevFlow</strong>
      </div>
      <div class="nav-links">
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
        <button id="navCta" class="cta-small">Get Started</button>
      </div>
    </div>
  </nav>

  <header class="hero-section">
    <div class="hero-badge">🚀 Introducing DevFlow v3.0</div>
    <h1 class="hero-title">Build Modern Web Apps <span class="gradient-text">10x Faster</span></h1>
    <p class="hero-desc">
      An integrated coding environment with real-time sandbox execution, AI-powered mentorship, and seamless deployment.
    </p>
    <div class="hero-buttons">
      <button id="primaryCta" class="btn btn-glow">Start Free Trial</button>
      <button id="demoBtn" class="btn btn-dark">Watch 2-Min Demo</button>
    </div>
  </header>

  <section id="features" class="features-section">
    <div class="section-tag">Powerful Capabilities</div>
    <h2 class="section-title">Everything you need to master code</h2>

    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">🛡️</div>
        <h3>Isolated Sandbox</h3>
        <p>Safely run user HTML, CSS, and JS code inside a high-performance sandbox with zero leakage.</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">🤖</div>
        <h3>AI Code Mentor</h3>
        <p>Get instant feedback, line-by-line debugging suggestions, and architectural tips from your AI copilot.</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">⚡</div>
        <h3>Instant Preview</h3>
        <p>Preview changes with zero lag. Responsive viewport modes for desktop, tablet, and mobile screens.</p>
      </div>
    </div>
  </section>

  <footer class="footer">
    <p>© 2026 DevFlow Technologies. Designed with love for passionate developers.</p>
  </footer>
</body>
</html>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #090d16;
  color: #f8fafc;
  line-height: 1.6;
}

.nav-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
}

.logo-icon {
  background: #7c3aed;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-links a {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: white;
}

.cta-small {
  background: #7c3aed;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.cta-small:hover {
  background: #6d28d9;
}

.hero-section {
  text-align: center;
  padding: 5rem 1.5rem 4rem;
  max-width: 800px;
  margin: 0 auto;
}

.hero-badge {
  display: inline-block;
  background: rgba(124, 58, 237, 0.15);
  border: 1px solid rgba(124, 58, 237, 0.4);
  color: #c4b5fd;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.35rem 0.9rem;
  border-radius: 9999px;
  margin-bottom: 1.5rem;
}

.hero-title {
  font-size: 2.75rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.25rem;
}

.gradient-text {
  background: linear-gradient(135deg, #a78bfa 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-desc {
  font-size: 1.1rem;
  color: #94a3b8;
  margin-bottom: 2rem;
}

.hero-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.85rem 1.75rem;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-glow {
  background: #7c3aed;
  color: white;
  box-shadow: 0 0 25px rgba(124, 58, 237, 0.5);
}

.btn-glow:hover {
  background: #6d28d9;
  transform: translateY(-2px);
}

.btn-dark {
  background: #1e293b;
  color: #cbd5e1;
  border: 1px solid #334155;
}

.btn-dark:hover {
  background: #334155;
}

.features-section {
  max-width: 1100px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
  text-align: center;
}

.section-tag {
  color: #7c3aed;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  background: #111827;
  border: 1px solid #1f2937;
  border-radius: 1rem;
  padding: 2rem;
  text-align: left;
  transition: transform 0.2s, border-color 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: #7c3aed;
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: #94a3b8;
  font-size: 0.9rem;
}

.footer {
  text-align: center;
  padding: 3rem 1.5rem;
  border-top: 1px solid #1f2937;
  color: #64748b;
  font-size: 0.85rem;
}`,
    js: `const primaryCta = document.getElementById('primaryCta');
const demoBtn = document.getElementById('demoBtn');
const navCta = document.getElementById('navCta');

primaryCta.addEventListener('click', () => {
  alert('Welcome to DevFlow! Ready to start your 14-day premium trial.');
  console.log('[Landing] User clicked "Start Free Trial"');
});

demoBtn.addEventListener('click', () => {
  alert('Launching interactive 2-minute product tour...');
  console.log('[Landing] User opened product demo');
});

navCta.addEventListener('click', () => {
  alert('Sign up or sign in to DevFlow account.');
  console.log('[Landing] Nav CTA triggered');
});

console.log('Landing Page template initialized.');`,
  },
};
