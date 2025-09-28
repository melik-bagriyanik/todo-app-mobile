import React from 'react';
import { Text } from 'react-native';
import { Priority } from '@/types';

interface TaskPriorityBadgeProps {
  priority: Priority;
  className?: string;
}

export const TaskPriorityBadge: React.FC<TaskPriorityBadgeProps> = ({
  priority,
  className = '',
}) => {
  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500 text-white shadow-sm';
      case 'medium':
        return 'bg-yellow-500 text-white shadow-sm';
      case 'low':
        return 'bg-green-500 text-white shadow-sm';
      default:
        return 'bg-gray-500 text-white shadow-sm';
    }
  };

  return (
    <Text className={`text-xs px-2 py-1 rounded-full ${getPriorityStyles(priority)} ${className}`}>
      {priority}
    </Text>
  );
};
