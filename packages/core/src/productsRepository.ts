import type { Product, ProductsResponse } from './types';

class NetworkError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'NetworkError';
    this.status = status;
  }
}

// Simple in-memory cache with TTL; optionally persists on web via localStorage
class TTLCache<T> {
  private data: { value: T; expiresAt: number } | null = null;
  constructor(private ttlMs: number, private key?: string) {}

  get(): T | null {
    const now = Date.now();
    if (this.data && this.data.expiresAt > now) return this.data.value;
    // try hydrate from localStorage (web only)
    if (this.key && typeof window !== 'undefined' && window.localStorage) {
      try {
        const raw = window.localStorage.getItem(this.key);
        if (raw) {
          const obj = JSON.parse(raw);
          if (obj && obj.expiresAt > now) {
            this.data = obj;
            return obj.value as T;
          }
        }
      } catch {}
    }
    return null;
  }

  set(value: T) {
    const expiresAt = Date.now() + this.ttlMs;
    this.data = { value, expiresAt };
    if (this.key && typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(this.key, JSON.stringify(this.data));
      } catch {}
    }
  }

  clear() {
    this.data = null;
    if (this.key && typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem(this.key);
      } catch {}
    }
  }
}

class ProductsRepository {
  private static _instance: ProductsRepository | null = null;
  static get instance() {
    if (!this._instance) this._instance = new ProductsRepository();
    return this._instance;
  }

  private cache = new TTLCache<Product[]>(5 * 60 * 1000, 'products_cache'); // 5 minutes

  async fetchAll(signal?: AbortSignal): Promise<Product[]> {
    const cached = this.cache.get();
    if (cached) return cached;

    const url = 'https://dummyjson.com/products?limit=200';

    let res: Response;
    try {
      res = await fetch(url, { signal });
    } catch (e: any) {
      if (e?.name === 'AbortError') throw e;
      throw new NetworkError('Network request failed', undefined);
    }

    if (!res.ok) {
      throw new NetworkError(`Request failed with status ${res.status}`, res.status);
    }

    let json: ProductsResponse;
    try {
      json = (await res.json()) as ProductsResponse;
    } catch {
      throw new NetworkError('Invalid JSON response', res.status);
    }

    const products = Array.isArray(json.products) ? json.products : [];
    this.cache.set(products);
    return products;
  }

  async getCategories(signal?: AbortSignal): Promise<{
    name: string;
    thumbnail?: string;
    count: number;
  }[]> {
    const products = await this.fetchAll(signal);
    const byCat = new Map<string, { thumb?: string; count: number }>();
    for (const p of products) {
      const cur = byCat.get(p.category);
      if (!cur) byCat.set(p.category, { thumb: p.thumbnail || p.images?.[0], count: 1 });
      else cur.count += 1;
    }
    return Array.from(byCat.entries()).map(([name, v]) => ({ name, thumbnail: v.thumb, count: v.count }));
  }

  // Allows manual refresh
  invalidate() {
    this.cache.clear();
  }
}

export const productsRepository = ProductsRepository.instance;
export { NetworkError };
