/**
 * DetailHeader Component Tests
 */

import { DetailHeader } from '@/components';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

describe('DetailHeader', () => {
  it('should render title', () => {
    render(<DetailHeader title="BTC/USDT" onBack={jest.fn()} />);

    expect(screen.getByText('BTC/USDT')).toBeOnTheScreen();
  });

  it('should render subtitle when provided', () => {
    render(<DetailHeader title="BTC/USDT" subtitle="Order Book Analysis" onBack={jest.fn()} />);

    expect(screen.getByText('Order Book Analysis')).toBeOnTheScreen();
  });

  it('should hide subtitle when not provided', () => {
    render(<DetailHeader title="BTC/USDT" onBack={jest.fn()} />);

    expect(screen.queryByText('Order Book Analysis')).not.toBeOnTheScreen();
  });

  it('should render back button', () => {
    render(<DetailHeader title="Test" onBack={jest.fn()} />);

    expect(screen.getByLabelText('Go back')).toBeOnTheScreen();
  });

  it('should call onBack when back button pressed', () => {
    const onBack = jest.fn();
    render(<DetailHeader title="Test" onBack={onBack} />);

    const backButton = screen.getByLabelText('Go back');
    fireEvent.press(backButton);

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
