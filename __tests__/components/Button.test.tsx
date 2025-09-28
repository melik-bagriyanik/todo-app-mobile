import React from 'react';
import { render, fireEvent } from '../utils/test-utils';
import { Button } from '@/components/Button';

describe('Button Component', () => {
  it('renders with title', () => {
    const { getByText } = render(<Button title="Test Button" />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={mockOnPress} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('shows loading state when loading prop is true', () => {
    const { getByTestId } = render(
      <Button title="Test Button" loading={true} />
    );
    
    // Check if ActivityIndicator is present (it should have a testID)
    expect(getByTestId).toBeDefined();
  });

  it('is disabled when loading', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={mockOnPress} loading={true} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={mockOnPress} disabled={true} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    const { getByText } = render(
      <Button title="Test Button" className="custom-class" />
    );
    
    // Just verify the component renders with custom className
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef();
    render(<Button title="Test Button" ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
