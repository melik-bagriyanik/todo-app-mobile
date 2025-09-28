import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Task, Priority } from '@/types';
import { TaskCheckbox } from './TaskCheckbox';
import { TaskPriorityBadge } from './TaskPriorityBadge';
import { useHapticFeedback } from '@/utils/haptics';

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
  isDeleting?: boolean;
  isProcessing?: boolean;
}

export const TaskItem = ({ task, onToggle, onDelete, isDeleting = false, isProcessing = false }: TaskItemProps) => {
  const haptics = useHapticFeedback();

  const handleToggle = () => {
    if (!isDeleting && !isProcessing) {
      haptics.onToggle();
      onToggle(task);
    }
  };

  const handleDelete = () => {
    if (!isDeleting) {
      haptics.onDelete();
      onDelete(task);
    }
  };

  return (
    <View className={`p-4 mb-3 rounded-lg border ${
      task.is_completed 
        ? 'bg-green-50 border-green-200' 
        : 'bg-white border-gray-200'
    } ${isDeleting ? 'opacity-75' : ''} ${isProcessing ? 'opacity-70' : ''}`}>
      <TouchableOpacity
        onPress={handleToggle}
        onLongPress={handleDelete}
        className="flex-row items-center"
        disabled={isDeleting || isProcessing}
        activeOpacity={0.7}
      >
        <TaskCheckbox
          isCompleted={task.is_completed}
          isProcessing={isProcessing}
        />
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
            <TaskPriorityBadge priority={task.priority} />
            {task.due_date && (
              <Text className="text-xs text-gray-500 ml-2">
                Due: {new Date(task.due_date).toLocaleDateString()}
              </Text>
            )}
            {isDeleting && (
              <View className="flex-row items-center ml-2">
                <ActivityIndicator size="small" color="#10b981" />
                <Text className="text-xs text-green-500 ml-1">Deleting...</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
