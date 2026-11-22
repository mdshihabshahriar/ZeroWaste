import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

// Loads data every time the screen is opened, and gives loading / error states
export function useData<T>(loader: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await loader());
    } catch (e: any) {
      setError(e?.message ?? 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }, deps);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return { data, loading, error, reload: load, setData };
}
