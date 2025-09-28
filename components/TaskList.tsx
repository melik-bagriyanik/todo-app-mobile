/**
 * TaskList - List component for displaying tasks
 * Features: Pull-to-refresh, empty states, loading states, task management
 */
import React from 'react';
import { View, Text, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { Task } from '@/types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onStatusChange?: (task: Task, newStatus: string) => void;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  emptyMessage?: string;
  emptySubMessage?: string;
  isSearchingOrFiltering?: boolean;
  searchOrFilterMessage?: string;
  deletingTaskId?: number | null;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  onStatusChange,
  isRefreshing = false,
  onRefresh,
  emptyMessage = 'No tasks found',
  emptySubMessage = 'Tap "Add New Task" to create your first task',
  isSearchingOrFiltering = false,
  searchOrFilterMessage = 'Searching tasks...',
  deletingTaskId = null,
}) => {
  // ==================== RENDER FUNCTIONS ====================
  
  /**
   * Renders individual task items
   */
  const renderTask = ({ item }: { item: Task }) => (
    <TaskItem
      task={item}
      onToggle={onToggleTask}
      onDelete={onDeleteTask}
      onStatusChange={onStatusChange}
      isDeleting={deletingTaskId === item.id}
      isProcessing={false}
    />
  );

  /**
   * Renders empty state when no tasks are found
   */
  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center">
      <Text className="text-lg text-gray-600 mb-4">{emptyMessage}</Text>
      <Text className="text-sm text-gray-500 text-center">{emptySubMessage}</Text>
    </View>
  );

  /**
   * Renders loading state when searching or filtering
   */
  const renderLoadingState = () => (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#10b981" />
      <Text className="text-lg text-gray-600 mt-4">{searchOrFilterMessage}</Text>
    </View>
  );

  // ==================== RENDER CONDITIONS ====================
  
  if (tasks.length === 0 && !isSearchingOrFiltering) {
    return renderEmptyState();
  }

  if (isSearchingOrFiltering) {
    return renderLoadingState();
  }

  return (
    <FlatList
      data={tasks}
      renderItem={renderTask}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#10b981']}
            tintColor="#10b981"
          />
        ) : undefined
      }
    />
  );
};
