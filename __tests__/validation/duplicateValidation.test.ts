import { describe, it, expect, jest } from '@jest/globals';

// Mock data
const mockLists = [
  { id: 1, name: 'Work Tasks', created_at: '2023-01-01' },
  { id: 2, name: 'Personal Tasks', created_at: '2023-01-02' },
];

const mockTasks = [
  { id: 1, name: 'Buy groceries', list_id: 1, status: 'pending' },
  { id: 2, name: 'Call mom', list_id: 1, status: 'completed' },
  { id: 3, name: 'Read book', list_id: 2, status: 'pending' },
];

describe('Duplicate Validation', () => {
  describe('List Name Validation', () => {
    it('should detect duplicate list names (case insensitive)', () => {
      const newListName = 'work tasks';
      const existingList = mockLists.find(list => 
        list.name.toLowerCase() === newListName.toLowerCase()
      );
      
      expect(existingList).toBeTruthy();
      expect(existingList?.name).toBe('Work Tasks');
    });

    it('should allow unique list names', () => {
      const newListName = 'Shopping List';
      const existingList = mockLists.find(list => 
        list.name.toLowerCase() === newListName.toLowerCase()
      );
      
      expect(existingList).toBeFalsy();
    });

    it('should handle trimmed names', () => {
      const newListName = '  Personal Tasks  ';
      const trimmedName = newListName.trim();
      const existingList = mockLists.find(list => 
        list.name.toLowerCase() === trimmedName.toLowerCase()
      );
      
      expect(existingList).toBeTruthy();
    });
  });

  describe('Task Name Validation', () => {
    it('should detect duplicate task names in the same list', () => {
      const listId = 1;
      const newTaskName = 'buy groceries';
      const existingTask = mockTasks.find(task => 
        task.list_id === listId && 
        task.name.toLowerCase() === newTaskName.toLowerCase()
      );
      
      expect(existingTask).toBeTruthy();
      expect(existingTask?.name).toBe('Buy groceries');
    });

    it('should allow duplicate task names in different lists', () => {
      const listId = 2;
      const newTaskName = 'buy groceries';
      const existingTask = mockTasks.find(task => 
        task.list_id === listId && 
        task.name.toLowerCase() === newTaskName.toLowerCase()
      );
      
      expect(existingTask).toBeFalsy();
    });

    it('should allow unique task names in the same list', () => {
      const listId = 1;
      const newTaskName = 'Go to gym';
      const existingTask = mockTasks.find(task => 
        task.list_id === listId && 
        task.name.toLowerCase() === newTaskName.toLowerCase()
      );
      
      expect(existingTask).toBeFalsy();
    });

    it('should handle trimmed task names', () => {
      const listId = 1;
      const newTaskName = '  Call Mom  ';
      const trimmedName = newTaskName.trim();
      const existingTask = mockTasks.find(task => 
        task.list_id === listId && 
        task.name.toLowerCase() === trimmedName.toLowerCase()
      );
      
      expect(existingTask).toBeTruthy();
    });
  });

  describe('Case Insensitive Validation', () => {
    it('should be case insensitive for list names', () => {
      const testCases = [
        { input: 'WORK TASKS', expected: true },
        { input: 'Work Tasks', expected: true },
        { input: 'work tasks', expected: true },
        { input: 'WoRk TaSkS', expected: true },
        { input: 'Shopping List', expected: false },
      ];

      testCases.forEach(({ input, expected }) => {
        const existingList = mockLists.find(list => 
          list.name.toLowerCase() === input.toLowerCase()
        );
        expect(!!existingList).toBe(expected);
      });
    });

    it('should be case insensitive for task names', () => {
      const listId = 1;
      const testCases = [
        { input: 'BUY GROCERIES', expected: true },
        { input: 'Buy Groceries', expected: true },
        { input: 'buy groceries', expected: true },
        { input: 'BuY gRoCeRiEs', expected: true },
        { input: 'Go to gym', expected: false },
      ];

      testCases.forEach(({ input, expected }) => {
        const existingTask = mockTasks.find(task => 
          task.list_id === listId && 
          task.name.toLowerCase() === input.toLowerCase()
        );
        expect(!!existingTask).toBe(expected);
      });
    });
  });
});
