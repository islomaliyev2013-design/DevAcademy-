-- DevAcademy Pro Seed Data
-- Insert Achievements
INSERT INTO public.achievements (id, badge_key, title, description, icon_name, xp_award, criteria_type, criteria_threshold)
VALUES 
  ('a0000001-0000-0000-0000-000000000001', 'first_step', 'First Step', 'Completed your very first coding lesson', 'Footprints', 50, 'lessons_completed', 1),
  ('a0000002-0000-0000-0000-000000000002', 'code_warrior', 'Code Warrior', 'Completed 5 lessons across any courses', 'Award', 150, 'lessons_completed', 5),
  ('a0000003-0000-0000-0000-000000000003', 'quiz_ace', 'Quiz Master', 'Passed a quiz with a perfect 100% score', 'Sparkles', 100, 'quiz_score', 100),
  ('a0000004-0000-0000-0000-000000000004', 'on_fire', 'On Fire!', 'Maintained a 3-day active learning streak', 'Flame', 200, 'streak', 3),
  ('a0000005-0000-0000-0000-000000000005', 'builder_legend', 'Builder Legend', 'Submitted an assignment reviewed by an instructor', 'Code2', 250, 'assignments_completed', 1)
ON CONFLICT (badge_key) DO NOTHING;

-- Demo Profiles
INSERT INTO public.profiles (id, email, full_name, role, avatar_url, bio, xp, level, streak_days)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'alex.student@devacademy.pro', 'Alex Rivera', 'student', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'Aspiring full-stack engineer passionate about React and AI.', 320, 2, 4),
  ('00000000-0000-0000-0000-000000000002', 'sarah.teacher@devacademy.pro', 'Dr. Sarah Jenkins', 'teacher', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', 'Senior Software Architect and educator with 12+ years of industry experience.', 1800, 10, 15),
  ('00000000-0000-0000-0000-000000000003', 'admin@devacademy.pro', 'Elena Vance', 'admin', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'DevAcademy Pro System Administrator and Director of Curriculum.', 2500, 15, 30)
ON CONFLICT (id) DO NOTHING;

-- Demo Courses
INSERT INTO public.courses (id, title, slug, description, long_description, thumbnail_url, level, category, language, duration_hours, instructor_id, is_published, featured, learning_objectives, prerequisites)
VALUES
  (
    'c0000001-0000-0000-0000-000000000001',
    'Modern React & Component Architecture',
    'modern-react-architecture',
    'Master modern React 19, custom hooks, state management, and real-time reactive UI patterns.',
    'Dive deep into modern React paradigms: functional components, custom hooks, performance optimization with memoization, and component design patterns used by top tech companies.',
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    'Intermediate',
    'React & Frontend',
    'javascript',
    14,
    '00000000-0000-0000-0000-000000000002',
    true,
    true,
    '["Understand React Virtual DOM & reconciliation", "Build powerful reusable custom hooks", "Master state machines and context patterns", "Implement automated unit testing with Vitest"]'::jsonb,
    '["Basic knowledge of JavaScript ES6+", "HTML & CSS fundamentals"]'::jsonb
  ),
  (
    'c0000002-0000-0000-0000-000000000002',
    'Full-Stack JavaScript: From Zero to Hero',
    'fullstack-javascript-zero-to-hero',
    'Learn JavaScript from fundamental syntax through DOM manipulation and asynchronous APIs.',
    'The complete foundation every software engineer needs: variables, closures, prototypes, async/await, modern array methods, and real-time interactive browser applications.',
    'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800',
    'Beginner',
    'Web Development',
    'javascript',
    20,
    '00000000-0000-0000-0000-000000000002',
    true,
    true,
    '["Master core JS syntax: scopes, closures, arrays", "Manipulate the browser DOM dynamically", "Handle asynchronous operations using Promises and Fetch", "Write clean, modular, and maintainable code"]'::jsonb,
    '["No prior coding experience required!"]'::jsonb
  ),
  (
    'c0000003-0000-0000-0000-000000000003',
    'Interactive Web UI with HTML5 & Tailwind CSS',
    'interactive-web-ui-tailwind',
    'Create stunning, accessible, responsive websites with semantic HTML and utility-first styling.',
    'Learn how modern web design comes to life: flexbox, CSS grid, responsive breakpoints, accessible color palettes, glassmorphism, and utility-first Tailwind workflows.',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800',
    'Beginner',
    'CSS & Design',
    'html_css',
    8,
    '00000000-0000-0000-0000-000000000002',
    true,
    false,
    '["Build responsive multi-device layouts", "Master Tailwind CSS utility classes", "Understand semantic HTML structure & WCAG standards", "Design high-converting landing pages"]'::jsonb,
    '["Basic computer literacy"]'::jsonb
  ),
  (
    'c0000004-0000-0000-0000-000000000004',
    'Data Structures & Algorithms in JavaScript',
    'data-structures-algorithms-js',
    'Crack technical interviews with comprehensive coverage of arrays, trees, graphs, and Big-O notation.',
    'Strengthen your problem-solving prowess. Learn how to analyze time and space complexity, navigate recursive algorithms, binary search trees, and dynamic programming.',
    'https://images.unsplash.com/photo-1516116211227-bbc13c726cb7?w=800',
    'Advanced',
    'Computer Science',
    'javascript',
    18,
    '00000000-0000-0000-0000-000000000002',
    true,
    true,
    '["Analyze Big-O time and space complexity", "Implement stacks, queues, linked lists, and BSTs", "Solve recursion and dynamic programming problems", "Excel in technical coding interviews"]'::jsonb,
    '["Solid JavaScript programming background"]'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

-- Demo Lessons for Course 1 (Modern React)
INSERT INTO public.lessons (id, course_id, title, slug, order_index, content_markdown, code_example, code_language, starter_code, solution_code, xp_reward)
VALUES
  (
    'l0000001-0000-0000-0000-000000000001',
    'c0000001-0000-0000-0000-000000000001',
    'Introduction to React 19 & Component Mindset',
    'intro-to-react-19',
    1,
    '# Welcome to Modern React 19\n\nReact is a declarative, component-based library for building user interfaces.\n\n### Core Principles:\n1. **Declarative**: React makes it painless to create interactive UIs. Design simple views for each state in your application.\n2. **Component-Based**: Build encapsulated components that manage their own state, then compose them to make complex UIs.\n3. **Learn Once, Write Anywhere**: Develop new features without rewriting existing code.',
    'function Welcome({ name }) {\n  return <h1>Hello, {name}! Welcome to DevAcademy.</h1>;\n}',
    'javascript',
    '// Build a simple Welcome component\nfunction App() {\n  return (\n    <div className="card">\n      {/* Write your greeting here */}\n    </div>\n  );\n}',
    'function App() {\n  return (\n    <div className="card">\n      <h1>Welcome to DevAcademy Pro!</h1>\n    </div>\n  );\n}',
    25
  ),
  (
    'l0000002-0000-0000-0000-000000000002',
    'c0000001-0000-0000-0000-000000000001',
    'Managing State with useState & useReducer',
    'state-with-usestate-usereducer',
    2,
    '# State Management in React\n\nState allows components to "remember" things like user input, toggle states, and async data.\n\n### The `useState` Hook:\n```javascript\nconst [count, setCount] = useState(0);\n```\nAlways update state immutably!',
    'import { useState } from "react";\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;\n}',
    'javascript',
    'import React, { useState } from "react";\n\nexport default function Counter() {\n  // TODO: Declare state variable count\n  return (\n    <div>\n      {/* Add increment and decrement buttons */}\n    </div>\n  );\n}',
    'import React, { useState } from "react";\n\nexport default function Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div className="p-4 space-x-2">\n      <button onClick={() => setCount(count - 1)}>-</button>\n      <span>{count}</span>\n      <button onClick={() => setCount(count + 1)}>+</button>\n    </div>\n  );\n}',
    30
  ),
  (
    'l0000003-0000-0000-0000-000000000003',
    'c0000001-0000-0000-0000-000000000001',
    'Building Custom Hooks for Clean Code',
    'custom-hooks-architecture',
    3,
    '# Custom Hooks: Extracting Reusable Logic\n\nCustom hooks are JavaScript functions whose names start with `use` and can call other hooks.\n\nThey let you extract component logic into reusable functions across your entire application.',
    'function useWindowSize() {\n  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });\n  useEffect(() => {\n    const handler = () => setSize({ width: window.innerWidth, height: window.innerHeight });\n    window.addEventListener("resize", handler);\n    return () => window.removeEventListener("resize", handler);\n  }, []);\n  return size;\n}',
    'javascript',
    '// Create a custom hook useToggle\nfunction useToggle(initialValue = false) {\n  // TODO: implement\n}',
    'function useToggle(initialValue = false) {\n  const [value, setValue] = useState(initialValue);\n  const toggle = () => setValue(v => !v);\n  return [value, toggle];\n}',
    40
  )
ON CONFLICT (id) DO NOTHING;

-- Demo Assignments
INSERT INTO public.assignments (id, course_id, lesson_id, title, description, instructions, starter_code, test_criteria, max_points, created_by)
VALUES
  (
    'as000001-0000-0000-0000-000000000001',
    'c0000001-0000-0000-0000-000000000001',
    'l0000002-0000-0000-0000-000000000002',
    'Interactive Task Manager with React Hooks',
    'Build an interactive task list with add, toggle complete, and delete functionality.',
    '1. Create state to hold tasks array: [{ id, text, completed }]\n2. Add an input field and submit button to add new tasks\n3. Allow clicking a task to toggle its completed status\n4. Add a delete button to remove a task\n5. Display total pending vs completed tasks count',
    '// Task Manager Component\nfunction TaskApp() {\n  // Your code here\n  return <div>Task Manager</div>;\n}',
    'Criteria: State updates immutably, tasks can be added, toggled, and deleted cleanly.',
    100,
    '00000000-0000-0000-0000-000000000002'
  )
ON CONFLICT (id) DO NOTHING;

-- Demo Quizzes
INSERT INTO public.quizzes (id, course_id, lesson_id, title, description, time_limit_minutes, passing_score_percent, xp_reward)
VALUES
  (
    'q0000001-0000-0000-0000-000000000001',
    'c0000001-0000-0000-0000-000000000001',
    'l0000001-0000-0000-0000-000000000001',
    'React Fundamentals Checkup',
    'Test your understanding of React components, props, and declarative rendering.',
    10,
    70,
    60
  )
ON CONFLICT (id) DO NOTHING;

-- Quiz Questions
INSERT INTO public.quiz_questions (id, quiz_id, order_index, question_text, options, correct_option_index, explanation)
VALUES
  (
    'qq000001-0000-0000-0000-000000000001',
    'q0000001-0000-0000-0000-000000000001',
    1,
    'What is JSX in React?',
    '["A syntax extension to JavaScript that looks like HTML", "A new CSS preprocessor", "A database query language", "A server-side HTTP router"]'::jsonb,
    0,
    'JSX is a syntax extension to JavaScript that produces React elements and resembles HTML.'
  ),
  (
    'qq000002-0000-0000-0000-000000000002',
    'q0000001-0000-0000-0000-000000000001',
    2,
    'How are props passed to components in React?',
    '["Via global window variables", "As attributes on custom JSX tags", "Only through local storage", "Through SQL queries"]'::jsonb,
    1,
    'Props are passed to components like HTML attributes, e.g. <Component title="Hello" />.'
  ),
  (
    'qq000003-0000-0000-0000-000000000003',
    'q0000001-0000-0000-0000-000000000001',
    3,
    'Can React props be modified directly by the child component that receives them?',
    '["Yes, props are mutable variables", "No, props are read-only (immutable)", "Only if the component is an arrow function", "Yes, by calling this.props = newValue"]'::jsonb,
    1,
    'All React components must act like pure functions with respect to their props. Props are strictly read-only.'
  )
ON CONFLICT (id) DO NOTHING;
