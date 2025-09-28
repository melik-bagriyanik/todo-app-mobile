import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ErrorRecoveryProps {
  error: Error;
  onRetry: () => void;
  onReset?: () => void;
  title?: string;
  message?: string;
}

export const ErrorRecovery: React.FC<ErrorRecoveryProps> = ({
  error,
  onRetry,
  onReset,
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
}) => {
  return (
    <View className="flex-1 justify-center items-center p-6 bg-gray-50">
      <View className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <View className="items-center mb-6">
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        </View>
        
        <Text className="text-xl font-bold text-gray-800 text-center mb-2">
          {title}
        </Text>
        
        <Text className="text-sm text-gray-600 text-center mb-6">
          {message}
        </Text>

        {__DEV__ && error && (
          <View className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <Text className="text-xs text-red-800 font-mono">
              {error.message}
            </Text>
          </View>
        )}

        <View className="space-y-3">
          <TouchableOpacity
            onPress={onRetry}
            className="bg-blue-500 p-3 rounded-lg"
          >
            <Text className="text-white font-semibold text-center">
              Try Again
            </Text>
          </TouchableOpacity>

          {onReset && (
            <TouchableOpacity
              onPress={onReset}
              className="bg-gray-500 p-3 rounded-lg"
            >
              <Text className="text-white font-semibold text-center">
                Reset
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};
