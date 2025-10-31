/**
 * useApi Hook
 * React hook for making API calls with loading and error states
 */

import { useState, useEffect, useCallback } from 'react';
import type { ApiError } from '../types/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

interface UseApiOptions {
  immediate?: boolean; // Execute immediately on mount
}

/**
 * Hook for handling API calls with loading and error states
 */
export function useApi<T>(
  apiFunction: () => Promise<T>,
  options: UseApiOptions = {}
) {
  const { immediate = true } = options;
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });

    try {
      const result = await apiFunction();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (err) {
      const error = err as ApiError;
      setState({ data: null, loading: false, error });
      throw error;
    }
  }, [apiFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    ...state,
    execute,
    refetch: execute,
  };
}

/**
 * Hook for handling API mutations (POST, PUT, DELETE)
 */
export function useApiMutation<TData = any, TVariables = any>(
  apiFunction: (variables: TVariables) => Promise<TData>
) {
  const [state, setState] = useState<UseApiState<TData>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(
    async (variables: TVariables) => {
      setState({ data: null, loading: true, error: null });

      try {
        const result = await apiFunction(variables);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (err) {
        const error = err as ApiError;
        setState({ data: null, loading: false, error });
        throw error;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
}
