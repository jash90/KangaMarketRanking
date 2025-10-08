/**
 * RAG (Red-Amber-Green) Liquidity Classifier
 *
 * Classification system for market liquidity based on bid-ask spread.
 * Used to quickly assess trading viability.
 */

import { RAGStatus } from '@/types';

/**
 * RAG classification thresholds
 */
export const RAG_THRESHOLD = {
  GREEN_MAX: 2.0, // ≤ 2% spread = good liquidity
} as const;

/**
 * RAG color palette
 */
const RAG_COLORS = {
  green: '#10B981', // Emerald 500
  amber: '#F59E0B', // Amber 500
  red: '#EF4444', // Red 500
} as const;

/**
 * RAG emojis
 */
const RAG_EMOJIS = {
  green: '🟢',
  amber: '🟡',
  red: '🔴',
} as const;

/**
 * RAG descriptions
 */
const RAG_DESCRIPTIONS = {
  green: 'Good Liquidity',
  amber: 'Moderate Liquidity',
  red: 'Poor Liquidity',
} as const;

/**
 * RAG priority for sorting (higher = better)
 */
const RAG_PRIORITY = {
  green: 2,
  amber: 1,
  red: 0,
} as const;

/**
 * Classify spread into RAG status
 *
 * @param spread - Spread percentage (e.g., 1.5 for 1.5%)
 * @returns RAG status: 'green', 'amber', or 'red'
 *
 * Classification rules:
 * - Green: spread ≤ 2% (good liquidity)
 * - Amber: spread > 2% (moderate liquidity)
 * - Red: spread is null/NaN/Infinity (poor/no liquidity)
 *
 * @example
 * classifyRAG(1.5)   // => 'green'
 * classifyRAG(3.5)   // => 'amber'
 * classifyRAG(null)  // => 'red'
 */
export function classifyRAG(spread: number | null): RAGStatus {
  // Red: No liquidity data
  if (spread === null || !Number.isFinite(spread)) {
    return 'red';
  }

  // Green: Good liquidity (≤ 2%)
  if (spread <= RAG_THRESHOLD.GREEN_MAX) {
    return 'green';
  }

  // Amber: Moderate liquidity (> 2%)
  return 'amber';
}

/**
 * Get color for RAG status
 *
 * @param status - RAG status
 * @returns Hex color code
 *
 * @example
 * getRAGColor('green') // => '#10B981'
 */
export function getRAGColor(status: RAGStatus): string {
  return RAG_COLORS[status];
}

/**
 * Get emoji for RAG status
 *
 * @param status - RAG status
 * @returns Emoji character
 *
 * @example
 * getRAGEmoji('green') // => '🟢'
 */
export function getRAGEmoji(status: RAGStatus): string {
  return RAG_EMOJIS[status];
}

/**
 * Get description for RAG status
 *
 * @param status - RAG status
 * @returns Description text
 *
 * @example
 * getRAGDescription('green') // => 'Good Liquidity'
 */
export function getRAGDescription(status: RAGStatus): string {
  return RAG_DESCRIPTIONS[status];
}

/**
 * Get detailed explanation for RAG status
 *
 * @param status - RAG status
 * @param spread - Optional spread percentage for detailed message
 * @returns Detailed explanation text
 *
 * @example
 * getRAGExplanation('green', 1.5)
 * // => "Spread: 1.50% - Excellent liquidity with tight bid-ask spread. Low trading cost expected."
 */
export function getRAGExplanation(status: RAGStatus, spread?: number | null): string {
  const spreadText =
    spread !== null && spread !== undefined && Number.isFinite(spread)
      ? `Spread: ${spread.toFixed(2)}% - `
      : '';

  switch (status) {
    case 'green':
      return `${spreadText}Excellent liquidity with tight bid-ask spread. Low trading cost expected.`;
    case 'amber':
      return `${spreadText}Moderate liquidity with wider bid-ask spread. Higher trading cost may apply.`;
    case 'red':
      return 'Poor or no liquidity. No active bids or asks available for this market.';
  }
}

/**
 * Get trading recommendation for RAG status
 *
 * @param status - RAG status
 * @returns Trading recommendation text
 *
 * @example
 * getRAGRecommendation('green')
 * // => "Recommended for trading - good liquidity available."
 */
export function getRAGRecommendation(status: RAGStatus): string {
  switch (status) {
    case 'green':
      return 'Recommended for trading - good liquidity available.';
    case 'amber':
      return 'Acceptable for trading but monitor spread closely.';
    case 'red':
      return 'Not recommended for trading due to insufficient liquidity.';
  }
}

/**
 * Compare function for sorting RAG statuses
 *
 * Sorts in descending priority: green > amber > red
 *
 * @param a - First RAG status
 * @param b - Second RAG status
 * @returns Negative if a < b, positive if a > b, zero if equal
 *
 * @example
 * const statuses = ['amber', 'red', 'green'];
 * statuses.sort(compareRAGStatus); // => ['red', 'amber', 'green']
 */
export function compareRAGStatus(a: RAGStatus, b: RAGStatus): number {
  return RAG_PRIORITY[a] - RAG_PRIORITY[b];
}
