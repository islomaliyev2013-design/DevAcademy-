import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { CourseCard } from '../../features/courses/CourseCard';
import { dataService } from '../../services/dataService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Code2,
  Sparkles,
  ArrowRight,
  Terminal,
  BookOpen,
  Award,
  Users,
  CheckCircle2,
  ChevronDown,
  Layers,
  Flame,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export function LandingPage() {
  const { isAuthenticated, role } = useAuth();
  const [courses, setCourses] = useState([]);
  const [activeFaq, setActiveFaq] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      const all = await dataService.getCourses();
      setCourses(all.slice(0, 3));
    }
    loadData();
  }, []);

  const handleStartLearning = () => {
    if (!isAuthenticated) {
      navigate('/register');
    } else {
      if (role === 'teacher') navigate('/teacher/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
      else navigate('/student/dashboard');
    }
  };

  const faqs = [
    {
      q: 'Do I need prior coding experience to begin?',
      a: 'Not at all! DevAcademy Pro features structured tracks ranging from absolute beginner fundamentals (HTML, CSS, JavaScript) to advanced React architecture and algorithms.',
    },
    {
      q: 'How does the AI Coding Mentor work?',
      a: 'The AI Mentor observes your active code in the playground, diagnoses runtime bugs, explains abstract programming concepts in plain English, and provides immediate hints without giving away the full answer.',
    },
    {
      q: 'Are quizzes and assignments graded automatically?',
      a: 'Quizzes are graded instantaneously with detailed pedagogical explanations. Assignments allow you to submit browser code directly to your instructor for customized scoring and feedback.',
    },
    {
      q: 'Can instructors create and manage their own curriculum?',
      a: 'Yes! Instructors have access to a dedicated Teacher Dashboard where they can publish courses, write lessons, assign coding challenges, and monitor student progress.',
    },
  ];

  return (
    <div className="space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Glow ambient background circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-6 max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-800 text-xs font-semibold shadow-sm animate-in fade-in slide-in-from-top-3">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>Interactive AI-Powered Software Engineering Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Learn to Code.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-violet-600 to-indigo-600">
              Build Real Projects.
            </span>{' '}
            Grow Faster.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            DevAcademy Pro blends hands-on in-browser coding playgrounds, personalized AI mentorship, comprehensive interactive courses, and industry-grade assignments to accelerate your career.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartLearning}
              icon={ArrowRight}
              iconPosition="right"
              className="w-full sm:w-auto shadow-lg shadow-brand-500/25"
            >
              Start Learning
            </Button>
            <Link to="/courses" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Explore Courses
              </Button>
            </Link>
          </div>

          {/* Quick trust metrics */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> In-Browser Execution
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 24/7 AI Code Guidance
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Real Instructor Reviews
            </span>
          </div>
        </div>

        {/* Live Playground Preview Teaser Card */}
        <div className="mt-14 max-w-5xl mx-auto rounded-2xl p-2 bg-gradient-to-b from-brand-200/50 via-slate-200/40 to-transparent shadow-2xl">
          <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800 text-slate-200 font-mono text-xs shadow-inner">
            <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                <span className="ml-2 text-slate-400 font-sans text-[11px]">devacademy-playground.js</span>
              </div>
              <Badge variant="violet" size="sm">
                Interactive Preview
              </Badge>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/90">
              <div className="space-y-2 text-slate-300">
                <span className="text-slate-500">// Modern React 19 State Hook</span>
                <p>
                  <span className="text-violet-400">const</span> [developerState, setDevState] ={' '}
                  <span className="text-yellow-300">useState</span>({'{'}
                </p>
                <p className="pl-4">
                  skills: [<span className="text-emerald-300">'React'</span>,{' '}
                  <span className="text-emerald-300">'TypeScript'</span>,{' '}
                  <span className="text-emerald-300">'FullStack'</span>],
                </p>
                <p className="pl-4">
                  mentor: <span className="text-emerald-300">'AI Powered'</span>,
                </p>
                <p className="pl-4">
                  readiness: <span className="text-amber-400">100</span>
                </p>
                <p>{'}'});</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                <div className="space-y-1.5 font-sans">
                  <div className="flex items-center gap-1.5 text-brand-300 font-semibold text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Mentor Instant Feedback</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    "Clean reactive state design! You are applying modern immutability patterns. Ready to run your first automated tests?"
                  </p>
                </div>
                <div className="pt-3 flex justify-end">
                  <Link to="/student/playground">
                    <Button variant="primary" size="sm">
                      Open Full Playground
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM METRICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white rounded-2xl p-8 border border-slate-200/80 shadow-card">
          <div className="text-center space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold text-brand-600">12,500+</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Students</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">98.4%</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Course Completion</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold text-brand-600">45,000+</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Code Runs Daily</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">4.9 / 5.0</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Rating</p>
          </div>
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <Badge variant="violet" size="md" className="mb-2">
              Curated Curriculum
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Programming Courses
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Start with fundamentals or dive deep into production-grade full-stack patterns.
            </p>
          </div>
          <Link to="/courses">
            <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
              View All Courses
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* KEY FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="emerald" size="md">
            Built for Modern Engineers
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Everything You Need to Master Software Engineering
          </h2>
          <p className="text-sm text-slate-500">
            Traditional tutorials leave you passive. DevAcademy Pro forces you to build, debug, and understand every single line.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card space-y-4 hover:border-brand-300 transition">
            <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Isolated Browser Sandbox</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Write HTML, modern CSS, and JavaScript with instantaneous live preview and interactive console debugging directly in Monaco editor.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card space-y-4 hover:border-brand-300 transition">
            <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">AI Coding Mentorship</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Get contextual code explanations, bug diagnoses, and performance recommendations from an intelligent tutor that never sleeps.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card space-y-4 hover:border-brand-300 transition">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Gamified Progression</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Earn XP for every lesson, maintain daily learning streaks, unlock achievement badges, and climb the platform leaderboard.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              How DevAcademy Pro Works
            </h2>
            <p className="text-sm text-slate-500">
              Your 4-step roadmap from coding curious to production capable.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-lavender-50 border border-lavender-200 space-y-3">
              <span className="w-8 h-8 rounded-full bg-brand-600 text-white font-extrabold text-xs flex items-center justify-center">
                1
              </span>
              <h4 className="font-bold text-slate-900 text-sm">Select Your Track</h4>
              <p className="text-xs text-slate-600">
                Enroll in beginner, intermediate, or advanced curriculum curated by veteran engineers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-lavender-50 border border-lavender-200 space-y-3">
              <span className="w-8 h-8 rounded-full bg-brand-600 text-white font-extrabold text-xs flex items-center justify-center">
                2
              </span>
              <h4 className="font-bold text-slate-900 text-sm">Hands-On Practice</h4>
              <p className="text-xs text-slate-600">
                Code directly in the browser playground alongside interactive video and lesson guides.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-lavender-50 border border-lavender-200 space-y-3">
              <span className="w-8 h-8 rounded-full bg-brand-600 text-white font-extrabold text-xs flex items-center justify-center">
                3
              </span>
              <h4 className="font-bold text-slate-900 text-sm">AI & Instructor Review</h4>
              <p className="text-xs text-slate-600">
                Submit coding assignments for detailed feedback, passing scores, and error remediation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-lavender-50 border border-lavender-200 space-y-3">
              <span className="w-8 h-8 rounded-full bg-brand-600 text-white font-extrabold text-xs flex items-center justify-center">
                4
              </span>
              <h4 className="font-bold text-slate-900 text-sm">Level Up & Build</h4>
              <p className="text-xs text-slate-600">
                Earn XP points, conquer timed quizzes, and unlock your portfolio of real-world applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STUDENT TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <Badge variant="amber" size="md">
            Student Stories
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Loved by Developers Worldwide
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "The combination of the in-browser Monaco playground and AI mentor helped me finally understand JavaScript closures and async/await without getting stuck for days."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                alt="Alex"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Alex Rivera</p>
                <p className="text-[11px] text-slate-400">Junior Frontend Developer</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "As an instructor, being able to create courses, post starter templates, and directly review student submissions from one clean dashboard has cut grading time in half."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100"
                alt="Sarah"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Dr. Sarah Jenkins</p>
                <p className="text-[11px] text-slate-400">Lead Curriculum Instructor</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "The gamification system with XP, streaks, and badges kept me motivated every single evening. I passed the technical interview for my dream job last week!"
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
                alt="Marcus"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Marcus Chen</p>
                <p className="text-[11px] text-slate-400">Full-Stack Engineer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="slate" size="md">
            Have Questions?
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-brand-600 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-brand-600' : 'text-slate-400'
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-navy-950 rounded-3xl p-8 sm:p-14 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Accelerate Your Software Engineering Journey?
            </h2>
            <p className="text-sm sm:text-base text-brand-200">
              Join thousands of students mastering modern web development, algorithms, and AI tools with DevAcademy Pro today.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartLearning}
                className="bg-white text-brand-900 hover:bg-slate-100 shadow-xl"
              >
                Get Started for Free
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
