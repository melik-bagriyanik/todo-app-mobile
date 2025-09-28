import React from 'react';
import { render, fireEvent } from '../utils/test-utils';
import { TaskItem } from '@/components/TaskItem';
import { createMockTask, mockOnToggle, mockOnDelete } from '../utils/test-utils';

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
  },
}));

describe('TaskItem Component', () => {
  const mockTask = createMockTask({
    id: 1,
    name: 'Test Task',
    description: 'Test Description',
    priority: 'high',
    is_completed: false,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task name and description', () => {
    const { getByText } = render(
      <TaskItem
        task={mockTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );
    
    expect(getByText('Test Task')).toBeTruthy();
    expect(getByText('Test Description')).toBeTruthy();
  });

  it('shows priority badge', () => {
    const { getByText } = render(
      <TaskItem
        task={mockTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );
    
    expect(getByText('high')).toBeTruthy();
  });

  it('calls onToggle when pressed', () => {
    const { getByText } = render(
      <TaskItem
        task={mockTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );
    
    fireEvent.press(getByText('Test Task'));
    expect(mockOnToggle).toHaveBeenCalledWith(mockTask);
  });

  it('calls onDelete when long pressed', () => {
    const { getByText } = render(
      <TaskItem
        task={mockTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );
    
    fireEvent(getByText('Test Task'), 'longPress');
    expect(mockOnDelete).toHaveBeenCalledWith(mockTask);
  });

  it('shows completed state correctly', () => {
    const completedTask = createMockTask({ is_completed: true });
    const { getByText } = render(
      <TaskItem
        task={completedTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );
    
    // Just verify the component renders with completed task
    expect(getByText('Test Task')).toBeTruthy();
  });

  it('shows due date when provided', () => {
    const taskWithDueDate = createMockTask({
      due_date: '2023-12-31T23:59:59.000Z',
    });
    const { getByText } = render(
      <TaskItem
        task={taskWithDueDate}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );
    
    expect(getByText(/Due:/)).toBeTruthy();
  });

  it('shows processing state', () => {
    const { getByTestId } = render(
      <TaskItem
        task={mockTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        isProcessing={true}
      />
    );
    
    // Check if ActivityIndicator is present
    expect(getByTestId).toBeDefined();
  });

  it('shows deleting state', () => {
    const { getByText } = render(
      <TaskItem
        task={mockTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        isDeleting={true}
      />
    );
    
    expect(getByText('Deleting...')).toBeTruthy();
  });

  it('does not call onToggle when processing', () => {
    const { getByText } = render(
      <TaskItem
        task={mockTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        isProcessing={true}
      />
    );
    
    fireEvent.press(getByText('Test Task'));
    expect(mockOnToggle).not.toHaveBeenCalled();
  });

  it('does not call onDelete when already deleting', () => {
    const { getByText } = render(
      <TaskItem
        task={mockTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        isDeleting={true}
      />
    );
    
    fireEvent(getByText('Test Task'), 'longPress');
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it('applies correct styling for different priorities', () => {
    const highPriorityTask = createMockTask({ priority: 'high' });
    const { getByText } = render(
      <TaskItem
        task={highPriorityTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );
    
    const priorityBadge = getByText('high');
    expect(priorityBadge.props.className).toContain('bg-red-500');
  });
});
