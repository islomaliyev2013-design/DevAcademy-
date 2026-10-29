import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { QuizRunner } from '../../features/quizzes/QuizRunner';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { HelpCircle, Clock, Sparkles, CheckCircle2, Play } from 'lucide-react';

export function QuizzesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const qzs = await dataService.getQuizzes();
        setQuizzes(qzs);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Knowledge Checkup Quizzes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Test your programming retention with timed, auto-graded multiple-choice assessments.
          </p>
        </div>

        {activeQuiz && (
          <Button variant="outline" size="sm" onClick={() => setActiveQuiz(null)}>
            Close Active Quiz
          </Button>
        )}
      </div>

      {activeQuiz ? (
        <div className="max-w-3xl mx-auto">
          <QuizRunner quiz={activeQuiz} />
        </div>
      ) : loading ? (
        <div className="p-12 text-center text-slate-400">Loading quizzes...</div>
      ) : quizzes.length === 0 ? (
        <Card className="p-12 text-center text-slate-500">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p>No quizzes currently available.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="violet" size="sm">
                    {quiz.questions?.length || 4} Questions
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-brand-600 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>+{quiz.xp_reward || 50} XP</span>
                  </div>
                </div>

                <h3 className="font-bold text-base text-slate-900">{quiz.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{quiz.description}</p>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{quiz.time_limit_minutes || 10} min limit</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{quiz.passing_score_percent}% to pass</span>
                  </span>
                </div>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={() => setActiveQuiz(quiz)}
                icon={Play}
                className="w-full font-bold"
              >
                Start Quiz
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
