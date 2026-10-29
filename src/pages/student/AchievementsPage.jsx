import React, { useState, useEffect } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import { dataService } from '../../services/dataService';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import {
  Award,
  Sparkles,
  Flame,
  CheckCircle2,
  Lock,
  Trophy,
  Footprints,
  Code2,
} from 'lucide-react';

export function AchievementsPage() {
  const { profile, user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [unlockedList, setUnlockedList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      setLoading(true);
      try {
        const [achs, studentAchs] = await Promise.all([
          dataService.getAchievements(),
          dataService.getStudentAchievements(user.id),
        ]);
        setAchievements(achs);
        setUnlockedList(studentAchs);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const iconMap = {
    Footprints,
    Award,
    Sparkles,
    Flame,
    Code2,
  };

  const leaderboard = [
    { rank: 1, name: 'Elena Vance', xp: 2900, level: 15, streak: 42, role: 'admin' },
    { rank: 2, name: 'Dr. Sarah Jenkins', xp: 1800, level: 10, streak: 18, role: 'teacher' },
    { rank: 3, name: 'Alex Rivera', xp: profile?.xp || 480, level: profile?.level || 3, streak: profile?.streak_days || 5, role: 'student', isCurrent: true },
    { rank: 4, name: 'Marcus Chen', xp: 410, level: 3, streak: 4, role: 'student' },
    { rank: 5, name: 'Sophia Patel', xp: 350, level: 2, streak: 3, role: 'student' },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Badges & Platform Leaderboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Complete coding milestones, maintain study streaks, and earn your place among top engineers.
        </p>
      </div>

      {/* Badges Grid */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
          <Award className="w-5 h-5 text-brand-600" />
          <span>Achievement Badges</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {achievements.map((ach) => {
            const isUnlocked = unlockedList.some((u) => u.achievement_id === ach.id);
            const Icon = iconMap[ach.icon_name] || Award;

            return (
              <Card
                key={ach.id}
                className={`p-5 flex items-start gap-4 transition ${
                  isUnlocked
                    ? 'border-brand-200 bg-gradient-to-b from-white to-brand-50/30'
                    : 'opacity-70 bg-slate-50/80 border-slate-200'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    isUnlocked
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">{ach.title}</h4>
                    {isUnlocked ? (
                      <Badge variant="emerald" size="sm">
                        Unlocked
                      </Badge>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{ach.description}</p>
                  <div className="pt-1 flex items-center gap-1 text-xs text-brand-600 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>+{ach.xp_award} XP</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Platform Leaderboard */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>DevAcademy Global Leaderboard</span>
          </h3>
          <span className="text-xs text-slate-500">Updated in real-time</span>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Rank</th>
                  <th className="px-6 py-3.5">Developer</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Streak</th>
                  <th className="px-6 py-3.5">Level</th>
                  <th className="px-6 py-3.5 text-right">XP Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaderboard.map((user) => (
                  <tr
                    key={user.rank}
                    className={`transition-colors ${
                      user.isCurrent
                        ? 'bg-brand-50/70 font-semibold'
                        : 'hover:bg-slate-50/50'
                    }`}
                  >
                    <td className="px-6 py-4">
                      {user.rank === 1 ? (
                        <span className="w-6 h-6 rounded-full bg-amber-400 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                          1
                        </span>
                      ) : user.rank === 2 ? (
                        <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-bold flex items-center justify-center text-xs">
                          2
                        </span>
                      ) : user.rank === 3 ? (
                        <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-bold flex items-center justify-center text-xs">
                          3
                        </span>
                      ) : (
                        <span className="font-bold text-slate-500 pl-2">#{user.rank}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{user.name}</span>
                        {user.isCurrent && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-brand-600 text-white font-medium">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="navy" size="sm" className="uppercase text-[10px]">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-amber-600 font-semibold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{user.streak}d</span>
                    </td>
                    <td className="px-6 py-4 text-slate-700">Level {user.level}</td>
                    <td className="px-6 py-4 text-right font-bold text-brand-600 font-mono">
                      {user.xp} XP
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
