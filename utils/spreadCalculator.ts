/**
 * Spread Calculator
 *
 * Utilities for calculating and formatting bid-ask spreads.
 * Spread is a key indicator of market liquidity and trading costs.
 */

// Re-export formatSpread from formatters for convenience
export { formatSpread } from './formatters';

/**
 * Spread quality classifications
 */
export type SpreadQuality = 'tight' | 'normal' | 'wide' | 'very_wide' | 'unknown';

/**
 * Calculate percentage spread from bid and ask prices
 *
 * Formula: ((ask - bid) / ((ask + bid) / 2)) * 100
 * This is the standard mid-price spread formula.
 *
 * @param bid - Highest bid price (what buyers are willing to pay)
 * @param ask - Lowest ask price (what sellers are asking)
 * @returns Spread percentage (e.g., 1.5 for 1.5%) or null if invalid
 *
 * Returns null for:
 * - null/undefined/NaN/Infinity values
 * - Zero or negative values
 * - ask < bid (invalid orderbook)
 *
 * @example
 * calculateSpread(100, 102) // => 1.98 (approx)
 * calculateSpread(null, 100) // => null
 * calculateSpread(100, 90) // => null (invalid: ask < bid)
 */
export function calculateSpread(
  bid: number | null | undefined,
  ask: number | null | undefined
): number | null {
  // Validate inputs
  if (bid == null || ask == null) {
    return null;
  }

  if (!Number.isFinite(bid) || !Number.isFinite(ask)) {
    return null;
  }

  if (bid <= 0 || ask <= 0) {
    return null;
  }

  // Check for invalid orderbook (ask should be >= bid)
  if (ask < bid) {
    return null;
  }

  // Handle edge case where bid equals ask
  if (bid === ask) {
    return 0;
  }

  // Calculate mid-price spread
  const midPrice = (bid + ask) / 2;
  const spread = ((ask - bid) / midPrice) * 100;

  return spread;
}

/**
 * Calculate absolute spread (difference between ask and bid)
 *
 * @param bid - Highest bid price
 * @param ask - Lowest ask price
 * @returns Absolute spread or null if invalid
 *
 * @example
 * calculateAbsoluteSpread(100, 105) // => 5
 * calculateAbsoluteSpread(null, 100) // => null
 */
export function calculateAbsoluteSpread(
  bid: number | null | undefined,
  ask: number | null | undefined
): number | null {
  // Validate inputs
  if (bid == null || ask == null) {
    return null;
  }

  if (!Number.isFinite(bid) || !Number.isFinite(ask)) {
    return null;
  }

  if (bid <= 0 || ask <= 0) {
    return null;
  }

  return ask - bid;
}

/**
 * Calculate mid-price (average of bid and ask)
 *
 * @param bid - Highest bid price
 * @param ask - Lowest ask price
 * @returns Mid-price or null if invalid
 *
 * @example
 * calculateMidPrice(100, 102) // => 101
 * calculateMidPrice(null, 100) // => null
 */
export function calculateMidPrice(
  bid: number | null | undefined,
  ask: number | null | undefined
): number | null {
  // Validate inputs
  if (bid == null || ask == null) {
    return null;
  }

  if (!Number.isFinite(bid) || !Number.isFinite(ask)) {
    return null;
  }

  return (bid + ask) / 2;
}

/**
 * Classify spread quality
 *
 * Classifications:
 * - tight: < 0.5% (excellent liquidity)
 * - normal: 0.5% - 2% (good liquidity)
 * - wide: 2% - 5% (acceptable liquidity)
 * - very_wide: > 5% (poor liquidity)
 * - unknown: null/invalid
 *
 * @param spread - Spread percentage
 * @returns Spread quality classification
 *
 * @example
 * classifySpreadQuality(0.3)   // => 'tight'
 * classifySpreadQuality(1.5)   // => 'normal'
 * classifySpreadQuality(3.5)   // => 'wide'
 * classifySpreadQuality(10.0)  // => 'very_wide'
 * classifySpreadQuality(null)  // => 'unknown'
 */
export function classifySpreadQuality(spread: number | null | undefined): SpreadQuality {
  if (spread == null || !Number.isFinite(spread)) {
    return 'unknown';
  }

  if (spread < 0.5) {
    return 'tight';
  }

  if (spread < 2.0) {
    return 'normal';
  }

  if (spread < 5.0) {
    return 'wide';
  }

  return 'very_wide';
}
