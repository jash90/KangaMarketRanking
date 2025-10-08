/**
 * useColorScheme Hook Tests
 *
 * Tests for color scheme detection hook.
 */

import { useColorScheme } from '@/hooks';
import { renderHook } from '@testing-library/react-native';

// Mock React Native's useColorScheme at the module level
const mockUseRNColorScheme = jest.fn();
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  default: mockUseRNColorScheme,
}));

describe('useColorScheme', () => {
  it('should return system color scheme with light as default', () => {
    // Test light scheme
    mockUseRNColorScheme.mockReturnValue('light');
    const { result: lightResult } = renderHook(() => useColorScheme());
    expect(lightResult.current).toBe('light');

    // Test dark scheme
    mockUseRNColorScheme.mockReturnValue('dark');
    const { result: darkResult } = renderHook(() => useColorScheme());
    expect(darkResult.current).toBe('dark');

    // Test null defaults to light
    mockUseRNColorScheme.mockReturnValue(null);
    const { result: nullResult } = renderHook(() => useColorScheme());
    expect(nullResult.current).toBe('light');
  });
});
