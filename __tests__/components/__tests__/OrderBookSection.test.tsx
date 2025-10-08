/**
 * OrderBookSection Component Tests
 */

import { OrderBookSection } from '@/components';
import { render, screen } from '@testing-library/react-native';
import React from 'react';

const mockFormatNumber = (val: number, decimals = 2) => val.toFixed(decimals);
const mockFormatPrice = (val: number) => val.toFixed(2);

describe('OrderBookSection', () => {
  describe('BID section', () => {
    it('should render BID title', () => {
      render(
        <OrderBookSection
          type="bid"
          totalQuantity={1.5}
          orderCount={3}
          priceRange={{ min: 16000, max: 16100 }}
          formatNumber={mockFormatNumber}
          formatPrice={mockFormatPrice}
        />
      );

      expect(screen.getByText('BID Orders (Buy)')).toBeOnTheScreen();
    });

    it('should display total quantity', () => {
      render(
        <OrderBookSection
          type="bid"
          totalQuantity={1.5}
          orderCount={3}
          priceRange={null}
          formatNumber={mockFormatNumber}
          formatPrice={mockFormatPrice}
        />
      );

      expect(screen.getByText('1.50')).toBeOnTheScreen();
    });

    it('should display order count', () => {
      render(
        <OrderBookSection
          type="bid"
          totalQuantity={1.5}
          orderCount={3}
          priceRange={null}
          formatNumber={mockFormatNumber}
          formatPrice={mockFormatPrice}
        />
      );

      expect(screen.getByText('3')).toBeOnTheScreen();
    });

    it('should show price range when available', () => {
      render(
        <OrderBookSection
          type="bid"
          totalQuantity={1.5}
          orderCount={3}
          priceRange={{ min: 16000, max: 16100 }}
          formatNumber={mockFormatNumber}
          formatPrice={mockFormatPrice}
        />
      );

      expect(screen.getByText('16000.00')).toBeOnTheScreen();
      expect(screen.getByText('16100.00')).toBeOnTheScreen();
    });

    it('should hide price range when null', () => {
      render(
        <OrderBookSection
          type="bid"
          totalQuantity={1.5}
          orderCount={3}
          priceRange={null}
          formatNumber={mockFormatNumber}
          formatPrice={mockFormatPrice}
        />
      );

      expect(screen.queryByText(/Highest BID/)).not.toBeOnTheScreen();
    });
  });

  describe('ASK section', () => {
    it('should render ASK title', () => {
      render(
        <OrderBookSection
          type="ask"
          totalQuantity={2.0}
          orderCount={5}
          priceRange={null}
          formatNumber={mockFormatNumber}
          formatPrice={mockFormatPrice}
        />
      );

      expect(screen.getByText('ASK Orders (Sell)')).toBeOnTheScreen();
    });

    it('should display metrics for ASK', () => {
      render(
        <OrderBookSection
          type="ask"
          totalQuantity={2.0}
          orderCount={5}
          priceRange={{ min: 16200, max: 16300 }}
          formatNumber={mockFormatNumber}
          formatPrice={mockFormatPrice}
        />
      );

      expect(screen.getByText('2.00')).toBeOnTheScreen();
      expect(screen.getByText('5')).toBeOnTheScreen();
    });
  });
});
