import { useEffect, useState } from "react";

/**
 * Persist a small piece of state (e.g. filter preferences) in localStorage.
 * Survives language changes, navigation and reloads.
 */
export function useLocalStorageState<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return initial;
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota / disabled storage — ignore */
    }
  }, [key, value]);

  return [value, setValue];
}