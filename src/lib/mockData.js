// High-fidelity pre-seeded data for DevAcademy Pro

export const MOCK_USERS = [
  {
    id: 'user-student-1',
    email: 'alex.student@devacademy.pro',
    full_name: 'Alex Rivera',
    role: 'student',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    bio: 'Aspiring full-stack engineer passionate about React, TypeScript, and AI tools.',
    xp: 480,
    level: 3,
    streak_days: 5,
    created_at: '2025-01-10T10:00:00Z',
  },
  {
    id: 'user-teacher-1',
    email: 'sarah.teacher@devacademy.pro',
    full_name: 'Dr. Sarah Jenkins',
    role: 'teacher',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    bio: 'Senior Software Architect and educator with 12+ years of industry experience.',
    xp: 1800,
    level: 10,
    streak_days: 18,
    created_at: '2024-11-01T10:00:00Z',
  },
  {
    id: 'user-admin-1',
    email: 'elena.admin@devacademy.pro',
    full_name: 'Elena Vance',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    bio: 'DevAcademy Pro System Administrator and Director of Curriculum.',
    xp: 2900,
    level: 15,
    streak_days: 42,
    created_at: '2024-09-01T10:00:00Z',
  },
];

export const MOCK_ACHIEVEMENTS = [
  {
    id: 'ach-1',
    badge_key: 'first_step',
    title: 'First Step',
    description: 'Completed your very first coding lesson',
    icon_name: 'Footprints',
    xp_award: 50,
    criteria_type: 'lessons_completed',
    criteria_threshold: 1,
  },
  {
    id: 'ach-2',
    badge_key: 'code_warrior',
    title: 'Code Warrior',
    description: 'Completed 5 lessons across any courses',
    icon_name: 'Award',
    xp_award: 150,
    criteria_type: 'lessons_completed',
    criteria_threshold: 5,
  },
  {
    id: 'ach-3',
    badge_key: 'quiz_ace',
    title: 'Quiz Master',
    description: 'Passed a quiz with a perfect 100% score',
    icon_name: 'Sparkles',
    xp_award: 100,
    criteria_type: 'quiz_score',
    criteria_threshold: 100,
  },
  {
    id: 'ach-4',
    badge_key: 'on_fire',
    title: 'On Fire!',
    description: 'Maintained a 3-day active learning streak',
    icon_name: 'Flame',
    xp_award: 200,
    criteria_type: 'streak',
    criteria_threshold: 3,
  },
  {
    id: 'ach-5',
    badge_key: 'builder_legend',
    title: 'Builder Legend',
    description: 'Submitted an assignment reviewed by an instructor',
    icon_name: 'Code2',
    xp_award: 250,
    criteria_type: 'assignments_completed',
    criteria_threshold: 1,
  },
];

export const MOCK_COURSES = [
  {
    id: 'course-react-arch',
    title: 'Modern React & Component Architecture',
    slug: 'modern-react-architecture',
    description: 'Master modern React 19, custom hooks, state machines, and performant reactive design patterns.',
    long_description: 'Dive deep into modern React paradigms: functional components, custom hooks, performance optimization with memoization, and component design patterns used by top tech companies worldwide.',
    thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    level: 'Intermediate',
    category: 'React & Frontend',
    language: 'javascript',
    duration_hours: 14,
    instructor_id: 'user-teacher-1',
    instructor_name: 'Dr. Sarah Jenkins',
    is_published: true,
    featured: true,
    learning_objectives: [
      'Understand React Virtual DOM & reconciliation',
      'Build powerful reusable custom hooks',
      'Master state machines and context patterns',
      'Implement automated unit testing with Vitest and Testing Library'
    ],
    prerequisites: ['Basic JavaScript ES6+', 'HTML & CSS fundamentals'],
    enrolled_count: 342,
    rating: 4.9,
  },
  {
    id: 'course-fullstack-js',
    title: 'Full-Stack JavaScript: From Zero to Hero',
    slug: 'fullstack-javascript-zero-to-hero',
    description: 'Learn modern JavaScript from core syntax through asynchronous programming, DOM APIs, and Node.js.',
    long_description: 'The complete foundation every software engineer needs: variables, closures, prototypes, async/await, modern array methods, and real-time interactive browser applications.',
    thumbnail_url: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800',
    level: 'Beginner',
    category: 'Web Development',
    language: 'javascript',
    duration_hours: 20,
    instructor_id: 'user-teacher-1',
    instructor_name: 'Dr. Sarah Jenkins',
    is_published: true,
    featured: true,
    learning_objectives: [
      'Master core JS syntax: scopes, closures, arrays and objects',
      'Manipulate the browser DOM dynamically',
      'Handle asynchronous operations using Promises and Fetch',
      'Write clean, modular, and maintainable software'
    ],
    prerequisites: ['No prior coding experience required!'],
    enrolled_count: 512,
    rating: 4.8,
  },
  {
    id: 'course-tailwind-ui',
    title: 'Interactive Web UI with HTML5 & Tailwind CSS',
    slug: 'interactive-web-ui-tailwind',
    description: 'Create responsive, accessible, pixel-perfect interfaces with modern CSS grid and Tailwind utility classes.',
    long_description: 'Learn how modern web design comes to life: flexbox, CSS grid, responsive breakpoints, accessible color palettes, glassmorphism, and utility-first Tailwind workflows.',
    thumbnail_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800',
    level: 'Beginner',
    category: 'CSS & Design',
    language: 'html_css',
    duration_hours: 8,
    instructor_id: 'user-teacher-1',
    instructor_name: 'Dr. Sarah Jenkins',
    is_published: true,
    featured: false,
    learning_objectives: [
      'Build responsive multi-device layouts',
      'Master Tailwind CSS utility classes and config',
      'Understand semantic HTML structure & WCAG accessibility standards',
      'Design modern dark mode and glassmorphism systems'
    ],
    prerequisites: ['Basic computer literacy'],
    enrolled_count: 215,
    rating: 4.7,
  },
  {
    id: 'course-dsa-js',
    title: 'Data Structures & Algorithms in JavaScript',
    slug: 'data-structures-algorithms-js',
    description: 'Ace technical interviews with deep coverage of arrays, linked lists, trees, graphs, and Big-O notation.',
    long_description: 'Strengthen your problem-solving prowess. Learn how to analyze time and space complexity, navigate recursive algorithms, binary search trees, and dynamic programming.',
    thumbnail_url: 'https://images.unsplash.com/photo-1516116211227-bbc13c726cb7?w=800',
    level: 'Advanced',
    category: 'Computer Science',
    language: 'javascript',
    duration_hours: 18,
    instructor_id: 'user-teacher-1',
    instructor_name: 'Dr. Sarah Jenkins',
    is_published: true,
    featured: true,
    learning_objectives: [
      'Analyze Big-O time and space complexity like a senior engineer',
      'Implement stacks, queues, linked lists, and BSTs from scratch',
      'Solve recursion and dynamic programming problems',
      'Excel in technical coding interviews at top tech companies'
    ],
    prerequisites: ['Solid JavaScript programming background'],
    enrolled_count: 188,
    rating: 4.9,
  },
];

export const MOCK_LESSONS = [
  {
    id: 'lesson-react-1',
    course_id: 'course-react-arch',
    title: 'Introduction to React 19 & Component Architecture',
    slug: 'intro-to-react-19',
    order_index: 1,
    content_markdown: `### Welcome to Modern React 19

React is a declarative, efficient, and flexible JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called **components**.

#### 1. Why Declarative?
In React, you describe **what** you want to render, rather than telling the browser step-by-step **how** to update the DOM.

\`\`\`javascript
function WelcomeMessage({ user }) {
  return (
    <div className="p-4 bg-brand-50 rounded-lg border border-brand-200">
      <h2 className="text-xl font-bold text-brand-900">Welcome, {user.name}!</h2>
      <p className="text-slate-600">Ready to level up your engineering skills today?</p>
    </div>
  );
}
\`\`\`

#### 2. Key Takeaways
- Components are JavaScript functions returning JSX.
- Props allow data flow down the component hierarchy.
- React efficiently reconciles changes using a virtual representation of the DOM.`,
    code_example: `function Badge({ text, color = 'violet' }) {
  return (
    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-brand-100 text-brand-700">
      {text}
    </span>
  );
}`,
    code_language: 'javascript',
    starter_code: `<!-- HTML Structure -->
<div id="app" class="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
  <h2 class="text-2xl font-bold text-violet-700">Hello DevAcademy!</h2>
  <p class="text-slate-600">Edit this HTML, CSS, or JavaScript and click Run to test.</p>
  <button id="actionBtn" class="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg shadow transition">
    Click Me!
  </button>
  <div id="output" class="text-sm font-semibold text-emerald-600"></div>
</div>`,
    solution_code: `// Interactive button handler
document.getElementById('actionBtn').addEventListener('click', () => {
  document.getElementById('output').textContent = 'Awesome! Code executed successfully.';
});`,
    xp_reward: 25,
  },
  {
    id: 'lesson-react-2',
    course_id: 'course-react-arch',
    title: 'State Management with useState & useReducer',
    slug: 'state-with-usestate-usereducer',
    order_index: 2,
    content_markdown: `### Managing Reactive State

State is the memory of a component. Unlike regular variables that reset on every re-render, state variables persist across renders.

#### The Rules of State
1. **Never mutate state directly**: Always use the setter function or dispatch action.
2. **Batching**: React 18 & 19 automatically batches state updates for optimal performance.
3. **Derived state**: If a value can be computed from existing props or state, don't store it in state!

\`\`\`javascript
const [counter, setCounter] = useState(0);

// Correct update using functional updater
setCounter(prev => prev + 1);
\`\`\``,
    code_example: `import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex items-center gap-3">
      <button onClick={() => setCount(c => c - 1)} className="btn-secondary">-</button>
      <span className="font-mono text-lg">{count}</span>
      <button onClick={() => setCount(c => c + 1)} className="btn-primary">+</button>
    </div>
  );
}`,
    code_language: 'javascript',
    starter_code: `<div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg border border-slate-100">
  <h3 class="text-lg font-bold text-slate-800">Interactive Counter</h3>
  <div class="flex items-center gap-4 mt-4">
    <button id="decrement" class="px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded font-bold">-</button>
    <span id="counterValue" class="text-2xl font-bold font-mono text-violet-600">0</span>
    <button id="increment" class="px-3 py-1 bg-violet-600 hover:bg-violet-700 text-white rounded font-bold">+</button>
  </div>
</div>`,
    solution_code: `let count = 0;
const val = document.getElementById('counterValue');
document.getElementById('increment').onclick = () => { count++; val.textContent = count; };
document.getElementById('decrement').onclick = () => { count--; val.textContent = count; };`,
    xp_reward: 35,
  },
  {
    id: 'lesson-react-3',
    course_id: 'course-react-arch',
    title: 'Building Custom Hooks for Clean Code',
    slug: 'custom-hooks-architecture',
    order_index: 3,
    content_markdown: `### Custom Hooks: The Ultimate Tool for Reusability

Custom hooks let you extract component logic into reusable functions.

#### Conventions:
- Name must start with \`use\` (e.g., \`useFetch\`, \`useLocalStorage\`).
- Can call other React hooks internally.
- Each call to a hook gets completely isolated state.

\`\`\`javascript
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
\`\`\``,
    code_example: `function useToggle(initial = false) {
  const [val, setVal] = useState(initial);
  const toggle = () => setVal(v => !v);
  return [val, toggle];
}`,
    code_language: 'javascript',
    starter_code: `<div class="p-6 bg-white rounded-xl shadow space-y-3">
  <div id="statusPill" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
    ● Online
  </div>
  <p class="text-sm text-slate-500">Toggle simulated connection status:</p>
  <button id="toggleBtn" class="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium">Toggle Status</button>
</div>`,
    solution_code: `let online = true;
const pill = document.getElementById('statusPill');
document.getElementById('toggleBtn').onclick = () => {
  online = !online;
  pill.textContent = online ? '● Online' : '○ Offline';
  pill.className = online 
    ? 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800' 
    : 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800';
};`,
    xp_reward: 40,
  },
  {
    id: 'lesson-js-1',
    course_id: 'course-fullstack-js',
    title: 'JavaScript Essentials: Scope, Closures & Context',
    slug: 'scope-closures-context',
    order_index: 1,
    content_markdown: `### Scopes and Closures in Modern JS

A **closure** is the combination of a function bundled together with references to its surrounding state (the lexical environment).

Closures give you access to an outer function's scope from an inner function.

\`\`\`javascript
function makeCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}

const counterA = makeCounter();
console.log(counterA()); // 1
console.log(counterA()); // 2
\`\`\``,
    code_example: `function createGreeter(prefix) {
  return function(name) {
    return \`\${prefix}, \${name}!\`;
  };
}
const hello = createGreeter("Hello");
console.log(hello("Dev"));`,
    code_language: 'javascript',
    starter_code: `<div class="p-6 bg-white rounded-xl shadow space-y-3">
  <h3 class="font-bold text-slate-800">Closure Demonstration</h3>
  <button id="clickCountBtn" class="px-4 py-2 bg-violet-600 text-white rounded">Clicks: 0</button>
</div>`,
    solution_code: `function createCounter() {
  let c = 0;
  return () => ++c;
}
const count = createCounter();
const btn = document.getElementById('clickCountBtn');
btn.onclick = () => { btn.textContent = 'Clicks: ' + count(); };`,
    xp_reward: 30,
  }
];

export const MOCK_ASSIGNMENTS = [
  {
    id: 'assign-1',
    course_id: 'course-react-arch',
    lesson_id: 'lesson-react-2',
    title: 'Interactive Task Manager Component',
    description: 'Build an interactive task list with add, toggle complete, and delete functionality.',
    instructions: `1. Implement state to store tasks array: [{ id, text, completed }].
2. Create an input field and submit button to add new tasks.
3. Allow clicking a task to toggle its completed state.
4. Add a delete button to remove a task.
5. Display live count of pending vs completed tasks.`,
    starter_code: `<!-- Task App Template -->
<div class="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg border border-slate-100">
  <h2 class="text-xl font-bold text-slate-900 mb-4">Task Tracker</h2>
  <div class="flex gap-2 mb-4">
    <input id="taskInput" placeholder="Add a new task..." class="flex-1 px-3 py-2 border rounded-lg text-sm outline-none focus:border-violet-500" />
    <button id="addBtn" class="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700">Add</button>
  </div>
  <ul id="taskList" class="space-y-2"></ul>
  <div class="mt-4 pt-3 border-t text-xs text-slate-500 flex justify-between">
    <span id="pendingCount">0 items pending</span>
  </div>
</div>`,
    test_criteria: 'Tasks can be added, toggled complete with strikethrough, deleted, and counter accurately updates.',
    due_date: '2026-11-15T23:59:59Z',
    max_points: 100,
    created_by: 'user-teacher-1',
  },
  {
    id: 'assign-2',
    course_id: 'course-fullstack-js',
    lesson_id: 'lesson-js-1',
    title: 'Custom Array Filter & Map Implementations',
    description: 'Recreate Array.prototype.map and Array.prototype.filter from scratch using closures and callbacks.',
    instructions: `1. Implement \`myMap(array, callback)\` without using \`.map()\`.
2. Implement \`myFilter(array, predicate)\` without using \`.filter()\`.
3. Test both functions with numeric and string arrays.`,
    starter_code: `function myMap(arr, fn) {
  // Your code here
}

function myFilter(arr, fn) {
  // Your code here
}`,
    test_criteria: 'Functions must return new arrays without mutating the original input array.',
    due_date: '2026-11-20T23:59:59Z',
    max_points: 100,
    created_by: 'user-teacher-1',
  }
];

export const MOCK_SUBMISSIONS = [
  {
    id: 'sub-1',
    assignment_id: 'assign-1',
    student_id: 'user-student-1',
    student_name: 'Alex Rivera',
    code_content: `// Solution submitted by Alex Rivera
const tasks = [];
function render() {
  const list = document.getElementById('taskList');
  list.innerHTML = tasks.map((t, i) => \`
    <li class="flex items-center justify-between p-2 rounded bg-slate-50">
      <span class="\${t.completed ? 'line-through text-slate-400' : 'text-slate-800'}">\${t.text}</span>
      <button onclick="removeTask(\${i})" class="text-rose-500 text-xs">Delete</button>
    </li>
  \`).join('');
  document.getElementById('pendingCount').textContent = tasks.filter(t => !t.completed).length + ' items pending';
}`,
    status: 'graded',
    score: 95,
    feedback: 'Great job! Clean separation of concerns and responsive UI rendering.',
    submitted_at: '2025-01-20T14:30:00Z',
    graded_at: '2025-01-21T09:15:00Z',
    graded_by: 'user-teacher-1',
  }
];

export const MOCK_QUIZZES = [
  {
    id: 'quiz-react-1',
    course_id: 'course-react-arch',
    lesson_id: 'lesson-react-1',
    title: 'React Fundamentals Checkup',
    description: 'Verify your knowledge of React components, props immutability, and virtual DOM rendering.',
    time_limit_minutes: 10,
    passing_score_percent: 70,
    xp_reward: 60,
    questions: [
      {
        id: 'q1',
        order_index: 1,
        question_text: 'What is JSX in React?',
        options: [
          'A syntax extension to JavaScript that looks like HTML',
          'A new CSS preprocessor for styling',
          'A SQL-based database query syntax',
          'A browser server engine'
        ],
        correct_option_index: 0,
        explanation: 'JSX allows you to write HTML-like markup inside a JavaScript file, which is transformed into standard JavaScript function calls.',
      },
      {
        id: 'q2',
        order_index: 2,
        question_text: 'How should props be modified within a child component?',
        options: [
          'Directly by assigning this.props.x = value',
          'Props are strictly read-only and must never be mutated',
          'By using the delete operator on props',
          'By calling document.setProp()'
        ],
        correct_option_index: 1,
        explanation: 'All React components must act as pure functions with respect to their props. Never mutate props directly.',
      },
      {
        id: 'q3',
        order_index: 3,
        question_text: 'Why does React require unique keys when rendering lists of elements?',
        options: [
          'To generate random CSS classes',
          'To help React identify which items have changed, been added, or removed',
          'To satisfy browser cookie requirements',
          'To encrypt list items for security'
        ],
        correct_option_index: 1,
        explanation: 'Keys give React an identity for each list element, enabling efficient reconciliation and state preservation across re-renders.',
      },
      {
        id: 'q4',
        order_index: 4,
        question_text: 'When does the useState setter re-render the component?',
        options: [
          'Only when the new state differs from the previous state (Object.is comparison)',
          'Every 100 milliseconds automatically',
          'Never unless window.reload() is called',
          'Only in production mode'
        ],
        correct_option_index: 0,
        explanation: 'React compares the new state with the previous state using Object.is. If identical, it skips re-rendering the component and its children.',
      }
    ]
  }
];

export const MOCK_ENROLLMENTS = [
  {
    id: 'enr-1',
    student_id: 'user-student-1',
    course_id: 'course-react-arch',
    enrolled_at: '2025-01-15T08:00:00Z',
    progress_percent: 66,
    completed_at: null,
  },
  {
    id: 'enr-2',
    student_id: 'user-student-1',
    course_id: 'course-fullstack-js',
    enrolled_at: '2025-01-18T10:00:00Z',
    progress_percent: 25,
    completed_at: null,
  }
];

export const MOCK_LESSON_PROGRESS = [
  {
    student_id: 'user-student-1',
    lesson_id: 'lesson-react-1',
    course_id: 'course-react-arch',
    completed: true,
    completed_at: '2025-01-16T11:00:00Z',
  },
  {
    student_id: 'user-student-1',
    lesson_id: 'lesson-react-2',
    course_id: 'course-react-arch',
    completed: true,
    completed_at: '2025-01-18T16:00:00Z',
  }
];

export const MOCK_STUDENT_ACHIEVEMENTS = [
  {
    student_id: 'user-student-1',
    achievement_id: 'ach-1',
    unlocked_at: '2025-01-16T11:05:00Z',
  },
  {
    student_id: 'user-student-1',
    achievement_id: 'ach-4',
    unlocked_at: '2025-01-19T09:00:00Z',
  }
];

export const MOCK_ACTIVITY_DATA = [
  { day: 'Mon', xp: 45, minutes: 35 },
  { day: 'Tue', xp: 80, minutes: 60 },
  { day: 'Wed', xp: 60, minutes: 40 },
  { day: 'Thu', xp: 120, minutes: 90 },
  { day: 'Fri', xp: 95, minutes: 75 },
  { day: 'Sat', xp: 140, minutes: 110 },
  { day: 'Sun', xp: 85, minutes: 50 },
];
