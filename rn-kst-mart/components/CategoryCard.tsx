import { Image } from 'expo-image';
import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import CategoryBadge from './CategoryBadge';
import { ThemedText } from './ThemedText';

type Props = {
  name: string;
  thumbnail?: string;
  productsCount: number;
  totalStock?: number;
  onPress?: () => void;
  variant?: 'row' | 'grid';
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CategoryCard: React.FC<Props> = ({
  name,
  thumbnail,
  productsCount,
  totalStock,
  onPress,
  variant = 'row',
}: Props) => {
  // for grid we compute a column width so cards align in two columns
  // grid layout uses percentage-based width to avoid overflow

  if (variant === 'grid') {
    const imageSize = Math.round(SCREEN_WIDTH * 0.42); // use percentage-ish width for grid image
    return (
      <TouchableOpacity
        style={styles.cardGrid}
        activeOpacity={0.8}
        onPress={onPress}
      >
        <View style={{ width: imageSize, height: imageSize }}>
          <Image
            source={
              thumbnail
                ? { uri: thumbnail }
                : (require('@/assets/images/icon.png') as any)
            }
            style={[styles.thumbGrid, { width: imageSize, height: imageSize }]}
            contentFit="cover"
          />
          <View style={styles.badgeContainerGrid}>
            <CategoryBadge
              count={productsCount}
              imageSize={Math.round(imageSize * 0.28)}
            />
          </View>
        </View>
        <ThemedText style={[styles.title, { marginTop: 8 }]} numberOfLines={2}>
          {name}
        </ThemedText>
        {typeof totalStock === 'number' && (
          <ThemedText
            type="subtitle"
            style={styles.gridStock}
            numberOfLines={1}
          >
            Stock: <ThemedText style={styles.bold}>{totalStock}</ThemedText>
          </ThemedText>
        )}
      </TouchableOpacity>
    );
  }

  const imageSize = Math.min(80, Math.max(48, Math.round(SCREEN_WIDTH * 0.14)));
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.75}
      onPress={onPress}
    >
      <View style={{ width: imageSize, height: imageSize }}>
        <Image
          source={
            thumbnail
              ? { uri: thumbnail }
              : (require('@/assets/images/icon.png') as any)
          }
          style={[styles.thumb, { width: imageSize, height: imageSize }]}
          contentFit="cover"
        />
        <View style={styles.badgeContainer}>
          <CategoryBadge count={productsCount} imageSize={imageSize} />
        </View>
      </View>

      <View style={styles.cardBody}>
        <ThemedText style={styles.title} numberOfLines={1}>
          {name}
        </ThemedText>
        {typeof totalStock === 'number' && (
          <ThemedText style={styles.subtitle}>
            Stock: <ThemedText style={styles.bold}>{totalStock}</ThemedText>
          </ThemedText>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(CategoryCard);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
  },
  cardGrid: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 8,
    borderRadius: 10,
  },
  cardBody: { flex: 1, gap: 4 },
  thumb: { borderRadius: 8 },
  thumbGrid: { borderRadius: 8 },
  badgeContainer: { position: 'absolute', top: 4, right: 4 },
  badgeContainerGrid: { position: 'absolute', top: 8, right: 8 },
  title: { fontSize: 16 },
  gridStock: { color: '#666', marginTop: 4 },
  subtitle: { color: '#666' },
  bold: { fontWeight: '600' },
});
