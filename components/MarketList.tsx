/**
 * Market List Component
 *
 * Optimized FlatList wrapper for displaying market data.
 * Includes performance optimizations and accessibility.
 */

import { MARKET_LIST_ITEM_HEIGHT, MarketListItem } from '@/components';
import React, { useCallback } from 'react';
import { FlatList, ListRenderItem, RefreshControl, ViewStyle } from 'react-native';
import { MarketData } from '@/types';

export interface MarketListProps {
  markets: MarketData[];
  loading: boolean;
  onRefresh: () => void;
  onItemPress: (market: MarketData) => void;
  EmptyComponent?: React.ComponentType | React.ReactElement | null;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  progressViewOffset?: number;
}

// CRITICAL: Define outside component for reference stability
const keyExtractor = (item: MarketData) => item.tickerId;

/**
 * Optimized market list with FlatList performance settings
 *
 * @example
 * <MarketList
 *   markets={filteredMarkets}
 *   loading={loading}
 *   onRefresh={refresh}
 *   onItemPress={handlePress}
 *   EmptyComponent={renderEmpty}
 * />
 */
export const MarketList: React.FC<MarketListProps> = ({
  markets,
  loading,
  onRefresh,
  onItemPress,
  EmptyComponent,
  style,
  contentContainerStyle,
  progressViewOffset = 0,
}) => {
  /**
   * Optimized render function with useCallback
   */
  const renderItem: ListRenderItem<MarketData> = useCallback(
    ({ item }) => <MarketListItem market={item} onPress={onItemPress} />,
    [onItemPress]
  );

  /**
   * FlatList optimization - skip measurement for fixed-height items
   */
  const getItemLayout = useCallback(
    (_data: ArrayLike<MarketData> | null | undefined, index: number) => ({
      length: MARKET_LIST_ITEM_HEIGHT,
      offset: MARKET_LIST_ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  return (
    <FlatList
      style={style}
      contentContainerStyle={contentContainerStyle}
      data={markets}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      ListEmptyComponent={EmptyComponent}
      refreshControl={
        <RefreshControl
          refreshing={loading && markets.length > 0}
          onRefresh={onRefresh}
          tintColor="#3B82F6"
          colors={['#3B82F6']}
          progressViewOffset={progressViewOffset}
        />
      }
      // Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={10}
      windowSize={21}
      // Accessibility
      accessibilityRole="list"
      accessibilityLabel="Market list"
    />
  );
};
