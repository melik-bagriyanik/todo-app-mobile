/**
 * TaskPriorityBadge - Visual indicator for task priority levels
 * Features: Color-coded priority display, consistent styling
 */
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
  /**
   * Returns the appropriate styles for priority level
   */
  const getPriorityStyles = (priority: string): string => {
    const priorityStyles = {
      high: 'bg-red-500 text-white shadow-sm',
      medium: 'bg-yellow-500 text-white shadow-sm',
      low: 'bg-green-500 text-white shadow-sm',
    };
    return priorityStyles[priority as keyof typeof priorityStyles] || 'bg-gray-500 text-white shadow-sm';
  };

  return (
    <Text className={`text-xs px-2 py-1 rounded-full ${getPriorityStyles(priority)} ${className}`}>
      {priority}
    </Text>
  );
};
