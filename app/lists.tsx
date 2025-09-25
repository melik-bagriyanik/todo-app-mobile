import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { Stack } from 'expo-router';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
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
    } catch (err) {
      Alert.alert('Error', 'Failed to create list. Please try again.');
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
            } catch (err) {
              Alert.alert('Error', 'Failed to delete list. Please try again.');
              console.error('Error deleting list:', err);
            } finally {
              setDeletingListId(null);
            }
          },
        },
      ]
    );
  };

  // Handle list press (no navigation needed)
  const handleListPress = (list: List) => {
    // Just show list info or do nothing
    Alert.alert('List Info', `List: ${list.name}\nCreated: ${new Date(list.created_at).toLocaleDateString()}`);
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const renderList = ({ item }: { item: List }) => {
    const isDeleting = deletingListId === item.id;
    
    return (
      <View className={`p-4 mb-3 rounded-lg shadow-sm border border-gray-200 ${
        isDeleting ? 'bg-gray-100 opacity-75' : 'bg-white'
      }`}>
        <TouchableOpacity
          onPress={() => !isDeleting && handleListPress(item)}
          className="flex-1"
          disabled={isDeleting}
        >
          <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
          <Text className="text-sm text-gray-500 mt-1">
            Created: {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        
        <View className="flex-row justify-end mt-3">
          <TouchableOpacity
            onPress={() => !isDeleting && handleDeleteList(item)}
            disabled={isDeleting}
            className={`px-4 py-2 rounded-lg ${
              isDeleting 
                ? 'bg-gray-400' 
                : 'bg-red-500'
            }`}
          >
            <Text className="text-white font-medium">
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <Container>
        <Stack.Screen options={{ title: 'Lists' }} />
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">Loading lists...</Text>
        </View>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Stack.Screen options={{ title: 'Lists' }} />
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-red-600 mb-4">{error}</Text>
          <Button title="Retry" onPress={fetchLists} />
        </View>
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
