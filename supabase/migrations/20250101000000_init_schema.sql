-- DevAcademy Pro Initial PostgreSQL Database Schema
-- Supabase Migration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    avatar_url TEXT,
    bio TEXT,
    xp INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    streak_days INTEGER NOT NULL DEFAULT 0,
    last_active_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    long_description TEXT,
    thumbnail_url TEXT,
    level TEXT NOT NULL DEFAULT 'Beginner' CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
    category TEXT NOT NULL DEFAULT 'Web Development',
    language TEXT NOT NULL DEFAULT 'javascript',
    duration_hours NUMERIC NOT NULL DEFAULT 10,
    instructor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_published BOOLEAN NOT NULL DEFAULT true,
    featured BOOLEAN NOT NULL DEFAULT false,
    learning_objectives JSONB DEFAULT '[]'::jsonb,
    prerequisites JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. ENROLLMENTS TABLE
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ,
    progress_percent INTEGER NOT NULL DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
    UNIQUE(student_id, course_id)
);

-- 4. LESSONS TABLE
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 1,
    content_markdown TEXT NOT NULL,
    code_example TEXT,
    code_language TEXT DEFAULT 'javascript',
    starter_code TEXT,
    solution_code TEXT,
    video_url TEXT,
    xp_reward INTEGER NOT NULL DEFAULT 20,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(course_id, slug),
    UNIQUE(course_id, order_index)
);

-- 5. LESSON PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    last_code_state TEXT,
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(student_id, lesson_id)
);

-- 6. ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    instructions TEXT NOT NULL,
    starter_code TEXT,
    test_criteria TEXT,
    due_date TIMESTAMPTZ,
    max_points INTEGER NOT NULL DEFAULT 100,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    code_content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'returned')),
    score INTEGER CHECK (score >= 0 AND score <= 100),
    feedback TEXT,
    graded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    submitted_at TIMESTAMPTZ DEFAULT now(),
    graded_at TIMESTAMPTZ,
    UNIQUE(assignment_id, student_id)
);

-- 8. QUIZZES TABLE
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    time_limit_minutes INTEGER,
    passing_score_percent INTEGER NOT NULL DEFAULT 70,
    xp_reward INTEGER NOT NULL DEFAULT 50,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. QUIZ QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL DEFAULT 1,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of string options
    correct_option_index INTEGER NOT NULL DEFAULT 0,
    explanation TEXT,
    UNIQUE(quiz_id, order_index)
);

-- 10. QUIZ ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    score_percent INTEGER NOT NULL,
    passed BOOLEAN NOT NULL DEFAULT false,
    answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    badge_key TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    xp_award INTEGER NOT NULL DEFAULT 50,
    criteria_type TEXT NOT NULL, -- e.g. 'lessons_completed', 'xp_earned', 'streak'
    criteria_threshold INTEGER NOT NULL DEFAULT 1
);

-- 12. STUDENT ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.student_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(student_id, achievement_id)
);

-- 13. AI CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
    title TEXT NOT NULL DEFAULT 'AI Coding Mentorship Session',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 14. AI MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.ai_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant')),
    content TEXT NOT NULL,
    code_context TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON public.courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON public.enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON public.enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_course ON public.lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_student ON public.lesson_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON public.submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON public.submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student ON public.quiz_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_convo ON public.ai_messages(conversation_id);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;

-- Helper functions for role checks
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('teacher', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS POLICIES: PROFILES
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- RLS POLICIES: COURSES
CREATE POLICY "Published courses are viewable by everyone" 
ON public.courses FOR SELECT USING (is_published = true OR instructor_id = auth.uid() OR public.is_admin());

CREATE POLICY "Teachers can insert courses" 
ON public.courses FOR INSERT WITH CHECK (public.is_teacher() AND instructor_id = auth.uid());

CREATE POLICY "Teachers can update their own courses" 
ON public.courses FOR UPDATE USING (instructor_id = auth.uid() OR public.is_admin());

-- RLS POLICIES: ENROLLMENTS
CREATE POLICY "Students can view their own enrollments" 
ON public.enrollments FOR SELECT USING (student_id = auth.uid() OR public.is_teacher());

CREATE POLICY "Students can create enrollments" 
ON public.enrollments FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update their enrollment progress" 
ON public.enrollments FOR UPDATE USING (student_id = auth.uid());

-- RLS POLICIES: LESSONS
CREATE POLICY "Lessons are viewable by everyone" 
ON public.lessons FOR SELECT USING (true);

CREATE POLICY "Course creators and admins can manage lessons" 
ON public.lessons FOR ALL USING (
    EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND instructor_id = auth.uid()) OR public.is_admin()
);

-- RLS POLICIES: LESSON PROGRESS
CREATE POLICY "Students can view and manage their own progress" 
ON public.lesson_progress FOR ALL USING (student_id = auth.uid());

-- RLS POLICIES: ASSIGNMENTS
CREATE POLICY "Assignments are viewable by enrolled or authenticated users" 
ON public.assignments FOR SELECT USING (true);

CREATE POLICY "Course instructors and admins can manage assignments" 
ON public.assignments FOR ALL USING (
    EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND instructor_id = auth.uid()) OR public.is_admin()
);

-- RLS POLICIES: SUBMISSIONS
CREATE POLICY "Students view their own submissions, instructors view course submissions" 
ON public.submissions FOR SELECT USING (
    student_id = auth.uid() OR 
    EXISTS (
        SELECT 1 FROM public.assignments a 
        JOIN public.courses c ON a.course_id = c.id 
        WHERE a.id = submissions.assignment_id AND c.instructor_id = auth.uid()
    ) OR public.is_admin()
);

CREATE POLICY "Students can insert their own submission" 
ON public.submissions FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Instructors can grade submissions" 
ON public.submissions FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.assignments a 
        JOIN public.courses c ON a.course_id = c.id 
        WHERE a.id = submissions.assignment_id AND c.instructor_id = auth.uid()
    ) OR public.is_admin()
);

-- RLS POLICIES: QUIZZES & QUESTIONS
CREATE POLICY "Quizzes viewable by all" ON public.quizzes FOR SELECT USING (true);
CREATE POLICY "Quiz questions viewable by all" ON public.quiz_questions FOR SELECT USING (true);
CREATE POLICY "Quiz attempts private to student and instructor" 
ON public.quiz_attempts FOR ALL USING (student_id = auth.uid() OR public.is_teacher());

-- RLS POLICIES: ACHIEVEMENTS
CREATE POLICY "Achievements viewable by all" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Student achievements viewable by all" ON public.student_achievements FOR SELECT USING (true);

-- RLS POLICIES: AI MENTOR
CREATE POLICY "AI conversations private to user" ON public.ai_conversations FOR ALL USING (student_id = auth.uid());
CREATE POLICY "AI messages private to conversation owner" 
ON public.ai_messages FOR ALL USING (
    EXISTS (SELECT 1 FROM public.ai_conversations WHERE id = conversation_id AND student_id = auth.uid())
);
