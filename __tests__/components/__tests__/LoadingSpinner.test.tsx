/**
 * LoadingSpinner Component Tests
 *
 * Tests for loading state indicator component.
 */

import { LoadingSpinner } from '@/components';
import { render, screen } from '@testing-library/react-native';
import React from 'react';

describe('LoadingSpinner', () => {
  it('should render with default message', () => {
    render(<LoadingSpinner />);

    expect(screen.getByText('Loading...')).toBeOnTheScreen();
  });

  it('should render with custom message', () => {
    render(<LoadingSpinner message="Loading markets..." />);

    expect(screen.getByText('Loading markets...')).toBeOnTheScreen();
  });

  it('should have proper accessibility attributes', () => {
    render(<LoadingSpinner message="Loading data..." />);

    expect(screen.getByLabelText('Loading data...')).toBeOnTheScreen();
  });
});
