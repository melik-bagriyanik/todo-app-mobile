/**
 * TaskItem - Individual task display component
 * Features: Toggle completion, status change, delete, haptic feedback
 */
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

export const TaskItem = ({ 
  task, 
  onToggle, 
  onDelete, 
  onStatusChange, 
  isDeleting = false, 
  isProcessing = false 
}: TaskItemProps) => {
  //  HOOKS 
  
  const haptics = useHapticFeedback();

  //  EVENT HANDLERS 
  
  /**
   * Handles task completion toggle with status update
   */
  const handleToggle = () => {
    if (isDeleting || isProcessing) return;
    
    haptics.onToggle();
    
    // Update status based on completion state
    if (!task.is_completed && onStatusChange) {
      onStatusChange(task, 'completed');
    } else if (task.is_completed && onStatusChange) {
      onStatusChange(task, 'pending');
    }
    
    // Toggle completion status
    onToggle(task);
  };

  /**
   * Handles task deletion with haptic feedback
   */
  const handleDelete = () => {
    if (isDeleting) return;
    
    haptics.onDelete();
    onDelete(task);
  };

  /**
   * Handles status change with haptic feedback
   */
  const handleStatusChange = (newStatus: string) => {
    if (!onStatusChange) return;
    
    haptics.onToggle();
    onStatusChange(task, newStatus);
  };

  return (
    <View className={`p-4 mb-3 rounded-2xl border ${
      task.is_completed 
        ? 'bg-green-100 border-green-300 shadow-sm' 
        : 'bg-white border-gray-200 shadow-sm'
    } ${isDeleting ? 'opacity-75' : ''} ${isProcessing ? 'opacity-70' : ''} active:scale-98 transition-transform`}>
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
                task.is_completed ? 'line-through text-green-700' : 'text-gray-800'
              }`}>
                {task.name}
              </Text>
              {task.description && (
                <Text className={`text-sm mt-1 ${
                  task.is_completed ? 'line-through text-green-600' : 'text-gray-600'
                }`}>
                  {task.description}
                </Text>
              )}
          
          <View className="flex-row items-center justify-between mt-2">
            <View className="flex-row items-center">
              <TaskPriorityBadge priority={task.priority} />
              {task.due_date && (
                <Text className={`text-xs ml-2 ${
                  task.is_completed ? 'line-through text-green-500' : 'text-gray-500'
                }`}>
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
