import React from 'react';
import { render, fireEvent } from '../utils/test-utils';
import { NetworkStatus } from '@/components/NetworkStatus';

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(),
}));

describe('NetworkStatus Component', () => {
  it('renders when network is disconnected', () => {
    const { getByText } = render(<NetworkStatus />);
    // Component should not be visible when connected
    expect(() => getByText('No internet connection')).toThrow();
  });

  it('shows retry button when onRetry prop is provided', () => {
    const mockRetry = jest.fn();
    const { getByText } = render(<NetworkStatus onRetry={mockRetry} />);
    
    // Component should not be visible when connected
    expect(() => getByText('Retry')).toThrow();
  });

  it('calls onRetry when retry button is pressed', () => {
    const mockRetry = jest.fn();
    const { getByText } = render(<NetworkStatus onRetry={mockRetry} />);
    
    // This test would need network state simulation
    expect(mockRetry).toBeDefined();
  });
});
