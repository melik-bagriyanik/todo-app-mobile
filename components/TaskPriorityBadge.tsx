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
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Text className={`text-xs px-2 py-1 rounded-full ${getPriorityStyles(priority)} ${className}`}>
      {priority}
    </Text>
  );
};
