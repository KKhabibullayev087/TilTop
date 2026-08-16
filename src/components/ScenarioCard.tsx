import React from 'react';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  Plane,
  Car,
  Building,
  Utensils,
  Compass,
  Stethoscope,
  Code2,
  Shirt,
  Bus,
  Coffee,
  ShieldAlert,
  CloudSun,
  Landmark,
  Film,
  Palette,
  Activity,
  Briefcase,
  HandMetal,
  Gamepad2,
  AlertTriangle,
} from 'lucide-react';
import { LessonSection, LanguageCode, UserProfile } from '../types';
import { useI18n } from '../utils/i18n';

interface ScenarioCardProps {
  section: LessonSection;
  isCompleted: boolean;
  targetLanguage: LanguageCode;
  userProfile?: UserProfile;
  onSelectScenario: (section: LessonSection) => void;
  onPlayGame?: (section: LessonSection) => void;
  onViewJson: (section: LessonSection) => void;
}

const ICONS: Record<string, typeof HandMetal> = {
  HandMetal,
  ShoppingBag,
  Plane,
  Car,
  Building,
  Utensils,
  Compass,
  Stethoscope,
  Code2,
  Code: Code2,
  Shirt,
  Bus,
  Coffee,
  ShieldAlert,
  CloudSun,
  Landmark,
  Film,
  Palette,
  Activity,
  Briefcase,
};

const DIFFICULTY_LABEL: Record<string, string> = {
  "Boshlang'ich": 'A1–A2',
  "O'rta": 'B1–B2',
  Yuqori: 'C1–C2',
};

export const ScenarioCard: React.FC<ScenarioCardProps> = ({
  section,
  isCompleted,
  onSelectScenario,
  onPlayGame,
  onViewJson,
}) => {
  const { t } = useI18n();

  const IconComponent = ICONS[section.icon_name || ''] || Sparkles;
  const notLocalized = section.is_localized === false;

  return (
    <div
      id={`scenario-card-${section.section_id}`}
      className="group bg-surface rounded-xl border border-line hover:border-accent-300 transition-colors p-5 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-9 h-9 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center flex-shrink-0">
            <IconComponent className="w-[18px] h-[18px]" />
          </span>
          <span className="min-w-0">
            <span className="block text-[11px] font-medium text-ink-subtle tabular-nums">
              #{section.section_id} · {section.category}
            </span>
            <span className="block text-[11px] text-ink-subtle">
              {DIFFICULTY_LABEL[section.difficulty] || section.difficulty}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {notLocalized && (
            <span
              title={t(
                'card.not_localized_hint',
                "Bu dars hali tanlangan tilga moslashtirilmagan — mazmuni ingliz tilida ko'rsatilmoqda."
              )}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-warning-soft text-amber-700 text-[10px] font-semibold"
            >
              <AlertTriangle className="w-3 h-3" />
              {t('card.not_localized', 'EN')}
            </span>
          )}
          {isCompleted && (
            <span
              title={t('card.completed', 'Bajarildi')}
              className="flex items-center justify-center w-5 h-5 rounded-full bg-positive-soft text-positive"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-ink leading-snug group-hover:text-accent-700 transition-colors">
        {section.title}
      </h3>
      {section.title_en && section.title_en !== section.title && (
        <p className="text-xs text-ink-subtle mt-0.5 truncate">{section.title_en}</p>
      )}

      <p className="text-xs text-ink-muted mt-2.5 leading-relaxed line-clamp-2">
        {section.scenario_context}
      </p>

      {/* Roles */}
      <dl className="mt-4 space-y-1 text-[11px]">
        <div className="flex items-baseline gap-2">
          <dt className="text-ink-subtle flex-shrink-0 w-8">AI</dt>
          <dd className="text-ink-muted truncate">{section.ai_role}</dd>
        </div>
        <div className="flex items-baseline gap-2">
          <dt className="text-ink-subtle flex-shrink-0 w-8">{t('card.role', 'Rol')}</dt>
          <dd className="text-ink-muted truncate">{section.user_role}</dd>
        </div>
      </dl>

      {/* Footer */}
      <div className="mt-auto pt-4">
        <div className="flex items-center gap-3 text-[11px] text-ink-subtle mb-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {section.duration}
          </span>
          <span className="tabular-nums">+{section.xp_reward} XP</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id={`start-scenario-btn-${section.section_id}`}
            type="button"
            onClick={() => onSelectScenario(section)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            {t('card.start_lesson', 'Boshlash')}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {onPlayGame && (
            <button
              type="button"
              onClick={() => onPlayGame(section)}
              title={t('card.play_games', "O'yinlar")}
              className="p-2 rounded-lg border border-line text-ink-muted hover:text-ink hover:bg-surface-sunken transition-colors cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4" />
            </button>
          )}

          <button
            id={`view-json-btn-${section.section_id}`}
            type="button"
            onClick={() => onViewJson(section)}
            title={t('card.view_json', 'JSON')}
            className="p-2 rounded-lg border border-line text-ink-muted hover:text-ink hover:bg-surface-sunken transition-colors cursor-pointer"
          >
            <Code2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
