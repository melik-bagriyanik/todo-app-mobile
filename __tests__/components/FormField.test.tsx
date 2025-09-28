import React from 'react';
import { render, fireEvent } from '../utils/test-utils';
import { FormField } from '@/components/FormField';

describe('FormField Component', () => {
  const defaultProps = {
    label: 'Test Field',
    value: '',
    onChangeText: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with label', () => {
    const { getByText } = render(<FormField {...defaultProps} />);
    expect(getByText('Test Field')).toBeTruthy();
  });

  it('shows required asterisk when required', () => {
    const { getByText } = render(
      <FormField {...defaultProps} required={true} />
    );
    expect(getByText('*')).toBeTruthy();
  });

  it('shows error message when error is provided', () => {
    const { getByText } = render(
      <FormField 
        {...defaultProps} 
        error="This field is required" 
        touched={true}
      />
    );
    expect(getByText('This field is required')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const mockOnChange = jest.fn();
    const { getByDisplayValue } = render(
      <FormField 
        {...defaultProps} 
        value="test"
        onChangeText={mockOnChange}
      />
    );
    
    const input = getByDisplayValue('test');
    fireEvent.changeText(input, 'new value');
    expect(mockOnChange).toHaveBeenCalledWith('new value');
  });

  it('shows character count when maxLength is provided', () => {
    const { getByText } = render(
      <FormField 
        {...defaultProps} 
        value="test"
        maxLength={10}
      />
    );
    expect(getByText('4/10')).toBeTruthy();
  });

  it('shows left icon when provided', () => {
    const { getByTestId } = render(
      <FormField 
        {...defaultProps} 
        leftIcon="person-outline"
        testID="form-field"
      />
    );
    expect(getByTestId('form-field')).toBeTruthy();
  });

  it('shows right icon when provided', () => {
    const mockRightIconPress = jest.fn();
    const { getByTestId } = render(
      <FormField 
        {...defaultProps} 
        rightIcon="eye-outline"
        onRightIconPress={mockRightIconPress}
        testID="form-field"
      />
    );
    
    const rightIcon = getByTestId('form-field').parent?.parent?.children[1];
    fireEvent.press(rightIcon);
    expect(mockRightIconPress).toHaveBeenCalledTimes(1);
  });

  it('applies error styling when has error', () => {
    const { getByTestId } = render(
      <FormField 
        {...defaultProps} 
        error="Error message"
        touched={true}
        testID="form-field"
      />
    );
    
    const input = getByTestId('form-field');
    expect(input.props.className).toContain('border-red-500');
  });

  it('applies disabled styling when disabled', () => {
    const { getByTestId } = render(
      <FormField 
        {...defaultProps} 
        disabled={true}
        testID="form-field"
      />
    );
    
    const input = getByTestId('form-field');
    expect(input.props.className).toContain('bg-gray-100');
  });
});
