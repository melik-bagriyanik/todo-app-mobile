import {
  getAllTasks,
  getTaskById,
  getTasksByListId,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  searchTasksByName,
  getTasksByStatus,
  getTasksByPriority,
  getUpcomingTasks,
  getCompletedTasks,
} from '@/queries/tasks';
import { db } from '@/db';
import { simulateNetworkLatency } from '@/queries/utils';

// Mock the database
jest.mock('@/db', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

// Mock the utils
jest.mock('@/queries/utils', () => ({
  simulateNetworkLatency: jest.fn(),
}));

const mockDb = db as jest.Mocked<typeof db>;

describe('Task Queries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (simulateNetworkLatency as jest.Mock).mockResolvedValue(undefined);
  });

  describe('getAllTasks', () => {
    it('should return all tasks', async () => {
      const mockTasks = [
        { id: 1, name: 'Task 1' },
        { id: 2, name: 'Task 2' },
      ];
      
      const mockSelect = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          all: jest.fn().mockResolvedValue(mockTasks),
        }),
      });
      
      mockDb.select.mockReturnValue(mockSelect());

      const result = await getAllTasks();

      expect(simulateNetworkLatency).toHaveBeenCalled();
      expect(result).toEqual(mockTasks);
    });
  });

  describe('getTaskById', () => {
    it('should return a specific task by id', async () => {
      const mockTask = { id: 1, name: 'Task 1' };
      
      const mockSelect = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            get: jest.fn().mockResolvedValue(mockTask),
          }),
        }),
      });
      
      mockDb.select.mockReturnValue(mockSelect());

      const result = await getTaskById(1);

      expect(simulateNetworkLatency).toHaveBeenCalled();
      expect(result).toEqual(mockTask);
    });
  });

  describe('getTasksByListId', () => {
    it('should return tasks for a specific list', async () => {
      const mockTasks = [
        { id: 1, name: 'Task 1', list_id: 1 },
        { id: 2, name: 'Task 2', list_id: 1 },
      ];
      
      const mockSelect = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            all: jest.fn().mockResolvedValue(mockTasks),
          }),
        }),
      });
      
      mockDb.select.mockReturnValue(mockSelect());

      const result = await getTasksByListId(1);

      expect(simulateNetworkLatency).toHaveBeenCalled();
      expect(result).toEqual(mockTasks);
    });
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const taskData = {
        name: 'New Task',
        description: 'New Description',
        list_id: 1,
      };
      
      const mockInsert = jest.fn().mockReturnValue({
        values: jest.fn().mockReturnValue({
          run: jest.fn().mockResolvedValue({}),
        }),
      });
      
      mockDb.insert.mockReturnValue(mockInsert());

      await createTask(taskData);

      expect(simulateNetworkLatency).toHaveBeenCalled();
      expect(mockDb.insert).toHaveBeenCalled();
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', async () => {
      const updateData = { name: 'Updated Task' };
      
      const mockUpdate = jest.fn().mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            run: jest.fn().mockResolvedValue({}),
          }),
        }),
      });
      
      mockDb.update.mockReturnValue(mockUpdate());

      await updateTask(1, updateData);

      expect(simulateNetworkLatency).toHaveBeenCalled();
      expect(mockDb.update).toHaveBeenCalled();
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const mockDelete = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          run: jest.fn().mockResolvedValue({}),
        }),
      });
      
      mockDb.delete.mockReturnValue(mockDelete());

      await deleteTask(1);

      expect(simulateNetworkLatency).toHaveBeenCalled();
      expect(mockDb.delete).toHaveBeenCalled();
    });
  });

  describe('toggleTaskCompletion', () => {
    it('should toggle task completion status', async () => {
      const mockUpdate = jest.fn().mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            run: jest.fn().mockResolvedValue({}),
          }),
        }),
      });
      
      mockDb.update.mockReturnValue(mockUpdate());

      await toggleTaskCompletion(1, true);

      expect(simulateNetworkLatency).toHaveBeenCalled();
      expect(mockDb.update).toHaveBeenCalled();
    });
  });

  describe('searchTasksByName', () => {
    it('should search tasks by name', async () => {
      const mockTasks = [
        { id: 1, name: 'Task with search term' },
      ];
      
      const mockSelect = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            all: jest.fn().mockResolvedValue(mockTasks),
          }),
        }),
      });
      
      mockDb.select.mockReturnValue(mockSelect());

      const result = await searchTasksByName('search');

      expect(simulateNetworkLatency).toHaveBeenCalled();
      expect(result).toEqual(mockTasks);
    });
  });

  describe('getTasksByStatus', () => {
    it('should return tasks by status', async () => {
      const mockTasks = [
        { id: 1, name: 'Task 1', status: 'in_progress' },
      ];
      
      const mockSelect = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            all: jest.fn().mockResolvedValue(mockTasks),
          }),
        }),
      });
      
      mockDb.select.mockReturnValue(mockSelect());

      const result = await getTasksByStatus('in_progress');

      expect(simulateNetworkLatency).toHaveBeenCalled();
      expect(result).toEqual(mockTasks);
    });
  });

  describe('getTasksByPriority', () => {
    it('should return tasks by priority', async () => {
      const mockTasks = [
        { id: 1, name: 'Task 1', priority: 'high' },
      ];
      
      const mockSelect = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            all: jest.fn().mockResolvedValue(mockTasks),
          }),
        }),
      });
      
      mockDb.select.mockReturnValue(mockSelect());

      const result = await getTasksByPriority('high');

      expect(simulateNetworkLatency).toHaveBeenCalled();
      expect(result).toEqual(mockTasks);
    });
  });

  describe('getUpcomingTasks', () => {
    it('should return upcoming tasks', async () => {
      const mockTasks = [
        { id: 1, name: 'Upcoming Task', due_date: '2024-12-31T23:59:59.000Z' },
      ];
      
      const mockSelect = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            orderBy: jest.fn().mockReturnValue({
              all: jest.fn().mockResolvedValue(mockTasks),
            }),
          }),
        }),
      });
      
      mockDb.select.mockReturnValue(mockSelect());

      const result = await getUpcomingTasks();

      expect(simulateNetworkLatency).toHaveBeenCalled();
      expect(result).toEqual(mockTasks);
    });
  });

  describe('getCompletedTasks', () => {
    it('should return completed tasks', async () => {
      const mockTasks = [
        { id: 1, name: 'Completed Task', is_completed: true },
      ];
      
      const mockSelect = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            orderBy: jest.fn().mockReturnValue({
              all: jest.fn().mockResolvedValue(mockTasks),
            }),
          }),
        }),
      });
      
      mockDb.select.mockReturnValue(mockSelect());

      const result = await getCompletedTasks();

      expect(simulateNetworkLatency).toHaveBeenCalled();
      expect(result).toEqual(mockTasks);
    });
  });
});
