/**
 * Number and Currency Formatters
 *
 * Utilities for formatting numbers, prices, and volumes for display.
 */

/**
 * Format a number as currency with appropriate decimals
 *
 * @param value - Number to format
 * @param currency - Currency code (default: 'USD')
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string or 'N/A'
 *
 * @example
 * formatCurrency(1234.56) // Returns "$1,234.56"
 * formatCurrency(null) // Returns "N/A"
 */
export function formatCurrency(
  value: number | null,
  currency: string = 'USD',
  decimals: number = 2
): string {
  if (value === null || !Number.isFinite(value)) {
    return 'N/A';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format volume with K, M, B suffixes
 *
 * @param value - Volume number
 * @returns Formatted string with suffix or 'N/A'
 *
 * @example
 * formatVolume(1234) // Returns "1.23K"
 * formatVolume(1234567) // Returns "1.23M"
 * formatVolume(1234567890) // Returns "1.23B"
 */
export function formatVolume(value: number | null): string {
  if (value === null || !Number.isFinite(value)) {
    return 'N/A';
  }

  const absValue = Math.abs(value);

  if (absValue >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (absValue >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }
  if (absValue >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  }

  return value.toFixed(2);
}

/**
 * Convert number to subscript Unicode characters
 *
 * @param num - Number to convert to subscript
 * @returns Subscript string
 *
 * @example
 * toSubscript(5) // Returns "₅"
 * toSubscript(12) // Returns "₁₂"
 */
function toSubscript(num: number): string {
  const subscripts = '₀₁₂₃₄₅₆₇₈₉';
  return String(num)
    .split('')
    .map((digit) => subscripts[parseInt(digit)])
    .join('');
}

/**
 * Format very small number with subscript notation
 * Shows zero count as subscript for readability
 *
 * @param value - Number to format
 * @returns Subscript notation string
 *
 * @example
 * formatSubscriptNotation(0.0000055) // Returns "0.0₅55"
 * formatSubscriptNotation(0.00001982) // Returns "0.0₄1982"
 * formatSubscriptNotation(0.000005) // Returns "0.0₅5"
 */
function formatSubscriptNotation(value: number): string {
  const absValue = Math.abs(value);
  const str = absValue.toFixed(20).replace(/0+$/, ''); // Remove trailing zeros

  // Find decimal point
  const decimalIndex = str.indexOf('.');
  if (decimalIndex === -1) return value.toString();

  const afterDecimal = str.substring(decimalIndex + 1);

  // Count leading zeros after decimal
  let zeroCount = 0;
  for (const char of afterDecimal) {
    if (char === '0') zeroCount++;
    else break;
  }

  // Extract significant digits (limit to 4 digits for compact display)
  const significantPart = afterDecimal.substring(zeroCount);
  const significantDigits = significantPart.substring(0, 4);

  // Build subscript notation: 0.0₅55
  const sign = value < 0 ? '-' : '';
  return `${sign}0.0${toSubscript(zeroCount)}${significantDigits}`;
}

/**
 * Format price with adaptive decimal places based on CoinGecko patterns
 * Industry-standard formatting for cryptocurrency prices
 * Uses subscript notation for very small numbers
 *
 * @param price - Price number
 * @returns Formatted price string or 'N/A'
 *
 * @example
 * formatPrice(0.0000055) // Returns "0.0₅55"
 * formatPrice(0.00123) // Returns "0.001230"
 * formatPrice(0.2511) // Returns "0.2511"
 * formatPrice(1.23) // Returns "1.23"
 * formatPrice(4466.70) // Returns "4,466.70"
 * formatPrice(122294) // Returns "122,294"
 */
export function formatPrice(price: number | null): string {
  if (price === null || !Number.isFinite(price)) {
    return 'N/A';
  }

  // Special case for zero
  if (price === 0) {
    return '0.00';
  }

  const absPrice = Math.abs(price);

  // Very small (< $0.0001): Use subscript notation if >= 4 leading zeros
  // This provides better readability for micro-cap tokens
  if (absPrice < 0.0001) {
    // Count leading zeros to decide on notation
    const str = absPrice.toFixed(20);
    const afterDecimal = str.substring(str.indexOf('.') + 1);
    let zeroCount = 0;
    for (const char of afterDecimal) {
      if (char === '0') zeroCount++;
      else break;
    }

    // Use subscript notation for 4+ leading zeros
    if (zeroCount >= 4) {
      return formatSubscriptNotation(price);
    }
  }

  // Small (< $0.01): 6 decimals
  if (absPrice < 0.01) {
    return price.toFixed(6);
  }

  // Medium (< $1): 4 decimals (CoinGecko pattern)
  if (absPrice < 1) {
    return price.toFixed(4);
  }

  // Large (>= $100,000): NO decimals (CoinGecko pattern)
  if (absPrice >= 100000) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }

  // Regular ($1 - $99,999): 2 decimals with thousand separators
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Format price with fixed width for column alignment
 * Ensures minimum 7-digit display with thousand separators
 * Uses space padding for consistent column width
 * Supports subscript notation for very small numbers
 *
 * @param price - Price number
 * @returns Fixed-width formatted price string
 *
 * @example
 * formatPriceFixed(1234.56) // Returns "  1,234.56"
 * formatPriceFixed(0.001234) // Returns "0.001234  "
 * formatPriceFixed(122725) // Returns "   122,725" (no decimals)
 * formatPriceFixed(0.0000055) // Returns "  0.0₅55  " (subscript)
 */
export function formatPriceFixed(price: number | null): string {
  if (price === null || !Number.isFinite(price)) {
    return '     N/A';
  }

  const formatted = formatPrice(price);

  // Subscript characters count as 1 character but may render differently
  // For subscript notation (contains Unicode subscripts), use shorter padding
  const hasSubscript = /[₀₁₂₃₄₅₆₇₈₉]/.test(formatted);

  if (hasSubscript) {
    // Pad to 8 characters for subscript notation (they're more compact)
    return formatted.padStart(8, ' ').padEnd(10, ' ');
  }

  // Pad to minimum 10 characters for consistent alignment
  return formatted.padStart(10, ' ');
}

/**
 * Format number with commas as thousands separators
 *
 * @param value - Number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted number string or 'N/A'
 *
 * @example
 * formatNumber(1234567) // Returns "1,234,567"
 * formatNumber(1234.5678, 2) // Returns "1,234.57"
 */
export function formatNumber(value: number | null, decimals: number = 0): string {
  if (value === null || !Number.isFinite(value)) {
    return 'N/A';
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format percentage with % symbol
 *
 * @param value - Percentage value (e.g., 0.05 for 5%)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string or 'N/A'
 *
 * @example
 * formatPercentage(0.0564) // Returns "5.64%"
 * formatPercentage(1.2345) // Returns "123.45%"
 */
export function formatPercentage(value: number | null, decimals: number = 2): string {
  if (value === null || !Number.isFinite(value)) {
    return 'N/A';
  }

  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format spread percentage (CoinGecko pattern: 1 decimal)
 *
 * @param value - Spread percentage value
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted spread string or 'N/A'
 *
 * @example
 * formatSpread(0.73) // Returns "0.7%"
 * formatSpread(6.94) // Returns "6.9%"
 * formatSpread(null) // Returns "N/A"
 */
export function formatSpread(value: number | null, decimals: number = 1): string {
  if (value === null || !Number.isFinite(value)) {
    return 'N/A';
  }

  return `${value.toFixed(decimals)}%`;
}

/**
 * Format change with + or - prefix and color indication
 *
 * @param value - Change value
 * @param decimals - Number of decimal places (default: 2)
 * @returns Object with formatted string and color
 *
 * @example
 * formatChange(5.234) // Returns { text: "+5.23%", color: "green", isPositive: true }
 * formatChange(-2.145) // Returns { text: "-2.15%", color: "red", isPositive: false }
 */
export function formatChange(
  value: number | null,
  decimals: number = 2
): { text: string; color: string; isPositive: boolean } {
  if (value === null || !Number.isFinite(value)) {
    return {
      text: 'N/A',
      color: '#6B7280', // Gray
      isPositive: false,
    };
  }

  const isPositive = value >= 0;
  const sign = isPositive ? '+' : '';
  const color = isPositive ? '#10B981' : '#EF4444'; // Green : Red

  return {
    text: `${sign}${value.toFixed(decimals)}%`,
    color,
    isPositive,
  };
}

/**
 * Format timestamp to human-readable date/time
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @param includeTime - Include time in output (default: true)
 * @returns Formatted date string
 *
 * @example
 * formatTimestamp(1640000000000) // Returns "Dec 20, 2021, 12:53 PM"
 * formatTimestamp(1640000000000, false) // Returns "Dec 20, 2021"
 */
export function formatTimestamp(timestamp: number, includeTime: boolean = true): string {
  const date = new Date(timestamp);

  if (!includeTime) {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Format relative time (e.g., "2 hours ago")
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Relative time string
 *
 * @example
 * formatRelativeTime(Date.now() - 3600000) // Returns "1 hour ago"
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
}

/**
 * Truncate text with ellipsis
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 *
 * @example
 * truncate("Very long text here", 10) // Returns "Very long..."
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.substring(0, maxLength)}...`;
}
