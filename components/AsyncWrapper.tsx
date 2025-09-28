import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AsyncWrapperProps {
  loading: boolean;
  error: Error | null;
  onRetry?: () => void;
  loadingMessage?: string;
  errorMessage?: string;
  children: React.ReactNode;
  showRefreshButton?: boolean;
}

export const AsyncWrapper: React.FC<AsyncWrapperProps> = ({
  loading,
  error,
  onRetry,
  loadingMessage = 'Loading...',
  errorMessage = 'Something went wrong',
  children,
  showRefreshButton = true,
}) => {
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="text-lg text-gray-600 mt-4">{loadingMessage}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <View className="items-center mb-6">
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        </View>
        
        <Text className="text-xl font-bold text-gray-800 text-center mb-2">
          Oops!
        </Text>
        
        <Text className="text-sm text-gray-600 text-center mb-6">
          {errorMessage}
        </Text>

        {__DEV__ && (
          <View className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <Text className="text-xs text-red-800 font-mono">
              {error.message}
            </Text>
          </View>
        )}

        {showRefreshButton && onRetry && (
          <TouchableOpacity
            onPress={onRetry}
            className="bg-blue-500 p-3 rounded-lg"
          >
            <Text className="text-white font-semibold text-center">
              Try Again
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return <>{children}</>;
};
