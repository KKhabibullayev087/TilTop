import React from 'react';
import { Globe } from 'lucide-react';

/*
  Why the `string/` entry point and not `react/`:
  every component under `react/3x2/` re-exports from a single barrel module, so
  importing one country drags the whole set in (~130 kB). Under `string/3x2/`
  each country is its own module exporting the raw SVG markup, so only the flags
  imported here are bundled — about 15 kB for all of them.
*/
import US from 'country-flag-icons/string/3x2/US';
import GB from 'country-flag-icons/string/3x2/GB';
import RU from 'country-flag-icons/string/3x2/RU';
import KR from 'country-flag-icons/string/3x2/KR';
import UZ from 'country-flag-icons/string/3x2/UZ';
import JP from 'country-flag-icons/string/3x2/JP';
import ES from 'country-flag-icons/string/3x2/ES';
import DE from 'country-flag-icons/string/3x2/DE';
import FR from 'country-flag-icons/string/3x2/FR';
import TR from 'country-flag-icons/string/3x2/TR';
import AE from 'country-flag-icons/string/3x2/AE';
import SA from 'country-flag-icons/string/3x2/SA';
import IT from 'country-flag-icons/string/3x2/IT';
import CN from 'country-flag-icons/string/3x2/CN';
import IN from 'country-flag-icons/string/3x2/IN';
import BR from 'country-flag-icons/string/3x2/BR';
import PT from 'country-flag-icons/string/3x2/PT';
import PL from 'country-flag-icons/string/3x2/PL';
import NL from 'country-flag-icons/string/3x2/NL';
import SE from 'country-flag-icons/string/3x2/SE';
import KZ from 'country-flag-icons/string/3x2/KZ';
import UA from 'country-flag-icons/string/3x2/UA';

const SVGS: Record<string, string> = {
  US, GB, RU, KR, UZ, JP, ES, DE, FR, TR, AE, SA, IT, CN, IN, BR, PT, PL, NL, SE, KZ, UA,
};

// Encode once at module load rather than on every render.
const FLAG_SRC: Record<string, string> = Object.fromEntries(
  Object.entries(SVGS).map(([iso, svg]) => [
    iso,
    `data:image/svg+xml,${encodeURIComponent(svg)}`,
  ])
);

/** Language codes whose flag is not simply the uppercased code. */
const LANG_TO_COUNTRY: Record<string, string> = {
  en: 'US',
  ja: 'JP',
  ko: 'KR',
  zh: 'CN',
  ar: 'AE',
  uk: 'UA',
  el: 'GR',
  da: 'DK',
  he: 'IL',
  hi: 'IN',
  fa: 'IR',
  vi: 'VN',
  sv: 'SE',
  nb: 'NO',
  no: 'NO',
  cs: 'CZ',
};

/**
 * Flag emoji are two regional-indicator code points that spell the ISO country
 * code, so emoji already stored in the curriculum data can be decoded instead
 * of migrated. Returns e.g. "US" for 🇺🇸.
 */
function isoFromEmoji(value: string): string | null {
  const indicators = [...value]
    .map((c) => c.codePointAt(0) ?? 0)
    .filter((c) => c >= 0x1f1e6 && c <= 0x1f1ff);

  if (indicators.length !== 2) return null;
  return indicators.map((c) => String.fromCharCode(c - 0x1f1e6 + 65)).join('');
}

function resolveIso(input?: string): string | null {
  if (!input) return null;
  const raw = input.trim();

  const fromEmoji = isoFromEmoji(raw);
  if (fromEmoji) return fromEmoji;

  const base = raw.toLowerCase().split(/[-_]/)[0];
  if (LANG_TO_COUNTRY[base]) return LANG_TO_COUNTRY[base];
  if (/^[a-z]{2}$/.test(base)) return base.toUpperCase();
  return null;
}

interface FlagProps {
  /** A flag emoji (🇺🇸), a language code (en, ja), or an ISO country code (US). */
  code?: string;
  /** Accessible label. Without one the flag is treated as decorative. */
  title?: string;
  className?: string;
}

/**
 * Renders a real SVG flag.
 *
 * Windows ships no glyphs for regional-indicator flag emoji — 🇺🇸 appears there
 * as a bare "US" letter box — so emoji cannot be relied on to show a flag.
 * Falls back to a globe for codes with no bundled flag (AI-added languages).
 */
export const Flag: React.FC<FlagProps> = ({ code, title, className = 'w-5 h-auto' }) => {
  const iso = resolveIso(code);
  const src = iso ? FLAG_SRC[iso] : undefined;

  if (!src) {
    return <Globe className={`${className} text-ink-subtle shrink-0`} aria-label={title} />;
  }

  return (
    <img
      src={src}
      alt={title ?? ''}
      aria-hidden={title ? undefined : true}
      draggable={false}
      className={`${className} rounded-[2px] shrink-0 object-cover select-none`}
    />
  );
};
