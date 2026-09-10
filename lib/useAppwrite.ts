import { useCallback, useEffect, useRef, useState } from "react";

type Params = Record<string, string | number | undefined>;

interface UseAppwriteOptions<T, P extends Params> {
  fn: (params: P) => Promise<T>;
  params?: P;
  skip?: boolean;
  /** Called with a human-readable message whenever a fetch fails. */
  onError?: (message: string) => void;
}

interface UseAppwriteReturn<T, P extends Params> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (newParams?: P) => Promise<void>;
}

/**
 * Runs `fn` on mount and again whenever `params` change, exposing the usual
 * data / loading / error triple plus a stable `refetch`. `fn` and `onError` may
 * be inline closures — they are read through refs so they never restart a fetch.
 */
export default function useAppwrite<T, P extends Params>({
  fn,
  params = {} as P,
  skip = false,
  onError,
}: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);

  const fnRef = useRef(fn);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    fnRef.current = fn;
    onErrorRef.current = onError;
  });

  // Serialised params so the effect re-runs by value, not by reference.
  const paramsKey = JSON.stringify(params ?? {});

  const fetchData = useCallback(async (fetchParams: P) => {
    setLoading(true);
    setError(null);
    try {
      setData(await fnRef.current(fetchParams));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      onErrorRef.current?.(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (skip) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard async data-fetch
    fetchData(JSON.parse(paramsKey) as P);
  }, [skip, paramsKey, fetchData]);

  const refetch = useCallback(
    (newParams?: P) => fetchData(newParams ?? (JSON.parse(paramsKey) as P)),
    [fetchData, paramsKey],
  );

  return { data, loading, error, refetch };
}
