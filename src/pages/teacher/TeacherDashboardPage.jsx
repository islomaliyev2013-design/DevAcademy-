import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { dataService } from '../../services/dataService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import {
  Users,
  BookOpen,
  FileCheck,
  Award,
  Plus,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export function TeacherDashboardPage() {
  const { profile } = useAuth();
  const { addToast } = useToast();
  const [courses, setCourses] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [gradingSub, setGradingSub] = useState(null);
  const [gradeScore, setGradeScore] = useState(90);
  const [gradeFeedback, setGradeFeedback] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [allCourses, allSubs] = await Promise.all([
          dataService.getCourses(),
          dataService.getSubmissions(),
        ]);
        setCourses(allCourses);
        setSubmissions(allSubs);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const pendingSubs = submissions.filter((s) => s.status === 'submitted');
  const gradedSubs = submissions.filter((s) => s.status === 'graded');

  const handleOpenGradeModal = (sub) => {
    setGradingSub(sub);
    setGradeScore(sub.score || 90);
    setGradeFeedback(sub.feedback || 'Great implementation! Clean logic and good variable naming.');
  };

  const handleSaveGrade = async () => {
    if (!gradingSub) return;
    try {
      await dataService.gradeSubmission(
        gradingSub.id,
        parseInt(gradeScore, 10),
        gradeFeedback,
        profile?.id || 'teacher-1'
      );
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === gradingSub.id
            ? { ...s, score: parseInt(gradeScore, 10), feedback: gradeFeedback, status: 'graded' }
            : s
        )
      );
      addToast(`Graded submission with ${gradeScore} points!`, 'success');
      setGradingSub(null);
    } catch (err) {
      addToast(err.message || 'Grading failed', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Teacher Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-brand-950 to-navy-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Badge variant="amber" size="sm" className="bg-amber-500/20 text-amber-300 border-amber-500/30">
            Instructor Portal
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {profile?.full_name || 'Instructor'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Manage your courses, publish coding challenges, review student code submissions, and monitor class performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/teacher/courses">
            <Button variant="primary" size="sm" icon={Plus}>
              Create New Course
            </Button>
          </Link>
          <Link to="/teacher/assignments">
            <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              New Assignment
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Courses Active</p>
            <p className="text-2xl font-extrabold text-slate-900">{courses.length}</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Reviews</p>
            <p className="text-2xl font-extrabold text-amber-600">{pendingSubs.length}</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Graded Submissions</p>
            <p className="text-2xl font-extrabold text-slate-900">{gradedSubs.length}</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-sky-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enrolled</p>
            <p className="text-2xl font-extrabold text-slate-900">840+</p>
          </div>
        </Card>
      </div>

      {/* Submissions to Review Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-brand-600" />
            <span>Recent Student Submissions</span>
          </h3>
          <Link to="/teacher/submissions" className="text-xs font-semibold text-brand-600 hover:underline">
            View All Submissions
          </Link>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Student</th>
                  <th className="px-6 py-3.5">Assignment</th>
                  <th className="px-6 py-3.5">Submitted At</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Score</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {sub.student_name || 'Alex Rivera'}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {sub.assignments?.title || 'Interactive Task Manager'}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(sub.submitted_at || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {sub.status === 'graded' ? (
                        <Badge variant="emerald" size="sm">
                          Graded
                        </Badge>
                      ) : (
                        <Badge variant="amber" size="sm">
                          Pending Review
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold font-mono">
                      {sub.score !== null && sub.score !== undefined ? `${sub.score}/100` : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant={sub.status === 'graded' ? 'outline' : 'primary'}
                        size="sm"
                        onClick={() => handleOpenGradeModal(sub)}
                      >
                        {sub.status === 'graded' ? 'Update Grade' : 'Review & Grade'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Review & Grade Modal */}
      <Modal
        isOpen={Boolean(gradingSub)}
        onClose={() => setGradingSub(null)}
        title={gradingSub ? `Review Code: ${gradingSub.student_name || 'Student'}` : 'Review Submission'}
        maxWidth="max-w-3xl"
      >
        {gradingSub && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Submitted Student Code:
              </span>
              <pre className="p-4 mt-1 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto max-h-56 shadow-inner leading-relaxed">
                <code>{gradingSub.code_content}</code>
              </pre>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block">
                  Assign Score (0 - 100 points):
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={gradeScore}
                  onChange={(e) => setGradeScore(e.target.value)}
                  className="w-32 mt-1 px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block">
                  Constructive Feedback:
                </label>
                <textarea
                  rows="3"
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  placeholder="Provide guidance on clean code, edge cases, and best practices..."
                  className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setGradingSub(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveGrade}>
                Save Grade & Feedback
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
