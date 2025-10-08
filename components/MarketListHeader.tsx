/**
 * Market List Header Component
 *
 * Header for market list screen with title, subtitle, and search.
 * Designed to be fixed at top of screen.
 */

import { SearchBar } from '@/components';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

export interface MarketListHeaderProps {
  title?: string;
  marketCount: number;
  lastUpdated: Date | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  style?: ViewStyle;
  children?: React.ReactNode;
}

/**
 * Format last update time in relative format
 */
function formatLastUpdate(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/**
 * Market list header with search
 *
 * @example
 * <MarketListHeader
 *   marketCount={100}
 *   lastUpdated={new Date()}
 *   searchQuery={query}
 *   onSearchChange={setQuery}
 * />
 */
export const MarketListHeader: React.FC<MarketListHeaderProps> = ({
  title = 'Market Rankings',
  marketCount,
  lastUpdated,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search markets...',
  style,
  children,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>
        {marketCount} markets
        {lastUpdated && ` • Updated ${formatLastUpdate(lastUpdated)}`}
      </Text>
      <SearchBar
        value={searchQuery}
        onChangeText={onSearchChange}
        placeholder={searchPlaceholder}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
});
