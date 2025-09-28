import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTask,
  deleteTask,
  getAllTasks,
  getCompletedTasks,
  getTaskById,
  getTasksByListId,
  getTasksByPriority,
  getTasksByStatus,
  getUpcomingTasks,
  searchTasksByName,
  toggleTaskCompletion,
  updateTask,
  updateTaskStatus,
} from '@/queries/tasks';

// Query Keys
export const taskKeys = {
  all: ['tasks'] as const,
  tasks: () => [...taskKeys.all, 'task'] as const,
  task: (id: number) => [...taskKeys.tasks(), id] as const,
  byList: (listId: number) => [...taskKeys.tasks(), 'byList', listId] as const,
  byStatus: (status: string) => [...taskKeys.tasks(), 'byStatus', status] as const,
  byPriority: (priority: string) => [...taskKeys.tasks(), 'byPriority', priority] as const,
  completed: () => [...taskKeys.tasks(), 'completed'] as const,
  upcoming: () => [...taskKeys.tasks(), 'upcoming'] as const,
  search: (searchTerm: string) => [...taskKeys.tasks(), 'search', searchTerm] as const,
};

// Hooks for fetching data
export const useTasks = () => {
  return useQuery({
    queryKey: taskKeys.tasks(),
    queryFn: getAllTasks,
  });
};

export const useTask = (id: number) => {
  return useQuery({
    queryKey: taskKeys.task(id),
    queryFn: () => getTaskById(id),
    enabled: !!id,
  });
};

export const useTasksByList = (listId: number) => {
  return useQuery({
    queryKey: taskKeys.byList(listId),
    queryFn: () => getTasksByListId(listId),
    enabled: !!listId,
  });
};

export const useTasksByStatus = (status: string) => {
  return useQuery({
    queryKey: taskKeys.byStatus(status),
    queryFn: () => getTasksByStatus(status),
    enabled: !!status,
  });
};

export const useTasksByPriority = (priority: string) => {
  return useQuery({
    queryKey: taskKeys.byPriority(priority),
    queryFn: () => getTasksByPriority(priority),
    enabled: !!priority,
  });
};

export const useCompletedTasks = () => {
  return useQuery({
    queryKey: taskKeys.completed(),
    queryFn: getCompletedTasks,
  });
};

export const useUpcomingTasks = () => {
  return useQuery({
    queryKey: taskKeys.upcoming(),
    queryFn: getUpcomingTasks,
  });
};

export const useSearchTasks = (searchTerm: string) => {
  return useQuery({
    queryKey: taskKeys.search(searchTerm),
    queryFn: () => searchTasksByName(searchTerm),
    enabled: !!searchTerm && searchTerm.length > 0,
  });
};

// Mutation hooks
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onMutate: async (newTask) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: taskKeys.byList(newTask.list_id) });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(taskKeys.byList(newTask.list_id));

      // Create optimistic task
      const optimisticTask = {
        id: Date.now(), // Temporary ID
        ...newTask,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_completed: false,
      };

      // Optimistically update tasks by list (keep at the beginning)
      queryClient.setQueryData(taskKeys.byList(newTask.list_id), (old: any) => {
        if (!old) return [optimisticTask];
        return [optimisticTask, ...old];
      });

      // Optimistically update all tasks (keep at the beginning)
      queryClient.setQueryData(taskKeys.tasks(), (old: any) => {
        if (!old) return [optimisticTask];
        return [optimisticTask, ...old];
      });

      return { previousTasks, optimisticTask };
    },
    onError: (err, newTask, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.byList(newTask.list_id), context.previousTasks);
      }
    },
    onSuccess: (newTaskData, variables) => {
      // Update the optimistic task with real data while maintaining position at the top
      queryClient.setQueryData(taskKeys.byList(variables.list_id), (old: any) => {
        if (!old) return old;
        // Find and update the optimistic task, keep it at the beginning
        const updatedTasks = old.map((task: any) => 
          task.id === Date.now() ? { ...newTaskData, id: newTaskData.id } : task
        );
        // Ensure the new task stays at the beginning
        const newTask = updatedTasks.find((task: any) => task.id === newTaskData.id);
        const otherTasks = updatedTasks.filter((task: any) => task.id !== newTaskData.id);
        return newTask ? [newTask, ...otherTasks] : updatedTasks;
      });
      
      // Update all tasks list as well
      queryClient.setQueryData(taskKeys.tasks(), (old: any) => {
        if (!old) return old;
        const updatedTasks = old.map((task: any) => 
          task.id === Date.now() ? { ...newTaskData, id: newTaskData.id } : task
        );
        const newTask = updatedTasks.find((task: any) => task.id === newTaskData.id);
        const otherTasks = updatedTasks.filter((task: any) => task.id !== newTaskData.id);
        return newTask ? [newTask, ...otherTasks] : updatedTasks;
      });
      
      // Only invalidate other related queries, not the main ones
      queryClient.invalidateQueries({ queryKey: taskKeys.completed() });
      queryClient.invalidateQueries({ queryKey: taskKeys.upcoming() });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, task }: { id: number; task: Parameters<typeof updateTask>[1] }) =>
      updateTask(id, task),
    onSuccess: (_, { id, task }) => {
      // Invalidate specific task and all task lists
      queryClient.invalidateQueries({ queryKey: taskKeys.task(id) });
      queryClient.invalidateQueries({ queryKey: taskKeys.tasks() });
      
      // Invalidate specific list tasks if list_id changed
      if (task.list_id) {
        queryClient.invalidateQueries({ queryKey: taskKeys.byList(task.list_id) });
      }
      
      // Invalidate status and priority filters if those changed
      if (task.status) {
        queryClient.invalidateQueries({ queryKey: taskKeys.byStatus(task.status) });
      }
      if (task.priority) {
        queryClient.invalidateQueries({ queryKey: taskKeys.byPriority(task.priority) });
      }
      
      // Invalidate completed and upcoming tasks
      queryClient.invalidateQueries({ queryKey: taskKeys.completed() });
      queryClient.invalidateQueries({ queryKey: taskKeys.upcoming() });
    },
  });
};

export const useToggleTaskCompletion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isCompleted }: { id: number; isCompleted: boolean }) =>
      toggleTaskCompletion(id, isCompleted),
    onMutate: async ({ id, isCompleted }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: taskKeys.task(id) });

      // Snapshot the previous value
      const previousTask = queryClient.getQueryData(taskKeys.task(id));

      // Optimistically update the task
      queryClient.setQueryData(taskKeys.task(id), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          is_completed: isCompleted,
          updated_at: new Date().toISOString(),
        };
      });

      // Optimistically update tasks list
      queryClient.setQueryData(taskKeys.tasks(), (old: any) => {
        if (!old) return old;
        return old.map((task: any) => 
          task.id === id 
            ? { ...task, is_completed: isCompleted, updated_at: new Date().toISOString() }
            : task
        );
      });

      // Optimistically update tasks by list
      queryClient.setQueriesData(
        { queryKey: taskKeys.tasks(), predicate: (query) => query.queryKey[2] === 'byList' },
        (old: any) => {
          if (!old) return old;
          return old.map((task: any) => 
            task.id === id 
              ? { ...task, is_completed: isCompleted, updated_at: new Date().toISOString() }
              : task
          );
        }
      );

      // Return a context object with the snapshotted value
      return { previousTask };
    },
    onError: (err, { id }, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTask) {
        queryClient.setQueryData(taskKeys.task(id), context.previousTask);
      }
    },
    onSuccess: (_, { id }) => {
      // Don't invalidate queries - optimistic update is sufficient
      // Only invalidate related queries that don't affect the main task lists
      queryClient.invalidateQueries({ queryKey: taskKeys.completed() });
      queryClient.invalidateQueries({ queryKey: taskKeys.upcoming() });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onMutate: async (taskId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: taskKeys.task(taskId) });

      // Snapshot the previous values
      const previousTask = queryClient.getQueryData(taskKeys.task(taskId));
      
      // Find which lists this task belongs to
      const allTasks = queryClient.getQueryData(taskKeys.tasks()) as any[] | undefined;
      const taskToDelete = allTasks?.find((task: any) => task.id === taskId);
      
      const previousTasksByList = taskToDelete 
        ? queryClient.getQueryData(taskKeys.byList(taskToDelete.list_id))
        : null;

      // Optimistically remove the task from all queries
      queryClient.setQueryData(taskKeys.task(taskId), undefined);
      
      // Remove from main tasks list
      queryClient.setQueryData(taskKeys.tasks(), (old: any) => {
        if (!old) return [];
        return old.filter((task: any) => task.id !== taskId);
      });

      // Remove from tasks by list for the specific list
      if (taskToDelete) {
        queryClient.setQueryData(taskKeys.byList(taskToDelete.list_id), (old: any) => {
          if (!old) return [];
          return old.filter((task: any) => task.id !== taskId);
        });
      }

      // Remove from all tasks by list queries
      queryClient.setQueriesData(
        { queryKey: taskKeys.tasks(), predicate: (query) => query.queryKey[2] === 'byList' },
        (old: any) => {
          if (!old) return [];
          return old.filter((task: any) => task.id !== taskId);
        }
      );

      return { previousTask, previousTasksByList, taskToDelete };
    },
    onError: (err, taskId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTask) {
        queryClient.setQueryData(taskKeys.task(taskId), context.previousTask);
      }
      
      if (context?.previousTasksByList && context?.taskToDelete) {
        queryClient.setQueryData(taskKeys.byList(context.taskToDelete.list_id), context.previousTasksByList);
      }

      // Restore the task to all queries
      if (context?.taskToDelete) {
        queryClient.setQueryData(taskKeys.tasks(), (old: any) => {
          if (!old) return [context.taskToDelete];
          return [context.taskToDelete, ...old];
        });
      }
    },
    onSuccess: () => {
      // Don't invalidate queries - optimistic update is sufficient
      // Only invalidate related queries that don't include the deleted task
      queryClient.invalidateQueries({ queryKey: taskKeys.completed() });
      queryClient.invalidateQueries({ queryKey: taskKeys.upcoming() });
    },
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateTaskStatus(id, status),
    onMutate: async ({ id, status }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: taskKeys.all });

      // Snapshot the previous values
      const previousTasks = queryClient.getQueryData(taskKeys.tasks());
      const previousTasksByList = queryClient.getQueryData(taskKeys.byList(id));

      // Optimistically update the task status and completion status
      const isCompleted = status === 'completed';
      
      // Update all task queries
      queryClient.setQueryData(taskKeys.tasks(), (old: any) => {
        if (!old) return old;
        return old.map((task: any) =>
          task.id === id ? { ...task, status, is_completed: isCompleted } : task
        );
      });

      // Update tasks by list queries for all lists
      queryClient.setQueriesData(
        { queryKey: taskKeys.tasks(), predicate: (query) => query.queryKey[2] === 'byList' },
        (old: any) => {
          if (!old) return old;
          return old.map((task: any) =>
            task.id === id ? { ...task, status, is_completed: isCompleted } : task
          );
        }
      );

      // Update individual task query
      queryClient.setQueryData(taskKeys.task(id), (old: any) => {
        if (!old) return old;
        return { ...old, status, is_completed: isCompleted };
      });

      return { previousTasks, previousTasksByList };
    },
    onError: (err, { id }, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.tasks(), context.previousTasks);
      }
      if (context?.previousTasksByList) {
        queryClient.setQueryData(taskKeys.byList(id), context.previousTasksByList);
      }
    },
    onSuccess: () => {
      // Don't invalidate queries - optimistic update is sufficient
      // Only invalidate related queries that don't affect the main task lists
      queryClient.invalidateQueries({ queryKey: taskKeys.completed() });
      queryClient.invalidateQueries({ queryKey: taskKeys.upcoming() });
    },
  });
};
