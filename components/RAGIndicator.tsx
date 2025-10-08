/**
 * RAG Indicator Component
 *
 * Displays a visual indicator for RAG (Red-Amber-Green) liquidity status.
 * Shows colored dot with optional label and description.
 */

import React, { memo } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { RAGStatus } from '@/types';
import { getRAGColor, getRAGDescription, getRAGEmoji } from '../utils/ragClassifier';

export interface RAGIndicatorProps {
  status: RAGStatus;
  showLabel?: boolean;
  showEmoji?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

/**
 * Visual indicator for market liquidity status
 *
 * @example
 * <RAGIndicator status="green" size="medium" showLabel />
 */
export const RAGIndicator = memo<RAGIndicatorProps>(
  ({ status, showLabel = false, showEmoji = false, size = 'medium', style }) => {
    const color = getRAGColor(status);
    const emoji = getRAGEmoji(status);
    const description = getRAGDescription(status);

    // Size configurations
    const sizeConfig = {
      small: { dot: 8, fontSize: 10, spacing: 6 },
      medium: { dot: 12, fontSize: 12, spacing: 8 },
      large: { dot: 16, fontSize: 14, spacing: 10 },
    };

    const config = sizeConfig[size];

    return (
      <View
        style={[styles.container, style]}
        accessible={true}
        accessibilityLabel={`Liquidity status: ${description}`}
        accessibilityRole="text"
      >
        {showEmoji ? (
          <Text style={[styles.emoji, { fontSize: config.dot * 1.5 }]}>{emoji}</Text>
        ) : (
          <View
            style={[
              styles.dot,
              {
                width: config.dot,
                height: config.dot,
                backgroundColor: color,
                borderRadius: config.dot / 2,
              },
            ]}
          />
        )}

        {showLabel && (
          <Text
            style={[
              styles.label,
              {
                color,
                fontSize: config.fontSize,
                marginLeft: config.spacing,
              },
            ]}
          >
            {description}
          </Text>
        )}
      </View>
    );
  }
);

RAGIndicator.displayName = 'RAGIndicator';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    // Dynamic styles applied inline
  },
  emoji: {
    // Dynamic styles applied inline
  },
  label: {
    fontWeight: '600',
  },
});
