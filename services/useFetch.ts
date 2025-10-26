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

import { useEffect, useState } from "react";

export const useFetch = <T>(
  fetchFunction: () => Promise<T>,
  deps: any[] = [], // ✅ dependencies array for refetching
  autoFetch = true
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
    } catch (error) {
      setError(error instanceof Error ? error : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
    // ✅ now it listens to dependencies
  }, deps);

  return { data, loading, error, refetch: fetchData, reset };
};
