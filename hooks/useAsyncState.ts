import { useState, useCallback } from 'react';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  isSuccess: boolean;
  isError: boolean;
}

export interface AsyncActions {
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
  setData: (data: any) => void;
  setError: (error: Error | null) => void;
  setLoading: (loading: boolean) => void;
}

export function useAsyncState<T = any>(
  initialState: T | null = null
): [AsyncState<T>, AsyncActions] {
  const [state, setState] = useState<AsyncState<T>>({
    data: initialState,
    loading: false,
    error: null,
    isSuccess: false,
    isError: false,
  });

  const execute = useCallback(async (asyncFunction: (...args: any[]) => Promise<T>, ...args: any[]) => {
    setState(prev => ({ ...prev, loading: true, error: null, isError: false }));
    
    try {
      const result = await asyncFunction(...args);
      setState({
        data: result,
        loading: false,
        error: null,
        isSuccess: true,
        isError: false,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error as Error,
        isSuccess: false,
        isError: true,
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: initialState,
      loading: false,
      error: null,
      isSuccess: false,
      isError: false,
    });
  }, [initialState]);

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data, isSuccess: true, isError: false }));
  }, []);

  const setError = useCallback((error: Error | null) => {
    setState(prev => ({ ...prev, error, isError: !!error, isSuccess: !error }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  return [state, { execute, reset, setData, setError, setLoading }];
}
