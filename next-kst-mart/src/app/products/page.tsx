import { promises as fs } from 'fs';
import path from 'path';

// Server Component: reads shared/products.json at request time (SSR)
export default async function ProductsPage() {
  const file = path.resolve(process.cwd(), '..', 'shared', 'products.json');
  const raw = await fs.readFile(file, 'utf8');
  const data = JSON.parse(raw) as { products: Array<{ id: number; title: string; price: number; stock?: number; category: string; thumbnail?: string }> };
  const products = data.products ?? [];

  // Aggregate categories
  const byCategory = new Map<string, { count: number; stock: number; firstThumb?: string }>();
  for (const p of products) {
    const cur = byCategory.get(p.category) ?? { count: 0, stock: 0, firstThumb: undefined };
    cur.count += 1;
    cur.stock += p.stock ?? 0;
    if (!cur.firstThumb) cur.firstThumb = p.thumbnail;
    byCategory.set(p.category, cur);
  }
  const categories = Array.from(byCategory.entries()).map(([name, v]) => ({ name, ...v }));

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Categories (from shared/products.json)</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <div key={c.name} className="border rounded-lg p-4 bg-white/50 dark:bg-black/20">
            <div className="text-lg font-medium">{c.name}</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-300">{c.count} items • {c.stock} in stock</div>
          </div>
        ))}
      </div>
    </div>
  );
}
