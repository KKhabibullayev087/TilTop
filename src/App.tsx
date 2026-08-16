import React, { useState, useEffect } from 'react';
import {
  Search,
  Gamepad2,
  Code2,
  Loader2,
  AlertTriangle,
  Languages,
} from 'lucide-react';
import {
  LessonSection,
  UserProfile,
  UserProgress,
  CountryLanguageOption
} from './types';
import {
  OFFICIAL_SECTIONS,
  COUNTRY_LANGUAGES,
  PROFESSION_OPTIONS,
} from './data/curriculum';
import {
  getAdaptedCurriculum,
  getCurriculumCoverage,
  fetchAndCacheDynamicCurriculum,
} from './data/curriculumAdapters';
import { Header } from './components/Header';
import { Sidebar, TabId } from './components/Sidebar';
import { ScenarioCard } from './components/ScenarioCard';
import { InteractiveLessonLab } from './components/InteractiveLessonLab';
import { InteractiveGamesHub } from './components/InteractiveGamesHub';
import { RawJsonEngineExplorer } from './components/RawJsonEngineExplorer';
import { UserProgressStats } from './components/UserProgressStats';
import { OnboardingProfileModal } from './components/OnboardingProfileModal';
import { AddLanguageModal } from './components/AddLanguageModal';
import { LoginPage } from './components/LoginPage';
import { CustomDropdown } from './components/CustomDropdown';
import { I18nProvider, useI18n } from './utils/i18n';
import { AuthProvider, useAuth } from './utils/auth';

const SIDEBAR_COLLAPSED_KEY = 'tiltop_sidebar_collapsed';

function TilTopDashboard() {
  const { t } = useI18n();
  const { user, saveState } = useAuth();

  // 1. Persistent User Profile & Progress
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('tiltop_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      targetLanguage: 'en',
      targetLanguageName: 'Ingliz tili (English)',
      countryFlag: '🇺🇸',
      profession: 'it_specialist',
      level: 'intermediate',
      onboardingCompleted: true,
    };
  });

  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('tiltop_user_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      xp: 0,
      streak: 0,
      lastActiveDate: new Date().toISOString(),
      completedSections: [],
    };
  });

  // Adopt server-side state once, when the account's saved state arrives.
  const [hydratedFromAccount, setHydratedFromAccount] = useState(false);
  useEffect(() => {
    if (hydratedFromAccount || !user) return;
    if (user.profile) setUserProfile((prev) => ({ ...prev, ...(user.profile as object) }));
    if (user.progress) setUserProgress((prev) => ({ ...prev, ...(user.progress as object) }));
    setHydratedFromAccount(true);
  }, [user, hydratedFromAccount]);

  // Dynamic Curriculum Sections (adapted to selected country / target language)
  const [activeSections, setActiveSections] = useState<LessonSection[]>(() =>
    getAdaptedCurriculum(
      userProfile.targetLanguage,
      userProfile.countryFlag,
      userProfile.profession,
      userProfile.level
    )
  );
  const [isAdaptingCurriculum, setIsAdaptingCurriculum] = useState(false);
  const [adaptationFailed, setAdaptationFailed] = useState(false);
  const [coverage, setCoverage] = useState(() => getCurriculumCoverage(userProfile.targetLanguage));
  const [adaptationAttempt, setAdaptationAttempt] = useState(0);

  // Layout state
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(
    () => localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1'
  );
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, sidebarCollapsed ? '1' : '0');
  }, [sidebarCollapsed]);

  // Auto-adapt curriculum when userProfile language or country changes.
  // Built-in translations render immediately; any sections that would otherwise
  // fall back to English are then filled in by the LLM cascade in the background.
  useEffect(() => {
    let cancelled = false;

    const applySections = (sections: LessonSection[]) => {
      setActiveSections(sections);
      setSelectedSection((prev) => {
        const match = sections.find((s) => s.section_id === prev.section_id);
        return match || sections[0];
      });
      setCoverage(getCurriculumCoverage(userProfile.targetLanguage));
    };

    applySections(
      getAdaptedCurriculum(
        userProfile.targetLanguage,
        userProfile.countryFlag,
        userProfile.profession,
        userProfile.level
      )
    );
    setAdaptationFailed(false);

    if (getCurriculumCoverage(userProfile.targetLanguage).isFullyLocalized) {
      return;
    }

    setIsAdaptingCurriculum(true);
    fetchAndCacheDynamicCurriculum(
      userProfile.targetLanguage,
      userProfile.targetLanguageName || userProfile.targetLanguage,
      userProfile.profession,
      userProfile.level
    )
      .then((sections) => {
        if (cancelled) return;
        applySections(sections);
        setAdaptationFailed(!getCurriculumCoverage(userProfile.targetLanguage).isFullyLocalized);
      })
      .catch(() => {
        if (!cancelled) setAdaptationFailed(true);
      })
      .finally(() => {
        if (!cancelled) setIsAdaptingCurriculum(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    userProfile.targetLanguage,
    userProfile.targetLanguageName,
    userProfile.countryFlag,
    userProfile.profession,
    userProfile.level,
    adaptationAttempt,
  ]);

  // Active View & Tab State
  const [activeTab, setActiveTab] = useState<TabId>('scenarios');
  const [selectedSection, setSelectedSection] = useState<LessonSection>(OFFICIAL_SECTIONS[0]);
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [addLanguageModalOpen, setAddLanguageModalOpen] = useState<boolean>(false);
  const [addLanguageDefaultTab, setAddLanguageDefaultTab] = useState<'site_ui' | 'target_country'>('site_ui');

  // Filters and Search for 20 Scenarios
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Barchasi');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Barchasi');

  // Persist locally, then mirror to the account so progress follows the user.
  useEffect(() => {
    localStorage.setItem('tiltop_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('tiltop_user_progress', JSON.stringify(userProgress));
  }, [userProgress]);

  useEffect(() => {
    if (!user || !hydratedFromAccount) return;
    const timer = setTimeout(() => {
      saveState({ profile: userProfile, progress: userProgress });
    }, 1200);
    return () => clearTimeout(timer);
  }, [userProfile, userProgress, user, hydratedFromAccount, saveState]);

  const categories = [
    t('filter.all', 'Barchasi'),
    'Kundalik & Muloqot',
    'Sayohat & Transport',
    'Kasbiy & IT',
    'Madaniyat & Taomlar',
    'Tibbiyot',
    'Favqulodda',
  ];

  const difficultyOptions = [
    { value: 'Barchasi', label: t('filter.difficulty', 'Barcha darajalar') },
    { value: "Boshlang'ich", label: t('filter.beginner', "Boshlang'ich"), badge: 'A1-A2' },
    { value: "O'rta", label: t('filter.intermediate', "O'rta"), badge: 'B1-B2' },
    { value: 'Yuqori', label: t('filter.advanced', 'Yuqori'), badge: 'C1-C2' },
  ];

  const filteredSections = activeSections.filter((sec) => {
    const matchesSearch =
      sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sec.title_en && sec.title_en.toLowerCase().includes(searchQuery.toLowerCase())) ||
      sec.scenario_context.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Barchasi' ||
      selectedCategory === t('filter.all', 'Barchasi') ||
      sec.category.toLowerCase().includes(selectedCategory.toLowerCase().split(' ')[0]);

    const matchesDifficulty =
      selectedDifficulty === 'Barchasi' ||
      selectedDifficulty === t('filter.difficulty', 'Barcha darajalar') ||
      sec.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleSelectCountryLanguage = (codeOrName: string, flag = '🌐', customName?: string) => {
    const matched = COUNTRY_LANGUAGES.find(
      (c) => c.code.toLowerCase() === codeOrName.toLowerCase() ||
             c.languageName.toLowerCase().includes(codeOrName.toLowerCase())
    );

    setUserProfile((prev) => ({
      ...prev,
      targetLanguage: matched ? matched.code : codeOrName,
      targetLanguageName: customName || (matched ? matched.languageName : codeOrName),
      countryFlag: flag !== '🌐' ? flag : (matched ? matched.flag : '🌐'),
    }));
  };

  const handleSetupCountryOption = (option: CountryLanguageOption) => {
    setUserProfile((prev) => ({
      ...prev,
      targetLanguage: option.code,
      targetLanguageName: `${option.country} (${option.languageName})`,
      countryFlag: option.flag,
    }));
  };

  const handleSaveProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    setProfileModalOpen(false);
  };

  const handleEarnXp = (amount: number) => {
    setUserProgress((prev) => ({ ...prev, xp: prev.xp + amount }));
  };

  const handleCompleteSection = (sectionId: number, earnedXp: number) => {
    setUserProgress((prev) => ({
      ...prev,
      xp: prev.xp + earnedXp,
      completedSections: prev.completedSections.includes(sectionId)
        ? prev.completedSections
        : [...prev.completedSections, sectionId],
    }));
  };

  const openSectionIn = (tab: TabId) => (sec: LessonSection) => {
    setSelectedSection(sec);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenScenarioLab = openSectionIn('lab');
  const handleOpenScenarioGame = openSectionIn('games');
  const handleOpenScenarioJson = openSectionIn('json_engine');

  const matchedCountry = COUNTRY_LANGUAGES.find(
    (c) => c.code.toLowerCase() === userProfile.targetLanguage.toLowerCase() ||
           c.languageName.toLowerCase().includes(userProfile.targetLanguage.toLowerCase())
  );
  const curProf = PROFESSION_OPTIONS.find((p) => p.id === userProfile.profession) || PROFESSION_OPTIONS[0];

  return (
    <div className="min-h-screen bg-surface-muted text-ink font-sans selection:bg-accent-100">

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        onOpenProfileModal={() => setProfileModalOpen(true)}
        xp={userProgress.xp}
        streak={userProgress.streak}
        completedCount={userProgress.completedSections.length}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed((v) => !v)}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      {/* Content shifts to clear the fixed sidebar from lg up */}
      <div className={`flex flex-col min-h-screen transition-[padding] duration-200 ${sidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-64'}`}>

        <Header
          targetLanguage={userProfile.targetLanguage}
          onSelectCountryLanguage={handleSelectCountryLanguage}
          userProfile={userProfile}
          onOpenAddLanguageModal={(defaultTab) => {
            setAddLanguageDefaultTab(defaultTab || 'site_ui');
            setAddLanguageModalOpen(true);
          }}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />

        <OnboardingProfileModal
          isOpen={profileModalOpen}
          targetLanguage={userProfile.targetLanguage}
          initialProfile={userProfile}
          onSaveProfile={handleSaveProfile}
          onClose={() => setProfileModalOpen(false)}
        />

        <AddLanguageModal
          isOpen={addLanguageModalOpen}
          onClose={() => setAddLanguageModalOpen(false)}
          defaultTab={addLanguageDefaultTab}
          onSetupCountryLanguage={handleSetupCountryOption}
        />

        <main className="flex-1">

          {/* ================= TAB 1: SCENARIOS ================= */}
          {activeTab === 'scenarios' && (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-5">

              {/* Page header */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-ink-muted">
                    <span className="text-base leading-none">
                      {userProfile.countryFlag || matchedCountry?.flag || '🌐'}
                    </span>
                    <span className="font-medium">
                      {userProfile.targetLanguageName || matchedCountry?.languageName || userProfile.targetLanguage}
                    </span>
                    <span className="text-ink-subtle">·</span>
                    <span>{curProf.titleUz}</span>
                  </div>
                  <h1 className="text-2xl font-bold text-ink tracking-tight">
                    {t('hero.title', '20 Ta Hayotiy Til Ssenariylari')}
                  </h1>
                  <p className="text-sm text-ink-muted max-w-xl leading-relaxed">
                    {t('hero.subtitle', "Har bir dars sizning kasbingiz va tanlangan davlat tilingizga moslashtirilgan.")}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    id="hero-open-games-btn"
                    onClick={() => setActiveTab('games')}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold transition-colors cursor-pointer"
                  >
                    <Gamepad2 className="w-4 h-4" />
                    {t('hero.interactive_games', "O'yinlar")}
                  </button>
                  <button
                    type="button"
                    id="hero-open-json-btn"
                    onClick={() => setActiveTab('json_engine')}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-line hover:bg-surface-sunken text-ink text-sm font-medium transition-colors cursor-pointer"
                  >
                    <Code2 className="w-4 h-4" />
                    JSON
                  </button>
                </div>
              </div>

              {/* Curriculum localization status — never let the learner assume
                  English fallback content is their target language. */}
              {!coverage.isFullyLocalized && (
                <div
                  id="curriculum-coverage-banner"
                  className={`rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center gap-3 ${
                    isAdaptingCurriculum
                      ? 'bg-accent-50 border-accent-200'
                      : 'bg-warning-soft border-amber-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isAdaptingCurriculum ? 'bg-accent-100 text-accent-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {isAdaptingCurriculum
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <AlertTriangle className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-semibold ${isAdaptingCurriculum ? 'text-accent-900' : 'text-amber-900'}`}>
                      {isAdaptingCurriculum
                        ? t('coverage.adapting_title', 'AI darslarni tilingizga moslashtirmoqda...')
                        : t('coverage.partial_title', "Ba'zi darslar hali tarjima qilinmagan")}
                    </h3>
                    <p className={`text-xs mt-0.5 leading-relaxed ${isAdaptingCurriculum ? 'text-accent-800' : 'text-amber-800'}`}>
                      {isAdaptingCurriculum
                        ? t('coverage.adapting_desc', "Yetishmayotgan darslar generatsiya qilinmoqda.")
                        : t('coverage.partial_desc', "Quyidagi darslar ingliz tilida ko'rsatilmoqda.")}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-surface border border-line text-[11px] font-semibold text-ink tabular-nums">
                        {coverage.covered.length}/{coverage.total} {t('coverage.localized', 'moslashtirilgan')}
                      </span>
                      <span className="text-[11px] text-ink-muted truncate">
                        {t('coverage.pending_sections', 'Kutilmoqda')}: #{coverage.missing.join(', #')}
                      </span>
                    </div>
                  </div>

                  {!isAdaptingCurriculum && (
                    <button
                      type="button"
                      id="retry-curriculum-adaptation-btn"
                      onClick={() => setAdaptationAttempt((n) => n + 1)}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors cursor-pointer flex-shrink-0"
                    >
                      <Languages className="w-3.5 h-3.5" />
                      {adaptationFailed
                        ? t('coverage.retry', 'Qayta urinish')
                        : t('coverage.adapt_now', 'AI bilan moslashtirish')}
                    </button>
                  )}
                </div>
              )}

              {/* Filters */}
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-ink-subtle absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('search.placeholder', "Ssenariylar bo'yicha qidiring...")}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface border border-line text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:border-accent-500 transition-colors"
                    />
                  </div>
                  <div className="w-full md:w-52">
                    <CustomDropdown
                      id="difficulty-filter-custom-dropdown"
                      options={difficultyOptions}
                      value={selectedDifficulty}
                      onChange={setSelectedDifficulty}
                      buttonClassName="bg-surface border-line text-ink"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                          isSelected
                            ? 'bg-accent-500 text-white'
                            : 'bg-surface border border-line text-ink-muted hover:text-ink hover:bg-surface-sunken'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredSections.map((sec) => (
                  <ScenarioCard
                    key={sec.section_id}
                    section={sec}
                    isCompleted={userProgress.completedSections.includes(sec.section_id)}
                    targetLanguage={userProfile.targetLanguage}
                    userProfile={userProfile}
                    onSelectScenario={handleOpenScenarioLab}
                    onPlayGame={handleOpenScenarioGame}
                    onViewJson={handleOpenScenarioJson}
                  />
                ))}
              </div>

              {filteredSections.length === 0 && (
                <div className="text-center py-16 bg-surface rounded-xl border border-line space-y-2.5">
                  <Search className="w-8 h-8 text-ink-subtle mx-auto" />
                  <h3 className="text-sm font-semibold text-ink">
                    {t('search.empty_title', 'Mos keluvchi ssenariy topilmadi')}
                  </h3>
                  <p className="text-xs text-ink-muted max-w-sm mx-auto">
                    {t('search.empty_desc', "Qidiruv so'zini o'zgartirib ko'ring yoki filtrlarni tozalang.")}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Barchasi');
                      setSelectedDifficulty('Barchasi');
                    }}
                    className="mt-1 px-3.5 py-2 rounded-lg border border-line text-ink text-xs font-medium hover:bg-surface-sunken transition-colors cursor-pointer"
                  >
                    {t('filter.clear', 'Filtrlarni tozalash')}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'games' && (
            <InteractiveGamesHub
              targetLanguage={userProfile.targetLanguage}
              userProfile={userProfile}
              activeSection={selectedSection}
              onSelectSectionForLab={handleOpenScenarioLab}
              onEarnXp={handleEarnXp}
            />
          )}

          {activeTab === 'lab' && (
            <InteractiveLessonLab
              section={selectedSection}
              targetLanguage={userProfile.targetLanguage}
              userProfile={userProfile}
              onBack={() => setActiveTab('scenarios')}
              onCompleteSection={handleCompleteSection}
              onViewJson={handleOpenScenarioJson}
              onOpenGames={handleOpenScenarioGame}
            />
          )}

          {activeTab === 'json_engine' && (
            <RawJsonEngineExplorer
              targetLanguage={userProfile.targetLanguage}
              userProfile={userProfile}
              initialSection={selectedSection}
              onTestSectionInLab={handleOpenScenarioLab}
            />
          )}

          {activeTab === 'stats' && (
            <UserProgressStats
              userProfile={userProfile}
              targetLanguage={userProfile.targetLanguage}
              xp={userProgress.xp}
              streak={userProgress.streak}
              completedSectionIds={userProgress.completedSections}
              onOpenProfileModal={() => setProfileModalOpen(true)}
              onSelectSection={(secId) => {
                const sec = activeSections.find((s) => s.section_id === secId);
                if (sec) handleOpenScenarioLab(sec);
              }}
            />
          )}
        </main>

        <footer className="border-t border-line py-5 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ink-subtle">
            <span className="font-semibold text-ink-muted">
              {t('footer.platform', 'TilTop')}
            </span>
            <span>{t('footer.desc', "Shaxsiylashtirilgan til ta'limi platformasi")}</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

/** Gates the dashboard behind authentication. */
function AuthGate() {
  const { user, token, isRestoring } = useAuth();

  if (isRestoring) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-muted">
        <Loader2 className="w-6 h-6 text-accent-500 animate-spin" />
      </div>
    );
  }

  if (!token || !user) {
    return <LoginPage />;
  }

  return <TilTopDashboard />;
}

export function App() {
  return (
    <AuthProvider>
      <I18nProvider>
        <AuthGate />
      </I18nProvider>
    </AuthProvider>
  );
}

export default App;
