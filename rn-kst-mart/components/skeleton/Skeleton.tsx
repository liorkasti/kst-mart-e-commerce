import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, View, ViewStyle } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

export type SkeletonProps = {
  style?: StyleProp<ViewStyle>;
  radius?: number;
};

// Simple pulse skeleton block
export const Skeleton: React.FC<SkeletonProps> = ({ style, radius = 8 }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const base = colorScheme === 'dark' ? '#2a2a2a' : '#e6e6e6';
  const highlight = colorScheme === 'dark' ? '#3a3a3a' : '#f0f0f0';
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <View
      style={[
        {
          backgroundColor: base,
          borderRadius: radius,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View style={{ flex: 1, backgroundColor: highlight, opacity }} />
    </View>
  );
};

// Grid placeholder for category cards (2 columns)
export const SkeletonCategoryGrid: React.FC<{ count?: number }> = ({ count = 6 }) => {
  const items = Array.from({ length: count });
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 }}>
      {/* title row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Skeleton style={{ width: 180, height: 24 }} radius={6} />
      </View>
      {/* chips row */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        <Skeleton style={{ width: 64, height: 32 }} radius={16} />
        <Skeleton style={{ width: 88, height: 32 }} radius={16} />
        <Skeleton style={{ width: 72, height: 32 }} radius={16} />
      </View>
      {/* grid */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {items.map((_, i) => (
          <View key={i} style={{ width: '48%', marginBottom: 12 }}>
            <Skeleton style={{ width: '100%', height: 140 }} radius={12} />
          </View>
        ))}
      </View>
    </View>
  );
};

// List item skeleton (e.g., category rows)
export const SkeletonList: React.FC<{ rows?: number }> = ({ rows = 8 }) => {
  const items = Array.from({ length: rows });
  return (
    <View style={{ padding: 16 }}>
      {items.map((_, i) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Skeleton style={{ width: 64, height: 64, marginRight: 12 }} radius={8} />
          <View style={{ flex: 1 }}>
            <Skeleton style={{ width: '70%', height: 16, marginBottom: 8 }} radius={6} />
            <Skeleton style={{ width: '40%', height: 14 }} radius={6} />
          </View>
        </View>
      ))}
    </View>
  );
};
