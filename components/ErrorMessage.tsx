/**
 * Error Message Component
 *
 * Displays user-friendly error messages with optional retry button.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export interface ErrorMessageProps {
  message?: string;
  error?: Error | null;
  onRetry?: () => void;
  style?: ViewStyle;
}

/**
 * Error message display with retry button
 *
 * @example
 * <ErrorMessage
 *   error={error}
 *   onRetry={() => refresh()}
 * />
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, error, onRetry, style }) => {
  const displayMessage = message || error?.message || 'An error occurred';

  return (
    <View
      style={[styles.container, style]}
      accessible={true}
      accessibilityLabel={`Error: ${displayMessage}`}
      accessibilityRole="alert"
    >
      {/* Error Icon */}
      <View style={styles.iconContainer}>
        <MaterialIcons name="error" size={48} color="#EF4444" />
      </View>

      {/* Error Title */}
      <Text style={styles.title}>Oops! Something went wrong</Text>

      {/* Error Message */}
      <Text style={styles.message}>{displayMessage}</Text>

      {/* Retry Button */}
      {onRetry && (
        <TouchableOpacity
          style={styles.retryButton}
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="Retry"
          accessibilityHint="Tap to retry the failed operation"
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      )}
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
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#EF4444',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
