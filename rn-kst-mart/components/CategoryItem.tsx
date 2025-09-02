import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import CategoryBadge from './CategoryBadge';
import { ThemedText } from './ThemedText';

type CategorySummary = {
  name: string;
  thumbnail?: string;
  count: number;
};

type Props = {
  item: CategorySummary;
  onPress?: () => void;
  imageSize: number;
};

const CategoryItem: React.FC<Props> = ({ item, onPress, imageSize }) => {
  const imageSource = item.thumbnail
    ? { uri: item.thumbnail }
    : require('@/assets/images/icon.png');

  return (
    <TouchableOpacity
      style={styles.wrapper}
      activeOpacity={0.75}
      onPress={onPress}
    >
      <View style={{ width: imageSize, height: imageSize }}>
        <Image
          source={imageSource as any}
          style={[styles.image, { width: imageSize, height: imageSize }]}
          contentFit="cover"
        />
        <View style={styles.badgeContainer}>
          <CategoryBadge count={item.count} imageSize={imageSize} />
        </View>
      </View>

      <View style={styles.body}>
        <ThemedText style={styles.title} numberOfLines={1}>
          {item.name}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
};

export default CategoryItem;

const styles = StyleSheet.create({
  wrapper: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  image: { borderRadius: 8 },
  badgeContainer: { position: 'absolute', top: 4, right: 4 },
  body: { flex: 1, marginLeft: 12 },
  title: { fontSize: 16 },
});
