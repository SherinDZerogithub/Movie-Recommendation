//more efficient approach to data fetching in your application. using fetchMovies function from services/api.ts
//instead of repeating the same fetching logic in multiple components we use a custom hook that encapsulates this logic.
//  This hook will handle data fetching, loading states, and error handling in a reusable way.


//this hook will accept the fetchFunction as a parameter
//which is responsible for fetching the data from the API
//and any parameters that need to be passed to that function
//this is like fetchMovies or fethcMovieDetails from services/api.ts
//define its type generically so that it can work with any type of data
//it returns a promise that resolves to type T
//T maakes the hook flexible and reusable for different data types

// hooks/useFetch.ts
import { useCallback, useEffect, useRef, useState } from "react";

interface UseFetchReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  reset: () => void;
}

export const useFetch = <T>(
  fetchFunction: () => Promise<T>,
  deps: any[] = [],
  autoFetch = true
): UseFetchReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      if (isMounted.current) {
        setData(result);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [fetchFunction]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    isMounted.current = true;
    
    if (autoFetch) {
      fetchData();
    }

    return () => {
      isMounted.current = false;
    };
  }, deps);

  return { data, loading, error, refetch: fetchData, reset };
};