import React, { useState, useEffect } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import { useLanguage } from '../../lib/i18n/LanguageContext';
import { dataService } from '../../services/dataService';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import {
  Award,
  Sparkles,
  Flame,
  CheckCircle2,
  Lock,
  Footprints,
  Code2,
} from 'lucide-react';

export function AchievementsPage() {
  const { profile, user } = useAuth();
  const { t, localize } = useLanguage();
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

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('dashboard.achievements', 'Yutuqlar va nishonlar')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t('dashboard.recentProgress', "Darslarni o'rganing, seriyalarni saqlang va yangi darajalarga erishing.")}
        </p>
      </div>

      {/* Badges Grid */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
          <Award className="w-5 h-5 text-brand-600" />
          <span>{t('dashboard.certificatesEarned', 'Yutuq nishonlari')}</span>
        </h3>

        {loading ? (
          <div className="p-12 text-center text-slate-400">{t('common.loading', 'Yuklanmoqda...')}</div>
        ) : (
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
                      <h4 className="font-bold text-slate-900 text-sm">{localize(ach.title)}</h4>
                      {isUnlocked ? (
                        <Badge variant="emerald" size="sm">
                          {t('dashboard.completed', 'Ochilgan')}
                        </Badge>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                          <Lock className="w-3 h-3" /> {t('common.close', 'Qulflangan')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{localize(ach.description)}</p>
                    <div className="pt-1 flex items-center gap-1 text-xs text-brand-600 font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>+{ach.xp_award} {t('common.xp', 'XP')}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
