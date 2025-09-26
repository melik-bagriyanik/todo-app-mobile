import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Alert, TextInput, Modal, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { ErrorMessage } from '@/components/ErrorMessage';
import { ListItem } from '@/components/ListItem';
import { getAllLists, createList, deleteList, searchListsByName } from '@/queries/lists';
import { List } from '@/types';
import { CreateListSchema, ListIdSchema, ListSearchSchema } from '@/validation/schemas';
import { validateWithAlert, validateFormInput } from '@/validation/utils';

export default function ListsScreen() {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [deletingListId, setDeletingListId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

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

  // Search lists by name
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      // If search is empty, fetch all lists without showing full screen loading
      try {
        setIsSearching(true);
        setError(null);
        const fetchedLists = await getAllLists();
        setLists(fetchedLists);
      } catch (err) {
        setError('Failed to load lists. Please try again.');
        console.error('Error fetching lists:', err);
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
      const searchResults = await searchListsByName(query);
      setLists(searchResults);
    } catch (err) {
      setError('Failed to search lists. Please try again.');
      console.error('Error searching lists:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    if (debouncedSearchQuery !== searchQuery) return;
    handleSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  // Create new list
  const handleCreateList = async () => {
    // Validate list name
    const nameValidation = validateFormInput(newListName, 1, 50, 'List name');
    if (!nameValidation.isValid) {
      Alert.alert('Validation Error', nameValidation.error);
      return;
    }

    // Validate list data with Zod
    const listData = {
      name: newListName.trim(),
    };

    const validatedData = validateWithAlert(
      CreateListSchema,
      listData,
      'List Validation Error'
    );

    if (!validatedData) return;

    try {
      setIsCreating(true);
      await createList(validatedData.name);
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
        {/* Search Bar */}
        <View className="mb-4">
          <View className="relative">
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search lists..."
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
              placeholderTextColor="#9CA3AF"
              className="bg-white border-2 border-gray-200 rounded-xl px-4 py-3 mb-4 text-base text-gray-800 shadow-sm focus:border-green-500 focus:shadow-md"
              autoFocus
            />
            
            <View className="flex-row">
              <Button
                title="Cancel"
                onPress={() => {
                  setShowAddModal(false);
                  setNewListName('');
                }}
                className="flex-1 bg-gray-500 mr-3"
              />
              <Button
                title="Create"
                onPress={handleCreateList}
                loading={isCreating}
                className="flex-1 bg-green-500"
              />
            </View>
          </View>
        </View>
      </Modal>
    </Container>
  );
}
