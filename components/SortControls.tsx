/**
 * Sort Controls Component
 *
 * Multi-select compound sorting controls with priority badges.
 * Supports up to 2 simultaneous sorts.
 */

import { SortConfig, SortField } from '@/api/types';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { SortButton } from './SortButton';

export interface SortControlsProps {
  sortConfigs: SortConfig[];
  availableFields: readonly SortField[];
  fieldLabels: Record<SortField, string>;
  onToggleSort: (field: SortField) => void;
  label?: string;
  style?: ViewStyle;
}

/**
 * Compound sorting controls
 *
 * @example
 * <SortControls
 *   sortConfigs={sortConfigs}
 *   availableFields={['market', 'spread']}
 *   fieldLabels={{ market: 'Market', spread: 'Spread' }}
 *   onToggleSort={toggleSort}
 * />
 */
export const SortControls: React.FC<SortControlsProps> = ({
  sortConfigs,
  availableFields,
  fieldLabels,
  onToggleSort,
  label = 'Sort by:',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.buttons}>
        {availableFields.map((field) => {
          // Find config in entire array
          const configIndex = sortConfigs.findIndex((c) => c.field === field);
          const isActive = configIndex !== -1;
          const sortConfig = isActive ? sortConfigs[configIndex] : null;

          // Calculate priority based only on visible fields
          const visibleSorts = sortConfigs.filter((c) => availableFields.includes(c.field));
          const visibleIndex = visibleSorts.findIndex((c) => c.field === field);
          const priority = visibleIndex !== -1 ? visibleIndex + 1 : null;

          return (
            <SortButton
              key={field}
              field={field}
              label={fieldLabels[field] || field}
              isActive={isActive}
              priority={priority}
              sortOrder={sortConfig?.order || null}
              onPress={() => onToggleSort(field)}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginRight: 12,
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
  },
});
