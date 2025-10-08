/**
 * SortControls Component Tests
 */

import { SortControls } from '@/components';
import { SortConfig } from '@/api/types';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

describe('SortControls', () => {
  const defaultProps = {
    sortConfigs: [{ field: 'volume' as const, order: 'desc' as const }],
    availableFields: ['market', 'spread'] as const,
    fieldLabels: {
      market: 'Market',
      spread: 'Spread',
      volume: 'Volume',
      price: 'Price',
      ragStatus: 'Status',
    },
    onToggleSort: jest.fn(),
  };

  it('should render sort label', () => {
    render(<SortControls {...defaultProps} />);

    expect(screen.getByText('Sort by:')).toBeOnTheScreen();
  });

  it('should render all available field buttons', () => {
    render(<SortControls {...defaultProps} />);

    expect(screen.getByText('Market')).toBeOnTheScreen();
    expect(screen.getByText('Spread')).toBeOnTheScreen();
  });

  it('should show active state for sorted fields', () => {
    const props = {
      ...defaultProps,
      sortConfigs: [{ field: 'market' as const, order: 'desc' as const }],
    };
    render(<SortControls {...props} />);

    expect(screen.getByText('1')).toBeOnTheScreen(); // Priority badge
  });

  it('should call onToggleSort when button pressed', () => {
    const onToggleSort = jest.fn();
    render(<SortControls {...defaultProps} onToggleSort={onToggleSort} />);

    const marketButton = screen.getByText('Market');
    fireEvent.press(marketButton);

    expect(onToggleSort).toHaveBeenCalledWith('market');
  });

  it('should show priority badges for multiple active sorts', () => {
    const props = {
      ...defaultProps,
      sortConfigs: [
        { field: 'market' as const, order: 'desc' as const },
        { field: 'spread' as const, order: 'asc' as const },
      ],
    };
    render(<SortControls {...props} />);

    expect(screen.getByText('1')).toBeOnTheScreen();
    expect(screen.getByText('2')).toBeOnTheScreen();
  });

  it('should render custom label', () => {
    render(<SortControls {...defaultProps} label="Order by:" />);

    expect(screen.getByText('Order by:')).toBeOnTheScreen();
  });
});
