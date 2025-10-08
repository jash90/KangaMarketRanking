/**
 * API Type Definitions
 *
 * TypeScript interfaces for Kanga Exchange API responses.
 * These types represent the raw API data structure.
 */

// ============================================================================
// RAW API RESPONSE TYPES
// ============================================================================

/**
 * Market trading pair from /api/market/pairs
 */
export interface MarketPair {
  ticker_id: string;
  base: string;
  target: string;
}

/**
 * Raw market summary item from API (actual response structure)
 */
export interface RawMarketSummary {
  trading_pairs: string;
  lowest_price_24h: string;
  highest_price_24h: string;
  highest_bid: string;
  lowest_ask: string;
  base_volume: string;
  quote_volume: string;
  last_price: string;
  price_change_percent_24h: string;
}

/**
 * Raw API response wrapper for /api/market/summary
 */
export interface RawMarketSummaryResponse {
  timestamp: string;
  summary: RawMarketSummary[];
}

/**
 * Processed market summary for application use
 * Transformed from RawMarketSummary with proper types and field names
 */
export interface MarketSummary {
  ticker_id: string;
  base_currency: string;
  target_currency: string;
  last_price: number;
  base_volume: number;
  target_volume: number;
  bid: number | null;
  ask: number | null;
  high: number;
  low: number;
}

/**
 * Raw order book entry from API (actual response structure)
 */
export interface RawOrderBookEntry {
  price: string;
  quantity: string;
}

/**
 * Raw market depth response from API
 */
export interface RawMarketDepthResponse {
  timestamp: string; // ISO format string
  bids: RawOrderBookEntry[];
  asks: RawOrderBookEntry[];
}

/**
 * Order book entry (processed for application use)
 */
export interface OrderBookEntry {
  price: number;
  quantity: number;
}

/**
 * Market depth (order book) - Processed from raw API response
 */
export interface MarketDepth {
  ticker_id: string;
  timestamp: number;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

// ============================================================================
// APPLICATION DOMAIN TYPES
// ============================================================================

/**
 * RAG (Red-Amber-Green) liquidity status
 * - green: Good liquidity (spread ≤ 2%)
 * - amber: Moderate liquidity (spread > 2%)
 * - red: Poor/no liquidity (no bid or ask available)
 */
export type RAGStatus = 'green' | 'amber' | 'red';

/**
 * Processed market data for display
 * Combines data from MarketPair and MarketSummary with calculated metrics
 */
export interface MarketData {
  tickerId: string;
  market: string; // e.g., "BTC/USDT"
  baseSymbol: string;
  targetSymbol: string;
  highestBid: number | null;
  lowestAsk: number | null;
  spread: number | null; // Spread percentage
  spreadPercentage: number | null;
  ragStatus: RAGStatus;
  lastPrice: number;
  volume24h: number;
  high24h?: number;
  low24h?: number;
}

/**
 * Market depth analysis
 * Processed order book data with useful metrics
 */
export interface MarketDepthAnalysis {
  tickerId: string;
  totalBidQuantity: number;
  totalAskQuantity: number;
  bidPriceRange: { min: number; max: number } | null;
  askPriceRange: { min: number; max: number } | null;
  bidDepth: number; // Number of bid orders
  askDepth: number; // Number of ask orders
  spreadAtDepth: number | null;
  timestamp: number;
}

// ============================================================================
// SORTING AND FILTERING
// ============================================================================

/**
 * Fields that can be used for sorting
 */
export type SortField = 'market' | 'spread' | 'volume' | 'price' | 'ragStatus';

/**
 * Sort order direction
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Sort configuration
 */
export interface SortConfig {
  field: SortField;
  order: SortOrder;
}

/**
 * Filter configuration
 */
export interface FilterConfig {
  searchQuery?: string;
  ragStatus?: RAGStatus | RAGStatus[];
  minVolume?: number;
  maxSpread?: number;
}

// ============================================================================
// API ERROR TYPES
// ============================================================================

/**
 * Structured API error
 */
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

/**
 * Type guard to check if error is ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as ApiError).message === 'string'
  );
}
