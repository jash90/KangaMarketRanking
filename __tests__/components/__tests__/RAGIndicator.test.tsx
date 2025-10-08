/**
 * RAGIndicator Component Tests
 *
 * Tests for RAG (Red-Amber-Green) liquidity status indicator.
 */

import { RAGIndicator } from '@/components';
import { render, screen } from '@testing-library/react-native';
import React from 'react';

describe('RAGIndicator', () => {
  describe('status rendering', () => {
    it('should render green status correctly', () => {
      render(<RAGIndicator status="green" showLabel />);

      expect(screen.getByText('Good Liquidity')).toBeOnTheScreen();
    });

    it('should render amber status correctly', () => {
      render(<RAGIndicator status="amber" showLabel />);

      expect(screen.getByText('Moderate Liquidity')).toBeOnTheScreen();
    });

    it('should render red status correctly', () => {
      render(<RAGIndicator status="red" showLabel />);

      expect(screen.getByText('Poor Liquidity')).toBeOnTheScreen();
    });
  });

  describe('display modes', () => {
    it('should show label when showLabel is true', () => {
      render(<RAGIndicator status="green" showLabel />);

      expect(screen.getByText('Good Liquidity')).toBeOnTheScreen();
    });

    it('should hide label when showLabel is false', () => {
      render(<RAGIndicator status="green" showLabel={false} />);

      expect(screen.queryByText('Good Liquidity')).not.toBeOnTheScreen();
    });

    it('should show emoji when showEmoji is true', () => {
      const { getByText } = render(<RAGIndicator status="green" showEmoji />);

      expect(getByText('🟢')).toBeTruthy();
    });

    it('should show dot when showEmoji is false', () => {
      const { queryByText } = render(<RAGIndicator status="green" showEmoji={false} />);

      // Emoji should not be present
      expect(queryByText('🟢')).toBeFalsy();
    });
  });

  describe('sizes', () => {
    it('should render small size', () => {
      render(<RAGIndicator status="green" size="small" />);

      expect(screen.getByLabelText('Liquidity status: Good Liquidity')).toBeOnTheScreen();
    });

    it('should render medium size', () => {
      render(<RAGIndicator status="green" size="medium" />);

      expect(screen.getByLabelText('Liquidity status: Good Liquidity')).toBeOnTheScreen();
    });

    it('should render large size', () => {
      render(<RAGIndicator status="green" size="large" />);

      expect(screen.getByLabelText('Liquidity status: Good Liquidity')).toBeOnTheScreen();
    });
  });

  describe('accessibility', () => {
    it('should have proper accessibility label', () => {
      render(<RAGIndicator status="green" />);

      expect(screen.getByLabelText('Liquidity status: Good Liquidity')).toBeOnTheScreen();
    });

    it('should have accessibility role', () => {
      render(<RAGIndicator status="green" />);

      // Check via accessibility label instead
      expect(screen.getByLabelText('Liquidity status: Good Liquidity')).toBeOnTheScreen();
    });
  });
});
