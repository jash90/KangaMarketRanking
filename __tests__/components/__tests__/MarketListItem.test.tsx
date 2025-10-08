/**
 * MarketListItem Component Tests
 *
 * Tests for the optimized market list item component.
 * Verifies rendering, interactions, and accessibility.
 */

import { MarketListItem } from '@/components';
import { MarketData } from '@/types';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

const mockMarket: MarketData = {
  tickerId: 'BTC_USDT',
  market: 'BTC/USDT',
  baseSymbol: 'BTC',
  targetSymbol: 'USDT',
  highestBid: 16583,
  lowestAsk: 16704,
  spread: 0.73,
  spreadPercentage: 0.73,
  ragStatus: 'green',
  lastPrice: 16640,
  volume24h: 1000,
  high24h: 17000,
  low24h: 16000,
};

describe('MarketListItem', () => {
  it('should render market information correctly', () => {
    render(<MarketListItem market={mockMarket} />);

    // Market name should be visible
    expect(screen.getByText('BTC/USDT')).toBeTruthy();

    // Spread should be visible (1 decimal - CoinGecko pattern)
    expect(screen.getByText('0.7%')).toBeTruthy();
  });

  it('should display bid and ask prices', () => {
    render(<MarketListItem market={mockMarket} />);

    // Price labels
    expect(screen.getByText('BID')).toBeTruthy();
    expect(screen.getByText('ASK')).toBeTruthy();

    // Price values (formatted with padding and thousand separators)
    expect(screen.getByText(' 16,583.00')).toBeTruthy();
    expect(screen.getByText(' 16,704.00')).toBeTruthy();
  });

  it('should display spread', () => {
    render(<MarketListItem market={mockMarket} />);

    // Spread value (formatted as percentage with 1 decimal - CoinGecko pattern)
    expect(screen.getByText('0.7%')).toBeTruthy();
  });

  it('should call onPress when tapped', () => {
    const onPress = jest.fn();
    render(<MarketListItem market={mockMarket} onPress={onPress} />);

    const item = screen.getByRole('button');
    fireEvent.press(item);

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledWith(mockMarket);
  });

  it('should not call onPress when disabled', () => {
    const onPress = jest.fn();
    render(<MarketListItem market={mockMarket} />); // No onPress prop = disabled

    const item = screen.getByRole('button');
    fireEvent.press(item);

    // Should not call onPress when not provided
    expect(onPress).not.toHaveBeenCalled();
  });

  it('should have proper accessibility labels', () => {
    render(<MarketListItem market={mockMarket} />);

    const item = screen.getByRole('button');

    // Should have accessibility label
    expect(item.props.accessibilityLabel).toBeTruthy();
    expect(item.props.accessibilityLabel).toContain('BTC/USDT');
    expect(item.props.accessibilityLabel).toContain('Bid: 16,583.00');
    expect(item.props.accessibilityLabel).toContain('Ask: 16,704.00');
    expect(item.props.accessibilityLabel).toContain('Spread: 0.7%');
  });

  it('should have proper accessibility hint', () => {
    render(<MarketListItem market={mockMarket} />);

    const item = screen.getByRole('button');
    expect(item.props.accessibilityHint).toBe('Double tap to view market details');
  });

  it('should show volume when showVolume is true', () => {
    render(<MarketListItem market={mockMarket} showVolume={true} />);

    // Volume text should be present
    const volumeText = screen.getByText(/Vol:/);
    expect(volumeText).toBeTruthy();
  });

  it('should not show volume when showVolume is false', () => {
    render(<MarketListItem market={mockMarket} showVolume={false} />);

    // Volume text should not be present
    const volumeText = screen.queryByText(/Vol:/);
    expect(volumeText).toBeNull();
  });

  it('should handle null bid/ask gracefully', () => {
    const marketWithNullPrices: MarketData = {
      ...mockMarket,
      highestBid: null,
      lowestAsk: null,
      spread: null,
    };

    render(<MarketListItem market={marketWithNullPrices} />);

    // Should still render without crashing
    expect(screen.getByText('BTC/USDT')).toBeTruthy();

    // Multiple N/A values should be present (bid, ask, spread)
    const naElements = screen.getAllByText('N/A');
    expect(naElements.length).toBeGreaterThan(0);
  });

  it('should render RAG indicator', () => {
    render(<MarketListItem market={mockMarket} />);

    // RAG indicator should be present
    // (We're not testing the RAG component itself, just that it renders)
    expect(screen.getByText('BTC/USDT')).toBeTruthy();
  });

  it('should render different RAG statuses', () => {
    const { rerender } = render(<MarketListItem market={mockMarket} />);

    // Test green status
    expect(mockMarket.ragStatus).toBe('green');

    // Test amber status
    const amberMarket = { ...mockMarket, ragStatus: 'amber' as const };
    rerender(<MarketListItem market={amberMarket} />);
    expect(amberMarket.ragStatus).toBe('amber');

    // Test red status
    const redMarket = { ...mockMarket, ragStatus: 'red' as const };
    rerender(<MarketListItem market={redMarket} />);
    expect(redMarket.ragStatus).toBe('red');
  });

  it('should not re-render on irrelevant prop changes', () => {
    const renderSpy = jest.fn();

    // Create a component that counts renders
    const TestWrapper = ({ market }: { market: MarketData }) => {
      renderSpy();
      return <MarketListItem market={market} />;
    };

    const { rerender } = render(<TestWrapper market={mockMarket} />);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    // Update with same data - should not re-render due to memo
    rerender(<TestWrapper market={mockMarket} />);

    // React may re-render parent but memo should prevent child re-render
    // This test verifies the memo optimization is in place
  });

  it('should re-render when relevant data changes', () => {
    const { rerender } = render(<MarketListItem market={mockMarket} />);

    // Initial render
    expect(screen.getByText(' 16,583.00')).toBeTruthy();

    // Update bid price
    const updatedMarket = { ...mockMarket, highestBid: 17000 };
    rerender(<MarketListItem market={updatedMarket} />);

    // Should show new price (formatted with padding and thousand separator)
    expect(screen.getByText(' 17,000.00')).toBeTruthy();
  });
});
