/**
 * TaskFilter - Filter component for tasks by status and priority
 * Features: Status filtering, priority filtering, visual indicators
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Priority } from '@/types';

interface TaskFilterProps {
  statusFilter: string;
  priorityFilter: string;
  onStatusFilter: (status: string) => void;
  onPriorityFilter: (priority: string) => void;
}

export const TaskFilter: React.FC<TaskFilterProps> = ({
  statusFilter,
  priorityFilter,
  onStatusFilter,
  onPriorityFilter,
}) => {
  //  CONSTANTS 
  
  const statusOptions = ['all', 'pending', 'in_progress', 'completed'];
  const priorityOptions: (Priority | 'all')[] = ['all', 'low', 'medium', 'high'];

  //  HELPER FUNCTIONS 
  
  /**
   * Returns the appropriate color classes for priority filter buttons
   */
  const getPriorityColor = (priority: string, isSelected: boolean): string => {
    if (isSelected) {
      const selectedColors = {
        high: 'bg-red-500 border-red-500',
        medium: 'bg-yellow-500 border-yellow-500',
        low: 'bg-green-500 border-green-500',
      };
      return selectedColors[priority as keyof typeof selectedColors] || 'bg-gray-500 border-gray-500';
    }
    return 'bg-white border-gray-300';
  };

  /**
   * Returns the appropriate text color for priority filter buttons
   */
  const getTextColor = (priority: string, isSelected: boolean): string => {
    if (isSelected) return 'text-white';
    
    const textColors = {
      high: 'text-red-600',
      medium: 'text-yellow-600',
      low: 'text-green-600',
    };
    return textColors[priority as keyof typeof textColors] || 'text-gray-700';
  };

  return (
    <View className="mb-4">
      {/* Status Filter */}
      <Text className="text-sm font-medium text-gray-700 mb-2">Filter by Status:</Text>
      <View className="flex-row flex-wrap mb-3">
        {statusOptions.map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => onStatusFilter(status)}
            className={`px-3 py-2 rounded-full mr-2 mb-2 border ${
              statusFilter === status 
                ? 'bg-green-500 border-green-500' 
                : 'bg-white border-gray-300'
            }`}
          >
            <Text className={`text-sm font-medium ${
              statusFilter === status ? 'text-white' : 'text-gray-700'
            }`}>
              {status === 'all' ? 'All' : 
               status === 'in_progress' ? 'In Progress' :
               status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Priority Filter */}
      <Text className="text-sm font-medium text-gray-700 mb-2">Filter by Priority:</Text>
      <View className="flex-row flex-wrap mb-3">
        {priorityOptions.map((priority) => (
          <TouchableOpacity
            key={priority}
            onPress={() => onPriorityFilter(priority)}
            className={`px-3 py-2 rounded-full mr-2 mb-2 border ${getPriorityColor(priority, priorityFilter === priority)}`}
          >
            <Text className={`text-sm font-medium ${getTextColor(priority, priorityFilter === priority)}`}>
              {priority === 'all' ? 'All' : priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
