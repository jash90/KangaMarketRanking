/**
 * SortButton Component Tests
 */

import { SortButton } from '@/components';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

describe('SortButton', () => {
  it('should render inactive button', () => {
    render(
      <SortButton
        field="market"
        label="Market"
        isActive={false}
        priority={null}
        sortOrder={null}
        onPress={jest.fn()}
      />
    );

    expect(screen.getByText('Market')).toBeOnTheScreen();
  });

  it('should render active button with priority badge', () => {
    render(
      <SortButton
        field="market"
        label="Market"
        isActive={true}
        priority={1}
        sortOrder="desc"
        onPress={jest.fn()}
      />
    );

    expect(screen.getByText('1')).toBeOnTheScreen(); // Priority badge
    expect(screen.getByText('Market')).toBeOnTheScreen();
  });

  it('should show correct arrow icon based on sort order', () => {
    // Test descending arrow
    const { UNSAFE_getByType: getByTypeDesc } = render(
      <SortButton
        field="market"
        label="Market"
        isActive={true}
        priority={1}
        sortOrder="desc"
        onPress={jest.fn()}
      />
    );
    expect(getByTypeDesc(require('@expo/vector-icons/MaterialIcons').default)).toBeTruthy();

    // Test ascending arrow
    const { UNSAFE_getByType: getByTypeAsc } = render(
      <SortButton
        field="market"
        label="Market"
        isActive={true}
        priority={1}
        sortOrder="asc"
        onPress={jest.fn()}
      />
    );
    expect(getByTypeAsc(require('@expo/vector-icons/MaterialIcons').default)).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    render(
      <SortButton
        field="market"
        label="Market"
        isActive={false}
        priority={null}
        sortOrder={null}
        onPress={onPress}
      />
    );

    const button = screen.getByText('Market');
    fireEvent.press(button);

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should have proper accessibility label', () => {
    render(
      <SortButton
        field="market"
        label="Market"
        isActive={true}
        priority={1}
        sortOrder="desc"
        onPress={jest.fn()}
      />
    );

    expect(screen.getByLabelText(/Sort by market/)).toBeOnTheScreen();
  });

  it('should show secondary styling for priority 2', () => {
    render(
      <SortButton
        field="spread"
        label="Spread"
        isActive={true}
        priority={2}
        sortOrder="desc"
        onPress={jest.fn()}
      />
    );

    expect(screen.getByText('2')).toBeOnTheScreen();
  });
});
