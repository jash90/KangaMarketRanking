/**
 * Search Bar Component
 *
 * Search input with clear button and icon.
 */

import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
}

/**
 * Search input component
 *
 * @example
 * const [query, setQuery] = useState('');
 * <SearchBar value={query} onChangeText={setQuery} />
 */
const SearchBarComponent: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search markets...',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Search Icon */}
      <MaterialIcons name="search" size={20} color="#6B7280" style={styles.searchIcon} />

      {/* Input */}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="never" // We'll use custom clear button
        returnKeyType="search"
        accessibilityLabel="Search markets"
        accessibilityHint="Type to filter market list"
      />

      {/* Clear Button */}
      {value.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => onChangeText('')}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="close" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      )}
    </View>
  );
};

/**
 * Memoized SearchBar to prevent unnecessary re-renders
 * Only re-renders when value or callbacks change
 */
export const SearchBar = React.memo(SearchBarComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    padding: 0, // Remove default padding
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
});
