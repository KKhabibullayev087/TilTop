import React from 'react';
import {
  BookOpen,
  Gamepad2,
  Sparkles,
  Code2,
  Trophy,
  Flame,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  LogOut,
  User,
} from 'lucide-react';
import { UserProfile } from '../types';
import { PROFESSION_OPTIONS, PROFICIENCY_OPTIONS } from '../data/curriculum';
import { useI18n } from '../utils/i18n';
import { useAuth } from '../utils/auth';

export type TabId = 'scenarios' | 'games' | 'lab' | 'json_engine' | 'stats';

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  userProfile: UserProfile;
  onOpenProfileModal: () => void;
  xp: number;
  streak: number;
  completedCount: number;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  onOpenProfileModal,
  xp,
  streak,
  completedCount,
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
}) => {
  const { t } = useI18n();
  const { user, logout } = useAuth();

  const currentProf =
    PROFESSION_OPTIONS.find((p) => p.id === userProfile.profession) || PROFESSION_OPTIONS[0];
  const currentLvl =
    PROFICIENCY_OPTIONS.find((l) => l.id === userProfile.level) || PROFICIENCY_OPTIONS[0];

  // The raw JSON engine is a developer-facing tool, so it only appears for
  // learners who picked the IT track.
  const showJsonEngine = userProfile.profession === 'it_specialist';

  const navItems: { id: TabId; label: string; icon: typeof BookOpen; badge?: string }[] = [
    { id: 'scenarios', label: t('nav.scenarios', '20 Ssenariy'), icon: BookOpen, badge: '20' },
    { id: 'games', label: t('nav.games', "Mini O'yinlar"), icon: Gamepad2, badge: '4' },
    { id: 'lab', label: t('nav.lab', 'Dars Laboratoriyasi'), icon: Sparkles },
    ...(showJsonEngine
      ? [{ id: 'json_engine' as TabId, label: t('nav.json_engine', 'JSON Dvigatel'), icon: Code2 }]
      : []),
    {
      id: 'stats',
      label: t('nav.stats', 'Mening Natijalarim'),
      icon: Trophy,
      badge: completedCount > 0 ? `${completedCount}/20` : undefined,
    },
  ];

  const initials = (user?.name || 'T')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // `collapsed` only applies from lg up; the mobile drawer is always full width.
  const railWidth = collapsed ? 'lg:w-[72px]' : 'lg:w-64';

  return (
    <>
      {/* Mobile scrim */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-[2px] lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 ${railWidth}
          bg-surface border-r border-line
          flex flex-col
          transition-transform duration-200 ease-out lg:transition-[width]
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        `}
      >
        {/* Brand */}
        <div className={`h-16 flex items-center border-b border-line flex-shrink-0 ${collapsed ? 'lg:justify-center lg:px-0' : ''} px-4 justify-between`}>
          <button
            type="button"
            onClick={() => {
              setActiveTab('scenarios');
              onCloseMobile();
            }}
            className="flex items-center gap-2.5 cursor-pointer min-w-0"
          >
            <div className="w-8 h-8 rounded-lg bg-accent-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              T
            </div>
            <span className={`text-base font-bold text-ink tracking-tight truncate ${collapsed ? 'lg:hidden' : ''}`}>
              Til<span className="text-accent-600">Top</span>
            </span>
          </button>

          {/* Desktop collapse toggle */}
          <button
            type="button"
            onClick={onToggleCollapsed}
            title={collapsed ? t('sidebar.expand', 'Kengaytirish') : t('sidebar.collapse', "Yig'ish")}
            className={`hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-ink-subtle hover:text-ink hover:bg-surface-sunken transition-colors cursor-pointer ${collapsed ? 'lg:hidden' : ''}`}
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>

          {/* Mobile close */}
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label={t('sidebar.close', 'Yopish')}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg text-ink-subtle hover:text-ink hover:bg-surface-sunken transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <button
            type="button"
            onClick={onToggleCollapsed}
            title={t('sidebar.expand', 'Kengaytirish')}
            className="hidden lg:flex items-center justify-center h-9 mx-3 mt-3 rounded-lg text-ink-subtle hover:text-ink hover:bg-surface-sunken transition-colors cursor-pointer"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto thin-scroll p-3 space-y-1">
          {!collapsed && (
            <p className="px-2.5 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-subtle lg:block hidden">
              {t('sidebar.menu', 'Menyu')}
            </p>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  onCloseMobile();
                }}
                title={collapsed ? item.label : undefined}
                aria-current={isActive ? 'page' : undefined}
                className={`
                  w-full flex items-center gap-3 px-2.5 py-2 rounded-lg press
                  text-sm font-medium transition-colors cursor-pointer
                  ${collapsed ? 'lg:justify-center lg:px-0' : ''}
                  ${isActive
                    ? 'bg-accent-50 text-accent-700'
                    : 'text-ink-muted hover:text-ink hover:bg-surface-sunken'}
                `}
              >
                <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-accent-600' : ''}`} />
                <span className={`flex-1 text-left truncate ${collapsed ? 'lg:hidden' : ''}`}>
                  {item.label}
                </span>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold tabular-nums ${collapsed ? 'lg:hidden' : ''} ${
                      isActive ? 'bg-accent-100 text-accent-700' : 'bg-surface-sunken text-ink-muted'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom: streak + XP, level, profile */}
        <div className="border-t border-line p-3 space-y-2 flex-shrink-0">

          {/* Streak & XP */}
          <div className={`flex items-center gap-2 ${collapsed ? 'lg:flex-col lg:gap-1.5' : ''}`}>
            <div
              title={`${streak} ${t('header.streak', 'kun')}`}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-warning-soft text-amber-800 text-xs font-semibold ${collapsed ? 'lg:px-0 lg:w-full lg:justify-center' : 'flex-1'}`}
            >
              <Flame className="w-3.5 h-3.5 text-warning flex-shrink-0" />
              <span className="tabular-nums">{streak}</span>
              <span className={`font-normal ${collapsed ? 'lg:hidden' : ''}`}>
                {t('header.streak', 'kun')}
              </span>
            </div>

            <div
              title={`${xp} XP`}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-accent-50 text-accent-700 text-xs font-semibold ${collapsed ? 'lg:px-0 lg:w-full lg:justify-center' : 'flex-1'}`}
            >
              <Trophy className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="tabular-nums">{xp}</span>
              <span className={`font-normal ${collapsed ? 'lg:hidden' : ''}`}>XP</span>
            </div>
          </div>

          {/* Proficiency level — moved here from the old top navbar */}
          <button
            type="button"
            id="sidebar-level-btn"
            onClick={onOpenProfileModal}
            title={`${currentProf.titleUz} · ${currentLvl.titleUz} (${currentLvl.levelCode})`}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg bg-surface-sunken hover:bg-line text-ink-muted hover:text-ink text-xs font-medium transition-colors cursor-pointer ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}
          >
            <span className="px-1.5 py-0.5 rounded bg-surface text-ink font-semibold text-[10px] tabular-nums flex-shrink-0 border border-line">
              {currentLvl.levelCode}
            </span>
            <span className={`truncate ${collapsed ? 'lg:hidden' : ''}`}>
              {currentProf.titleUz.split(' ')[0]}
            </span>
          </button>

          {/* Profile */}
          <div className={`flex items-center gap-2 ${collapsed ? 'lg:flex-col' : ''}`}>
            <button
              type="button"
              id="sidebar-profile-btn"
              onClick={onOpenProfileModal}
              title={user?.email || t('header.profile', 'Profil')}
              className={`flex-1 min-w-0 flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-surface-sunken transition-colors cursor-pointer ${collapsed ? 'lg:flex-none lg:w-full lg:justify-center' : ''}`}
            >
              <span className="w-8 h-8 rounded-full bg-accent-500 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                {user ? initials : <User className="w-4 h-4" />}
              </span>
              <span className={`min-w-0 text-left ${collapsed ? 'lg:hidden' : ''}`}>
                <span className="block text-xs font-semibold text-ink truncate">
                  {user?.name || t('header.profile', 'Profil')}
                </span>
                <span className="block text-[11px] text-ink-subtle truncate">
                  {user?.email || ''}
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={logout}
              title={t('auth.logout', 'Chiqish')}
              className={`flex items-center justify-center w-8 h-8 rounded-lg text-ink-subtle hover:text-danger hover:bg-danger-soft transition-colors cursor-pointer flex-shrink-0 ${collapsed ? 'lg:w-full' : ''}`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </aside>
    </>
  );
};
