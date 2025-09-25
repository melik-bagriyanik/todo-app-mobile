import { View, Text } from 'react-native';

interface LoadingIndicatorProps {
  message?: string;
}

export const LoadingIndicator = ({ message = 'Loading...' }: LoadingIndicatorProps) => {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-lg text-gray-600">{message}</Text>
    </View>
  );
};
