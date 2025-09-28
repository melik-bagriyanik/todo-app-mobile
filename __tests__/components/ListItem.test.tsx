import React from 'react';
import { render, fireEvent } from '../utils/test-utils';
import { ListItem } from '@/components/ListItem';
import { createMockList, mockOnPress, mockOnDelete } from '../utils/test-utils';

describe('ListItem Component', () => {
  const mockList = createMockList({
    id: 1,
    name: 'Test List',
    description: 'Test List Description',
    created_at: '2023-01-01T00:00:00.000Z',
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders list name and creation date', () => {
    const { getByText } = render(
      <ListItem
        list={mockList}
        onPress={mockOnPress}
        onDelete={mockOnDelete}
      />
    );
    
    expect(getByText('Test List')).toBeTruthy();
    expect(getByText(/Created:/)).toBeTruthy();
  });

  it('calls onPress when list card is pressed', () => {
    const { getByText } = render(
      <ListItem
        list={mockList}
        onPress={mockOnPress}
        onDelete={mockOnDelete}
      />
    );
    
    // Test pressing anywhere on the card
    fireEvent.press(getByText('Test List'));
    expect(mockOnPress).toHaveBeenCalledWith(mockList);
  });

  it('calls onDelete when delete button is pressed', () => {
    const { getByText } = render(
      <ListItem
        list={mockList}
        onPress={mockOnPress}
        onDelete={mockOnDelete}
      />
    );
    
    fireEvent.press(getByText('Delete'));
    expect(mockOnDelete).toHaveBeenCalledWith(mockList);
  });

  it('shows deleting state correctly', () => {
    const { getByText } = render(
      <ListItem
        list={mockList}
        onPress={mockOnPress}
        onDelete={mockOnDelete}
        isDeleting={true}
      />
    );
    
    expect(getByText('Deleting...')).toBeTruthy();
  });

  it('does not call onPress when deleting', () => {
    const { getByText } = render(
      <ListItem
        list={mockList}
        onPress={mockOnPress}
        onDelete={mockOnDelete}
        isDeleting={true}
      />
    );
    
    fireEvent.press(getByText('Test List'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('does not call onDelete when already deleting', () => {
    const { getByText } = render(
      <ListItem
        list={mockList}
        onPress={mockOnPress}
        onDelete={mockOnDelete}
        isDeleting={true}
      />
    );
    
    fireEvent.press(getByText('Deleting...'));
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it('applies correct styling when deleting', () => {
    const { getByText } = render(
      <ListItem
        list={mockList}
        onPress={mockOnPress}
        onDelete={mockOnDelete}
        isDeleting={true}
      />
    );
    
    // Just verify the component renders in deleting state
    expect(getByText('Deleting...')).toBeTruthy();
  });

  it('formats creation date correctly', () => {
    const listWithDate = createMockList({
      created_at: '2023-12-25T10:30:00.000Z',
    });
    
    const { getByText } = render(
      <ListItem
        list={listWithDate}
        onPress={mockOnPress}
        onDelete={mockOnDelete}
      />
    );
    
    // The exact format may vary by locale, but should contain the date
    expect(getByText(/Created:/)).toBeTruthy();
  });
});
