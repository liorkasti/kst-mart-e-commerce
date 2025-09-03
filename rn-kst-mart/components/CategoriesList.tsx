import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CategoryItem from './CategoryItem';

type Product = {
  id: number;
  title: string;
  category: string;
  thumbnail?: string;
  images?: string[];
};
type CategorySummary = { name: string; thumbnail?: string; count: number };

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CategoriesList: React.FC = () => {
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async function fetchProducts() {
      try {
        const res = await fetch('https://dummyjson.com/products?limit=200');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const products: Product[] = data.products ?? [];
        const byCat = new Map<string, { thumb?: string; count: number }>();
        for (const p of products) {
          const existing = byCat.get(p.category);
          if (!existing) {
            byCat.set(p.category, {
              thumb: p.thumbnail || p.images?.[0],
              count: 1,
            });
          } else {
            existing.count += 1;
          }
        }
        if (mounted) {
          const arr: CategorySummary[] = Array.from(byCat.entries()).map(
            ([name, v]) => ({
              name,
              thumbnail: v.thumb,
              count: v.count,
            })
          );
          setCategories(arr);
        }
      } catch (e: any) {
        if (mounted) setError(e.message ?? 'Failed to fetch');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const imageSize = Math.min(80, Math.max(48, Math.round(SCREEN_WIDTH * 0.14)));

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.hint}>Loading categories…</Text>
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Categories ({categories.length})</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <CategoryItem item={item} imageSize={imageSize} />
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
      />
    </View>
  );
};

export default CategoriesList;

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  sep: { height: 1, backgroundColor: '#e0e0e0', marginVertical: 6 },
  hint: { marginTop: 8, color: '#666' },
  error: { color: 'red' },
});
