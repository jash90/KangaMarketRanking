/**
 * useColorScheme Hook
 *
 * Returns the current color scheme (light or dark).
 * Wraps React Native's useColorScheme with type safety.
 */

import { useColorScheme as useRNColorScheme } from 'react-native';

type ColorScheme = 'light' | 'dark';

/**
 * Get the current color scheme preference
 *
 * @returns 'light' or 'dark' based on system preference
 *
 * @example
 * const colorScheme = useColorScheme();
 * const backgroundColor = colorScheme === 'dark' ? '#000' : '#fff';
 */
export function useColorScheme(): ColorScheme {
  const scheme = useRNColorScheme();
  return (scheme as ColorScheme) || 'light';
}
