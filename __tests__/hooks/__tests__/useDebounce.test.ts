/**
 * useDebounce Hook Tests
 *
 * Tests for value debouncing functionality.
 */

import { useDebounce } from '@/hooks';
import { renderHook, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));

    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook<string, { value: string; delay: number }>(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 500 } }
    );

    expect(result.current).toBe('first');

    // Update value
    rerender({ value: 'second', delay: 500 });

    // Value should not update immediately
    expect(result.current).toBe('first');

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Value should now be updated
    expect(result.current).toBe('second');
  });

  it('should cancel previous timeout on rapid changes', () => {
    const { result, rerender } = renderHook<string, { value: string }>(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'first' } }
    );

    // Rapid updates
    rerender({ value: 'second' });
    act(() => jest.advanceTimersByTime(200));

    rerender({ value: 'third' });
    act(() => jest.advanceTimersByTime(200));

    rerender({ value: 'fourth' });

    // Still showing first value
    expect(result.current).toBe('first');

    // Complete the debounce delay
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Should show last value only
    expect(result.current).toBe('fourth');
  });

  it('should work with different delay values', () => {
    const { result, rerender } = renderHook<string, { value: string; delay: number }>(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'test', delay: 1000 } }
    );

    rerender({ value: 'updated', delay: 1000 });

    act(() => {
      jest.advanceTimersByTime(999);
    });
    expect(result.current).toBe('test');

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe('updated');
  });
});
