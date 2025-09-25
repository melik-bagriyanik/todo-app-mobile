import { View, Text } from 'react-native';
import { Button } from './Button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-lg text-red-600 mb-4">{message}</Text>
      {onRetry && <Button title="Retry" onPress={onRetry} />}
    </View>
  );
};
