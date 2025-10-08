/**
 * SpreadAnalysisCard Component Tests
 */

import { SpreadAnalysisCard } from '@/components';
import { render, screen } from '@testing-library/react-native';
import React from 'react';

describe('SpreadAnalysisCard', () => {
  it('should render spread analysis title', () => {
    render(<SpreadAnalysisCard spreadAtDepth={0.62} />);

    expect(screen.getByText('Spread Analysis')).toBeOnTheScreen();
  });

  it('should display spread value with percentage', () => {
    render(<SpreadAnalysisCard spreadAtDepth={0.62} />);

    expect(screen.getByText('0.62%')).toBeOnTheScreen();
  });

  it('should format spread with 2 decimal places', () => {
    render(<SpreadAnalysisCard spreadAtDepth={1.234567} />);

    expect(screen.getByText('1.23%')).toBeOnTheScreen();
  });

  it('should render icon', () => {
    const { UNSAFE_getByType } = render(<SpreadAnalysisCard spreadAtDepth={0.62} />);

    expect(UNSAFE_getByType(require('@expo/vector-icons/MaterialIcons').default)).toBeTruthy();
  });
});
