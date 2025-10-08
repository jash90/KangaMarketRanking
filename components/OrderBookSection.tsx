/**
 * Order Book Section Component
 *
 * Displays BID or ASK order book data with metrics.
 * Reusable for both bid and ask sides.
 */

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { MetricRow } from './MetricRow';

export interface OrderBookSectionProps {
  type: 'bid' | 'ask';
  totalQuantity: number;
  orderCount: number;
  priceRange: { min: number; max: number } | null;
  formatNumber: (value: number, decimals?: number) => string;
  formatPrice: (value: number) => string;
  style?: ViewStyle;
}

/**
 * Order book section (BID or ASK)
 *
 * @example
 * <OrderBookSection
 *   type="bid"
 *   totalQuantity={analysis.totalBidQuantity}
 *   orderCount={analysis.bidDepth}
 *   priceRange={analysis.bidPriceRange}
 *   formatNumber={formatNumber}
 *   formatPrice={formatPrice}
 * />
 */
export const OrderBookSection: React.FC<OrderBookSectionProps> = ({
  type,
  totalQuantity,
  orderCount,
  priceRange,
  formatNumber,
  formatPrice,
  style,
}) => {
  const isBid = type === 'bid';
  const icon = isBid ? 'trending-up' : 'trending-down';
  const iconColor = isBid ? '#10B981' : '#EF4444';
  const title = isBid ? 'BID Orders (Buy)' : 'ASK Orders (Sell)';
  const highestLabel = isBid ? 'Highest BID:' : 'Lowest ASK:';
  const lowestLabel = isBid ? 'Lowest BID:' : 'Highest ASK:';

  return (
    <View style={[styles.section, style]}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name={icon} size={20} color={iconColor} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      <MetricRow label="Total Quantity:" value={formatNumber(totalQuantity, 2)} />
      <MetricRow label="Number of Orders:" value={orderCount} />

      {priceRange && (
        <>
          <MetricRow
            label={highestLabel}
            value={formatPrice(isBid ? priceRange.max : priceRange.min)}
          />
          <MetricRow
            label={lowestLabel}
            value={formatPrice(isBid ? priceRange.min : priceRange.max)}
          />
        </>
      )}
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
