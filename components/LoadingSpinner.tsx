/**
 * Loading Spinner Component
 *
 * Displays an animated loading indicator with optional message.
 */

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, ViewStyle } from 'react-native';

export interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
}

/**
 * Loading indicator with optional message
 *
 * @example
 * <LoadingSpinner message="Loading markets..." />
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'large',
  color = '#3B82F6',
  style,
}) => {
  return (
    <View
      style={[styles.container, style]}
      accessible={true}
      accessibilityLabel={message}
      accessibilityRole="progressbar"
    >
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});
