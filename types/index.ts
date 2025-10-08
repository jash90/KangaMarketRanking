/**
 * Markets Feature Types
 *
 * TypeScript types and interfaces for the markets feature
 */

/**
 * RAG (Red-Amber-Green) Status for liquidity classification
 */
export type RAGStatus = 'green' | 'amber' | 'red';

/**
 * Processed market data for display
 */
export interface MarketData {
  tickerId: string;
  market: string;
  baseSymbol: string;
  targetSymbol: string;
  highestBid: number | null;
  lowestAsk: number | null;
  spread: number | null;
  spreadPercentage: number | null;
  ragStatus: RAGStatus;
  lastPrice: number;
  volume24h: number;
  high24h?: number;
  low24h?: number;
}

/**
 * Market depth/order book entry
 */
export interface OrderBookEntry {
  price: number;
  quantity: number;
}

/**
 * Market depth data
 */
export interface MarketDepthData {
  tickerId: string;
  timestamp: number;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

/**
 * Market filter options
 */
export interface MarketFilters {
  search?: string;
  minVolume?: number;
  ragStatus?: RAGStatus[];
  sortBy?: 'volume' | 'spread' | 'name';
  sortDirection?: 'asc' | 'desc';
}

/**
 * API Response Types
 */

/**
 * Market pair from /api/market/pairs endpoint
 */
export interface MarketPair {
  ticker_id: string;
  base: string;
  target: string;
}

/**
 * Market summary from /api/market/summary endpoint
 */
export interface MarketSummary {
  trading_pairs: string;
  highest_bid: string | null;
  lowest_ask: string | null;
  last_price: string;
  base_volume: string;
  target_volume: string;
}

/**
 * Market depth response from /api/market/depth/{marketId} endpoint
 */
export interface MarketDepthResponse {
  ticker_id: string;
  timestamp: string;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}
