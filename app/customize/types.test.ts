import { describe, it, expect } from 'vitest';
import { THEME_KEYS, TIMEZONES, LANGUAGES } from './types';
import { themes } from '../../lib/svg/themes';
import { supportedLanguages } from '@/lib/i18n/badgeLabels';

describe('Theme Keys Synchronization', () => {
  it('THEME_KEYS should exactly match the themes object keys plus "auto" and "random"', () => {
    // 1. Create the exact array of what should exist
    const expectedKeys = ['auto', ...Object.keys(themes), 'random'];

    // 2. Sort both arrays alphabetically so the test doesn't fail just because of order
    const sortedExpected = expectedKeys.sort();
    const sortedActual = [...THEME_KEYS].sort();

    // 3. Assert they are 100% identical (no missing keys, no extra obsolete keys)
    expect(sortedActual).toEqual(sortedExpected);
  });
});

describe('Timezone options', () => {
  it('uses UTC as the default timezone option', () => {
    expect(TIMEZONES[0]).toEqual({ value: 'UTC', label: 'UTC (Default)' });
  });

  it('contains unique IANA timezone values', () => {
    const values = TIMEZONES.map((tz) => tz.value);
    expect(new Set(values).size).toBe(values.length);
  });
});

describe('[Bug fix] customize LANGUAGES parity with badgeLabels.ts', () => {
  it('offers every language that lib/i18n/badgeLabels.ts supports', () => {
    const customizeValues = LANGUAGES.map((l) => l.value).sort();
    const badgeLabelValues = [...supportedLanguages].sort();
    expect(customizeValues).toEqual(badgeLabelValues);
  });

  it('includes zh (Chinese) and ta (Tamil)', () => {
    const values = LANGUAGES.map((l) => l.value);
    expect(values).toContain('zh');
    expect(values).toContain('ta');
  });

  it('every entry has a non-empty label', () => {
    for (const lang of LANGUAGES) {
      expect(lang.label.trim().length).toBeGreaterThan(0);
    }
  });
});
