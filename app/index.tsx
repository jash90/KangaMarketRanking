/**
 * Markets Screen (Home Tab)
 *
 * Main screen displaying live market data from Kanga Exchange.
 * Following Expo Router convention of including screen logic directly in route files.
 */

import {
  EmptyState,
  ErrorMessage,
  LoadingSpinner,
  MarketList,
  MarketListHeader,
  SortControls,
} from '@/components';
import { useDebounce, useFilteredAndSortedMarkets, useMarketData } from '@/hooks';
import { MarketData } from '@/types';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Markets Home Screen
 */
export default function MarketsScreen() {
  const { markets, loading, error, refresh, lastUpdated } = useMarketData();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Extract filtering and sorting logic to custom hook
  const { filteredMarkets, sortConfigs, toggleSort } = useFilteredAndSortedMarkets(
    markets,
    debouncedSearch,
    {
      sortingOptions: {
        defaultSort: null,
        maxSorts: 2,
      },
    }
  );

  /**
   * Navigate to market detail
   */
  const handleMarketPress = useCallback(
    (market: MarketData) => {
      router.push(`/market-detail/${market.tickerId}`);
    },
    [router]
  );

  /**
   * Render empty state based on context
   */
  const renderEmptyComponent = useCallback(() => {
    if (loading) return null;

    if (debouncedSearch.trim()) {
      return (
        <EmptyState
          iconName="search"
          iconColor="#6B7280"
          message={`No markets found matching "${debouncedSearch}"`}
        />
      );
    }

    return (
      <EmptyState
        iconName="assessment"
        iconColor="#9CA3AF"
        message="No markets available. Market data is currently unavailable."
      />
    );
  }, [loading, debouncedSearch]);

  // Show loading state on initial load
  if (loading && markets.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <LoadingSpinner size="large" message="Loading markets..." />
      </View>
    );
  }

  // Show error state
  if (error && markets.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ErrorMessage error={error} onRetry={refresh} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Fixed Header - Outside FlatList to prevent SearchBar remounting */}
      <MarketListHeader
        marketCount={filteredMarkets.length}
        lastUpdated={lastUpdated}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        style={{ paddingTop: 20 + insets.top }}
      >
        <SortControls
          sortConfigs={sortConfigs}
          availableFields={['market', 'spread']}
          fieldLabels={{
            market: 'Market',
            spread: 'Spread',
            volume: 'Volume',
            price: 'Price',
            ragStatus: 'Status',
          }}
          onToggleSort={toggleSort}
        />
      </MarketListHeader>

      {/* Market List */}
      <MarketList
        markets={filteredMarkets}
        loading={loading}
        onRefresh={refresh}
        onItemPress={handleMarketPress}
        EmptyComponent={renderEmptyComponent}
        progressViewOffset={insets.top}
      />
    </View>
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
  },
});
