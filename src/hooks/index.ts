import { useEffect, useState, useCallback } from 'react';

export const useTimer = (initialSeconds: number, onTimeUp?: () => void) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning || seconds <= 0) return;

    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onTimeUp, seconds]);

  return { seconds: Math.max(0, seconds), isRunning };
};

export const useAutoSave = (callback: () => Promise<void>, interval: number) => {
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  const startAutoSave = useCallback(() => {
    let timeoutId: NodeJS.Timeout;

    const performAutoSave = async () => {
      setIsAutoSaving(true);
      try {
        await callback();
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setIsAutoSaving(false);
        timeoutId = setTimeout(performAutoSave, interval);
      }
    };

    timeoutId = setTimeout(performAutoSave, interval);

    return () => clearTimeout(timeoutId);
  }, [callback, interval]);

  const stopAutoSave = useCallback(() => {
    // The cleanup is handled by the return function in startAutoSave
  }, []);

  return { isAutoSaving, startAutoSave, stopAutoSave };
};

export const useBeforeUnload = (enabled: boolean, message: string) => {
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [enabled, message]);
};

export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Failed to write to localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
};
