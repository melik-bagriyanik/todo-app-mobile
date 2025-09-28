import React from 'react';
import { render, fireEvent } from '../utils/test-utils';
import { AsyncWrapper } from '@/components/AsyncWrapper';

describe('AsyncWrapper Component', () => {
  it('renders children when not loading and no error', () => {
    const { getByText } = render(
      <AsyncWrapper loading={false} error={null}>
        <Text>Content</Text>
      </AsyncWrapper>
    );
    
    expect(getByText('Content')).toBeTruthy();
  });

  it('shows loading state', () => {
    const { getByText } = render(
      <AsyncWrapper loading={true} error={null} loadingMessage="Loading data...">
        <Text>Content</Text>
      </AsyncWrapper>
    );
    
    expect(getByText('Loading data...')).toBeTruthy();
  });

  it('shows error state with retry button', () => {
    const mockRetry = jest.fn();
    const error = new Error('Test error');
    
    const { getByText } = render(
      <AsyncWrapper 
        loading={false} 
        error={error} 
        onRetry={mockRetry}
        errorMessage="Something went wrong"
      >
        <Text>Content</Text>
      </AsyncWrapper>
    );
    
    expect(getByText('Oops!')).toBeTruthy();
    expect(getByText('Something went wrong')).toBeTruthy();
    expect(getByText('Try Again')).toBeTruthy();
  });

  it('calls onRetry when retry button is pressed', () => {
    const mockRetry = jest.fn();
    const error = new Error('Test error');
    
    const { getByText } = render(
      <AsyncWrapper 
        loading={false} 
        error={error} 
        onRetry={mockRetry}
      >
        <Text>Content</Text>
      </AsyncWrapper>
    );
    
    fireEvent.press(getByText('Try Again'));
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('shows error without retry button when showRefreshButton is false', () => {
    const error = new Error('Test error');
    
    const { getByText, queryByText } = render(
      <AsyncWrapper 
        loading={false} 
        error={error} 
        showRefreshButton={false}
      >
        <Text>Content</Text>
      </AsyncWrapper>
    );
    
    expect(getByText('Oops!')).toBeTruthy();
    expect(queryByText('Try Again')).toBeNull();
  });
});
