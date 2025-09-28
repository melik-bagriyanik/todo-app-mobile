/**
 * Tasks Screen - Displays and manages tasks for a specific list
 * Features: Search, filtering, CRUD operations with optimistic updates
 */
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
  // Get list parameters from navigation
  const { listId, listName } = useLocalSearchParams<{
    listId: string;
    listName: string;
  }>();
  
  // Local state for search and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);

  // UI state from Zustand store
  const {
    isCreateTaskModalOpen,
    isCreatingTask,
    openCreateTaskModal,
    closeCreateTaskModal,
  } = useUIStore();

  // Convert listId to number for API calls
  const listIdNumber = parseInt(listId || '0');

  //  DATA FETCHING 
  
  // Fetch tasks for the current list
  const {
    data: tasks = [],
    isLoading: loading,
    error,
    refetch,
    isRefetching: refreshing,
  } = useTasksByList(listIdNumber);

  // Search functionality
  const {
    data: searchResults = [],
    isLoading: isSearching,
  } = useSearchTasks(searchQuery);

  // Status filtering
  const {
    data: statusFilteredTasks = [],
    isLoading: isStatusFiltering,
  } = useTasksByStatus(filterStatus === 'all' ? '' : filterStatus);

  // Priority filtering
  const {
    data: priorityFilteredTasks = [],
    isLoading: isPriorityFiltering,
  } = useTasksByPriority(filterPriority === 'all' ? '' : filterPriority);

  // Combined filter loading state
  const isFilterLoading = isStatusFiltering || isPriorityFiltering;

  //  MUTATIONS 
  
  const createTaskMutation = useCreateTask();
  const deleteTaskMutation = useDeleteTask();
  const toggleTaskMutation = useToggleTaskCompletion();
  const updateStatusMutation = useUpdateTaskStatus();

  //  DATA FILTERING 
  
  /**
   * Determines which tasks to display based on current filters and search
   */
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

  //  EVENT HANDLERS 
  
  /**
   * Handles status filter changes
   */
  const handleStatusFilter = (status: string) => {
    setFilterStatus(status);
  };

  /**
   * Handles priority filter changes
   */
  const handlePriorityFilter = (priority: string) => {
    setFilterPriority(priority);
  };

  /**
   * Creates a new task with validation and duplicate checking
   */
  const handleCreateTask = async (taskData: any) => {
    // Check for duplicate task name in the same list
    const trimmedName = taskData.name.trim();
    const existingTask = tasks.find(task => 
      task.list_id === listIdNumber && 
      task.name.toLowerCase() === trimmedName.toLowerCase()
    );
    
    if (existingTask) {
      Alert.alert('Duplicate Task', 'A task with this name already exists in this list. Please choose a different name.');
      return;
    }

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

  /**
   * Toggles task completion status with optimistic updates
   */
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

  /**
   * Updates task status with optimistic updates
   */
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

  /**
   * Deletes a task with confirmation dialog
   */
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


  //  RENDER CONDITIONS 
  
  // Show loading state
  if (loading) {
    return (
      <Container>
        <Stack.Screen options={{ title: listName }} />
        <LoadingIndicator message="Loading tasks..." />
      </Container>
    );
  }

  // Show error state
  if (error) {
    return (
      <Container>
        <Stack.Screen options={{ title: listName }} />
        <ErrorMessage message="Failed to load tasks. Please try again." onRetry={refetch} />
      </Container>
    );
  }

  //  MAIN RENDER 
  
  return (
    <Container>
      <Stack.Screen options={{ title: listName }} />
      
      <View className="flex-1">
        {/* Search functionality */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search tasks..."
          isLoading={isSearching}
          onClear={() => setSearchQuery('')}
        />

        {/* Filter controls */}
        <TaskFilter
          statusFilter={filterStatus}
          priorityFilter={filterPriority}
          onStatusFilter={handleStatusFilter}
          onPriorityFilter={handlePriorityFilter}
        />

        {/* Add task button */}
        <View className="mb-4">
          <Button
            title="Add New Task"
            onPress={openCreateTaskModal}
            className="bg-[#292929] shadow-lg"
          />
        </View>

        {/* Task list with all functionality */}
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
          isSearchingOrFiltering={isSearchingOrFiltering || isFilterLoading}
          searchOrFilterMessage={isSearching ? 'Searching tasks...' : isFilterLoading ? 'Loading tasks...' : 'Filtering tasks...'}
          deletingTaskId={deletingTaskId}
        />
      </View>

      {/* Create task modal */}
      <CreateTaskModal
        visible={isCreateTaskModalOpen}
        onClose={closeCreateTaskModal}
        onSubmit={handleCreateTask}
        isLoading={isCreatingTask || createTaskMutation.isPending}
      />
    </Container>
  );
}
