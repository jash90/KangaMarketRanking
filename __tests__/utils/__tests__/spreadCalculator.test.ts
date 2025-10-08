/**
 * Spread Calculator Tests
 *
 * Unit tests for spread calculation utilities.
 */

import {
  calculateAbsoluteSpread,
  calculateMidPrice,
  calculateSpread,
  classifySpreadQuality,
} from '@/utils/spreadCalculator';

describe('calculateSpread', () => {
  it('calculates percentage spread correctly for normal values', () => {
    // Formula: ((ask - bid) / midPrice) * 100
    expect(calculateSpread(100, 102)).toBeCloseTo(1.98, 2); // (2 / 101) * 100 H 1.98%
    expect(calculateSpread(1000, 1020)).toBeCloseTo(1.98, 2);
    expect(calculateSpread(50, 51)).toBeCloseTo(1.98, 2);
  });

  it('returns 0 when bid equals ask', () => {
    expect(calculateSpread(100, 100)).toBe(0);
    expect(calculateSpread(1000, 1000)).toBe(0);
  });

  it('calculates small spreads accurately', () => {
    expect(calculateSpread(100, 100.5)).toBeCloseTo(0.498, 2); // ~0.5%
    expect(calculateSpread(1000, 1005)).toBeCloseTo(0.498, 2);
  });

  it('calculates large spreads accurately', () => {
    expect(calculateSpread(100, 110)).toBeCloseTo(9.52, 2); // ~9.5%
    expect(calculateSpread(100, 150)).toBeCloseTo(40, 2); // 40%
  });

  it('returns null for null bid', () => {
    expect(calculateSpread(null, 100)).toBeNull();
  });

  it('returns null for null ask', () => {
    expect(calculateSpread(100, null)).toBeNull();
  });

  it('returns null for undefined bid', () => {
    expect(calculateSpread(undefined, 100)).toBeNull();
  });

  it('returns null for undefined ask', () => {
    expect(calculateSpread(100, undefined)).toBeNull();
  });

  it('returns null for NaN values', () => {
    expect(calculateSpread(NaN, 100)).toBeNull();
    expect(calculateSpread(100, NaN)).toBeNull();
  });

  it('returns null for Infinity values', () => {
    expect(calculateSpread(Infinity, 100)).toBeNull();
    expect(calculateSpread(100, Infinity)).toBeNull();
    expect(calculateSpread(-Infinity, 100)).toBeNull();
  });

  it('returns null for zero values', () => {
    expect(calculateSpread(0, 100)).toBeNull();
    expect(calculateSpread(100, 0)).toBeNull();
  });

  it('returns null for negative bid', () => {
    expect(calculateSpread(-100, 100)).toBeNull();
  });

  it('returns null for negative ask', () => {
    expect(calculateSpread(100, -100)).toBeNull();
  });

  it('returns null when ask is less than bid (invalid orderbook)', () => {
    expect(calculateSpread(100, 90)).toBeNull();
    expect(calculateSpread(1000, 999)).toBeNull();
  });
});

describe('calculateAbsoluteSpread', () => {
  it('calculates absolute spread correctly', () => {
    expect(calculateAbsoluteSpread(100, 105)).toBe(5);
    expect(calculateAbsoluteSpread(1000, 1020)).toBe(20);
    expect(calculateAbsoluteSpread(50, 51)).toBe(1);
  });

  it('returns 0 when bid equals ask', () => {
    expect(calculateAbsoluteSpread(100, 100)).toBe(0);
  });

  it('handles small spreads', () => {
    expect(calculateAbsoluteSpread(100, 100.5)).toBe(0.5);
    expect(calculateAbsoluteSpread(0.001, 0.0015)).toBeCloseTo(0.0005, 4);
  });

  it('handles large spreads', () => {
    expect(calculateAbsoluteSpread(1000, 5000)).toBe(4000);
    expect(calculateAbsoluteSpread(100, 1000)).toBe(900);
  });

  it('returns null for null bid', () => {
    expect(calculateAbsoluteSpread(null, 100)).toBeNull();
  });

  it('returns null for null ask', () => {
    expect(calculateAbsoluteSpread(100, null)).toBeNull();
  });

  it('returns null for undefined values', () => {
    expect(calculateAbsoluteSpread(undefined, 100)).toBeNull();
    expect(calculateAbsoluteSpread(100, undefined)).toBeNull();
  });

  it('returns null for NaN values', () => {
    expect(calculateAbsoluteSpread(NaN, 100)).toBeNull();
    expect(calculateAbsoluteSpread(100, NaN)).toBeNull();
  });

  it('returns null for Infinity values', () => {
    expect(calculateAbsoluteSpread(Infinity, 100)).toBeNull();
    expect(calculateAbsoluteSpread(100, Infinity)).toBeNull();
  });

  it('returns null for zero or negative values', () => {
    expect(calculateAbsoluteSpread(0, 100)).toBeNull();
    expect(calculateAbsoluteSpread(100, 0)).toBeNull();
    expect(calculateAbsoluteSpread(-100, 100)).toBeNull();
  });
});

describe('calculateMidPrice', () => {
  it('calculates mid price correctly', () => {
    expect(calculateMidPrice(100, 102)).toBe(101);
    expect(calculateMidPrice(100, 100)).toBe(100);
    expect(calculateMidPrice(50, 60)).toBe(55);
  });

  it('handles decimal values precisely', () => {
    expect(calculateMidPrice(100.5, 101.5)).toBe(101);
    expect(calculateMidPrice(0.001, 0.003)).toBe(0.002);
  });

  it('handles large numbers', () => {
    expect(calculateMidPrice(10000, 12000)).toBe(11000);
    expect(calculateMidPrice(100000, 100100)).toBe(100050);
  });

  it('returns null for null bid', () => {
    expect(calculateMidPrice(null, 100)).toBeNull();
  });

  it('returns null for null ask', () => {
    expect(calculateMidPrice(100, null)).toBeNull();
  });

  it('returns null for undefined values', () => {
    expect(calculateMidPrice(undefined, 100)).toBeNull();
    expect(calculateMidPrice(100, undefined)).toBeNull();
  });

  it('returns null for NaN values', () => {
    expect(calculateMidPrice(NaN, 100)).toBeNull();
    expect(calculateMidPrice(100, NaN)).toBeNull();
  });

  it('returns null for Infinity values', () => {
    expect(calculateMidPrice(Infinity, 100)).toBeNull();
    expect(calculateMidPrice(100, Infinity)).toBeNull();
  });
});

describe('classifySpreadQuality', () => {
  describe('tight classification (< 0.5%)', () => {
    it('classifies 0% as tight', () => {
      expect(classifySpreadQuality(0)).toBe('tight');
    });

    it('classifies 0.3% as tight', () => {
      expect(classifySpreadQuality(0.3)).toBe('tight');
    });

    it('classifies 0.49% as tight', () => {
      expect(classifySpreadQuality(0.49)).toBe('tight');
    });
  });

  describe('normal classification (0.5% - 2%)', () => {
    it('classifies 0.5% as normal (boundary)', () => {
      expect(classifySpreadQuality(0.5)).toBe('normal');
    });

    it('classifies 1.5% as normal', () => {
      expect(classifySpreadQuality(1.5)).toBe('normal');
    });

    it('classifies 1.99% as normal', () => {
      expect(classifySpreadQuality(1.99)).toBe('normal');
    });
  });

  describe('wide classification (2% - 5%)', () => {
    it('classifies 2.0% as wide (boundary)', () => {
      expect(classifySpreadQuality(2.0)).toBe('wide');
    });

    it('classifies 3.5% as wide', () => {
      expect(classifySpreadQuality(3.5)).toBe('wide');
    });

    it('classifies 4.99% as wide', () => {
      expect(classifySpreadQuality(4.99)).toBe('wide');
    });
  });

  describe('very_wide classification (> 5%)', () => {
    it('classifies 5.0% as very_wide (boundary)', () => {
      expect(classifySpreadQuality(5.0)).toBe('very_wide');
    });

    it('classifies 10% as very_wide', () => {
      expect(classifySpreadQuality(10.0)).toBe('very_wide');
    });

    it('classifies 100% as very_wide', () => {
      expect(classifySpreadQuality(100.0)).toBe('very_wide');
    });
  });

  describe('unknown classification (invalid)', () => {
    it('classifies null as unknown', () => {
      expect(classifySpreadQuality(null)).toBe('unknown');
    });

    it('classifies undefined as unknown', () => {
      expect(classifySpreadQuality(undefined)).toBe('unknown');
    });

    it('classifies NaN as unknown', () => {
      expect(classifySpreadQuality(NaN)).toBe('unknown');
    });

    it('classifies Infinity as unknown', () => {
      expect(classifySpreadQuality(Infinity)).toBe('unknown');
      expect(classifySpreadQuality(-Infinity)).toBe('unknown');
    });
  });
});
