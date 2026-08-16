import React, { useState } from 'react';
import { ChevronDown, Plus, Check, Search, Menu, Languages } from 'lucide-react';
import { UserProfile } from '../types';
import { COUNTRY_LANGUAGES } from '../data/curriculum';
import { useI18n } from '../utils/i18n';
import { LanguagePicker } from './LanguagePicker';
import { Flag } from './Flag';

interface HeaderProps {
  targetLanguage: string;
  onSelectCountryLanguage: (codeOrName: string, flag?: string, customName?: string) => void;
  userProfile: UserProfile;
  onOpenAddLanguageModal: (defaultTab?: 'site_ui' | 'target_country') => void;
  onOpenMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  targetLanguage,
  onSelectCountryLanguage,
  userProfile,
  onOpenAddLanguageModal,
  onOpenMobileNav,
}) => {
  const { t } = useI18n();

  const [targetOpen, setTargetOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState('');

  const matchedCountry = COUNTRY_LANGUAGES.find(
    (c) =>
      c.code.toLowerCase() === targetLanguage.toLowerCase() ||
      c.languageName.toLowerCase().includes(targetLanguage.toLowerCase())
  );

  const activeFlag = userProfile.countryFlag || matchedCountry?.flag || '🌐';
  const activeLangName =
    userProfile.targetLanguageName || matchedCountry?.languageName || targetLanguage;

  const filteredCountries = COUNTRY_LANGUAGES.filter((item) => {
    const q = countryQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.country.toLowerCase().includes(q) ||
      item.languageName.toLowerCase().includes(q) ||
      item.nativeName.toLowerCase().includes(q)
    );
  });

  const closeAll = () => {
    setTargetOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-surface/90 backdrop-blur-sm border-b border-line flex-shrink-0">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-3">

        {/* Mobile nav trigger */}
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label={t('sidebar.open', 'Menyuni ochish')}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-sunken transition-colors cursor-pointer flex-shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1" />

        {/* Language controls */}
        <div className="flex items-center gap-2">

          {/* Site UI language — shared picker so every surface behaves alike */}
          <LanguagePicker align="right" />

          <button
            type="button"
            id="header-add-ui-lang-btn"
            onClick={() => onOpenAddLanguageModal('site_ui')}
            title={t('header.add_lang', "Til qo'shish")}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-line text-ink-muted hover:text-ink hover:bg-surface-sunken transition-colors cursor-pointer press"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Target learning language */}
          <div className="relative">
            <button
              id="header-country-language-btn"
              type="button"
              onClick={() => {
                setTargetOpen((v) => !v);
              }}
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-accent-200 bg-accent-50 hover:bg-accent-100 text-sm transition-colors cursor-pointer"
            >
              <span className="text-base leading-none">{activeFlag}</span>
              <span className="hidden md:block text-left min-w-0">
                <span className="block text-[10px] font-medium text-accent-600 leading-none">
                  {t('header.learning_lang', "O'rganish")}
                </span>
                <span className="block text-xs font-semibold text-ink truncate max-w-[100px]">
                  {activeLangName.split(' ')[0]}
                </span>
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-accent-600" />
            </button>

            {targetOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={closeAll} />
                <div className="absolute right-0 mt-2 w-80 bg-surface rounded-xl border border-line shadow-lg p-2 z-50 animate-fade-up">
                  <div className="px-2 py-1.5 mb-1">
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
                      <Languages className="w-3 h-3" />
                      {t('header.learning_lang', "O'rganilayotgan Til")}
                    </span>
                    <p className="text-[11px] text-ink-subtle mt-0.5 leading-relaxed">
                      {t('header.target_hint', 'Tanlangan davlat tiliga barcha darslar moslashtiriladi.')}
                    </p>
                  </div>

                  <button
                    type="button"
                    id="header-add-target-country-btn"
                    onClick={() => {
                      closeAll();
                      onOpenAddLanguageModal('target_country');
                    }}
                    className="w-full mb-1.5 flex items-center justify-center gap-2 py-2 rounded-lg bg-accent-500 hover:bg-accent-600 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {t('header.add_country', "Davlat qo'shish")}
                  </button>

                  <div className="relative mb-1.5">
                    <Search className="w-3.5 h-3.5 text-ink-subtle absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={countryQuery}
                      onChange={(e) => setCountryQuery(e.target.value)}
                      placeholder={t('header.search_country', 'Davlat yoki til...')}
                      className="w-full pl-8 pr-3 py-2 text-xs bg-surface-muted border border-line rounded-lg text-ink placeholder:text-ink-subtle focus:outline-none focus:border-accent-500 transition-colors"
                    />
                  </div>

                  <div className="max-h-64 overflow-y-auto thin-scroll space-y-0.5">
                    {filteredCountries.map((item) => {
                      const isSelected =
                        targetLanguage.toLowerCase() === item.code.toLowerCase() ||
                        targetLanguage.toLowerCase() === item.languageName.toLowerCase();
                      return (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => {
                            onSelectCountryLanguage(item.code, item.flag, item.languageName);
                            closeAll();
                          }}
                          className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                            isSelected ? 'bg-accent-50' : 'hover:bg-surface-sunken'
                          }`}
                        >
                          <Flag code={item.flag} title={item.country} className="w-7 h-auto" />
                          <span className="min-w-0 flex-1">
                            <span className={`block text-xs font-medium truncate ${isSelected ? 'text-accent-700' : 'text-ink'}`}>
                              {item.country}
                            </span>
                            <span className="block text-[11px] text-ink-subtle truncate">
                              {item.languageName} · {item.nativeName}
                            </span>
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-accent-600 flex-shrink-0" />}
                        </button>
                      );
                    })}

                    {filteredCountries.length === 0 && (
                      <p className="px-2 py-6 text-center text-xs text-ink-subtle">
                        {t('search.empty_title', 'Topilmadi')}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
