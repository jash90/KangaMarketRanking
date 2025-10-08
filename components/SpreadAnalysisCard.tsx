/**
 * Spread Analysis Card Component
 *
 * Displays spread analysis metrics in a card format.
 */

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { MetricRow } from './MetricRow';

export interface SpreadAnalysisCardProps {
  spreadAtDepth: number;
  style?: ViewStyle;
}

/**
 * Spread analysis display card
 *
 * @example
 * <SpreadAnalysisCard spreadAtDepth={0.62} />
 */
export const SpreadAnalysisCard: React.FC<SpreadAnalysisCardProps> = ({ spreadAtDepth, style }) => {
  return (
    <View style={[styles.section, style]}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name="compare-arrows" size={20} color="#3B82F6" />
        <Text style={styles.sectionTitle}>Spread Analysis</Text>
      </View>

      <MetricRow label="Spread at Depth:" value={`${spreadAtDepth.toFixed(2)}%`} highlighted />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
});
