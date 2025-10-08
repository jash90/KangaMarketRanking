/**
 * Sort Button Component
 *
 * Individual sort button with priority badge and direction arrow.
 */

import { SortOrder } from '@/api/types';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface SortButtonProps {
  field: string;
  label: string;
  isActive: boolean;
  priority: number | null;
  sortOrder: SortOrder | null;
  onPress: () => void;
}

/**
 * Sort button with priority badge and direction arrow
 *
 * @example
 * <SortButton
 *   field="market"
 *   label="Market"
 *   isActive={true}
 *   priority={1}
 *   sortOrder="desc"
 *   onPress={() => toggleSort('market')}
 * />
 */
export const SortButton: React.FC<SortButtonProps> = ({
  field,
  label,
  isActive,
  priority,
  sortOrder,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isActive && styles.buttonActive,
        priority === 2 && styles.buttonSecondary,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Sort by ${field}${isActive ? ` (priority ${priority})` : ''}`}
    >
      {/* Priority Badge */}
      {isActive && priority && (
        <View style={[styles.priorityBadge, priority === 2 && styles.priorityBadgeSecondary]}>
          <Text style={styles.priorityText}>{priority}</Text>
        </View>
      )}

      {/* Field Label */}
      <Text style={[styles.buttonText, isActive && styles.buttonTextActive]}>{label}</Text>

      {/* Sort Direction Arrow */}
      {isActive && sortOrder && (
        <MaterialIcons
          name={sortOrder === 'asc' ? 'arrow-upward' : 'arrow-downward'}
          size={14}
          color={priority === 1 ? '#FFFFFF' : '#D1D5DB'}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
    gap: 4,
  },
  buttonActive: {
    backgroundColor: '#3B82F6', // Primary sort
  },
  buttonSecondary: {
    backgroundColor: '#60A5FA', // Secondary sort (lighter blue)
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  buttonTextActive: {
    color: '#FFFFFF',
  },
  // Priority badge (shows 1, 2)
  priorityBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 2,
  },
  priorityBadgeSecondary: {
    backgroundColor: '#3B82F6',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
