import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../features/auth/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { BookOpen, PlayCircle, Clock, CheckCircle2 } from 'lucide-react';

export function MyCoursesPage() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      try {
        const enrs = await dataService.getEnrollments(user.id);
        setEnrollments(enrs);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Enrolled Courses
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your ongoing curriculum and pick up right where you left off.
          </p>
        </div>
        <Link to="/courses">
          <Button variant="outline" size="sm" icon={BookOpen}>
            Browse More Courses
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading your courses...</div>
      ) : enrollments.length === 0 ? (
        <Card className="p-12 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No active enrollments yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Choose a course from the catalog to jump into in-browser coding exercises!
          </p>
          <Link to="/courses" className="inline-block">
            <Button variant="primary" size="md">
              Explore Course Catalog
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enr) => {
            const course = enr.courses || {};
            const isCompleted = enr.progress_percent === 100;

            return (
              <Card key={enr.id} className="overflow-hidden flex flex-col justify-between">
                <div>
                  <img
                    src={course.thumbnail_url || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800'}
                    alt={course.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="violet" size="sm">
                        {course.level || 'Beginner'}
                      </Badge>
                      {isCompleted ? (
                        <Badge variant="emerald" size="sm" className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </Badge>
                      ) : (
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{course.duration_hours || 10}h</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Progress */}
                    <div className="space-y-1 pt-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-600">Completion</span>
                        <span className="text-brand-700">{enr.progress_percent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            isCompleted ? 'bg-emerald-500' : 'bg-brand-600'
                          }`}
                          style={{ width: `${enr.progress_percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to={`/student/lessons/lesson-react-1`}
                    className="block w-full"
                  >
                    <Button
                      variant={isCompleted ? 'outline' : 'primary'}
                      size="sm"
                      className="w-full font-bold"
                      icon={PlayCircle}
                    >
                      {isCompleted ? 'Review Lessons' : 'Continue Lesson'}
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
