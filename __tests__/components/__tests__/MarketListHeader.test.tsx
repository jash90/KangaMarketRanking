/**
 * MarketListHeader Component Tests
 */

import { MarketListHeader } from '@/components';
import { render, screen, fireEvent } from '@testing-library/react-native';
import React from 'react';

describe('MarketListHeader', () => {
  it('should render title', () => {
    render(
      <MarketListHeader
        marketCount={10}
        lastUpdated={new Date()}
        searchQuery=""
        onSearchChange={jest.fn()}
      />
    );

    expect(screen.getByText('Market Rankings')).toBeOnTheScreen();
  });

  it('should render custom title', () => {
    render(
      <MarketListHeader
        title="Custom Title"
        marketCount={10}
        lastUpdated={new Date()}
        searchQuery=""
        onSearchChange={jest.fn()}
      />
    );

    expect(screen.getByText('Custom Title')).toBeOnTheScreen();
  });

  it('should display market count', () => {
    render(
      <MarketListHeader
        marketCount={42}
        lastUpdated={new Date()}
        searchQuery=""
        onSearchChange={jest.fn()}
      />
    );

    expect(screen.getByText(/42 markets/)).toBeOnTheScreen();
  });

  it('should show last updated time', () => {
    const lastUpdated = new Date();
    render(
      <MarketListHeader
        marketCount={10}
        lastUpdated={lastUpdated}
        searchQuery=""
        onSearchChange={jest.fn()}
      />
    );

    expect(screen.getByText(/Updated/)).toBeOnTheScreen();
  });

  it('should render SearchBar', () => {
    render(
      <MarketListHeader
        marketCount={10}
        lastUpdated={null}
        searchQuery=""
        onSearchChange={jest.fn()}
      />
    );

    expect(screen.getByPlaceholderText('Search markets...')).toBeOnTheScreen();
  });

  it('should call onSearchChange when typing', () => {
    const onSearchChange = jest.fn();
    render(
      <MarketListHeader
        marketCount={10}
        lastUpdated={null}
        searchQuery=""
        onSearchChange={onSearchChange}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search markets...');
    fireEvent.changeText(searchInput, 'BTC');

    expect(onSearchChange).toHaveBeenCalledWith('BTC');
  });

  it('should render children (SortControls)', () => {
    const { View } = require('react-native');
    render(
      <MarketListHeader
        marketCount={10}
        lastUpdated={null}
        searchQuery=""
        onSearchChange={jest.fn()}
      >
        <View testID="sort-controls">
          <div>Sort Controls</div>
        </View>
      </MarketListHeader>
    );

    expect(screen.getByTestId('sort-controls')).toBeOnTheScreen();
  });
});
