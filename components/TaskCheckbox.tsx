import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

interface TaskCheckboxProps {
  isCompleted: boolean;
  isProcessing?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const TaskCheckbox: React.FC<TaskCheckboxProps> = ({
  isCompleted,
  isProcessing = false,
  size = 'medium',
  className = '',
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'w-5 h-5';
      case 'large':
        return 'w-8 h-8';
      default:
        return 'w-6 h-6';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 'text-xs';
      case 'large':
        return 'text-lg';
      default:
        return 'text-sm';
    }
  };

  return (
    <View className={`${getSizeStyles()} rounded-full border-2 mr-3 ${
      isCompleted 
        ? 'bg-green-500 border-green-500' 
        : 'border-gray-300'
    } ${className}`}>
      {isProcessing ? (
        <ActivityIndicator size="small" color="#10b981" />
      ) : isCompleted ? (
        <Text className={`text-white text-center ${getTextSize()}`}>✓</Text>
      ) : null}
    </View>
  );
};
