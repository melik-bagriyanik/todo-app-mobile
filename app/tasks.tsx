import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Alert, TextInput, Modal, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { ErrorMessage } from '@/components/ErrorMessage';
import { TaskItem } from '@/components/TaskItem';
import { getTasksByListId, createTask, deleteTask, toggleTaskCompletion, searchTasksByName, getTasksByStatus, getTasksByPriority } from '@/queries/tasks';
import { Task } from '@/types';
import { CreateTaskSchema, TaskIdSchema, TaskSearchSchema, TaskFilterSchema } from '@/validation/schemas';
import { validateWithAlert, validateFormInput } from '@/validation/utils';

export default function TasksScreen() {
  const { listId, listName } = useLocalSearchParams<{
    listId: string;
    listName: string;
  }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
  const [processingTaskIds, setProcessingTaskIds] = useState<Set<number>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const listIdNumber = parseInt(listId || '0');

  // Debounce hook
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Fetch tasks for the current list
  const fetchTasks = async () => {
    if (!listIdNumber) return;
    
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await getTasksByListId(listIdNumber);
      setTasks(fetchedTasks);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh tasks (for pull-to-refresh)
  const onRefresh = async () => {
    if (!listIdNumber) return;
    
    try {
      setRefreshing(true);
      setError(null);
      const fetchedTasks = await getTasksByListId(listIdNumber);
      setTasks(fetchedTasks);
    } catch (err) {
      setError('Failed to refresh tasks. Please try again.');
      console.error('Error refreshing tasks:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // Search tasks by name
  const handleSearch = async (query: string) => {
    if (!listIdNumber) return;
    
    if (!query.trim()) {
      // If search is empty, fetch all tasks without showing full screen loading
      try {
        setIsSearching(true);
        setError(null);
        const fetchedTasks = await getTasksByListId(listIdNumber);
        setTasks(fetchedTasks);
      } catch (err) {
        setError('Failed to load tasks. Please try again.');
        console.error('Error fetching tasks:', err);
      } finally {
        setIsSearching(false);
      }
      return;
    }
    
    // Validate search query
    const searchValidation = validateFormInput(query, 1, 100, 'Search query');
    if (!searchValidation.isValid) {
      Alert.alert('Validation Error', searchValidation.error);
      return;
    }
    
    try {
      setIsSearching(true);
      setError(null);
      const searchResults = await searchTasksByName(query);
      // Filter results to only include tasks from current list
      const filteredResults = searchResults.filter(task => task.list_id === listIdNumber);
      setTasks(filteredResults);
    } catch (err) {
      setError('Failed to search tasks. Please try again.');
      console.error('Error searching tasks:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    if (debouncedSearchQuery !== searchQuery) return;
    handleSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  // Filter tasks by status
  const handleStatusFilter = async (status: string) => {
    if (!listIdNumber) return;
    
    setFilterStatus(status);
    
    if (status === 'all') {
      try {
        setIsFiltering(true);
        setError(null);
        const fetchedTasks = await getTasksByListId(listIdNumber);
        setTasks(fetchedTasks);
      } catch (err) {
        setError('Failed to load tasks. Please try again.');
        console.error('Error fetching tasks:', err);
      } finally {
        setIsFiltering(false);
      }
      return;
    }
    
    try {
      setIsFiltering(true);
      setError(null);
      const filteredTasks = await getTasksByStatus(status);
      // Filter results to only include tasks from current list
      const listTasks = filteredTasks.filter(task => task.list_id === listIdNumber);
      setTasks(listTasks);
    } catch (err) {
      setError('Failed to filter tasks. Please try again.');
      console.error('Error filtering tasks:', err);
    } finally {
      setIsFiltering(false);
    }
  };

  // Filter tasks by priority
  const handlePriorityFilter = async (priority: string) => {
    if (!listIdNumber) return;
    
    setFilterPriority(priority);
    
    if (priority === 'all') {
      try {
        setIsFiltering(true);
        setError(null);
        const fetchedTasks = await getTasksByListId(listIdNumber);
        setTasks(fetchedTasks);
      } catch (err) {
        setError('Failed to load tasks. Please try again.');
        console.error('Error fetching tasks:', err);
      } finally {
        setIsFiltering(false);
      }
      return;
    }
    
    try {
      setIsFiltering(true);
      setError(null);
      const filteredTasks = await getTasksByPriority(priority);
      // Filter results to only include tasks from current list
      const listTasks = filteredTasks.filter(task => task.list_id === listIdNumber);
      setTasks(listTasks);
    } catch (err) {
      setError('Failed to filter tasks. Please try again.');
      console.error('Error filtering tasks:', err);
    } finally {
      setIsFiltering(false);
    }
  };

  // Create new task
  const handleCreateTask = async () => {
    // Validate task name
    const nameValidation = validateFormInput(newTaskName, 1, 100, 'Task name');
    if (!nameValidation.isValid) {
      Alert.alert('Validation Error', nameValidation.error);
      return;
    }

    // Validate task data with Zod
    const taskData = {
      name: newTaskName.trim(),
      description: newTaskDescription.trim() || undefined,
      list_id: listIdNumber,
      priority: 'medium' as const,
    };

    const validatedData = validateWithAlert(
      CreateTaskSchema,
      taskData,
      'Task Validation Error'
    );

    if (!validatedData) return;

    try {
      setIsCreating(true);
      await createTask({
        ...validatedData,
        status: 'pending',
      });
      setNewTaskName('');
      setNewTaskDescription('');
      setShowAddModal(false);
      // Refresh the tasks without showing loading
      const fetchedTasks = await getTasksByListId(listIdNumber);
      setTasks(fetchedTasks);
      Toast.show({
        type: 'success',
        text1: 'Task Created',
        text2: 'Your task has been created successfully!',
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to create task. Please try again.',
      });
      console.error('Error creating task:', err);
    } finally {
      setIsCreating(false);
    }
  };

  // Toggle task completion with loading state
  const handleToggleTask = async (task: Task) => {
    // Prevent multiple simultaneous operations on the same task
    if (processingTaskIds.has(task.id)) {
      return;
    }

    const newCompletionStatus = !task.is_completed;
    
    // Add task to processing set for loading state
    setProcessingTaskIds(prev => new Set(prev).add(task.id));

    try {
      // Perform the database update
      await toggleTaskCompletion(task.id, newCompletionStatus);
      // Refresh tasks after successful update
      const fetchedTasks = await getTasksByListId(listIdNumber);
      setTasks(fetchedTasks);
      Toast.show({
        type: 'success',
        text1: 'Task Updated',
        text2: `Task marked as ${newCompletionStatus ? 'completed' : 'pending'}`,
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update task. Please try again.',
      });
      console.error('Error toggling task:', err);
    } finally {
      // Remove task from processing set
      setProcessingTaskIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(task.id);
        return newSet;
      });
    }
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
          onPress: async () => {
            try {
              setDeletingTaskId(task.id);
              await deleteTask(task.id);
              // Refresh the tasks without showing loading
              const fetchedTasks = await getTasksByListId(listIdNumber);
              setTasks(fetchedTasks);
              Toast.show({
                type: 'success',
                text1: 'Task Deleted',
                text2: 'Task has been deleted successfully!',
              });
            } catch (err) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete task. Please try again.',
              });
              console.error('Error deleting task:', err);
            } finally {
              setDeletingTaskId(null);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchTasks();
  }, [listIdNumber]);

  const renderTask = ({ item }: { item: Task }) => (
    <TaskItem
      task={item}
      onToggle={handleToggleTask}
      onDelete={handleDeleteTask}
      isDeleting={deletingTaskId === item.id}
      isProcessing={processingTaskIds.has(item.id)}
    />
  );

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
        <ErrorMessage message={error} onRetry={fetchTasks} />
      </Container>
    );
  }

  return (
    <Container>
      <Stack.Screen options={{ title: listName }} />
      
      <View className="flex-1">
        {/* Search Bar */}
        <View className="mb-4">
          <View className="relative">
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search tasks..."
              placeholderTextColor="#9CA3AF"
              className="bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800 shadow-sm focus:border-green-500 focus:shadow-md"
              style={{
                paddingRight: isSearching ? 40 : 16,
              }}
            />
            {isSearching && (
              <View className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <ActivityIndicator size="small" color="#10b981" />
              </View>
            )}
            {!isSearching && searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-gray-300 items-center justify-center"
              >
                <Text className="text-gray-600 text-xs font-bold">×</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter Buttons */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Filter by Status:</Text>
          <View className="flex-row flex-wrap mb-3">
            {['all', 'pending', 'in_progress', 'completed'].map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() => handleStatusFilter(status)}
                className={`px-3 py-2 rounded-full mr-2 mb-2 border ${
                  filterStatus === status 
                    ? 'bg-green-500 border-green-500' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <Text className={`text-sm font-medium ${
                  filterStatus === status ? 'text-white' : 'text-gray-700'
                }`}>
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text className="text-sm font-medium text-gray-700 mb-2">Filter by Priority:</Text>
          <View className="flex-row flex-wrap mb-3">
            {['all', 'low', 'medium', 'high'].map((priority) => {
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
                <TouchableOpacity
                  key={priority}
                  onPress={() => handlePriorityFilter(priority)}
                  className={`px-3 py-2 rounded-full mr-2 mb-2 border ${getPriorityColor(priority, filterPriority === priority)}`}
                >
                  <Text className={`text-sm font-medium ${getTextColor(priority, filterPriority === priority)}`}>
                    {priority === 'all' ? 'All' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className="mb-4">
          <Button
            title="Add New Task"
            onPress={() => setShowAddModal(true)}
            className="bg-blue-500"
          />
        </View>

        {tasks.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg text-gray-600 mb-4">No tasks found</Text>
            <Text className="text-sm text-gray-500 text-center">
              Tap "Add New Task" to create your first task
            </Text>
          </View>
        ) : isFiltering ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#10b981" />
            <Text className="text-lg text-gray-600 mt-4">Filtering tasks...</Text>
          </View>
        ) : (
          <FlatList
            data={tasks}
            renderItem={renderTask}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#10b981']}
                tintColor="#10b981"
              />
            }
          />
        )}
      </View>

      {/* Add Task Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-11/12 max-w-sm">
            <Text className="text-xl font-bold mb-4 text-center">Create New Task</Text>
            
            <TextInput
              value={newTaskName}
              onChangeText={setNewTaskName}
              placeholder="Enter task name"
              placeholderTextColor="#9CA3AF"
              className="bg-white border-2 border-gray-200 rounded-xl px-4 py-3 mb-3 text-base text-gray-800 shadow-sm focus:border-green-500 focus:shadow-md"
              autoFocus
            />
            
            <TextInput
              value={newTaskDescription}
              onChangeText={setNewTaskDescription}
              placeholder="Enter description (optional)"
              placeholderTextColor="#9CA3AF"
              className="bg-white border-2 border-gray-200 rounded-xl px-4 py-3 mb-4 text-base text-gray-800 shadow-sm focus:border-green-500 focus:shadow-md"
              multiline
              numberOfLines={3}
            />
            
            <View className="flex-row">
              <Button
                title="Cancel"
                onPress={() => {
                  setShowAddModal(false);
                  setNewTaskName('');
                  setNewTaskDescription('');
                }}
                className="flex-1 bg-gray-500 mr-3"
              />
              <Button
                title="Create"
                onPress={handleCreateTask}
                loading={isCreating}
                className="flex-1 bg-blue-500"
              />
            </View>
          </View>
        </View>
      </Modal>
    </Container>
  );
}
