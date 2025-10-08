/**
 * ErrorMessage Component Tests
 *
 * Tests for error display component with retry functionality.
 */

import { ErrorMessage } from '@/components';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

describe('ErrorMessage', () => {
  it('should display error message from Error object', () => {
    const error = new Error('Network connection failed');
    render(<ErrorMessage error={error} />);

    expect(screen.getByText('Network connection failed')).toBeOnTheScreen();
  });

  it('should display custom message when provided', () => {
    render(<ErrorMessage message="Custom error message" />);

    expect(screen.getByText('Custom error message')).toBeOnTheScreen();
  });

  it('should prefer custom message over error object message', () => {
    const error = new Error('Error object message');
    render(<ErrorMessage message="Custom message" error={error} />);

    expect(screen.getByText('Custom message')).toBeOnTheScreen();
    expect(screen.queryByText('Error object message')).not.toBeOnTheScreen();
  });

  it('should display default message when no message or error provided', () => {
    render(<ErrorMessage />);

    expect(screen.getByText('An error occurred')).toBeOnTheScreen();
  });

  it('should show retry button when onRetry is provided', () => {
    const onRetry = jest.fn();
    render(<ErrorMessage error={new Error('Test')} onRetry={onRetry} />);

    expect(screen.getByLabelText('Retry')).toBeOnTheScreen();
  });

  it('should hide retry button when onRetry is not provided', () => {
    render(<ErrorMessage error={new Error('Test')} />);

    expect(screen.queryByLabelText('Retry')).not.toBeOnTheScreen();
  });

  it('should call onRetry when retry button is pressed', () => {
    const onRetry = jest.fn();
    render(<ErrorMessage error={new Error('Test')} onRetry={onRetry} />);

    const retryButton = screen.getByLabelText('Retry');
    fireEvent.press(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should have proper accessibility attributes', () => {
    render(<ErrorMessage error={new Error('Test error')} />);

    expect(screen.getByLabelText(/Error:/)).toBeOnTheScreen();
  });
});
