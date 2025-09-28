import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Task, Priority } from '@/types';
import { TaskCheckbox } from './TaskCheckbox';
import { TaskPriorityBadge } from './TaskPriorityBadge';
import { TaskStatusSelector } from './TaskStatusSelector';
import { useHapticFeedback } from '@/utils/haptics';

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange?: (task: Task, newStatus: string) => void;
  isDeleting?: boolean;
  isProcessing?: boolean;
}

export const TaskItem = ({ task, onToggle, onDelete, onStatusChange, isDeleting = false, isProcessing = false }: TaskItemProps) => {
  const haptics = useHapticFeedback();

  const handleToggle = () => {
    if (!isDeleting && !isProcessing) {
      haptics.onToggle();
      
      // If task is being completed, update status to completed first
      if (!task.is_completed && onStatusChange) {
        onStatusChange(task, 'completed');
      }
      // If task is being uncompleted, update status to pending
      else if (task.is_completed && onStatusChange) {
        onStatusChange(task, 'pending');
      }
      
      // Then toggle the completion status
      onToggle(task);
    }
  };

  const handleDelete = () => {
    if (!isDeleting) {
      haptics.onDelete();
      onDelete(task);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (onStatusChange) {
      haptics.onToggle();
      onStatusChange(task, newStatus);
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
          
          <View className="flex-row items-center justify-between mt-2">
            <View className="flex-row items-center">
              <TaskPriorityBadge priority={task.priority} />
              {task.due_date && (
                <Text className="text-xs text-gray-500 ml-2">
                  Due: {new Date(task.due_date).toLocaleDateString()}
                </Text>
              )}
            </View>
            
                <View className="flex-row items-center">
                  <TaskStatusSelector
                    currentStatus={task.status || 'pending'}
                    onStatusChange={handleStatusChange}
                    disabled={isDeleting || isProcessing}
                    isLoading={false}
                  />
                  {isDeleting && (
                    <View className="flex-row items-center ml-2">
                      <ActivityIndicator size="small" color="#10b981" />
                      <Text className="text-xs text-green-500 ml-1">Deleting...</Text>
                    </View>
                  )}
                </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
