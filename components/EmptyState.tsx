/**
 * Empty State Component
 *
 * Displays a message when no data is available.
 */

import React, { ComponentProps } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export interface EmptyStateProps {
  message?: string;
  iconName?: ComponentProps<typeof MaterialIcons>['name'];
  iconColor?: string;
  style?: ViewStyle;
}

/**
 * Empty state placeholder
 *
 * @example
 * <EmptyState
 *   iconName="assessment"
 *   message="No markets found matching your search"
 * />
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No data available',
  iconName = 'inbox',
  iconColor = '#9CA3AF',
  style,
}) => {
  return (
    <View
      style={[styles.container, style]}
      accessible={true}
      accessibilityLabel={message}
      accessibilityRole="text"
    >
      <MaterialIcons name={iconName} size={64} color={iconColor} style={styles.icon} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  icon: {
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});
