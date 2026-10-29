import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../features/auth/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import Editor from '@monaco-editor/react';
import {
  FileCheck,
  Clock,
  Award,
  CheckCircle2,
  Send,
  AlertCircle,
  FileCode,
} from 'lucide-react';

export function AssignmentsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active submission modal state
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [codeContent, setCodeContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      if (!user) return;
      setLoading(true);
      try {
        const [assigns, subs] = await Promise.all([
          dataService.getAssignments(),
          dataService.getSubmissions(),
        ]);
        setAssignments(assigns);
        setSubmissions(subs.filter((s) => s.student_id === user.id));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const handleOpenSubmitModal = (assign) => {
    const existingSub = submissions.find((s) => s.assignment_id === assign.id);
    setActiveAssignment(assign);
    setCodeContent(existingSub ? existingSub.code_content : assign.starter_code || '// Write your solution here\n');
  };

  const handleSubmitCode = async () => {
    if (!activeAssignment || !user) return;
    setIsSubmitting(true);
    try {
      const sub = await dataService.submitAssignment(
        activeAssignment.id,
        user.id,
        user.email?.split('@')[0] || 'Student',
        codeContent
      );
      setSubmissions((prev) => {
        const filtered = prev.filter((s) => s.assignment_id !== activeAssignment.id);
        return [...filtered, sub];
      });
      addToast('Assignment submitted successfully for instructor review!', 'success');
      setActiveAssignment(null);
    } catch (err) {
      addToast(err.message || 'Submission failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Coding Assignments
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Complete practical coding challenges and receive constructive reviews and grading from instructors.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading assignments...</div>
      ) : assignments.length === 0 ? (
        <Card className="p-12 text-center text-slate-500">
          <FileCheck className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p>No assignments posted yet.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {assignments.map((assign) => {
            const sub = submissions.find((s) => s.assignment_id === assign.id);
            const isGraded = sub?.status === 'graded';
            const isSubmitted = Boolean(sub);

            return (
              <Card key={assign.id} className="p-6 space-y-4 border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200/60">
                        {assign.courses?.title || 'Course Challenge'}
                      </span>
                      {isGraded ? (
                        <Badge variant="emerald" size="sm" className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Graded: {sub.score} / {assign.max_points}
                        </Badge>
                      ) : isSubmitted ? (
                        <Badge variant="amber" size="sm" className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Under Review
                        </Badge>
                      ) : (
                        <Badge variant="slate" size="sm">
                          Pending Submission
                        </Badge>
                      )}
                    </div>

                    <h3 className="font-bold text-base text-slate-900">{assign.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{assign.description}</p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-bold text-brand-700 block">
                        Max: {assign.max_points} pts
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Due: {new Date(assign.due_date || Date.now()).toLocaleDateString()}
                      </span>
                    </div>

                    <Button
                      variant={isSubmitted ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => handleOpenSubmitModal(assign)}
                      icon={isSubmitted ? FileCode : Send}
                    >
                      {isSubmitted ? 'Update Submission' : 'Submit Solution'}
                    </Button>
                  </div>
                </div>

                {/* Instructions breakdown */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1.5">
                  <span className="font-bold text-slate-900 block">Instructions:</span>
                  <p className="whitespace-pre-wrap font-sans">{assign.instructions}</p>
                  {assign.test_criteria && (
                    <p className="text-slate-500 italic pt-1 border-t border-slate-200">
                      Criteria: {assign.test_criteria}
                    </p>
                  )}
                </div>

                {/* Instructor feedback pill if graded */}
                {isGraded && sub.feedback && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Instructor Feedback & Score ({sub.score}/{assign.max_points})</span>
                    </div>
                    <p className="text-emerald-800 italic">"{sub.feedback}"</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Code Submission Modal */}
      <Modal
        isOpen={Boolean(activeAssignment)}
        onClose={() => setActiveAssignment(null)}
        title={activeAssignment ? `Submit: ${activeAssignment.title}` : 'Submit Code'}
        maxWidth="max-w-3xl"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Write or paste your solution code below. Your instructor will review your architecture, syntax, and execution.
          </p>

          <div className="h-72 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shadow-inner">
            <Editor
              height="100%"
              language="javascript"
              value={codeContent}
              onChange={(val) => setCodeContent(val || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: '"JetBrains Mono", monospace',
              }}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setActiveAssignment(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmitCode}
              isLoading={isSubmitting}
              icon={Send}
            >
              Submit Solution
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
