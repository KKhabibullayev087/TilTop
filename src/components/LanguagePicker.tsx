import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Globe } from 'lucide-react';
import { useI18n } from '../utils/i18n';

interface LanguagePickerProps {
  /** Which side the popover hangs from. */
  align?: 'left' | 'right';
  /** Hide the language name, leaving just the flag — for tight headers. */
  compact?: boolean;
  className?: string;
}

/**
 * Single source of truth for switching the site UI language.
 * Every language entry shows its flag, native name, and Uzbek label so the
 * list stays readable no matter which language is currently active.
 */
export const LanguagePicker: React.FC<LanguagePickerProps> = ({
  align = 'right',
  compact = false,
  className = '',
}) => {
  const { t, currentUiLang, availableUiLanguages, setUiLanguage } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        id="language-picker-btn"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('header.site_lang', 'Sayt Tili')}
        className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-line hover:bg-surface-sunken text-sm transition-colors cursor-pointer press"
      >
        <span className="text-base leading-none">{currentUiLang.flag}</span>
        {!compact && (
          <span className="hidden sm:block text-xs font-medium text-ink max-w-[90px] truncate">
            {currentUiLang.nativeName}
          </span>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 text-ink-subtle transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-2 w-64 bg-surface rounded-xl border border-line shadow-lg p-2 z-50 animate-scale-in origin-top`}
        >
          <div className="flex items-center justify-between px-2 py-1.5 mb-1">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
              <Globe className="w-3 h-3" />
              {t('header.site_lang', 'Sayt Tili')}
            </span>
            <span className="text-[11px] text-ink-subtle tabular-nums">
              {availableUiLanguages.length}
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto thin-scroll space-y-0.5">
            {availableUiLanguages.map((lang) => {
              const isSelected = currentUiLang.code === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    setUiLanguage(lang.code);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                    isSelected ? 'bg-accent-50' : 'hover:bg-surface-sunken'
                  }`}
                >
                  <span className="text-lg leading-none flex-shrink-0">{lang.flag}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`block text-xs font-medium truncate ${
                          isSelected ? 'text-accent-700' : 'text-ink'
                        }`}
                      >
                        {lang.nativeName}
                      </span>
                      {lang.isAiGenerated && (
                        <span className="px-1 rounded bg-surface-sunken text-ink-muted text-[9px] font-semibold flex-shrink-0">
                          AI
                        </span>
                      )}
                    </span>
                    <span className="block text-[11px] text-ink-subtle truncate">{lang.name}</span>
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-accent-600 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
