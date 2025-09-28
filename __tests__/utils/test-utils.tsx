import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';

// Simple render function without complex providers
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { ...options });

// Re-export everything
export * from '@testing-library/react-native';

// Override render method
export { customRender as render };

// Test data factories
export const createMockTask = (overrides: Partial<any> = {}) => ({
  id: 1,
  name: 'Test Task',
  description: 'Test Description',
  priority: 'medium',
  is_completed: false,
  due_date: null,
  list_id: 1,
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z',
  ...overrides,
});

export const createMockList = (overrides: Partial<any> = {}) => ({
  id: 1,
  name: 'Test List',
  description: 'Test List Description',
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z',
  ...overrides,
});

// Mock functions
export const mockOnToggle = jest.fn();
export const mockOnDelete = jest.fn();
export const mockOnPress = jest.fn();

// Simple test to avoid "no tests" error
describe('Test Utils', () => {
  it('should export test utilities', () => {
    expect(createMockTask).toBeDefined();
    expect(createMockList).toBeDefined();
    expect(mockOnToggle).toBeDefined();
    expect(mockOnDelete).toBeDefined();
    expect(mockOnPress).toBeDefined();
  });
});
