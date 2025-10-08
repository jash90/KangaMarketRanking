/**
 * Market Detail Screen
 *
 * Displays order book depth analysis for a specific market.
 * Shows bid/ask quantities, price ranges, and liquidity metrics.
 */

import {
  DetailHeader,
  ErrorMessage,
  LoadingSpinner,
  OrderBookSection,
  SpreadAnalysisCard,
} from '@/components';
import { useMarketDepth } from '@/hooks';
import { formatNumber, formatPrice } from '@/utils/formatters';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MarketDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { depth, analysis, loading, error, refresh } = useMarketDepth(id || '');

  // Show loading state
  if (loading && !depth) {
    return (
      <View style={styles.centerContainer}>
        <LoadingSpinner size="large" message="Loading market depth..." />
      </View>
    );
  }

  // Show error state
  if (error && !depth) {
    return (
      <View style={styles.centerContainer}>
        <ErrorMessage error={error} onRetry={refresh} />
      </View>
    );
  }

  // No data available
  if (!depth || !analysis) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.noDataText}>No market depth data available</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={loading && !!depth}
          onRefresh={refresh}
          tintColor="#3B82F6"
          colors={['#3B82F6']}
          progressViewOffset={insets.top}
        />
      }
    >
      <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
        {/* Header with Back Button */}
        <DetailHeader
          title={id?.replace('_', '/') || ''}
          subtitle="Order Book Depth Analysis"
          onBack={() => router.back()}
        />

        {/* BID Section */}
        <OrderBookSection
          type="bid"
          totalQuantity={analysis.totalBidQuantity}
          orderCount={analysis.bidDepth}
          priceRange={analysis.bidPriceRange}
          formatNumber={formatNumber}
          formatPrice={formatPrice}
        />

        {/* ASK Section */}
        <OrderBookSection
          type="ask"
          totalQuantity={analysis.totalAskQuantity}
          orderCount={analysis.askDepth}
          priceRange={analysis.askPriceRange}
          formatNumber={formatNumber}
          formatPrice={formatPrice}
        />

        {/* Spread Analysis */}
        {analysis.spreadAtDepth !== null && (
          <SpreadAnalysisCard spreadAtDepth={analysis.spreadAtDepth} />
        )}

        {/* Timestamp */}
        <View style={styles.footer}>
          <MaterialIcons name="access-time" size={16} color="#9CA3AF" />
          <Text style={styles.timestamp}>
            Updated: {new Date(analysis.timestamp).toLocaleString()}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  noDataText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
