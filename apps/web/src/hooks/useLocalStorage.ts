import { useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const set = (valueOrUpdater: T | ((prev: T) => T)) => {
    const next =
      typeof valueOrUpdater === 'function'
        ? (valueOrUpdater as (prev: T) => T)(value)
        : valueOrUpdater;
    setValue(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {}
  };

  return [value, set] as const;
}
