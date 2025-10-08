/**
 * Detail Header Component
 *
 * Generic header for detail screens with back button and titles.
 */

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

export interface DetailHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  style?: ViewStyle;
}

/**
 * Detail screen header with back navigation
 *
 * @example
 * <DetailHeader
 *   title="BTC/USDT"
 *   subtitle="Order Book Depth"
 *   onBack={() => router.back()}
 * />
 */
export const DetailHeader: React.FC<DetailHeaderProps> = ({ title, subtitle, onBack, style }) => {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <MaterialIcons name="arrow-back" size={24} color="#111827" />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
});
