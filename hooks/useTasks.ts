/**
 * Custom hooks for task management using TanStack Query
 * Provides optimistic updates and proper cache management
 */
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

/**
 * Query key factory for task-related queries
 * Ensures consistent cache invalidation and query management
 */
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

//  QUERY HOOKS 

/**
 * Fetches all tasks
 */
export const useTasks = () => {
  return useQuery({
    queryKey: taskKeys.tasks(),
    queryFn: getAllTasks,
  });
};

/**
 * Fetches a single task by ID
 */
export const useTask = (id: number) => {
  return useQuery({
    queryKey: taskKeys.task(id),
    queryFn: () => getTaskById(id),
    enabled: !!id,
  });
};

/**
 * Fetches all tasks for a specific list
 */
export const useTasksByList = (listId: number) => {
  return useQuery({
    queryKey: taskKeys.byList(listId),
    queryFn: () => getTasksByListId(listId),
    enabled: !!listId,
  });
};

/**
 * Fetches tasks filtered by status
 */
export const useTasksByStatus = (status: string) => {
  return useQuery({
    queryKey: taskKeys.byStatus(status),
    queryFn: () => getTasksByStatus(status),
    enabled: !!status,
  });
};

/**
 * Fetches tasks filtered by priority
 */
export const useTasksByPriority = (priority: string) => {
  return useQuery({
    queryKey: taskKeys.byPriority(priority),
    queryFn: () => getTasksByPriority(priority),
    enabled: !!priority,
  });
};

/**
 * Fetches all completed tasks
 */
export const useCompletedTasks = () => {
  return useQuery({
    queryKey: taskKeys.completed(),
    queryFn: getCompletedTasks,
  });
};

/**
 * Fetches upcoming tasks (due soon)
 */
export const useUpcomingTasks = () => {
  return useQuery({
    queryKey: taskKeys.upcoming(),
    queryFn: getUpcomingTasks,
  });
};

/**
 * Searches tasks by name
 */
export const useSearchTasks = (searchTerm: string) => {
  return useQuery({
    queryKey: taskKeys.search(searchTerm),
    queryFn: () => searchTasksByName(searchTerm),
    enabled: !!searchTerm && searchTerm.length > 0,
  });
};

//  OPTIMISTIC UPDATE HELPERS 

/**
 * Creates an optimistic task with temporary ID
 */
const createOptimisticTask = (newTask: any) => ({
  id: Date.now(), // Temporary ID
  ...newTask,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_completed: false,
});

/**
 * Updates task completion status optimistically
 */
const updateTaskCompletionStatus = (task: any, isCompleted: boolean) => ({
  ...task,
  is_completed: isCompleted,
  status: isCompleted ? 'completed' : 'pending',
  updated_at: new Date().toISOString(),
});

/**
 * Filters tasks based on status filter
 */
const filterTasksByStatus = (tasks: any[], filter: string) => {
  if (!filter || filter === 'all') return tasks;
  
  return tasks.filter((task: any) => {
    if (filter === 'completed') return task.is_completed;
    if (filter === 'pending') return !task.is_completed && task.status === 'pending';
    if (filter === 'in_progress') return task.status === 'in_progress';
    return true;
  });
};

//  MUTATION HOOKS 

/**
 * Hook for creating new tasks with optimistic updates
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onMutate: async (newTask) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: taskKeys.byList(newTask.list_id) });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(taskKeys.byList(newTask.list_id));

      // Create optimistic task using helper function
      const optimisticTask = createOptimisticTask(newTask);

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
      // Rollback optimistic updates on error
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.byList(newTask.list_id), context.previousTasks);
      }
    },
    onSuccess: (newTaskData, variables) => {
      // Update the optimistic task with real data while maintaining position at the top
      const updateTaskInQuery = (queryKey: readonly string[]) => {
        queryClient.setQueryData(queryKey as any, (old: any) => {
          if (!old) return old;
          const updatedTasks = old.map((task: any) => 
            task.id === Date.now() ? { ...newTaskData, id: (newTaskData as any).id } : task
          );
          const newTask = updatedTasks.find((task: any) => task.id === (newTaskData as any).id);
          const otherTasks = updatedTasks.filter((task: any) => task.id !== (newTaskData as any).id);
          return newTask ? [newTask, ...otherTasks] : updatedTasks;
        });
      };

      updateTaskInQuery(taskKeys.byList(variables.list_id));
      updateTaskInQuery(taskKeys.tasks());
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: taskKeys.completed() });
      queryClient.invalidateQueries({ queryKey: taskKeys.upcoming() });
    },
  });
};

/**
 * Hook for updating existing tasks
 */
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

/**
 * Hook for toggling task completion status with optimistic updates
 */
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

      // Helper function to update task completion status
      const updateTaskStatus = (task: any) => 
        task.id === id ? updateTaskCompletionStatus(task, isCompleted) : task;

      // Optimistically update the individual task
      queryClient.setQueryData(taskKeys.task(id), (old: any) => {
        if (!old) return old;
        return updateTaskCompletionStatus(old, isCompleted);
      });

      // Optimistically update tasks list
      queryClient.setQueryData(taskKeys.tasks(), (old: any) => {
        if (!old) return old;
        return old.map(updateTaskStatus);
      });

      // Optimistically update tasks by list
      queryClient.setQueriesData(
        { queryKey: taskKeys.tasks(), predicate: (query) => query.queryKey[2] === 'byList' },
        (old: any) => {
          if (!old) return old;
          return old.map(updateTaskStatus);
        }
      );

      // Update status filter queries with proper filtering
      queryClient.setQueriesData(
        { queryKey: taskKeys.tasks(), predicate: (query) => query.queryKey[2] === 'byStatus' },
        (old: any, query: any) => {
          if (!old) return old;
          const updatedTasks = old.map(updateTaskStatus);
          
          // Get the current filter status from query key
          const currentFilter = query?.queryKey?.[3];
          return filterTasksByStatus(updatedTasks, currentFilter);
        }
      );

      return { previousTask };
    },
    onError: (err, { id }, context) => {
      // Rollback optimistic updates on error
      if (context?.previousTask) {
        queryClient.setQueryData(taskKeys.task(id), context.previousTask);
      }
    },
    onSuccess: (_, { id }) => {
      // Invalidate filter queries to refresh them
      queryClient.invalidateQueries({ 
        queryKey: taskKeys.tasks(), 
        predicate: (query) => query.queryKey[2] === 'byStatus' 
      });
      queryClient.invalidateQueries({ 
        queryKey: taskKeys.tasks(), 
        predicate: (query) => query.queryKey[2] === 'byPriority' 
      });
      queryClient.invalidateQueries({ queryKey: taskKeys.completed() });
      queryClient.invalidateQueries({ queryKey: taskKeys.upcoming() });
    },
  });
};

/**
 * Hook for deleting tasks with optimistic updates
 */
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

      // Helper function to remove task from query data
      const removeTaskFromQuery = (old: any) => {
        if (!old) return [];
        return old.filter((task: any) => task.id !== taskId);
      };

      // Optimistically remove the task from all queries
      queryClient.setQueryData(taskKeys.task(taskId), undefined);
      
      // Remove from main tasks list
      queryClient.setQueryData(taskKeys.tasks(), removeTaskFromQuery);

      // Remove from tasks by list for the specific list
      if (taskToDelete) {
        queryClient.setQueryData(taskKeys.byList(taskToDelete.list_id), removeTaskFromQuery);
      }

      // Remove from all tasks by list queries
      queryClient.setQueriesData(
        { queryKey: taskKeys.tasks(), predicate: (query) => query.queryKey[2] === 'byList' },
        removeTaskFromQuery
      );

      return { previousTask, previousTasksByList, taskToDelete };
    },
    onError: (err, taskId, context) => {
      // Rollback optimistic updates on error
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
      // Only invalidate related queries that don't include the deleted task
      queryClient.invalidateQueries({ queryKey: taskKeys.completed() });
      queryClient.invalidateQueries({ queryKey: taskKeys.upcoming() });
    },
  });
};

/**
 * Hook for updating task status with optimistic updates
 */
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
      
      // Helper function to update task status
      const updateTaskStatusInQuery = (task: any) =>
        task.id === id ? updateTaskCompletionStatus({ ...task, status }, isCompleted) : task;
      
      // Update all task queries
      queryClient.setQueryData(taskKeys.tasks(), (old: any) => {
        if (!old) return old;
        return old.map(updateTaskStatusInQuery);
      });

      // Update tasks by list queries for all lists
      queryClient.setQueriesData(
        { queryKey: taskKeys.tasks(), predicate: (query) => query.queryKey[2] === 'byList' },
        (old: any) => {
          if (!old) return old;
          return old.map(updateTaskStatusInQuery);
        }
      );

      // Update status filter queries with proper filtering
      queryClient.setQueriesData(
        { queryKey: taskKeys.tasks(), predicate: (query) => query.queryKey[2] === 'byStatus' },
        (old: any, query: any) => {
          if (!old) return old;
          const updatedTasks = old.map(updateTaskStatusInQuery);
          
          // Get the current filter status from query key
          const currentFilter = query?.queryKey?.[3];
          return filterTasksByStatus(updatedTasks, currentFilter);
        }
      );

      // Update priority filter queries
      queryClient.setQueriesData(
        { queryKey: taskKeys.tasks(), predicate: (query) => query.queryKey[2] === 'byPriority' },
        (old: any) => {
          if (!old) return old;
          return old.map(updateTaskStatusInQuery);
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
      // Rollback optimistic updates on error
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.tasks(), context.previousTasks);
      }
      if (context?.previousTasksByList) {
        queryClient.setQueryData(taskKeys.byList(id), context.previousTasksByList);
      }
    },
    onSuccess: () => {
      // Invalidate filter queries to refresh them
      queryClient.invalidateQueries({ 
        queryKey: taskKeys.tasks(), 
        predicate: (query) => query.queryKey[2] === 'byStatus' 
      });
      queryClient.invalidateQueries({ 
        queryKey: taskKeys.tasks(), 
        predicate: (query) => query.queryKey[2] === 'byPriority' 
      });
      queryClient.invalidateQueries({ queryKey: taskKeys.completed() });
      queryClient.invalidateQueries({ queryKey: taskKeys.upcoming() });
    },
  });
};
