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
  const statusOptions = ['all', 'pending', 'in_progress', 'completed'];
  const priorityOptions: (Priority | 'all')[] = ['all', 'low', 'medium', 'high'];

  const getPriorityColor = (priority: string, isSelected: boolean) => {
    if (isSelected) {
      switch (priority) {
        case 'high': return 'bg-red-500 border-red-500';
        case 'medium': return 'bg-yellow-500 border-yellow-500';
        case 'low': return 'bg-green-500 border-green-500';
        default: return 'bg-gray-500 border-gray-500';
      }
    }
    return 'bg-white border-gray-300';
  };

  const getTextColor = (priority: string, isSelected: boolean) => {
    if (isSelected) return 'text-white';
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-700';
    }
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
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
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
