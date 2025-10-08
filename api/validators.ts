/**
 * API Response Validators
 *
 * Zod schemas for runtime validation of API responses.
 * Protects against API contract changes and unexpected data.
 */

import { z } from 'zod';

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

/**
 * Market Pair schema
 */
export const MarketPairSchema = z.object({
  ticker_id: z.string().min(1, 'ticker_id is required'),
  base: z.string().min(1, 'base currency is required'),
  target: z.string().min(1, 'target currency is required'),
});

/**
 * Helper to convert missing/NaN/null values to null for optional numeric fields
 */
const optionalNumber = () =>
  z.preprocess((val) => {
    if (val === undefined || val === null || val === '') return null;
    const num = Number(val);
    return isNaN(num) ? null : num;
  }, z.number().nonnegative().nullable());

/**
 * Raw Market Summary Item schema (actual API response structure)
 * All numeric values come as strings from API
 * highest_bid and lowest_ask may be missing entirely for some markets
 */
const RawMarketSummaryItemSchema = z.object({
  trading_pairs: z.string().min(1, 'trading_pairs is required'),
  lowest_price_24h: z.coerce.number().nonnegative('lowest_price_24h must be non-negative'),
  highest_price_24h: z.coerce.number().nonnegative('highest_price_24h must be non-negative'),
  highest_bid: optionalNumber(),
  lowest_ask: optionalNumber(),
  base_volume: z.coerce.number().nonnegative('base_volume must be non-negative'),
  quote_volume: z.coerce.number().nonnegative('quote_volume must be non-negative'),
  last_price: z.coerce.number().nonnegative('last_price must be non-negative'),
  price_change_percent_24h: z.coerce.number().optional(),
});

/**
 * Raw Market Summary Response schema (API wrapper structure)
 */
const RawMarketSummaryResponseSchema = z.object({
  timestamp: z.string(),
  summary: z.array(RawMarketSummaryItemSchema),
});

/**
 * Processed Market Summary schema (application-level interface)
 */
export const MarketSummarySchema = z.object({
  ticker_id: z.string().min(1, 'ticker_id is required'),
  base_currency: z.string().min(1, 'base_currency is required'),
  target_currency: z.string().min(1, 'target_currency is required'),
  last_price: z.number().nonnegative('last_price must be non-negative'),
  base_volume: z.number().nonnegative('base_volume must be non-negative'),
  target_volume: z.number().nonnegative('target_volume must be non-negative'),
  bid: z.number().nonnegative().nullable(),
  ask: z.number().nonnegative().nullable(),
  high: z.number().nonnegative('high must be non-negative'),
  low: z.number().nonnegative('low must be non-negative'),
});

/**
 * Raw Order Book Entry schema (actual API response structure)
 * All numeric values come as strings from API
 */
const RawOrderBookEntrySchema = z.object({
  price: z.coerce.number().positive('price must be positive'),
  quantity: z.coerce.number().positive('quantity must be positive'),
});

/**
 * Raw Market Depth Response schema (actual API response structure)
 */
const RawMarketDepthResponseSchema = z.object({
  timestamp: z.string(), // ISO timestamp string
  bids: z.array(RawOrderBookEntrySchema),
  asks: z.array(RawOrderBookEntrySchema),
});

/**
 * Order Book Entry schema (application-level interface)
 */
export const OrderBookEntrySchema = z.object({
  price: z.number().positive('price must be positive'),
  quantity: z.number().positive('quantity must be positive'),
});

/**
 * Market Depth schema (application-level interface)
 */
export const MarketDepthSchema = z.object({
  ticker_id: z.string().min(1, 'ticker_id is required'),
  timestamp: z.number().int().positive('timestamp must be positive'),
  bids: z.array(OrderBookEntrySchema),
  asks: z.array(OrderBookEntrySchema),
});

// ============================================================================
// TYPE INFERENCE
// ============================================================================

/**
 * Inferred TypeScript types from Zod schemas
 * These match the types in types.ts but are derived from runtime schemas
 */
export type ValidatedMarketPair = z.infer<typeof MarketPairSchema>;
export type ValidatedMarketSummary = z.infer<typeof MarketSummarySchema>;
export type ValidatedOrderBookEntry = z.infer<typeof OrderBookEntrySchema>;
export type ValidatedMarketDepth = z.infer<typeof MarketDepthSchema>;

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate and parse market pairs array
 * @throws {z.ZodError} if validation fails
 */
export function validateMarketPairs(data: unknown): ValidatedMarketPair[] {
  try {
    return MarketPairSchema.array().parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Validator] Market pairs validation failed:', error.errors);
      throw new Error(
        `Invalid market pairs data: ${error.errors.map((e) => e.message).join(', ')}`
      );
    }
    throw error;
  }
}

/**
 * Validate and parse market summary response
 * Transforms raw API response to application-level format
 * @throws {z.ZodError} if validation fails
 */
export function validateMarketSummary(data: unknown): ValidatedMarketSummary[] {
  try {
    // Parse and validate raw API response
    const rawResponse = RawMarketSummaryResponseSchema.parse(data);

    // Transform each raw summary item to application format
    const transformed: ValidatedMarketSummary[] = rawResponse.summary.map((item) => {
      // Parse trading_pairs (e.g., "ETH-EURC" or "BTC_USDT")
      const separator = item.trading_pairs.includes('-') ? '-' : '_';
      const parts = item.trading_pairs.split(separator);
      const base = parts[0] ?? '';
      const target = parts[1] ?? '';

      // Create ticker_id in underscore format
      const ticker_id = `${base}_${target}`;

      return {
        ticker_id,
        base_currency: base,
        target_currency: target,
        last_price: item.last_price,
        base_volume: item.base_volume,
        target_volume: item.quote_volume,
        bid: item.highest_bid ?? null,
        ask: item.lowest_ask ?? null,
        high: item.highest_price_24h,
        low: item.lowest_price_24h,
      };
    });

    return transformed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Validator] Market summary validation failed:', error.errors);
      throw new Error(
        `Invalid market summary data: ${error.errors.map((e) => e.message).join(', ')}`
      );
    }
    throw error;
  }
}

/**
 * Validate and parse market depth response
 * Transforms raw API response to application-level format
 *
 * @param data - Raw API response
 * @param marketId - Ticker ID (e.g., "BTC_USDT") from request URL
 * @throws {z.ZodError} if validation fails
 */
export function validateMarketDepth(data: unknown, marketId: string): ValidatedMarketDepth {
  try {
    // Parse and validate raw API response
    const rawResponse = RawMarketDepthResponseSchema.parse(data);

    // Convert ISO timestamp to Unix milliseconds
    const timestamp = new Date(rawResponse.timestamp).getTime();

    // Transform to application format
    // Note: bids and asks are already coerced to numbers by RawOrderBookEntrySchema
    return {
      ticker_id: marketId,
      timestamp,
      bids: rawResponse.bids,
      asks: rawResponse.asks,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Validator] Market depth validation failed:', error.errors);
      throw new Error(
        `Invalid market depth data: ${error.errors.map((e) => e.message).join(', ')}`
      );
    }
    throw error;
  }
}

/**
 * Safe validation that returns null instead of throwing
 */
export function safeValidateMarketPairs(data: unknown): ValidatedMarketPair[] | null {
  const result = MarketPairSchema.array().safeParse(data);
  return result.success ? result.data : null;
}

/**
 * Safe validation that returns null instead of throwing
 * Uses same transformation logic as validateMarketSummary
 */
export function safeValidateMarketSummary(data: unknown): ValidatedMarketSummary[] | null {
  try {
    return validateMarketSummary(data);
  } catch {
    return null;
  }
}

/**
 * Safe validation that returns null instead of throwing
 * Uses same transformation logic as validateMarketDepth
 */
export function safeValidateMarketDepth(
  data: unknown,
  marketId: string
): ValidatedMarketDepth | null {
  try {
    return validateMarketDepth(data, marketId);
  } catch {
    return null;
  }
}
