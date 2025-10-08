/**
 * Market List Item Component
 *
 * Optimized market row with React.memo for performance.
 * Displays market info, bid/ask, spread, and RAG status.
 */

import { formatPrice, formatPriceFixed, formatSpread, formatVolume } from '@/utils';
import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MarketData } from '@/types';
import { RAGIndicator } from './RAGIndicator';

export interface MarketListItemProps {
  market: MarketData;
  onPress?: (market: MarketData) => void;
  showVolume?: boolean;
}

/**
 * Optimized market list item with memoization
 *
 * @example
 * <MarketListItem
 *   market={marketData}
 *   onPress={(m) => navigation.navigate('Detail', { market: m })}
 * />
 */
export const MarketListItem = memo<MarketListItemProps>(
  ({ market, onPress, showVolume = false }) => {
    const handlePress = () => {
      onPress?.(market);
    };

    // Accessibility label for screen readers
    const accessibilityLabel = [
      `${market.market}`,
      `Bid: ${formatPrice(market.highestBid)}`,
      `Ask: ${formatPrice(market.lowestAsk)}`,
      `Spread: ${formatSpread(market.spread)}`,
      market.ragStatus === 'green'
        ? 'Good liquidity'
        : market.ragStatus === 'amber'
          ? 'Moderate liquidity'
          : 'Poor liquidity',
    ].join(', ');

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={handlePress}
        activeOpacity={0.7}
        disabled={!onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint="Double tap to view market details"
      >
        {/* Left: Market Info, Spread & RAG */}
        <View style={styles.marketInfo}>
          <Text style={styles.marketName} numberOfLines={1}>
            {market.market}
          </Text>
          <View style={styles.spreadRow}>
            <Text style={styles.spreadValue} numberOfLines={1}>
              {formatSpread(market.spread)}
            </Text>
            <RAGIndicator status={market.ragStatus} size="small" />
          </View>
          {showVolume && <Text style={styles.volume}>Vol: {formatVolume(market.volume24h)}</Text>}
        </View>

        {/* Right: Prices */}
        <View style={styles.pricesContainer}>
          {/* Bid */}
          <View style={styles.priceColumn}>
            <Text style={styles.priceLabel}>BID</Text>
            <Text style={styles.priceValue} numberOfLines={1}>
              {formatPriceFixed(market.highestBid)}
            </Text>
          </View>

          {/* Ask */}
          <View style={styles.priceColumn}>
            <Text style={styles.priceLabel}>ASK</Text>
            <Text style={styles.priceValue} numberOfLines={1}>
              {formatPriceFixed(market.lowestAsk)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison for memo optimization
    // Only re-render if relevant data changes
    return (
      prevProps.market.tickerId === nextProps.market.tickerId &&
      prevProps.market.highestBid === nextProps.market.highestBid &&
      prevProps.market.lowestAsk === nextProps.market.lowestAsk &&
      prevProps.market.spread === nextProps.market.spread &&
      prevProps.market.ragStatus === nextProps.market.ragStatus &&
      prevProps.market.volume24h === nextProps.market.volume24h &&
      prevProps.showVolume === nextProps.showVolume
    );
  }
);

MarketListItem.displayName = 'MarketListItem';

// Fixed height for FlatList optimization with getItemLayout
export const MARKET_LIST_ITEM_HEIGHT = 88;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: MARKET_LIST_ITEM_HEIGHT,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  marketInfo: {
    flex: 2,
    justifyContent: 'center',
  },
  marketName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  spreadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  spreadValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  volume: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  pricesContainer: {
    flexDirection: 'row',
    flex: 3,
    gap: 12,
  },
  priceColumn: {
    flex: 1,
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'monospace',
  },
});
