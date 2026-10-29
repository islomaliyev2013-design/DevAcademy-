import React, { useState, useEffect } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import { dataService } from '../../services/dataService';
import { LearningActivityChart } from '../../features/progress/LearningActivityChart';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import {
  TrendingUp,
  Sparkles,
  Flame,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

export function ProgressPage() {
  const { profile, user } = useAuth();
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

  const xp = profile?.xp || 0;
  const level = profile?.level || 1;
  const nextLevelXp = level * 150;
  const currentLevelProgress = Math.min(100, Math.round(((xp % 150) / 150) * 100));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Learning Progress & Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Detailed metrics tracking your code commits, lesson milestones, and XP evolution.
        </p>
      </div>

      {/* Level & Streak Banner */}
      <Card className="p-6 sm:p-8 bg-gradient-to-r from-brand-900 via-brand-800 to-navy-950 text-white space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold text-brand-300 tracking-wider">
              Current Rank
            </span>
            <h2 className="text-2xl font-extrabold flex items-center gap-2">
              <span>Level {level} Full-Stack Prodigy</span>
              <Sparkles className="w-5 h-5 text-amber-300" />
            </h2>
            <p className="text-xs text-brand-200">
              {150 - (xp % 150)} XP needed to reach Level {level + 1}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 px-4 py-3 rounded-2xl backdrop-blur-sm border border-white/10">
            <Flame className="w-8 h-8 fill-amber-400 text-amber-400" />
            <div>
              <p className="text-xl font-extrabold">{profile?.streak_days || 1} Days</p>
              <p className="text-[11px] text-brand-200 uppercase font-semibold">Active Streak</p>
            </div>
          </div>
        </div>

        {/* Progress bar towards next level */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-brand-200">
            <span>Level {level} ({xp} XP)</span>
            <span>{currentLevelProgress}% to Level {level + 1}</span>
          </div>
          <div className="w-full bg-navy-950/80 h-3 rounded-full overflow-hidden border border-brand-700/50">
            <div
              className="bg-gradient-to-r from-brand-400 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${currentLevelProgress}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Activity Chart */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-slate-900 text-lg">Weekly Coding Activity</h3>
        <Card className="p-6">
          <LearningActivityChart />
        </Card>
      </div>

      {/* Enrolled Courses Completion Status */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-slate-900 text-lg">Curriculum Progress Breakdown</h3>
        <div className="space-y-3">
          {enrollments.map((enr) => (
            <Card key={enr.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="violet" size="sm">
                    {enr.courses?.level || 'Beginner'}
                  </Badge>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {enr.courses?.title || 'Course'}
                  </h4>
                </div>
                <p className="text-xs text-slate-500">
                  Enrolled on {new Date(enr.enrolled_at || Date.now()).toLocaleDateString()}
                </p>
              </div>

              <div className="w-full sm:w-60 space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">Completion</span>
                  <span className="text-brand-700">{enr.progress_percent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-600 h-2 rounded-full transition-all"
                    style={{ width: `${enr.progress_percent}%` }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
