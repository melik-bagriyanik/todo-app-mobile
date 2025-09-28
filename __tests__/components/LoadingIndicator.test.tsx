import React from 'react';
import { render } from '../utils/test-utils';
import { LoadingIndicator } from '@/components/LoadingIndicator';

describe('LoadingIndicator Component', () => {
  it('renders loading indicator', () => {
    const { getByText } = render(<LoadingIndicator />);
    expect(getByText('Loading...')).toBeTruthy();
  });
});
