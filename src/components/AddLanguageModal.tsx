import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Globe2, 
  ArrowRight, 
  Check, 
  Cpu, 
  Volume2, 
  Layers, 
  Compass, 
  Plus, 
  Loader2,
  Flag
} from 'lucide-react';
import { useI18n } from '../utils/i18n';
import { COUNTRY_LANGUAGES } from '../data/curriculum';
import { CountryLanguageOption } from '../types';

interface AddLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'site_ui' | 'target_country';
  onSetupCountryLanguage: (option: CountryLanguageOption) => void;
}

export const AddLanguageModal: React.FC<AddLanguageModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'site_ui',
  onSetupCountryLanguage,
}) => {
  const { t, translateAndAddUiLanguage, currentUiLang, availableUiLanguages, setUiLanguage, isTranslatingUi } = useI18n();
  const [activeTab, setActiveTab] = useState<'site_ui' | 'target_country'>(defaultTab);

  // Site UI Translation state
  const [customSiteLangInput, setCustomSiteLangInput] = useState('');
  const [uiSuccessMsg, setUiSuccessMsg] = useState<string | null>(null);
  const [uiErrorMsg, setUiErrorMsg] = useState<string | null>(null);

  // Learning Country / Language state
  const [countryQuery, setCountryQuery] = useState('');
  const [isSettingUpCountry, setIsSettingUpCountry] = useState(false);
  const [countrySuccessMsg, setCountrySuccessMsg] = useState<string | null>(null);
  const [countryErrorMsg, setCountryErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTranslateSiteUi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSiteLangInput.trim()) return;

    setUiErrorMsg(null);
    setUiSuccessMsg(null);

    try {
      const result = await translateAndAddUiLanguage(customSiteLangInput.trim());
      setUiSuccessMsg(`${result.languageName} — Sayt interfeysi Gemini AI (${result.engineUsed.toUpperCase()}) orqali to'liq tarjima qilindi!`);
      setCustomSiteLangInput('');
    } catch (err: any) {
      setUiErrorMsg(err.message || 'Tarjima jarayonida xatolik yuz berdi.');
    }
  };

  const handleSetupCountryLanguage = async (queryParam?: string) => {
    const queryToUse = queryParam || countryQuery;
    if (!queryToUse.trim()) return;

    setIsSettingUpCountry(true);
    setCountryErrorMsg(null);
    setCountrySuccessMsg(null);

    try {
      const response = await fetch('/api/setup-custom-language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryToUse.trim() }),
      });

      if (!response.ok) {
        throw new Error('Davlat tilini sozlashda xatolik yuz berdi');
      }

      const data = await response.json();
      const option: CountryLanguageOption = {
        code: data.code || 'custom',
        country: data.country || queryToUse,
        languageName: data.languageName || queryToUse,
        nativeName: data.nativeName || queryToUse,
        flag: data.flag || '🌐',
        popularPhrase: data.popularPhrase || 'Hello!',
        popularPhraseUz: data.popularPhraseUz || 'Salom!',
        voiceLang: data.voiceLang || 'en-US',
        azureVoiceName: data.azureVoiceName || 'en-US-JennyNeural',
        culturalGreetingTip: data.culturalGreetingTip,
        isAiGenerated: true,
      };

      onSetupCountryLanguage(option);
      setCountrySuccessMsg(`${option.country} (${option.languageName}) — Davlat tili ustuvor qilindi va darsliklar to'liq moslashtirildi!`);
      setCountryQuery('');
    } catch (err: any) {
      console.error(err);
      setCountryErrorMsg(err.message || 'Xatolik yuz berdi. Qayta urinib ko\'ring.');
    } finally {
      setIsSettingUpCountry(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="add-language-modal-container"
        className="w-full max-w-2xl bg-surface rounded-xl border border-line overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header Banner */}
        <div className="bg-accent-500 p-5 sm:p-6 text-white relative">
          <button 
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-surface/20 backdrop-blur-sm">
              <Globe2 className="w-5 h-5 text-white" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-surface/20 text-white text-[10px] font-bold tracking-wide backdrop-blur-sm uppercase">
                  TilTop AI Localization Hub
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/30 text-amber-100 text-[10px] font-bold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Gemini 3.7 Flash
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mt-0.5">
                {t('addlang.modal_title', "Yangi Til / Davlat Qo'shish")}
              </h2>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4 bg-black/20 p-1 rounded-lg backdrop-blur-xs">
            <button
              type="button"
              id="tab-site-ui-lang-btn"
              onClick={() => setActiveTab('site_ui')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'site_ui'
                  ? 'bg-surface text-ink '
                  : 'text-white/80 hover:text-white hover:bg-surface/10'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t('addlang.tab_site_ui', "Sayt Tili (AI Tarjima)")}</span>
            </button>

            <button
              type="button"
              id="tab-target-country-btn"
              onClick={() => setActiveTab('target_country')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'target_country'
                  ? 'bg-surface text-ink '
                  : 'text-white/80 hover:text-white hover:bg-surface/10'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{t('addlang.tab_learning', "O'rganish Davlati / Tili")}</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* ======================================================== */}
          {/* TAB 1: SAYT TILINI O'ZGARTIRISH (AI TARJIMA) */}
          {/* ======================================================== */}
          {activeTab === 'site_ui' && (
            <div className="space-y-4">
              <div className="bg-accent-50/70 border border-accent-200 rounded-lg p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-accent-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs text-accent-950">
                  <p className="font-bold">
                    Gemini 3.7 Flash AI avtomat sayt tarjimoni:
                  </p>
                  <p className="text-accent-800 mt-0.5 leading-relaxed">
                    {t('addlang.site_ai_desc', "Istalgan til nomini kiriting. Gemini AI butun platforma menyulari, tugmalari, sarlavhalari va dialoglarini shu tilga to'liq tarjima qiladi.")}
                  </p>
                </div>
              </div>

              {/* Form to translate */}
              <form onSubmit={handleTranslateSiteUi} className="space-y-3">
                <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider">
                  {t('addlang.input_site_label', "Sayt uchun yangi tilni kiriting:")}
                </label>
                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                  <input
                    type="text"
                    value={customSiteLangInput}
                    onChange={(e) => setCustomSiteLangInput(e.target.value)}
                    disabled={isTranslatingUi}
                    placeholder={t('addlang.input_site_placeholder', "Masalan: Fransuzcha, Ispan tili, Nemischa, Turkcha, Yaponcha...")}
                    className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-surface-muted border border-line rounded-lg text-ink focus:outline-none focus:border-accent-500 focus:bg-surface transition-all disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    id="submit-translate-ui-btn"
                    disabled={!customSiteLangInput.trim() || isTranslatingUi}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-accent-500 hover:opacity-95 text-white rounded-lg text-xs sm:text-sm font-bold transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap"
                  >
                    {isTranslatingUi ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t('addlang.translating_ui', 'Tarjima qilinmoqda...')}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>{t('addlang.btn_translate_ui', "AI Tarjima Qilish")}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Status alerts */}
              {uiSuccessMsg && (
                <div className="p-3.5 bg-accent-50 border border-accent-300 rounded-lg text-xs text-accent-900 flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-accent-600 flex-shrink-0" />
                  <span className="font-medium">{uiSuccessMsg}</span>
                </div>
              )}
              {uiErrorMsg && (
                <div className="p-3.5 bg-danger-soft border border-red-200 rounded-lg text-xs text-red-800 animate-in fade-in">
                  {uiErrorMsg}
                </div>
              )}

              {/* Existing / Available UI Languages Grid */}
              <div className="space-y-2 pt-2 border-t border-line">
                <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">
                  Mavjud Sayt Tillari (Bir marta bosish bilan o'rnatish):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableUiLanguages.map((lang) => {
                    const isSelected = currentUiLang.code === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setUiLanguage(lang.code);
                          setUiSuccessMsg(`Sayt tili "${lang.name}" ga almashtirildi!`);
                        }}
                        className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-accent-50 border-accent-400 text-accent-950 font-bold '
                            : 'bg-surface border-line hover:bg-surface-muted text-ink-muted'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Flag code={lang.flag} title={lang.name} className="w-6 h-auto" />
                          <div className="truncate">
                            <p className="text-xs font-bold truncate">{lang.name.split(' ')[0]}</p>
                            <p className="text-[10px] text-ink-subtle truncate">{lang.nativeName}</p>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-accent-600 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: O'RGANISH DAVLAT VA TILI (USTUVOR DARS LOCALIZATION) */}
          {/* ======================================================== */}
          {activeTab === 'target_country' && (
            <div className="space-y-4">
              <div className="bg-accent-50/70 border border-accent-200 rounded-lg p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-accent-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Compass className="w-4 h-4" />
                </div>
                <div className="text-xs text-accent-950">
                  <p className="font-bold">
                    Davlat Tili Ustuvorligi va Darsliklar Moslashuvi:
                  </p>
                  <p className="text-accent-800 mt-0.5 leading-relaxed">
                    {t('addlang.learn_ai_desc', "Qaysi davlat tanlansa, o'sha davlatning rasmiy tili ustuvor belgilanadi. Barcha 20 ta darslik, rolli o'yinlar, lug'at va Azure ovozlari o'sha davlat madaniyatiga moslanadi.")}
                  </p>
                </div>
              </div>

              {/* Search or Add any Custom Country */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider">
                  {t('addlang.input_learn_label', "Davlat yoki o'rganiladigan tilni kiriting:")}
                </label>
                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                  <input
                    type="text"
                    value={countryQuery}
                    onChange={(e) => setCountryQuery(e.target.value)}
                    disabled={isSettingUpCountry}
                    placeholder={t('addlang.input_learn_placeholder', "Masalan: Italiya, Ispaniya, Saudiya Arabistoni, Xitoy, Turkiya...")}
                    className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-surface-muted border border-line rounded-lg text-ink focus:outline-none focus:border-accent-500 focus:bg-surface transition-all disabled:opacity-50"
                  />
                  <button
                    type="button"
                    id="submit-setup-country-btn"
                    onClick={() => handleSetupCountryLanguage()}
                    disabled={!countryQuery.trim() || isSettingUpCountry}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-accent-500 hover:opacity-95 text-white rounded-lg text-xs sm:text-sm font-bold transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap"
                  >
                    {isSettingUpCountry ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t('addlang.setting_up_learn', 'AI sozlamoqda...')}</span>
                      </>
                    ) : (
                      <>
                        <Compass className="w-4 h-4" />
                        <span>{t('addlang.btn_setup_learn', "AI Bilan O'rnatish")}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Status alerts */}
              {countrySuccessMsg && (
                <div className="p-3.5 bg-accent-50 border border-accent-300 rounded-lg text-xs text-accent-900 flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-accent-600 flex-shrink-0" />
                  <span className="font-medium">{countrySuccessMsg}</span>
                </div>
              )}
              {countryErrorMsg && (
                <div className="p-3.5 bg-danger-soft border border-red-200 rounded-lg text-xs text-red-800 animate-in fade-in">
                  {countryErrorMsg}
                </div>
              )}

              {/* Quick Pick Popular Countries */}
              <div className="space-y-2 pt-2 border-t border-line">
                <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">
                  Mashhur Davlatlar (Bir marta bosish orqali ustuvor qilish):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                  {COUNTRY_LANGUAGES.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        onSetupCountryLanguage(item);
                        setCountrySuccessMsg(`${item.country} (${item.languageName}) — Davlat tili tanlandi va ustuvor qilindi!`);
                      }}
                      className="p-2.5 rounded-lg border border-line hover:border-accent-300 bg-surface hover:bg-accent-50/50 text-left flex items-center justify-between gap-2 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Flag code={item.flag} title={item.country} className="w-8 h-auto" />
                        <div>
                          <p className="text-xs font-bold text-ink group-hover:text-accent-700">
                            {item.country}
                          </p>
                          <p className="text-[11px] text-ink-muted font-medium">
                            {item.languageName}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-ink-subtle group-hover:text-accent-600 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-surface-muted border-t border-line flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-ink-subtle">
            <Cpu className="w-3.5 h-3.5 text-accent-500" />
            <span>Gemini 3.7 Flash & Microsoft Azure Neural TTS</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-ink text-xs font-bold transition-colors cursor-pointer"
          >
            {t('onboarding.close', 'Yopish')}
          </button>
        </div>

      </div>
    </div>
  );
};
