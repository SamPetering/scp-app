import { useSyncExternalStore } from 'react';

const subscribers = new Set<() => void>();

function getSnapshot() {
  return document.documentElement.classList.contains('dark');
}

function setDark(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark);
  localStorage.theme = dark ? 'dark' : 'light';
  subscribers.forEach((cb) => cb());
}

function subscribe(callback: () => void) {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

// Initialize from localStorage / system preference
const prefersDark =
  !('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches;
setDark(localStorage.theme === 'dark' || prefersDark);

export function useTheme() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, () => false);
  return { dark, toggle: () => setDark(!dark) };
}
