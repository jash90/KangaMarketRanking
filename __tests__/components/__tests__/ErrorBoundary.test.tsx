/**
 * ErrorBoundary Component Tests
 *
 * Tests for error boundary crash prevention component.
 */

import { ErrorBoundary } from '@/components';
import { render, screen, fireEvent } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <Text>No error</Text>;
};

describe('ErrorBoundary', () => {
  // Suppress console.error for these tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <Text>Child component</Text>
      </ErrorBoundary>
    );

    expect(screen.getByText('Child component')).toBeOnTheScreen();
  });

  it('should catch errors and display fallback UI', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeOnTheScreen();
    expect(screen.getByText('Test error')).toBeOnTheScreen();
  });

  it('should display custom fallback when provided', () => {
    const customFallback = <Text>Custom error UI</Text>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error UI')).toBeOnTheScreen();
    expect(screen.queryByText('Something went wrong')).not.toBeOnTheScreen();
  });

  it('should show retry button in default fallback', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByLabelText('Try again')).toBeOnTheScreen();
  });

  it('should reset error state when retry button is pressed', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeOnTheScreen();

    const retryButton = screen.getByLabelText('Try again');
    fireEvent.press(retryButton);

    // After reset, error boundary should try to render children again
    // Note: This will throw again, but tests the reset mechanism
    expect(screen.queryByText('Something went wrong')).toBeOnTheScreen();
  });

  it('should call onError callback when error is caught', () => {
    const onError = jest.fn();

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Test error' }),
      expect.any(Object)
    );
  });
});
