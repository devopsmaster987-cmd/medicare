export const THEME_KEY = 'medicareclear-theme';
export const TEXT_SIZE_KEY = 'medicareclear-text-size';

export const THEMES = ['light', 'dark'] as const;
export const TEXT_SIZES = ['a', 'a-plus', 'a-plus-plus'] as const;

export type Theme = (typeof THEMES)[number];
export type TextSize = (typeof TEXT_SIZES)[number];

export const DEFAULT_THEME: Theme = 'light';
export const DEFAULT_TEXT_SIZE: TextSize = 'a';

export type PreferenceStorage = Pick<Storage, 'getItem' | 'setItem'>;

export function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && (THEMES as readonly string[]).includes(value);
}

export function isTextSize(value: unknown): value is TextSize {
  return typeof value === 'string' && (TEXT_SIZES as readonly string[]).includes(value);
}

function resolveStorage(storage?: PreferenceStorage | null): PreferenceStorage | null {
  if (storage !== undefined) return storage;
  if (typeof window === 'undefined') return null;
  return window.localStorage;
}

export function readTheme(storage?: PreferenceStorage | null): Theme {
  try {
    const value = resolveStorage(storage)?.getItem(THEME_KEY);
    return isTheme(value) ? value : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function readTextSize(storage?: PreferenceStorage | null): TextSize {
  try {
    const value = resolveStorage(storage)?.getItem(TEXT_SIZE_KEY);
    return isTextSize(value) ? value : DEFAULT_TEXT_SIZE;
  } catch {
    return DEFAULT_TEXT_SIZE;
  }
}

export function saveTheme(theme: Theme, storage?: PreferenceStorage | null): void {
  try {
    resolveStorage(storage)?.setItem(THEME_KEY, theme);
  } catch {
    return;
  }
}

export function saveTextSize(size: TextSize, storage?: PreferenceStorage | null): void {
  try {
    resolveStorage(storage)?.setItem(TEXT_SIZE_KEY, size);
  } catch {
    return;
  }
}

export function getThemeFromDocument(): Theme {
  if (typeof document === 'undefined') return DEFAULT_THEME;
  const value = document.documentElement.dataset.theme;
  return isTheme(value) ? value : DEFAULT_THEME;
}

export function getTextSizeFromDocument(): TextSize {
  if (typeof document === 'undefined') return DEFAULT_TEXT_SIZE;
  const value = document.documentElement.dataset.textSize;
  return isTextSize(value) ? value : DEFAULT_TEXT_SIZE;
}

export function getPrefsInitScript(): string {
  return (
    '(function(){var d=document.documentElement;' +
    'try{var t=localStorage.getItem(' +
    JSON.stringify(THEME_KEY) +
    ');' +
    'if(' +
    JSON.stringify(THEMES) +
    '.indexOf(t)>-1){d.dataset.theme=t;}' +
    'var s=localStorage.getItem(' +
    JSON.stringify(TEXT_SIZE_KEY) +
    ');' +
    'if(' +
    JSON.stringify(TEXT_SIZES) +
    '.indexOf(s)>-1){d.dataset.textSize=s;}' +
    '}catch(e){}' +
    "d.classList.add('no-transition');" +
    'var clear=function(){d.classList.remove("no-transition");};' +
    'if(typeof requestAnimationFrame==="function"){requestAnimationFrame(clear);}else{setTimeout(clear,0);}' +
    '})();'
  );
}
