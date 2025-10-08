/**
 * Metric Row Component
 *
 * Displays a label-value pair in a row format.
 * Commonly used in detail screens for displaying metrics.
 */

import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

export interface MetricRowProps {
  label: string;
  value: string | number;
  highlighted?: boolean;
  valueStyle?: TextStyle;
  style?: ViewStyle;
}

/**
 * Label-value metric row
 *
 * @example
 * <MetricRow label="Total Quantity" value="1.50" />
 * <MetricRow label="Spread" value="0.62%" highlighted />
 */
export const MetricRow: React.FC<MetricRowProps> = ({
  label,
  value,
  highlighted = false,
  valueStyle,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, highlighted && styles.valueHighlighted, valueStyle]}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  valueHighlighted: {
    color: '#3B82F6',
    fontSize: 18,
  },
});
