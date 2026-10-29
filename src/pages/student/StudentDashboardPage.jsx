import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { dataService } from '../../services/dataService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LearningActivityChart } from '../../features/progress/LearningActivityChart';
import { CourseCard } from '../../features/courses/CourseCard';
import {
  Sparkles,
  BookOpen,
  Award,
  Terminal,
  Clock,
  ArrowRight,
  Flame,
  CheckCircle2,
  FileCheck,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

export function StudentDashboardPage() {
  const { profile, user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      if (!user) return;
      try {
        const [enrs, assigns, qzs, allCourses] = await Promise.all([
          dataService.getEnrollments(user.id),
          dataService.getAssignments(),
          dataService.getQuizzes(),
          dataService.getCourses(),
        ]);
        setEnrollments(enrs);
        setAssignments(assigns.slice(0, 2));
        setQuizzes(qzs.slice(0, 2));
        setRecommended(allCourses.filter((c) => !enrs.some((e) => e.course_id === c.id)).slice(0, 2));
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [user]);

  const activeEnrollment = enrollments[0];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-navy-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-brand-200 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Level {profile?.level || 1} Developer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'Student'}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-brand-200 max-w-xl">
              You are on a <strong className="text-amber-300 font-bold">{profile?.streak_days || 1}-day learning streak</strong>. Keep coding to reach your next milestone!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/student/playground">
              <Button
                variant="primary"
                size="md"
                className="bg-white text-brand-900 hover:bg-slate-100 font-bold shadow-lg"
                icon={Terminal}
              >
                Open Playground
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">XP Points</p>
            <p className="text-2xl font-extrabold text-slate-900">{profile?.xp || 0}</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Streak</p>
            <p className="text-2xl font-extrabold text-slate-900">{profile?.streak_days || 1} Days</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Enrolled Tracks</p>
            <p className="text-2xl font-extrabold text-slate-900">{enrollments.length}</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Badges Unlocked</p>
            <p className="text-2xl font-extrabold text-slate-900">2 / 5</p>
          </div>
        </Card>
      </div>

      {/* Continue Learning + Activity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Continue Learning Box */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-lg">Continue Learning</h3>
            <Link to="/student/my-courses" className="text-xs font-semibold text-brand-600 hover:underline">
              View All
            </Link>
          </div>

          {activeEnrollment && activeEnrollment.courses ? (
            <Card className="p-5 space-y-4 border-brand-200 shadow-sm bg-gradient-to-b from-white to-lavender-50/40">
              <img
                src={activeEnrollment.courses.thumbnail_url || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800'}
                alt={activeEnrollment.courses.title}
                className="w-full h-36 object-cover rounded-xl"
              />
              <div className="space-y-1">
                <Badge variant="violet" size="sm">
                  {activeEnrollment.courses.level}
                </Badge>
                <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                  {activeEnrollment.courses.title}
                </h4>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600">Course Progress</span>
                  <span className="text-brand-700">{activeEnrollment.progress_percent}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-600 h-2 rounded-full transition-all"
                    style={{ width: `${activeEnrollment.progress_percent}%` }}
                  />
                </div>
              </div>

              <Link
                to={`/student/lessons/lesson-react-1`}
                className="block pt-1"
              >
                <Button variant="primary" size="sm" className="w-full font-bold">
                  Resume Next Lesson
                </Button>
              </Link>
            </Card>
          ) : (
            <Card className="p-6 text-center space-y-3">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">You haven't enrolled in any courses yet.</p>
              <Link to="/courses">
                <Button variant="primary" size="sm">
                  Explore Courses
                </Button>
              </Link>
            </Card>
          )}
        </div>

        {/* Weekly Activity Chart */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-lg">Learning Activity & XP Trends</h3>
            <span className="text-xs text-slate-500 font-medium">Last 7 Days</span>
          </div>

          <Card className="p-6">
            <LearningActivityChart />
          </Card>
        </div>
      </div>

      {/* Pending Assignments and Quizzes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pending Assignments */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-brand-600" />
              <span>Pending Assignments</span>
            </h3>
            <Link to="/student/assignments" className="text-xs font-semibold text-brand-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {assignments.map((assign) => (
              <Card key={assign.id} className="p-4 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{assign.title}</h4>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span>Due in 5 days</span>
                    <span>•</span>
                    <span className="text-brand-600 font-semibold">{assign.max_points} Points</span>
                  </div>
                </div>
                <Link to="/student/assignments">
                  <Button variant="outline" size="sm" className="text-xs">
                    Submit Code
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* Available Quizzes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-violet-600" />
              <span>Checkup Quizzes</span>
            </h3>
            <Link to="/student/quizzes" className="text-xs font-semibold text-brand-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="p-4 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{quiz.title}</h4>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span>{quiz.questions?.length || 4} Questions</span>
                    <span>•</span>
                    <span className="text-brand-600 font-semibold">+{quiz.xp_reward} XP</span>
                  </div>
                </div>
                <Link to="/student/quizzes">
                  <Button variant="primary" size="sm" className="text-xs">
                    Take Quiz
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Courses */}
      {recommended.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-extrabold text-slate-900 text-lg">Recommended for You</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommended.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
