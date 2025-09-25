import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Task } from '@/types';

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
  isDeleting?: boolean;
}

export const TaskItem = ({ task, onToggle, onDelete, isDeleting = false }: TaskItemProps) => {
  return (
    <View className={`p-4 mb-3 rounded-lg border ${
      task.is_completed 
        ? 'bg-green-50 border-green-200' 
        : 'bg-white border-gray-200'
    } ${isDeleting ? 'opacity-75' : ''}`}>
      <TouchableOpacity
        onPress={() => !isDeleting && onToggle(task)}
        onLongPress={() => !isDeleting && onDelete(task)}
        className="flex-row items-center"
        disabled={isDeleting}
      >
        <View className={`w-6 h-6 rounded-full border-2 mr-3 ${
          task.is_completed 
            ? 'bg-green-500 border-green-500' 
            : 'border-gray-300'
        }`}>
          {task.is_completed && (
            <Text className="text-white text-center text-sm">✓</Text>
          )}
        </View>
        <View className="flex-1">
          <Text className={`text-lg font-medium ${
            task.is_completed ? 'line-through text-gray-500' : 'text-gray-800'
          }`}>
            {task.name}
          </Text>
          {task.description && (
            <Text className="text-sm text-gray-600 mt-1">{task.description}</Text>
          )}
          <View className="flex-row items-center mt-2">
            <Text className={`text-xs px-2 py-1 rounded-full ${
              task.priority === 'high' 
                ? 'bg-red-100 text-red-800'
                : task.priority === 'medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {task.priority}
            </Text>
            {task.due_date && (
              <Text className="text-xs text-gray-500 ml-2">
                Due: {new Date(task.due_date).toLocaleDateString()}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
