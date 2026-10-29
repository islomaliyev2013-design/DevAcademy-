import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { BookOpen, Sparkles, CheckCircle2, XCircle, Star } from 'lucide-react';

export function AdminCoursesPage() {
  const { addToast } = useToast();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const cs = await dataService.getCourses();
        setCourses(cs);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleToggleFeature = (id) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, featured: !c.featured } : c))
    );
    addToast('Updated course spotlight status', 'info');
  };

  const handleTogglePublish = (id) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_published: !c.is_published } : c))
    );
    addToast('Updated course moderation status', 'info');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Curriculum Moderation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review, approve, feature, and oversee all courses published on the platform.
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3.5">Course</th>
                <th className="px-6 py-3.5">Instructor</th>
                <th className="px-6 py-3.5">Difficulty</th>
                <th className="px-6 py-3.5">Enrollments</th>
                <th className="px-6 py-3.5">Featured Status</th>
                <th className="px-6 py-3.5">Moderation</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516116211227-bbc13c726cb7?w=800'}
                        alt={course.title}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900 line-clamp-1">{course.title}</p>
                        <p className="text-[11px] text-slate-400">{course.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700 font-medium">
                    {course.instructor_name || 'Dr. Sarah Jenkins'}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="violet" size="sm">
                      {course.level}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-800">
                    {course.enrolled_count || 120}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleFeature(course.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition ${
                        course.featured
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      <Star className={`w-3 h-3 ${course.featured ? 'fill-amber-500 text-amber-500' : ''}`} />
                      <span>{course.featured ? 'Featured' : 'Standard'}</span>
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    {course.is_published ? (
                      <Badge variant="emerald" size="sm">
                        Live on Catalog
                      </Badge>
                    ) : (
                      <Badge variant="slate" size="sm">
                        Draft / Hidden
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant={course.is_published ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => handleTogglePublish(course.id)}
                    >
                      {course.is_published ? 'Unpublish' : 'Approve & Publish'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
