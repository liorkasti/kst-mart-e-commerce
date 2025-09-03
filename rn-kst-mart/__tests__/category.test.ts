import { buildProductsByCategory, buildCategorySummaries, categorizeName, Product } from '@/utils/category';

describe('category utils', () => {
  const products: Product[] = [
    { id: 1, title: 'Phone X', price: 999, category: 'smartphones', stock: 5, thumbnail: 't1' },
    { id: 2, title: 'Laptop Z', price: 1999, category: 'laptops', stock: 3, images: ['i2'] },
    { id: 3, title: 'Shirt', price: 19, category: 'mens-shirts', stock: 20 },
    { id: 4, title: 'Cola', price: 2, category: 'drinks', stock: 100 },
    { id: 5, title: 'Phone Y', price: 799, category: 'smartphones', stock: 2 },
  ];

  it('buildProductsByCategory groups by category', () => {
    const map = buildProductsByCategory(products);
    expect(Object.keys(map).sort()).toEqual(['drinks', 'laptops', 'mens-shirts', 'smartphones']);
    expect(map['smartphones']).toHaveLength(2);
    expect(map['laptops'][0].title).toBe('Laptop Z');
  });

  it('buildCategorySummaries aggregates counts and stock and picks first thumbnail/images[0]', () => {
    const summaries = buildCategorySummaries(products);
    const smartphones = summaries.find((s) => s.name === 'smartphones');
    const laptops = summaries.find((s) => s.name === 'laptops');
    expect(smartphones).toEqual(
      expect.objectContaining({ productsCount: 2, totalStock: 7 })
    );
    expect(laptops).toEqual(
      expect.objectContaining({ productsCount: 1, totalStock: 3 })
    );
    // thumbnail comes from thumbnail first, then images[0]
    expect(smartphones?.thumbnail).toBe('t1');
    expect(laptops?.thumbnail).toBe('i2');
  });

  it('categorizeName maps common categories to groups', () => {
    expect(categorizeName('smartphones')).toBe('Electronics');
    expect(categorizeName('phone-accessories')).toBe('Electronics');
    expect(categorizeName('home-decor')).toBe('Home');
    expect(categorizeName('kitchenware')).toBe('Home');
    expect(categorizeName('mens-shirts')).toBe('Clothing');
    expect(categorizeName('drinks')).toBe('Food');
    expect(categorizeName('random')).toBe('Other');
  });
});
