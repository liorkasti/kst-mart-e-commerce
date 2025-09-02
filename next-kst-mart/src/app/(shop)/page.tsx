'use client';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { upsert, selectCartTotals } from '@maccabi/cart';
import type { RootState } from '@/store';

export default function ShopPage() {
  const dispatch = useDispatch();
  const totals = useSelector((s: RootState) => selectCartTotals(s));

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Shop – Cart demo</h1>
      <div>Items: {totals.count} • Total: ${'{'}totals.sum.toFixed(2){'}'}</div>
      <button
        className="px-3 py-2 rounded bg-black text-white dark:bg-white dark:text-black"
        onClick={() =>
          dispatch(
            upsert({ id: 1, title: 'Sample Product', price: 19.99, qty: 1 })
          )
        }
      >
        Add Sample Product
      </button>
    </div>
  );
}
