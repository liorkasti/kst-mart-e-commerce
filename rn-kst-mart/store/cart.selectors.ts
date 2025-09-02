import { createSelector } from 'reselect';
import { cartSelectors } from './cart.slice';

export const selectCartTotals = createSelector(
  cartSelectors.selectAll,
  (items: Array<{ qty: number; price: number }>) => {
    const count = items.reduce((n: number, i: { qty: number }) => n + i.qty, 0);
    const sum = items.reduce(
      (n: number, i: { qty: number; price: number }) => n + i.qty * i.price,
      0
    );
    return { count, sum };
  }
);
