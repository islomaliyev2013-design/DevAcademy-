import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../features/auth/AuthContext';
import { CodePlayground } from '../../features/playground/CodePlayground';
import { AIMentorWidget } from '../../features/ai-mentor/AIMentorWidget';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { useToast } from '../../components/ui/Toast';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileCode,
  Sparkles,
  BookOpen,
  Terminal,
  Layers,
  HelpCircle,
  FileCheck,
} from 'lucide-react';

export function LessonPlayerPage() {
  const { lessonId } = useParams();
  const { user, awardXP } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [courseLessons, setCourseLessons] = useState([]);
  const [progressList, setProgressList] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [activeTab, setActiveTab] = useState('lesson'); // 'lesson' | 'playground' | 'mentor'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const current = await dataService.getLessonById(lessonId || 'lesson-react-1');
        if (current) {
          setLesson(current);
          const [allLessons, prog] = await Promise.all([
            dataService.getLessonsByCourseId(current.course_id),
            user ? dataService.getLessonProgress(user.id, current.course_id) : Promise.resolve([]),
          ]);
          setCourseLessons(allLessons);
          setProgressList(prog);
          const isDone = prog.some((p) => p.lesson_id === current.id && p.completed);
          setIsCompleted(isDone);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [lessonId, user]);

  const handleMarkComplete = async () => {
    if (!lesson || !user) return;
    setIsCompleting(true);
    try {
      await dataService.markLessonComplete(
        user.id,
        lesson.id,
        lesson.course_id,
        lesson.xp_reward || 25
      );
      await awardXP(lesson.xp_reward || 25);
      setIsCompleted(true);

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
      });
      addToast(`Lesson marked complete! +${lesson.xp_reward || 25} XP awarded.`, 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update progress', 'error');
    } finally {
      setIsCompleting(false);
    }
  };

  if (loading) {
    return <div className="p-16 text-center text-slate-500">Loading lesson content...</div>;
  }

  if (!lesson) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 max-w-md mx-auto">
        <h3 className="font-bold text-slate-900">Lesson Not Found</h3>
        <Link to="/courses" className="inline-block mt-4">
          <Button variant="primary" size="sm">
            Browse Courses
          </Button>
        </Link>
      </div>
    );
  }

  // Navigation indexes
  const currentIndex = courseLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : null;

  return (
    <div className="space-y-6">
      {/* Top Header Navigation */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              to={`/courses/${lesson.course_id}`}
              className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" /> Back to Syllabus
            </Link>
            <span className="text-slate-300">•</span>
            <Badge variant="violet" size="sm">
              Lesson {lesson.order_index} of {courseLessons.length}
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {lesson.title}
          </h1>
        </div>

        {/* Complete button & Next controls */}
        <div className="flex items-center gap-2.5">
          <Button
            variant={isCompleted ? 'secondary' : 'primary'}
            size="sm"
            onClick={handleMarkComplete}
            isLoading={isCompleting}
            icon={CheckCircle2}
            className={isCompleted ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
          >
            {isCompleted ? 'Completed' : `Complete (+${lesson.xp_reward || 20} XP)`}
          </Button>

          {prevLesson && (
            <Link to={`/student/lessons/${prevLesson.id}`}>
              <Button variant="outline" size="sm" icon={ArrowLeft}>
                Prev
              </Button>
            </Link>
          )}

          {nextLesson && (
            <Link to={`/student/lessons/${nextLesson.id}`}>
              <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
                Next
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 bg-slate-200/60 p-1.5 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveTab('lesson')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition ${
            activeTab === 'lesson'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Lesson Notes</span>
        </button>

        <button
          onClick={() => setActiveTab('playground')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition ${
            activeTab === 'playground'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-brand-600" />
          <span>Interactive Playground</span>
        </button>

        <button
          onClick={() => setActiveTab('mentor')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition ${
            activeTab === 'mentor'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-violet-600" />
          <span>AI Mentor</span>
        </button>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'lesson' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Markdown Content & Examples */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="p-6 sm:p-8 space-y-6">
              {/* Content Markdown */}
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm whitespace-pre-wrap font-sans">
                {lesson.content_markdown}
              </div>

              {/* Code Example block */}
              {lesson.code_example && (
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Code Architecture Example
                    </span>
                    <Badge variant="navy" size="sm" className="font-mono text-[10px]">
                      {lesson.code_language || 'javascript'}
                    </Badge>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto shadow-inner leading-relaxed">
                    <code>{lesson.code_example}</code>
                  </pre>
                </div>
              )}
            </Card>

            {/* Quick Actions to practice */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-50 to-lavender-100 border border-brand-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Ready to code this yourself?</h4>
                <p className="text-xs text-slate-600">
                  Open the in-browser coding playground preloaded with starter code for this lesson.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setActiveTab('playground')}
                icon={Terminal}
              >
                Launch Playground
              </Button>
            </div>
          </div>

          {/* Sidebar Syllabus status */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Track Lessons
              </h4>
              <div className="space-y-1.5">
                {courseLessons.map((l, i) => {
                  const done = progressList.some((p) => p.lesson_id === l.id && p.completed);
                  const isCurrent = l.id === lesson.id;

                  return (
                    <Link
                      key={l.id}
                      to={`/student/lessons/${l.id}`}
                      className={`block p-2.5 rounded-xl text-xs transition ${
                        isCurrent
                          ? 'bg-brand-600 text-white font-bold'
                          : done
                          ? 'bg-emerald-50 text-emerald-800 font-medium hover:bg-emerald-100'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate">
                          {i + 1}. {l.title}
                        </span>
                        {done && (
                          <CheckCircle2
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isCurrent ? 'text-white' : 'text-emerald-600'
                            }`}
                          />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'playground' && (
        <div className="space-y-4">
          <CodePlayground
            initialHtml={lesson.starter_code || ''}
            assignmentTitle={lesson.title}
          />
        </div>
      )}

      {activeTab === 'mentor' && (
        <div className="h-[600px] max-w-3xl mx-auto">
          <AIMentorWidget
            lessonContext={`Current Lesson: ${lesson.title}\nContent:\n${lesson.content_markdown}`}
            codeContext={lesson.code_example || lesson.starter_code || ''}
          />
        </div>
      )}
    </div>
  );
}
