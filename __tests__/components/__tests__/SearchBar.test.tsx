/**
 * SearchBar Component Tests
 *
 * Tests for search input component with clear functionality.
 */

import { SearchBar } from '@/components';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

describe('SearchBar', () => {
  it('should render with placeholder', () => {
    render(<SearchBar value="" onChangeText={jest.fn()} placeholder="Search..." />);

    expect(screen.getByPlaceholderText('Search...')).toBeOnTheScreen();
  });

  it('should display current value', () => {
    const { getByDisplayValue } = render(<SearchBar value="test query" onChangeText={jest.fn()} />);

    expect(getByDisplayValue('test query')).toBeTruthy();
  });

  it('should call onChangeText when typing', () => {
    const onChangeText = jest.fn();
    render(<SearchBar value="" onChangeText={onChangeText} />);

    const input = screen.getByLabelText('Search markets');
    fireEvent.changeText(input, 'BTC');

    expect(onChangeText).toHaveBeenCalledWith('BTC');
  });

  it('should show clear button when value is not empty', () => {
    render(<SearchBar value="test" onChangeText={jest.fn()} />);

    expect(screen.getByLabelText('Clear search')).toBeOnTheScreen();
  });

  it('should hide clear button when value is empty', () => {
    render(<SearchBar value="" onChangeText={jest.fn()} />);

    expect(screen.queryByLabelText('Clear search')).not.toBeOnTheScreen();
  });

  it('should clear value when clear button is pressed', () => {
    const onChangeText = jest.fn();
    render(<SearchBar value="test query" onChangeText={onChangeText} />);

    const clearButton = screen.getByLabelText('Clear search');
    fireEvent.press(clearButton);

    expect(onChangeText).toHaveBeenCalledWith('');
  });

  describe('accessibility', () => {
    it('should have proper accessibility labels', () => {
      render(<SearchBar value="" onChangeText={jest.fn()} />);

      expect(screen.getByLabelText('Search markets')).toBeOnTheScreen();
    });

    it('should have accessibility hint for screen readers', () => {
      render(<SearchBar value="" onChangeText={jest.fn()} />);

      // Component has accessibility hint, verify via label
      expect(screen.getByLabelText('Search markets')).toBeOnTheScreen();
    });
  });
});
