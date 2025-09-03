import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import CategoryCard from '@/components/CategoryCard';

describe('CategoryCard', () => {
  it('renders name and productsCount badge in grid variant', () => {
    render(
      <CategoryCard
        name="Smartphones"
        productsCount={7}
        totalStock={25}
        thumbnail="https://example.com/t.png"
        variant="grid"
      />
    );
    expect(screen.getByText('Smartphones')).toBeTruthy();
    // Stock label shown in grid when provided
    expect(screen.getByText(/Stock:/i)).toBeTruthy();
  });

  it('renders name and optional stock in row variant', () => {
    const { rerender } = render(
      <CategoryCard name="Laptops" productsCount={3} variant="row" />
    );
    expect(screen.getByText('Laptops')).toBeTruthy();
    // stock not shown when not provided
    expect(screen.queryByText(/Stock:/i)).toBeNull();

    rerender(
      <CategoryCard name="Laptops" productsCount={3} variant="row" totalStock={9} />
    );
    expect(screen.getByText(/Stock:/i)).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(
      <CategoryCard name="Drinks" productsCount={10} variant="row" onPress={onPress} />
    );
    const touchable = screen.getByText('Drinks');
    fireEvent.press(touchable);
    expect(onPress).toHaveBeenCalled();
  });
});
