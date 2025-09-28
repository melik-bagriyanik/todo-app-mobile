import { useCallback } from 'react';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';

export interface ErrorHandlerOptions {
  showToast?: boolean;
  showAlert?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
}

export function useErrorHandler() {
  const handleError = useCallback((
    error: Error | unknown,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      showAlert = false,
      logError = true,
      fallbackMessage = 'An unexpected error occurred'
    } = options;

    const errorMessage = error instanceof Error ? error.message : fallbackMessage;
    const errorDetails = error instanceof Error ? error : new Error(fallbackMessage);

    if (logError) {
      console.error('Error handled:', errorDetails);
    }

    if (showToast) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
        visibilityTime: 4000,
      });
    }

    if (showAlert) {
      Alert.alert(
        'Error',
        errorMessage,
        [{ text: 'OK', style: 'default' }]
      );
    }
  }, []);

  const handleAsyncError = useCallback(async (
    asyncFunction: () => Promise<any>,
    options: ErrorHandlerOptions = {}
  ) => {
    try {
      return await asyncFunction();
    } catch (error) {
      handleError(error, options);
      throw error;
    }
  }, [handleError]);

  const withErrorHandling = useCallback(<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    options: ErrorHandlerOptions = {}
  ) => {
    return async (...args: T): Promise<R | undefined> => {
      try {
        return await fn(...args);
      } catch (error) {
        handleError(error, options);
        return undefined;
      }
    };
  }, [handleError]);

  return {
    handleError,
    handleAsyncError,
    withErrorHandling,
  };
}
