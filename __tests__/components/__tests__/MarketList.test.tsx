/**
 * MarketList Component Tests
 */

import { MarketList } from '@/components';
import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import { MarketData } from '@/types';

const mockMarkets: MarketData[] = [
  {
    tickerId: 'BTC_USDT',
    market: 'BTC/USDT',
    baseSymbol: 'BTC',
    targetSymbol: 'USDT',
    highestBid: 16000,
    lowestAsk: 16100,
    spread: 0.62,
    spreadPercentage: 0.62,
    ragStatus: 'green',
    lastPrice: 16050,
    volume24h: 1000000,
  },
];

describe('MarketList', () => {
  it('should render market items', () => {
    render(
      <MarketList
        markets={mockMarkets}
        loading={false}
        onRefresh={jest.fn()}
        onItemPress={jest.fn()}
      />
    );

    expect(screen.getByText('BTC/USDT')).toBeOnTheScreen();
  });

  it('should show empty component when no markets', () => {
    const EmptyComponent = () => <Text>No markets</Text>;

    render(
      <MarketList
        markets={[]}
        loading={false}
        onRefresh={jest.fn()}
        onItemPress={jest.fn()}
        EmptyComponent={EmptyComponent}
      />
    );

    expect(screen.getByText('No markets')).toBeOnTheScreen();
  });

  it('should have accessibility role', () => {
    render(
      <MarketList
        markets={mockMarkets}
        loading={false}
        onRefresh={jest.fn()}
        onItemPress={jest.fn()}
      />
    );

    expect(screen.getByLabelText('Market list')).toBeOnTheScreen();
  });
});
