import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  ArrowRight, 
  GraduationCap, 
  Code2, 
  Plane, 
  Briefcase, 
  Stethoscope, 
  Megaphone, 
  Layers,
  Zap,
  Globe2,
  ShieldCheck,
  X
} from 'lucide-react';
import { 
  UserProfile, 
  UserProfession, 
  ProficiencyLevel 
} from '../types';
import { 
  COUNTRY_LANGUAGES, 
  PROFESSION_OPTIONS, 
  PROFICIENCY_OPTIONS 
} from '../data/curriculum';
import { useI18n } from '../utils/i18n';

interface OnboardingProfileModalProps {
  isOpen: boolean;
  targetLanguage: string;
  initialProfile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
  onClose?: () => void;
}

export const OnboardingProfileModal: React.FC<OnboardingProfileModalProps> = ({
  isOpen,
  targetLanguage,
  initialProfile,
  onSaveProfile,
  onClose,
}) => {
  const { t } = useI18n();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedProfession, setSelectedProfession] = useState<UserProfession>(
    initialProfile.profession || 'it_specialist'
  );
  const [selectedLevel, setSelectedLevel] = useState<ProficiencyLevel>(
    initialProfile.level || 'intermediate'
  );

  if (!isOpen) return null;

  const matchedCountry = COUNTRY_LANGUAGES.find(
    (c) => c.code.toLowerCase() === targetLanguage.toLowerCase() ||
           c.languageName.toLowerCase().includes(targetLanguage.toLowerCase())
  );

  const flag = initialProfile.countryFlag || matchedCountry?.flag || '🌐';
  const languageName = initialProfile.targetLanguageName || matchedCountry?.languageName || targetLanguage;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap': return GraduationCap;
      case 'Code2': return Code2;
      case 'Plane': return Plane;
      case 'Briefcase': return Briefcase;
      case 'Stethoscope': return Stethoscope;
      case 'Megaphone': return Megaphone;
      default: return Sparkles;
    }
  };

  const handleFinish = () => {
    onSaveProfile({
      targetLanguage,
      targetLanguageName: languageName,
      countryFlag: flag,
      profession: selectedProfession,
      level: selectedLevel,
      onboardingCompleted: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="onboarding-profile-card"
        className="w-full max-w-2xl bg-surface rounded-xl border border-line overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Top Header Banner */}
        <div className="bg-accent-500 p-6 text-white relative">
          {onClose && (
            <button 
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center justify-between pr-10">
            <div className="flex items-center gap-3">
              <span className="text-3xl filter drop-">{flag}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-surface/20 text-white text-[11px] font-bold tracking-wide backdrop-blur-sm uppercase">
                    TilTop Profil Sozlamalari
                  </span>
                  <span className="text-accent-100 text-xs font-semibold">Qadam {step}/2</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mt-0.5">
                  {languageName}
                </h2>
              </div>
            </div>

            {/* Progress Dots */}
            <div className="flex items-center gap-1.5 bg-black/10 px-3 py-1.5 rounded-full">
              <span className={`w-2.5 h-2.5 rounded-full transition-all ${step === 1 ? 'bg-surface scale-110 ring-2 ring-white/50' : 'bg-surface/40'}`} />
              <span className={`w-2.5 h-2.5 rounded-full transition-all ${step === 2 ? 'bg-surface scale-110 ring-2 ring-white/50' : 'bg-surface/40'}`} />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-accent-50 mt-2 leading-relaxed">
            Multi-LLM o'qituvchi barcha 20 ta ssenariy, so'zlar to'plami va mini-o'yinlarni aynan sizning kasbingiz va darajangizga moslashtiradi.
          </p>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* STEP 1: PROFESSION / ROLE SELECTION */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="border-b border-line pb-3">
                <span className="text-xs font-bold text-accent-600 uppercase tracking-wider">
                  Savol 1 (Majburiy)
                </span>
                <h3 className="text-lg font-bold text-ink mt-0.5">
                  Sizning asosiy kasbingiz yoki maqsadingiz nima?
                </h3>
                <p className="text-xs text-ink-muted">
                  Darslardagi texnik terminlar, rol o'yinlari va dialoglar shu rolingizga qarab o'zgaradi.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROFESSION_OPTIONS.map((prof) => {
                  const IconComponent = getIcon(prof.icon);
                  const isSelected = selectedProfession === prof.id;

                  return (
                    <button
                      key={prof.id}
                      type="button"
                      onClick={() => setSelectedProfession(prof.id)}
                      className={`relative text-left p-4 rounded-lg border-2 transition-all flex flex-col justify-between gap-2 group cursor-pointer ${
                        isSelected 
                          ? 'border-accent-500 bg-accent-50/50  ring-2 ring-accent-400/20' 
                          : 'border-line bg-surface hover:border-line hover:bg-surface-muted'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${prof.colorClass} transition-transform`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-accent-500 border-accent-500 text-white' : 'border-line-strong bg-surface'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-ink group-hover:text-accent-700 transition-colors">
                          {prof.titleUz}
                        </h4>
                        <p className="text-xs text-ink-muted mt-1 leading-snug">
                          {prof.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: PROFICIENCY LEVEL SELECTION */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="border-b border-line pb-3">
                <span className="text-xs font-bold text-accent-600 uppercase tracking-wider">
                  Savol 2 (Majburiy)
                </span>
                <h3 className="text-lg font-bold text-ink mt-0.5">
                  Hozirgi til bilish darajangiz qanday?
                </h3>
                <p className="text-xs text-ink-muted">
                  AI javoblar tezligi, gaplar murakkabligi va o'yin qiyinligi ushbu darajaga moslashadi.
                </p>
              </div>

              <div className="space-y-3">
                {PROFICIENCY_OPTIONS.map((lvl) => {
                  const isSelected = selectedLevel === lvl.id;

                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setSelectedLevel(lvl.id)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-center justify-between gap-4 cursor-pointer ${
                        isSelected 
                          ? 'border-accent-500 bg-accent-50/50  ring-2 ring-accent-400/20' 
                          : 'border-line bg-surface hover:border-line hover:bg-surface-muted'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className={`px-3 py-1.5 rounded-xl font-bold font-mono text-xs border ${lvl.colorClass} `}>
                          {lvl.levelCode}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-ink">
                            {lvl.titleUz}
                          </h4>
                          <p className="text-xs text-ink-muted mt-0.5">
                            {lvl.description}
                          </p>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-accent-600 border-accent-600 text-white' : 'border-line-strong bg-surface'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Personalization Summary Box */}
              <div className="bg-surface-muted border border-line rounded-lg p-4 flex items-start gap-3 text-xs text-ink-muted">
                <ShieldCheck className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-ink">
                    Siz uchun shaxsiylashtirilgan o'quv dasturi faollashtiriladi:
                  </p>
                  <p className="mt-1 text-ink-muted">
                    {t('games.lang_label', 'Til')}: <span className="font-bold text-ink">{languageName}</span> • {t('hero.selected_role', 'Kasb')}: <span className="font-bold text-accent-700">{PROFESSION_OPTIONS.find(p => p.id === selectedProfession)?.titleUz}</span> • Daraja: <span className="font-bold text-accent-700">{PROFICIENCY_OPTIONS.find(l => l.id === selectedLevel)?.levelCode}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-surface-muted border-t border-line flex items-center justify-between">
          {step === 1 ? (
            <div>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-ink-muted hover:text-ink-muted cursor-pointer"
                >
                  Yopish
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 text-xs font-bold text-ink-muted hover:text-ink hover:bg-line rounded-xl transition-colors cursor-pointer"
            >
              Orqaga
            </button>
          )}

          {step === 1 ? (
            <button
              type="button"
              id="onboarding-next-step-btn"
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-600 hover:bg-accent-500 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <span>{t('onboarding.next', 'Keyingi Qadam')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              id="onboarding-save-profile-btn"
              onClick={handleFinish}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent-500 hover:opacity-95 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('onboarding.finish', 'Darslarni Boshlash')}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
