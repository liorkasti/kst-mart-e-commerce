export type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  stock?: number;
  thumbnail?: string;
  images?: string[];
};

export type CategorySummary = {
  name: string;
  thumbnail: string | undefined;
  productsCount: number;
  totalStock: number;
};

export function buildProductsByCategory(products: Product[]): Record<string, Product[]> {
  const map: Record<string, Product[]> = {};
  for (const p of products) {
    if (!map[p.category]) map[p.category] = [];
    map[p.category].push(p);
  }
  return map;
}

export function buildCategorySummaries(products: Product[]): CategorySummary[] {
  const byCategory = new Map<string, { firstThumb?: string; count: number; stock: number }>();
  for (const p of products) {
    const existing = byCategory.get(p.category);
    if (!existing) {
      byCategory.set(p.category, {
        firstThumb: p.thumbnail || p.images?.[0],
        count: 1,
        stock: p.stock ?? 0,
      });
    } else {
      existing.count += 1;
      existing.stock += p.stock ?? 0;
    }
  }
  return Array.from(byCategory.entries()).map(([name, v]) => ({
    name,
    thumbnail: v.firstThumb,
    productsCount: v.count,
    totalStock: v.stock,
  }));
}

export function categorizeName(cat: string): 'Electronics' | 'Home' | 'Clothing' | 'Food' | 'Other' {
  const c = cat.toLowerCase();
  if (c.includes('elect')) return 'Electronics';
  if (c.includes('phone') || c.includes('laptop') || c.includes('computer')) return 'Electronics';
  if (c.includes('home') || c.includes('kitchen') || c.includes('furn')) return 'Home';
  if (c.includes('clothing') || c.includes('shirt') || c.includes('jeans')) return 'Clothing';
  if (c.includes('food') || c.includes('snack') || c.includes('drink')) return 'Food';
  return 'Other';
}
