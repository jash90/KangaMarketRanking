/**
 * EmptyState Component Tests
 *
 * Tests for empty state placeholder component.
 */

import { EmptyState } from '@/components';
import { render, screen } from '@testing-library/react-native';
import React from 'react';

describe('EmptyState', () => {
  it('should render with default message', () => {
    render(<EmptyState />);

    expect(screen.getByText('No data available')).toBeOnTheScreen();
  });

  it('should render with custom message', () => {
    render(<EmptyState message="No markets found" />);

    expect(screen.getByText('No markets found')).toBeOnTheScreen();
  });

  it('should render with custom icon', () => {
    render(<EmptyState iconName="search" message="No results" />);

    expect(screen.getByLabelText('No results')).toBeOnTheScreen();
  });

  it('should have proper accessibility attributes', () => {
    render(<EmptyState message="Empty list" />);

    expect(screen.getByLabelText('Empty list')).toBeOnTheScreen();
  });
});
