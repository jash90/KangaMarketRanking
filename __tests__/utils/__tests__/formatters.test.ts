/**
 * Formatters Tests
 *
 * Unit tests for number and date formatting utilities.
 */

import {
  formatChange,
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatPrice,
  formatPriceFixed,
  formatRelativeTime,
  formatTimestamp,
  formatVolume,
  truncate,
} from '@/utils/formatters';

describe('formatCurrency', () => {
  it('formats currency with default USD and 2 decimals', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
    expect(formatCurrency(100)).toBe('$100.00');
  });

  it('formats currency with custom decimals', () => {
    expect(formatCurrency(1234.5678, 'USD', 4)).toBe('$1,234.5678');
  });

  it('returns "N/A" for null', () => {
    expect(formatCurrency(null)).toBe('N/A');
  });

  it('returns "N/A" for Infinity', () => {
    expect(formatCurrency(Infinity)).toBe('N/A');
  });
});

describe('formatVolume', () => {
  it('formats small numbers normally', () => {
    expect(formatVolume(500)).toBe('500.00');
    expect(formatVolume(999)).toBe('999.00');
  });

  it('formats thousands with K suffix', () => {
    expect(formatVolume(1000)).toBe('1.00K');
    expect(formatVolume(5500)).toBe('5.50K');
    expect(formatVolume(999000)).toBe('999.00K');
  });

  it('formats millions with M suffix', () => {
    expect(formatVolume(1000000)).toBe('1.00M');
    expect(formatVolume(5500000)).toBe('5.50M');
    expect(formatVolume(999000000)).toBe('999.00M');
  });

  it('formats billions with B suffix', () => {
    expect(formatVolume(1000000000)).toBe('1.00B');
    expect(formatVolume(5500000000)).toBe('5.50B');
  });

  it('returns "N/A" for null', () => {
    expect(formatVolume(null)).toBe('N/A');
  });

  it('handles negative numbers', () => {
    expect(formatVolume(-1500)).toBe('-1.50K');
  });
});

describe('formatPrice', () => {
  it('uses subscript notation for extremely small prices (< 0.00001)', () => {
    expect(formatPrice(0.0000055)).toBe('0.0₅55');
    expect(formatPrice(0.0000001)).toBe('0.0₆1');
    expect(formatPrice(0.000005)).toBe('0.0₅5');
    expect(formatPrice(0.00001982)).toBe('0.0₄1982');
  });

  it('uses 6 decimals for very small prices (0.0001 - 0.01) with <4 leading zeros', () => {
    expect(formatPrice(0.001234)).toBe('0.001234');
    expect(formatPrice(0.0001)).toBe('0.000100');
    expect(formatPrice(0.00012)).toBe('0.000120');
  });

  it('uses 4 decimals for small prices (0.01 - 1) - CoinGecko pattern', () => {
    expect(formatPrice(0.2511)).toBe('0.2511');
    expect(formatPrice(0.9998)).toBe('0.9998');
    expect(formatPrice(0.5)).toBe('0.5000');
    expect(formatPrice(0.01)).toBe('0.0100');
  });

  it('uses 2 decimals with thousand separators for regular prices ($1 - $99,999)', () => {
    expect(formatPrice(1.23)).toBe('1.23');
    expect(formatPrice(100.567)).toBe('100.57');
    expect(formatPrice(1234.56)).toBe('1,234.56');
    expect(formatPrice(4466.7)).toBe('4,466.70');
    expect(formatPrice(16583)).toBe('16,583.00');
  });

  it('uses NO decimals for large prices (>= $100,000) - CoinGecko pattern', () => {
    expect(formatPrice(122294)).toBe('122,294');
    expect(formatPrice(122725.32)).toBe('122,725');
    expect(formatPrice(1000000.5)).toBe('1,000,001');
  });

  it('handles edge cases correctly', () => {
    expect(formatPrice(0)).toBe('0.00');
    expect(formatPrice(-0.0000055)).toBe('-0.0₅55');
    expect(formatPrice(-1234.56)).toBe('-1,234.56');
    expect(formatPrice(-122294)).toBe('-122,294');
  });

  it('returns "N/A" for null', () => {
    expect(formatPrice(null)).toBe('N/A');
  });

  it('returns "N/A" for Infinity', () => {
    expect(formatPrice(Infinity)).toBe('N/A');
    expect(formatPrice(-Infinity)).toBe('N/A');
  });
});

describe('formatPriceFixed', () => {
  it('pads regular prices to minimum 10 characters for alignment', () => {
    expect(formatPriceFixed(1234.56)).toBe('  1,234.56');
    expect(formatPriceFixed(123.45)).toBe('    123.45');
    expect(formatPriceFixed(12.34)).toBe('     12.34');
  });

  it('handles large prices (>= $100k) with NO decimals - CoinGecko pattern', () => {
    expect(formatPriceFixed(122294)).toBe('   122,294');
    expect(formatPriceFixed(122725.32)).toBe('   122,725');
    expect(formatPriceFixed(1000000.5)).toBe(' 1,000,001');
  });

  it('handles small prices with proper padding', () => {
    expect(formatPriceFixed(0.001234)).toBe('  0.001234');
    expect(formatPriceFixed(0.2511)).toBe('    0.2511');
    expect(formatPriceFixed(0.9998)).toBe('    0.9998');
  });

  it('handles extremely small prices with subscript notation', () => {
    expect(formatPriceFixed(0.0000055)).toBe('  0.0₅55  ');
    expect(formatPriceFixed(0.000005)).toBe('   0.0₅5  ');
    expect(formatPriceFixed(0.00001982)).toBe('0.0₄1982  ');
  });

  it('returns padded N/A for null', () => {
    expect(formatPriceFixed(null)).toBe('     N/A');
  });

  it('handles zero correctly', () => {
    expect(formatPriceFixed(0)).toBe('      0.00');
  });

  it('handles negative values with padding', () => {
    expect(formatPriceFixed(-1234.56)).toBe(' -1,234.56');
    expect(formatPriceFixed(-122294)).toBe('  -122,294');
    expect(formatPriceFixed(-0.0000055)).toBe(' -0.0₅55  ');
  });
});

describe('formatNumber', () => {
  it('formats with commas and default 0 decimals', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
    expect(formatNumber(1000)).toBe('1,000');
  });

  it('formats with custom decimals', () => {
    expect(formatNumber(1234.5678, 2)).toBe('1,234.57');
    expect(formatNumber(1000.12, 3)).toBe('1,000.120');
  });

  it('returns "N/A" for null', () => {
    expect(formatNumber(null)).toBe('N/A');
  });
});

describe('formatPercentage', () => {
  it('formats percentage correctly (input as decimal)', () => {
    expect(formatPercentage(0.0564)).toBe('5.64%');
    expect(formatPercentage(0.1234)).toBe('12.34%');
    expect(formatPercentage(1.2345)).toBe('123.45%');
  });

  it('formats with custom decimals', () => {
    expect(formatPercentage(0.123456, 3)).toBe('12.346%');
  });

  it('returns "N/A" for null', () => {
    expect(formatPercentage(null)).toBe('N/A');
  });
});

describe('formatChange', () => {
  it('formats positive change with + prefix and green color', () => {
    const result = formatChange(5.234);
    expect(result.text).toBe('+5.23%');
    expect(result.color).toBe('#10B981'); // Green
    expect(result.isPositive).toBe(true);
  });

  it('formats negative change with - prefix and red color', () => {
    const result = formatChange(-2.145);
    expect(result.text).toBe('-2.15%');
    expect(result.color).toBe('#EF4444'); // Red
    expect(result.isPositive).toBe(false);
  });

  it('formats zero as positive', () => {
    const result = formatChange(0);
    expect(result.text).toBe('+0.00%');
    expect(result.isPositive).toBe(true);
  });

  it('returns N/A with gray color for null', () => {
    const result = formatChange(null);
    expect(result.text).toBe('N/A');
    expect(result.color).toBe('#6B7280');
    expect(result.isPositive).toBe(false);
  });
});

describe('formatTimestamp', () => {
  it('formats timestamp with time by default', () => {
    const timestamp = new Date('2021-12-20T12:53:00').getTime();
    const result = formatTimestamp(timestamp);

    expect(result).toContain('Dec 20, 2021');
    expect(result).toContain('12:53');
  });

  it('formats timestamp without time when specified', () => {
    const timestamp = new Date('2021-12-20T12:53:00').getTime();
    const result = formatTimestamp(timestamp, false);

    expect(result).toContain('Dec 20, 2021');
    expect(result).not.toContain('12:53');
  });
});

describe('formatRelativeTime', () => {
  const now = Date.now();

  it('formats seconds ago', () => {
    const timestamp = now - 30 * 1000; // 30 seconds ago
    const result = formatRelativeTime(timestamp);
    expect(result).toMatch(/30 seconds? ago/);
  });

  it('formats minutes ago', () => {
    const timestamp = now - 5 * 60 * 1000; // 5 minutes ago
    const result = formatRelativeTime(timestamp);
    expect(result).toBe('5 minutes ago');
  });

  it('formats hours ago', () => {
    const timestamp = now - 3 * 60 * 60 * 1000; // 3 hours ago
    const result = formatRelativeTime(timestamp);
    expect(result).toBe('3 hours ago');
  });

  it('formats days ago', () => {
    const timestamp = now - 2 * 24 * 60 * 60 * 1000; // 2 days ago
    const result = formatRelativeTime(timestamp);
    expect(result).toBe('2 days ago');
  });

  it('handles singular forms correctly', () => {
    const timestamp1 = now - 1 * 60 * 1000; // 1 minute
    expect(formatRelativeTime(timestamp1)).toBe('1 minute ago');

    const timestamp2 = now - 1 * 60 * 60 * 1000; // 1 hour
    expect(formatRelativeTime(timestamp2)).toBe('1 hour ago');

    const timestamp3 = now - 1 * 24 * 60 * 60 * 1000; // 1 day
    expect(formatRelativeTime(timestamp3)).toBe('1 day ago');
  });
});

describe('truncate', () => {
  it('truncates text longer than maxLength', () => {
    expect(truncate('This is a very long text', 10)).toBe('This is a ...');
  });

  it('does not truncate text shorter than maxLength', () => {
    expect(truncate('Short', 10)).toBe('Short');
  });

  it('handles text exactly at maxLength', () => {
    expect(truncate('Exactly10!', 10)).toBe('Exactly10!');
  });

  it('handles empty string', () => {
    expect(truncate('', 10)).toBe('');
  });
});
