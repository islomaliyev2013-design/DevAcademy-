import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../features/auth/AuthContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { useToast } from '../../components/ui/Toast';
import {
  Clock,
  Star,
  Users,
  CheckCircle2,
  PlayCircle,
  FileCode,
  ArrowRight,
  BookOpen,
  Sparkles,
  Lock,
} from 'lucide-react';

export function CourseDetailPage() {
  const { courseId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    async function loadCourse() {
      setLoading(true);
      try {
        const c = await dataService.getCourseByIdOrSlug(courseId);
        if (c) {
          setCourse(c);
          const [ls, enrs] = await Promise.all([
            dataService.getLessonsByCourseId(c.id),
            user ? dataService.getEnrollments(user.id) : Promise.resolve([]),
          ]);
          setLessons(ls);
          const matchEnr = enrs.find((e) => e.course_id === c.id);
          setEnrollment(matchEnr || null);
        }
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [courseId, user]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsEnrolling(true);
    try {
      const newEnr = await dataService.enrollInCourse(user.id, course.id);
      setEnrollment(newEnr);
      addToast(`Enrolled in ${course.title}! Start learning now.`, 'success');
    } catch (err) {
      addToast(err.message || 'Enrollment failed', 'error');
    } finally {
      setIsEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
        Loading course curriculum...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-white rounded-2xl border border-slate-200">
        <h3 className="font-bold text-slate-900 text-lg">Course Not Found</h3>
        <p className="text-xs text-slate-500 mt-2">The requested course could not be located.</p>
        <Link to="/courses" className="inline-block mt-4">
          <Button variant="primary" size="sm">
            Back to Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const isEnrolled = Boolean(enrollment);
  const firstLessonId = lessons[0]?.id;

  return (
    <div className="space-y-12 pb-16">
      {/* Course Hero Banner */}
      <section className="bg-gradient-to-r from-navy-950 via-brand-950 to-navy-950 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-brand-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="violet" size="sm" className="bg-brand-500/20 text-brand-300 border-brand-500/30">
                {course.level}
              </Badge>
              <Badge variant="navy" size="sm" className="bg-slate-800 text-slate-300 border-slate-700">
                {course.category}
              </Badge>
              <span className="text-xs text-slate-400 font-mono uppercase">
                Tech: {course.language}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              {course.long_description || course.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{course.rating || '4.9'} rating</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-400" />
                <span>{course.enrolled_count || 320} students enrolled</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{course.duration_hours || 10} hours total</span>
              </span>
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200/80 space-y-5">
            <img
              src={course.thumbnail_url || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800'}
              alt={course.title}
              className="w-full h-44 object-cover rounded-xl border border-slate-100 shadow-sm"
            />

            {isEnrolled ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600">Your Progress</span>
                    <span className="text-brand-700">{enrollment.progress_percent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-600 h-2 rounded-full transition-all"
                      style={{ width: `${enrollment.progress_percent}%` }}
                    />
                  </div>
                </div>

                <Link
                  to={`/student/lessons/${firstLessonId || 'lesson-react-1'}`}
                  className="block w-full"
                >
                  <Button variant="primary" size="md" className="w-full font-bold" icon={PlayCircle}>
                    Continue Learning
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleEnroll}
                  isLoading={isEnrolling}
                  className="w-full font-bold shadow-lg shadow-brand-500/20"
                >
                  Enroll in Course
                </Button>
                <p className="text-[11px] text-center text-slate-400">
                  Instant full access with interactive code playground & AI mentor
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Body: Objectives, Prerequisites, Syllabus */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Learning Objectives */}
          {course.learning_objectives && course.learning_objectives.length > 0 && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-900 text-lg">What You Will Master</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {course.learning_objectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Curriculum Syllabus */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-lg">Course Curriculum</h3>
              <span className="text-xs font-semibold text-slate-500">
                {lessons.length} interactive lessons
              </span>
            </div>

            <div className="space-y-2.5">
              {lessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  className="p-4 rounded-xl border border-slate-100 hover:border-brand-200 bg-slate-50/50 hover:bg-white transition flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs sm:text-sm">
                        {lesson.title}
                      </h4>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <FileCode className="w-3 h-3" />
                          <span>Code exercise</span>
                        </span>
                        <span className="flex items-center gap-1 text-brand-600 font-medium">
                          <Sparkles className="w-3 h-3" />
                          <span>+{lesson.xp_reward || 20} XP</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {isEnrolled ? (
                    <Link to={`/student/lessons/${lesson.id}`}>
                      <Button variant="outline" size="sm" className="text-xs">
                        Start Lesson
                      </Button>
                    </Link>
                  ) : (
                    <Lock className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info: Instructor & Prerequisites */}
        <div className="space-y-6">
          {/* Instructor Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Instructor Profile
            </h4>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150"
                alt="Sarah Jenkins"
                className="w-12 h-12 rounded-full object-cover border-2 border-brand-400"
              />
              <div>
                <p className="font-bold text-slate-900 text-sm">
                  {course.instructor_name || 'Dr. Sarah Jenkins'}
                </p>
                <p className="text-xs text-brand-600 font-medium">Senior Software Architect</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Veteran software architect with over a decade of production experience building distributed frontend systems and mentoring thousands of developers.
            </p>
          </div>

          {/* Prerequisites */}
          {course.prerequisites && course.prerequisites.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Prerequisites
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                {course.prerequisites.map((req, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
