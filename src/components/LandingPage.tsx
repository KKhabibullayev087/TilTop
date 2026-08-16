import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Gamepad2,
  Bot,
  Trophy,
  Volume2,
  Globe,
  Check,
} from 'lucide-react';
import { useI18n, INITIAL_UI_LANGUAGES } from '../utils/i18n';
import { COUNTRY_LANGUAGES, OFFICIAL_SECTIONS, PROFESSION_OPTIONS } from '../data/curriculum';
import { LanguagePicker } from './LanguagePicker';
import { WordFloatBackdrop } from './WordFloatBackdrop';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onSignIn }) => {
  const { t } = useI18n();

  const features = [
    {
      icon: BookOpen,
      title: t('landing.f1_title', '20 ta hayotiy ssenariy'),
      desc: t('landing.f1_desc', 'Bozordagi savdolashuvdan IT intervyugacha — real vaziyatlar.'),
    },
    {
      icon: Bot,
      title: t('landing.f2_title', 'AI bilan jonli dialog'),
      desc: t('landing.f2_desc', 'Sun\'iy intellekt suhbatdosh bilan mashq qiling va izoh oling.'),
    },
    {
      icon: Gamepad2,
      title: t('landing.f3_title', 'Interaktiv o\'yinlar'),
      desc: t('landing.f3_desc', 'So\'z mosligi, talaffuz mashqi va gap tuzish boshqotirmalari.'),
    },
    {
      icon: Volume2,
      title: t('landing.f4_title', 'Tabiiy talaffuz'),
      desc: t('landing.f4_desc', 'Azure neural ovozlar bilan to\'g\'ri talaffuzni eshiting.'),
    },
    {
      icon: Globe,
      title: t('landing.f5_title', 'Har qanday til va davlat'),
      desc: t('landing.f5_desc', 'Tanlagan davlatingiz tiliga darslar avtomatik moslashadi.'),
    },
    {
      icon: Trophy,
      title: t('landing.f6_title', 'Taraqqiyot va yutuqlar'),
      desc: t('landing.f6_desc', 'XP, kunlik seriya va shaxsiy statistika bilan izchil o\'rganing.'),
    },
  ];

  const steps = [
    { n: '1', title: t('landing.s1_title', 'Kasbingizni tanlang'), desc: t('landing.s1_desc', 'Darslar sizning sohangizga moslashadi.') },
    { n: '2', title: t('landing.s2_title', 'Tilni tanlang'), desc: t('landing.s2_desc', 'Istalgan davlat tilini tanlang.') },
    { n: '3', title: t('landing.s3_title', 'Mashq qilishni boshlang'), desc: t('landing.s3_desc', 'AI bilan suhbatlashing va XP to\'plang.') },
  ];

  return (
    <div className="min-h-screen bg-surface">

      {/* ── Header ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 h-16 bg-surface/85 backdrop-blur-md border-b border-line">
        <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-500 flex items-center justify-center text-white font-bold text-sm">
              T
            </div>
            <span className="text-base font-bold text-ink tracking-tight">
              Til<span className="text-accent-600">Top</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <LanguagePicker align="right" />
            <button
              type="button"
              onClick={onSignIn}
              className="hidden sm:block px-3.5 py-2 rounded-lg text-sm font-medium text-ink-muted hover:text-ink hover:bg-surface-sunken transition-colors cursor-pointer press"
            >
              {t('auth.tab_login', 'Kirish')}
            </button>
            <button
              type="button"
              id="landing-get-started-top"
              onClick={onGetStarted}
              className="px-3.5 py-2 rounded-lg bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold transition-colors cursor-pointer press"
            >
              {t('landing.cta_start', 'Boshlash')}
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-line bg-accent-50">
        <WordFloatBackdrop />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-accent-200 text-xs font-semibold text-accent-700 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
            {t('landing.badge', 'AI asosidagi til platformasi')}
          </span>

          <h1
            className="mt-5 text-3xl sm:text-5xl font-bold text-ink tracking-tight leading-[1.1] max-w-3xl mx-auto animate-rise"
            style={{ animationDelay: '0.05s' }}
          >
            {t('landing.hero_title', "Tilni darslikdan emas — hayotdan o'rganing")}
          </h1>

          <p
            className="mt-5 text-base sm:text-lg text-ink-muted max-w-2xl mx-auto leading-relaxed animate-rise"
            style={{ animationDelay: '0.12s' }}
          >
            {t('landing.hero_subtitle', "20 ta real vaziyat, AI suhbatdosh va tabiiy talaffuz. Har bir dars sizning kasbingiz va tanlagan davlatingiz tiliga moslashadi.")}
          </p>

          <div
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 animate-rise"
            style={{ animationDelay: '0.19s' }}
          >
            <button
              type="button"
              id="landing-get-started-hero"
              onClick={onGetStarted}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold transition-colors cursor-pointer press"
            >
              {t('landing.cta_free', 'Bepul boshlash')}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onSignIn}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-surface border border-line hover:bg-surface-sunken text-ink text-sm font-medium transition-colors cursor-pointer press"
            >
              {t('landing.cta_have_account', 'Hisobim bor')}
            </button>
          </div>

          <div
            className="mt-10 flex flex-wrap items-center justify-center gap-1.5 animate-fade-in"
            style={{ animationDelay: '0.26s' }}
          >
            {COUNTRY_LANGUAGES.slice(0, 10).map((c) => (
              <span
                key={c.code}
                title={`${c.country} — ${c.languageName}`}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-line text-[11px] font-medium text-ink-muted lift"
              >
                <span className="text-sm leading-none">{c.flag}</span>
                {c.nativeName}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="border-b border-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-6 stagger">
          {[
            { value: String(OFFICIAL_SECTIONS.length), label: t('landing.stat_scenarios', 'Hayotiy ssenariy') },
            { value: `${COUNTRY_LANGUAGES.length}+`, label: t('landing.stat_langs', 'Til va davlat') },
            { value: String(PROFESSION_OPTIONS.length), label: t('landing.stat_prof', 'Kasbiy yo\'nalish') },
            { value: '4', label: t('landing.stat_games', 'Interaktiv o\'yin') },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-ink tabular-nums">{s.value}</p>
              <p className="text-xs text-ink-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            {t('landing.features_title', 'Nima uchun TilTop?')}
          </h2>
          <p className="mt-3 text-sm text-ink-muted leading-relaxed">
            {t('landing.features_subtitle', "Yodlash emas — ishlatish. Har bir dars siz duch keladigan haqiqiy vaziyatdan boshlanadi.")}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="p-5 rounded-xl border border-line bg-surface lift hover:border-accent-300"
              >
                <span className="w-10 h-10 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-ink">{f.title}</h3>
                <p className="mt-1.5 text-sm text-ink-muted leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="border-y border-line bg-surface-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight text-center">
            {t('landing.how_title', 'Uch qadamda boshlanadi')}
          </h2>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 stagger">
            {steps.map((s) => (
              <div key={s.n} className="text-center px-4">
                <span className="w-11 h-11 mx-auto rounded-full bg-accent-500 text-white flex items-center justify-center text-base font-bold">
                  {s.n}
                </span>
                <h3 className="mt-4 text-base font-semibold text-ink">{s.title}</h3>
                <p className="mt-1.5 text-sm text-ink-muted leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Scenario preview ─────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
          {t('landing.scenarios_title', 'Sizni nima kutmoqda')}
        </h2>
        <p className="mt-3 text-sm text-ink-muted max-w-2xl leading-relaxed">
          {t('landing.scenarios_subtitle', "Har bir ssenariyda lug'at, AI bilan dialog va mini test bor.")}
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 stagger">
          {OFFICIAL_SECTIONS.slice(0, 9).map((sec) => (
            <div
              key={sec.section_id}
              className="flex items-start gap-3 p-4 rounded-xl border border-line bg-surface lift hover:border-accent-300"
            >
              <span className="w-7 h-7 rounded-lg bg-accent-50 text-accent-700 flex items-center justify-center text-xs font-semibold tabular-nums flex-shrink-0">
                {sec.section_id}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-ink truncate">{sec.title}</span>
                <span className="block text-xs text-ink-subtle truncate">{sec.category}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section className="border-t border-line bg-accent-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            {t('landing.final_title', 'Bugun birinchi darsni boshlang')}
          </h2>
          <p className="mt-3 text-sm text-ink-muted leading-relaxed">
            {t('landing.final_subtitle', "Ro'yxatdan o'tish bepul. Bir necha daqiqada birinchi suhbatingizni o'tkazasiz.")}
          </p>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {[
              t('landing.perk_free', 'Bepul boshlanadi'),
              t('landing.perk_nocard', 'Karta talab qilinmaydi'),
              t('landing.perk_instant', 'Darhol foydalanish'),
            ].map((perk) => (
              <li key={perk} className="flex items-center gap-1.5 text-xs text-ink-muted">
                <Check className="w-3.5 h-3.5 text-accent-600" />
                {perk}
              </li>
            ))}
          </ul>

          <button
            type="button"
            id="landing-get-started-final"
            onClick={onGetStarted}
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold transition-colors cursor-pointer press"
          >
            {t('landing.cta_free', 'Bepul boshlash')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-subtle">
          <span className="font-semibold text-ink-muted">TilTop</span>
          <span>{t('footer.desc', "Shaxsiylashtirilgan til ta'limi platformasi")}</span>
          <div className="flex items-center gap-1">
            {INITIAL_UI_LANGUAGES.slice(0, 6).map((l) => (
              <span key={l.code} title={l.name} className="text-sm leading-none">
                {l.flag}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};
