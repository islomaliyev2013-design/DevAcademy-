import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../features/auth/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { Award, CheckCircle2, Clock, FileCode, Check } from 'lucide-react';

export function TeacherSubmissionsPage() {
  const { profile } = useAuth();
  const { addToast } = useToast();
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'submitted' | 'graded'
  const [activeSub, setActiveSub] = useState(null);
  const [score, setScore] = useState(90);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const subs = await dataService.getSubmissions();
        setSubmissions(subs);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleOpenReview = (sub) => {
    setActiveSub(sub);
    setScore(sub.score || 95);
    setFeedback(sub.feedback || 'Well-structured solution with solid architectural patterns.');
  };

  const handleSave = async () => {
    if (!activeSub) return;
    try {
      await dataService.gradeSubmission(
        activeSub.id,
        parseInt(score, 10),
        feedback,
        profile?.id || 'teacher-1'
      );
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === activeSub.id
            ? { ...s, score: parseInt(score, 10), feedback, status: 'graded' }
            : s
        )
      );
      addToast('Grade and review feedback saved!', 'success');
      setActiveSub(null);
    } catch (err) {
      addToast(err.message || 'Error saving grade', 'error');
    }
  };

  const filtered = submissions.filter((s) => {
    if (filter === 'submitted') return s.status === 'submitted';
    if (filter === 'graded') return s.status === 'graded';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Student Submissions Review
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Examine student solutions line-by-line, award grades, and leave feedback.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'all' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({submissions.length})
          </button>
          <button
            onClick={() => setFilter('submitted')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'submitted'
                ? 'bg-brand-600 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending Review ({submissions.filter((s) => s.status === 'submitted').length})
          </button>
          <button
            onClick={() => setFilter('graded')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'graded'
                ? 'bg-brand-600 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Graded ({submissions.filter((s) => s.status === 'graded').length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((sub) => (
          <Card key={sub.id} className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-sm">
                    {sub.student_name || 'Alex Rivera'}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500">
                    {sub.assignments?.title || 'Interactive Task Manager'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Submitted on {new Date(sub.submitted_at || Date.now()).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {sub.status === 'graded' ? (
                  <div className="text-right">
                    <Badge variant="emerald" size="sm">
                      Score: {sub.score} / 100
                    </Badge>
                  </div>
                ) : (
                  <Badge variant="amber" size="sm">
                    Awaiting Review
                  </Badge>
                )}

                <Button variant="primary" size="sm" onClick={() => handleOpenReview(sub)}>
                  {sub.status === 'graded' ? 'Update Review' : 'Grade Submission'}
                </Button>
              </div>
            </div>

            {/* Code preview snippet */}
            <pre className="p-3.5 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto max-h-36 shadow-inner">
              <code>{sub.code_content}</code>
            </pre>

            {sub.feedback && (
              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
                <strong className="text-slate-900">Current Feedback:</strong> "{sub.feedback}"
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={Boolean(activeSub)}
        onClose={() => setActiveSub(null)}
        title={activeSub ? `Review: ${activeSub.student_name || 'Student'}` : 'Review'}
        maxWidth="max-w-2xl"
      >
        {activeSub && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Student Submitted Code:
              </span>
              <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto max-h-56">
                <code>{activeSub.code_content}</code>
              </pre>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block">Score (0 - 100):</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="w-28 mt-1 p-2 border rounded-xl font-bold font-mono text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block">Feedback:</label>
                <textarea
                  rows="3"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full mt-1 p-3 border rounded-xl text-xs focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t">
              <Button variant="ghost" size="sm" onClick={() => setActiveSub(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSave}>
                Save Grade
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
