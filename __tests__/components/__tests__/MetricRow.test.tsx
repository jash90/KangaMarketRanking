/**
 * MetricRow Component Tests
 */

import { MetricRow } from '@/components';
import { render, screen } from '@testing-library/react-native';
import React from 'react';

describe('MetricRow', () => {
  it('should render label and value', () => {
    render(<MetricRow label="Total Quantity" value="1.50" />);

    expect(screen.getByText('Total Quantity')).toBeOnTheScreen();
    expect(screen.getByText('1.50')).toBeOnTheScreen();
  });

  it('should handle numeric values', () => {
    render(<MetricRow label="Count" value={42} />);

    expect(screen.getByText('42')).toBeOnTheScreen();
  });

  it('should apply highlighted styling when highlighted prop is true', () => {
    render(<MetricRow label="Spread" value="0.62%" highlighted />);

    expect(screen.getByText('0.62%')).toBeOnTheScreen();
  });

  it('should render without highlighted styling by default', () => {
    render(<MetricRow label="Price" value="16000.00" />);

    expect(screen.getByText('16000.00')).toBeOnTheScreen();
  });
});
