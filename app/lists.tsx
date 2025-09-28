import React, { useState } from 'react';
import { View, Text, FlatList, Alert, TextInput, Modal, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { ErrorMessage } from '@/components/ErrorMessage';
import { ListItem } from '@/components/ListItem';
import { useLists, useCreateList, useDeleteList, useSearchLists } from '@/hooks';
import { useUIStore, usePreferencesStore } from '@/store/store';
import { List } from '@/types';
import { CreateListSchema } from '@/validation/schemas';
import { validateWithAlert, validateFormInput } from '@/validation/utils';

export default function ListsScreen() {
  const [newListName, setNewListName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // Zustand stores
  const {
    isCreateListModalOpen,
    isCreatingList,
    openCreateListModal,
    closeCreateListModal,
    setCreatingList,
  } = useUIStore();

  const { defaultListSort } = usePreferencesStore();

  // TanStack Query hooks
  const {
    data: lists = [],
    isLoading: loading,
    error,
    refetch,
    isRefetching: refreshing,
  } = useLists();

  const {
    data: searchResults = [],
    isLoading: isSearching,
  } = useSearchLists(searchQuery);

  const createListMutation = useCreateList();
  const deleteListMutation = useDeleteList();

  // Determine which data to display based on search
  const displayLists = searchQuery.trim() ? searchResults : lists;

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

    createListMutation.mutate(validatedData.name, {
      onSuccess: () => {
        setNewListName('');
        closeCreateListModal();
        Toast.show({
          type: 'success',
          text1: 'List Created',
          text2: 'Your list has been created successfully!',
        });
      },
      onError: (err) => {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to create list. Please try again.',
        });
        console.error('Error creating list:', err);
      },
    });
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
          onPress: () => {
            deleteListMutation.mutate(list.id, {
              onSuccess: () => {
                Toast.show({
                  type: 'success',
                  text1: 'List Deleted',
                  text2: 'List has been deleted successfully!',
                });
              },
              onError: (err) => {
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: 'Failed to delete list. Please try again.',
                });
                console.error('Error deleting list:', err);
              },
            });
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

  const renderList = ({ item }: { item: List }) => (
    <ListItem
      list={item}
      onPress={handleListPress}
      onDelete={handleDeleteList}
      isDeleting={deleteListMutation.isPending}
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
        <ErrorMessage message="Failed to load lists. Please try again." onRetry={refetch} />
      </Container>
    );
  }

  return (
    <Container>
      <Stack.Screen 
        options={{ 
          title: 'Lists',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push('/settings')}
              className="mr-2"
            >
              <Ionicons name="settings-outline" size={24} color="#374151" />
            </TouchableOpacity>
          ),
        }} 
      />
      
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
            onPress={openCreateListModal}
            className="bg-green-500"
          />
        </View>

        {displayLists.length === 0 && !isSearching ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg text-gray-600 mb-4">No lists found</Text>
            <Text className="text-sm text-gray-500 text-center">
              {searchQuery.trim() ? 'No lists match your search' : 'Tap "Add New List" to create your first list'}
            </Text>
          </View>
        ) : isSearching ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#10b981" />
            <Text className="text-lg text-gray-600 mt-4">Searching lists...</Text>
          </View>
        ) : (
          <FlatList
            data={displayLists}
            renderItem={renderList}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refetch}
                colors={['#10b981']}
                tintColor="#10b981"
              />
            }
          />
        )}
      </View>

      {/* Add List Modal */}
      <Modal
        visible={isCreateListModalOpen}
        transparent
        animationType="slide"
        onRequestClose={closeCreateListModal}
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
                  closeCreateListModal();
                  setNewListName('');
                }}
                className="flex-1 bg-gray-500 mr-3"
              />
              <Button
                title="Create"
                onPress={handleCreateList}
                loading={isCreatingList || createListMutation.isPending}
                className="flex-1 bg-green-500"
              />
            </View>
          </View>
        </View>
      </Modal>
    </Container>
  );
}
