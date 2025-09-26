import { View, Text, ActivityIndicator } from 'react-native';

interface LoadingIndicatorProps {
  message?: string;
}

export const LoadingIndicator = ({ message = 'Loading...' }: LoadingIndicatorProps) => {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#10b981" />
      <Text className="text-lg text-gray-600 mt-4">{message}</Text>
    </View>
  );
};
