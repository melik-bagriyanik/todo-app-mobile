import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, TextInput, Modal, RefreshControl } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { ErrorMessage } from '@/components/ErrorMessage';
import { TaskItem } from '@/components/TaskItem';
import { SkeletonTaskItem } from '@/components/SkeletonTaskItem';
import { getTasksByListId, createTask, deleteTask, toggleTaskCompletion } from '@/queries/tasks';
import { Task } from '@/types';

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

  const listIdNumber = parseInt(listId || '0');

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

  // Create new task
  const handleCreateTask = async () => {
    if (!newTaskName.trim()) {
      Alert.alert('Error', 'Please enter a task name');
      return;
    }

    try {
      setIsCreating(true);
      await createTask({
        name: newTaskName.trim(),
        description: newTaskDescription.trim() || undefined,
        list_id: listIdNumber,
        priority: 'medium',
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
        <View className="flex-1 p-4">
          <View className="mb-4">
            <Button
              title="Add New Task"
              onPress={() => setShowAddModal(true)}
              className="bg-blue-500"
            />
          </View>
          <View className="flex-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonTaskItem key={i} />
            ))}
          </View>
        </View>
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
              className="border border-gray-300 rounded-lg p-3 mb-3 text-base"
              autoFocus
            />
            
            <TextInput
              value={newTaskDescription}
              onChangeText={setNewTaskDescription}
              placeholder="Enter description (optional)"
              className="border border-gray-300 rounded-lg p-3 mb-4 text-base"
              multiline
              numberOfLines={3}
            />
            
            <View className="flex-row space-x-3">
              <Button
                title="Cancel"
                onPress={() => {
                  setShowAddModal(false);
                  setNewTaskName('');
                  setNewTaskDescription('');
                }}
                className="flex-1 bg-gray-500"
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
