import React, { useState } from 'react';
import { Loader2, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../utils/auth';
import { useI18n } from '../utils/i18n';
import { INITIAL_UI_LANGUAGES } from '../utils/i18n';

type Mode = 'login' | 'register';

export const LoginPage: React.FC = () => {
  const { login, register, isSubmitting } = useAuth();
  const { t, currentUiLang, setUiLanguage } = useI18n();

  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isRegister = mode === 'register';
  const passwordLongEnough = password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err?.message || t('auth.generic_error', 'Xatolik yuz berdi. Qayta urinib ko\'ring.'));
    }
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setPassword('');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-surface">

      {/* Brand panel — hidden on small screens so the form owns the viewport */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 bg-accent-50 border-r border-line flex-col justify-between p-12">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-accent-500 flex items-center justify-center text-white font-bold text-lg">
            T
          </div>
          <span className="text-xl font-bold text-ink tracking-tight">
            Til<span className="text-accent-600">Top</span>
          </span>
        </div>

        <div className="max-w-md space-y-5">
          <h1 className="text-3xl xl:text-4xl font-bold text-ink leading-tight tracking-tight">
            {t('auth.hero_title', "20 ta hayotiy ssenariy orqali til o'rganing")}
          </h1>
          <p className="text-sm text-ink-muted leading-relaxed">
            {t('auth.hero_subtitle', "Har bir dars sizning kasbingiz va tanlangan davlat tilingizga moslashtiriladi. AI suhbatdosh bilan real muloqot qiling.")}
          </p>

          <ul className="space-y-2.5 pt-2">
            {[
              t('auth.feature_scenarios', '20 ta interaktiv hayotiy ssenariy'),
              t('auth.feature_ai', 'AI bilan jonli rol o\'yinlari'),
              t('auth.feature_langs', '12 dan ortiq til va davlat'),
              t('auth.feature_progress', 'XP, seriya va shaxsiy statistika'),
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-ink-muted">
                <span className="w-4 h-4 rounded-full bg-accent-500 flex items-center justify-center flex-shrink-0">
                  <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {INITIAL_UI_LANGUAGES.slice(0, 8).map((lang) => (
            <span
              key={lang.code}
              title={lang.name}
              className="w-8 h-8 rounded-lg bg-surface border border-line flex items-center justify-center text-base"
            >
              {lang.flag}
            </span>
          ))}
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col">

        {/* Compact language switcher so the login page itself is translatable */}
        <div className="flex items-center justify-between p-5 sm:p-6">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-accent-500 flex items-center justify-center text-white font-bold text-sm">
              T
            </div>
            <span className="text-base font-bold text-ink">
              Til<span className="text-accent-600">Top</span>
            </span>
          </div>
          <div className="ml-auto flex items-center gap-1 overflow-x-auto no-scrollbar">
            {INITIAL_UI_LANGUAGES.slice(0, 5).map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setUiLanguage(lang.code)}
                title={lang.name}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  currentUiLang.code === lang.code
                    ? 'bg-accent-50 text-accent-700 border border-accent-200'
                    : 'text-ink-muted hover:bg-surface-sunken border border-transparent'
                }`}
              >
                <span className="text-sm">{lang.flag}</span>
                <span className="hidden sm:inline">{lang.nativeName}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-5 pb-10">
          <div className="w-full max-w-sm space-y-6">

            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold text-ink tracking-tight">
                {isRegister
                  ? t('auth.register_title', 'Hisob yarating')
                  : t('auth.login_title', 'Xush kelibsiz')}
              </h2>
              <p className="text-sm text-ink-muted">
                {isRegister
                  ? t('auth.register_subtitle', "Bepul hisob oching va darslarni boshlang.")
                  : t('auth.login_subtitle', 'Davom etish uchun hisobingizga kiring.')}
              </p>
            </div>

            {/* Mode switch */}
            <div className="flex p-1 bg-surface-sunken rounded-xl">
              {(['login', 'register'] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchMode(m)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                    mode === m ? 'bg-surface text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {m === 'login'
                    ? t('auth.tab_login', 'Kirish')
                    : t('auth.tab_register', "Ro'yxatdan o'tish")}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {isRegister && (
                <div className="space-y-1.5">
                  <label htmlFor="auth-name" className="block text-xs font-semibold text-ink">
                    {t('auth.name_label', 'Ismingiz')}
                  </label>
                  <input
                    id="auth-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('auth.name_placeholder', 'Masalan: Bekzod')}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-line text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:border-accent-500 transition-colors"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="auth-email" className="block text-xs font-semibold text-ink">
                  {t('auth.email_label', 'Email')}
                </label>
                <input
                  id="auth-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-line text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:border-accent-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="auth-password" className="block text-xs font-semibold text-ink">
                  {t('auth.password_label', 'Parol')}
                </label>
                <div className="relative">
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete={isRegister ? 'new-password' : 'current-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-surface border border-line text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:border-accent-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Parolni yashirish' : "Parolni ko'rsatish"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink-muted transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {isRegister && password.length > 0 && (
                  <p className={`text-[11px] ${passwordLongEnough ? 'text-positive' : 'text-ink-muted'}`}>
                    {passwordLongEnough
                      ? t('auth.password_ok', 'Parol uzunligi yetarli')
                      : t('auth.password_hint', 'Kamida 8 ta belgi')}
                  </p>
                )}
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 p-3 rounded-xl bg-danger-soft border border-red-200 text-sm text-red-800"
                >
                  <AlertCircle className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent-500 hover:bg-accent-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>
                  {isRegister
                    ? t('auth.register_button', 'Hisob yaratish')
                    : t('auth.login_button', 'Kirish')}
                </span>
              </button>
            </form>

            <p className="text-center text-xs text-ink-subtle">
              {isRegister
                ? t('auth.have_account', 'Hisobingiz bormi?')
                : t('auth.no_account', 'Hisobingiz yo\'qmi?')}{' '}
              <button
                type="button"
                onClick={() => switchMode(isRegister ? 'login' : 'register')}
                className="text-accent-600 hover:text-accent-700 font-semibold cursor-pointer"
              >
                {isRegister
                  ? t('auth.tab_login', 'Kirish')
                  : t('auth.tab_register', "Ro'yxatdan o'tish")}
              </button>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};
