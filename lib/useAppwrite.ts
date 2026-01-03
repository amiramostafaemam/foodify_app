import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

interface UseAppwriteOptions<T, P extends Record<string, string | number>> {
  fn: (params: P) => Promise<T>;
  params?: P;
  skip?: boolean;
}

interface UseAppwriteReturn<T, P> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (newParams?: P) => Promise<void>;
}

const useAppwrite = <T, P extends Record<string, string | number>>({
  fn,
  params = {} as P,
  skip = false,
}: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (fetchParams: P) => {
      console.log("[useAppwrite] fetchData called with params:", fetchParams);
      setLoading(true);
      setError(null);

      try {
        const result = await fn({ ...fetchParams });
        console.log("[useAppwrite] fetchData result:", result);
        console.log(
          "[useAppwrite] fetchData result length:",
          Array.isArray(result) ? result.length : "not an array"
        );
        setData(result);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        console.error("[useAppwrite] fetchData error:", errorMessage);
        console.error("[useAppwrite] fetchData full error:", err);
        setError(errorMessage);
        Alert.alert("Error", errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fn]
  );

  useEffect(() => {
    if (!skip) {
      fetchData(params);
    }
  }, []);

  const refetch = async (newParams?: P) => {
    // Use new params if provided, otherwise use original params
    const paramsToUse = newParams || params;
    console.log("[useAppwrite] refetch called");
    console.log("[useAppwrite] refetch with params:", paramsToUse);
    console.log("[useAppwrite] refetch newParams provided:", !!newParams);
    await fetchData(paramsToUse);
  };

  return { data, loading, error, refetch };
};

export default useAppwrite;
