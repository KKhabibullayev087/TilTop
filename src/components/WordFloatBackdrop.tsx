import React, { useMemo } from 'react';
import { Flag } from './Flag';

/**
 * Decorative backdrop for the login/landing panel: vocabulary cards drifting
 * upward, each pairing a phrase with its Uzbek translation.
 *
 * Purely ornamental — hidden from assistive tech, and the whole thing freezes
 * under `prefers-reduced-motion` via the global rule in index.css.
 */

interface WordPair {
  phrase: string;
  translation: string;
  flag: string;
}

const WORDS: WordPair[] = [
  { flag: '🇬🇧', phrase: 'Nice to meet you', translation: 'Tanishganimdan xursandman' },
  { flag: '🇩🇪', phrase: 'Guten Morgen', translation: 'Xayrli tong' },
  { flag: '🇫🇷', phrase: 'Merci beaucoup', translation: 'Katta rahmat' },
  { flag: '🇯🇵', phrase: 'はじめまして', translation: 'Tanishganimdan xursandman' },
  { flag: '🇪🇸', phrase: '¿Cuánto cuesta?', translation: 'Qancha turadi?' },
  { flag: '🇰🇷', phrase: '감사합니다', translation: 'Rahmat' },
  { flag: '🇷🇺', phrase: 'Как дела?', translation: 'Ishlaringiz qanday?' },
  { flag: '🇹🇷', phrase: 'Hoş geldiniz', translation: 'Xush kelibsiz' },
  { flag: '🇨🇳', phrase: '你好', translation: 'Salom' },
  { flag: '🇮🇹', phrase: 'Quanto costa?', translation: 'Qancha turadi?' },
  { flag: '🇦🇪', phrase: 'شكرا جزيلا', translation: 'Katta rahmat' },
  { flag: '🇬🇧', phrase: 'Could you help me?', translation: 'Yordam bera olasizmi?' },
];

const LANES = 3;
const DURATION = 17;

export const WordFloatBackdrop: React.FC = () => {
  // Spread the cards across lanes and stagger their starts so the panel is
  // never empty and never bunched up.
  const cards = useMemo(
    () =>
      WORDS.map((word, i) => ({
        ...word,
        lane: i % LANES,
        delay: -(i * DURATION) / WORDS.length,
        drift: (i % 5) * 6 - 12,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Soft moving wash so the panel never reads as a flat block of colour */}
      <div className="absolute -inset-1/4 opacity-60 animate-drift">
        <div className="absolute left-[10%] top-[15%] w-[60%] h-[60%] rounded-full bg-accent-200/50 blur-3xl" />
        <div className="absolute right-[5%] bottom-[10%] w-[55%] h-[55%] rounded-full bg-accent-300/40 blur-3xl" />
      </div>

      {cards.map((card, i) => (
        <div
          key={`${card.phrase}-${i}`}
          className="absolute"
          style={{
            left: `${8 + card.lane * 30 + card.drift}%`,
            bottom: '-90px',
            animation: `tiltop-float-up ${DURATION}s linear ${card.delay}s infinite`,
          }}
        >
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-surface/80 backdrop-blur-sm border border-surface/60 shadow-sm max-w-[210px]">
            <Flag code={card.flag} className="w-5 h-auto" />
            <span className="min-w-0">
              <span className="block text-xs font-semibold text-ink truncate">{card.phrase}</span>
              <span className="block text-[11px] text-ink-muted truncate">{card.translation}</span>
            </span>
          </div>
        </div>
      ))}

      {/* Fade the cards out at the panel edges instead of clipping them hard */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-accent-50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-accent-50 to-transparent" />
    </div>
  );
};
