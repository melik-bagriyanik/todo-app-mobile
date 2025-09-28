import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { ErrorMessage } from '@/components/ErrorMessage';
import { SearchBar } from '@/components/SearchBar';
import { TaskFilter } from '@/components/TaskFilter';
import { CreateTaskModal } from '@/components/CreateTaskModal';
import { TaskList } from '@/components/TaskList';
import { toastMessages } from '@/utils/toast';
import { 
  useTasksByList, 
  useCreateTask, 
  useDeleteTask, 
  useToggleTaskCompletion, 
  useUpdateTaskStatus,
  useSearchTasks, 
  useTasksByStatus, 
  useTasksByPriority 
} from '@/hooks';
import { useUIStore } from '@/store/store';
import { Task } from '@/types';
import { CreateTaskSchema } from '@/validation/schemas';
import { validateWithAlert, validateFormInput } from '@/validation/utils';

export default function TasksScreen() {
  const { listId, listName } = useLocalSearchParams<{
    listId: string;
    listName: string;
  }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);

  // Zustand stores
  const {
    isCreateTaskModalOpen,
    isCreatingTask,
    openCreateTaskModal,
    closeCreateTaskModal,
  } = useUIStore();

  // Default values
  const defaultTaskPriority = 'medium';
  const defaultTaskStatus = 'pending';
  const showCompletedTasks = true;
  const showTaskDescriptions = true;
  const compactView = false;

  const listIdNumber = parseInt(listId || '0');

  // TanStack Query hooks
  const {
    data: tasks = [],
    isLoading: loading,
    error,
    refetch,
    isRefetching: refreshing,
  } = useTasksByList(listIdNumber);

  const {
    data: searchResults = [],
    isLoading: isSearching,
  } = useSearchTasks(searchQuery);

  const {
    data: statusFilteredTasks = [],
    isLoading: isStatusFiltering,
  } = useTasksByStatus(filterStatus === 'all' ? '' : filterStatus);

  const {
    data: priorityFilteredTasks = [],
    isLoading: isPriorityFiltering,
  } = useTasksByPriority(filterPriority === 'all' ? '' : filterPriority);

  const createTaskMutation = useCreateTask();
  const deleteTaskMutation = useDeleteTask();
  const toggleTaskMutation = useToggleTaskCompletion();
  const updateStatusMutation = useUpdateTaskStatus();

  // Determine which data to display based on search and filters
  const getDisplayTasks = () => {
    if (searchQuery.trim()) {
      return searchResults.filter(task => task.list_id === listIdNumber);
    }
    
    if (filterStatus !== 'all' && filterPriority !== 'all') {
      // Both filters applied - intersect the results
      const statusTasks = statusFilteredTasks.filter(task => task.list_id === listIdNumber);
      const priorityTasks = priorityFilteredTasks.filter(task => task.list_id === listIdNumber);
      return statusTasks.filter(task => priorityTasks.some(pt => pt.id === task.id));
    }
    
    if (filterStatus !== 'all') {
      return statusFilteredTasks.filter(task => task.list_id === listIdNumber);
    }
    
    if (filterPriority !== 'all') {
      return priorityFilteredTasks.filter(task => task.list_id === listIdNumber);
    }
    
    return tasks;
  };

  const displayTasks = getDisplayTasks();
  const isFiltering = isStatusFiltering || isPriorityFiltering;
  const isSearchingOrFiltering = isSearching || isFiltering;

  // Filter handlers
  const handleStatusFilter = (status: string) => {
    setFilterStatus(status);
  };

  const handlePriorityFilter = (priority: string) => {
    setFilterPriority(priority);
  };

  // Create new task
  const handleCreateTask = async (taskData: any) => {
    // Validate task data with Zod
    const fullTaskData = {
      ...taskData,
      list_id: listIdNumber,
    };

    const validatedData = validateWithAlert(
      CreateTaskSchema,
      fullTaskData,
      'Task Validation Error'
    );

    if (!validatedData) return;

    createTaskMutation.mutate(validatedData, {
      onSuccess: () => {
        closeCreateTaskModal();
        toastMessages.taskCreated();
      },
      onError: (err) => {
        toastMessages.error('Failed to create task. Please try again.');
        console.error('Error creating task:', err);
      },
    });
  };

  // Toggle task completion with optimistic update
  const handleToggleTask = async (task: Task) => {
    const newCompletionStatus = !task.is_completed;

    toggleTaskMutation.mutate({
      id: task.id,
      isCompleted: newCompletionStatus,
    }, {
      onSuccess: () => {
        toastMessages.taskUpdated();
      },
      onError: (err) => {
        toastMessages.error('Failed to update task. Please try again.');
        console.error('Error toggling task:', err);
      },
    });
  };

  // Handle task status change
  const handleStatusChange = async (task: Task, newStatus: string) => {
    updateStatusMutation.mutate({
      id: task.id,
      status: newStatus,
    }, {
      onSuccess: () => {
        toastMessages.taskUpdated();
      },
      onError: (err) => {
        toastMessages.error('Failed to update task status. Please try again.');
        console.error('Error updating task status:', err);
      },
    });
  };

  // Delete task with confirmation
  const handleDeleteTask = (task: Task) => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setDeletingTaskId(task.id);
            deleteTaskMutation.mutate(task.id, {
              onSuccess: () => {
                setDeletingTaskId(null);
                toastMessages.taskDeleted();
              },
              onError: (err) => {
                setDeletingTaskId(null);
                toastMessages.error('Failed to delete task. Please try again.');
                console.error('Error deleting task:', err);
              },
            });
          },
        },
      ]
    );
  };


  if (loading) {
    return (
      <Container>
        <Stack.Screen options={{ title: listName }} />
        <LoadingIndicator message="Loading tasks..." />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Stack.Screen options={{ title: listName }} />
        <ErrorMessage message="Failed to load tasks. Please try again." onRetry={refetch} />
      </Container>
    );
  }

  return (
    <Container>
      <Stack.Screen options={{ title: listName }} />
      
      <View className="flex-1">
        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search tasks..."
          isLoading={isSearching}
          onClear={() => setSearchQuery('')}
        />

        {/* Filter Buttons */}
        <TaskFilter
          statusFilter={filterStatus}
          priorityFilter={filterPriority}
          onStatusFilter={handleStatusFilter}
          onPriorityFilter={handlePriorityFilter}
        />

        <View className="mb-4">
          <Button
            title="Add New Task"
            onPress={openCreateTaskModal}
            className="bg-blue-500"
          />
        </View>

        <TaskList
          tasks={displayTasks}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onStatusChange={handleStatusChange}
          isRefreshing={refreshing}
          onRefresh={refetch}
          emptyMessage="No tasks found"
          emptySubMessage={
            searchQuery.trim() || filterStatus !== 'all' || filterPriority !== 'all' 
              ? 'No tasks match your search or filters' 
              : 'Tap "Add New Task" to create your first task'
          }
          isSearchingOrFiltering={isSearchingOrFiltering}
          searchOrFilterMessage={isSearching ? 'Searching tasks...' : 'Filtering tasks...'}
          deletingTaskId={deletingTaskId}
        />
      </View>

      {/* Add Task Modal */}
      <CreateTaskModal
        visible={isCreateTaskModalOpen}
        onClose={closeCreateTaskModal}
        onSubmit={handleCreateTask}
        isLoading={isCreatingTask || createTaskMutation.isPending}
      />
    </Container>
  );
}
