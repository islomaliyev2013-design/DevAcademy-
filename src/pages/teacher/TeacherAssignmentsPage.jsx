import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assignmentSchema } from '../../lib/validators';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../features/auth/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { Plus, FileCheck, Clock, Award, Users } from 'lucide-react';

export function TeacherAssignmentsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: '',
      description: '',
      instructions: '',
      starterCode: '',
      testCriteria: '',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      maxPoints: 100,
    },
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [cs, as] = await Promise.all([
          dataService.getCourses(),
          dataService.getAssignments(),
        ]);
        setCourses(cs);
        setAssignments(as);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const onSubmit = async (values) => {
    try {
      const newAssign = await dataService.createAssignment(
        {
          course_id: courses[0]?.id || 'course-react-arch',
          title: values.title,
          description: values.description,
          instructions: values.instructions,
          starter_code: values.starterCode,
          test_criteria: values.testCriteria,
          due_date: new Date(values.dueDate).toISOString(),
          max_points: values.maxPoints,
        },
        user?.id || 'teacher-1'
      );
      setAssignments((prev) => [newAssign, ...prev]);
      addToast(`Assignment "${values.title}" created successfully!`, 'success');
      reset();
      setIsModalOpen(false);
    } catch (err) {
      addToast(err.message || 'Failed to create assignment', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Assignments Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish coding tasks, establish grading criteria, and review submissions.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} icon={Plus}>
          New Assignment
        </Button>
      </div>

      <div className="space-y-4">
        {assignments.map((assign) => (
          <Card key={assign.id} className="p-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <Badge variant="violet" size="sm">
                  {assign.courses?.title || 'Course Challenge'}
                </Badge>
                <h3 className="font-bold text-base text-slate-900">{assign.title}</h3>
                <p className="text-xs text-slate-600 max-w-xl">{assign.description}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-brand-700 block">
                  {assign.max_points} Max Points
                </span>
                <span className="text-[11px] text-slate-400">
                  Due: {new Date(assign.due_date || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Test criteria: {assign.test_criteria || 'Functional verification'}</span>
              <span className="font-semibold text-brand-600">Active</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Assignment"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Assignment Title"
            placeholder="e.g. Build an Asynchronous Data Fetching Hook"
            error={errors.title?.message}
            {...register('title')}
          />

          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
              Short Description
            </label>
            <textarea
              rows="2"
              placeholder="Overview of the assignment goals..."
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-500"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-xs text-rose-600 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
              Step-by-Step Instructions
            </label>
            <textarea
              rows="3"
              placeholder="1. Build hook...\n2. Manage loading states..."
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-500"
              {...register('instructions')}
            />
            {errors.instructions && (
              <p className="text-xs text-rose-600 mt-1">{errors.instructions.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Grading Criteria"
              placeholder="e.g. Pure functions, no mutations"
              error={errors.testCriteria?.message}
              {...register('testCriteria')}
            />
            <Input
              label="Due Date"
              type="date"
              error={errors.dueDate?.message}
              {...register('dueDate')}
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
              Create Assignment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
