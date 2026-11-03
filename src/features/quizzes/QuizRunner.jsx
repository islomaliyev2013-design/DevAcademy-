import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../../lib/i18n/LanguageContext';
import { dataService } from '../../services/dataService';
import { useToast } from '../../components/ui/Toast';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  Award,
  ArrowRight,
  ArrowLeft,
  Clock,
} from 'lucide-react';

export function QuizRunner({ quiz, onComplete }) {
  const { user, awardXP } = useAuth();
  const { addToast } = useToast();
  const { t, localize, language } = useLanguage();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);

  const questions = quiz.questions || [];
  const currentQ = questions[currentIdx];

  const handleSelectOption = (qId, optionIdx) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qId]: optionIdx,
    }));
  };

  const handleSubmitQuiz = async () => {
    // Calculate score
    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct_option_index) {
        correctCount++;
      }
    });

    const scorePercent = Math.round((correctCount / questions.length) * 100);
    const passed = scorePercent >= (quiz.passing_score_percent || 70);

    const result = {
      scorePercent,
      correctCount,
      totalQuestions: questions.length,
      passed,
      xpEarned: passed ? quiz.xp_reward || 50 : 10,
    };

    setScoreResult(result);
    setIsSubmitted(true);

    // Save attempt
    if (user) {
      await dataService.submitQuizAttempt(
        quiz.id,
        user.id,
        selectedAnswers,
        scorePercent,
        passed,
        result.xpEarned
      );
      await awardXP(result.xpEarned);
    }

    if (passed) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      addToast(`Congratulations! You passed and earned ${result.xpEarned} XP!`, 'success');
    } else {
      addToast(`Quiz finished with ${scorePercent}%. Review explanations and try again!`, 'info');
    }

    if (onComplete) onComplete(result);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScoreResult(null);
    setCurrentIdx(0);
  };

  if (!questions || questions.length === 0) {
    return (
      <Card className="p-8 text-center text-slate-500">
        <HelpCircle className="w-8 h-8 mx-auto text-slate-400 mb-2" />
        <p>No questions found in this quiz.</p>
      </Card>
    );
  }

  const getQText = (q) => localize(q.question_text);
  const getQOptions = (q) => {
    if (q.options && typeof q.options === 'object' && !Array.isArray(q.options)) {
      return q.options[language] || q.options.uz || q.options.ru || q.options.en || [];
    }
    return q.options || [];
  };
  const getQExplanation = (q) => localize(q.explanation);

  const currentOptions = getQOptions(currentQ);

  return (
    <div className="space-y-6">
      {/* Top status */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">{localize(quiz.title)}</h3>
          <p className="text-xs text-slate-500">
            {t('quizzes.passingScore', "O'tish bali")}: {quiz.passing_score_percent}% • {t('quizzes.reward', 'Mukofot')}: +{quiz.xp_reward} XP
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="violet" size="md">
            {t('quizzes.question', 'Savol')} {currentIdx + 1} {t('quizzes.of', 'dan')} {questions.length}
          </Badge>
          {quiz.time_limit_minutes && (
            <Badge variant="slate" size="md" className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{quiz.time_limit_minutes} {t('quizzes.timeLimit', 'daqiqa')}</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Results View if submitted */}
      {isSubmitted && scoreResult ? (
        <Card className="p-8 text-center space-y-6 bg-gradient-to-b from-white to-lavender-50">
          <div
            className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center ${
              scoreResult.passed
                ? 'bg-emerald-100 text-emerald-600'
                : 'bg-amber-100 text-amber-600'
            }`}
          >
            {scoreResult.passed ? (
              <CheckCircle2 className="w-8 h-8" />
            ) : (
              <Award className="w-8 h-8" />
            )}
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">
              {scoreResult.passed
                ? t('quizzes.quizPassed', "Tabriklaymiz! Testdan muvaffaqiyatli o'tdingiz!")
                : t('quizzes.keepPracticing', 'Yana mashq qiling!')}
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              {t('quizzes.scored', "Siz to'plagan ball")}: <strong className="text-slate-900 font-bold">{scoreResult.scorePercent}%</strong> ({scoreResult.correctCount} / {scoreResult.totalQuestions}). {t('quizzes.earned', 'Sizga berildi')}{' '}
              <strong className="text-brand-600 font-bold">+{scoreResult.xpEarned} XP</strong>!
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Button variant="outline" size="md" onClick={handleRetake} icon={RotateCcw}>
              {t('quizzes.retakeQuiz', 'Qayta topshirish')}
            </Button>
          </div>

          {/* Answer explanations list */}
          <div className="mt-8 text-left space-y-4 pt-6 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('quizzes.reviewExplanations', 'Savollar tahlili va tushuntirishlar:')}
            </h4>
            {questions.map((q, idx) => {
              const userAns = selectedAnswers[q.id];
              const isCorrect = userAns === q.correct_option_index;
              const qOpts = getQOptions(q);

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border ${
                    isCorrect ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1.5 flex-1">
                      <p className="text-xs font-bold text-slate-900">
                        {idx + 1}. {getQText(q)}
                      </p>
                      <p className="text-xs text-slate-700">
                        {t('quizzes.yourAnswer', 'Sizning javobingiz:')} <strong>{qOpts[userAns] || '—'}</strong>
                      </p>
                      {!isCorrect && (
                        <p className="text-xs text-emerald-700">
                          {t('quizzes.correctAnswer', "To'g'ri javob:")} <strong>{qOpts[q.correct_option_index]}</strong>
                        </p>
                      )}
                      {q.explanation && (
                        <p className="text-xs text-slate-500 italic mt-1 pt-1 border-t border-slate-200/60">
                          💡 {getQExplanation(q)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        /* Active Question Card */
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
              {t('quizzes.question', 'Savol')} {currentIdx + 1}
            </span>
            <h4 className="text-lg font-bold text-slate-900 leading-snug">
              {getQText(currentQ)}
            </h4>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentOptions.map((option, optIdx) => {
              const isSelected = selectedAnswers[currentQ.id] === optIdx;

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(currentQ.id, optIdx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50 text-brand-900 font-semibold shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-xs sm:text-sm">{option}</span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                      isSelected
                        ? 'border-brand-600 bg-brand-600 text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
              icon={ArrowLeft}
            >
              {t('quizzes.previous', 'Oldingi')}
            </Button>

            {currentIdx < questions.length - 1 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCurrentIdx((i) => i + 1)}
                icon={ArrowRight}
                iconPosition="right"
              >
                {t('quizzes.next', 'Keyingi')}
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmitQuiz}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {t('quizzes.submitAnswers', 'Javoblarni topshirish')}
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
