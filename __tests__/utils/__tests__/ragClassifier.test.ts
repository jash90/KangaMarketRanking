/**
 * RAG Classifier Tests
 *
 * Unit tests for RAG liquidity classification system.
 */

import { RAGStatus } from '@/types';
import {
  classifyRAG,
  compareRAGStatus,
  getRAGColor,
  getRAGDescription,
  getRAGEmoji,
  getRAGExplanation,
  getRAGRecommendation,
  RAG_THRESHOLD,
} from '@/utils/ragClassifier';

describe('classifyRAG', () => {
  describe('green classification (spread ≤ 2%)', () => {
    it('returns green for 0% spread', () => {
      expect(classifyRAG(0)).toBe('green');
    });

    it('returns green for 1% spread', () => {
      expect(classifyRAG(1.0)).toBe('green');
    });

    it('returns green for exactly 2% spread', () => {
      expect(classifyRAG(2.0)).toBe('green');
      expect(classifyRAG(RAG_THRESHOLD.GREEN_MAX)).toBe('green');
    });

    it('returns green for 1.99% spread', () => {
      expect(classifyRAG(1.99)).toBe('green');
    });
  });

  describe('amber classification (spread > 2%)', () => {
    it('returns amber for 2.01% spread', () => {
      expect(classifyRAG(2.01)).toBe('amber');
    });

    it('returns amber for 5% spread', () => {
      expect(classifyRAG(5.0)).toBe('amber');
    });

    it('returns amber for 10% spread', () => {
      expect(classifyRAG(10.0)).toBe('amber');
    });

    it('returns amber for very high spreads', () => {
      expect(classifyRAG(50.0)).toBe('amber');
      expect(classifyRAG(100.0)).toBe('amber');
    });
  });

  describe('red classification (no liquidity)', () => {
    it('returns red for null spread', () => {
      expect(classifyRAG(null)).toBe('red');
    });

    it('returns red for NaN', () => {
      expect(classifyRAG(NaN)).toBe('red');
    });

    it('returns red for Infinity', () => {
      expect(classifyRAG(Infinity)).toBe('red');
    });
  });
});

describe('getRAGColor', () => {
  it('returns correct color for green', () => {
    expect(getRAGColor('green')).toBe('#10B981');
  });

  it('returns correct color for amber', () => {
    expect(getRAGColor('amber')).toBe('#F59E0B');
  });

  it('returns correct color for red', () => {
    expect(getRAGColor('red')).toBe('#EF4444');
  });
});

describe('getRAGEmoji', () => {
  it('returns correct emoji for green', () => {
    expect(getRAGEmoji('green')).toBe('🟢');
  });

  it('returns correct emoji for amber', () => {
    expect(getRAGEmoji('amber')).toBe('🟡');
  });

  it('returns correct emoji for red', () => {
    expect(getRAGEmoji('red')).toBe('🔴');
  });
});

describe('getRAGDescription', () => {
  it('returns correct description for green', () => {
    expect(getRAGDescription('green')).toBe('Good Liquidity');
  });

  it('returns correct description for amber', () => {
    expect(getRAGDescription('amber')).toBe('Moderate Liquidity');
  });

  it('returns correct description for red', () => {
    expect(getRAGDescription('red')).toBe('Poor Liquidity');
  });
});

describe('getRAGExplanation', () => {
  it('provides detailed explanation for green with spread', () => {
    const explanation = getRAGExplanation('green', 1.5);
    expect(explanation).toContain('1.50%');
    expect(explanation).toContain('Excellent liquidity');
    expect(explanation).toContain('Low trading cost');
  });

  it('provides explanation for amber with spread', () => {
    const explanation = getRAGExplanation('amber', 3.5);
    expect(explanation).toContain('3.50%');
    expect(explanation).toContain('Moderate liquidity');
    expect(explanation).toContain('Higher trading cost');
  });

  it('provides explanation for red', () => {
    const explanation = getRAGExplanation('red');
    expect(explanation).toContain('Poor or no liquidity');
    expect(explanation).toContain('No active bids or asks');
  });

  it('handles missing spread parameter', () => {
    expect(getRAGExplanation('green')).toBeTruthy();
    expect(getRAGExplanation('amber')).toBeTruthy();
  });
});

describe('getRAGRecommendation', () => {
  it('recommends trading for green status', () => {
    const recommendation = getRAGRecommendation('green');
    expect(recommendation).toContain('Recommended for trading');
    expect(recommendation).toContain('good liquidity');
  });

  it('provides cautious recommendation for amber', () => {
    const recommendation = getRAGRecommendation('amber');
    expect(recommendation).toContain('Acceptable for trading');
    expect(recommendation).toContain('monitor');
  });

  it('warns against trading for red status', () => {
    const recommendation = getRAGRecommendation('red');
    expect(recommendation).toContain('Not recommended');
    expect(recommendation).toContain('insufficient liquidity');
  });
});

describe('compareRAGStatus', () => {
  it('sorts red as lowest priority', () => {
    expect(compareRAGStatus('red', 'amber')).toBeLessThan(0);
    expect(compareRAGStatus('red', 'green')).toBeLessThan(0);
  });

  it('sorts amber as middle priority', () => {
    expect(compareRAGStatus('amber', 'red')).toBeGreaterThan(0);
    expect(compareRAGStatus('amber', 'green')).toBeLessThan(0);
  });

  it('sorts green as highest priority', () => {
    expect(compareRAGStatus('green', 'red')).toBeGreaterThan(0);
    expect(compareRAGStatus('green', 'amber')).toBeGreaterThan(0);
  });

  it('returns 0 for same status', () => {
    expect(compareRAGStatus('green', 'green')).toBe(0);
    expect(compareRAGStatus('amber', 'amber')).toBe(0);
    expect(compareRAGStatus('red', 'red')).toBe(0);
  });

  it('enables correct array sorting', () => {
    const statuses: RAGStatus[] = ['amber', 'red', 'green', 'amber', 'red'];
    const sorted = [...statuses].sort(compareRAGStatus);

    expect(sorted).toEqual(['red', 'red', 'amber', 'amber', 'green']);
  });
});
