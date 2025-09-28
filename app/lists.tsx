import React, { useState } from 'react';
import { View, Text, FlatList, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { toastMessages } from '@/utils/toast';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { ErrorMessage } from '@/components/ErrorMessage';
import { ListItem } from '@/components/ListItem';
import { SearchBar } from '@/components/SearchBar';
import { CreateListModal } from '@/components/CreateListModal';
import { useLists, useCreateList, useDeleteList, useSearchLists } from '@/hooks';
import { useUIStore } from '@/store/store';
import { List } from '@/types';
import { CreateListSchema } from '@/validation/schemas';
import { validateWithAlert, validateFormInput } from '@/validation/utils';

export default function ListsScreen() {
  const [newListName, setNewListName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingListId, setDeletingListId] = useState<number | null>(null);
  const router = useRouter();

  // Zustand stores
  const {
    isCreateListModalOpen,
    isCreatingList,
    openCreateListModal,
    closeCreateListModal,
    setCreatingList,
  } = useUIStore();


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
        toastMessages.listCreated();
      },
      onError: (err) => {
        toastMessages.error('Failed to create list. Please try again.');
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
            setDeletingListId(list.id);
            deleteListMutation.mutate(list.id, {
              onSuccess: () => {
                setDeletingListId(null);
                toastMessages.listDeleted();
              },
              onError: (err) => {
                setDeletingListId(null);
                toastMessages.error('Failed to delete list. Please try again.');
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
        <ErrorMessage message="Failed to load lists. Please try again." onRetry={refetch} />
      </Container>
    );
  }

  return (
    <Container>
      <Stack.Screen 
        options={{ 
          title: 'Lists',
        }} 
      />
      
      <View className="flex-1">
        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search lists..."
          isLoading={isSearching}
          onClear={() => setSearchQuery('')}
        />

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
      <CreateListModal
        visible={isCreateListModalOpen}
        onClose={() => {
          closeCreateListModal();
          setNewListName('');
        }}
        onSubmit={handleCreateList}
        value={newListName}
        onChangeText={setNewListName}
        isLoading={isCreatingList || createListMutation.isPending}
      />
    </Container>
  );
}
