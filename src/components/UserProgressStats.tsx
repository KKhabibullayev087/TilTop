import React from 'react';
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  SlidersHorizontal, 
  Zap, 
  BookOpen, 
  Target, 
  Star,
  Globe2,
  Layers,
  GraduationCap
} from 'lucide-react';
import { UserProfile, LanguageCode } from '../types';
import { 
  OFFICIAL_SECTIONS, 
  COUNTRY_LANGUAGES, 
  PROFESSION_OPTIONS, 
  PROFICIENCY_OPTIONS 
} from '../data/curriculum';
import { useI18n } from '../utils/i18n';

interface UserProgressStatsProps {
  userProfile: UserProfile;
  targetLanguage: LanguageCode;
  xp: number;
  streak: number;
  completedSectionIds: number[];
  onOpenProfileModal: () => void;
  onSelectSection: (secId: number) => void;
}

export const UserProgressStats: React.FC<UserProgressStatsProps> = ({
  userProfile,
  targetLanguage,
  xp,
  streak,
  completedSectionIds,
  onOpenProfileModal,
  onSelectSection,
}) => {
  const { t } = useI18n();
  const currentCountry = COUNTRY_LANGUAGES.find((c) => c.code === targetLanguage) || COUNTRY_LANGUAGES[0];
  const curProf = PROFESSION_OPTIONS.find((p) => p.id === userProfile.profession) || PROFESSION_OPTIONS[0];
  const curLvl = PROFICIENCY_OPTIONS.find((l) => l.id === userProfile.level) || PROFICIENCY_OPTIONS[0];

  const totalSections = OFFICIAL_SECTIONS.length;
  const completedCount = completedSectionIds.length;
  const progressPercent = Math.round((completedCount / totalSections) * 100);

  // Gamified Badges
  const badges = [
    {
      id: 'first_step',
      title: "Ilk Qadam",
      description: "1 ta darsni muvaffaqiyatli yakunlang",
      icon: "🌱",
      unlocked: completedCount >= 1,
      color: "bg-accent-400",
    },
    {
      id: 'it_communicator',
      title: "IT Muloqotchi",
      description: "Texnik yoki ish yuzasidan 3 ta ssenariyni bajaring",
      icon: "💻",
      unlocked: completedCount >= 3,
      color: "bg-accent-500",
    },
    {
      id: 'shadowing_pro',
      title: "Shadowing Chempioni",
      description: "5 ta ssenariyda toza talaffuz qiling",
      icon: "🎙️",
      unlocked: completedCount >= 5,
      color: "bg-accent-500",
    },
    {
      id: 'chorsu_master',
      title: "Bozor Ustasi",
      description: "Chorsu va Savdo bo'limlarini o'zlashtiring",
      icon: "🛍️",
      unlocked: completedSectionIds.includes(1),
      color: "bg-accent-600",
    },
    {
      id: 'polyglot',
      title: "TilTop Poliglot",
      description: "Barcha 20 ta ssenariyni 100% bajaring",
      icon: "👑",
      unlocked: completedCount === 20,
      color: "bg-accent-700",
    },
  ];

  return (
    <div id="user-progress-stats" className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      
      {/* User Profile Card */}
      <div className="bg-surface rounded-xl border border-line p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg bg-accent-500 text-white flex items-center justify-center text-3xl font-semibold">
            {currentCountry.flag}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold text-ink">
                {t('stats.learner', "TilTop O'quvchisi")}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-accent-100 text-accent-800 text-[11px] font-bold border border-accent-200">
                {t('stats.active', 'Faol')}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-ink-muted mt-1">
              {t('stats.learning_lang', "O'rganilayotgan til")}: <strong className="text-ink">{currentCountry.languageName}</strong> • {t('hero.selected_role', 'Kasb')}: <strong className="text-accent-700">{curProf.titleUz}</strong> • {t('hero.selected_level', 'Daraja')}: <strong className="text-accent-700">{curLvl.levelCode}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={onOpenProfileModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-surface-sunken hover:bg-line text-ink font-bold text-xs sm:text-sm transition-all cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4 text-accent-600" />
          <span>{t('stats.edit_profile', 'Profilni Tahrirlash')}</span>
        </button>
      </div>

      {/* Stats Summary Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-surface rounded-xl border border-line p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center flex-shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-ink-subtle uppercase">{t('stats.total_xp', "Jami To'plangan Ball")}</p>
            <p className="text-2xl font-semibold font-mono text-ink mt-0.5">{xp} XP</p>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-line p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Flame className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-ink-subtle uppercase">{t('stats.active_streak', "O'rganish Seriyasi")}</p>
            <p className="text-2xl font-semibold font-mono text-ink mt-0.5">{streak} Kun</p>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-line p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center flex-shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-ink-subtle uppercase">{t('stats.completed_lessons', "O'zlashtirilgan Ssenariylar")}</p>
            <p className="text-2xl font-semibold font-mono text-ink mt-0.5">{completedCount} / {totalSections}</p>
          </div>
        </div>

      </div>

      {/* Progress Bar Container */}
      <div className="bg-surface rounded-xl border border-line p-6 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-ink-muted">{t('stats.progress_title', "Umumiy o'zlashtirish jarayoni")}</span>
          <span className="text-accent-700 font-mono text-sm">{progressPercent}%</span>
        </div>

        <div className="w-full h-3.5 rounded-full bg-surface-sunken overflow-hidden">
          <div 
            className="h-full bg-accent-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 3D Colorful Badges Showcase */}
      <div className="bg-surface rounded-xl border border-line p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div>
            <h3 className="text-lg font-semibold text-ink">
              {t('stats.badges_title', 'Yutuqlar va Nishonlar')}
            </h3>
            <p className="text-xs text-ink-muted mt-0.5">
              {t('stats.badges_desc', "Darslar va o'yinlarni bajarib nishonlarni oching.")}
            </p>
          </div>
          <span className="text-xs font-bold font-mono bg-accent-50 text-accent-700 px-3 py-1 rounded-full border border-accent-200">
            {badges.filter(b => b.unlocked).length} / {badges.length} {t('stats.unlocked', 'Ochilgan')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-lg border-2 transition-all flex items-start gap-3.5 ${
                badge.unlocked 
                  ? 'border-accent-200 bg-accent-50/40 ' 
                  : 'border-line bg-surface-muted/60 opacity-50 grayscale'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${badge.color} text-white flex-shrink-0`}>
                {badge.icon}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-ink">
                    {badge.title}
                  </h4>
                  {badge.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-accent-600" />}
                </div>
                <p className="text-xs text-ink-muted mt-0.5 leading-snug">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 20 Scenarios Checklist Grid */}
      <div className="bg-surface rounded-xl border border-line p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-semibold text-ink">
          20 Ta Ssenariy Bo'yicha Holat
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
          {OFFICIAL_SECTIONS.map((sec) => {
            const isDone = completedSectionIds.includes(sec.section_id);

            return (
              <button
                key={sec.section_id}
                onClick={() => onSelectSection(sec.section_id)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  isDone
                    ? 'border-accent-300 bg-accent-50 text-accent-900 font-bold'
                    : 'border-line bg-surface-muted hover:bg-surface-sunken text-ink-muted'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold">#{sec.section_id}</span>
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-600" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                  )}
                </div>
                <p className="text-xs font-semibold mt-1 truncate">
                  {sec.title}
                </p>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
