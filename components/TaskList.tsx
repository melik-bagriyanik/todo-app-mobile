import React from 'react';
import { View, Text, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { Task } from '@/types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  isDeleting?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  emptyMessage?: string;
  emptySubMessage?: string;
  isSearchingOrFiltering?: boolean;
  searchOrFilterMessage?: string;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  isDeleting = false,
  isRefreshing = false,
  onRefresh,
  emptyMessage = 'No tasks found',
  emptySubMessage = 'Tap "Add New Task" to create your first task',
  isSearchingOrFiltering = false,
  searchOrFilterMessage = 'Searching tasks...',
}) => {
  const renderTask = ({ item }: { item: Task }) => (
    <TaskItem
      task={item}
      onToggle={onToggleTask}
      onDelete={onDeleteTask}
      isDeleting={isDeleting}
      isProcessing={false}
    />
  );

  if (tasks.length === 0 && !isSearchingOrFiltering) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-600 mb-4">{emptyMessage}</Text>
        <Text className="text-sm text-gray-500 text-center">{emptySubMessage}</Text>
      </View>
    );
  }

  if (isSearchingOrFiltering) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="text-lg text-gray-600 mt-4">{searchOrFilterMessage}</Text>
      </View>
    );
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
