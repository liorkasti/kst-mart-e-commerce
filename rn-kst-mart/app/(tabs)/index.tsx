import { Image } from 'expo-image';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Modal,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import CategoryCard from '@/components/CategoryCard';
import HeaderBanner from '@/components/HeaderBanner';
import HeaderHero from '@/components/HeaderHero';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const HORIZONTAL_PADDING = 16;
  const scrollY = useRef(new Animated.Value(0)).current;
  const AnimatedFlatList = Animated.createAnimatedComponent(
    FlatList
  ) as unknown as typeof FlatList;
  type Product = {
    id: number;
    title: string;
    price: number;
    stock: number;
    category: string;
    thumbnail?: string;
    images?: string[];
  };

  type CategorySummary = {
    name: string;
    thumbnail: string | undefined;
    productsCount: number;
    totalStock: number;
  };

  const [products, setProducts] = useState<Product[] | null>(null);
  const [productsByCategory, setProductsByCategory] = useState<
    Record<string, Product[]>
  >({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async function load() {
      try {
        setError(null);
        setLoading(true);
        const res = await fetch('https://dummyjson.com/products?limit=100');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { products: Product[] };
        if (mounted) {
          const list = data.products ?? [];
          setProducts(list);
          // precompute by category for fast access
          const map: Record<string, Product[]> = {};
          for (const p of list) {
            if (!map[p.category]) map[p.category] = [];
            map[p.category].push(p);
            // attempt to prefetch thumbnails (expo-image exposes prefetch via static prefetch)
            try {
              // @ts-ignore
              Image.prefetch?.(p.thumbnail);
            } catch {}
          }
          setProductsByCategory(map);
        }
      } catch (e: any) {
        if (mounted) setError(e?.message ?? 'Unknown error');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const categories: CategorySummary[] = useMemo(() => {
    if (!products) return [];
    const byCategory = new Map<
      string,
      { firstThumb?: string; count: number; stock: number }
    >();
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
  }, [products]);

  const GROUPS = ['All', 'Electronics', 'Home', 'Clothing', 'Food', 'Other'];
  const categorizeName = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('elect')) return 'Electronics';
    if (c.includes('phone') || c.includes('laptop') || c.includes('computer'))
      return 'Electronics';
    if (c.includes('home') || c.includes('kitchen') || c.includes('furn'))
      return 'Home';
    if (c.includes('clothing') || c.includes('shirt') || c.includes('jeans'))
      return 'Clothing';
    if (c.includes('food') || c.includes('snack') || c.includes('drink'))
      return 'Food';
    return 'Other';
  };

  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const visibleCategories = useMemo(() => {
    if (selectedGroup === 'All') return categories;
    return categories.filter((c) => categorizeName(c.name) === selectedGroup);
  }, [categories, selectedGroup]);

  // memoized product row for FlatList in modal
  const ProductRow = React.useMemo(() => {
    const Row: React.FC<{ item: Product }> = ({ item }) => (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 12,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: 'rgba(0,0,0,0.06)',
        }}
      >
        <Image
          source={
            item.thumbnail
              ? { uri: item.thumbnail }
              : require('@/assets/images/icon.png')
          }
          style={{ width: 64, height: 64, borderRadius: 8, marginRight: 12 }}
          contentFit="cover"
        />
        <View style={{ flex: 1 }}>
          <ThemedText style={{ fontSize: 16 }}>{item.title}</ThemedText>
          <ThemedText type="subtitle">
            ${item.price} • Stock: {item.stock}
          </ThemedText>
        </View>
      </View>
    );

    return React.memo(Row);
  }, []);

  const renderHeader = (
    <ThemedView style={styles.titleContainer}>
      <ThemedText type="title">Product Categories</ThemedText>
    </ThemedView>
  );

  const renderEmpty = (
    <View style={styles.center}>
      {loading ? (
        <ActivityIndicator />
      ) : error ? (
        <ThemedText type="defaultSemiBold">Error: {error}</ThemedText>
      ) : (
        <ThemedText>No data</ThemedText>
      )}
    </View>
  );

  const fetchProducts = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch('https://dummyjson.com/products?limit=100');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { products: Product[] };
      setProducts(data.products ?? []);
    } catch (e: any) {
      setError(e?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
  const HeaderComponent = () => {
    const HEADER_HEIGHT = 180;
    const scale = scrollY.interpolate({
      inputRange: [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
      outputRange: [2, 1, 0.95],
      extrapolate: 'clamp',
    });
    const translateY = scrollY.interpolate({
      inputRange: [0, HEADER_HEIGHT],
      outputRange: [0, -HEADER_HEIGHT * 0.25],
      extrapolate: 'clamp',
    });

    const animatedStyle = {
      transform: [{ translateY }, { scale }],
    };

    return (
      <>
        <HeaderBanner
          animatedStyle={animatedStyle}
          horizontalPadding={HORIZONTAL_PADDING}
          height={HEADER_HEIGHT}
        />
        {renderHeader}
        <View style={{ paddingHorizontal: HORIZONTAL_PADDING, paddingTop: 8 }}>
          <FlatList
            data={GROUPS}
            horizontal
            keyExtractor={(g) => g}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
            renderItem={({ item: g }) => (
              <TouchableOpacity
                onPress={() => setSelectedGroup(g)}
                style={[
                  styles.groupButton,
                  selectedGroup === g && styles.groupButtonActive,
                ]}
              >
                <ThemedText
                  type={selectedGroup === g ? 'defaultSemiBold' : undefined}
                >
                  {g}
                </ThemedText>
              </TouchableOpacity>
            )}
          />
        </View>
      </>
    );
  };

  return (
    <>
      <AnimatedFlatList<CategorySummary>
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        data={visibleCategories}
        keyExtractor={(item: CategorySummary) => item.name}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={styles.gridListPadding}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchProducts} />
        }
        renderItem={({ item }: { item: CategorySummary }) => (
          <CategoryCard
            name={item.name}
            thumbnail={item.thumbnail}
            productsCount={item.productsCount}
            totalStock={item.totalStock}
            onPress={() => setSelectedCategory(item.name)}
            variant="grid"
          />
        )}
        ListHeaderComponent={HeaderComponent}
      />

      {/* Modal showing products in the selected category */}
      {selectedCategory && (
        <Modal
          visible={true}
          animationType="slide"
          onRequestClose={() => setSelectedCategory(null)}
        >
          <ThemedView style={{ flex: 1 }}>
            <HeaderHero
              title={selectedCategory ?? ''}
              horizontalPadding={HORIZONTAL_PADDING}
              height={140}
            >
              <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
                <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                  <ThemedText type="defaultSemiBold">Close</ThemedText>
                </TouchableOpacity>
              </View>
            </HeaderHero>

            <FlatList
              data={productsByCategory[selectedCategory ?? ''] ?? []}
              keyExtractor={(p) => String(p.id)}
              initialNumToRender={8}
              removeClippedSubviews
              windowSize={7}
              getItemLayout={(_, index) => ({
                length: 88,
                offset: 88 * index,
                index,
              })}
              renderItem={({ item: p }) => <ProductRow item={p} />}
            />
          </ThemedView>
        </Modal>
      )}
    </>
  );
}

const headerPaddingTop =
  Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 44;

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: headerPaddingTop + 8,
    paddingBottom: 8,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  catEnvImageContainer: {
    width: '100%',
    height: 180,
    marginTop: -headerPaddingTop,
    marginBottom: 12,
  },
  gridListPadding: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 },
  groupButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  groupButtonActive: { backgroundColor: 'rgba(0,0,0,0.08)' },
});
