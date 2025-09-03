import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  FlatList,
  Modal,
  Pressable,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useParallaxHeader } from '@/hooks/useParallaxHeader';

import CategoryCard from '@/components/CategoryCard';
import HeaderBanner from '@/components/HeaderBanner';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SkeletonCategoryGrid } from '@/components/skeleton/Skeleton';
// Local Product type used by this screen
type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  stock?: number;
  thumbnail?: string;
  images?: string[];
};

export default function HomeScreen() {
  const HORIZONTAL_PADDING = 16;
  const { animatedStyle, onScroll } = useParallaxHeader({ headerHeight: 240 });
  const AnimatedFlatList = Animated.createAnimatedComponent(
    FlatList
  ) as unknown as typeof FlatList;

  type CategorySummary = {
    name: string;
    thumbnail: string | undefined;
    productsCount: number;
    totalStock: number;
  };

  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<{ products: Product[] }, Error>({
    queryKey: ['products-local'],

    queryFn: async () => {
      const payload = require('../../../shared/products.json') as {
        products: Product[];
      };
      // remote api:
      // const res = await fetch('https://dummyjson.com/products?limit=200', { signal });
      // if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // const json = (await res.json()) as { products: Product[] };
      // return json;
      return payload;
    },
  });

  const products = data?.products ?? null;
  const productsByCategory = useMemo(() => {
    const map: Record<string, Product[]> = {};
    if (!products) return map;
    for (const p of products) {
      if (!map[p.category]) map[p.category] = [];
      map[p.category].push(p);
      try {
        if (p.thumbnail && typeof (Image as any).prefetch === 'function') {
          (Image as any).prefetch(p.thumbnail);
        }
      } catch {}
    }
    return map;
  }, [products]);

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

  const renderEmpty = loading ? (
    <SkeletonCategoryGrid />
  ) : (
    <View style={styles.center}>
      {error ? (
        <ThemedText type="defaultSemiBold">Error: {error.message}</ThemedText>
      ) : (
        <ThemedText>No data</ThemedText>
      )}
    </View>
  );

  const fetchProducts = refetch;
  
  const CategoryModal: React.FC = () => {
    const colorScheme = useColorScheme() ?? 'light';
    const progress = useRef(new Animated.Value(0)).current;
    const close = () => {
      Animated.timing(progress, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start(() => setSelectedCategory(null));
    };
    useEffect(() => {
      Animated.timing(progress, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, [progress]);

    const overlayOpacity = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.8],
      extrapolate: 'clamp',
    });
    const translateY = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [40, 0],
      extrapolate: 'clamp',
    });
    const scale = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0.98, 1],
      extrapolate: 'clamp',
    });
    const opacity = progress;

    const HEADER_HEIGHT = 140;
    const { animatedStyle: modalHeaderStyle, onScroll: onModalScroll } =
      useParallaxHeader({ headerHeight: HEADER_HEIGHT });
    const AnimatedFlatListInner = Animated.createAnimatedComponent(
      FlatList
    ) as unknown as typeof FlatList;

    const items = productsByCategory[selectedCategory ?? ''] ?? [];
    const [stickyHeight, setStickyHeight] = useState(48);
    const listData = useMemo<(string | Product)[]>(
      () => ['__sticky__', ...items],
      [items]
    );

    return (
      <Modal
        transparent
        visible
        onRequestClose={close}
        animationType="none"
        presentationStyle="overFullScreen"
        statusBarTranslucent
      >
        <View style={styles.modalRoot}>
          <Animated.View
            style={[styles.backdrop, { opacity: overlayOpacity }]}
          />
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={close}
            android_ripple={{ color: 'rgba(255,255,255,0.05)' }}
          />
          <Animated.View
            style={[
              styles.modalCard,
              { transform: [{ translateY }, { scale }], opacity },
            ]}
          >
            <View style={styles.modalInner}>
              <ThemedView style={{ flex: 1 }}>
              <AnimatedFlatListInner
                data={listData}
                keyExtractor={(it, idx) => (idx === 0 ? 'sticky' : String((it as Product).id))}
                onScroll={onModalScroll}
                scrollEventThrottle={16}
                initialNumToRender={10}
                removeClippedSubviews
                windowSize={9}
                getItemLayout={(_, index) => {
                  if (index === 0) return { length: stickyHeight, offset: 0, index };
                  const length = 88;
                  const offset = stickyHeight + length * (index - 1);
                  return { length, offset, index };
                }}
                ListHeaderComponent={
                  <HeaderBanner
                    animatedStyle={modalHeaderStyle}
                    horizontalPadding={HORIZONTAL_PADDING}
                    height={HEADER_HEIGHT}
                  />
                }
                stickyHeaderIndices={[1]}
                renderItem={({ item, index }) =>
                  index === 0 ? (
                    <ThemedView
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                        backgroundColor: colorScheme === 'dark' ? '#0a0a0a' : '#fff',
                        zIndex: 10,
                        elevation: 3,
                        shadowColor: '#000',
                        shadowOpacity: 0.08,
                        shadowRadius: 6,
                        shadowOffset: { width: 0, height: 2 },
                      }}
                      onLayout={(e) => setStickyHeight(Math.round(e.nativeEvent.layout.height))}
                    >
                      <ThemedText type="title">{selectedCategory ?? ''}</ThemedText>
                      <TouchableOpacity
                        accessibilityLabel="Close"
                        onPress={close}
                        style={{
                          padding: 8,
                          borderRadius: 20,
                          backgroundColor:
                            colorScheme === 'dark'
                              ? 'rgba(255,255,255,0.08)'
                              : 'rgba(0,0,0,0.06)',
                        }}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Ionicons
                          name="close"
                          size={22}
                          color={colorScheme === 'dark' ? '#fff' : '#111'}
                        />
                      </TouchableOpacity>
                    </ThemedView>
                  ) : (
                    <ProductRow item={item as Product} />
                  )
                }
              />
              </ThemedView>
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  };
  const HeaderComponent = () => {
    const HEADER_HEIGHT = 240;
    return (
      <>
        <HeaderBanner
          animatedStyle={animatedStyle}
          horizontalPadding={HORIZONTAL_PADDING}
          height={HEADER_HEIGHT}
        />
        {renderHeader}
        <View style={{ paddingHorizontal: HORIZONTAL_PADDING, paddingTop: 8 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {GROUPS.map((g) => (
              <TouchableOpacity
                key={g}
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
            ))}
          </ScrollView>
        </View>
      </>
    );
  };

  return (
    <>
      <AnimatedFlatList<CategorySummary>
        onScroll={onScroll}
        scrollEventThrottle={16}
        data={visibleCategories}
        keyExtractor={(item: CategorySummary) => item.name}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={styles.gridListPadding}
        initialNumToRender={12}
        windowSize={7}
        removeClippedSubviews
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
      {selectedCategory && <CategoryModal />}
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
  gridListPadding: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 },
  groupButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  groupButtonActive: { backgroundColor: 'rgba(0,0,0,0.08)' },
  modalRoot: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  modalCard: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  modalInner: {
    flex: 1,
    marginHorizontal: 12,
    marginTop: 60,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    // subtle shadow for card separation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
});
