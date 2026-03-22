import { useEffect, useState } from 'react';
import { idbGet, idbSet } from '@/lib/indexedDb';

export function usePersistentPreference<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let canceled = false;
    (async () => {
      const cached = await idbGet<T>(key);
      if (!canceled) {
        if (cached !== null) {
          setValue(cached);
        }
        setHydrated(true);
      }
    })();
    return () => {
      canceled = true;
    };
  }, [key]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    void idbSet(key, value);
  }, [hydrated, key, value]);

  return { value, setValue, hydrated };
}
