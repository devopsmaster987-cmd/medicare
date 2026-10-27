import { describe, expect, it } from 'vitest';
import {
  DEFAULT_TEXT_SIZE,
  DEFAULT_THEME,
  getPrefsInitScript,
  isTextSize,
  isTheme,
  readTextSize,
  readTheme,
  saveTextSize,
  saveTheme,
  TEXT_SIZE_KEY,
  THEME_KEY,
  type PreferenceStorage,
} from '@/lib/prefs';

function storageWith(values: Record<string, string>): PreferenceStorage {
  return {
    getItem: (key) => values[key] ?? null,
    setItem: (key, value) => {
      values[key] = value;
    },
  };
}

function throwingStorage(): PreferenceStorage {
  return {
    getItem: () => {
      throw new Error('storage blocked');
    },
    setItem: () => {
      throw new Error('storage blocked');
    },
  };
}

describe('prefs', () => {
  it('falls back to defaults for invalid stored values', () => {
    const storage = storageWith({
      [THEME_KEY]: 'purple',
      [TEXT_SIZE_KEY]: 'gigantic',
    });

    expect(readTheme(storage)).toBe(DEFAULT_THEME);
    expect(readTextSize(storage)).toBe(DEFAULT_TEXT_SIZE);
  });

  it('falls back to defaults when storage throws', () => {
    const storage = throwingStorage();

    expect(readTheme(storage)).toBe(DEFAULT_THEME);
    expect(readTextSize(storage)).toBe(DEFAULT_TEXT_SIZE);
  });

  it('falls back to defaults when storage is unavailable', () => {
    expect(readTheme(null)).toBe(DEFAULT_THEME);
    expect(readTextSize(null)).toBe(DEFAULT_TEXT_SIZE);
    expect(readTheme()).toBe(DEFAULT_THEME);
    expect(readTextSize()).toBe(DEFAULT_TEXT_SIZE);
  });

  it('returns valid stored values', () => {
    expect(readTheme(storageWith({ [THEME_KEY]: 'dark' }))).toBe('dark');
    expect(readTextSize(storageWith({ [TEXT_SIZE_KEY]: 'a-plus' }))).toBe('a-plus');
    expect(readTextSize(storageWith({ [TEXT_SIZE_KEY]: 'a-plus-plus' }))).toBe('a-plus-plus');
  });

  it('accepts only the known theme and text-size values', () => {
    expect(isTheme('light')).toBe(true);
    expect(isTheme('dark')).toBe(true);
    expect(isTheme('hc')).toBe(false);
    expect(isTheme('contrast')).toBe(false);
    expect(isTheme(null)).toBe(false);

    expect(isTextSize('a')).toBe(true);
    expect(isTextSize('a-plus')).toBe(true);
    expect(isTextSize('a-plus-plus')).toBe(true);
    expect(isTextSize('large')).toBe(false);
    expect(isTextSize(undefined)).toBe(false);
  });

  it('saves choices and never throws when storage is blocked', () => {
    const values: Record<string, string> = {};
    const storage = storageWith(values);

    saveTheme('dark', storage);
    saveTextSize('a-plus-plus', storage);

    expect(values[THEME_KEY]).toBe('dark');
    expect(values[TEXT_SIZE_KEY]).toBe('a-plus-plus');
    expect(() => saveTheme('dark', throwingStorage())).not.toThrow();
    expect(() => saveTextSize('a', throwingStorage())).not.toThrow();
  });

  it('builds a small, dependency-free inline script from the shared values', () => {
    const script = getPrefsInitScript();

    expect(script.length).toBeLessThan(1024);
    expect(script).toContain(THEME_KEY);
    expect(script).toContain(TEXT_SIZE_KEY);
    expect(script).toContain('"dark"');
    expect(script).toContain('"a-plus-plus"');
    expect(script).toContain('no-transition');
  });
});
