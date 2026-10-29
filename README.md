# DevAcademy Pro 🚀
### Advanced AI-Powered Coding Education Platform

DevAcademy Pro is a full-stack, interactive programming education platform where students can learn software engineering, complete coding exercises, execute code in the browser, take quizzes, track learning analytics, and receive real-time AI-powered code mentorship.

Built with **React 19**, **Vite**, **Tailwind CSS**, **Monaco Editor**, **Supabase Auth & PostgreSQL**, and **Recharts**.

---

## 🌟 Key Features

### 1. Multi-Role Ecosystem
- **👨‍🎓 Student:** Browse courses, view structured syllabi, write code in the live sandbox, submit assignments, take timed auto-graded quizzes, maintain study streaks, and earn XP badges.
- **👩‍🏫 Teacher:** Create and publish courses, author markdown lessons with starter code, post assignments with test criteria, inspect student submissions, and award grades with constructive feedback.
- **🛡️ Admin:** Access real-time platform telemetry, user role authorization, curriculum moderation, and platform stability settings.

### 2. 💻 Interactive In-Browser Code Playground
- **Monaco Editor** integration with separate HTML, CSS, and JavaScript editing tabs.
- **Isolated Sandboxed Execution** (`iframe` sandbox with `allow-scripts`) preventing arbitrary server execution.
- Real-time **Execution Console** intercepting `console.log()` and runtime `window.onerror`.
- Built-in starter templates (Counter App, Todo App, and custom project templates).
- Local state saving and direct assignment submission from the playground.

### 3. 🤖 Intelligent AI Coding Mentor
- Contextual assistance directly aware of the code active in the student's editor.
- Explains abstract programming concepts in plain English.
- Diagnoses runtime bugs, unhandled exceptions, and edge cases.
- Recommends idiomatic best practices, refactoring tips, and complexity analysis.
- Copy code functionality, markdown snippet syntax styling, and quick prompt suggestions.
- Backend architecture: Supabase Edge Function (`supabase/functions/ai-mentor`) protecting private server keys.

### 4. 🏆 Gamification & Progress System
- **XP Progression:** Earn XP for completing lessons, passing quizzes, and submitting assignments.
- **Levels & Ranks:** Automatically level up as XP grows.
- **Learning Streaks:** Daily streak tracker encouraging consistent coding habits.
- **Badges:** Unlock milestone awards (*First Step*, *Code Warrior*, *Quiz Master*, *On Fire!*).
- **Global Leaderboard:** Compare progress with fellow developers.

### 5. 🔒 Security & Supabase Row Level Security (RLS)
- Public registration strictly awards default **Student** role; elevated Teacher/Admin roles require trusted admin authorization.
- Version-controlled SQL migration (`supabase/migrations/20250101000000_init_schema.sql`).
- Granular PostgreSQL Row Level Security (RLS) policies protecting student submissions, quiz attempts, and instructor course management.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, Vite 8 |
| **Styling & UI** | Tailwind CSS v3, Lucide React, Canvas-Confetti |
| **Routing** | React Router DOM v7 (BrowserRouter with Protected Routes) |
| **Code Editor** | Monaco Editor (`@monaco-editor/react`) |
| **Data Visualizations** | Recharts (Area charts, trend analytics) |
| **Forms & Validation** | React Hook Form, Zod |
| **Backend & DB** | Supabase (PostgreSQL, Storage, Auth, Edge Functions) |
| **Testing** | Vitest, React Testing Library, jsdom |
| **CI / CD** | GitHub Actions (`.github/workflows/ci.yml`) |

---

## 📁 Project Architecture

```
devAcademy/
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated CI checks (tests, build)
├── public/                      # Static assets & icons
├── src/
│   ├── app/
│   │   ├── providers.jsx        # Auth & Toast context wrapper
│   │   └── router.jsx           # React Router DOM route tree
│   ├── components/
│   │   ├── common/              # Navbar, Footer, RoleSwitchBanner
│   │   ├── layout/              # AppLayout, DashboardLayout
│   │   └── ui/                  # Button, Card, Input, Badge, Modal, Skeleton, Toast
│   ├── features/
│   │   ├── ai-mentor/           # AIMentorWidget, chat prompt suggestions
│   │   ├── auth/                # AuthContext, ProtectedRoute
│   │   ├── courses/             # CourseCard, filters, curriculum
│   │   ├── playground/          # CodePlayground, sandboxed iframe, console
│   │   ├── progress/            # LearningActivityChart (Recharts)
│   │   └── quizzes/             # QuizRunner, auto-grading, confetti
│   ├── lib/
│   │   ├── mockData.js          # High-fidelity realistic seed data for instant testing
│   │   ├── supabase.js          # Supabase client & environment detection
│   │   └── validators.js        # Zod validation schemas
│   ├── pages/
│   │   ├── admin/               # AdminDashboard, Users, Courses, Settings
│   │   ├── auth/                # LoginPage, RegisterPage, ForgotPasswordPage
│   │   ├── courses/             # CoursesCatalogPage, CourseDetailPage
│   │   ├── landing/             # LandingPage with Hero, Features, Testimonials, FAQ
│   │   ├── student/             # StudentDashboard, MyCourses, LessonPlayer, Assignments, Quizzes
│   │   └── teacher/             # TeacherDashboard, Courses, Lessons, Assignments, Submissions
│   ├── services/
│   │   ├── aiMentorService.js   # Edge Function client & pedagogical fallback
│   │   └── dataService.js       # Unified data access (Supabase / LocalStorage mock)
│   ├── test/                    # Vitest unit & integration test suite
│   ├── App.jsx
│   ├── index.css                # Tailwind directives & design tokens
│   └── main.jsx
├── supabase/
│   ├── functions/
│   │   └── ai-mentor/index.ts   # Edge Function for server-side AI requests
│   ├── migrations/
│   │   └── 20250101000000_init_schema.sql
│   └── seed.sql                 # Demo courses, lessons, quizzes, achievements
├── .env.example
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## ⚡ Getting Started

### 1. Prerequisites
- **Node.js**: v18+ or v20+ recommended (`node -v`)
- **npm**: v9+ (`npm -v`)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/your-username/devacademy-pro.git
cd devacademy-pro
npm install --legacy-peer-deps
```

### 3. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Populate your Supabase configuration:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Server-Side Only Secret (Supabase Edge Function Secrets)
AI_API_KEY=your_gemini_or_openai_api_key
```

> **Note on Zero-Configuration Demo Mode:** If Supabase credentials are not provided, DevAcademy Pro automatically starts in **Interactive Demo Mode** with persistent LocalStorage state. You can test all Student, Teacher, and Admin flows immediately without requiring an active remote database.

### 4. Running the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🧪 Testing and Quality Assurance

Run the automated Vitest test suite:
```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

Build the production bundle:
```bash
npm run build
```

---

## 🗄️ Database Setup & Migrations

If linking to a live Supabase project:
1. Initialize the Supabase CLI in your project:
   ```bash
   supabase init
   ```
2. Apply the PostgreSQL migration:
   ```bash
   supabase db push
   # Or run supabase/migrations/20250101000000_init_schema.sql in the Supabase SQL Editor
   ```
3. Seed realistic demo courses, lessons, and quizzes:
   ```bash
   # Run supabase/seed.sql in the Supabase SQL Editor
   ```
4. Deploy the AI Mentor Edge Function:
   ```bash
   supabase functions deploy ai-mentor --no-verify-jwt
   supabase secrets set AI_API_KEY=your_key_here
   ```

---

## 👥 GitHub Flow & Collaboration Guidelines

To maintain code health in a multi-developer environment:

1. **Main Branch Stability:** The `main` branch is always deployable and protected.
2. **Feature Branches:** Create dedicated branches following the naming convention:
   - `feat/course-catalog`
   - `feat/ai-mentor`
   - `fix/auth-validation`
   - `test/quiz-runner`
3. **Pull Request Protocol:**
   - Every PR must pass automated CI checks (linter, Vitest tests, production build).
   - Require code review before merging.
   - Never commit `.env` or credentials.

---

## 📄 License
MIT License. Crafted with excellence for developers learning the craft.
