import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, TextInput, Modal } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { ErrorMessage } from '@/components/ErrorMessage';
import { TaskItem } from '@/components/TaskItem';
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
    } catch (err) {
      Alert.alert('Error', 'Failed to create task. Please try again.');
      console.error('Error creating task:', err);
    } finally {
      setIsCreating(false);
    }
  };

  // Toggle task completion
  const handleToggleTask = async (task: Task) => {
    try {
      await toggleTaskCompletion(task.id, !task.is_completed);
      // Refresh the tasks without showing loading
      const fetchedTasks = await getTasksByListId(listIdNumber);
      setTasks(fetchedTasks);
    } catch (err) {
      Alert.alert('Error', 'Failed to update task. Please try again.');
      console.error('Error toggling task:', err);
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
            } catch (err) {
              Alert.alert('Error', 'Failed to delete task. Please try again.');
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
                title={isCreating ? "Creating..." : "Create"}
                onPress={handleCreateTask}
                disabled={isCreating}
                className="flex-1 bg-blue-500"
              />
            </View>
          </View>
        </View>
      </Modal>
    </Container>
  );
}
