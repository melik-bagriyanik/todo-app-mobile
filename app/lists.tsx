import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, TextInput, Modal, RefreshControl } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { ErrorMessage } from '@/components/ErrorMessage';
import { ListItem } from '@/components/ListItem';
import { getAllLists, createList, deleteList } from '@/queries/lists';
import { List } from '@/types';

export default function ListsScreen() {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [deletingListId, setDeletingListId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // Fetch all lists
  const fetchLists = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedLists = await getAllLists();
      setLists(fetchedLists);
    } catch (err) {
      setError('Failed to load lists. Please try again.');
      console.error('Error fetching lists:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh lists (for pull-to-refresh)
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      setError(null);
      const fetchedLists = await getAllLists();
      setLists(fetchedLists);
    } catch (err) {
      setError('Failed to refresh lists. Please try again.');
      console.error('Error refreshing lists:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // Create new list
  const handleCreateList = async () => {
    if (!newListName.trim()) {
      Alert.alert('Error', 'Please enter a list name');
      return;
    }

    try {
      setIsCreating(true);
      await createList(newListName.trim());
      setNewListName('');
      setShowAddModal(false);
      // Refresh the lists without showing loading
      const fetchedLists = await getAllLists();
      setLists(fetchedLists);
      Toast.show({
        type: 'success',
        text1: 'List Created',
        text2: 'Your list has been created successfully!',
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to create list. Please try again.',
      });
      console.error('Error creating list:', err);
    } finally {
      setIsCreating(false);
    }
  };

  // Delete list with confirmation
  const handleDeleteList = (list: List) => {
    Alert.alert(
      'Delete List',
      `Are you sure you want to delete "${list.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeletingListId(list.id);
              await deleteList(list.id);
              // Refresh the lists without showing loading
              const fetchedLists = await getAllLists();
              setLists(fetchedLists);
              Toast.show({
                type: 'success',
                text1: 'List Deleted',
                text2: 'List has been deleted successfully!',
              });
            } catch (err) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete list. Please try again.',
              });
              console.error('Error deleting list:', err);
            } finally {
              setDeletingListId(null);
            }
          },
        },
      ]
    );
  };

  // Navigate to tasks for a specific list
  const handleListPress = (list: List) => {
    router.push({
      pathname: '/tasks',
      params: { listId: list.id.toString(), listName: list.name },
    });
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const renderList = ({ item }: { item: List }) => (
    <ListItem
      list={item}
      onPress={handleListPress}
      onDelete={handleDeleteList}
      isDeleting={deletingListId === item.id}
    />
  );

  if (loading) {
    return (
      <Container>
        <Stack.Screen options={{ title: 'Lists' }} />
        <LoadingIndicator message="Loading lists..." />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Stack.Screen options={{ title: 'Lists' }} />
        <ErrorMessage message={error} onRetry={fetchLists} />
      </Container>
    );
  }

  return (
    <Container>
      <Stack.Screen options={{ title: 'Lists' }} />
      
      <View className="flex-1">
        <View className="mb-4">
          <Button
            title="Add New List"
            onPress={() => setShowAddModal(true)}
            className="bg-green-500"
          />
        </View>

        {lists.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg text-gray-600 mb-4">No lists found</Text>
            <Text className="text-sm text-gray-500 text-center">
              Tap "Add New List" to create your first list
            </Text>
          </View>
        ) : (
          <FlatList
            data={lists}
            renderItem={renderList}
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

      {/* Add List Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-11/12 max-w-sm">
            <Text className="text-xl font-bold mb-4 text-center">Create New List</Text>
            
            <TextInput
              value={newListName}
              onChangeText={setNewListName}
              placeholder="Enter list name"
              className="border border-gray-300 rounded-lg p-3 mb-4 text-base"
              autoFocus
            />
            
            <View className="flex-row space-x-3">
              <Button
                title="Cancel"
                onPress={() => {
                  setShowAddModal(false);
                  setNewListName('');
                }}
                className="flex-1 bg-gray-500"
              />
              <Button
                title={isCreating ? "Creating..." : "Create"}
                onPress={handleCreateList}
                disabled={isCreating}
                className="flex-1 bg-green-500"
              />
            </View>
          </View>
        </View>
      </Modal>
    </Container>
  );
}
