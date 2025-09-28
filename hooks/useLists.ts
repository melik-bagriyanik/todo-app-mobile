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
    onMutate: async (name) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: listKeys.lists() });

      // Snapshot the previous value
      const previousLists = queryClient.getQueryData(listKeys.lists());

      // Create optimistic list
      const optimisticList = {
        id: Date.now(), // Temporary ID
        name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Optimistically update lists
      queryClient.setQueryData(listKeys.lists(), (old: any) => {
        if (!old) return [optimisticList];
        return [optimisticList, ...old];
      });

      // Optimistically update recent lists
      queryClient.setQueryData(listKeys.recent(), (old: any) => {
        if (!old) return [optimisticList];
        return [optimisticList, ...old.slice(0, 4)]; // Keep only 5 recent
      });

      return { previousLists, optimisticList };
    },
    onError: (err, name, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousLists) {
        queryClient.setQueryData(listKeys.lists(), context.previousLists);
      }
    },
    onSuccess: (newListData) => {
      // Update the optimistic list with real data while maintaining position at the top
      queryClient.setQueryData(listKeys.lists(), (old: any) => {
        if (!old) return old;
        // Find and update the optimistic list, keep it at the beginning
        const updatedLists = old.map((list: any) => 
          list.id === Date.now() ? { ...newListData, id: newListData.id } : list
        );
        // Ensure the new list stays at the beginning
        const newList = updatedLists.find((list: any) => list.id === newListData.id);
        const otherLists = updatedLists.filter((list: any) => list.id !== newListData.id);
        return newList ? [newList, ...otherLists] : updatedLists;
      });
      
      // Update recent lists as well
      queryClient.setQueryData(listKeys.recent(), (old: any) => {
        if (!old) return old;
        const updatedLists = old.map((list: any) => 
          list.id === Date.now() ? { ...newListData, id: newListData.id } : list
        );
        const newList = updatedLists.find((list: any) => list.id === newListData.id);
        const otherLists = updatedLists.filter((list: any) => list.id !== newListData.id);
        return newList ? [newList, ...otherLists.slice(0, 4)] : updatedLists;
      });
      
      // Don't invalidate the main queries to maintain order
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
    onMutate: async (listId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: listKeys.lists() });

      // Snapshot the previous value
      const previousLists = queryClient.getQueryData(listKeys.lists());

      // Optimistically remove the list
      queryClient.setQueryData(listKeys.lists(), (old: any) => {
        if (!old) return [];
        return old.filter((list: any) => list.id !== listId);
      });

      // Optimistically update recent lists
      queryClient.setQueryData(listKeys.recent(), (old: any) => {
        if (!old) return [];
        return old.filter((list: any) => list.id !== listId);
      });

      return { previousLists };
    },
    onError: (err, listId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousLists) {
        queryClient.setQueryData(listKeys.lists(), context.previousLists);
      }
    },
    onSuccess: () => {
      // Invalidate all list-related queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: listKeys.all });
      // Also invalidate tasks since deleting a list affects tasks
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
