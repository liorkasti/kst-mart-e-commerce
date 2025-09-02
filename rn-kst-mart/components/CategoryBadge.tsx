import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = { count: number; imageSize: number };

const CategoryBadge: React.FC<Props> = ({ count, imageSize }) => {
  // badge scales with the image size, with sensible minimums
  const size = Math.max(20, Math.round(imageSize * 0.45));
  // make the badge number larger for better readability
  const fontSize = Math.max(14, Math.round(size * 0.7));

  return (
    <View
      style={[
        styles.badge,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text style={[styles.text, { fontSize }]} numberOfLines={1}>
        {count}
      </Text>
    </View>
  );
};

export default CategoryBadge;

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    includeFontPadding: false,
  },
});
