import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import { SkeletonList } from '@/components/skeleton/Skeleton';
import CategoryItem from './CategoryItem';
import { productsRepository } from '../../packages/core/src';

type CategorySummary = { name: string; thumbnail?: string; count: number };

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CategoriesList: React.FC = () => {
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    let mounted = true;
    (async () => {
      try {
        const list = await productsRepository.getCategories(ac.signal);
        if (mounted) setCategories(list);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || 'Failed to load categories');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
      ac.abort();
    };
  }, []);

  const imageSize = Math.min(80, Math.max(48, Math.round(SCREEN_WIDTH * 0.14)));

  if (loading)
    return (
      <View style={{ flex: 1 }}>
        <SkeletonList rows={8} />
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
