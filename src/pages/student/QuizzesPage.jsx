import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { QuizRunner } from '../../features/quizzes/QuizRunner';
import { useLanguage } from '../../lib/i18n/LanguageContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { HelpCircle, Clock, Sparkles, CheckCircle2, Play } from 'lucide-react';

export function QuizzesPage() {
  const { t, localize } = useLanguage();
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
            {t('quizzes.title', 'Savol-javoblar va testlar')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('quizzes.subtitle', 'Bilimlaringizni sinash uchun vaqt chegaralangan va avtomatik baholanadigan testlar.')}
          </p>
        </div>

        {activeQuiz && (
          <Button variant="outline" size="sm" onClick={() => setActiveQuiz(null)}>
            {t('quizzes.closeQuiz', 'Savol-javobni yopish')}
          </Button>
        )}
      </div>

      {activeQuiz ? (
        <div className="max-w-3xl mx-auto">
          <QuizRunner quiz={activeQuiz} />
        </div>
      ) : loading ? (
        <div className="p-12 text-center text-slate-400">{t('common.loading', 'Yuklanmoqda...')}</div>
      ) : quizzes.length === 0 ? (
        <Card className="p-12 text-center text-slate-500">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p>{t('quizzes.noQuizzes', 'Hozirda savol-javoblar mavjud emas.')}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="violet" size="sm">
                    {quiz.questions?.length || 4} {t('quizzes.questionsCount', 'ta savol')}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-brand-600 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>+{quiz.xp_reward || 50} {t('common.xp', 'XP')}</span>
                  </div>
                </div>

                <h3 className="font-bold text-base text-slate-900">{localize(quiz.title)}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{localize(quiz.description)}</p>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{quiz.time_limit_minutes || 10} {t('quizzes.timeLimit', 'daqiqa')}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{quiz.passing_score_percent}% {t('quizzes.passScore', "o'tish bali")}</span>
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
                {t('quizzes.startQuiz', 'Savol-javobni boshlash')}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
