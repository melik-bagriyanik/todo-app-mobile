import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createList,
  deleteList,
  getAllLists,
  getListById,
  getRecentLists,
  searchListsByName,
  updateList,
} from '@/queries/lists';

// Query Keys
export const listKeys = {
  all: ['lists'] as const,
  lists: () => [...listKeys.all, 'list'] as const,
  list: (id: number) => [...listKeys.lists(), id] as const,
  recent: (limit?: number) => [...listKeys.all, 'recent', limit] as const,
  search: (searchTerm: string) => [...listKeys.all, 'search', searchTerm] as const,
};

// Hooks for fetching data
export const useLists = () => {
  return useQuery({
    queryKey: listKeys.lists(),
    queryFn: getAllLists,
  });
};

export const useList = (id: number) => {
  return useQuery({
    queryKey: listKeys.list(id),
    queryFn: () => getListById(id),
    enabled: !!id,
  });
};

export const useRecentLists = (limit = 5) => {
  return useQuery({
    queryKey: listKeys.recent(limit),
    queryFn: () => getRecentLists(limit),
  });
};

export const useSearchLists = (searchTerm: string) => {
  return useQuery({
    queryKey: listKeys.search(searchTerm),
    queryFn: () => searchListsByName(searchTerm),
    enabled: !!searchTerm && searchTerm.length > 0,
  });
};

// Mutation hooks
export const useCreateList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createList,
    onSuccess: () => {
      // Invalidate and refetch lists
      queryClient.invalidateQueries({ queryKey: listKeys.lists() });
      queryClient.invalidateQueries({ queryKey: listKeys.recent() });
    },
  });
};

export const useUpdateList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      updateList(id, name),
    onSuccess: (_, { id }) => {
      // Invalidate specific list and all lists
      queryClient.invalidateQueries({ queryKey: listKeys.list(id) });
      queryClient.invalidateQueries({ queryKey: listKeys.lists() });
      queryClient.invalidateQueries({ queryKey: listKeys.recent() });
    },
  });
};

export const useDeleteList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteList,
    onSuccess: () => {
      // Invalidate all list-related queries
      queryClient.invalidateQueries({ queryKey: listKeys.all });
      // Also invalidate tasks since deleting a list affects tasks
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
