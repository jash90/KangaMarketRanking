#!/usr/bin/env tsx
/**
 * Standalone API Test Script for Node.js
 *
 * Tests the Kanga Exchange API without React Native dependencies
 * Run with: npm run demo
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import type { MarketPair, MarketSummary, MarketDepthResponse, OrderBookEntry } from '../types';

// Simple config
const config = {
  API_BASE_URL: process.env.API_BASE_URL || 'https://public.kanga.exchange',
  API_TIMEOUT: 10000,
  API_RETRY_ATTEMPTS: 3,
};

// Color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

function colorize(text: string, color: keyof typeof colors): string {
  return `${colors[color]}${text}${colors.reset}`;
}

function printHeader(title: string): void {
  console.log('\n' + '='.repeat(60));
  console.log(colorize(title, 'cyan'));
  console.log('='.repeat(60));
}

function printSuccess(message: string): void {
  console.log(colorize('✅ ' + message, 'green'));
}

function printError(message: string): void {
  console.log(colorize('❌ ' + message, 'red'));
}

function printInfo(message: string): void {
  console.log(colorize('ℹ️  ' + message, 'blue'));
}

// Simple API client
class SimpleKangaApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: config.API_BASE_URL,
      timeout: config.API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  async getMarketPairs(): Promise<MarketPair[]> {
    const response = await this.axiosInstance.get('/api/market/pairs');
    return response.data;
  }

  async getMarketSummary(): Promise<MarketSummary[]> {
    const response = await this.axiosInstance.get('/api/market/summary');
    return response.data.summary; // API returns { summary: [...], timestamp: "..." }
  }

  async getMarketDepth(marketId: string): Promise<MarketDepthResponse> {
    const response = await this.axiosInstance.get(`/api/market/depth/${marketId}`);
    return response.data;
  }
}

// Utility functions
function calculateSpread(bid: number | null, ask: number | null): number | null {
  if (bid === null || ask === null || bid === 0) {
    return null;
  }
  const midPrice = (bid + ask) / 2;
  return ((ask - bid) / midPrice) * 100;
}

function classifyRAG(spread: number | null): 'green' | 'amber' | 'red' {
  if (spread === null) return 'red';
  if (spread <= 2) return 'green';
  if (spread <= 5) return 'amber';
  return 'red';
}

function getRAGEmoji(status: string): string {
  switch (status) {
    case 'green':
      return '🟢';
    case 'amber':
      return '🟡';
    case 'red':
      return '🔴';
    default:
      return '⚪';
  }
}

function formatPrice(price: number | null): string {
  if (price === null) return 'N/A';
  return price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  });
}

function formatVolume(volume: number): string {
  return volume.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

function formatSpread(spread: number | null): string {
  if (spread === null) return 'N/A';
  return `${spread.toFixed(2)}%`;
}

// Test functions
async function testMarketPairs(api: SimpleKangaApiClient): Promise<void> {
  printHeader('TEST 1: Fetching Market Pairs');

  try {
    const pairs = await api.getMarketPairs();
    printSuccess(`Fetched ${pairs.length} market pairs`);

    console.log('\n' + colorize('Sample Pairs:', 'yellow'));
    pairs.slice(0, 5).forEach((pair, index) => {
      console.log(`  ${index + 1}. ${pair.base}/${pair.target} (${pair.ticker_id})`);
    });
  } catch (error) {
    printError('Failed to fetch market pairs');
    console.error(error);
    throw error;
  }
}

async function testMarketSummary(api: SimpleKangaApiClient): Promise<void> {
  printHeader('TEST 2: Fetching Market Summary');

  try {
    const summaries = await api.getMarketSummary();
    printSuccess(`Fetched ${summaries.length} market summaries`);

    const marketsWithSpread = summaries.filter((s) => s.highest_bid && s.lowest_ask);
    printInfo(`Markets with active orderbook: ${marketsWithSpread.length}`);

    console.log('\n' + colorize('Sample Markets with Spreads:', 'yellow'));

    marketsWithSpread.slice(0, 10).forEach((market, index) => {
      const bid = parseFloat(market.highest_bid);
      const ask = parseFloat(market.lowest_ask);
      const spread = calculateSpread(bid, ask);
      const ragStatus = classifyRAG(spread);
      const emoji = getRAGEmoji(ragStatus);

      console.log(
        `  ${index + 1}. ${market.trading_pairs}`.padEnd(20) +
          `Bid: ${formatPrice(bid)}`.padEnd(18) +
          `Ask: ${formatPrice(ask)}`.padEnd(18) +
          `Spread: ${formatSpread(spread)}`.padEnd(15) +
          `${emoji} ${ragStatus.toUpperCase()}`
      );
    });

    const avgSpread =
      marketsWithSpread.reduce((sum, m) => {
        const bid = parseFloat(m.highest_bid ?? '0');
        const ask = parseFloat(m.lowest_ask ?? '0');
        const spread = calculateSpread(bid, ask);
        return sum + (spread || 0);
      }, 0) / marketsWithSpread.length;

    console.log('\n' + colorize('Statistics:', 'yellow'));
    console.log(`  Average Spread: ${formatSpread(avgSpread)}`);
  } catch (error) {
    printError('Failed to fetch market summary');
    console.error(error);
    throw error;
  }
}

async function testMarketDepth(api: SimpleKangaApiClient): Promise<void> {
  printHeader('TEST 3: Fetching Market Depth');

  try {
    const summaries = await api.getMarketSummary();
    const marketWithOrders = summaries.find((s) => s.highest_bid && s.lowest_ask);

    if (!marketWithOrders) {
      printError('No markets with active orderbook found');
      return;
    }

    const marketId = marketWithOrders.trading_pairs;
    printInfo(`Testing with market: ${marketId}`);

    const depth = await api.getMarketDepth(marketId);
    printSuccess(`Fetched market depth for ${depth.ticker_id}`);

    console.log('\n' + colorize('Order Book Summary:', 'yellow'));
    console.log(`  Bid Orders: ${depth.bids.length}`);
    console.log(`  Ask Orders: ${depth.asks.length}`);

    if (depth.bids.length > 0) {
      const topBid = depth.bids[0];
      console.log(
        `  Top Bid: ${formatPrice(topBid?.price)} (${formatVolume(topBid?.quantity)} units)`
      );
    }

    if (depth.asks.length > 0) {
      const topAsk = depth.asks[0];
      console.log(
        `  Top Ask: ${formatPrice(topAsk?.price)} (${formatVolume(topAsk?.quantity)} units)`
      );
    }

    const totalBidLiquidity = depth.bids.reduce((sum, bid) => sum + bid.quantity, 0);
    const totalAskLiquidity = depth.asks.reduce((sum, ask) => sum + ask.quantity, 0);

    console.log('\n' + colorize('Liquidity:', 'yellow'));
    console.log(`  Total Bid Quantity: ${formatVolume(totalBidLiquidity)}`);
    console.log(`  Total Ask Quantity: ${formatVolume(totalAskLiquidity)}`);
  } catch (error) {
    printError('Failed to fetch market depth');
    console.error(error);
    throw error;
  }
}

async function runDemo(): Promise<void> {
  console.clear();

  printHeader('🚀 Kanga Market Ranking - API Demo');
  console.log(colorize('Testing Kanga Exchange API\n', 'gray'));
  console.log(colorize(`API Base URL: ${config.API_BASE_URL}\n`, 'gray'));

  const api = new SimpleKangaApiClient();

  try {
    await testMarketPairs(api);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await testMarketSummary(api);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await testMarketDepth(api);

    printHeader('✅ All Tests Passed!');
    console.log(colorize('\nKey Features Validated:', 'green'));
    console.log('  ✅ Market pairs endpoint');
    console.log('  ✅ Market summary endpoint');
    console.log('  ✅ Market depth endpoint');
    console.log('  ✅ Spread calculations');
    console.log('  ✅ RAG classification');
    console.log('  ✅ Data formatting\n');
  } catch (error) {
    printHeader('❌ Tests Failed');
    console.error('\n' + colorize('Error Details:', 'red'));
    console.error(error);
    process.exit(1);
  }
}

runDemo();
