import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
  useTasks,
  useTask,
  useTasksByList,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useToggleTaskCompletion,
} from '@/hooks/useTasks';
import * as taskQueries from '@/queries/tasks';

// Mock the queries module
jest.mock('@/queries/tasks');
const mockedTaskQueries = taskQueries as jest.Mocked<typeof taskQueries>;

describe('useTasks Hook', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    });
    jest.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  afterAll(() => {
    queryClient.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe('useTasks', () => {
    it('should fetch all tasks', async () => {
      const mockTasks = [
        { id: 1, name: 'Task 1', is_completed: false },
        { id: 2, name: 'Task 2', is_completed: true },
      ];
      mockedTaskQueries.getAllTasks.mockResolvedValue(mockTasks);

      const { result } = renderHook(() => useTasks(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockTasks);
      expect(mockedTaskQueries.getAllTasks).toHaveBeenCalledTimes(1);
    });

    it('should handle error state', async () => {
      const error = new Error('Failed to fetch tasks');
      mockedTaskQueries.getAllTasks.mockRejectedValue(error);

      const { result } = renderHook(() => useTasks(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useTask', () => {
    it('should fetch a specific task by id', async () => {
      const mockTask = { id: 1, name: 'Task 1', is_completed: false };
      mockedTaskQueries.getTaskById.mockResolvedValue(mockTask);

      const { result } = renderHook(() => useTask(1), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockTask);
      expect(mockedTaskQueries.getTaskById).toHaveBeenCalledWith(1);
    });

    it('should not fetch when id is falsy', () => {
      const { result } = renderHook(() => useTask(0), { wrapper });

      expect(result.current.isLoading).toBe(false);
      expect(mockedTaskQueries.getTaskById).not.toHaveBeenCalled();
    });
  });

  describe('useTasksByList', () => {
    it('should fetch tasks by list id', async () => {
      const mockTasks = [
        { id: 1, name: 'Task 1', list_id: 1 },
        { id: 2, name: 'Task 2', list_id: 1 },
      ];
      mockedTaskQueries.getTasksByListId.mockResolvedValue(mockTasks);

      const { result } = renderHook(() => useTasksByList(1), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockTasks);
      expect(mockedTaskQueries.getTasksByListId).toHaveBeenCalledWith(1);
    });
  });

  describe('useCreateTask', () => {
    it('should create a new task', async () => {
      const newTask = {
        name: 'New Task',
        description: 'New Description',
        list_id: 1,
      };
      mockedTaskQueries.createTask.mockResolvedValue({} as any);

      const { result } = renderHook(() => useCreateTask(), { wrapper });

      result.current.mutate(newTask);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedTaskQueries.createTask).toHaveBeenCalledWith(newTask, expect.any(Object));
    });

    it('should handle create task error', async () => {
      const error = new Error('Failed to create task');
      mockedTaskQueries.createTask.mockRejectedValue(error);

      const { result } = renderHook(() => useCreateTask(), { wrapper });

      result.current.mutate({
        name: 'New Task',
        list_id: 1,
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useUpdateTask', () => {
    it('should update a task', async () => {
      const updateData = { name: 'Updated Task' };
      mockedTaskQueries.updateTask.mockResolvedValue({} as any);

      const { result } = renderHook(() => useUpdateTask(), { wrapper });

      result.current.mutate({ id: 1, task: updateData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedTaskQueries.updateTask).toHaveBeenCalledWith(1, updateData);
    });
  });

  describe('useDeleteTask', () => {
    it('should delete a task', async () => {
      mockedTaskQueries.deleteTask.mockResolvedValue({} as any);

      const { result } = renderHook(() => useDeleteTask(), { wrapper });

      result.current.mutate(1);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedTaskQueries.deleteTask).toHaveBeenCalledWith(1, expect.any(Object));
    });
  });

  describe('useToggleTaskCompletion', () => {
    it('should toggle task completion', async () => {
      mockedTaskQueries.toggleTaskCompletion.mockResolvedValue({} as any);

      const { result } = renderHook(() => useToggleTaskCompletion(), { wrapper });

      result.current.mutate({ id: 1, isCompleted: true });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedTaskQueries.toggleTaskCompletion).toHaveBeenCalledWith(1, true);
    });
  });
});
