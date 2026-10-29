import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseSchema } from '../../lib/validators';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../features/auth/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { Plus, BookOpen, Clock, Users, Edit3, Trash2 } from 'lucide-react';

export function TeacherCoursesPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      level: 'Beginner',
      category: 'Web Development',
      language: 'javascript',
      durationHours: 12,
      thumbnailUrl: 'https://images.unsplash.com/photo-1516116211227-bbc13c726cb7?w=800',
    },
  });

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

  const onSubmit = async (values) => {
    try {
      const created = await dataService.createCourse(
        {
          title: values.title,
          description: values.description,
          level: values.level,
          category: values.category,
          language: values.language,
          duration_hours: values.durationHours,
          thumbnail_url: values.thumbnailUrl,
        },
        user?.id || 'teacher-1'
      );
      setCourses((prev) => [created, ...prev]);
      addToast(`Course "${values.title}" created successfully!`, 'success');
      reset();
      setIsModalOpen(false);
    } catch (err) {
      addToast(err.message || 'Failed to create course', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage Courses
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create, publish, and structure your curriculum, lessons, and prerequisites.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} icon={Plus}>
          Create Course
        </Button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading courses...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden flex flex-col justify-between">
              <div>
                <img
                  src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516116211227-bbc13c726cb7?w=800'}
                  alt={course.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="violet" size="sm">
                      {course.level}
                    </Badge>
                    <span className="text-[11px] text-slate-400 font-mono uppercase">
                      {course.language}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{course.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{course.description}</p>

                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{course.duration_hours || 10}h</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>{course.enrolled_count || 120} enrolled</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Published
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    Edit Content
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Course Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Programming Course"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Course Title"
            placeholder="e.g. Modern TypeScript & Full-Stack Node"
            error={errors.title?.message}
            {...register('title')}
          />

          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
              Short Description
            </label>
            <textarea
              rows="3"
              placeholder="What will students learn in this course?"
              className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-brand-500"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-xs text-rose-600 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                Difficulty Level
              </label>
              <select
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-brand-500"
                {...register('level')}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                Estimated Hours
              </label>
              <input
                type="number"
                min="1"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                {...register('durationHours')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Category"
              placeholder="e.g. Web Development"
              error={errors.category?.message}
              {...register('category')}
            />
            <Input
              label="Primary Language"
              placeholder="e.g. javascript"
              error={errors.language?.message}
              {...register('language')}
            />
          </div>

          <Input
            label="Thumbnail Image URL"
            placeholder="https://..."
            error={errors.thumbnailUrl?.message}
            {...register('thumbnailUrl')}
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
              Publish Course
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
